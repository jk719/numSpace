export interface MathSymbol {
  id: string;
  symbol: string;
  name: string;
  category: 'basic' | 'greek' | 'operators' | 'relations' | 'arrows' | 'misc';
}

export interface MathTemplate {
  id: string;
  name: string;
  type: 'fraction' | 'exponent' | 'sqrt' | 'subscript';
  icon: string;
}

export const mathSymbols: MathSymbol[] = [
  // Basic operators
  { id: 'plus', symbol: '+', name: 'Plus', category: 'basic' },
  { id: 'minus', symbol: '−', name: 'Minus', category: 'basic' },
  { id: 'times', symbol: '×', name: 'Times', category: 'basic' },
  { id: 'divide', symbol: '÷', name: 'Divide', category: 'basic' },
  { id: 'equals', symbol: '=', name: 'Equals', category: 'basic' },

  // Greek letters
  { id: 'pi', symbol: 'π', name: 'Pi', category: 'greek' },
  { id: 'theta', symbol: 'θ', name: 'Theta', category: 'greek' },
  { id: 'alpha', symbol: 'α', name: 'Alpha', category: 'greek' },
  { id: 'beta', symbol: 'β', name: 'Beta', category: 'greek' },
  { id: 'gamma', symbol: 'γ', name: 'Gamma', category: 'greek' },
  { id: 'delta', symbol: 'δ', name: 'Delta', category: 'greek' },
  { id: 'epsilon', symbol: 'ε', name: 'Epsilon', category: 'greek' },
  { id: 'lambda', symbol: 'λ', name: 'Lambda', category: 'greek' },
  { id: 'mu', symbol: 'μ', name: 'Mu', category: 'greek' },
  { id: 'sigma', symbol: 'σ', name: 'Sigma', category: 'greek' },
  { id: 'omega', symbol: 'ω', name: 'Omega', category: 'greek' },

  // Relations
  { id: 'leq', symbol: '≤', name: 'Less than or equal', category: 'relations' },
  { id: 'geq', symbol: '≥', name: 'Greater than or equal', category: 'relations' },
  { id: 'neq', symbol: '≠', name: 'Not equal', category: 'relations' },
  { id: 'approx', symbol: '≈', name: 'Approximately', category: 'relations' },
  { id: 'equiv', symbol: '≡', name: 'Equivalent', category: 'relations' },
  { id: 'prop', symbol: '∝', name: 'Proportional', category: 'relations' },

  // Operators
  { id: 'pm', symbol: '±', name: 'Plus minus', category: 'operators' },
  { id: 'mp', symbol: '∓', name: 'Minus plus', category: 'operators' },
  { id: 'cdot', symbol: '·', name: 'Dot', category: 'operators' },
  { id: 'sum', symbol: '∑', name: 'Sum', category: 'operators' },
  { id: 'prod', symbol: '∏', name: 'Product', category: 'operators' },
  { id: 'integral', symbol: '∫', name: 'Integral', category: 'operators' },

  // Arrows
  { id: 'rightarrow', symbol: '→', name: 'Right arrow', category: 'arrows' },
  { id: 'leftarrow', symbol: '←', name: 'Left arrow', category: 'arrows' },
  { id: 'leftrightarrow', symbol: '↔', name: 'Left right arrow', category: 'arrows' },
  { id: 'uparrow', symbol: '↑', name: 'Up arrow', category: 'arrows' },
  { id: 'downarrow', symbol: '↓', name: 'Down arrow', category: 'arrows' },

  // Miscellaneous
  { id: 'infinity', symbol: '∞', name: 'Infinity', category: 'misc' },
  { id: 'partial', symbol: '∂', name: 'Partial derivative', category: 'misc' },
  { id: 'nabla', symbol: '∇', name: 'Nabla', category: 'misc' },
  { id: 'angle', symbol: '∠', name: 'Angle', category: 'misc' },
  { id: 'degree', symbol: '°', name: 'Degree', category: 'misc' },
  { id: 'prime', symbol: '′', name: 'Prime', category: 'misc' },
  { id: 'percent', symbol: '%', name: 'Percent', category: 'misc' },
  { id: 'sqrt', symbol: '√', name: 'Square root', category: 'misc' },
  { id: 'element', symbol: '∈', name: 'Element of', category: 'misc' },
  { id: 'subset', symbol: '⊂', name: 'Subset', category: 'misc' },
  { id: 'union', symbol: '∪', name: 'Union', category: 'misc' },
  { id: 'intersection', symbol: '∩', name: 'Intersection', category: 'misc' },
];

export const mathTemplates: MathTemplate[] = [
  { id: 'fraction', name: 'Fraction', type: 'fraction', icon: '⁄' },
  { id: 'exponent', name: 'Exponent', type: 'exponent', icon: 'x²' },
  { id: 'sqrt', name: 'Square Root', type: 'sqrt', icon: '√' },
  { id: 'subscript', name: 'Subscript', type: 'subscript', icon: 'x₁' },
];
