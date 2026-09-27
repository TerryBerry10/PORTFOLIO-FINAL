import React from 'react';
import { projects } from '../../data/projects';
import { Project } from '../../types/project';
import { X, Gamepad2, Wrench, FileText, Mail, Sparkles, Milestone, Compass } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface QuickViewModalProps {
  onClose: () => void;
  onOpenBreakdown: (project: Project) => void;
  onOpenSkills: () => void;
  onOpenJourney: () => void;
  onOpenLab: () => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  onClose,
  onOpenSkills,
  onOpenJourney,
  onOpenLab,
  onOpenResume,
  onOpenContact
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-4xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// QUICK INDEX · PORTFOLIO SITEMAP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                Developer Index & Direct Traversal
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

        {/* Sitemap Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Main Sections Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <button
              onClick={() => { onClose(); onOpenSkills(); }}
              className="p-5 bg-black/45 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 rounded-2xl text-left transition-all flex items-start gap-3.5 cursor-pointer shadow-lg group hover:scale-[1.02]"
            >
              <Wrench className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-bold font-sans text-white group-hover:text-amber-300 transition-colors">SKILLS WORKSHOP</div>
                <div className="text-xs font-mono text-paper-400 mt-0.5">Unity, C#, Shaders</div>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenJourney(); }}
              className="p-5 bg-black/45 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 rounded-2xl text-left transition-all flex items-start gap-3.5 cursor-pointer shadow-lg group hover:scale-[1.02]"
            >
              <Milestone className="w-5 h-5 text-amber-300 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-bold font-sans text-white group-hover:text-amber-300 transition-colors">JOURNEY TREE</div>
                <div className="text-xs font-mono text-paper-400 mt-0.5">Shipped Game Milestones</div>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenLab(); }}
              className="p-5 bg-black/45 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 rounded-2xl text-left transition-all flex items-start gap-3.5 cursor-pointer shadow-lg group hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-bold font-sans text-white group-hover:text-amber-300 transition-colors">EXPERIMENT LAB</div>
                <div className="text-xs font-mono text-paper-400 mt-0.5">Interactive Tech Demos</div>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenResume(); }}
              className="p-5 bg-black/45 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 rounded-2xl text-left transition-all flex items-start gap-3.5 cursor-pointer shadow-lg group hover:scale-[1.02]"
            >
              <FileText className="w-5 h-5 text-amber-300 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-bold font-sans text-white group-hover:text-amber-300 transition-colors">RESUME & CV</div>
                <div className="text-xs font-mono text-paper-400 mt-0.5">Print / PDF Download</div>
              </div>
            </button>

            <button
              onClick={() => { onClose(); onOpenContact(); }}
              className="p-5 bg-black/45 hover:bg-black/65 border border-white/15 hover:border-amber-400/60 rounded-2xl text-left transition-all flex items-start gap-3.5 cursor-pointer sm:col-span-2 shadow-lg group hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-sm font-bold font-sans text-white group-hover:text-amber-300 transition-colors">CAMPFIRE // CONTACT</div>
                <div className="text-xs font-mono text-paper-400 mt-0.5">Email, Discord, GitHub, LinkedIn</div>
              </div>
            </button>
          </div>

          {/* Featured Games List */}
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                FEATURED SHIPPED GAMES
              </span>
            </div>

            <div className="space-y-3">
              {projects.map(p => (
                <div
                  key={p.id}
                  className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 hover:border-amber-400/60 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-base font-sans text-white">{p.title}</span>
                      <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-500/40">
                        {p.subtitle} · {p.year}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-paper-300 line-clamp-1">{p.shortDescription}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.playableUrl && (
                      <a
                        href={p.playableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>PLAY GAME</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 text-right text-xs font-mono text-paper-400">
          CONVENTIONAL DEVELOPER DIRECTORY
        </div>
      </div>
    </div>
  );
};
