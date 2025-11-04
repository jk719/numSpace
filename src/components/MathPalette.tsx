import { useState } from 'react';
import { mathSymbols, mathTemplates } from '../data/mathSymbols';
import { useWhiteboardStore } from '../store/whiteboardStore';
import './MathPalette.css';

const MathPalette = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const { setPendingSymbol } = useWhiteboardStore();

  const categories = ['basic', 'greek', 'operators', 'relations', 'arrows', 'misc'];

  const filteredSymbols = mathSymbols.filter(
    (symbol) => symbol.category === activeCategory
  );

  const handleSymbolClick = (symbol: string) => {
    setPendingSymbol(symbol);
  };

  return (
    <div className={`math-palette ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="palette-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '×' : 'Σ'}
      </button>

      {isExpanded && (
        <div className="palette-content">
          <div className="palette-header">
            <h3>Math Symbols</h3>
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="symbols-grid">
            {filteredSymbols.map((symbol) => (
              <button
                key={symbol.id}
                className="symbol-button"
                onClick={() => handleSymbolClick(symbol.symbol)}
                title={symbol.name}
              >
                {symbol.symbol}
              </button>
            ))}
          </div>

          <div className="templates-section">
            <h4>Templates</h4>
            <div className="templates-grid">
              {mathTemplates.map((template) => (
                <button
                  key={template.id}
                  className="template-button"
                  onClick={() => handleSymbolClick(template.icon)}
                  title={template.name}
                >
                  {template.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathPalette;
