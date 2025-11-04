export const GRID_SIZE = 20;

export const snapToGrid = (value: number, gridSize: number = GRID_SIZE): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const snapPointToGrid = (x: number, y: number, gridSize: number = GRID_SIZE) => {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
};
