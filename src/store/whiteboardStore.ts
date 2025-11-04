import { create } from 'zustand';

export interface TextElement {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

interface WhiteboardState {
  elements: TextElement[];
  selectedElementId: string | null;
  pendingSymbol: string | null;
  addElement: (element: Omit<TextElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<TextElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setPendingSymbol: (symbol: string | null) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  elements: [],
  selectedElementId: null,
  pendingSymbol: null,

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

  setPendingSymbol: (symbol) =>
    set({ pendingSymbol: symbol }),
}));
