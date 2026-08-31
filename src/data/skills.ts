import { SkillObject } from '../types/skills';

export const workshopSkills: SkillObject[] = [
  {
    id: 'unity-csharp',
    name: 'Unity Engine & C# Systems',
    category: 'Engine',
    icon: 'Cpu',
    workshopItem: 'Game Engine Forge Anvil',
    description: 'High-performance gameplay systems, custom serialization, ScriptableObject event architectures, and deterministic state machines.',
    whatIUseItFor: [
      'Architecting decoupled game systems with ScriptableObject event buses',
      'Implementing low-level character kinematics, input buffering, and combat state machines',
      'Zero-allocation memory optimization using NativeArray and Job System'
    ],
    projectsUsedIn: ['Aetheria: Blade of the Skyborn', 'Spirits of Komorebi', 'Vanguard: Tactical Mech Protocol'],
    levelOfExperience: '6+ Years // Deep Production & Engine Internals',
    keySpecialties: ['Memory Optimization', 'PlayableGraph API', 'Job System / Burst', 'Input Buffering', 'Physics Sweep Math']
  },
  {
    id: 'shaders-graphics',
    name: 'HLSL / GLSL Shaders & Technical Art',
    category: 'Graphics & Shaders',
    icon: 'Sparkles',
    workshopItem: 'Prismatic Shader Crystal',
    description: 'Stylized cel-shading, Ghibli watercolor lighting ramps, vertex wind displacement, and GPU compute particle systems.',
    whatIUseItFor: [
      'Writing custom vertex and fragment shaders in HLSL/GLSL for organic foliage and water',
      'Crafting Ghibli-inspired warm watercolor lighting with custom LUT ramps',
      'Authoring GPU compute shaders for multi-body physics and procedural noise'
    ],
    projectsUsedIn: ['Spirits of Komorebi', 'Chronovoid: Gravity Well Protocol', 'World Canvas Engine'],
    levelOfExperience: '4+ Years // Production Shader Pipeline',
    keySpecialties: ['Vertex Displacement', 'Cel-Shading LUTs', 'Compute Kernels', 'Screen-Space VFX', 'Early-Z Optimization']
  },
  {
    id: 'webgl-canvas',
    name: 'WebGL, Three.js & Creative Canvas',
    category: 'Programming',
    icon: 'Globe',
    workshopItem: 'Living Canvas Easel',
    description: 'High-performance interactive web simulations, 60 FPS HTML5 canvas game engines, and procedural audio synthesis.',
    whatIUseItFor: [
      'Building in-browser playable game prototypes and interactive technical sandboxes',
      'Developing 2D/2.5D multi-layered parallax game engines with custom physics',
      'Synthesizing procedural audio soundscapes via Web Audio API'
    ],
    projectsUsedIn: ['Chronovoid: Gravity Well Protocol', 'Playable Ghibli World Portfolio', 'Experiment Lab'],
    levelOfExperience: '4+ Years // WebGL & Canvas Architecture',
    keySpecialties: ['Canvas 2D / WebGL', 'TypeScript / React', 'Web Audio API', 'Render Loop Optimization', 'Delta-Time Kinematics']
  },
  {
    id: 'game-ai-pathfinding',
    name: 'Game AI & Spatial Pathfinding',
    category: 'Systems & Architecture',
    icon: 'Compass',
    workshopItem: 'Automaton Navigation Map',
    description: 'Multi-agent utility AI scoring, token coordination choreography, Jump Point Search (JPS), and boids flocking algorithms.',
    whatIUseItFor: [
      'Developing responsive enemy AI using mathematical utility curves and response functions',
      'Implementing high-speed Jump Point Search on large hex and orthogonal grid maps',
      'Creating dynamic flocking and organic wildlife evasion routines'
    ],
    projectsUsedIn: ['Vanguard: Tactical Mech Protocol', 'Spirits of Komorebi'],
    levelOfExperience: '4+ Years // Systems & AI Architecture',
    keySpecialties: ['Utility AI Scoring', 'Jump Point Search (JPS)', 'Token Choreography', 'Boids Flocking', 'Behavior Trees']
  },
  {
    id: 'blender-3d',
    name: 'Blender 3D & Technical Art Pipeline',
    category: 'Tools & Pipeline',
    icon: 'Box',
    workshopItem: 'Sculptor’s Modeling Chisel',
    description: 'Low-poly modular environment assets, hand-painted texture maps, character rigging, and collision proxy generation.',
    whatIUseItFor: [
      'Modeling stylized environment assets and miniature game dioramas',
      'Setting up character bone hierarchies, weight painting, and inverse kinematics rigs',
      'Generating optimized collision hulls and lightmap UV channels'
    ],
    projectsUsedIn: ['Aetheria: Blade of the Skyborn', 'Spirits of Komorebi'],
    levelOfExperience: '3+ Years // Technical Art Pipeline',
    keySpecialties: ['Low-Poly Modeling', 'UV Unwrapping', 'Rigging & Skinning', 'Collision Proxy Hulls', 'Texture Baking']
  },
  {
    id: 'audio-synthesis',
    name: 'Interactive Audio & Sound Design',
    category: 'Audio & Math',
    icon: 'Music',
    workshopItem: 'Harmonic Resonance Chime',
    description: 'Dynamic audio routing, procedural sound synthesis, pitch variance systems, and adaptive music transition pipelines.',
    whatIUseItFor: [
      'Synthesizing procedural wind, rain, footsteps, and chime audio without heavy asset overhead',
      'Designing punchy combat impact soundscapes with dynamic low-pass filters',
      'Configuring dynamic AudioMixer snapshots based on gameplay tension'
    ],
    projectsUsedIn: ['Spirits of Komorebi', 'Aetheria: Blade of the Skyborn', 'World Soundscape Engine'],
    levelOfExperience: '3+ Years // Audio & Synthesis Architecture',
    keySpecialties: ['Web Audio API', 'Procedural Synthesis', 'AudioMixer Snapshots', 'Spatial 3D Audio', 'Pitch Randomization']
  }
];
