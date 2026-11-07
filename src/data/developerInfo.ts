import { DeveloperProfile } from '../types/skills';

export const developerInfo: DeveloperProfile = {
  name: "Vinay Sankar",
  title: "Game Developer",
  handle: "vinaysankar",
  tagline: "I make small, fast games and the shaders and effects that make them feel good.",
  shortBio: "Game developer, currently in the second year of an M.Sc. in Game Technology. I work mostly in Unity and C#, and I focus on gameplay, game feel, shaders and VFX. I have released three browser-playable games, and you can play all of them on this site.",
  extendedBio: [
    "I like the point where code meets art: the shader that makes a hit look powerful, the two frames of hitstop that make it feel powerful.",
    "Most of my work is in Unity (URP, 2D and 3D) with C#, Shader Graph and HLSL. I also use Blender and Maya, and I write JavaScript and TypeScript. This portfolio is hand-built in React with a canvas-rendered world.",
    "I'm looking for a game developer or gameplay programmer role where I can keep learning from people who ship games."
  ],
  philosophy: "Make it readable, make it feel good, then make it fast.",
  location: "Bangalore, India",
  phone: "+91 7356749187",
  portfolioUrl: "https://terryberry10.github.io/portfolio",
  status: "Open for Full-Time & Remote Roles",
  email: "sankarvinay70@gmail.com",
  links: {
    github: "https://github.com/TerryBerry10",
    unityPlay: "https://play.unity.com/en/user/1aa32da2-fe9b-426b-8af6-3c6d4b65f3b6",
    linkedin: "https://www.linkedin.com/in/vinay-sankar-6a157b252/",
  },
  resume: {
    summary: "Game Developer with a solid foundation in Computer Applications (BCA) and advanced post-graduate specialization in Game Technology (M.Sc.). Skilled in Unity (URP), C# scripting, Shader Graph, HLSL shader programming, real-time particle VFX, and Mecanim animation state machines. Experienced in bridging art and engineering to craft responsive combat feedback, custom stylized shaders, and optimized game systems. Based in Bangalore, eager to contribute to mobile and PC game production pipelines.",
    highlights: [
      "Engineered stylized custom shaders in Shader Graph & HLSL for dynamic combat auras, afterimage motion trails, and distortion effects.",
      "Designed responsive combo attack choreography, special attacks, and punchy audiovisual feedback loops (screen shake, hitstop freeze-frames, hit sparks, physics knockback).",
      "Built modular C# Object Pooling architecture for high-frequency hit particles and projectiles, eliminating garbage collection spikes and ensuring smooth 60 FPS gameplay.",
      "Authored dynamic glowing neon shaders, reactive boundary materials, and custom trail renderers for high visual clarity."
    ],
    technicalSkills: [
      {
        category: "Game Engines",
        items: "Unity (Advanced - URP / 2D / 3D), Unreal Engine, Godot"
      },
      {
        category: "Programming & Scripting",
        items: "C#, C++, C, OOP, JavaScript, HTML5"
      },
      {
        category: "Shaders & VFX",
        items: "Unity Shader Graph, HLSL Programming, Shuriken Particles, Combat VFX"
      },
      {
        category: "Animation & Rigging",
        items: "Unity Mecanim Animator, Blend Trees, Ragdoll Physics, Maya / Blender"
      },
      {
        category: "Optimization & Profiling",
        items: "Unity Profiler, Frame Debugger, Object Pooling, Overdraw Control"
      },
      {
        category: "Tools & Version Control",
        items: "Git, GitHub, Autodesk Maya, Blender"
      }
    ],
    featuredProjects: [
      {
        title: "Dottie — 2D Anime-Style 1v1 Combat Game",
        tech: "Unity / C#",
        role: "Solo Developer",
        bullets: [
          {
            heading: "Custom Shaders & Visual Juice",
            text: "Engineered stylized custom shaders in Shader Graph & HLSL for dynamic combat auras, afterimage motion trails, and distortion effects inspired by anime fighters."
          },
          {
            heading: "Combat Feel & Game Feedback",
            text: "Designed responsive combo attack choreography, special attacks, and punchy audiovisual feedback loops (screen shake, hitstop freeze-frames, hit sparks, physics knockback)."
          },
          {
            heading: "Performance Optimization",
            text: "Built a modular C# Object Pooling architecture for high-frequency hit particles and projectiles, eliminating garbage collection spikes and ensuring smooth 60 FPS gameplay."
          },
          {
            heading: "Full-Cycle Execution",
            text: "Solo developed all gameplay programming, animation states, custom shaders, and particle systems from scratch."
          }
        ]
      },
      {
        title: "Astral Rally — Fast-Paced Multi-Ball Arcade Game",
        tech: "Unity / C#",
        role: "Gameplay Programmer",
        bullets: [
          {
            heading: "Shader & Arena Visuals",
            text: "Authored dynamic glowing neon shaders and reactive boundary collision materials that respond visually to high-velocity ball impacts."
          },
          {
            heading: "VFX & Motion Trails",
            text: "Created procedural particle bursts and custom trail renderers to ensure high visual clarity during chaotic multi-ball gameplay."
          },
          {
            heading: "Physics & Mechanics",
            text: "Implemented responsive paddle controls, multi-ball trajectory math, and collision detection in C#."
          }
        ]
      },
      {
        title: "Bait — Reverse-Snake Survival Game",
        tech: "Unity / C#",
        role: "Programmer",
        bullets: [
          {
            heading: "Visual Indicators & Shaders",
            text: "Built custom trail shaders and danger-zone visual cues highlighting predator snake proximity."
          },
          {
            heading: "Particle Feedback & Feel",
            text: "Designed lightweight particle burst systems triggered upon near-misses and capture events."
          },
          {
            heading: "AI & Movement Logic",
            text: "Programmed predator pursuit algorithms and fluid player navigation mechanics in Unity."
          }
        ]
      }
    ],
    experience: [
      {
        role: "Freelance Web & Application Developer",
        company: "Independent Freelance",
        period: "Recent",
        location: "Bangalore, India",
        bullets: [
          "Built and deployed custom web applications and interactive interfaces using JavaScript and HTML5.",
          "Translated client specifications into clean, modular code with responsive UI and optimized assets."
        ]
      }
    ],
    education: [
      {
        degree: "M.Sc. in Game Technology",
        institution: "ICAT Design & Media College (Alagappa University)",
        year: "2nd Year (Pursuing)",
        location: "Chennai, India",
        focus: "Advanced Game Technology, Real-Time Graphics & Game Production"
      },
      {
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "Lovely Professional University (LPU)",
        year: "Graduated 2025",
        location: "Punjab, India",
        focus: "Computer Applications, Software Architecture & Programming"
      }
    ]
  }
};
