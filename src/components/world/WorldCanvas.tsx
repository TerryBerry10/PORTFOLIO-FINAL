import React, { useEffect, useRef } from 'react';
import { WorldEngine } from '../../engine/WorldEngine';
import { TimeOfDay, WeatherType, ZoneId } from '../../types/world';

interface WorldCanvasProps {
  onEngineReady: (engine: WorldEngine) => void;
  onZoneChange: (zoneId: ZoneId | null) => void;
  onInteractTrigger: (zoneId: ZoneId) => void;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  onEngineReady,
  onZoneChange,
  onInteractTrigger,
  timeOfDay,
  weather
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WorldEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new WorldEngine(canvas);
    engineRef.current = engine;

    engine.onZoneChange = onZoneChange;
    engine.onInteractTrigger = onInteractTrigger;

    engine.start();
    onEngineReady(engine);

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'KeyE') {
        engine.interact();
      } else {
        engine.player.handleKeyDown(e.code, e.shiftKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      engine.player.handleKeyUp(e.code, e.shiftKey);
    };

    const handleMouseMove = (e: MouseEvent) => {
      engine.setScreenMouse(e.clientX, e.clientY);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      engine.destroy();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Sync environmental changes to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.dayNight.setTime(timeOfDay);
    }
  }, [timeOfDay]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.weather.setWeather(weather);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = (window.innerWidth / dpr) / engineRef.current.camera.zoom;
      const viewH = (window.innerHeight / dpr) / engineRef.current.camera.zoom;
      const camLeft = engineRef.current.camera.x - viewW * 0.5 - 150;
      const camRight = engineRef.current.camera.x + viewW * 0.5 + 150;
      const camTop = engineRef.current.camera.y - viewH * 0.5 - 150;
      const camBottom = engineRef.current.camera.y + viewH * 0.5 + 150;
      engineRef.current.particles.seedWeather(
        weather,
        camLeft,
        camRight,
        camTop,
        camBottom,
        engineRef.current.weather.getWindSpeed()
      );
    }
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block bg-[#020408] touch-none z-0"
    />
  );
};
