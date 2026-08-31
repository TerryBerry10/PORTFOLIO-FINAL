import React, { useState } from 'react';
import { XRayDebugData } from '../../types/project';
import { Eye, EyeOff, Activity, ShieldAlert, Navigation, Cpu } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface XRayViewerProps {
  data: XRayDebugData;
}

export const XRayViewer: React.FC<XRayViewerProps> = ({ data }) => {
  const [isXRayActive, setIsXRayActive] = useState<boolean>(false);

  const toggleXRay = () => {
    AudioEngine.playSfx('interact');
    setIsXRayActive(prev => !prev);
  };

  return (
    <div className="bg-charcoal-900 text-charcoal-100 border border-charcoal-800 rounded-xl p-5 shadow-journal">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gold-400" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-paper-100">
            // ENGINE X-RAY MODE & RUNTIME TELEMETRY
          </h4>
        </div>
        <button
          onClick={toggleXRay}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-mono text-xs font-bold transition-all ${
            isXRayActive
              ? 'bg-gold-500 text-charcoal-950 shadow-soft-glow'
              : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
          }`}
        >
          {isXRayActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{isXRayActive ? 'X-RAY ACTIVE' : 'ACTIVATE X-RAY'}</span>
        </button>
      </div>

      {isXRayActive ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Real-time Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-charcoal-950 p-3.5 rounded-lg border border-charcoal-800">
            <div>
              <span className="text-[10px] font-mono text-charcoal-400 uppercase">Draw Calls</span>
              <div className="text-sm font-mono font-bold text-gold-400">{data.performance.drawCalls} calls</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-charcoal-400 uppercase">Triangle Count</span>
              <div className="text-sm font-mono font-bold text-fadedSky-300">{data.performance.triangleCount}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-charcoal-400 uppercase">Frame Time</span>
              <div className="text-sm font-mono font-bold text-moss-200">{data.performance.frameTime}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-charcoal-400 uppercase">GC Allocation</span>
              <div className="text-sm font-mono font-bold text-emerald-400">{data.performance.gcAlloc}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Colliders & Hitboxes */}
            <div className="bg-charcoal-950/60 p-4 rounded-lg border border-charcoal-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-gold-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>COLLIDERS & SWEEP VOLUMES</span>
              </div>
              <div className="space-y-2">
                {data.colliders.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs border-l-2 pl-2" style={{ borderColor: c.color }}>
                    <div className="flex-1">
                      <div className="font-mono font-bold text-paper-200">{c.name} <span className="text-[10px] text-charcoal-400">({c.type})</span></div>
                      <div className="text-[11px] text-charcoal-400">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Raycasts & Analytical Probes */}
            <div className="bg-charcoal-950/60 p-4 rounded-lg border border-charcoal-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-fadedSky-300 font-bold">
                <Navigation className="w-4 h-4" />
                <span>ANALYTICAL RAYCAST PROBES</span>
              </div>
              <div className="space-y-2">
                {data.raycasts.map((r, i) => (
                  <div key={i} className="text-xs pb-1.5 border-b border-charcoal-800 last:border-0">
                    <div className="font-mono font-bold text-paper-200">{r.name} <span className="text-[10px] text-fadedSky-400">({r.length}m)</span></div>
                    <div className="text-[11px] text-charcoal-400">{r.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* State Machine Transitions */}
          <div className="bg-charcoal-950/60 p-4 rounded-lg border border-charcoal-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-moss-200 font-bold">
              <Cpu className="w-4 h-4" />
              <span>ACTIVE STATE MACHINE GRAPH</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {data.stateMachines.map((sm, i) => (
                <div key={i} className="bg-charcoal-900 p-2.5 rounded border border-charcoal-800 text-xs">
                  <div className="font-mono text-moss-300 font-bold">{sm.state}</div>
                  <div className="text-[10px] font-mono text-gold-400 my-1">⚡ {sm.trigger}</div>
                  <div className="text-[10px] font-mono text-charcoal-400">↳ {sm.next}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-charcoal-400">
          <EyeOff className="w-8 h-8 mx-auto mb-2 opacity-50 text-charcoal-500" />
          <p className="text-xs mb-1">X-Ray mode is currently inactive.</p>
          <p className="text-[11px] font-mono text-charcoal-500">
            Click &quot;ACTIVATE X-RAY&quot; above to reveal debug hitboxes, raycasts, state transitions, and frame-time telemetry.
          </p>
        </div>
      )}
    </div>
  );
};
