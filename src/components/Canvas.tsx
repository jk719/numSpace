import { useRef } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import TextBlock from './TextBlock';
import './Canvas.css';

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { elements, addElement } = useWhiteboardStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create new text if clicking directly on canvas (not on existing elements)
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addElement({
        x,
        y,
        content: '',
        fontSize: 24,
        color: '#000000',
      });
    }
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <TextBlock key={element.id} element={element} />
      ))}
    </div>
  );
};

export default Canvas;
