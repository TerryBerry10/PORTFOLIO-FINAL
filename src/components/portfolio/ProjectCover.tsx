import React from 'react';
import { Project, ProjectMedia } from '../../types/project';
import { ProjectThumbnailCanvas } from './ProjectThumbnailCanvas';

interface MediaViewProps {
  media: ProjectMedia;
  className?: string;
  /** Show browser controls (case study gallery) instead of a silent loop (covers). */
  controls?: boolean;
}

export const MediaView: React.FC<MediaViewProps> = ({ media, className = '', controls = false }) =>
  media.type === 'video' ? (
    <video
      src={media.src}
      poster={media.poster}
      className={`w-full object-cover bg-black ${className}`}
      autoPlay={!controls}
      loop={!controls}
      muted={!controls}
      controls={controls}
      playsInline
      preload="metadata"
    />
  ) : (
    <img src={media.src} alt={media.caption ?? ''} loading="lazy" className={`w-full object-cover bg-black ${className}`} />
  );

/** Real gameplay footage when the project has it, otherwise the generated preview. */
export const ProjectCover: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => {
  const cover = project.media?.[0];
  return cover ? <MediaView media={cover} className={className} /> : <ProjectThumbnailCanvas type={project.id} className={className} />;
};
