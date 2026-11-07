import React, { useEffect, useState } from 'react';
import { Project } from '../../types/project';
import { X, Play, ArrowLeft, ArrowRight, ExternalLink, Link2, Check } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { AudioEngine } from '../../engine/AudioEngine';
import { openGameTV } from '../../utils/gameTV';
import { ProjectCover, MediaView } from './ProjectCover';
import { projects } from '../../data/projects';
import { useGithub, findRepoFor } from '../../data/github';

interface ProjectBreakdownModalProps {
  project: Project;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="font-mono text-[10px] tracking-widest text-paper-400/70 uppercase">{label}</dt>
    <dd className="text-sm text-white font-semibold mt-0.5">{value}</dd>
  </div>
);

export const ProjectBreakdownModal: React.FC<ProjectBreakdownModalProps> = ({ project, onClose, onSelectProject }) => {
  const { caseStudy } = project;
  const { repos } = useGithub();
  // Prefer the game's own public repo over the generic profile link
  const repoUrl = findRepoFor(repos, project.title, project.id)?.html_url ?? project.repositoryUrl;
  const index = projects.findIndex(p => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const [copied, setCopied] = useState(false);
  const scrollRef = React.useRef<HTMLElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [project.id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked; the address bar already holds the link.
    }
  };

  const handleClose = () => {
    AudioEngine.playSfx('closeModal');
    onClose();
  };

  useEffect(() => {
    AudioEngine.playSfx('openModal');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <article ref={scrollRef} className="relative w-full max-w-3xl my-auto max-h-[94dvh] overflow-y-auto rounded-3xl bg-[#0d0f14]/95 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-white">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0d0f14]/95 backdrop-blur border-b border-white/10">
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-xs font-mono text-paper-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All games
          </button>
          <div className="flex items-center gap-1">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 text-xs font-mono text-paper-300 hover:text-white transition-colors"
            title="Copy a direct link to this game"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Link2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy link'}</span>
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 pb-24 sm:pb-8 space-y-8">
          {/* Title */}
          <header className="space-y-3">
            <p className="font-mono text-xs text-amber-300 font-bold tracking-wider uppercase">
              Case study · {project.subtitle}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{project.title}</h1>
            <p className="text-base sm:text-lg text-paper-200 leading-relaxed">{project.hook}</p>
          </header>

          {/* Preview + play */}
          {project.playableUrl ? (
            <button
              onClick={() => openGameTV(project.id)}
              className="group relative block w-full rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/70 transition-colors"
              title={`Play ${project.title}`}
            >
              <ProjectCover project={project} className="h-48 sm:h-60" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors">
                <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-black font-mono text-xs font-black shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-current" /> PLAY IN BROWSER
                </span>
              </span>
            </button>
          ) : (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10">
              <ProjectCover project={project} className="h-48 sm:h-60" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-white/25 font-mono text-[10px] font-bold text-paper-200 tracking-wider uppercase">
                {project.status}
              </span>
            </div>
          )}

          {/* Quick facts */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            {project.role && <Fact label="Role" value={project.role} />}
            {project.technologies.length > 0 && <Fact label="Engine" value={project.technologies.slice(0, 2).join(' · ')} />}
            <Fact label="Platform" value={project.platform} />
            <Fact label={project.year ? 'Year' : 'Status'} value={project.year ? `${project.year} · ${project.status}` : project.status} />
          </dl>

          {/* Overview */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="text-sm sm:text-base text-paper-200 leading-relaxed">{caseStudy.overview}</p>
          </section>

          {/* More footage */}
          {project.media && project.media.length > 1 && (
            <section className="grid sm:grid-cols-2 gap-3">
              {project.media.slice(1).map((m, i, all) => (
                <figure
                  key={m.src}
                  className={`rounded-xl overflow-hidden border border-white/10 bg-black ${all.length === 1 || (i === 0 && all.length % 2 === 1) ? 'sm:col-span-2' : ''}`}
                >
                  <MediaView media={m} controls className="aspect-video" />
                  {m.caption && <figcaption className="px-3 py-2 text-xs text-paper-300">{m.caption}</figcaption>}
                </figure>
              ))}
            </section>
          )}

          {/* Contributions */}
          {caseStudy.whatIBuilt.length > 0 && (
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
          )}

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
            <div className="flex flex-wrap gap-2">
              {project.playableUrl && (
                <button
                  onClick={() => openGameTV(project.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play
                </button>
              )}
              {project.playableUrl && (
                <a
                  href={project.playableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-xs font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Unity Play
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 font-mono text-xs font-bold transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
            </div>
          </footer>

          {/* Next / previous game */}
          {onSelectProject && projects.length > 1 && (
            <nav className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSelectProject(prev)}
                className="group flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/60 text-left transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0 text-paper-400 group-hover:text-amber-300 group-hover:-translate-x-0.5 transition" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-widest text-paper-400 uppercase">Previous</span>
                  <span className="block font-bold truncate">{prev.title}</span>
                </span>
              </button>
              <button
                onClick={() => onSelectProject(next)}
                className="group flex items-center justify-end gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/60 text-right transition-colors"
              >
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] tracking-widest text-paper-400 uppercase">Next</span>
                  <span className="block font-bold truncate">{next.title}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 text-paper-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition" />
              </button>
            </nav>
          )}
        </div>

        {/* Thumb-reach play bar on phones */}
        {project.playableUrl && (
        <div className="sm:hidden sticky bottom-0 z-10 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/95 to-transparent">
          <button
            onClick={() => openGameTV(project.id)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-amber-400 active:scale-[0.98] text-black font-mono text-sm font-black shadow-[0_0_25px_rgba(245,158,11,0.5)] transition"
          >
            <Play className="w-4 h-4 fill-current" /> Play {project.title}
          </button>
        </div>
        )}
      </article>
    </div>
  );
};
