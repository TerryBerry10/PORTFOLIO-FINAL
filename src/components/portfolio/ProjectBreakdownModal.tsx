import React, { useEffect } from 'react';
import { Project } from '../../types/project';
import { X, Play, ArrowLeft } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { AudioEngine } from '../../engine/AudioEngine';
import { openGameTV } from '../../utils/gameTV';
import { ProjectThumbnailCanvas } from './ProjectThumbnailCanvas';

interface ProjectBreakdownModalProps {
  project: Project;
  onClose: () => void;
}

const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="font-mono text-[10px] tracking-widest text-paper-400/70 uppercase">{label}</dt>
    <dd className="text-sm text-white font-semibold mt-0.5">{value}</dd>
  </div>
);

export const ProjectBreakdownModal: React.FC<ProjectBreakdownModalProps> = ({ project, onClose }) => {
  const { caseStudy } = project;

  const handleClose = () => {
    AudioEngine.playSfx('closeModal');
    onClose();
  };

  useEffect(() => {
    AudioEngine.playSfx('openModal');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <article className="relative w-full max-w-3xl my-auto max-h-[94vh] overflow-y-auto rounded-3xl bg-[#0d0f14]/95 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-white">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0d0f14]/95 backdrop-blur border-b border-white/10">
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-xs font-mono text-paper-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All games
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-8">
          {/* Title */}
          <header className="space-y-3">
            <p className="font-mono text-xs text-amber-300 font-bold tracking-wider uppercase">
              Case study · {project.subtitle}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{project.title}</h1>
            <p className="text-base sm:text-lg text-paper-200 leading-relaxed">{project.hook}</p>
          </header>

          {/* Preview + play */}
          <button
            onClick={() => openGameTV(project.id)}
            className="group relative block w-full rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/70 transition-colors"
            title={`Play ${project.title}`}
          >
            <ProjectThumbnailCanvas type={project.id} className="h-48 sm:h-60" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors">
              <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-black font-mono text-xs font-black shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-current" /> PLAY IN BROWSER
              </span>
            </span>
          </button>

          {/* Quick facts */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <Fact label="Role" value={project.role} />
            <Fact label="Engine" value={project.technologies.slice(0, 2).join(' · ')} />
            <Fact label="Platform" value={project.platform} />
            <Fact label="Year" value={`${project.year} · ${project.status}`} />
          </dl>

          {/* Overview */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="text-sm sm:text-base text-paper-200 leading-relaxed">{caseStudy.overview}</p>
          </section>

          {/* Contributions */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">What I built</h2>
            <ul className="space-y-3">
              {caseStudy.whatIBuilt.map(item => (
                <li key={item.heading} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-sm sm:text-base text-paper-200 leading-relaxed">
                    <span className="font-semibold text-white">{item.heading}.</span> {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Challenge */}
          {caseStudy.challenge && (
            <section className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <h3 className="font-mono text-[11px] tracking-widest text-rose-300 font-bold uppercase mb-1.5">The problem</h3>
                <p className="text-sm text-paper-200 leading-relaxed">{caseStudy.challenge.problem}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <h3 className="font-mono text-[11px] tracking-widest text-emerald-300 font-bold uppercase mb-1.5">How I solved it</h3>
                <p className="text-sm text-paper-200 leading-relaxed">{caseStudy.challenge.approach}</p>
              </div>
            </section>
          )}

          {caseStudy.lessons && (
            <section className="space-y-2">
              <h2 className="text-lg font-bold">What I'd do differently</h2>
              <p className="text-sm sm:text-base text-paper-200 leading-relaxed">{caseStudy.lessons}</p>
            </section>
          )}

          {/* Tech + links */}
          <footer className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md bg-white/10 font-mono text-[10px] font-bold">{t}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openGameTV(project.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Play
              </button>
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-xs font-bold transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};
