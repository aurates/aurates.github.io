
import React, { useRef, useEffect, useState } from 'react';

interface SettingsDropdownProps {
  isDarkMode: boolean;
  timezone: string;
  setTimezone: (tz: string) => void;
  format: 'HH:mm' | 'HH:mm:ss';
  setFormat: (f: 'HH:mm' | 'HH:mm:ss') => void;
  showDate: boolean;
  setShowDate: (s: boolean) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

const generateUTCList = () => {
  const list = [{ label: 'Local Time', value: '' }];
  for (let i = -12; i <= 14; i++) {
    const sign = i >= 0 ? '+' : '-';
    const abs = Math.abs(i);
    const value = i === 0 ? 'UTC' : `Etc/GMT${i > 0 ? '-' : '+'}${abs}`; 
    list.push({ label: `UTC ${sign}${abs}`, value });
  }
  return list;
};

const utcTimezones = generateUTCList();

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  isDarkMode, timezone, setTimezone, format, setFormat, showDate, setShowDate, isOpen, setIsOpen
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isTzListOpen, setIsTzListOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsTzListOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const selectedTzLabel = utcTimezones.find(t => t.value === timezone)?.label || 'Local Time';

  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-[110]" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsTzListOpen(false);
        }}
        className={`p-3 md:p-4 rounded-3xl glass-liquid transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group ${isOpen ? 'scale-110 shadow-lg' : ''}`}
        aria-label="Clock settings"
      >
        <svg 
          className={`w-6 h-6 md:w-7 md:h-7 transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'} ${isDarkMode ? 'fill-blue-400' : 'fill-slate-700'}`} 
          viewBox="0 0 24 24"
        >
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 00-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
      </button>

      {/* Main Settings Dropdown Panel */}
      <div className={`absolute top-16 md:top-20 left-0 w-72 md:w-80 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] glass-liquid-intense border transition-all duration-300 ease-out transform origin-top-left max-h-[75vh] md:max-h-[85vh] overflow-y-auto no-scrollbar ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'} ${isDarkMode ? 'text-white border-white/10' : 'text-slate-950 border-black/10'}`}>
        <div className="space-y-6 md:space-y-8">
          {/* Timezone Custom Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Timezone</label>
            <div className="relative">
              <button
                onClick={() => setIsTzListOpen(!isTzListOpen)}
                className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.01] tz-select-override ${isDarkMode ? 'border-white/10 text-blue-300' : 'border-black/10 text-blue-900 font-black'}`}
              >
                <span className="text-sm">{selectedTzLabel}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isTzListOpen ? 'rotate-180' : ''} fill-current`} viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </button>

              {/* Timezone Options List */}
              <div 
                className={`absolute left-0 right-0 mt-2 max-h-48 overflow-y-auto rounded-3xl z-[120] transition-all duration-300 no-scrollbar overflow-hidden tz-list-override ${isTzListOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'} ${isDarkMode ? 'shadow-2xl' : 'shadow-xl'}`} 
              >
                <div className="w-full flex flex-col p-0">
                  {utcTimezones.map(tz => (
                    <button
                      key={tz.value}
                      onClick={() => {
                        setTimezone(tz.value);
                        setIsTzListOpen(false);
                      }}
                      className={`w-full text-left px-6 py-4 text-sm font-bold transition-all duration-200 ${timezone === tz.value ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-900')}`}
                    >
                      {tz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Time Format</label>
            <div className="flex gap-3">
              {(['HH:mm', 'HH:mm:ss'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 px-4 py-2 text-[10px] md:text-xs font-bold rounded-2xl border transition-all duration-300 ${
                    format === f 
                      ? (isDarkMode ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-blue-100 border-blue-700 text-blue-900')
                      : (isDarkMode ? 'border-white/10 hover:border-white/30 text-white/50' : 'border-black/10 hover:border-black/30 text-slate-500')
                  }`}
                >
                  {f === 'HH:mm' ? '00:00' : '00:00:00'}
                </button>
              ))}
            </div>
          </div>

          {/* Display Date Toggle */}
          <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowDate(!showDate)}>
            <span className="text-xs font-bold uppercase tracking-[0.1em] opacity-60">Display Date</span>
            <button
              className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative transition-colors duration-500 ${
                showDate ? 'bg-blue-500' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-300')
              }`}
            >
              <div className={`absolute top-0.5 md:top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-md ${showDate ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`} />
            </button>
          </div>

          {/* Hotkey Hint Footer */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 text-center">
            <p className={`text-[9px] font-bold uppercase tracking-[0.15em] opacity-50`}>
              Shortcut: Ctrl/Cmd + Shift + S
            </p>
          </div>
        </div>
      </div>
      <style>{`
        /* Base styles are Light Mode - Restored Setting Dropdown blurry level */
        .glass-liquid-intense {
          backdrop-filter: blur(16px) saturate(180%) contrast(1.02) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) contrast(1.02) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }

        /* Dark Mode overrides - Restored Setting Dropdown blurry level */
        .dark .glass-liquid-intense {
          backdrop-filter: blur(24px) saturate(200%) contrast(1.1) !important;
          -webkit-backdrop-filter: blur(24px) saturate(200%) contrast(1.1) !important;
          background: rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3) !important;
        }

        /* Specific override for the internal list - Liquid glass with readable text */
        .tz-select-override, .tz-list-override {
          background: rgba(240, 245, 250, 0.85) !important;
          backdrop-filter: blur(24px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
        }

        .dark .tz-select-override, .dark .tz-list-override {
          background: rgba(10, 18, 32, 0.88) !important;
          backdrop-filter: blur(24px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-height: 500px) {
           .glass-liquid-intense {
              padding: 1rem !important;
              border-radius: 2rem !important;
           }
        }
      `}</style>
    </div>
  );
};

export default SettingsDropdown;
