
import React, { useState, useEffect } from 'react';

interface ClockPanelProps {
  isDarkMode: boolean;
  format: 'HH:mm' | 'HH:mm:ss';
  showDate: boolean;
  timezone: string;
}

const ClockPanel: React.FC<ClockPanelProps> = ({ isDarkMode, format, showDate, timezone }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeParts = () => {
    try {
      const baseOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone || undefined,
      };
      const mainTime = new Intl.DateTimeFormat('en-GB', baseOptions).format(time);
      
      const secOptions: Intl.DateTimeFormatOptions = {
        second: '2-digit',
        timeZone: timezone || undefined,
      };
      const seconds = new Intl.DateTimeFormat('en-GB', secOptions).format(time);
      
      return { mainTime, seconds };
    } catch (e) {
      const local = time.toLocaleTimeString('en-GB', { hour12: false });
      return { mainTime: local.substring(0, 5), seconds: local.substring(6, 8) };
    }
  };

  const getDateString = () => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone || undefined,
      }).format(time);
    } catch (e) {
      return time.toLocaleDateString();
    }
  };

  const { mainTime, seconds } = getTimeParts();
  const showSeconds = format.includes('ss');

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-full overflow-hidden px-4 md:px-10">
      <div 
        className={`font-black tracking-tight glass-text flex items-center justify-center py-4 transition-colors duration-700 will-change-[filter] ${
          isDarkMode ? 'text-white/80' : 'text-slate-900/95'
        }`}
        style={{
          fontSize: 'clamp(3rem, 18vw, 15vw)',
          filter: isDarkMode 
            ? 'drop-shadow(0 10px 20px rgba(255,255,255,0.05)) drop-shadow(0 20px 40px rgba(0,0,0,0.4))' 
            : 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
          paddingRight: '0.05em' // Minor offset to prevent italic-like clipping
        }}
      >
        <div className="flex items-center justify-center">
          <span className="shrink-0">{mainTime}</span>
          <div className={`overflow-hidden transition-[max-width,opacity,margin] duration-500 ease-in-out flex items-center shrink-0 ${showSeconds ? 'max-w-[40vw] opacity-100 ml-[1.5vw]' : 'max-w-0 opacity-0 ml-0'}`}>
            <span className="opacity-40 text-[0.7em] font-light">:</span>
            <span className="tabular-nums">{seconds}</span>
          </div>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showDate ? 'max-h-40 opacity-100 mt-2 md:mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
        <div 
          className={`text-lg md:text-3xl font-bold tracking-wide px-8 py-2 md:py-3 transition-all duration-700 ${
            isDarkMode ? 'text-blue-300/90' : 'text-slate-900'
          }`}
          style={{ background: 'transparent' }}
        >
          {getDateString()}
        </div>
      </div>

      <style>{`
        /* Default styles are Light Mode (logical fix) */
        .glass-text {
          position: relative;
          -webkit-text-stroke: 1px rgba(0, 0, 0, 0.05);
          text-shadow: 0 0 30px rgba(0, 0, 0, 0.03);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          line-height: 0.95;
          transition: color 0.7s ease, filter 0.7s ease, font-size 0.5s ease;
        }

        /* Dark Mode overrides */
        .dark .glass-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
          text-shadow: 0 0 60px rgba(56, 189, 248, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ClockPanel;
