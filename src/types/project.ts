/** Real footage of a project. Files live in public/media/<project id>/. */
export interface ProjectMedia {
  type: 'video' | 'image';
  src: string;
  caption?: string;
  /** Still frame shown before a video plays. */
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  /** Omitted when not yet confirmed. */
  year?: string;
  /** Games by default; cinematics are video-only work. */
  kind?: 'game' | 'cinematic';
  category: '3D Action' | '2D Physics Roguelike' | 'Procedural Simulation' | 'Multiplayer Tactical' | 'Atmospheric Narrative' | 'Physics Platformer' | string;
  /** Omitted when not yet confirmed. */
  role?: string;
  platform: string;
  status: 'Released' | 'Coming Soon' | 'Playable Prototype' | 'In Development' | 'Tech Demo';
  featured: boolean;
  technologies: string[];
  playableUrl?: string;
  /** Direct iframe URL for the in-portfolio retro TV player. Derived from Unity Play URLs when omitted. */
  embedUrl?: string;
  /** Native orientation of the build (Android portrait games get pillarboxed on the TV). */
  screenOrientation?: 'landscape' | 'portrait';
  repositoryUrl?: string;
  videoTrailerUrl?: string;
  dioramaTheme: 'floating_island' | 'cyber_arena' | 'galaxy_orbit' | 'mech_hangar' | 'ancient_forest';
  
  /** Gameplay clips and screenshots. The first entry is the cover; without media a generated preview is used. */
  media?: ProjectMedia[];

  shortDescription: string;
  hook: string;

  /** Plain case study: what it is, what I built, one real problem I solved. */
  caseStudy: {
    overview: string;
    whatIBuilt: { heading: string; text: string }[];
    challenge?: { problem: string; approach: string };
    lessons?: string;
  };
}
