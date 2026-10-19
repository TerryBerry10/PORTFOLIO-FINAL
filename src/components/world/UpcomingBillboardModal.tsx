import React, { useEffect } from 'react';
import { X, Hammer, Flame } from 'lucide-react';
import { Billboard } from '../../data/billboards';
import { AudioEngine } from '../../engine/AudioEngine';

interface UpcomingBillboardModalProps {
  billboard: Billboard;
  onClose: () => void;
  onFollow: () => void;
}

export const UpcomingBillboardModal: React.FC<UpcomingBillboardModalProps> = ({ billboard, onClose, onFollow }) => {
  const [accent, deep] = billboard.colors;
  const progress = Math.round((billboard.progress ?? 0) * 100);

  useEffect(() => {
    AudioEngine.playSfx('openModal');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="tv-drop-in relative w-full max-w-md rounded-2xl p-2 tv-wood shadow-[0_25px_70px_rgba(0,0,0,0.8)] border border-black/60">
        <div className="relative rounded-xl overflow-hidden border border-black/50">
          {/* Poster header */}
          <div
            className="relative h-40 flex flex-col justify-end p-5"
            style={{ background: `radial-gradient(circle at 75% 30%, ${accent}aa 0%, transparent 45%), linear-gradient(to bottom, ${deep}, #05080f)` }}
          >
            <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-rose-400 text-black font-mono text-[10px] font-bold tracking-wider">
              {billboard.ribbon}
            </span>
            <h2 className="font-serif font-bold text-3xl text-[#fff7e6] leading-tight">{billboard.title}</h2>
            <p className="font-mono text-[11px] font-bold tracking-wider uppercase" style={{ color: accent }}>
              {billboard.tagline}
            </p>
          </div>

          {/* Details */}
          <div className="bg-charcoal-950/95 p-5 space-y-4">
            {billboard.description && (
              <p className="text-sm text-paper-200 leading-relaxed">{billboard.description}</p>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-paper-300/70 tracking-widest">PLATFORM</span>
              <span className="text-gold-300 font-bold">{billboard.platform ?? 'TBA'}</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-paper-300/70 tracking-widest flex items-center gap-1.5">
                  <Hammer className="w-3 h-3" /> FORGING PROGRESS
                </span>
                <span className="text-gold-300 font-bold">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${progress}%`, background: `linear-gradient(to right, #facc15, ${accent})` }}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={onFollow}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-400 hover:to-amber-300 text-charcoal-950 font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Flame className="w-3.5 h-3.5" /> FOLLOW THE BUILD
              </button>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
