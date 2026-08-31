import React, { useState } from 'react';
import { Camera, X, Download, Sliders, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface PhotoModeProps {
  onClose: () => void;
  onZoomChange: (zoom: number) => void;
  zoom: number;
}

export const PhotoMode: React.FC<PhotoModeProps> = ({ onClose, onZoomChange, zoom }) => {
  const [filter, setFilter] = useState<'none' | 'ghibli' | 'sunset' | 'ink'>('ghibli');
  const [flash, setFlash] = useState(false);

  const handleCapture = () => {
    AudioEngine.playSfx('secretFound');
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  return (
    <>
      {/* Shutter flash effect */}
      {flash && (
        <div className="fixed inset-0 z-50 bg-white animate-fadeOut pointer-events-none" />
      )}

      {/* Screen Frame Vignette / Watermark */}
      <div className="fixed inset-0 z-20 pointer-events-none border-8 sm:border-[16px] border-charcoal-950/40">
        <div className="absolute top-6 left-6 font-mono text-[11px] text-white/70 tracking-widest uppercase">
          // PHOTO FRAME · VALLEY OF KOMOREBI
        </div>
        <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/70">
          VINAY SANKAR // GAME DEVELOPER
        </div>
      </div>

      {/* Floating Photo Mode Controller */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
        <div className="bg-charcoal-950/90 text-paper-100 p-4 rounded-2xl border border-charcoal-800 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-wrap items-center gap-4 text-xs font-mono">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-charcoal-400" />
            <input
              type="range"
              min="0.7"
              max="1.6"
              step="0.05"
              value={zoom}
              onChange={e => onZoomChange(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-charcoal-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <ZoomIn className="w-4 h-4 text-charcoal-400" />
          </div>

          <div className="h-6 w-px bg-charcoal-800 hidden sm:block" />

          {/* Filter Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('none')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'none' ? 'bg-gold-500 text-charcoal-950 font-bold' : 'bg-charcoal-800 text-charcoal-300'
              }`}
            >
              NATURAL
            </button>
            <button
              onClick={() => setFilter('ghibli')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'ghibli' ? 'bg-gold-500 text-charcoal-950 font-bold' : 'bg-charcoal-800 text-charcoal-300'
              }`}
            >
              GHIBLI WARMTH
            </button>
            <button
              onClick={() => setFilter('sunset')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'sunset' ? 'bg-gold-500 text-charcoal-950 font-bold' : 'bg-charcoal-800 text-charcoal-300'
              }`}
            >
              GOLDEN HOUR
            </button>
          </div>

          <div className="h-6 w-px bg-charcoal-800 hidden sm:block" />

          {/* Capture & Exit */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCapture}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold rounded-lg shadow-soft-glow transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>SNAP</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 rounded-lg transition-colors"
              title="Exit Photo Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
