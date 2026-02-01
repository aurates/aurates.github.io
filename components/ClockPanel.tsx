
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
        className={`font-black tracking-tight flex items-center justify-center py-4 transition-colors duration-700 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}
        style={{
          fontSize: 'clamp(3rem, 18vw, 15vw)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 0.95
        }}
      >
        <span>{mainTime}</span>
        <div className={`overflow-hidden transition-[max-width,opacity,margin] duration-500 ease-in-out flex items-center ${showSeconds ? 'max-w-[40vw] opacity-100 ml-[1.5vw]' : 'max-w-0 opacity-0 ml-0'}`}>
          <span className="opacity-40 text-[0.7em] font-light">:</span>
          <span>{seconds}</span>
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showDate ? 'max-h-40 opacity-100 mt-2 md:mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
        <p className={`text-lg md:text-3xl font-bold tracking-wide px-8 py-2 md:py-3 transition-colors duration-700 ${
          isDarkMode ? 'text-blue-400' : 'text-slate-900'
        }`}>
          {getDateString()}
        </p>
      </div>
    </div>
  );
};

export default ClockPanel;
