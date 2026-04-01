
import React, { useState, useEffect, useCallback, useRef } from 'react';
import BubbleBackground from './components/BubbleBackground';
import SocialLink from './components/SocialLink';
import LiquidGlassToggle from './components/LiquidGlassToggle';
import FallingText from './components/FallingText';
import SnowEffect from './components/SnowEffect';
import SnowToggle from './components/SnowToggle';
import DiscordModal from './components/DiscordModal';
import DonateModal from './components/DonateModal';
import ClockPanel from './components/ClockPanel';
import SettingsDropdown from './components/SettingsDropdown';
import { ICONS } from './constants';

// Cookie helpers
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const segment = parts.pop();
    return segment ? segment.split(';').shift() ?? null : null;
  }
  return null;
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
};

const parseView = (value: string | null): 'home' | 'clock' => {
  return value === 'clock' ? 'clock' : 'home';
};

const parseClockFormat = (value: string | null): 'HH:mm' | 'HH:mm:ss' => {
  return value === 'HH:mm:ss' ? 'HH:mm:ss' : 'HH:mm';
};

const App: React.FC = () => {
  // Theme State - Default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = getCookie('theme');
    return saved ? saved === 'dark' : false;
  });
  
  // View State (home | clock)
  const [view, setView] = useState<'home' | 'clock'>(() => {
    return parseView(getCookie('app_view'));
  });

  // Clock Preferences
  const [clockFormat, setClockFormat] = useState<'HH:mm' | 'HH:mm:ss'>(() => {
    return parseClockFormat(getCookie('clock_format'));
  });
  const [showDate, setShowDate] = useState(() => {
    return getCookie('clock_show_date') === 'true';
  });
  const [timezone, setTimezone] = useState(() => {
    return getCookie('clock_timezone') || '';
  });

  const [isSnowing, setIsSnowing] = useState(false);
  const [showFallingText, setShowFallingText] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isAnyModalOpen = isDiscordModalOpen || isDonateModalOpen;
  
  const tapCount = useRef(0);
  const lastTapTime = useRef(0);

  // Sync state to cookies
  useEffect(() => {
    setCookie('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setIsSnowing(false);
    }
  }, [isDarkMode]);

  useEffect(() => { setCookie('app_view', view); }, [view]);
  useEffect(() => { setCookie('clock_format', clockFormat); }, [clockFormat]);
  useEffect(() => { setCookie('clock_show_date', showDate.toString()); }, [showDate]);
  useEffect(() => { setCookie('clock_timezone', timezone); }, [timezone]);

  // Settings shortcut (Ctrl/Cmd + Shift + S)
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      const isS = e.key.toLowerCase() === 's';
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.shiftKey && isS && view === 'clock' && !isAnyModalOpen) {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [view, isAnyModalOpen]);

  useEffect(() => {
    if (isAnyModalOpen) {
      setIsSettingsOpen(false);
    }
  }, [isAnyModalOpen]);

  // Escape key to return home
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (isDiscordModalOpen) {
        setIsDiscordModalOpen(false);
        return;
      }

      if (isDonateModalOpen) {
        setIsDonateModalOpen(false);
        return;
      }

      if (view === 'clock') {
        setView('home');
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [view, isDiscordModalOpen, isDonateModalOpen]);

  // Periodic Falling Text
  useEffect(() => {
    let timeoutId: ReturnType<typeof window.setTimeout> | null = null;
    const spawnText = () => {
      setShowFallingText(true);
      timeoutId = window.setTimeout(spawnText, 30000);
    };
    const firstTimeout = window.setTimeout(spawnText, 800);
    return () => {
      window.clearTimeout(firstTimeout);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  // 3x Trigger Logic (Space or Touch)
  const handleInteraction = useCallback((event?: KeyboardEvent) => {
    if (isAnyModalOpen) return;

    if (event) {
      if (event.code !== 'Space' || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) {
        return;
      }
    }

    const now = Date.now();
    if (now - lastTapTime.current < 450) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }
    lastTapTime.current = now;
    if (tapCount.current === 3) {
      setView(prev => prev === 'home' ? 'clock' : 'home');
      setIsSettingsOpen(false);
      tapCount.current = 0;
    }
  }, [isAnyModalOpen]);

  useEffect(() => {
    const handleTouchStart = () => handleInteraction();
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleInteraction]);

  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDonateModalOpen(false);
    setIsDiscordModalOpen(true);
  };

  const handleDonateClick = () => {
    setIsDiscordModalOpen(false);
    setIsDonateModalOpen(true);
  };

  return (
    <div className={`relative h-[100dvh] w-full transition-colors duration-500 overflow-hidden flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      
      <BubbleBackground isDarkMode={isDarkMode} />
      
      {isSnowing && <SnowEffect />}
      
      {showFallingText && view === 'home' && (
        <FallingText 
          isDarkMode={isDarkMode} 
          onComplete={() => setShowFallingText(false)} 
        />
      )}

      <LiquidGlassToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
      
      {isDarkMode && (
        <SnowToggle isSnowing={isSnowing} toggle={() => setIsSnowing(!isSnowing)} />
      )}

      {view === 'clock' && (
        <SettingsDropdown 
          isDarkMode={isDarkMode}
          timezone={timezone}
          setTimezone={setTimezone}
          format={clockFormat}
          setFormat={setClockFormat}
          showDate={showDate}
          setShowDate={setShowDate}
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          isDisabled={isAnyModalOpen}
        />
      )}

      <DiscordModal 
        isOpen={isDiscordModalOpen} 
        onClose={() => setIsDiscordModalOpen(false)} 
        isDarkMode={isDarkMode}
      />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <main className="relative z-10 w-full flex flex-col items-center text-center px-4">
        <div className="relative w-full grid place-items-center">
          {/* Home View Container */}
          <div className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${view === 'home' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none translate-y-4'}`}>
            <div className="flex flex-col items-center gap-12 md:gap-16">
              {/* Using leading-none and flex layout to ensure perfect 1:1 vertical spacing between elements */}
              <div className="entrance-anim flex flex-col items-center leading-none">
                <h1 className={`text-7xl md:text-9xl font-bold tracking-tighter select-none transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Dylan
                </h1>
              </div>

              <div className="entrance-anim flex flex-col items-center leading-none">
                <span className={`text-4xl md:text-5xl font-bold tracking-tight select-none opacity-80 transition-colors ${isDarkMode ? 'text-blue-400' : 'text-[#BAE6FD]'}`}>
                  &lt;/3
                </span>
              </div>

              <div className="entrance-anim flex items-center gap-6 md:gap-8 leading-none">
                <SocialLink 
                  href="https://github.com/aurates/aurates.github.io" 
                  icon={ICONS.GITHUB} 
                  label="GitHub" 
                  bgColor={isDarkMode ? 'bg-slate-800' : 'bg-slate-900'} 
                />
                <SocialLink 
                  href="#" 
                  icon={ICONS.DISCORD} 
                  label="Discord" 
                  bgColor="bg-[#5865F2]" 
                  onClick={handleDiscordClick}
                />
              </div>
            </div>
          </div>

          {/* Clock View Container */}
          <div className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${view === 'clock' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none -translate-y-4'}`}>
            <ClockPanel 
              isDarkMode={isDarkMode}
              format={clockFormat}
              showDate={showDate}
              timezone={timezone}
            />
          </div>
        </div>
      </main>

      <footer className="absolute bottom-8 w-full text-center z-10">
        <button
          type="button"
          className={`text-lg font-medium tracking-tight inline-flex items-center justify-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-500/80' : 'text-slate-400'} cursor-pointer select-none hover:opacity-80`}
          onClick={handleDonateClick}
        >
          2026 
          <span className="text-red-500 text-2xl drop-shadow-sm">❤</span> 
          Dylan
        </button>
      </footer>
    </div>
  );
};

export default App;
