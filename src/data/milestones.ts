import { Milestone } from '../types/skills';

// Newest first. Sourced from the resume.
export const journeyMilestones: Milestone[] = [
  {
    id: 'dottie',
    year: '2026',
    title: 'Dottie',
    category: 'Shipped Title',
    story: 'A 2D anime-style 1v1 fighter I made on my own. I worked on combat feel (hitstop, screen shake, knockback), wrote Shader Graph and HLSL shaders for auras and afterimage trails, and built an object pool so effects-heavy fights run smoothly.',
    technologies: ['Unity', 'C#', 'Shader Graph', 'HLSL', 'Mecanim'],
  },
  {
    id: 'bait',
    year: '2026',
    title: 'Bait',
    category: 'Shipped Title',
    story: 'Snake, flipped: you play the prey and try to outlast a predator snake. I programmed the pursuit logic and player movement, and made the trail shaders, danger-zone cues and near-miss particles.',
    technologies: ['Unity', 'C#', 'Trail Shaders', 'Particles'],
  },
  {
    id: 'astral-rally',
    year: '2026',
    title: 'Astral Rally',
    category: 'Shipped Title',
    story: 'A multi-ball arcade game. I wrote the paddle controls, multi-ball trajectory maths and collisions, and made the neon arena shaders and ball trails that keep fast play readable.',
    technologies: ['Unity', 'C#', 'Shaders', 'Trail Renderers'],
  },
  {
    id: 'msc',
    year: 'Now',
    title: 'M.Sc. Game Technology',
    category: 'Education',
    story: 'Second year at ICAT Design & Media College (Alagappa University), Chennai. Focus: real-time graphics, game technology and production.',
    technologies: ['Real-Time Graphics', 'Game Production'],
  },
  {
    id: 'bca',
    year: '2025',
    title: 'Bachelor of Computer Applications',
    category: 'Education',
    story: 'Graduated from Lovely Professional University, Punjab. That is where I built my programming foundations (C, C++, OOP) before moving into games.',
    technologies: ['C', 'C++', 'OOP'],
  },
];
