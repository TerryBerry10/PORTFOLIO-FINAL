import React, { useEffect, useRef } from 'react';

export const InteractiveSpiritCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Hide standard cursor only on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.body.style.cursor = 'none';

    let mouseX = -100;
    let mouseY = -100;
    let isVisible = false;
    let isHovering = false;
    let isDown = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
      }

      // Direct hardware-accelerated 0-latency transform (1:1 mouse tracking)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check clickable targets without triggering React re-renders
      const target = e.target as HTMLElement | null;
      const clickable = Boolean(
        target && (
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('input') ||
          target.closest('select') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A'
        )
      );

      if (clickable !== isHovering) {
        isHovering = clickable;
        if (ringRef.current && coreRef.current) {
          if (isHovering) {
            ringRef.current.style.transform = 'scale(1.75)';
            ringRef.current.style.borderColor = 'rgba(250, 204, 21, 0.9)';
            coreRef.current.style.transform = 'scale(1.25)';
            coreRef.current.style.backgroundColor = '#ffffff';
          } else {
            ringRef.current.style.transform = isDown ? 'scale(0.85)' : 'scale(1)';
            ringRef.current.style.borderColor = 'rgba(245, 158, 11, 0.45)';
            coreRef.current.style.transform = isDown ? 'scale(0.8)' : 'scale(1)';
            coreRef.current.style.backgroundColor = '#fef08a';
          }
        }
      }
    };

    const onMouseDown = () => {
      isDown = true;
      if (ringRef.current && coreRef.current) {
        ringRef.current.style.transform = 'scale(0.8)';
        coreRef.current.style.transform = 'scale(0.75)';
      }
    };

    const onMouseUp = () => {
      isDown = false;
      if (ringRef.current && coreRef.current) {
        ringRef.current.style.transform = isHovering ? 'scale(1.75)' : 'scale(1)';
        coreRef.current.style.transform = isHovering ? 'scale(1.25)' : 'scale(1)';
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 select-none will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'opacity 0.15s ease',
      }}
    >
      {/* Outer Luminous Halo & Targeting Ring */}
      <div
        ref={ringRef}
        className="absolute -top-4 -left-4 w-8 h-8 rounded-full border border-amber-500/45 bg-amber-400/10 backdrop-blur-[0.5px] transition-transform duration-100 ease-out flex items-center justify-center pointer-events-none shadow-[0_0_12px_rgba(245,158,11,0.35)]"
      >
        {/* Glowing Spirit Core */}
        <div
          ref={coreRef}
          className="w-2 h-2 rounded-full bg-[#fef08a] shadow-[0_0_8px_rgba(255,255,255,0.95)] transition-transform duration-100 ease-out"
        />
      </div>
    </div>
  );
};
