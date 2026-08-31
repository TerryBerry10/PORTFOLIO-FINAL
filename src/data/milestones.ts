import { Milestone } from '../types/skills';

export const journeyMilestones: Milestone[] = [
  {
    id: 'dottie',
    year: '2026',
    title: 'Dottie — 1v1 Anime Battle',
    category: 'Shipped Title',
    story: '1 v 1 anime style battle — unleash your rage! Built with Unity & C#, featuring frame-data combat state machines, hitstop freeze-frames, hitbox/hurtbox capsule sweeps, dynamic camera shakes, and stylized anime impact VFX.',
    technologies: ['Unity', 'C#', 'Combat State Machines', 'Hitstop & Shake', 'Anime VFX', 'Frame Data'],
    artifact: 'Blazing Dragon Battle Sigil',
    lesson: 'Impact feel, hitstop pause, and snappy animation cancels make combat deeply satisfying.'
  },
  {
    id: 'bait',
    year: '2025',
    title: 'Bait — Survival Precision Platformer',
    category: 'Shipped Title',
    story: 'A platformer where you are the bait — try saving your life! Built in Unity & C# with custom kinematic velocity solvers, trap triggers, input buffering, and razor-sharp collision response.',
    technologies: ['Unity', 'C#', 'Platformer Kinematics', 'Trap AI', 'Physics Tuning'],
    artifact: 'Ancient Spring Trap Relic',
    lesson: 'Tight collision precision and high-stakes timing turn simple mechanics into pure adrenaline.'
  },
  {
    id: 'astral-rally',
    year: '2024',
    title: 'Astral Rally — High-Speed Arcade Reflex',
    category: 'Shipped Title',
    story: 'An arcade kinda game — let’s test your reflexes! Created and published on Unity Play with dynamic obstacle spawning loops, fluid drift kinematics, and arcade reflex scoring architecture.',
    technologies: ['Unity', 'C#', 'Arcade Physics', 'Speed VFX', 'High-Speed Reflex Loops'],
    artifact: 'Stardust Tachometer Rune',
    lesson: 'Arcade juice, dynamic speed lines, and intuitive controls create instant flow state.'
  }
];
