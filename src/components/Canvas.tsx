import { useRef, useState, useCallback } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import DrawingElement from './DrawingElement';
import Toolbar from './Toolbar';
import ModeToggle from './ModeToggle';
import './Canvas.css';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { elements, addElement, drawingColor, strokeWidth } = useWhiteboardStore();
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
      e.preventDefault();
      const point = getPoint(e);
      if (point) {
        setIsDrawing(true);
        setCurrentPoints([point]);
      }
    },
    [getPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDrawing) {
        e.preventDefault();
        const point = getPoint(e);
        if (point) {
          setCurrentPoints((prev) => [...prev, point]);
        }
      }
    },
    [isDrawing, getPoint]
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
      <div ref={canvasRef} className="canvas draw-mode">
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
          }}
        >
          {/* Render all drawing elements */}
          {elements.map((element) => (
            <DrawingElement key={element.id} element={element} />
          ))}
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
      </div>
    </>
  );
};

export default Canvas;
