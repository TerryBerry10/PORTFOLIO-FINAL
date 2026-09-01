import { DeveloperProfile } from '../types/skills';

export const developerInfo: DeveloperProfile = {
  name: "Vinay Sankar",
  title: "Technical Artist • Game Developer",
  handle: "vinaysankar",
  tagline: "I build cool games, expressive shaders, and living interactive worlds.",
  shortBio: "Technically grounded Technical Artist & Game Developer with a solid foundation in Computer Applications (BCA) and advanced post-graduate specialization in Game Technology (M.Sc.). Skilled in Unity (URP), C# scripting, Shader Graph, HLSL shader programming, real-time particle VFX, and Mecanim animation state machines.",
  extendedBio: [
    "I believe the best games live at the sweet spot between technical precision and artistic wonder. As both a game developer and technical artist, I bridge art and engineering to craft responsive combat feedback, custom stylized shaders, and optimized game systems.",
    "My toolkit spans Unity (URP / 2D / 3D), Unreal Engine, Godot, C#, C++, HLSL Shader Programming, Autodesk Maya, Blender, and real-time VFX.",
    "When I build a game, my obsession is game feel: every jump arc must be responsive, every shader must have warmth and depth, and every frame must lock at a rock-solid 60 FPS."
  ],
  philosophy: "The world attracts attention. The engineering earns respect. Great games are living paintings powered by clean code and tactile physics.",
  location: "Bangalore, India",
  phone: "+91 7356749187",
  portfolioUrl: "https://final-portfolio-xi-topaz.vercel.app",
  status: "Open for Full-Time & Remote Roles",
  email: "sankarvinay70@gmail.com",
  links: {
    github: "https://github.com/Nigatron911",
    unityPlay: "https://play.unity.com/en/user/1aa32da2-fe9b-426b-8af6-3c6d4b65f3b6",
    linkedin: "https://linkedin.com/in/vinaysankar",
    itchIo: "https://vinaysankar.itch.io",
    discord: "vinay_dev#4291",
    twitter: "https://twitter.com/vinaysankar_dev",
  },
  resume: {
    summary: "Technically grounded Technical Artist & Game Developer with a solid foundation in Computer Applications (BCA) and advanced post-graduate specialization in Game Technology (M.Sc.). Skilled in Unity (URP), C# scripting, Shader Graph, HLSL shader programming, real-time particle VFX, and Mecanim animation state machines. Experienced in bridging art and engineering to craft responsive combat feedback, custom stylized shaders, and optimized game systems. Based in Bangalore, eager to contribute to mobile and PC game production pipelines.",
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
        role: "Solo Technical Artist & Developer",
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
        role: "Technical Artist & Gameplay Programmer",
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
        role: "Technical Artist & Programmer",
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
