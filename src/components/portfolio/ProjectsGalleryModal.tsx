import React from 'react';
import { projects } from '../../data/projects';
import { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';
import { X, Gamepad2, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface ProjectsGalleryModalProps {
  onClose: () => void;
  onOpenBreakdown?: (project: Project) => void;
}

export const ProjectsGalleryModal: React.FC<ProjectsGalleryModalProps> = ({
  onClose,
  onOpenBreakdown
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/20 backdrop-blur-[2px] overflow-y-auto animate-fadeIn select-none">
      
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col my-auto shadow-[0_0_60px_rgba(0,0,0,0.8)] rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl overflow-hidden text-white">
        
        {/* Transparent Glass Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/15 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>// VINAY SANKAR · PORTFOLIO</span>
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-gold-300 font-bold">
                  {projects.length} SHIPPED GAMES
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight">
                GAMES
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                AudioEngine.playSfx('closeModal');
                onClose();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/15"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Card Transparent Grid */}
        <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(94vh-90px)] bg-black/25 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpenBreakdown={onOpenBreakdown}
              />
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs font-mono text-paper-300 gap-2">
            <span>All titles are playable directly in WebGL on Unity Play</span>
            <span className="text-gold-300 font-bold">
              Click &quot;PLAY GAME&quot; on any card to switch on the retro TV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
