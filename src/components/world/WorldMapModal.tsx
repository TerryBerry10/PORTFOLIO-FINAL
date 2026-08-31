import React from 'react';
import { WorldZone, ZoneId } from '../../types/world';
import { X, Compass, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface WorldMapModalProps {
  zones: WorldZone[];
  activeZoneId: ZoneId | null;
  onFastTravel: (zoneId: ZoneId) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  zones,
  activeZoneId,
  onFastTravel,
  onClose
}) => {
  const handleZoneClick = (zoneId: ZoneId) => {
    AudioEngine.playSfx('interact');
    onFastTravel(zoneId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[92vh] text-white">
        
        {/* Hand-drawn Map Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// WORLD ATLAS · FAST TRAVEL CHART</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                The Valley of Craft & Living Worlds
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              AudioEngine.playSfx('closeModal');
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Grid Representation */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <p className="text-sm text-paper-300 font-sans">
            Select any sanctuary below to immediately fast-travel the traveler across the valley.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map(z => {
              const isCurrent = z.id === activeZoneId;
              return (
                <button
                  key={z.id}
                  onClick={() => handleZoneClick(z.id)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-40 shadow-lg ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.02]'
                      : 'bg-black/45 hover:bg-black/65 border-white/15 hover:border-amber-400/60 hover:scale-[1.02]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                        ZONE // {z.id}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono bg-amber-400 text-black px-2 py-0.5 rounded-full font-black shadow-sm">
                          HERE
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans font-bold text-base text-white leading-snug mb-1">
                      {z.name}
                    </h3>
                    <p className="text-xs text-paper-300 leading-tight line-clamp-2">
                      {z.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-amber-300 font-bold">
                    <span>TRAVEL →</span>
                    <span>[{z.x}, {z.y}]</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 text-right text-xs font-mono text-paper-400">
          CLICK ANY DESTINATION TO FAST-TRAVEL INSTANTLY
        </div>
      </div>
    </div>
  );
};
