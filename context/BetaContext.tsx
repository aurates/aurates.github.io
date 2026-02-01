import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import Cookies from 'js-cookie';

export type FallingTextStyle = 'default' | 'matrix' | 'cyber' | 'outrun';
export type FontFamily = 'Inter' | 'Comic Sans MS';

interface BetaSettings {
  bubbleColor: string;
  bubbleOpacity: number;
  clockColor: string;
  holographicColor: string;
  holoOpacity: number;
  backgroundColor: string;
  bgOpacity: number;
  snowDensity: number;
  snowSpeed: number;
  fallingTextStyle: FallingTextStyle;
  fontFamily: FontFamily;
}

interface BetaContextType {
  isBeta: boolean;
  toggleBeta: () => void;
  settings: BetaSettings;
  updateSettings: (newSettings: Partial<BetaSettings>) => void;
  clickCount: number;
  incrementClick: () => void;
}

const defaultSettings: BetaSettings = {
  bubbleColor: '#3b82f6',
  bubbleOpacity: 100,
  clockColor: '#ffffff',
  holographicColor: '#ffffff',
  holoOpacity: 100,
  backgroundColor: '#020617', // slate-950 default
  bgOpacity: 100,
  snowDensity: 50,
  snowSpeed: 1,
  fallingTextStyle: 'default',
  fontFamily: 'Inter',
};

const BetaContext = createContext<BetaContextType | undefined>(undefined);

export const BetaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBeta, setIsBeta] = useState(() => {
    return window.location.pathname.includes('/beta');
  });
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [settings, setSettings] = useState<BetaSettings>(() => {
    const saved = Cookies.get('beta_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fontFamily !== 'Inter' && parsed.fontFamily !== 'Comic Sans MS') {
          parsed.fontFamily = 'Inter';
        }
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (isBeta && !currentPath.includes('/beta')) {
      window.history.pushState({}, '', '/beta');
    } else if (!isBeta && currentPath.includes('/beta')) {
      window.history.pushState({}, '', '/');
    }
  }, [isBeta]);

  useEffect(() => {
    const handlePopState = () => {
      setIsBeta(window.location.pathname.includes('/beta'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    Cookies.set('beta_settings', JSON.stringify(settings), { expires: 365, sameSite: 'Lax' });
  }, [settings]);

  const toggleBeta = () => setIsBeta(prev => !prev);

  const updateSettings = (newSettings: Partial<BetaSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const incrementClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const newCount = clickCount + 1;
    
    if (newCount >= 3) {
      setClickCount(0);
      setIsBeta(prev => !prev);
    } else {
      setClickCount(newCount);
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
    }
  };

  return (
    <BetaContext.Provider value={{ isBeta, toggleBeta, settings, updateSettings, clickCount, incrementClick }}>
      {children}
    </BetaContext.Provider>
  );
};

export const useBeta = () => {
  const context = useContext(BetaContext);
  if (!context) {
    throw new Error('useBeta must be used within a BetaProvider');
  }
  return context;
};
