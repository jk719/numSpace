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
  addElement: (element: Omit<DrawingElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DrawingElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setDrawingColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  elements: [],
  selectedElementId: null,
  drawingColor: '#000000',
  strokeWidth: 2,

  addElement: (element) =>
    set((state) => ({
      elements: [
        ...state.elements,
        { ...element, id: crypto.randomUUID() },
      ],
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })),

  setSelectedElement: (id) =>
    set({ selectedElementId: id }),

  setDrawingColor: (color) =>
    set({ drawingColor: color }),

  setStrokeWidth: (width) =>
    set({ strokeWidth: width }),
}));
