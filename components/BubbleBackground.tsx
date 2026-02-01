
import React, { useMemo } from 'react';

interface BubbleBackgroundProps {
  isDarkMode: boolean;
  isSurprise?: boolean;
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ isDarkMode, isSurprise }) => {
  const bubbles = useMemo(() => {
    const bubbleCount = isSurprise ? 60 : 45; 
    const colors = isDarkMode 
      ? ['bg-[#1e293b]', 'bg-[#334155]', 'bg-[#38bdf8]/10'] 
      : ['bg-[#E0F2FE]', 'bg-[#BAE6FD]'];
    
    return Array.from({ length: bubbleCount }).map((_, i) => {
      const size = Math.floor(Math.random() * (240 - 150) + 150);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const slot = i % 8;
      const baseRight = (slot * 15) - 10; 
      const jitter = Math.random() * 20;
      const right = baseRight + jitter;
      
      const top = Math.floor(Math.random() * 200 - 200); 
      
      const durationBase = isSurprise ? 2 : 5;
      const duration = (Math.random() * 3 + durationBase).toFixed(2);
      const delay = (Math.random() * -20).toFixed(2); 
      
      return (
        <div
          key={i}
          className={`absolute rounded-full opacity-60 animate-bubble ${color} transition-colors duration-700`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            right: `${right}%`,
            top: `${top}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });
  }, [isDarkMode, isSurprise]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles}
    </div>
  );
};

export default BubbleBackground;
