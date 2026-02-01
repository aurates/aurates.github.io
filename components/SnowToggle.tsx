
import React from 'react';

interface SnowToggleProps {
  isSnowing: boolean;
  toggle: () => void;
}

const SnowToggle: React.FC<SnowToggleProps> = ({ isSnowing, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full glass-liquid transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
      aria-label="Toggle snow effect"
    >
      <div className={`w-8 h-8 flex items-center justify-center transition-all duration-500 ${isSnowing ? 'animate-spin-slow' : ''}`}>
        <svg 
          viewBox="0 0 24 24" 
          className={`w-7 h-7 ${isSnowing ? 'fill-blue-200' : 'fill-slate-500 group-hover:fill-slate-300'}`} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 3h-2v4.06l-3.53-2.03-1 1.73 3.53 2.04L6.47 11H3v2h3.47l3.53 2.04-3.53 2.04 1 1.73 3.53-2.03V21h2v-4.06l3.53 2.03 1-1.73-3.53-2.04L17.53 13H21v-2h-3.47l-3.53-2.04 3.53-2.04-1-1.73-3.53 2.03V3z"/>
        </svg>
      </div>
    </button>
  );
};

export default SnowToggle;
