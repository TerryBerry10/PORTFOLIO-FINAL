import React, { useState } from 'react';
import { Compass, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface HeroOverlayProps {
  onExploreWorld: () => void;
  onViewProjects: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  onExploreWorld,
  onViewProjects
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleExplore = () => {
    AudioEngine.init();
    AudioEngine.playSfx('interact');
    setHasStarted(true);
    setShowTooltip(true);
    onExploreWorld();

    setTimeout(() => {
      setShowTooltip(false);
    }, 4500);
  };

  const handleProjects = () => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    onViewProjects();
  };

  if (hasStarted) {
    if (!showTooltip) return null;

    return (
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fadeIn transition-opacity duration-1000">
        <div className="bg-[#0f1a15]/95 text-paper-100 px-5 py-2.5 rounded-full border border-moss-700/70 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-3 text-xs font-mono">
          <span><strong className="text-gold-400">WASD / ARROWS</strong> MOVE</span>
          <span className="text-moss-600">·</span>
          <span><strong className="text-gold-400">SHIFT</strong> RUN</span>
          <span className="text-moss-600">·</span>
          <span><strong className="text-gold-400">E</strong> INTERACT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end p-6 sm:p-12 pointer-events-none select-none">
      <div className="max-w-xl bg-[#0f1a15]/95 backdrop-blur-xl border-2 border-moss-700/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] hover:border-gold-400/80 hover:shadow-[0_0_50px_rgba(229,183,107,0.3)] transition-all duration-300 pointer-events-auto animate-fadeIn ghibli-glow-card">
        
        {/* Subtitle / Mark */}
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            // GAME DEVELOPER · TECHNICAL ARTIST
          </span>
        </div>

        {/* Name */}
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-paper-50 leading-tight mb-2 tracking-tight">
          Vinay Sankar
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans mb-6">
          I build games, interactive shaders, and living playable worlds. Explore the peaceful valley below or jump directly into my shipped titles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={handleExplore}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-moss-700 to-moss-600 hover:from-moss-600 hover:to-moss-500 text-paper-50 font-mono text-xs font-bold rounded-xl shadow-lg border border-moss-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-gold-300 group-hover:rotate-45 transition-transform" />
            <span>EXPLORE WORLD</span>
          </button>

          <button
            onClick={handleProjects}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal-950 font-mono text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(229,183,107,0.4)] hover:shadow-[0_0_30px_rgba(229,183,107,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-charcoal-950 fill-current" />
            <span>VIEW GAMES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
