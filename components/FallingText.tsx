
import React, { useState, useEffect } from 'react';

interface FallingTextProps {
  isDarkMode: boolean;
  onComplete: () => void;
}

const FallingText: React.FC<FallingTextProps> = ({ isDarkMode, onComplete }) => {
  // Default to PC message as a safe fallback for initial render
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [isHolographic] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      // 1. Check for Touch Support (Most reliable for "Quickly touch the screen")
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 2. Check User Agent for common mobile/tablet strings
      const ua = navigator.userAgent;
      const isMobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      
      // 3. Screen width check (Common tablets/phones are < 1024px)
      const isSmallScreen = window.innerWidth <= 1024;
      
      // We assume mobile/tablet if it has touch AND is either a mobile UA or a small screen
      setIsMobileOrTablet(hasTouch && (isMobileRegex || isSmallScreen));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Instruction strings exactly as requested
  const pcMessage = "Quickly press the space bar three times for a surprise! :D";
  const mobileMessage = "Quickly touch the screen three times for a surprise! :D";

  const message = isMobileOrTablet ? mobileMessage : pcMessage;

  return (
    <div 
      onAnimationEnd={onComplete}
      className="fixed top-[25%] left-0 pointer-events-none z-0 whitespace-nowrap text-xl md:text-2xl font-medium animate-text-fall"
      style={{ animationDuration: '20s' }}
    >
      <span className={
        isHolographic 
          ? 'animate-holo' 
          : (isDarkMode ? 'text-slate-700' : 'text-slate-300')
      }>
        {message}
      </span>
    </div>
  );
};

export default FallingText;
