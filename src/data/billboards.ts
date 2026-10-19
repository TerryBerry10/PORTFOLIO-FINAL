export type BillboardKind = 'released' | 'upcoming';
export type BillboardMotif = 'moon' | 'waves' | 'stars' | 'mountains' | 'spark';

export interface Billboard {
  id: string;
  kind: BillboardKind;
  title: string;
  tagline: string;
  /** Small ribbon text, e.g. "NOW PLAYING" or "COMING 2027". */
  ribbon: string;
  /** Poster accent colors [top, bottom]. */
  colors: [string, string];
  motif: BillboardMotif;
  /** World position of the billboard's base (between the posts). */
  x: number;
  y: number;
  /** Released games: project id opened on the retro TV. */
  projectId?: string;
  /** Upcoming projects: details shown in the "Coming Soon" card. */
  description?: string;
  platform?: string;
  progress?: number; // 0..1
}

/**
 * Billboards placed along the meadow path.
 * Released entries reuse the project ids from projects.ts.
 * TODO(Vinay): replace the two upcoming placeholders with your real upcoming projects.
 */
export const billboards: Billboard[] = [
  {
    id: 'bb-dottie',
    kind: 'released',
    title: 'Dottie',
    tagline: '1 v 1 Anime Battle',
    ribbon: 'NOW PLAYING',
    colors: ['#f472b6', '#4c1d95'],
    motif: 'spark',
    x: 560,
    y: 330,
    projectId: 'dottie',
  },
  {
    id: 'bb-bait',
    kind: 'released',
    title: 'Bait',
    tagline: 'Escape Platformer',
    ribbon: 'NOW PLAYING',
    colors: ['#38bdf8', '#0c3b2e'],
    motif: 'waves',
    x: 975,
    y: 330,
    projectId: 'bait',
  },
  {
    id: 'bb-astral-rally',
    kind: 'released',
    title: 'Astral Rally',
    tagline: 'Arcade Reflex Racer',
    ribbon: 'NOW PLAYING',
    colors: ['#facc15', '#1e1b4b'],
    motif: 'stars',
    x: 1265,
    y: 400,
    projectId: 'astral-rally',
  },
  {
    id: 'bb-upcoming-1',
    kind: 'upcoming',
    title: 'Project Lantern',
    tagline: 'Next Game · In the Workshop',
    ribbon: 'COMING SOON',
    colors: ['#fb923c', '#3b0d0d'],
    motif: 'moon',
    x: 1810,
    y: 95,
    description: 'A new game is being forged in the workshop. Details are under wraps for now — stop by the campfire to follow along.',
    platform: 'WebGL · Android',
    progress: 0.35,
  },
  {
    id: 'bb-upcoming-2',
    kind: 'upcoming',
    title: 'Untitled Project',
    tagline: 'Prototype · Early Concept',
    ribbon: 'IN DEVELOPMENT',
    colors: ['#a78bfa', '#0f172a'],
    motif: 'mountains',
    x: 2480,
    y: 150,
    description: 'An early prototype exploring new mechanics and a fresh art direction.',
    platform: 'TBA',
    progress: 0.15,
  },
];
