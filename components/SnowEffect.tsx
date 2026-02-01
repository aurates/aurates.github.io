import React, { useEffect, useRef, memo } from 'react';
import { useBeta } from '../context/BetaContext';

// Memoized to prevent unnecessary re-renders
const SnowEffect: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isBeta, settings } = useBeta();
  const animationRef = useRef<number>(0);
  const snowflakesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Reactive settings
    const density = isBeta ? Math.min(settings.snowDensity, 500) : 80; // Increased for more snow
    const speedMult = isBeta ? settings.snowSpeed : 1;

    const createSnowflake = (initial = false) => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : Math.random() * -50,
      radius: Math.random() * 2.5 + 0.5,
      speed: (Math.random() * 0.8 + 0.3) * speedMult,
      wind: Math.random() * 0.3 - 0.15,
      opacity: Math.random() * 0.4 + 0.2,
    });

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      snowflakesRef.current = Array.from({ length: density }, () => createSnowflake(true));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (const flake of snowflakesRef.current) {
        flake.y += flake.speed;
        flake.x += flake.wind;
        
        if (flake.y > height) {
          Object.assign(flake, createSnowflake());
        }
        
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, 6.28);
        ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.snowDensity, settings.snowSpeed, isBeta]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
});

export default SnowEffect;
