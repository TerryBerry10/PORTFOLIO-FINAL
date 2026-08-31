import React, { useEffect, useRef, useState } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ClickSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
}

export const InteractiveSpiritCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailParticles = useRef<TrailParticle[]>([]);
  const clickSparks = useRef<ClickSpark[]>([]);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const prevPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable default cursor when interactive spirit cursor is active
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('.group') ||
          target.closest('input') ||
          target.closest('select') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A'
        );
        setIsHoveringClickable(isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      // Spawn burst of 14 radiant stardust sparks
      const colors = ['#fef08a', '#facc15', '#6ee7b7', '#38bdf8', '#f472b6', '#ffffff'];
      for (let i = 0; i < 14; i++) {
        const angle = (i * Math.PI * 2) / 14 + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 4.5;
        clickSparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2.5,
          alpha: 1.0,
          color: colors[i % colors.length],
          life: 0.6 + Math.random() * 0.4,
        });
      }
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Smooth Spring Lerp for spirit cursor head
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.28;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.28;
      setPos({ x: currentPos.current.x, y: currentPos.current.y });

      // Emit trailing stardust motes when mouse is moving
      const moveDist = Math.hypot(
        currentPos.current.x - prevPos.current.x,
        currentPos.current.y - prevPos.current.y
      );

      if (moveDist > 1.2 && isVisible) {
        const trailColors = ['#fef08a', '#fde047', '#facc15', '#fbbf24', '#ffffff'];
        trailParticles.current.push({
          x: currentPos.current.x + (Math.random() - 0.5) * 4,
          y: currentPos.current.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 + 0.3,
          size: 2.2 + Math.random() * 2.0,
          alpha: 0.85,
          color: trailColors[Math.floor(Math.random() * trailColors.length)],
          life: 0.5 + Math.random() * 0.35,
          maxLife: 0.7,
        });
      }

      prevPos.current = { ...currentPos.current };

      // Render Canvas Particles (Sparks & Trail)
      const canvas = canvasRef.current;
      if (canvas) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update & Render Trail Particles
          for (let i = trailParticles.current.length - 1; i >= 0; i--) {
            const p = trailParticles.current[i];
            p.life -= dt;
            if (p.life <= 0) {
              trailParticles.current.splice(i, 1);
              continue;
            }

            p.x += p.vx;
            p.y += p.vy;
            const progress = p.life / p.maxLife;

            ctx.save();
            ctx.globalAlpha = progress * p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Update & Render Click Sparks
          for (let i = clickSparks.current.length - 1; i >= 0; i--) {
            const s = clickSparks.current[i];
            s.life -= dt * 1.5;
            if (s.life <= 0) {
              clickSparks.current.splice(i, 1);
              continue;
            }

            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.94;
            s.vy *= 0.94;

            ctx.save();
            ctx.globalAlpha = Math.max(0, s.life) * s.alpha;
            ctx.fillStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * Math.max(0, s.life), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Particle Canvas for Stardust Trail & Sparks */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />

      {/* Main Glowing Spirit Cursor Head */}
      <div
        className="fixed pointer-events-none transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.8 : isHoveringClickable ? 1.5 : 1})`,
        }}
      >
        {/* Luminous Spirit Ambient Glow Halo */}
        <div
          className={`absolute inset-0 rounded-full blur-md transition-all duration-300 ${
            isHoveringClickable
              ? 'w-12 h-12 -left-3 -top-3 bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-amber-500/40 animate-pulse'
              : 'w-8 h-8 -left-2 -top-2 bg-amber-400/35'
          }`}
        />

        {/* Outer Celestial Targeting Ring (Expands & Rotates on Hover) */}
        {isHoveringClickable && (
          <div className="absolute -inset-3 w-10 h-10 rounded-full border-2 border-dashed border-amber-300/80 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-spin" style={{ animationDuration: '6s' }} />
        )}

        {/* Spirit Core Orb */}
        <div
          className={`relative rounded-full shadow-[0_0_16px_rgba(245,158,11,0.9)] border transition-all duration-200 ${
            isHoveringClickable
              ? 'w-4 h-4 bg-gradient-to-tr from-amber-400 to-yellow-200 border-white'
              : 'w-3 h-3 bg-[#fef08a] border-amber-200'
          }`}
        >
          {/* Inner Light Flare */}
          <div className="absolute inset-0.5 rounded-full bg-white opacity-90 animate-ping" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>
    </div>
  );
};
