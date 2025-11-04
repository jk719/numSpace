import { useRef, useState, useCallback, useEffect } from 'react';
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
  const { elements, addElement, drawingColor, strokeWidth, undo, redo } = useWhiteboardStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number[][]>([]);

  // Smooth out points for better trackpad/mouse experience
  const smoothPoints = useCallback((points: number[][]) => {
    if (points.length < 3) return points;

    const smoothed: number[][] = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      // Average with neighbors for smoothing
      const smoothedX = (prev[0] + curr[0] + next[0]) / 3;
      const smoothedY = (prev[1] + curr[1] + next[1]) / 3;

      smoothed.push([smoothedX, smoothedY]);
    }

    smoothed.push(points[points.length - 1]);
    return smoothed;
  }, []);

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
          setCurrentPoints((prev) => {
            // Skip points that are too close to reduce jitter (especially for trackpad)
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const distance = Math.sqrt(
                Math.pow(point[0] - lastPoint[0], 2) + Math.pow(point[1] - lastPoint[1], 2)
              );
              // Minimum distance threshold - helps with trackpad precision
              if (distance < 2) return prev;
            }
            return [...prev, point];
          });
        }
      }
    },
    [isDrawing, getPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing && currentPoints.length > 1) {
      // Apply smoothing before saving
      const smoothed = smoothPoints(currentPoints);
      addElement({
        type: 'drawing',
        points: smoothed,
        color: drawingColor,
        strokeWidth,
      });
      setCurrentPoints([]);
    }
    setIsDrawing(false);
  }, [isDrawing, currentPoints, addElement, drawingColor, strokeWidth, smoothPoints]);

  const copyRoomLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    navigator.clipboard.writeText(url.toString());
    alert('Room link copied to clipboard!');
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.shiftKey && e.key === 'z') {
        // Cmd/Ctrl + Shift + Z = Redo
        e.preventDefault();
        redo();
      } else if (isCmdOrCtrl && e.key === 'z') {
        // Cmd/Ctrl + Z = Undo
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

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
