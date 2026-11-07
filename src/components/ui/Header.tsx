import React from 'react';
import { AudioEngine } from '../../engine/AudioEngine';

interface HeaderProps {
  timeOfDay?: string;
  onTimeChange?: (time: any) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenQuickView?: () => void;
  onOpenRecruiter?: () => void;
  onOpenMap?: () => void;
  onTogglePhotoMode?: () => void;
  onToggleDevMode?: () => void;
  onNavigateSection: (section: string) => void;
  devMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateSection
}) => {
  const handleNavClick = (section: string) => {
    AudioEngine.playSfx('buttonHover');
    onNavigateSection(section);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-2 sm:px-4 py-3 sm:py-5 flex items-center justify-center pointer-events-none select-none">
      
      {/* Centered, Prominent, Clean Glass Navigation Bar */}
      <nav className="pointer-events-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-0 sm:gap-3 bg-black/75 hover:bg-black/90 backdrop-blur-2xl px-1.5 py-1.5 sm:px-8 sm:py-3.5 rounded-full border-2 border-white/25 hover:border-amber-400/60 shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-white transition-all">
        <button
          onClick={() => handleNavClick('world')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          WORLD
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('projects')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          GAMES
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('about')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          ABOUT
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('lab')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          LAB
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('resume')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          RESUME
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('code')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          CODE
        </button>
        <span className="hidden sm:inline text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('contact')}
          className="shrink-0 px-1 sm:px-3.5 py-1.5 rounded-xl text-[10.5px] sm:text-sm font-sans font-bold tracking-normal sm:tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          CONTACT
        </button>
      </nav>
    </header>
  );
};
