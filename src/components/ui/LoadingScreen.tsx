import React from 'react';
import { Compass, Gamepad2, ArrowRight, Sparkles, Play, BookOpen, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { developerInfo } from '../../data/developerInfo';
import { AudioEngine } from '../../engine/AudioEngine';
import { requestFullscreen } from '../../utils/fullscreen';
import { isTouchDevice } from '../../utils/device';
import { projects } from '../../data/projects';
import { Project } from '../../types/project';
import { ProjectCover } from '../portfolio/ProjectCover';
import { openGameTV } from '../../utils/gameTV';

interface LoadingScreenProps {
  onEnter: () => void;
  onViewProjects: () => void;
  onViewResume?: () => void;
  onOpenBreakdown?: (project: Project) => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onEnter,
  onViewProjects,
  onViewResume,
  onOpenBreakdown,
}) => {
  const handleEnter = () => {
    AudioEngine.init();
    AudioEngine.playSfx('interact');
    requestFullscreen();
    onEnter();
  };

  const handleViewGames = () => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    onEnter();
    onViewProjects();
  };

  const handlePlay = (project: Project) => {
    AudioEngine.init();
    AudioEngine.playSfx('interact');
    onEnter();
    openGameTV(project.id);
  };

  const handleCaseStudy = (project: Project) => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    onEnter();
    onOpenBreakdown?.(project);
  };

  const handleViewResume = () => {
    AudioEngine.init();
    AudioEngine.playSfx('openModal');
    onEnter();
    onViewResume?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center overflow-y-auto px-4 pt-10 pb-16 sm:py-8 bg-black/95 select-none animate-fadeIn">
      {/* Background Animated Stardust Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl px-4">
        
        {/* Role Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>TECHNICAL ARTIST · GAME DEVELOPER</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-tight text-white leading-none">
          <span>Vinay</span>{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.75)]">
            Sankar
          </span>
        </h1>

        {/* Description Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-paper-200/90 font-sans max-w-lg leading-relaxed font-normal">
          {developerInfo.tagline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
          <button
            onClick={handleEnter}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs sm:text-sm font-black tracking-wide shadow-[0_0_35px_rgba(245,158,11,0.65)] hover:shadow-[0_0_50px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
            <span>ENTER WORLD</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleViewGames}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-paper-100 font-mono text-xs sm:text-sm font-bold border-2 border-white/20 hover:border-amber-400/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>GAMES</span>
          </button>

          <button
            onClick={handleViewResume}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/60 hover:bg-black/80 text-paper-100 font-mono text-xs sm:text-sm font-bold border-2 border-white/20 hover:border-amber-400/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>RESUME / CV</span>
          </button>
        </div>

        {/* Direct contact, no clicking through the world */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-paper-300">
          <a href={`mailto:${developerInfo.email}`} className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <Mail className="w-3.5 h-3.5" /> {developerInfo.email}
          </a>
          <a href={developerInfo.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn
          </a>
          <a href={developerInfo.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors">
            <GithubIcon className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
      </div>

      {/* Featured Work: the games, visible in the first five seconds */}
      <section className="relative z-10 w-full max-w-5xl mt-10 sm:mt-12">
        <div className="flex items-center gap-3 mb-4 px-1">
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-amber-300">FEATURED WORK</span>
          <span className="flex-1 h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
          <span className="font-mono text-[10px] text-paper-400/70">{projects.length} PLAYABLE GAMES</span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className="snap-center shrink-0 w-[78%] sm:w-auto rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/70 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(245,158,11,0.18)] transition-all duration-300 overflow-hidden text-left animate-stagger"
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <button onClick={() => handlePlay(p)} className="relative block w-full group" title={`Play ${p.title}`}>
                <ProjectCover project={p} className="h-32" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 border border-white/15 font-mono text-[9px] font-bold text-emerald-300 tracking-wider">
                  ● {p.status.toUpperCase()} · {p.year}
                </span>
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                  <span className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-[0_0_25px_rgba(245,158,11,0.8)]">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>
              </button>

              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{p.title}</h3>
                  <p className="font-mono text-[10px] font-bold tracking-wider text-amber-300 uppercase">{p.subtitle}</p>
                </div>
                <p className="text-[11px] text-paper-300/90 leading-snug line-clamp-1">
                  <span className="text-paper-400/70">Role · </span>{p.role}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[9px] font-bold text-white/90">{t}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handlePlay(p)}
                    className="py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-mono text-[11px] font-black flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition"
                  >
                    <Play className="w-3 h-3 fill-current" /> PLAY
                  </button>
                  <button
                    onClick={() => handleCaseStudy(p)}
                    className="py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
                  >
                    <BookOpen className="w-3 h-3" /> CASE STUDY
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Subtle Bottom Controls Hint */}
      <div className="relative z-10 mt-8 w-full justify-center text-center font-mono text-[11px] text-paper-400/60 flex flex-wrap items-center gap-x-3 gap-y-1">
        {isTouchDevice() ? (
          <>
            <span>DRAG TO MOVE</span>
            <span>·</span>
            <span>TAP AIRSHIPS TO PLAY</span>
          </>
        ) : (
          <>
            <span>WASD / ARROWS TO MOVE</span>
            <span>·</span>
            <span>E TO INTERACT</span>
          </>
        )}
      </div>
    </div>
  );
};
