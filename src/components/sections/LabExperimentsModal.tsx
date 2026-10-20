import React, { useEffect, useRef, useState } from 'react';
import { labExperiments } from '../../data/experiments';
import { X, Code, Sparkles, FlaskConical, Play, RefreshCw } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface LabExperimentsModalProps {
  onClose: () => void;
}

export const LabExperimentsModal: React.FC<LabExperimentsModalProps> = ({ onClose }) => {
  const [selectedExpId, setSelectedExpId] = useState<string>(labExperiments[0]?.id || 'exp-boids');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedExp = labExperiments.find(e => e.id === selectedExpId) || labExperiments[0];

  const handleSelectExp = (id: string) => {
    AudioEngine.playSfx('buttonHover');
    setSelectedExpId(id);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let mousePos = { x: 240, y: 130, isDown: false, isInside: false };

    // --- SIMULATION 1: Boids State ---
    const boidColors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fde047'];
    const boids = Array.from({ length: 75 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 260,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: 4 + Math.random() * 2.5,
      color: boidColors[Math.floor(Math.random() * boidColors.length)],
    }));

    // --- SIMULATION 2: Grass Wind State ---
    const grassBlades = Array.from({ length: 55 }, (_, i) => ({
      baseX: 18 + i * 8.2,
      baseY: 245,
      height: 60 + Math.sin(i * 0.5) * 25 + Math.random() * 20,
      tipOffset: 0,
      tipVel: 0,
      width: 3.5 + Math.random() * 2,
      color: i % 2 === 0 ? '#34d399' : '#10b981',
    }));

    // --- SIMULATION 3: Gravity Well Satellites State ---
    const satellites: Array<{ x: number; y: number; vx: number; vy: number; color: string; trail: Array<{ x: number; y: number }> }> = [];
    const initSatellites = () => {
      satellites.length = 0;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 70 + (i % 3) * 30;
        const speed = Math.sqrt(850 / radius);
        satellites.push({
          x: 240 + Math.cos(angle) * radius,
          y: 130 + Math.sin(angle) * radius,
          vx: -Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          color: boidColors[i % boidColors.length],
          trail: [],
        });
      }
    };
    initSatellites();

    // --- SIMULATION 4: Verlet Rope State ---
    const ropeNodeCount = 14;
    const ropeNodes = Array.from({ length: ropeNodeCount }, (_, i) => ({
      x: 80 + i * 24,
      y: 50 + i * 8,
      oldX: 80 + i * 24,
      oldY: 50 + i * 8,
      pinned: i === 0,
    }));

    // Canvas Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mousePos.y = (e.clientY - rect.top) * (canvas.height / rect.height);
      mousePos.isInside = true;
    };

    const handleMouseDown = () => {
      mousePos.isDown = true;
      AudioEngine.playSfx('buttonHover');

      if (selectedExp.id === 'exp-boids') {
        // Scatter / burst boids on click
        for (const b of boids) {
          const dx = b.x - mousePos.x;
          const dy = b.y - mousePos.y;
          const dist = Math.hypot(dx, dy) || 1;
          b.vx += (dx / dist) * 7;
          b.vy += (dy / dist) * 7;
        }
      } else if (selectedExp.id === 'exp-gravity') {
        // Launch a new satellite towards mouse tangent
        const dx = mousePos.x - 240;
        const dy = mousePos.y - 130;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = Math.sqrt(850 / dist);
        satellites.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: -dy / dist * speed * 1.2,
          vy: dx / dist * speed * 1.2,
          color: boidColors[satellites.length % boidColors.length],
          trail: [],
        });
        if (satellites.length > 14) satellites.shift();
      }
    };

    const handleMouseUp = () => {
      mousePos.isDown = false;
    };

    const handleMouseLeave = () => {
      mousePos.isInside = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      time += 0.016;
      const width = canvas.width;
      const height = canvas.height;

      // Dark futuristic obsidian grid canvas background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Subtle Tech Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // =========================================================================
      // 1. FLOCKING BOIDS & PREDATOR EVASION
      // =========================================================================
      if (selectedExp.id === 'exp-boids' || selectedExp.interactiveDemoId === 'boids') {
        const isPredator = mousePos.isDown;

        for (let i = 0; i < boids.length; i++) {
          const b = boids[i];

          // Craig Reynolds Flocking Forces
          let sepX = 0, sepY = 0, sepCount = 0;
          let aliX = 0, aliY = 0, aliCount = 0;
          let cohX = 0, cohY = 0, cohCount = 0;

          for (let j = 0; j < boids.length; j++) {
            if (i === j) continue;
            const other = boids[j];
            const dx = b.x - other.x;
            const dy = b.y - other.y;
            const d = Math.hypot(dx, dy);

            if (d < 24 && d > 0) {
              sepX += dx / d;
              sepY += dy / d;
              sepCount++;
            }
            if (d < 50) {
              aliX += other.vx;
              aliY += other.vy;
              aliCount++;
              cohX += other.x;
              cohY += other.y;
              cohCount++;
            }
          }

          if (sepCount > 0) {
            b.vx += (sepX / sepCount) * 0.15;
            b.vy += (sepY / sepCount) * 0.15;
          }
          if (aliCount > 0) {
            b.vx += ((aliX / aliCount) - b.vx) * 0.05;
            b.vy += ((aliY / aliCount) - b.vy) * 0.05;
          }
          if (cohCount > 0) {
            const targetX = cohX / cohCount;
            const targetY = cohY / cohCount;
            b.vx += ((targetX - b.x) / 50) * 0.03;
            b.vy += ((targetY - b.y) / 50) * 0.03;
          }

          // Mouse Attraction or Predation Repulsion
          if (mousePos.isInside) {
            const mdx = mousePos.x - b.x;
            const mdy = mousePos.y - b.y;
            const mDist = Math.hypot(mdx, mdy) || 1;

            if (isPredator) {
              // Mouse is predator (scatter away)
              if (mDist < 140) {
                b.vx -= (mdx / mDist) * 0.45;
                b.vy -= (mdy / mDist) * 0.45;
              }
            } else {
              // Mouse is gentle attractor
              if (mDist < 200) {
                b.vx += (mdx / mDist) * 0.08;
                b.vy += (mdy / mDist) * 0.08;
              }
            }
          }

          // Speed limit
          const speed = Math.hypot(b.vx, b.vy);
          const maxSpeed = 3.6;
          if (speed > maxSpeed) {
            b.vx = (b.vx / speed) * maxSpeed;
            b.vy = (b.vy / speed) * maxSpeed;
          }

          b.x += b.vx;
          b.y += b.vy;

          // Wrap edges
          if (b.x < -10) b.x = width + 10;
          if (b.x > width + 10) b.x = -10;
          if (b.y < -10) b.y = height + 10;
          if (b.y > height + 10) b.y = -10;

          // Render glowing aerodynamic boid dart
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.atan2(b.vy, b.vx));

          ctx.fillStyle = b.color;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 8;

          ctx.beginPath();
          ctx.moveTo(b.size * 1.5, 0);
          ctx.lineTo(-b.size, -b.size * 0.7);
          ctx.lineTo(-b.size * 0.5, 0);
          ctx.lineTo(-b.size, b.size * 0.7);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }

        // Draw Mouse Reticle
        if (mousePos.isInside) {
          ctx.save();
          ctx.strokeStyle = isPredator ? '#ef4444' : '#38bdf8';
          ctx.fillStyle = isPredator ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mousePos.x, mousePos.y, isPredator ? 35 : 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // 2. PROCEDURAL WIND & GRASS BLADE DISPLACEMENT
      // =========================================================================
      else if (selectedExp.id === 'exp-grass' || selectedExp.interactiveDemoId === 'grass-wind') {
        // Ground line
        ctx.fillStyle = '#062015';
        ctx.fillRect(0, 240, width, 20);

        for (const blade of grassBlades) {
          // Wind wave function
          const windGust = Math.sin(time * 2.5 + blade.baseX * 0.02) * 14 + Math.cos(time * 4.2 + blade.baseX * 0.05) * 6;

          // Mouse trample interaction
          let mousePush = 0;
          if (mousePos.isInside) {
            const dx = blade.baseX - mousePos.x;
            const dy = (blade.baseY - blade.height * 0.5) - mousePos.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 45) {
              mousePush = (dx / dist) * (45 - dist) * 1.2;
            }
          }

          // Spring-Damper physics
          const k = 0.12; // Spring stiffness
          const c = 0.08; // Damping
          const targetOffset = windGust + mousePush;
          const springForce = -k * (blade.tipOffset - targetOffset);
          const dampingForce = -c * blade.tipVel;
          blade.tipVel += springForce + dampingForce;
          blade.tipOffset += blade.tipVel;

          // Render glowing grass blade
          const tipX = blade.baseX + blade.tipOffset;
          const tipY = blade.baseY - blade.height;
          const midX = blade.baseX + blade.tipOffset * 0.45;
          const midY = blade.baseY - blade.height * 0.55;

          const bladeGrad = ctx.createLinearGradient(blade.baseX, blade.baseY, tipX, tipY);
          bladeGrad.addColorStop(0, '#064e3b');
          bladeGrad.addColorStop(0.6, blade.color);
          bladeGrad.addColorStop(1, '#a7f3d0');

          ctx.save();
          ctx.strokeStyle = bladeGrad;
          ctx.lineWidth = blade.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(blade.baseX, blade.baseY);
          ctx.quadraticCurveTo(midX, midY, tipX, tipY);
          ctx.stroke();

          // Bioluminescent spore at tip
          ctx.fillStyle = '#6ee7b7';
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // =========================================================================
      // 3. ORBITAL GRAVITY WELL & PARTICLE TRAJECTORIES
      // =========================================================================
      else if (selectedExp.id === 'exp-gravity' || selectedExp.interactiveDemoId === 'gravity-field') {
        const centerX = 240;
        const centerY = 130;
        const G = 800;

        // Central Cosmic Singularity / Star
        const pulse = Math.sin(time * 3) * 3;
        const starGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 45);
        starGlow.addColorStop(0, '#ffffff');
        starGlow.addColorStop(0.3, '#f59e0b');
        starGlow.addColorStop(0.7, '#d97706');
        starGlow.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = starGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 9 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update and Render Orbiting Satellites
        for (let i = satellites.length - 1; i >= 0; i--) {
          const s = satellites[i];
          const dx = centerX - s.x;
          const dy = centerY - s.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq) || 1;

          // Inverse-square gravity
          const force = G / Math.max(distSq, 400);
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;

          s.x += s.vx;
          s.y += s.vy;

          s.trail.push({ x: s.x, y: s.y });
          if (s.trail.length > 25) s.trail.shift();

          // Render trailing orbital ribbon
          if (s.trail.length > 1) {
            ctx.save();
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 1.8;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(s.trail[0].x, s.trail[0].y);
            for (let t = 1; t < s.trail.length; t++) {
              ctx.lineTo(s.trail[t].x, s.trail[t].y);
            }
            ctx.stroke();
            ctx.restore();
          }

          // Satellite Body
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // =========================================================================
      // 4. VERLET INTEGRATION FABRIC & ROPE PHYSICS
      // =========================================================================
      else if (selectedExp.id === 'exp-rope' || selectedExp.interactiveDemoId === 'rope-verlet') {
        const gravity = 0.35;
        const segmentLen = 18;

        // Verlet integration step
        for (let iter = 0; iter < 10; iter++) {
          for (let i = 0; i < ropeNodes.length; i++) {
            const p = ropeNodes[i];
            if (!p.pinned) {
              if (iter === 0) {
                const vx = (p.x - p.oldX) * 0.98;
                const vy = (p.y - p.oldY) * 0.98 + gravity;
                p.oldX = p.x;
                p.oldY = p.y;
                p.x += vx;
                p.y += vy;
              }

              // Mouse drag interaction
              if (mousePos.isDown && mousePos.isInside) {
                const mdx = mousePos.x - p.x;
                const mdy = mousePos.y - p.y;
                const mDist = Math.hypot(mdx, mdy);
                if (mDist < 50) {
                  p.x += mdx * 0.3;
                  p.y += mdy * 0.3;
                }
              }
            }
          }

          // Jakobsen distance constraint relaxation
          for (let i = 0; i < ropeNodes.length - 1; i++) {
            const p1 = ropeNodes[i];
            const p2 = ropeNodes[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const diff = (dist - segmentLen) / dist;
            const offsetX = dx * 0.5 * diff;
            const offsetY = dy * 0.5 * diff;

            if (!p1.pinned) {
              p1.x += offsetX;
              p1.y += offsetY;
            }
            if (!p2.pinned) {
              p2.x -= offsetX;
              p2.y -= offsetY;
            }
          }
        }

        // Draw glowing laser rope / suspension cable
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(ropeNodes[0].x, ropeNodes[0].y);
        for (let i = 1; i < ropeNodes.length; i++) {
          ctx.lineTo(ropeNodes[i].x, ropeNodes[i].y);
        }
        ctx.stroke();

        // Draw pinned anchor at top
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ropeNodes[0].x, ropeNodes[0].y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw swinging glowing Japanese paper lantern at end of rope
        const lastNode = ropeNodes[ropeNodes.length - 1];
        ctx.translate(lastNode.x, lastNode.y);

        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.roundRect(-10, 0, 20, 26, 6);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 13, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedExp]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'AI / Boids': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Shaders': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Physics': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Kinematics': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Sleek Technical Art Obsidian Glassmorphism Container */}
      <div className="relative w-full max-w-5xl bg-[#030712]/90 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto flex flex-col max-h-[92vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.03] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// LAB · SMALL EXPERIMENTS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                Interactive Micro-Simulations & Systems
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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Experiment Picker Sidebar */}
            <div className="md:col-span-4 space-y-3">
              {labExperiments.map(e => {
                const isSelected = e.id === selectedExpId;
                return (
                  <button
                    key={e.id}
                    onClick={() => handleSelectExp(e.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-indigo-950/40 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.02]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-paper-300 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-sans font-bold leading-tight">{e.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getCategoryColor(e.category)}`}>
                        {e.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" /> ACTIVE
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Canvas Viewport & Code Area */}
            <div className="md:col-span-8 space-y-4">
              <div className="bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl">
                
                {/* Title & Live Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base sm:text-lg font-sans text-white">{selectedExp.title}</h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 font-bold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    60 FPS Live Canvas
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-paper-300 mb-4 font-sans leading-relaxed">{selectedExp.shortDesc}</p>

                {/* 60 FPS Interactive Canvas */}
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/90 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={260}
                    className="w-full h-auto block cursor-crosshair"
                  />
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-cyan-200 bg-black/85 px-3.5 py-2 rounded-xl border border-cyan-500/40 backdrop-blur-md font-bold shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span className="truncate">{selectedExp.instruction}</span>
                  </div>
                </div>

                {/* Code Snippet Highlight */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span>ALGORITHM / SHADER SNIPPET</span>
                    </div>
                    <span className="text-[10px] font-mono text-paper-400 uppercase">
                      {selectedExp.tech?.join(' · ')}
                    </span>
                  </div>
                  <pre className="bg-[#030712] text-cyan-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-white/15 shadow-inner">
                    <code>{selectedExp.codeSnippet}</code>
                  </pre>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.03] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <span className="text-cyan-400 font-bold">// RUNS IN YOUR BROWSER</span>
          <span>HTML5 CANVAS</span>
        </div>
      </div>
    </div>
  );
};
