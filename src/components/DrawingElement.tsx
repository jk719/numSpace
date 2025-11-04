import { useMemo } from 'react';
import getStroke from 'perfect-freehand';

interface DrawingElement {
  id: string;
  type: 'drawing';
  points: number[][];
  color: string;
  strokeWidth: number;
}

interface DrawingElementProps {
  element: DrawingElement;
}

const DrawingElement = ({ element }: DrawingElementProps) => {
  // Convert points to smooth stroke path using perfect-freehand
  const pathData = useMemo(() => {
    if (element.points.length < 2) return '';

    const stroke = getStroke(element.points, {
      size: element.strokeWidth * 4,
      thinning: 0.6, // More consistent line width (better for mouse/trackpad)
      smoothing: 0.7, // Higher smoothing for cleaner lines
      streamline: 0.6, // More streamlining reduces jitter
      easing: (t) => t,
      simulatePressure: true,
      last: true, // Improves end caps
    });

    if (!stroke.length) return '';

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ['M', ...stroke[0], 'Q']
    );

    d.push('Z');
    return d.join(' ');
  }, [element.points, element.strokeWidth]);

  return (
    <path
      d={pathData}
      fill={element.color}
      style={{
        pointerEvents: 'none',
      }}
    />
  );
};

export default DrawingElement;
