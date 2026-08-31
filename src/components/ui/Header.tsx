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
    <header className="fixed top-0 inset-x-0 z-40 px-4 py-5 flex items-center justify-center pointer-events-none select-none">
      
      {/* Centered, Prominent, Clean Glass Navigation Bar */}
      <nav className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-black/75 hover:bg-black/90 backdrop-blur-2xl px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border-2 border-white/25 hover:border-amber-400/60 shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-white transition-all">
        <button
          onClick={() => handleNavClick('world')}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          WORLD
        </button>
        <span className="text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('projects')}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          GAMES
        </button>
        <span className="text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('about')}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          ABOUT
        </button>
        <span className="text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('lab')}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          LAB
        </button>
        <span className="text-amber-400/40 text-sm font-bold">/</span>
        <button
          onClick={() => handleNavClick('contact')}
          className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-bold tracking-wider text-white hover:text-amber-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
        >
          CONTACT
        </button>
      </nav>
    </header>
  );
};
