import { create } from 'zustand';

export interface TextElement {
  type: 'text';
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

export interface DrawingElement {
  type: 'drawing';
  id: string;
  points: number[][];
  color: string;
  strokeWidth: number;
}

export type WhiteboardElement = TextElement | DrawingElement;

type DrawingMode = 'text' | 'draw';

interface WhiteboardState {
  elements: WhiteboardElement[];
  selectedElementId: string | null;
  pendingSymbol: string | null;
  drawingMode: DrawingMode;
  drawingColor: string;
  strokeWidth: number;
  addElement: (element: Omit<WhiteboardElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setPendingSymbol: (symbol: string | null) => void;
  setDrawingMode: (mode: DrawingMode) => void;
  setDrawingColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  elements: [],
  selectedElementId: null,
  pendingSymbol: null,
  drawingMode: 'text',
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

  setPendingSymbol: (symbol) =>
    set({ pendingSymbol: symbol }),

  setDrawingMode: (mode) =>
    set({ drawingMode: mode, pendingSymbol: null }),

  setDrawingColor: (color) =>
    set({ drawingColor: color }),

  setStrokeWidth: (width) =>
    set({ strokeWidth: width }),
}));
