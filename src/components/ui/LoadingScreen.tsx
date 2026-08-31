import React from 'react';
import { Compass, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';
import { requestFullscreen } from '../../utils/fullscreen';

interface LoadingScreenProps {
  onEnter: () => void;
  onViewProjects: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onEnter,
  onViewProjects,
}) => {
  const handleEnter = () => {
    AudioEngine.init();
    AudioEngine.playSfx('interact');
    requestFullscreen();
    onEnter();
  };

  const handleViewGames = () => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    requestFullscreen();
    onEnter();
    onViewProjects();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]/85 backdrop-blur-[2px] text-paper-100 p-6 select-none animate-fadeIn transition-opacity duration-700">
      
      {/* Background Subtle Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#000000]/40 to-[#000000]/95 pointer-events-none" />

      {/* Main Center Content Container */}
      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center space-y-6 animate-stagger">
        
        {/* Subtitle / Role Tag - Warm Golden Starlight */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>// GAME DEVELOPER · TECHNICAL ARTIST</span>
        </div>

        {/* Giant Glowing Name - Pure Starlight White + Radiant Celestial Gold */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-sans tracking-tight leading-none select-none">
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">Vinay </span>
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(251,191,36,0.85)]">
            Sankar
          </span>
        </h1>

        {/* Description Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-paper-200/90 font-sans max-w-lg leading-relaxed font-normal">
          I build games, interactive shaders, and living playable worlds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleEnter}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs sm:text-sm font-black tracking-wide shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:shadow-[0_0_50px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
            <span>ENTER WORLD</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleViewGames}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-paper-100 font-mono text-xs sm:text-sm font-bold border-2 border-white/20 hover:border-amber-400/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>VIEW GAMES</span>
          </button>
        </div>
      </div>

      {/* Subtle Bottom Controls Hint */}
      <div className="absolute bottom-6 font-mono text-[11px] text-paper-400/60 flex items-center gap-3">
        <span>WASD / ARROWS TO MOVE</span>
        <span>·</span>
        <span>E TO INTERACT</span>
      </div>
    </div>
  );
};
