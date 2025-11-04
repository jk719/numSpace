import { useRef, useState, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { snapPointToGrid } from '../utils/gridSnap';
import TextBlock from './TextBlock';
import DrawingElement from './DrawingElement';
import MathPalette from './MathPalette';
import Toolbar from './Toolbar';
import ModeToggle from './ModeToggle';
import './Canvas.css';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { elements, addElement, pendingSymbol, setPendingSymbol, drawingMode, drawingColor, strokeWidth } =
    useWhiteboardStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[][]>([]);

  const getPoint = useCallback((e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return [x - rect.left, y - rect.top];
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (drawingMode === 'draw') {
        e.preventDefault();
        const point = getPoint(e);
        if (point) {
          setIsDrawing(true);
          setCurrentPoints([point]);
        }
      }
    },
    [drawingMode, getPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDrawing && drawingMode === 'draw') {
        e.preventDefault();
        const point = getPoint(e);
        if (point) {
          setCurrentPoints((prev) => [...prev, point]);
        }
      }
    },
    [isDrawing, drawingMode, getPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing && currentPoints.length > 1) {
      addElement({
        type: 'drawing',
        points: currentPoints,
        color: drawingColor,
        strokeWidth,
      });
      setCurrentPoints([]);
    }
    setIsDrawing(false);
  }, [isDrawing, currentPoints, addElement, drawingColor, strokeWidth]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create text in text mode
    if (drawingMode !== 'text') return;

    // Only create new text if clicking directly on canvas (not on existing elements)
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Snap to grid
      const { x, y } = snapPointToGrid(rawX, rawY);

      // If there's a pending symbol, place it. Otherwise, create empty text
      addElement({
        type: 'text',
        x,
        y,
        content: pendingSymbol || '',
        fontSize: 24,
        color: '#000000',
      });

      // Clear pending symbol after placement
      if (pendingSymbol) {
        setPendingSymbol(null);
      }
    }
  };

  const copyRoomLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    navigator.clipboard.writeText(url.toString());
    alert('Room link copied to clipboard!');
  };

  return (
    <>
      <div className="room-info">
        <span>Room: <strong>{roomId}</strong></span>
        <button onClick={copyRoomLink} className="copy-link-btn">
          Copy Link
        </button>
      </div>
      <Toolbar />
      <ModeToggle />
      <div
        ref={canvasRef}
        className={`canvas ${pendingSymbol ? 'placing-symbol' : ''} ${drawingMode === 'draw' ? 'draw-mode' : ''}`}
        onClick={handleCanvasClick}
      >
        {/* SVG layer for drawings */}
        <svg
          ref={svgRef}
          className="drawing-layer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
            pointerEvents: drawingMode === 'draw' ? 'all' : 'none',
          }}
        >
          {/* Render all drawing elements */}
          {elements.map((element) =>
            element.type === 'drawing' ? <DrawingElement key={element.id} element={element} /> : null
          )}
          {/* Current drawing in progress */}
          {isDrawing && currentPoints.length > 1 && (
            <DrawingElement
              element={{
                id: 'temp',
                type: 'drawing',
                points: currentPoints,
                color: drawingColor,
                strokeWidth,
              }}
            />
          )}
        </svg>

        {/* Text elements */}
        {elements.map((element) =>
          element.type === 'text' ? <TextBlock key={element.id} element={element} /> : null
        )}
      </div>
      {drawingMode === 'text' && <MathPalette />}
    </>
  );
};

export default Canvas;
