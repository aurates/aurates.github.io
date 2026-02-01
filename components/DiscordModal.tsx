
import React from 'react';

interface DiscordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const DiscordModal: React.FC<DiscordModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none`}
    >
      {/* 
          Backdrop Logic Fixed:
          By transitioning 'backdrop-filter' and 'background-color' explicitly via inline styles,
          we ensure the blur effect grows/shrinks smoothly rather than popping in instantly.
      */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
        style={{
          backgroundColor: isOpen 
            ? (isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)') 
            : 'rgba(0, 0, 0, 0)',
          backdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(6px)' : 'blur(0px)',
        }}
        onClick={onClose}
      />
      
      {/* 
          Modal Box:
          Synchronized duration and easing with the backdrop for a unified 'liquid' animation.
      */}
      <div 
        className={`relative z-10 p-10 md:p-14 rounded-[3rem] glass-liquid transition-all duration-500 ease-in-out transform ${
          isOpen 
            ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto' 
            : 'scale-90 translate-y-12 opacity-0'
        } ${
          isDarkMode ? 'text-white border-white/10' : 'text-slate-900 border-white/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight select-all cursor-pointer hover:opacity-80 transition-opacity">
            @owodylan
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DiscordModal;
