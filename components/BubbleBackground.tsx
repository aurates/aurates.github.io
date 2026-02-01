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
  opacityLevel: number;
}

// Memoized bubble component to prevent re-renders
const Bubble = memo<{
  bubble: BubbleData;
  isDarkMode: boolean;
  customColor?: string;
  isPaused?: boolean;
}>(({ bubble, isDarkMode, customColor, isPaused }) => {
  // Base colors without alpha
  const darkColors = ['#1e293b', '#334155', '#38bdf8'];
  const lightColors = ['#e0f2fe', '#bae6fd', '#7dd3fc'];
  const defaultBaseColors = isDarkMode ? darkColors : lightColors;
  
  const useCustom = customColor && customColor !== '#3b82f6';
  const baseColor = useCustom ? customColor : defaultBaseColors[bubble.colorIndex % defaultBaseColors.length];
  
  // Use 4 levels of opacity variation as requested
  // Values tailored for visibility on both themes
  const opacityLevels = isDarkMode 
    ? [0.05, 0.12, 0.2, 0.35] 
    : [0.1, 0.25, 0.4, 0.6];
  
  const opacity = opacityLevels[bubble.opacityLevel % 4];
  
  // Add subtle color variation for custom colors using filters
  const filter = useCustom 
    ? `hue-rotate(${(bubble.opacityLevel - 2) * 8}deg) brightness(${1 + (bubble.opacityLevel - 1) * 0.15}) contrast(1.1)`
    : 'none';
  
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
        backgroundColor: baseColor,
        opacity,
        filter,
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
      const opacityLevel = Math.floor(Math.random() * 4);

      return { id: i, size, right, top, duration, delay, colorIndex: i, opacityLevel };
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
