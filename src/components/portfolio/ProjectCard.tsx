import React, { useState } from 'react';
import { Project } from '../../types/project';
import { ProjectCover } from './ProjectCover';
import { Play, Sparkles, BookOpen } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';
import { openGameTV } from '../../utils/gameTV';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onOpenBreakdown?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, onOpenBreakdown }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    AudioEngine.playSfx('footstep');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const playable = Boolean(project.playableUrl);

  const openStudy = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    AudioEngine.playSfx('openModal');
    onOpenBreakdown?.(project);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    AudioEngine.playSfx('interact');
    openGameTV(project.id);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered
          ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        animationDelay: `${index * 80}ms`,
      }}
      className="relative rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-gold-400/90 shadow-[0_8px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_40px_rgba(250,204,21,0.35)] p-5 sm:p-6 flex flex-col justify-between group overflow-hidden backdrop-blur-md animate-stagger smooth-transform select-none"
    >
      {/* Dynamic warm cursor spotlight */}
      <div
        className="absolute w-52 h-52 bg-gold-400/15 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        style={{
          left: `${(tilt.x / 8 + 0.5) * 100}%`,
          top: `${(-tilt.y / 8 + 0.5) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div>
        {/* Live Interactive Canvas Preview Banner */}
        <a
          href={project.playableUrl ?? '#'}
          target="_blank"
          rel="noreferrer"
          onClick={playable ? handlePlayClick : openStudy}
          className="block relative mb-4 rounded-xl overflow-hidden shadow-lg border border-white/15 group-hover:border-gold-400/80 transition-colors"
          title={playable ? `Play ${project.title} on the retro TV` : `${project.title} case study`}
        >
          <ProjectCover project={project} className="h-40 sm:h-44" />
          
          {/* Top-Right FEATURED Pill */}
          {project.featured && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-gold-400 text-[10px] font-mono font-bold text-gold-300 tracking-wider uppercase backdrop-blur-md shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-300" />
              <span>FEATURED</span>
            </div>
          )}

          {/* Status pill for unreleased work */}
          {!playable && (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/25 text-[10px] font-mono font-bold text-paper-200 tracking-wider uppercase backdrop-blur-md shadow-md">
              {project.status}
            </div>
          )}

          {/* Hover Play Overlay */}
          {playable && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="px-4 py-2 rounded-xl bg-gold-500/90 text-charcoal-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm transform scale-95 group-hover:scale-100 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY ON TV</span>
              </div>
            </div>
          )}
        </a>

        {/* Title & Year */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h3 className="font-bold font-sans text-lg sm:text-xl text-white group-hover:text-gold-300 transition-colors duration-200 tracking-tight">
            {project.title}
          </h3>
          {project.year && (
            <span className="text-xs font-mono text-gold-400/90 font-bold shrink-0">
              {project.year}
            </span>
          )}
        </div>

        {/* Subtitle in High-Contrast Glowing Amber/Gold */}
        <div className="text-xs font-mono font-bold text-gold-300 tracking-wide uppercase mb-2.5">
          {project.subtitle}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-paper-200 leading-relaxed mb-4 min-h-[38px] font-sans">
          {project.shortDescription}
        </p>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono uppercase tracking-wider font-bold text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-lg shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions: play on the TV, or read the engineering case study */}
      <div className={`pt-2 grid gap-2 ${playable ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {playable && (
          <a
            href={project.playableUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handlePlayClick}
            className="w-full py-3 bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-400 hover:to-amber-300 text-charcoal-950 font-mono text-xs font-bold rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group-hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY GAME</span>
          </a>
        )}
        <button
          onClick={openStudy}
          className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-gold-400/70 text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>CASE STUDY</span>
        </button>
      </div>
    </div>
  );
};
