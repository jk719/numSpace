import { useRef } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { snapPointToGrid } from '../utils/gridSnap';
import TextBlock from './TextBlock';
import MathPalette from './MathPalette';
import './Canvas.css';

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, pendingSymbol, setPendingSymbol } = useWhiteboardStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create new text if clicking directly on canvas (not on existing elements)
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Snap to grid
      const { x, y } = snapPointToGrid(rawX, rawY);

      // If there's a pending symbol, place it. Otherwise, create empty text
      addElement({
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
      <div
        ref={canvasRef}
        className={`canvas ${pendingSymbol ? 'placing-symbol' : ''}`}
        onClick={handleCanvasClick}
      >
        {elements.map((element) => (
          <TextBlock key={element.id} element={element} />
        ))}
      </div>
      <MathPalette />
    </>
  );
};

export default Canvas;
