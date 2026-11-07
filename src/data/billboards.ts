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
  /** Sky lane: starting world X, cruising altitude (world Y, above the horizon) and drift speed (+ right, - left).
   *  All ships share one wind (same speed/direction) and are evenly spaced so banners never overlap. */
  startX: number;
  altitude: number;
  speed: number;
  /** Released games: project id opened on the retro TV. */
  projectId?: string;
  /** Upcoming projects: details shown in the "Coming Soon" card. */
  description?: string;
  platform?: string;
  progress?: number; // 0..1
}

/**
 * Promo banners towed by airships drifting across the sky.
 * Released entries reuse the project ids from projects.ts.
 * Upcoming projects can be added with kind: 'upcoming' (they open the Coming Soon card).
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
    startX: 180,
    altitude: -90,
    speed: 14,
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
    startX: 1747,
    altitude: -70,
    speed: 14,
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
    startX: 3314,
    altitude: -100,
    speed: 14,
    projectId: 'astral-rally',
  },
  {
    id: 'bb-life-of-an-ant',
    kind: 'upcoming',
    title: 'Life of an Ant',
    tagline: 'Story Simulation Puzzle',
    ribbon: 'COMING SOON',
    colors: ['#4ade80', '#14532d'],
    motif: 'mountains',
    startX: 960,
    altitude: -120,
    speed: 14,
    description: 'An upcoming story-based simulation puzzle game.',
  },
  {
    id: 'bb-roblox',
    kind: 'upcoming',
    title: 'Roblox Project',
    tagline: 'A surprise',
    ribbon: 'COMING SOON',
    colors: ['#f87171', '#450a0a'],
    motif: 'spark',
    startX: 2530,
    altitude: -60,
    speed: 14,
    description: 'A Roblox project in the works. Details are a surprise for now.',
    platform: 'Roblox',
  },
  {
    id: 'bb-vr',
    kind: 'upcoming',
    title: 'VR Project',
    tagline: 'A surprise',
    ribbon: 'COMING SOON',
    colors: ['#a78bfa', '#2e1065'],
    motif: 'moon',
    startX: -300,
    altitude: -110,
    speed: 14,
    description: 'A VR project in the works. Details are a surprise for now.',
    platform: 'VR',
  },
];
