import { Project } from '../types/project';

// Every claim here comes from the resume. If something isn't on the resume, it isn't here.
export const projects: Project[] = [
  {
    id: 'dottie',
    title: 'Dottie',
    subtitle: '2D Anime-Style 1v1 Fighter',
    year: '2026',
    category: 'Fighting',
    role: 'Solo developer · Tech art & gameplay',
    platform: 'WebGL (Unity Play)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#', 'SHADER GRAPH', 'HLSL'],
    playableUrl: 'https://play.unity.com/en/games/80577269-b219-42a4-8bc2-07ebde267f23/dottie',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'floating_island',
    shortDescription: '1 v 1 anime-style battle. Unleash your rage!',
    hook: 'A 2D one-on-one fighter with anime-style effects, made solo in Unity.',
    caseStudy: {
      overview:
        'Dottie is a 2D one-on-one fighter inspired by anime fight scenes. I made it on my own, so I did the gameplay code, the animation setup, the shaders and the particle effects.',
      whatIBuilt: [
        {
          heading: 'Shaders for the anime look',
          text: 'Shader Graph and HLSL shaders for combat auras, afterimage motion trails and screen distortion on big hits.',
        },
        {
          heading: 'Combat feel',
          text: 'Combos and special attacks, plus the feedback that sells each hit: hitstop freeze-frames, screen shake, hit sparks and physics knockback.',
        },
        {
          heading: 'Animation states',
          text: 'Character states with Mecanim so attacks, hits and recovery blend cleanly.',
        },
      ],
      challenge: {
        problem: 'Hit sparks and projectiles spawn constantly in a fight. Creating and destroying them each time causes garbage-collection spikes, which show up as stutters in the middle of a combo.',
        approach: 'I wrote a reusable object pool in C#. Effects and projectiles are created once and recycled, so nothing is allocated during a fight and the frame rate stays steady.',
      },
    },
  },
  {
    id: 'bait',
    title: 'Bait',
    subtitle: 'Reverse-Snake Survival',
    year: '2026',
    category: 'Survival Arcade',
    role: 'Technical artist & programmer',
    platform: 'WebGL (Unity Play)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#'],
    playableUrl: 'https://play.unity.com/en/games/198ab285-790a-46e0-97d0-45cdd3be176f/bait',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'ancient_forest',
    shortDescription: 'You are the bait. Try to save your life!',
    hook: 'Snake, flipped: you are the food, and a predator snake is hunting you.',
    caseStudy: {
      overview:
        'Bait turns Snake around. Instead of steering the snake, you play the prey and try to outlast a predator snake that chases you down. I worked on the programming and the visual feedback.',
      whatIBuilt: [
        {
          heading: 'Predator pursuit',
          text: 'The chase logic that has the snake hunt the player, plus the player movement it has to keep up with.',
        },
        {
          heading: 'Trail shaders',
          text: 'Custom trail shaders for the snake and the player so movement is easy to read at speed.',
        },
        {
          heading: 'Feedback',
          text: 'Lightweight particle bursts on near-misses and when the player gets caught.',
        },
      ],
      challenge: {
        problem: 'In a chase game, players need to sense danger before it is too late. Otherwise getting caught feels random.',
        approach: 'I added danger-zone visual cues that react to how close the predator is, so players can see a catch coming and react.',
      },
    },
  },
  {
    id: 'astral-rally',
    title: 'Astral Rally',
    subtitle: 'Multi-Ball Arcade',
    year: '2026',
    category: 'Arcade',
    role: 'Technical artist & gameplay programmer',
    platform: 'WebGL (Unity Play)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#'],
    playableUrl: 'https://play.unity.com/en/games/90b58e1c-61d8-4e4b-9b0e-38d395bec322/astral-rally',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'cyber_arena',
    shortDescription: 'An arcade game that tests your reflexes.',
    hook: 'A fast paddle-and-ball arcade game where several balls are in play at once.',
    caseStudy: {
      overview:
        'Astral Rally is a fast arcade game where you control a paddle and juggle several balls at once in a neon arena. I handled the gameplay code and the visuals.',
      whatIBuilt: [
        {
          heading: 'Paddle and ball physics',
          text: 'Responsive paddle controls, multi-ball trajectory maths and collision detection in C#.',
        },
        {
          heading: 'Neon arena shaders',
          text: 'Glowing neon materials and arena boundaries that light up where a fast ball hits them.',
        },
        {
          heading: 'Particles and trails',
          text: 'Particle bursts on impact and custom trail renderers on every ball.',
        },
      ],
      challenge: {
        problem: 'With several fast balls on screen at once, it is easy to lose track of them.',
        approach: 'I gave every ball a trail and made impacts flash on the arena boundary, so players can follow each ball even when the action is chaotic.',
      },
    },
  },
];
