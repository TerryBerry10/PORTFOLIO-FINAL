export interface SkillObject {
  id: string;
  name: string;
  category: 'Engine' | 'Programming' | 'Graphics & Shaders' | 'Systems & Architecture' | 'Tools & Pipeline' | 'Audio & Math';
  icon: string;
  workshopItem: string; // Physical object in workshop (e.g. "Game Engine Anvil", "Shader Crystal", "Math Abacus")
  description: string;
  whatIUseItFor: string[];
  projectsUsedIn: string[];
  levelOfExperience: string; // e.g. "5+ Years // Production Architecture"
  keySpecialties: string[];
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  category: 'Genesis' | 'Architecture' | 'Game Jam' | 'Shipped Title' | 'Technical Breakthrough';
  story: string;
  technologies: string[];
  artifact: string; // physical rune / leaf / emblem
  lesson: string;
}

export interface ExperimentItem {
  id: string;
  title: string;
  category: 'Shaders' | 'Physics' | 'Procedural' | 'AI / Boids' | 'VFX' | 'Kinematics';
  shortDesc: string;
  tech: string[];
  interactiveDemoId: 'boids' | 'grass-wind' | 'cel-water' | 'rope-verlet' | 'gravity-field' | 'particle-fire';
  instruction: string;
  codeSnippet: string;
}

export interface DeveloperProfile {
  name: string;
  title: string;
  handle: string;
  tagline: string;
  shortBio: string;
  extendedBio: string[];
  philosophy: string;
  location: string;
  status: string;
  email: string;
  links: {
    github: string;
    linkedin: string;
    itchIo: string;
    discord: string;
    unityPlay?: string;
    twitter?: string;
    youtube?: string;
  };
  resume: {
    summary: string;
    highlights: string[];
    experience: {
      role: string;
      company: string;
      period: string;
      location: string;
      bullets: string[];
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
      focus: string;
    }[];
  };
}
