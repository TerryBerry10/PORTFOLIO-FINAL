import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, ExternalLink, X, Tv } from 'lucide-react';
import { projects } from '../../data/projects';
import { AudioEngine } from '../../engine/AudioEngine';
import { getEmbedUrl } from '../../utils/gameTV';

interface RetroTVPlayerProps {
  projectId: string;
  onClose: () => void;
}

const STATIC_MS = 650;
const CLOSE_MS = 400;

/** Animated TV static drawn on a tiny canvas and scaled up for a chunky look. */
const StaticNoise: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const img = ctx.createImageData(canvas.width, canvas.height);
    let raf = 0;
    const draw = () => {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={160} height={90} className="absolute inset-0 w-full h-full [image-rendering:pixelated]" />;
};

export const RetroTVPlayer: React.FC<RetroTVPlayerProps> = ({ projectId, onClose }) => {
  const channels = useMemo(() => projects.filter(p => getEmbedUrl(p)), []);
  const [channelIndex, setChannelIndex] = useState(() => Math.max(0, channels.findIndex(p => p.id === projectId)));
  const [showStatic, setShowStatic] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [crtFx, setCrtFx] = useState(true);
  const screenRef = useRef<HTMLDivElement | null>(null);

  const project = channels[channelIndex];
  const embedUrl = project ? getEmbedUrl(project) : null;
  const isPortrait = project?.screenOrientation === 'portrait';

  const handleClose = useCallback(() => {
    if (isClosing) return;
    AudioEngine.playSfx('interact');
    setIsClosing(true);
    setTimeout(onClose, CLOSE_MS);
  }, [isClosing, onClose]);

  // Silence the world while a game is on screen.
  useEffect(() => {
    AudioEngine.setDucked(true);
    return () => {
      AudioEngine.setDucked(false);
      document.body.classList.remove('cursor-in-game');
    };
  }, []);

  // ESC closes the TV first, before App's global handler sees it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape' || document.fullscreenElement) return;
      e.stopPropagation();
      handleClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [handleClose]);

  // Brief burst of static on every channel change.
  useEffect(() => {
    setShowStatic(true);
    const t = setTimeout(() => setShowStatic(false), STATIC_MS);
    return () => clearTimeout(t);
  }, [channelIndex]);

  const switchChannel = (dir: 1 | -1) => {
    if (channels.length < 2) return;
    AudioEngine.playSfx('interact');
    setChannelIndex(i => (i + dir + channels.length) % channels.length);
  };

  const goFullscreen = async () => {
    try {
      await screenRef.current?.requestFullscreen?.();
      // Phones: turn landscape games sideways automatically (supported on Android Chrome).
      if (!isPortrait) await (screen.orientation as any)?.lock?.('landscape');
    } catch {
      /* fullscreen / orientation lock not available */
    }
  };

  if (!project || !embedUrl) return null;

  const knobAngle = (channelIndex / Math.max(1, channels.length)) * 300 - 150;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="tv-drop-in relative w-full max-w-[1180px] flex flex-col items-center">
        {/* Rabbit-ear antenna */}
        <div className="relative h-14 sm:h-20 w-40 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-1/2 w-[3px] h-16 sm:h-24 bg-gradient-to-t from-zinc-500 to-zinc-300 origin-bottom -rotate-[32deg] rounded-full" />
          <div className="absolute bottom-0 left-1/2 w-[3px] h-14 sm:h-20 bg-gradient-to-t from-zinc-500 to-zinc-300 origin-bottom rotate-[28deg] rounded-full" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-5 rounded-t-full bg-zinc-800 border border-zinc-600" />
        </div>

        {/* Cabinet */}
        <div className="tv-wood w-full rounded-[28px] p-3 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-6px_12px_rgba(0,0,0,0.5)] border border-black/60 flex flex-col md:flex-row gap-3 sm:gap-5">
          {/* Screen bezel */}
          <div className="flex-1 min-w-0 rounded-[22px] bg-gradient-to-br from-zinc-800 to-zinc-950 p-2.5 sm:p-4 shadow-[inset_0_4px_14px_rgba(0,0,0,0.9)] flex items-center justify-center">
            <div
              ref={screenRef}
              className="relative w-full aspect-video rounded-[18px] sm:rounded-[26px] overflow-hidden bg-black shadow-[0_0_0_3px_#0a0a0a,0_0_40px_rgba(120,200,255,0.12)]"
              style={{ maxWidth: 'calc((100dvh - 230px) * 16 / 9)' }}
            >
              <div className={`absolute inset-0 flex items-center justify-center bg-black ${isClosing ? 'crt-off' : 'crt-on'}`}>
                <iframe
                  key={project.id}
                  src={embedUrl}
                  title={project.title}
                  allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
                  allowFullScreen
                  className={`border-0 bg-black ${isPortrait ? 'h-full aspect-[9/16]' : 'w-full h-full'}`}
                  onMouseEnter={() => document.body.classList.add('cursor-in-game')}
                  onMouseLeave={() => document.body.classList.remove('cursor-in-game')}
                />

                {showStatic && (
                  <div className="absolute inset-0">
                    <StaticNoise />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono font-bold text-white text-lg sm:text-2xl tracking-[0.3em] bg-black/60 px-4 py-1 [text-shadow:0_0_8px_#fff]">
                        CH {String(channelIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )}

                {crtFx && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 crt-scanlines mix-blend-multiply" />
                    <div className="absolute inset-x-0 h-24 crt-roll-bar" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] rounded-[inherit]" />
                    <div className="absolute -top-1/3 -left-1/4 w-3/4 h-2/3 rounded-full bg-white/[0.04] blur-2xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control panel */}
          <div className="md:w-40 shrink-0 rounded-2xl bg-black/25 border border-black/40 p-3 flex md:flex-col items-center justify-between gap-3">
            <div className="w-full rounded-md bg-black/70 border border-amber-900/60 px-2 py-1.5 text-center shadow-inner">
              <div className="font-mono text-[10px] text-amber-500/70 tracking-widest">CHANNEL</div>
              <div className="font-mono font-bold text-amber-300 text-xl leading-none [text-shadow:0_0_8px_rgba(252,211,77,0.8)]">
                {String(channelIndex + 1).padStart(2, '0')}
              </div>
              <div className="font-mono text-[10px] text-amber-200/90 truncate mt-1" title={project.title}>{project.title}</div>
            </div>

            {/* Channel knob: left half = previous, right half = next */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-300 via-zinc-500 to-zinc-800 shadow-[0_4px_10px_rgba(0,0,0,0.7),inset_0_2px_2px_rgba(255,255,255,0.5)] transition-transform duration-300"
                  style={{ transform: `rotate(${knobAngle}deg)` }}
                >
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-4 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                </div>
                <button onClick={() => switchChannel(-1)} aria-label="Previous channel" className="absolute inset-y-0 left-0 w-1/2 rounded-l-full cursor-pointer" />
                <button onClick={() => switchChannel(1)} aria-label="Next channel" className="absolute inset-y-0 right-0 w-1/2 rounded-r-full cursor-pointer" />
              </div>
              <span className="font-mono text-[9px] text-amber-100/60 tracking-widest">◀ CH ▶</span>
            </div>

            <div className="hidden md:block w-full h-20 rounded-lg tv-grille border border-black/50" aria-hidden />

            <div className="grid grid-cols-2 gap-2 w-full max-w-[140px]">
              <button onClick={() => setCrtFx(v => !v)} title="Toggle CRT effect"
                className={`h-9 rounded-lg border font-mono text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${crtFx ? 'bg-amber-500/90 text-black border-amber-300' : 'bg-zinc-800 text-zinc-300 border-zinc-600'}`}>
                <Tv className="w-3.5 h-3.5" />FX
              </button>
              <button onClick={goFullscreen} title="Fullscreen"
                className="h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </button>
              <a href={project.playableUrl ?? embedUrl} target="_blank" rel="noreferrer" title="Open in new tab"
                className="h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={handleClose} title="Power off (Esc)"
                className="h-9 rounded-lg bg-red-900/80 hover:bg-red-800 border border-red-700 text-red-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isClosing ? 'bg-zinc-700' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
              <span className="font-mono text-[9px] text-amber-100/60 tracking-widest">POWER</span>
            </div>
          </div>
        </div>

        {/* Feet */}
        <div className="w-full flex justify-between px-16 pointer-events-none" aria-hidden>
          <div className="w-10 h-4 rounded-b-lg bg-[#2a170a]" />
          <div className="w-10 h-4 rounded-b-lg bg-[#2a170a]" />
        </div>

        {/* Phones: the TV screen is small, so point players at fullscreen */}
        <button
          onClick={goFullscreen}
          className="md:hidden mt-5 px-5 py-2.5 rounded-full bg-amber-500/90 text-black font-mono text-xs font-bold flex items-center gap-2 shadow-lg active:scale-95"
        >
          <Maximize2 className="w-4 h-4" /> PLAY FULLSCREEN
        </button>
      </div>
    </div>
  );
};
