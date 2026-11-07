import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { isTouchDevice } from '../../utils/device';

interface WorldCenterHeroOverlayProps {
  isVisible: boolean;
}

export const WorldCenterHeroOverlay: React.FC<WorldCenterHeroOverlayProps> = ({ isVisible }) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const activeKeys = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);

  const MOVEMENT_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (MOVEMENT_KEYS.includes(e.code)) {
        activeKeys.current.add(e.code);

        // Cancel any pending restoration timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        // Fade out immediately when WASD / movement begins
        setIsTransparent(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (MOVEMENT_KEYS.includes(e.code)) {
        activeKeys.current.delete(e.code);

        // If no movement keys are currently held down, start the 2-second recovery timer
        if (activeKeys.current.size === 0) {
          if (timerRef.current) clearTimeout(timerRef.current);

          timerRef.current = window.setTimeout(() => {
            setIsTransparent(false);
            timerRef.current = null;
          }, 2000); // 2 seconds delay
        }
      }
    };

    // Touch: fade while a finger is down (joystick / taps), restore 2s after release
    const handleTouchStart = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsTransparent(true);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setIsTransparent(false);
        timerRef.current = null;
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-10 pointer-events-none select-none flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-out ${
        isTransparent ? 'opacity-0 scale-95 blur-[2px]' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      <div className="max-w-4xl flex flex-col items-center space-y-4">
        
        {/* Subtle Starlight Halo behind title */}
        <div className="absolute w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Hero Title: GAME DEVELOPER in glowing bold clean font */}
        <h1 className="relative font-sans font-black tracking-tight leading-none uppercase text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.75)]">
            GAME
          </span>
          <span className="block mt-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.85)]">
            DEVELOPER
          </span>
        </h1>

        {/* Interactive World Notice & Controls Capsule */}
        <div className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-stagger">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-bold text-amber-200 tracking-wider uppercase">
            {isTouchDevice() ? (
              <>Living Playable World · <span className="text-white font-extrabold bg-white/15 px-2 py-0.5 rounded border border-white/20">Drag</span> to Move · <span className="text-white font-extrabold bg-white/15 px-2 py-0.5 rounded border border-white/20">Tap</span> Airships to Play</>
            ) : (
              <>Living Playable World · Use <span className="text-white font-extrabold bg-white/15 px-2 py-0.5 rounded border border-white/20">WASD</span> to Move · <span className="text-white font-extrabold bg-white/15 px-2 py-0.5 rounded border border-white/20">[E]</span> to Interact</>
            )}
          </span>
          <Compass className="w-4 h-4 text-amber-300" />
        </div>

      </div>
    </div>
  );
};
