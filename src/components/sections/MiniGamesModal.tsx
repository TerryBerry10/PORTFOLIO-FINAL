import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface MiniGamesModalProps {
  onClose: () => void;
}

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [collectedCount, setCollectedCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let flies = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * 560,
      y: Math.random() * 320,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: 3 + Math.random() * 3,
      alpha: 0.5 + Math.random() * 0.5,
      color: i % 2 === 0 ? '#fef08a' : '#facc15',
      collected: false,
    }));

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const f of flies) {
        if (!f.collected && Math.hypot(f.x - mx, f.y - my) < 32) {
          f.collected = true;
          setCollectedCount(c => c + 1);
          AudioEngine.playSfx('fireflyCatch');
          break;
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Night garden meadow background
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grass silhoutte at bottom
      ctx.fillStyle = '#0a121e';
      for (let x = 0; x < canvas.width; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x + 6, canvas.height - 35 - (x % 17));
        ctx.lineTo(x + 12, canvas.height);
        ctx.fill();
      }

      // Draw flies
      for (const f of flies) {
        if (f.collected) {
          // Floating upward and fading
          f.y -= 1.5;
          f.alpha -= 0.02;
          if (f.alpha <= 0) {
            // Respawn
            f.collected = false;
            f.x = Math.random() * canvas.width;
            f.y = Math.random() * (canvas.height - 50);
            f.alpha = 0.8;
          }
        } else {
          f.x += f.vx + Math.sin(Date.now() * 0.003 + f.y) * 0.4;
          f.y += f.vy + Math.cos(Date.now() * 0.003 + f.x) * 0.4;

          if (f.x < 10) f.vx = Math.abs(f.vx);
          if (f.x > canvas.width - 10) f.vx = -Math.abs(f.vx);
          if (f.y < 10) f.vy = Math.abs(f.vy);
          if (f.y > canvas.height - 40) f.vy = -Math.abs(f.vy);
        }

        // Draw glow
        ctx.save();
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = f.alpha * 0.35;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-2xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// PEACEFUL MINI-GAME · FIREFLY GARDEN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                The Whispering Firefly Meadow
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-paper-300">Click fireflies to release pentatonic chimes</span>
            <span className="font-bold text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
              ✨ Fireflies Befriended: {collectedCount}
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/80 shadow-inner">
            <canvas
              ref={canvasRef}
              width={560}
              height={320}
              className="w-full h-auto block cursor-pointer"
            />
          </div>

          <p className="text-xs font-mono text-center text-paper-400">
            No timer. No stressful scores. Just pure peaceful interactive atmosphere.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 text-right text-xs font-mono text-paper-400">
          PRESS ESC OR CLOSE TO RETURN TO THE WORLD
        </div>
      </div>
    </div>
  );
};
