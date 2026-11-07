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
  portfolioUrl: "https://terryberry10.github.io/PORTFOLIO-FINAL",
  status: "Open for Full-Time & Remote Roles",
  email: "sankarvinay70@gmail.com",
  links: {
    github: "https://github.com/TerryBerry10",
    unityPlay: "https://play.unity.com/en/user/1aa32da2-fe9b-426b-8af6-3c6d4b65f3b6",
    linkedin: "https://www.linkedin.com/in/vinay-sankar-6a157b252/",
  },
  resume: {
    summary: "Game Developer with a Bachelor of Computer Applications (BCA) and a post-graduate specialization in Game Technology (M.Sc., in progress). Hands-on with the real-time rendering pipeline through custom HLSL and Shader Graph shaders, particle VFX and GPU-side optimization in Unity (URP), plus prototyping and cinematics in Unreal Engine. Programs in C++ and C# with an object-oriented design approach; familiar with Vulkan, DirectX 11/12 and OpenGL. Experienced in profiling and debugging frame-time problems with the Unity Profiler and Frame Debugger. Based in Bangalore.",
    highlights: [
      "Engineered stylized HLSL and Shader Graph shaders inside Unity's URP rendering pipeline for combat auras, afterimage motion trails, and distortion effects.",
      "Traced frame-time spikes to garbage collection and fixed them with a modular, object-oriented C# pooling architecture, holding a smooth 60 FPS.",
      "Built a playable grapple-hook movement prototype and two rendered cinematics in Unreal Engine.",
      "Programs in C++ and C#; familiar with Vulkan, DirectX 11/12 and OpenGL."
    ],
    technicalSkills: [
      {
        category: "Programming",
        items: "C++, C#, C, Object-Oriented Design, JavaScript, HTML5"
      },
      {
        category: "Graphics APIs & Shaders",
        items: "Vulkan, DirectX 11/12, OpenGL, HLSL, Unity Shader Graph"
      },
      {
        category: "Game Engines",
        items: "Unity (Advanced - URP / 2D / 3D), Unreal Engine, Godot"
      },
      {
        category: "Rendering & VFX",
        items: "Real-time rendering pipeline, stylized shaders, Shuriken Particles, Combat VFX, Overdraw Control"
      },
      {
        category: "Profiling & Debugging",
        items: "Unity Profiler, Frame Debugger, Object Pooling, GC-spike elimination"
      },
      {
        category: "Animation & Tools",
        items: "Unity Mecanim, Blend Trees, Ragdoll Physics, Maya / Blender, Git / GitHub"
      }
    ],
    featuredProjects: [
      {
        title: "Dottie — 2D Anime-Style 1v1 Combat Game",
        tech: "Unity / C#",
        role: "Solo Developer",
        bullets: [
          {
            heading: "GPU Rendering & Custom Shaders",
            text: "Engineered stylized HLSL and Shader Graph shaders inside Unity's URP rendering pipeline for dynamic combat auras, afterimage motion trails, and distortion effects inspired by anime fighters."
          },
          {
            heading: "Combat Feel & Game Feedback",
            text: "Designed responsive combo attack choreography, special attacks, and punchy audiovisual feedback loops (screen shake, hitstop freeze-frames, hit sparks, physics knockback)."
          },
          {
            heading: "Profiling & Performance",
            text: "Traced frame-time spikes to garbage collection and fixed them with a modular, object-oriented C# pooling architecture for high-frequency hit particles and projectiles, holding a smooth 60 FPS."
          },
          {
            heading: "Full-Cycle Execution",
            text: "Solo developed all gameplay programming, animation states, custom shaders, and particle systems from scratch."
          }
        ]
      },
      {
        title: "Escape the Miraj & Unreal Cinematics",
        tech: "Unreal Engine",
        role: "Solo Developer",
        bullets: [
          {
            heading: "Grapple Hook Tech Demo",
            text: "Built a playable grapple-hook movement prototype in Unreal Engine as the foundation for a planned action game."
          },
          {
            heading: "Cinematic Sequences",
            text: "Produced two rendered cinematics in Unreal Engine: a car chase and the story intro for Life of an Ant."
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
            heading: "Physics & Mechanics",
            text: "Implemented responsive paddle controls, multi-ball trajectory math, collision detection, and custom trail renderers in C#."
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
            text: "Built custom trail shaders, danger-zone visual cues, and lightweight particle bursts for near-misses and capture events."
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
