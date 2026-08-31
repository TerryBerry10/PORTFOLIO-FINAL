import React from 'react';
import { Sparkles } from 'lucide-react';

interface InteractionPromptProps {
  label: string;
  onClick: () => void;
}

export const InteractionPrompt: React.FC<InteractionPromptProps> = ({ label, onClick }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-bounce">
      <button
        onClick={onClick}
        className="flex items-center gap-2.5 px-5 py-2.5 bg-charcoal-900/90 text-paper-50 hover:bg-charcoal-950 backdrop-blur-md rounded-full border-2 border-gold-400 shadow-soft-glow cursor-pointer transition-all duration-150 active:scale-95"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gold-500 text-charcoal-950 font-mono text-xs font-bold shadow-sm">
          E
        </span>
        <span className="text-xs font-mono font-bold tracking-wide">
          {label}
        </span>
        <Sparkles className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '4s' }} />
      </button>
    </div>
  );
};
