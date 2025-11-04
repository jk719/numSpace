import { useWhiteboardStore } from '../store/whiteboardStore';
import './ModeToggle.css';

const ModeToggle = () => {
  const { drawingMode, setDrawingMode, drawingColor, setDrawingColor, strokeWidth, setStrokeWidth } =
    useWhiteboardStore();

  const colors = ['#000000', '#FF0000', '#0000FF', '#00AA00', '#FF6B00', '#9B51E0'];
  const strokeWidths = [1, 2, 4, 6];

  return (
    <div className="mode-toggle">
      {/* Mode Switch */}
      <div className="mode-switch">
        <button
          className={`mode-btn ${drawingMode === 'text' ? 'active' : ''}`}
          onClick={() => setDrawingMode('text')}
          aria-label="Text mode"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
        </button>
        <button
          className={`mode-btn ${drawingMode === 'draw' ? 'active' : ''}`}
          onClick={() => setDrawingMode('draw')}
          aria-label="Draw mode"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
          </svg>
        </button>
      </div>

      {/* Drawing Controls - Only show in draw mode */}
      {drawingMode === 'draw' && (
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
      )}
    </div>
  );
};

export default ModeToggle;
