import React from 'react';
import { Compass, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';
import { requestFullscreen } from '../../utils/fullscreen';

interface LoadingScreenProps {
  onEnter: () => void;
  onViewProjects: () => void;
  onViewResume?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onEnter,
  onViewProjects,
  onViewResume,
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

  const handleViewResume = () => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    requestFullscreen();
    onEnter();
    onViewResume?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 select-none animate-fadeIn">
      {/* Background Animated Stardust Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl px-4">
        
        {/* Role Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>[ // GAME DEVELOPER · TECHNICAL ARTIST ]</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-tight text-white leading-none">
          <span>Vinay</span>{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.75)]">
            Sankar
          </span>
        </h1>

        {/* Description Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-paper-200/90 font-sans max-w-lg leading-relaxed font-normal">
          I build games, interactive shaders, and living playable worlds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <button
            onClick={handleEnter}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs sm:text-sm font-black tracking-wide shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:shadow-[0_0_50px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
            <span>ENTER WORLD</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleViewGames}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-paper-100 font-mono text-xs sm:text-sm font-bold border-2 border-white/20 hover:border-amber-400/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>GAMES</span>
          </button>

          <button
            onClick={handleViewResume}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-paper-100 font-mono text-xs sm:text-sm font-bold border-2 border-white/20 hover:border-amber-400/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>RESUME / CV</span>
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
