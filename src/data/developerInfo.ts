import { DeveloperProfile } from '../types/skills';

export const developerInfo: DeveloperProfile = {
  name: "Vinay Sankar",
  title: "Game Developer & Technical Artist",
  handle: "vinaysankar",
  tagline: "I build cool games, expressive shaders, and living interactive worlds.",
  shortBio: "Specializing in the intersection of gameplay engineering and technical art: custom HLSL/GLSL shaders, responsive character kinematics, procedural environments, and stylized game feel. I build games where art and code elevate each other seamlessly.",
  extendedBio: [
    "I believe the best games live at the sweet spot between technical precision and artistic wonder. As both a game developer and technical artist, I don't just write gameplay code or make assets — I build the bridges between them: vertex shaders that react to footfalls, deterministic combat state machines with impactful juice, and procedural rendering systems running at high framerates.",
    "My toolkit spans Unity (C#), custom HLSL/GLSL shader pipelines, Blender 3D modeling/rigging, WebGL/Three.js interactive web engines, and procedural generation algorithms.",
    "When I build a game, my obsession is game feel: every jump arc must be responsive, every shader must have warmth and depth, and every frame must respect the player's time."
  ],
  philosophy: "The world attracts attention. The engineering earns respect. Great games are living paintings powered by clean code and tactile physics.",
  location: "Bangalore, India",
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
    summary: "Game Developer & Technical Artist with deep hands-on expertise in Unity (C#), custom HLSL/GLSL shaders, procedural systems, 3D art pipelines (Blender), and real-time interactive web graphics (WebGL/Canvas). Proven record creating complete games from prototype to polished production.",
    highlights: [
      "Engineered responsive 2D/3D gameplay mechanics, combat pipelines, and sub-frame hitbox evaluation systems.",
      "Authored custom stylized Ghibli watercolor, wind-reactive foliage, and water reflection shaders with zero-allocation performance.",
      "Built complete 3D asset workflows in Blender: low-poly modular modeling, texturing, character rigging, and collision hulls.",
      "Developed web-playable game engines, real-time physics sandboxes, and procedural audio synthesizers with WebGL and Web Audio API."
    ],
    experience: [
      {
        role: "Game Developer & Technical Artist",
        company: "Indie Game Development & Creative Labs",
        period: "2023 — Present",
        location: "Remote",
        bullets: [
          "Developed core gameplay mechanics, character controllers, and deterministic combat state machines for multiple PC and web titles.",
          "Wrote custom vertex and fragment shaders in HLSL for dynamic foliage wind waves, water reflections, and stylized cel-shading.",
          "Profiled and optimized CPU/GPU performance across target platforms, reducing draw calls by 65% and locking 60–120 FPS."
        ]
      },
      {
        role: "Gameplay Programmer & Technical Designer",
        company: "Interactive Games & Systems",
        period: "2021 — 2023",
        location: "Remote",
        bullets: [
          "Engineered procedural world generation algorithms, utility AI behaviors, and spatial navigation pathfinding systems.",
          "Bridged 3D Blender asset rigs, inverse kinematics, and gameplay hurtbox colliders into unified Unity pipelines.",
          "Built real-time interactive web simulations and physics tools using TypeScript, Canvas 2D, and WebGL."
        ]
      },
      {
        role: "Junior Game Developer",
        company: "Game Studio Lab",
        period: "2019 — 2021",
        location: "India",
        bullets: [
          "Implemented 2D/3D character controllers with sub-pixel collision resolution, ledge detection, and variable jump physics.",
          "Designed data-driven weapon and inventory systems with custom serialized node graphs."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "Engineering University",
        year: "2020",
        focus: "Computer Graphics, Real-Time Game Physics, Shaders, Game Architecture"
      }
    ]
  }
};
