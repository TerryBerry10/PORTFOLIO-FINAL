import React, { useEffect, useRef, useState } from 'react';
import { PlaygroundParam } from '../../types/project';
import { Sliders, RotateCcw, Play, Zap } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface LivePlaygroundProps {
  type: 'combat-sandbox' | 'gravity-orbits' | 'platformer-feel' | 'wind-grass' | 'procedural-dungeon';
  description: string;
  params: PlaygroundParam[];
}

export const LivePlayground: React.FC<LivePlaygroundProps> = ({ type, description, params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    params.forEach(p => {
      initial[p.id] = p.defaultValue;
    });
    return initial;
  });

  const [interactionHint, setInteractionHint] = useState<string>('Click canvas to interact');

  const handleSliderChange = (id: string, value: number) => {
    setParamValues(prev => ({ ...prev, [id]: value }));
    AudioEngine.playSfx('sliderChange');
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    params.forEach(p => {
      initial[p.id] = p.defaultValue;
    });
    setParamValues(initial);
    AudioEngine.playSfx('interact');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let stateVal = {
      playerAttackTime: 0,
      comboStep: 0,
      hitstopTimer: 0,
      cameraShake: 0,
      orbitBodies: Array.from({ length: Math.min(paramValues['bodyCount'] || 120, 200) }, (_, i) => ({
        x: 200 + Math.cos((i / 20) * Math.PI * 2) * (50 + (i % 5) * 22),
        y: 140 + Math.sin((i / 20) * Math.PI * 2) * (50 + (i % 5) * 22),
        vx: -Math.sin((i / 20) * Math.PI * 2) * 1.8,
        vy: Math.cos((i / 20) * Math.PI * 2) * 1.8,
        color: i % 2 === 0 ? '#7ca5b8' : '#e5b76b',
      })),
      grassBlades: Array.from({ length: 90 }, (_, i) => ({
        x: 10 + i * 5.2,
        height: 35 + (i % 7) * 4,
        tipOffset: 0,
        tipVelocity: 0,
      })),
    };

    const handleCanvasClick = () => {
      AudioEngine.playSfx('buttonHover');
      if (type === 'combat-sandbox') {
        stateVal.comboStep = (stateVal.comboStep + 1) % 3;
        stateVal.playerAttackTime = 0.4;
        stateVal.hitstopTimer = (paramValues['hitstop'] || 6) * 0.016;
        stateVal.cameraShake = (paramValues['cameraTrauma'] || 40) * 0.2;
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    const render = () => {
      time += 0.016 * (paramValues['timeScale'] || 1.0);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#1a1d20';
      ctx.fillRect(0, 0, width, height);

      if (type === 'combat-sandbox') {
        // Combat Hitstop & Trajectory Simulator
        if (stateVal.hitstopTimer > 0) {
          stateVal.hitstopTimer -= 0.016;
        } else if (stateVal.playerAttackTime > 0) {
          stateVal.playerAttackTime -= 0.016 * (paramValues['attackSpeed'] || 1.0);
        }

        const shakeX = (Math.random() - 0.5) * stateVal.cameraShake;
        const shakeY = (Math.random() - 0.5) * stateVal.cameraShake;
        stateVal.cameraShake = Math.max(0, stateVal.cameraShake - 0.4);

        ctx.save();
        ctx.translate(shakeX, shakeY);

        // Ground line
        ctx.strokeStyle = '#3c4249';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, 220);
        ctx.lineTo(width - 30, 220);
        ctx.stroke();

        // Target Dummy
        const dummyX = width * 0.65;
        const isHit = stateVal.hitstopTimer > 0;
        ctx.fillStyle = isHit ? '#e07a5f' : '#6b706c';
        ctx.fillRect(dummyX - 15, 140, 30, 80);

        // Player Attacker
        const playerX = width * 0.35;
        ctx.fillStyle = '#3d5a45';
        ctx.fillRect(playerX - 12, 145, 24, 75);

        // Swept Sword Arc
        if (stateVal.playerAttackTime > 0) {
          const progress = 1 - stateVal.playerAttackTime / 0.4;
          const arcAngle = -Math.PI * 0.4 + progress * Math.PI * 0.8;

          ctx.save();
          ctx.translate(playerX, 175);
          ctx.strokeStyle = isHit ? '#f2d192' : '#7ca5b8';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(0, 0, 55, -Math.PI * 0.4, arcAngle);
          ctx.stroke();

          // Sword Blade
          ctx.fillStyle = '#ffffff';
          ctx.rotate(arcAngle);
          ctx.fillRect(10, -3, 50, 6);
          ctx.restore();
        }

        // Status text
        ctx.fillStyle = isHit ? '#f2d192' : '#a8b3be';
        ctx.font = '600 11px monospace';
        ctx.fillText(
          isHit ? `⚡ HITSTOP ACTIVE (${(stateVal.hitstopTimer * 1000).toFixed(0)}ms) // IMPACT` : `CLICK TO ATTACK // COMBO STEP ${stateVal.comboStep + 1}`,
          20,
          30
        );

        ctx.restore();
      } else if (type === 'gravity-orbits') {
        // Celestial Gravity Well
        const cx = width * 0.5;
        const cy = height * 0.5;
        const G = paramValues['gravitationalG'] || 65;
        const eps = paramValues['softening'] || 25;

        // Central Star / Black Hole
        ctx.fillStyle = '#d4a359';
        ctx.shadowColor = '#d4a359';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Orbiting Particles
        stateVal.orbitBodies.forEach(b => {
          const dx = cx - b.x;
          const dy = cy - b.y;
          const dist = Math.hypot(dx, dy) + eps;
          const force = (G * 80) / (dist * dist);
          b.vx += (dx / dist) * force * 0.05;
          b.vy += (dy / dist) * force * 0.05;
          b.x += b.vx;
          b.y += b.vy;

          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'wind-grass') {
        // Foliage Wind Wave Simulation
        const windVel = paramValues['windSpeed'] || 1.2;
        const gustAmp = paramValues['windStrength'] || 0.8;

        stateVal.grassBlades.forEach((blade, i) => {
          const wave = Math.sin(time * windVel * 3 + blade.x * 0.03) * (gustAmp * 15);
          ctx.strokeStyle = i % 2 === 0 ? '#4c785d' : '#3d5a45';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(blade.x, 230);
          ctx.quadraticCurveTo(blade.x + wave * 0.5, 230 - blade.height * 0.6, blade.x + wave, 230 - blade.height);
          ctx.stroke();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [type, paramValues]);

  return (
    <div className="bg-paper-50 border border-paper-300 rounded-xl p-5 shadow-journal">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-moss-700" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-charcoal-900">
            // LIVE GAME SYSTEM PLAYGROUND
          </h4>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] font-mono text-charcoal-700 hover:text-charcoal-950 bg-paper-200 hover:bg-paper-300 px-2.5 py-1 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <p className="text-xs text-charcoal-700 mb-4">{description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full rounded-lg overflow-hidden border border-charcoal-800 shadow-inner">
            <canvas
              ref={canvasRef}
              width={480}
              height={260}
              className="w-full h-auto block cursor-pointer bg-charcoal-950"
            />
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-paper-300 bg-charcoal-900/80 px-2 py-0.5 rounded border border-charcoal-700">
              Interactive Canvas (60 FPS)
            </span>
          </div>
        </div>

        {/* Real-time Parameter Sliders */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
          {params.map(p => {
            const currentVal = paramValues[p.id] ?? p.defaultValue;
            return (
              <div key={p.id} className="bg-paper-100 p-3 rounded-lg border border-paper-300">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-charcoal-900">{p.name}</label>
                  <span className="text-xs font-mono font-bold text-moss-800 bg-paper-200 px-1.5 py-0.5 rounded">
                    {currentVal} {p.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={currentVal}
                  onChange={e => handleSliderChange(p.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-paper-300 rounded-lg appearance-none cursor-pointer accent-moss-600"
                />
                <div className="flex justify-between text-[10px] text-charcoal-600 font-mono mt-1">
                  <span>{p.min}</span>
                  <span className="truncate max-w-[180px] text-charcoal-500">{p.description}</span>
                  <span>{p.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
