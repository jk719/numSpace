import { create } from 'zustand';

export interface DrawingElement {
  type: 'drawing';
  id: string;
  points: number[][];
  color: string;
  strokeWidth: number;
}

interface WhiteboardState {
  elements: DrawingElement[];
  selectedElementId: string | null;
  drawingColor: string;
  strokeWidth: number;
  history: DrawingElement[][];
  currentHistoryIndex: number;
  addElement: (element: Omit<DrawingElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DrawingElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setDrawingColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const saveToHistory = (state: WhiteboardState, newElements: DrawingElement[]) => {
  // Remove any future states if we're not at the end
  const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);

  // Add new state to history (limit to 50 states for performance)
  newHistory.push(newElements);
  if (newHistory.length > 50) {
    newHistory.shift();
  }

  return {
    history: newHistory,
    currentHistoryIndex: newHistory.length - 1,
    elements: newElements,
  };
};

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  drawingColor: '#000000',
  strokeWidth: 2,
  history: [[]],
  currentHistoryIndex: 0,

  addElement: (element) =>
    set((state) => {
      const newElements = [
        ...state.elements,
        { ...element, id: crypto.randomUUID() },
      ];
      return saveToHistory(state, newElements);
    }),

  updateElement: (id, updates) =>
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return saveToHistory(state, newElements);
    }),

  deleteElement: (id) =>
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      return {
        ...saveToHistory(state, newElements),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      };
    }),

  setSelectedElement: (id) =>
    set({ selectedElementId: id }),

  setDrawingColor: (color) =>
    set({ drawingColor: color }),

  setStrokeWidth: (width) =>
    set({ strokeWidth: width }),

  undo: () =>
    set((state) => {
      if (state.currentHistoryIndex > 0) {
        const newIndex = state.currentHistoryIndex - 1;
        return {
          currentHistoryIndex: newIndex,
          elements: state.history[newIndex],
          selectedElementId: null,
        };
      }
      return state;
    }),

  redo: () =>
    set((state) => {
      if (state.currentHistoryIndex < state.history.length - 1) {
        const newIndex = state.currentHistoryIndex + 1;
        return {
          currentHistoryIndex: newIndex,
          elements: state.history[newIndex],
          selectedElementId: null,
        };
      }
      return state;
    }),

  canUndo: () => {
    const state = get();
    return state.currentHistoryIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.currentHistoryIndex < state.history.length - 1;
  },
}));
