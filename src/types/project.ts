export interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: '3D Action' | '2D Physics Roguelike' | 'Procedural Simulation' | 'Multiplayer Tactical' | 'Atmospheric Narrative' | 'Physics Platformer' | string;
  role: string;
  platform: string;
  status: 'Released' | 'Playable Prototype' | 'In Development' | 'Tech Demo';
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
