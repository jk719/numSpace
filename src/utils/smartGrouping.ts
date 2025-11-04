interface TextElement {
  type: 'text';
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}

const PROXIMITY_THRESHOLD = 60; // pixels
const ALIGNMENT_TOLERANCE = 40; // pixels for horizontal/vertical alignment

export interface GroupSuggestion {
  alignTo: 'horizontal' | 'vertical' | null;
  targetY?: number;
  targetX?: number;
  nearbyElement?: TextElement;
}

/**
 * Finds nearby elements and suggests alignment
 */
export const findNearbyElements = (
  currentElement: TextElement,
  allElements: TextElement[]
): GroupSuggestion => {
  const others = allElements.filter((el) => el.id !== currentElement.id);

  let closestElement: TextElement | null = null;
  let minDistance = Infinity;

  // Find the closest element
  for (const other of others) {
    const dx = Math.abs(other.x - currentElement.x);
    const dy = Math.abs(other.y - currentElement.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance && distance < PROXIMITY_THRESHOLD) {
      minDistance = distance;
      closestElement = other;
    }
  }

  if (!closestElement) {
    return { alignTo: null };
  }

  const dx = Math.abs(closestElement.x - currentElement.x);
  const dy = Math.abs(closestElement.y - currentElement.y);

  // Check for horizontal alignment (same Y, different X)
  if (dy < ALIGNMENT_TOLERANCE) {
    return {
      alignTo: 'horizontal',
      targetY: closestElement.y,
      nearbyElement: closestElement,
    };
  }

  // Check for vertical alignment (same X, different Y)
  if (dx < ALIGNMENT_TOLERANCE) {
    return {
      alignTo: 'vertical',
      targetX: closestElement.x,
      nearbyElement: closestElement,
    };
  }

  return { alignTo: null, nearbyElement: closestElement };
};

/**
 * Suggests position adjustments for smart grouping
 */
export const suggestAlignment = (
  element: TextElement,
  allElements: TextElement[]
): { x: number; y: number } | null => {
  const suggestion = findNearbyElements(element, allElements);

  if (suggestion.alignTo === 'horizontal' && suggestion.targetY !== undefined) {
    return { x: element.x, y: suggestion.targetY };
  }

  if (suggestion.alignTo === 'vertical' && suggestion.targetX !== undefined) {
    return { x: suggestion.targetX, y: element.y };
  }

  return null;
};
