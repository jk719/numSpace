import { useWhiteboardStore } from '../store/whiteboardStore';
import './ModeToggle.css';

const ModeToggle = () => {
  const { drawingColor, setDrawingColor, strokeWidth, setStrokeWidth } = useWhiteboardStore();

  const colors = ['#000000', '#FF0000', '#0000FF', '#00AA00', '#FF6B00', '#9B51E0'];
  const strokeWidths = [1, 2, 4, 6];

  return (
    <div className="mode-toggle">
      <div className="drawing-controls">
        {/* Color Picker */}
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-btn ${drawingColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setDrawingColor(color)}
              aria-label={`Select ${color}`}
            />
          ))}
        </div>

        {/* Stroke Width */}
        <div className="stroke-width-picker">
          {strokeWidths.map((width) => (
            <button
              key={width}
              className={`stroke-btn ${strokeWidth === width ? 'active' : ''}`}
              onClick={() => setStrokeWidth(width)}
              aria-label={`Stroke width ${width}`}
            >
              <div
                className="stroke-preview"
                style={{
                  width: `${width * 2 + 8}px`,
                  height: `${width * 2 + 8}px`,
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeToggle;
