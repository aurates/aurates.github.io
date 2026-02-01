import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useBeta } from '../context/BetaContext';
import { Sparkles, X } from 'lucide-react';

interface BetaConfigPanelProps {
  isDarkMode: boolean;
  isSnowing?: boolean;
  toggleSnow?: () => void;
}

// HSL to Hex conversion
const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Hex to Hue conversion for initializing slider
const hexToHue = (hex: string): number => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return Math.round(h * 360);
};

const BetaConfigPanel: React.FC<BetaConfigPanelProps> = memo(({ isDarkMode, isSnowing, toggleSnow }) => {
  const { isBeta, toggleBeta, settings, updateSettings } = useBeta();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Color picker states - use local preview for smooth dragging
  const [holoPickerOpen, setHoloPickerOpen] = useState(false);
  const [bubblePickerOpen, setBubblePickerOpen] = useState(false);
  const [holoHue, setHoloHue] = useState(() => hexToHue(settings.holographicColor));
  const [bubbleHue, setBubbleHue] = useState(() => hexToHue(settings.bubbleColor));
  const [previewHoloColor, setPreviewHoloColor] = useState(settings.holographicColor);
  const [previewBubbleColor, setPreviewBubbleColor] = useState(settings.bubbleColor);
  
  const holoPickerRef = useRef<HTMLDivElement>(null);
  const bubblePickerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

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

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (holoPickerRef.current && !holoPickerRef.current.contains(event.target as Node)) {
        setHoloPickerOpen(false);
      }
      if (bubblePickerRef.current && !bubblePickerRef.current.contains(event.target as Node)) {
        setBubblePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!shouldRender) return null;

  const presetColors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0088ff', '#8800ff', '#ff00ff', '#ffffff', '#3b82f6'];

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
        className={`w-72 md:w-80 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] glass-liquid-intense border transition-all duration-300 ease-out transform origin-bottom-right max-h-[75vh] md:max-h-[85vh] overflow-y-auto no-scrollbar ${
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
          <div className="relative" ref={holoPickerRef}>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Holo Color</label>
            <button
              onClick={() => { setHoloPickerOpen(!holoPickerOpen); setBubblePickerOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] beta-select-override ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: previewHoloColor }} 
              />
              <span className={`text-sm font-mono ${isDarkMode ? 'text-purple-300' : 'text-purple-900 font-black'}`}>
                {previewHoloColor}
              </span>
            </button>

            {/* Color Picker Dropdown */}
            <div className={`absolute left-0 right-0 mt-2 p-4 rounded-3xl z-[120] transition-all duration-300 beta-picker-override ${
              holoPickerOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 pointer-events-none -translate-y-2 scale-95'
            } ${isDarkMode ? 'shadow-2xl' : 'shadow-xl'}`}>
              {/* Hue Slider */}
              <div className="relative h-6 mb-4">
                <div 
                  className="absolute inset-0 rounded-full" 
                  style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }} 
                />
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={holoHue}
                  onMouseDown={() => { isDraggingRef.current = true; }}
                  onTouchStart={() => { isDraggingRef.current = true; }}
                  onInput={(e) => {
                    const h = Number((e.target as HTMLInputElement).value);
                    setHoloHue(h);
                    setPreviewHoloColor(hslToHex(h, 100, 50));
                  }}
                  onMouseUp={() => { 
                    isDraggingRef.current = false; 
                    updateSettings({ holographicColor: previewHoloColor }); 
                  }}
                  onTouchEnd={() => { 
                    isDraggingRef.current = false; 
                    updateSettings({ holographicColor: previewHoloColor }); 
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-black/20 shadow-lg pointer-events-none"
                  style={{ left: `calc(${(holoHue / 360) * 100}% - 10px)` }}
                />
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-2 justify-center">
                {presetColors.map(c => (
                  <button 
                    key={c}
                    onClick={() => { updateSettings({ holographicColor: c }); setHoloHue(hexToHue(c)); setPreviewHoloColor(c); }}
                    className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform ${
                      previewHoloColor === c ? 'border-white ring-2 ring-purple-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bubble Tint */}
          <div className="relative" ref={bubblePickerRef}>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3">Bubble Tint</label>
            <button
              onClick={() => { setBubblePickerOpen(!bubblePickerOpen); setHoloPickerOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] beta-select-override ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: previewBubbleColor }} 
              />
              <span className={`text-sm font-mono ${isDarkMode ? 'text-blue-300' : 'text-blue-900 font-black'}`}>
                {previewBubbleColor}
              </span>
            </button>

            {/* Color Picker Dropdown */}
            <div className={`absolute left-0 right-0 mt-2 p-4 rounded-3xl z-[120] transition-all duration-300 beta-picker-override ${
              bubblePickerOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 pointer-events-none -translate-y-2 scale-95'
            } ${isDarkMode ? 'shadow-2xl' : 'shadow-xl'}`}>
              {/* Hue Slider */}
              <div className="relative h-6 mb-4">
                <div 
                  className="absolute inset-0 rounded-full" 
                  style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }} 
                />
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={bubbleHue}
                  onMouseDown={() => { isDraggingRef.current = true; }}
                  onTouchStart={() => { isDraggingRef.current = true; }}
                  onInput={(e) => {
                    const h = Number((e.target as HTMLInputElement).value);
                    setBubbleHue(h);
                    setPreviewBubbleColor(hslToHex(h, 100, 50));
                  }}
                  onMouseUp={() => { 
                    isDraggingRef.current = false; 
                    updateSettings({ bubbleColor: previewBubbleColor }); 
                  }}
                  onTouchEnd={() => { 
                    isDraggingRef.current = false; 
                    updateSettings({ bubbleColor: previewBubbleColor }); 
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-black/20 shadow-lg pointer-events-none"
                  style={{ left: `calc(${(bubbleHue / 360) * 100}% - 10px)` }}
                />
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-2 justify-center">
                {presetColors.map(c => (
                  <button 
                    key={c}
                    onClick={() => { updateSettings({ bubbleColor: c }); setBubbleHue(hexToHue(c)); setPreviewBubbleColor(c); }}
                    className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-transform ${
                      previewBubbleColor === c ? 'border-white ring-2 ring-blue-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
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
                  max="300" 
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
                    bubbleColor: '#3b82f6',
                    clockColor: '#ffffff',
                    holographicColor: '#ffffff',
                    snowDensity: 50,
                    snowSpeed: 1,
                    fallingTextStyle: 'default',
                    fontFamily: 'Inter',
                  });
                  setHoloHue(0);
                  setBubbleHue(hexToHue('#3b82f6'));
                  setPreviewHoloColor('#ffffff');
                  setPreviewBubbleColor('#3b82f6');
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
