import React, { useState } from 'react';
import { journeyMilestones } from '../../data/milestones';
import { X, Sparkles, Compass, Gamepad2, Play } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';
import { projects } from '../../data/projects';

interface JourneyTreeModalProps {
  onClose: () => void;
}

export const JourneyTreeModal: React.FC<JourneyTreeModalProps> = ({ onClose }) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(journeyMilestones[0]?.id || 'dottie');

  const selectedMilestone = journeyMilestones.find(m => m.id === selectedMilestoneId) || journeyMilestones[0];
  const matchingProject = projects.find(p => p.id === selectedMilestone?.id);

  const handleSelect = (id: string) => {
    AudioEngine.playSfx('buttonHover');
    setSelectedMilestoneId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Frosted Transparent Glass Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col my-auto shadow-[0_20px_70px_rgba(0,0,0,0.9)] rounded-3xl border-2 border-white/20 bg-black/35 backdrop-blur-2xl overflow-hidden text-white">
        
        {/* Transparent Glass Header Bar */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/15 bg-white/[0.04]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>// ABOUT & SHIPPED GAMES JOURNEY</span>
                </div>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold mb-1">
                  {journeyMilestones.length} SHIPPED GAMES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                ABOUT & SHIPPED TITLES
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <p className="text-sm sm:text-base text-paper-200 leading-relaxed max-w-3xl font-sans">
            I am <strong className="text-white font-bold">Vinay Sankar</strong>, a Game Developer and Technical Artist who builds high-impact games, shaders, and living playable worlds. Below are the architectural breakdowns and gameplay mechanics across my 3 shipped titles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 3 Games List Sidebar */}
            <div className="md:col-span-5 space-y-3">
              {journeyMilestones.map(m => {
                const isSelected = m.id === selectedMilestoneId;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer shadow-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/70 via-yellow-950/50 to-amber-900/40 text-white border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] font-bold scale-[1.02]'
                        : 'bg-black/45 hover:bg-black/65 border-white/15 text-paper-200 hover:border-amber-400/50 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm sm:text-base font-bold font-sans">{m.title}</div>
                      <div className={`text-xs font-mono mt-1 ${isSelected ? 'text-amber-300 font-bold' : 'text-paper-400'}`}>
                        {m.category}
                      </div>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full shrink-0 ml-2 font-bold ${
                      isSelected ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50' : 'bg-white/10 text-paper-300 border border-white/10'
                    }`}>
                      {m.year}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Game Details */}
            {selectedMilestone && (
              <div className="md:col-span-7 bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
                      {selectedMilestone.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-200 bg-amber-900/30 border border-amber-500/30 px-3 py-1 rounded-full">
                      YEAR // {selectedMilestone.year}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-sans text-white mb-2">{selectedMilestone.title}</h3>
                  <div className="text-xs font-mono text-amber-300 mb-4 font-semibold">
                    Core Artifact: {selectedMilestone.artifact}
                  </div>

                  <p className="text-sm sm:text-base text-paper-200 leading-relaxed mb-6 font-sans">
                    {selectedMilestone.story}
                  </p>

                  <div className="bg-black/50 border-l-4 border-amber-400 p-4 rounded-r-xl shadow-inner">
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold mb-1">
                      Key Technical Takeaway:
                    </div>
                    <div className="text-sm italic text-paper-100 font-sans">
                      "{selectedMilestone.lesson}"
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-paper-400 mb-2">
                      Technologies & Systems Engineered:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMilestone.technologies.map(tech => (
                        <span key={tech} className="text-xs font-mono bg-black/50 text-paper-200 px-3 py-1 rounded-full border border-white/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Play Game Direct CTA */}
                  {matchingProject?.playableUrl && (
                    <div className="pt-2">
                      <a
                        href={matchingProject.playableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer active:scale-95"
                      >
                        <Gamepad2 className="w-4 h-4 text-slate-950" />
                        <span>LAUNCH & PLAY {selectedMilestone.title.split('—')[0].trim().toUpperCase()}</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs font-mono text-paper-300 gap-2">
            <span>VINAY SANKAR // GAME DEVELOPER & TECHNICAL ARTIST</span>
            <span className="text-amber-400 font-bold">
              BANGALORE, INDIA · OPEN FOR FULL-TIME & REMOTE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
