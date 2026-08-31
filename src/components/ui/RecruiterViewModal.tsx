import React from 'react';
import { developerInfo } from '../../data/developerInfo';
import { projects } from '../../data/projects';
import { workshopSkills } from '../../data/skills';
import { Project } from '../../types/project';
import { ProjectCard } from '../portfolio/ProjectCard';
import { X, Download, Briefcase, Award, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface RecruiterViewModalProps {
  onClose: () => void;
  onOpenBreakdown: (project: Project) => void;
  onOpenResume: () => void;
}

export const RecruiterViewModal: React.FC<RecruiterViewModalProps> = ({
  onClose,
  onOpenBreakdown,
  onOpenResume
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[92vh] text-white">
        
        {/* Recruiter Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// RECRUITER MODE · 30-SECOND OVERVIEW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              {developerInfo.name}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-amber-400 font-bold mt-1">
              {developerInfo.title} · {developerInfo.status}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                AudioEngine.playSfx('interact');
                onOpenResume();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>VIEW RESUME (PDF)</span>
            </button>

            <button
              onClick={() => {
                AudioEngine.playSfx('closeModal');
                onClose();
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95 ml-1"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recruiter Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-transparent">
          
          {/* Executive Bio & Contact Bar */}
          <div className="bg-black/45 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-lg space-y-4">
            <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans">
              {developerInfo.shortBio}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-4 text-paper-300">
                <span>📍 {developerInfo.location}</span>
                <span>✉ <a href={`mailto:${developerInfo.email}`} className="text-amber-400 font-bold hover:underline">{developerInfo.email}</a></span>
              </div>

              <div className="flex items-center gap-3">
                <a href={developerInfo.links.github} target="_blank" rel="noreferrer" className="text-white hover:text-amber-300 font-bold">
                  GitHub ↗
                </a>
                {developerInfo.links.unityPlay && (
                  <a href={developerInfo.links.unityPlay} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 font-bold">
                    Unity Play ↗
                  </a>
                )}
                <a href={developerInfo.links.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-amber-300 font-bold">
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

          {/* Featured Projects Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PRIMARY PROOF OF ABILITY // SHIPPED TITLES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpenBreakdown={onOpenBreakdown}
                />
              ))}
            </div>
          </section>

          {/* Skills Matrix */}
          <section className="bg-black/45 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/15 shadow-lg">
            <h2 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>TECHNICAL COMPETENCY & SYSTEMS MATRIX</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {workshopSkills.map(s => (
                <div key={s.id} className="bg-black/50 p-4 rounded-xl border border-white/10">
                  <div className="font-bold text-sm text-white mb-1">{s.name}</div>
                  <div className="text-xs font-mono text-amber-400 font-semibold mb-2">{s.levelOfExperience}</div>
                  <ul className="space-y-1 text-xs text-paper-300">
                    {s.whatIUseItFor.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">▸</span>
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Shipped Experience Timeline */}
          <section className="bg-black/45 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-white/15 shadow-lg">
            <h2 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>PRODUCTION EXPERIENCE SUMMARY</span>
            </h2>

            <div className="space-y-4">
              {developerInfo.resume.experience.map((exp, i) => (
                <div key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-sm text-white">{exp.role} · <span className="font-normal text-paper-400">{exp.company}</span></h3>
                    <span className="text-xs font-mono text-amber-400 font-bold">{exp.period}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-paper-300">{exp.bullets[0]}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recruiter Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <button onClick={onClose} className="text-amber-300 font-bold hover:underline cursor-pointer">
            ← RETURN TO PLAYABLE WORLD
          </button>
          <span>EMAIL: {developerInfo.email}</span>
        </div>
      </div>
    </div>
  );
};
