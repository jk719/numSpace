import { useRef, useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useWhiteboardStore } from '../store/whiteboardStore';
import { snapPointToGrid } from '../utils/gridSnap';
import { suggestAlignment } from '../utils/smartGrouping';
import './TextBlock.css';

interface TextElement {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

interface TextBlockProps {
  element: TextElement;
}

const TextBlock = ({ element }: TextBlockProps) => {
  const { updateElement, setSelectedElement, selectedElementId, elements, deleteElement } = useWhiteboardStore();
  const [isEditing, setIsEditing] = useState(element.content === '');
  const inputRef = useRef<HTMLInputElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedElementId === element.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const bind = useDrag(
    ({ offset: [x, y], tap, last }) => {
      if (tap) {
        // Single tap - select and edit
        setSelectedElement(element.id);
        setIsEditing(true);
      } else {
        // Dragging - update position
        if (last) {
          // First, snap to grid
          const snapped = snapPointToGrid(x, y);

          // Then, check for smart alignment with nearby elements
          const tempElement = { ...element, x: snapped.x, y: snapped.y };
          const alignment = suggestAlignment(tempElement, elements);

          if (alignment) {
            updateElement(element.id, { x: alignment.x, y: alignment.y });
          } else {
            updateElement(element.id, { x: snapped.x, y: snapped.y });
          }
        } else {
          // Free movement while dragging
          updateElement(element.id, { x, y });
        }
      }
    },
    {
      from: () => [element.x, element.y],
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  const handleBlur = () => {
    setIsEditing(false);
    if (element.content === '') {
      // If empty, keep it editable or could delete it
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement(element.id, { content: e.target.value });
  };

  return (
    <div
      ref={blockRef}
      {...bind()}
      className={`text-block ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {isSelected && (
        <button
          className="delete-btn"
          onClick={handleDelete}
          onTouchEnd={handleDelete}
        >
          ×
        </button>
      )}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={element.content}
          onChange={handleChange}
          onBlur={handleBlur}
          className="text-input"
          style={{
            fontSize: `${element.fontSize}px`,
            color: element.color,
          }}
          placeholder="Type here..."
        />
      ) : (
        <span>{element.content || 'Tap to edit'}</span>
      )}
    </div>
  );
};

export default TextBlock;
