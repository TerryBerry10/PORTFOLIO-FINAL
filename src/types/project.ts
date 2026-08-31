export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'input' | 'state' | 'logic' | 'physics' | 'audio' | 'render' | 'vfx';
  description: string;
  details: string[];
  codeSnippet?: string;
  x: number;
  y: number;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface PlaygroundParam {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
}

export interface XRayDebugData {
  colliders: { name: string; type: 'box' | 'circle' | 'capsule'; color: string; desc: string }[];
  raycasts: { name: string; length: number; purpose: string }[];
  stateMachines: { state: string; trigger: string; next: string }[];
  performance: { drawCalls: number; triangleCount: string; frameTime: string; gcAlloc: string };
}

export interface BeforeAfterComparison {
  title: string;
  description: string;
  aspectRatio: string;
  beforeLabel: string;
  afterLabel: string;
  beforeType: 'canvas-prototype' | 'canvas-unoptimized' | 'image' | 'code';
  afterType: 'canvas-final' | 'canvas-optimized' | 'image' | 'code';
  beforeCode?: string;
  afterCode?: string;
  notes: string;
}

export interface ProjectTimelineStage {
  phase: string;
  title: string;
  date: string;
  description: string;
  keyChallenge: string;
  milestone: string;
}

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
  repositoryUrl?: string;
  videoTrailerUrl?: string;
  dioramaTheme: 'floating_island' | 'cyber_arena' | 'galaxy_orbit' | 'mech_hangar' | 'ancient_forest';
  
  // High-level summary
  shortDescription: string;
  hook: string;
  
  // 9-Part Field Journal Breakdown
  breakdown: {
    // 01 The Idea
    idea: {
      summary: string;
      playerExperience: string;
      influences: string[];
    };
    // 02 Core System
    coreSystem: {
      title: string;
      explanation: string;
      technicalDepth: string;
      mechanicsSummary: string;
    };
    // 03 Under the Hood (Architecture)
    architecture: {
      overview: string;
      nodes: ArchitectureNode[];
      edges: ArchitectureEdge[];
    };
    // 04 The Problem (Honest Engineering Breakdown)
    problem: {
      title: string;
      symptom: string;
      rootCause: string;
      failedAttempts: string[];
    };
    // 05 The Solution
    solution: {
      approach: string;
      whyItWorked: string;
      codeHighlight: {
        language: string;
        filename: string;
        code: string;
        explanation: string;
      };
    };
    // 06 Performance & Optimization
    performance: {
      bottleneck: string;
      metrics: {
        metric: string;
        before: string;
        after: string;
        delta: string;
      }[];
      keyTechnique: string;
    };
    // 07 Iteration Timeline
    iteration: ProjectTimelineStage[];
    // 08 What I Learned
    lessonsLearned: {
      technical: string;
      design: string;
      takeaway: string;
    };
    // 09 Live Playground & Interactivity
    playground: {
      type: 'combat-sandbox' | 'gravity-orbits' | 'platformer-feel' | 'wind-grass' | 'procedural-dungeon';
      description: string;
      params: PlaygroundParam[];
    };
    // X-Ray Visualizer Mode
    xrayData: XRayDebugData;
    // Before / After
    beforeAfter: BeforeAfterComparison;
  };
}
