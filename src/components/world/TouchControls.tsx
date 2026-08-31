import React, { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface TouchControlsProps {
  onMove: (x: number, y: number, isRunning: boolean) => void;
  onInteract: () => void;
  activeZoneLabel?: string | null;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onInteract,
  activeZoneLabel
}) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const touchId = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!joystickBaseRef.current) return;
    const touch = e.touches[0];
    touchId.current = touch.identifier;
    isDragging.current = true;
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !joystickBaseRef.current) return;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === touchId.current) {
        updateJoystick(e.touches[i].clientX, e.touches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    touchId.current = null;
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0, false);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const maxRadius = 45;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: dx, y: dy });

    const normalizedX = dx / maxRadius;
    const normalizedY = dy / maxRadius;
    const isRunning = dist > maxRadius * 0.75;
    onMove(normalizedX, normalizedY, isRunning);
  };

  return (
    <div className="fixed inset-x-0 bottom-6 pointer-events-none z-30 flex items-end justify-between px-6 select-none md:hidden">
      {/* Virtual Analogue Joystick */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="pointer-events-auto w-28 h-28 rounded-full bg-charcoal-900/50 backdrop-blur-sm border-2 border-paper-300/40 relative flex items-center justify-center touch-none shadow-lg"
      >
        <div
          className="w-12 h-12 rounded-full bg-paper-100/80 border border-charcoal-800 shadow-md transform transition-transform duration-75"
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>

      {/* Action / Interact Touch Button */}
      {activeZoneLabel && (
        <button
          onTouchStart={() => {
            AudioEngine.playSfx('interact');
            onInteract();
          }}
          className="pointer-events-auto flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gold-500/90 text-charcoal-950 font-bold border-2 border-paper-100 shadow-soft-glow active:scale-95 transition-transform"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono leading-none uppercase">INTERACT</span>
        </button>
      )}
    </div>
  );
};
