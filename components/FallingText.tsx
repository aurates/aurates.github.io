import React, { useState, useEffect, memo } from 'react';
import { useBeta } from '../context/BetaContext';

interface FallingTextProps {
  isDarkMode: boolean;
  onComplete: () => void;
}

const FallingText: React.FC<FallingTextProps> = memo(({ isDarkMode, onComplete }) => {
  const { isBeta, settings } = useBeta();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile('ontouchstart' in window || window.innerWidth < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const message = isMobile 
    ? "Quickly touch the screen three times for a surprise! :D" 
    : "Quickly press the space bar three times for a surprise! :D";

  const getStyles = (): React.CSSProperties => {
    if (!isBeta) return {};
    
    switch (settings.fallingTextStyle) {
      case 'matrix':
        return {
          fontFamily: "'Courier New', monospace",
          color: '#00ff41',
          textShadow: '0 0 5px #00ff41',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        };
      case 'cyber':
        return {
          fontFamily: "Arial, sans-serif",
          color: '#0ff',
          textShadow: '0 0 5px #0ff, 0 0 10px #f0f',
          letterSpacing: '2px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        };
      case 'outrun':
        return {
          fontFamily: "Impact, sans-serif",
          background: 'linear-gradient(to bottom, #ff00de, #00eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontStyle: 'italic',
          letterSpacing: '1px'
        };
      default:
        if (settings.holographicColor !== '#ffffff') {
           return {
             color: settings.holographicColor,
             textShadow: `0 0 10px ${settings.holographicColor}`
           };
        }
        return {};
    }
  };

  const baseClass = "fixed top-[30%] -translate-y-1/2 left-0 pointer-events-none z-50 whitespace-nowrap text-2xl md:text-4xl font-bold animate-text-fall";
  const colorClass = isBeta && settings.fallingTextStyle !== 'default' 
    ? '' 
    : (isDarkMode ? 'text-white/20' : 'text-black/20');

  return (
    <div className={`${baseClass} ${colorClass}`} style={getStyles()} onAnimationEnd={onComplete}>
      {message}
    </div>
  );
});
export default FallingText;
