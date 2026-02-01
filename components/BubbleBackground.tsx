import React, { useRef, useEffect, useState, memo } from 'react';

interface BubbleBackgroundProps {
  isDarkMode: boolean;
  isSurprise?: boolean;
  // Beta-only props - only pass when in beta mode
  customBubbleColor?: string;
  isPaused?: boolean;
}

interface BubbleData {
  id: number;
  size: number;
  right: number;
  top: number;
  duration: number;
  delay: number;
  colorIndex: number;
}

// Memoized bubble component to prevent re-renders
const Bubble = memo<{
  bubble: BubbleData;
  isDarkMode: boolean;
  customColor?: string;
  isPaused?: boolean;
}>(({ bubble, isDarkMode, customColor, isPaused }) => {
  const darkColors = ['rgba(30,41,59,0.6)', 'rgba(51,65,85,0.6)', 'rgba(56,189,248,0.1)'];
  const lightColors = ['rgba(224,242,254,0.6)', 'rgba(186,230,253,0.6)'];
  const defaultColors = isDarkMode ? darkColors : lightColors;
  
  const useCustom = customColor && customColor !== '#3b82f6';
  const bgColor = useCustom ? customColor : defaultColors[bubble.colorIndex % defaultColors.length];
  const opacity = useCustom ? (isDarkMode ? 0.25 : 0.5) : undefined;
  
  return (
    <div
      className="absolute rounded-full animate-bubble"
      style={{
        width: bubble.size,
        height: bubble.size,
        right: `${bubble.right}%`,
        top: `${bubble.top}%`,
        animationDuration: `${bubble.duration}s`,
        animationDelay: `${bubble.delay}s`,
        backgroundColor: bgColor,
        opacity,
        willChange: 'transform',
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
    />
  );
});

const BubbleBackground: React.FC<BubbleBackgroundProps> = memo(({ isDarkMode, isSurprise, customBubbleColor, isPaused }) => {
  const bubblesData = useRef<BubbleData[]>([]);
  const [key, setKey] = useState(0);

  // Generate bubbles only on mount or when layout props change
  useEffect(() => {
    const bubbleCount = isSurprise ? 60 : 35; // Reduced count for performance
    
    bubblesData.current = Array.from({ length: bubbleCount }).map((_, i) => {
      const size = Math.floor(Math.random() * 90 + 150);
      const slot = i % 8;
      const baseRight = (slot * 15) - 10;
      const right = baseRight + Math.random() * 20;
      const top = Math.floor(Math.random() * 200 - 200);
      const durationBase = isSurprise ? 2 : 5;
      const duration = Math.random() * 3 + durationBase;
      const delay = Math.random() * -20;

      return { id: i, size, right, top, duration, delay, colorIndex: i };
    });
    setKey(k => k + 1);
  }, [isDarkMode, isSurprise]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubblesData.current.map((bubble) => (
        <Bubble
          key={`${key}-${bubble.id}`}
          bubble={bubble}
          isDarkMode={isDarkMode}
          customColor={customBubbleColor}
          isPaused={isPaused}
        />
      ))}
    </div>
  );
});

export default BubbleBackground;
