import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useBeta } from '../context/BetaContext';
import { Sparkles, X } from 'lucide-react';

interface BetaConfigPanelProps {
  isDarkMode: boolean;
  isSnowing?: boolean;
  toggleSnow?: () => void;
}

// HSV to Hex conversion
const hsvToHex = (h: number, s: number, v: number, a: number = 1) => {
  s /= 100;
  v /= 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);
  const aa = Math.round(a * 255);
  
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) hex += toHex(aa);
  return hex;
};

// Hex to HSV conversion
const hexToHsv = (hex: string) => {
  let hexVal = hex.replace('#', '');
  if (hexVal.length === 3) hexVal = hexVal.split('').map(c => c + c).join('');
  if (hexVal.length < 6) return { h: 0, s: 0, v: 100, a: 1 };
  
  const r = parseInt(hexVal.substring(0, 2), 16) / 255;
  const g = parseInt(hexVal.substring(2, 4), 16) / 255;
  const b = parseInt(hexVal.substring(4, 6), 16) / 255;
  const a = hexVal.length === 8 ? parseInt(hexVal.substring(6, 8), 16) / 255 : 1;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100, a };
};

// Color Slider Component with real-time preview
const ColorSlider: React.FC<{
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  isDarkMode: boolean;
}> = memo(({ label, color, onColorChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [inputValue, setInputValue] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);
  const [isDraggingSV, setIsDraggingSV] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);

  // Update HSV and input when external color changes
  useEffect(() => {
    setHsv(hexToHsv(color));
    setInputValue(color);
  }, [color]);

  // Handle global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSV && svRef.current) {
        const rect = svRef.current.getBoundingClientRect();
        const s = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const v = Math.min(100, Math.max(0, (1 - (e.clientY - rect.top) / rect.height) * 100));
        const newHsv = { ...hsv, s, v };
        setHsv(newHsv);
        updateColor(newHsv);
      } else if (isDraggingHue && pickerRef.current) {
        const hueBar = pickerRef.current.querySelector('.hue-bar');
        if (hueBar) {
          const rect = hueBar.getBoundingClientRect();
          const h = Math.min(360, Math.max(0, ((e.clientY - rect.top) / rect.height) * 360));
          const newHsv = { ...hsv, h };
          setHsv(newHsv);
          updateColor(newHsv);
        }
      } else if (isDraggingAlpha && pickerRef.current) {
        const alphaBar = pickerRef.current.querySelector('.alpha-bar');
        if (alphaBar) {
          const rect = alphaBar.getBoundingClientRect();
          const a = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
          const newHsv = { ...hsv, a };
          setHsv(newHsv);
          updateColor(newHsv);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSV(false);
      setIsDraggingHue(false);
      setIsDraggingAlpha(false);
    };

    if (isDraggingSV || isDraggingHue || isDraggingAlpha) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSV, isDraggingHue, isDraggingAlpha, hsv]);

  const updateColor = useCallback((newHsv: { h: number; s: number; v: number; a: number }) => {
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v, newHsv.a);
    setInputValue(newHex);
    onColorChange(newHex);
  }, [onColorChange]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Auto-add # if missing and it looks like a hex code
    if (val && !val.startsWith('#') && /^[0-9A-Fa-f]/.test(val)) {
      val = '#' + val;
    }
    setInputValue(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(val)) {
      onColorChange(val);
      setHsv(hexToHsv(val));
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">{label}</label>
      
      <div className={`flex items-center px-4 py-3 rounded-2xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500/30 ${
        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
      }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded-full border-2 border-white/30 shadow-lg shrink-0 transition-transform active:scale-95"
          style={{ backgroundColor: color }}
          title="Toggle color picker"
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`flex-1 min-w-0 bg-transparent border-none focus:outline-none ml-4 text-sm font-mono ${
            isDarkMode ? 'text-purple-300 placeholder-white/20' : 'text-purple-900 font-black placeholder-black/20'
          }`}
          placeholder="#000000"
        />
      </div>

      {/* Color Picker Dropdown */}
      <div className={`absolute left-0 right-0 mt-2 p-4 rounded-3xl z-[120] transition-all duration-300 beta-picker-override overflow-hidden ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 pointer-events-none -translate-y-2 scale-95'
      } ${isDarkMode ? 'shadow-2xl' : 'shadow-xl'}`}>
        
        <div className="flex gap-4 h-44 mb-4">
          {/* SV Square */}
          <div 
            ref={svRef}
            className="flex-1 relative rounded-xl overflow-hidden cursor-crosshair touch-none"
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
            onMouseDown={(e) => {
              setIsDraggingSV(true);
              const rect = svRef.current!.getBoundingClientRect();
              const s = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
              const v = Math.min(100, Math.max(0, (1 - (e.clientY - rect.top) / rect.height) * 100));
              const newHsv = { ...hsv, s, v };
              setHsv(newHsv);
              updateColor(newHsv);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div 
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_0_1.5px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
            />
          </div>

          {/* Hue Vertical Bar */}
          <div 
            className="hue-bar w-5 h-full relative rounded-full cursor-pointer touch-none"
            style={{ background: 'linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
            onMouseDown={(e) => {
              setIsDraggingHue(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const h = Math.min(360, Math.max(0, ((e.clientY - rect.top) / rect.height) * 360));
              const newHsv = { ...hsv, h };
              setHsv(newHsv);
              updateColor(newHsv);
            }}
          >
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-black/20 rounded-full shadow-lg pointer-events-none"
              style={{ top: `calc(${(hsv.h / 360) * 100}% - 12px)` }}
            />
          </div>
        </div>

        {/* Alpha Bar */}
        <div 
          className="alpha-bar h-4 w-full relative rounded-full cursor-pointer touch-none mb-2"
          style={{ 
            background: `
              linear-gradient(to right, transparent, ${hsvToHex(hsv.h, hsv.s, hsv.v, 1)}),
              conic-gradient(#ccc 0.25turn, #fff 0.25turn 0.5turn, #ccc 0.5turn 0.75turn, #fff 0.75turn) 
              0 0 / 8px 8px
            ` 
          }}
          onMouseDown={(e) => {
            setIsDraggingAlpha(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const a = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const newHsv = { ...hsv, a };
            setHsv(newHsv);
            updateColor(newHsv);
          }}
        >
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black/10 rounded-full shadow-lg pointer-events-none"
            style={{ left: `calc(${hsv.a * 100}% - 10px)` }}
          />
        </div>
      </div>
    </div>
  );
});

const BetaConfigPanel: React.FC<BetaConfigPanelProps> = memo(({ isDarkMode, isSnowing, toggleSnow }) => {
  const { isBeta, toggleBeta, settings, updateSettings } = useBeta();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isBeta) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isBeta]);

  if (!shouldRender) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[110]" 
      ref={panelRef}
    >
      {/* Toggle Buttons Container */}
      <div className={`absolute bottom-0 right-0 flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}>
        {/* Snow Toggle - Only in dark mode */}
        {isDarkMode && toggleSnow && (
          <button
            onClick={toggleSnow}
            className="p-3 md:p-4 rounded-3xl glass-liquid transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
            aria-label="Toggle snow effect"
          >
            <svg 
              viewBox="0 0 24 24" 
              className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 ${isSnowing ? 'fill-blue-300' : 'fill-slate-500 hover:fill-slate-300'}`}
            >
              <path d="M13 3h-2v4.06l-3.53-2.03-1 1.73 3.53 2.04L6.47 11H3v2h3.47l3.53 2.04-3.53 2.04 1 1.73 3.53-2.03V21h2v-4.06l3.53 2.03 1-1.73-3.53-2.04L17.53 13H21v-2h-3.47l-3.53-2.04 3.53-2.04-1-1.73-3.53 2.03V3z"/>
            </svg>
          </button>
        )}
        {/* Beta Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 md:p-4 rounded-3xl glass-liquid transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Designer Mode settings"
        >
          <Sparkles 
            className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} 
          />
        </button>
      </div>

      {/* Main Panel */}
      <div 
        className={`w-72 md:w-80 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] glass-liquid-intense border transition-all duration-300 ease-out transform origin-bottom-right max-h-[75vh] md:max-h-[85vh] overflow-y-auto no-scrollbar select-none ${
          isAnimating && isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        } ${isDarkMode ? 'text-white border-white/10' : 'text-slate-950 border-black/10'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className="text-sm font-bold uppercase tracking-[0.15em] opacity-80">Designer Mode</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            <X size={16} className="opacity-60" />
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          
          {/* Font Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Font Family</label>
            <div className="flex gap-3">
              {[
                { value: 'Inter', label: 'Default' },
                { value: 'Comic Sans MS', label: 'Comic Sans' }
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => updateSettings({ fontFamily: f.value as any })}
                  className={`flex-1 px-4 py-2 text-[10px] md:text-xs font-bold rounded-2xl border transition-all duration-300 ${
                    settings.fontFamily === f.value 
                      ? (isDarkMode ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-purple-100 border-purple-700 text-purple-900')
                      : (isDarkMode ? 'border-white/10 hover:border-white/30 text-white/50' : 'border-black/10 hover:border-black/30 text-slate-500')
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Holo Color */}
          <ColorSlider
            label={`Holo Color (${isDarkMode ? 'Dark' : 'Light'} Mode)`}
            color={isDarkMode ? settings.holographicColorDark : settings.holographicColorLight}
            onColorChange={(color) => updateSettings(isDarkMode ? { holographicColorDark: color } : { holographicColorLight: color })}
            isDarkMode={isDarkMode}
          />

          {/* Bubble Tint */}
          <ColorSlider
            label={`Bubble Tint (${isDarkMode ? 'Dark' : 'Light'} Mode)`}
            color={isDarkMode ? settings.bubbleColorDark : settings.bubbleColorLight}
            onColorChange={(color) => updateSettings(isDarkMode ? { bubbleColorDark: color } : { bubbleColorLight: color })}
            isDarkMode={isDarkMode}
          />

          {/* Bubble Controls */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Bubble Animation</label>
            <button
              onClick={() => updateSettings({ bubblesPaused: !settings.bubblesPaused })}
              className={`w-full px-4 py-3 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-300 ${
                settings.bubblesPaused 
                  ? (isDarkMode ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-amber-100 border-amber-600 text-amber-800')
                  : (isDarkMode ? 'border-white/10 hover:border-white/30 text-white/70' : 'border-black/10 hover:border-black/30 text-slate-600')
              }`}
            >
              {settings.bubblesPaused ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Resume Bubbles</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Pause Bubbles</span>
                </>
              )}
            </button>
          </div>

          {/* Snow Settings (Dark Mode Only) */}
          {isDarkMode && (
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Snow Settings</label>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs opacity-60">Density</span>
                  <span className={`text-xs font-mono ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>{settings.snowDensity}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={settings.snowDensity}
                  onChange={(e) => updateSettings({ snowDensity: Number(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-blue-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs opacity-60">Speed</span>
                  <span className={`text-xs font-mono ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>{settings.snowSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1"
                  value={settings.snowSpeed}
                  onChange={(e) => updateSettings({ snowSpeed: Number(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-blue-400"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
            <button 
              onClick={() => {
                if(window.confirm("Reset all designer settings?")) {
                  updateSettings({
                    bubbleColorDark: '#3b82f6',
                    bubbleColorLight: '#3b82f6',
                    holographicColorDark: '#ffffff',
                    holographicColorLight: '#6b21a8',
                    bubbleOpacity: 100,
                    bubblesPaused: false,
                    clockColor: '#ffffff',
                    holoOpacity: 100,
                    backgroundColor: '#020617',
                    bgOpacity: 100,
                    snowDensity: 50,
                    snowSpeed: 1,
                    fallingTextStyle: 'default',
                    fontFamily: 'Inter',
                  });
                }
              }}
              className={`w-full py-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-50 hover:opacity-80 transition-opacity`}
            >
              Reset to Defaults
            </button>
            <button 
              onClick={toggleBeta}
              className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20' 
                  : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
              }`}
            >
              Exit Designer Mode
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .glass-liquid-intense {
          backdrop-filter: blur(16px) saturate(180%) contrast(1.02) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) contrast(1.02) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }

        .dark .glass-liquid-intense {
          backdrop-filter: blur(24px) saturate(200%) contrast(1.1) !important;
          -webkit-backdrop-filter: blur(24px) saturate(200%) contrast(1.1) !important;
          background: rgba(0, 0, 0, 0.1) !important;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3) !important;
        }

        .beta-select-override, .beta-picker-override {
          background: rgba(240, 245, 250, 0.85) !important;
          backdrop-filter: blur(24px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
        }

        .dark .beta-select-override, .dark .beta-picker-override {
          background: rgba(10, 18, 32, 0.88) !important;
          backdrop-filter: blur(24px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }
      `}</style>
    </div>
  );
});

export default BetaConfigPanel;
