import React from 'react';
import { Terminal, Activity, Cpu, Layers } from 'lucide-react';
import { PlayerState, WorldState, ZoneId } from '../../types/world';

interface DevConsoleProps {
  fps: number;
  frameTime: number;
  playerState: PlayerState;
  activeZoneId: ZoneId | null;
  timeOfDay: string;
  weather: string;
  onClose: () => void;
}

export const DevConsole: React.FC<DevConsoleProps> = ({
  fps,
  frameTime,
  playerState,
  activeZoneId,
  timeOfDay,
  weather,
  onClose
}) => {
  return (
    <div className="fixed top-16 right-4 z-40 w-72 bg-charcoal-950/90 text-gold-400 border border-charcoal-800 rounded-xl p-4 shadow-2xl backdrop-blur-md font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-charcoal-800">
        <div className="flex items-center gap-1.5 font-bold text-paper-200">
          <Terminal className="w-3.5 h-3.5 text-gold-400" />
          <span>ENGINE TELEMETRY</span>
        </div>
        <button
          onClick={onClose}
          className="text-charcoal-500 hover:text-charcoal-300 text-[10px]"
        >
          [ESC / HIDE]
        </button>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-charcoal-400">FPS:</span>
          <span className={fps >= 55 ? 'text-emerald-400 font-bold' : 'text-sunset-400 font-bold'}>
            {fps} FPS ({frameTime} ms)
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-400">PLAYER COORDS:</span>
          <span className="text-fadedSky-300">
            X:{playerState.x.toFixed(0)} Y:{playerState.y.toFixed(0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-400">VELOCITY:</span>
          <span className="text-paper-300">
            [{playerState.vx.toFixed(1)}, {playerState.vy.toFixed(1)}]
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-400">ACTION STATE:</span>
          <span className="text-gold-300 uppercase">{playerState.actionState} ({playerState.facing})</span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-400">ACTIVE ZONE:</span>
          <span className="text-moss-300 font-bold">{activeZoneId ? activeZoneId.toUpperCase() : 'NONE'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-400">TIME / WEATHER:</span>
          <span className="text-paper-300">{timeOfDay.toUpperCase()} · {weather.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
