
import React, { useRef, useEffect, useState, memo, useMemo } from 'react';

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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  const int = Number.parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

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
  
  // Precompute equivalent variation directly in color to avoid per-frame filter compositing cost
  const brightnessMultipliers = [0.85, 1, 1.1, 1.2];
  const rgb = useMemo(() => (useCustom ? hexToRgb(baseColor) : null), [useCustom, baseColor]);
  const brightnessMultiplier = brightnessMultipliers[bubble.opacityLevel % 4];
  const backgroundColor = rgb
    ? `rgb(${clamp(Math.round(rgb.r * brightnessMultiplier), 0, 255)}, ${clamp(Math.round(rgb.g * brightnessMultiplier), 0, 255)}, ${clamp(Math.round(rgb.b * brightnessMultiplier), 0, 255)})`
    : baseColor;
  
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
        backgroundColor,
        opacity,
        willChange: 'transform',
        animationPlayState: isPaused ? 'paused' : 'running',
        contain: 'paint',
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
