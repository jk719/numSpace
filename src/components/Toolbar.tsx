import { useState } from 'react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import './Toolbar.css';

const Toolbar = () => {
  const { elements, undo, redo, canUndo, canRedo } = useWhiteboardStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClearAll = () => {
    // UX Best Practice: Show confirmation dialog for destructive actions
    setShowConfirmDialog(true);
  };

  const confirmClear = () => {
    useWhiteboardStore.setState({ elements: [] });
    setShowConfirmDialog(false);
  };

  const cancelClear = () => {
    setShowConfirmDialog(false);
  };

  const elementCount = elements.length;

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            className="toolbar-btn icon-btn"
            onClick={undo}
            disabled={!canUndo()}
            aria-label="Undo (Cmd/Ctrl+Z)"
            title="Undo (Cmd/Ctrl+Z)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
          </button>
          <button
            className="toolbar-btn icon-btn"
            onClick={redo}
            disabled={!canRedo()}
            aria-label="Redo (Cmd/Ctrl+Shift+Z)"
            title="Redo (Cmd/Ctrl+Shift+Z)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
            </svg>
          </button>
        </div>
        <button
          className="toolbar-btn clear-btn"
          onClick={handleClearAll}
          disabled={elementCount === 0}
          aria-label="Clear all elements"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          <span>Clear All</span>
        </button>
        {elementCount > 0 && (
          <span className="element-count">{elementCount} element{elementCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Confirmation Dialog - UX Best Practice: Modal for destructive actions */}
      {showConfirmDialog && (
        <div className="dialog-overlay" onClick={cancelClear}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <h3>Clear All Elements?</h3>
            <p>This will remove all {elementCount} element{elementCount !== 1 ? 's' : ''} from the whiteboard. This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn-secondary" onClick={cancelClear}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmClear}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
