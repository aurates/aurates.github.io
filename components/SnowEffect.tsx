
import React, { useEffect, useRef } from 'react';

const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let isAnimating = true;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const snowflakes: Snowflake[] = [];
    const snowflakeCount = 150;

    class Snowflake {
      x: number = 0;
      y: number = 0;
      radius: number = 0;
      speed: number = 0;
      wind: number = 0;
      opacity: number = 0;
      color: string = 'rgba(255, 255, 255, 0.5)';

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > height) {
          this.reset();
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      snowflakes.length = 0;
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(new Snowflake());
      }
    };

    const animate = () => {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        snowflake.update();
        snowflake.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
        return;
      }

      if (!isAnimating) {
        isAnimating = true;
        animate();
      }
    };

    window.addEventListener('resize', init);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    init();
    animate();

    return () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen', contain: 'paint' }}
    />
  );
};

export default SnowEffect;
