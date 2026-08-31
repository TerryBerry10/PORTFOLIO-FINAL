import React, { useRef, useState } from 'react';
import { BeforeAfterComparison } from '../../types/project';
import { Columns, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  comparison: BeforeAfterComparison;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ comparison }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="bg-paper-50 border border-paper-300 rounded-xl p-5 shadow-journal">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <Columns className="w-5 h-5 text-moss-700" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-charcoal-900">
            // BEFORE / AFTER ITERATION COMPARISON
          </h4>
        </div>
        <span className="text-[11px] font-mono text-charcoal-600 bg-paper-200 px-2.5 py-0.5 rounded">
          Drag slider to compare
        </span>
      </div>

      <div className="mb-3">
        <h5 className="font-bold text-sm text-charcoal-900 mb-1">{comparison.title}</h5>
        <p className="text-xs text-charcoal-700">{comparison.description}</p>
      </div>

      {/* Comparison Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="relative w-full h-56 sm:h-72 rounded-lg overflow-hidden select-none cursor-ew-resize border border-charcoal-800 bg-charcoal-950"
      >
        {/* Right Side (After / Optimized) */}
        <div className="absolute inset-0 bg-gradient-to-br from-moss-900 via-charcoal-900 to-charcoal-950 p-6 flex flex-col justify-center items-end text-right">
          <div className="max-w-xs space-y-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-moss-300 bg-moss-950/80 border border-moss-700 px-2 py-0.5 rounded font-bold">
              <Sparkles className="w-3 h-3" />
              {comparison.afterLabel}
            </span>
            <p className="text-xs text-paper-200 leading-relaxed font-mono">
              ✓ Sub-frame analytical sweep<br/>
              ✓ Zero allocation runtime buffers<br/>
              ✓ 120 FPS frame-perfect registration
            </p>
          </div>
        </div>

        {/* Left Side (Before / Prototype - Clipped) */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-br from-sunset-900/40 via-charcoal-900 to-charcoal-950 p-6 flex flex-col justify-center items-start overflow-hidden border-r-2 border-gold-400"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="min-w-[280px] max-w-xs space-y-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sunset-300 bg-sunset-950/80 border border-sunset-700 px-2 py-0.5 rounded font-bold">
              ⚠ {comparison.beforeLabel}
            </span>
            <p className="text-xs text-charcoal-300 leading-relaxed font-mono">
              ✗ Discrete PhysX collision triggers<br/>
              ✗ High-speed weapon tunneling misses<br/>
              ✗ GC stutter on impact instantiation
            </p>
          </div>
        </div>

        {/* Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 -ml-3.5 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-gold-500 text-charcoal-950 shadow-soft-glow flex items-center justify-center font-bold text-xs">
            ⇄
          </div>
        </div>
      </div>

      <p className="text-[11px] text-charcoal-600 font-mono mt-3 bg-paper-100 p-2 rounded border border-paper-200">
        <strong className="text-charcoal-800 font-sans">Engineering Notes:</strong> {comparison.notes}
      </p>
    </div>
  );
};
