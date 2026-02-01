
import React from 'react';

interface LiquidGlassToggleProps {
  isDarkMode: boolean;
  toggle: () => void;
}

const LiquidGlassToggle: React.FC<LiquidGlassToggleProps> = ({ isDarkMode, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="fixed bottom-8 left-8 z-50 p-4 rounded-3xl glass-liquid transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      <div className={`w-8 h-8 transition-all duration-500 transform ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
        {isDarkMode ? (
          <svg className="fill-blue-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
          </svg>
        ) : (
          <svg className="fill-orange-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 13h2a1 1 0 1 0 0-2H2a1 1 0 1 0 0 2zm18 0h2a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2zM11 2v2a1 1 0 1 0 2 0V2a1 1 0 1 0-2 0zm0 18v2a1 1 0 1 0 2 0v-2a1 1 0 1 0-2 0zM5.99 4.58a1 1 0 1 0-1.41 1.41l1.06 1.06a1 1 0 1 0 1.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 1 0-1.41 1.41l1.06 1.06a1 1 0 1 0 1.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 1 0-1.41-1.41l-1.06 1.06a1 1 0 1 0 1.41 1.41l1.06-1.06z"/>
          </svg>
        )}
      </div>
    </button>
  );
};

export default LiquidGlassToggle;
