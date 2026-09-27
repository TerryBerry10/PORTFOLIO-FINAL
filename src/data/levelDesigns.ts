export interface LevelImage {
  id: string;
  url: string;
  title: string;
  caption: string;
  tag?: string;
}

export interface LevelDesignProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'environment-art' | 'blockout' | 'lighting' | 'combat-arena';
  categoryLabel: string;
  engine: string;
  year: string;
  heroImage: string;
  images: LevelImage[];
  overview: string;
  designPhilosophy: string;
  metricsAndFlow: string[];
  lightingAtmosphere: string[];
  toolsUsed: string[];
  keyFeatures: string[];
}

export const levelDesignProjects: LevelDesignProject[] = [
  {
    id: 'whispering-valley',
    title: 'The Whispering Valley & Ancient Plateau',
    subtitle: 'Open-World Stylized Terrain, Sightline Composition & Environmental Storytelling',
    category: 'environment-art',
    categoryLabel: 'Environment Art & World Layout',
    engine: 'Unity URP & Custom Shaders',
    year: '2025',
    heroImage: '/levels/whispers_wide_terrain.png',
    images: [
      {
        id: 'wv-1',
        url: '/levels/whispers_wide_terrain.png',
        title: 'Wide Vista & Spatial Landmark Hierarchy',
        caption: 'Wide atmospheric perspective demonstrating clear focal points, natural guiding pathways, and tiered elevation for player orientation.',
        tag: 'Wide Vista Layout'
      },
      {
        id: 'wv-2',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        title: 'Mystic Foliage & Canopy Lighting',
        caption: 'Detailed foliage dressing with volumetric light shafts and contrasting warm amber bioluminescence against cool emerald shadows.',
        tag: 'Atmosphere & Dressing'
      },
      {
        id: 'wv-3',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
        title: 'Ancient Shrine Sanctuary Approach',
        caption: 'Visual framing guiding the player toward the central shrine with stone lanterns acting as leading lines.',
        tag: 'Framing & Leading Lines'
      }
    ],
    overview: 'A stylized natural environment engineered with strong visual hierarchy, tiered verticality, and organic player pathing. Built to balance expansive sightlines with intimate POIs (Points of Interest).',
    designPhilosophy: 'Every landmark is positioned using the "Weenie" principle — prominent distant silhouettes pull the player forward while terrain folds reveal layered micro-destinations.',
    metricsAndFlow: [
      '3-Tier Verticality: Low riverbed, mid-elevation meadow trail, and high overlook observatory.',
      'Organic Leading Lines: Winding cobblestone paths and rock formations naturally guide the player without heavy UI markers.',
      'Focal Framing: Torii archways and ancient monoliths frame key vistas from major approach angles.'
    ],
    lightingAtmosphere: [
      'Custom URP Stylized Atmospheric Scattering & Volumetric Rim Lighting.',
      'Day/Night color grading transitions: Vibrant golden hour into bioluminescent midnight.',
      'Dynamic wind interaction on stylized grass and cherry blossom foliage.'
    ],
    toolsUsed: ['Unity URP', 'Shader Graph', 'Blender', 'ProBuilder', 'Substance Painter'],
    keyFeatures: [
      'Seamless 2D/3D Parallax & Depth Cues',
      'Zero-Overdraw Optimized Vegetation',
      'Dynamic Weather & Wind Response',
      'Natural Chokepoints & Combat Encounters'
    ]
  },
  {
    id: 'cyberpunk-rooftop-arena',
    title: 'Neon Nexus // 1v1 Combat Rooftop',
    subtitle: 'Fast-Paced Asymmetric Combat Arena with Cover Flow & Hazard Zones',
    category: 'combat-arena',
    categoryLabel: 'Combat Arena & Greybox Layout',
    engine: 'Unity URP & C#',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    images: [
      {
        id: 'nn-1',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        title: 'Overhead Arena Geometry & Sightlines',
        caption: 'High-contrast neon lighting with distinct perimeter danger zones, wall-bounce surfaces, and central combat pocket.',
        tag: 'Greybox to Polish'
      },
      {
        id: 'nn-2',
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
        title: 'Edge Hazard & Knockback Boundary',
        caption: 'Reactive neon warning decals and emissive barriers indicating ring-out risk areas during high-intensity 1v1 engagements.',
        tag: 'Hazard Design'
      }
    ],
    overview: 'Engineered specifically for Dottie combat mechanics. Designed with tight collision hulls, predictable wall-bounce geometry, and high-readability neon silhouettes so player attacks remain legible.',
    designPhilosophy: 'Readability is king. Combat arenas require clean floor textures, non-intrusive background depth, and sharp collision borders so players never fight the camera.',
    metricsAndFlow: [
      'Standardized Player Jump Arcs: Ceiling heights and platform drops precisely tuned to dodge frames.',
      'Symmetric Sightlines with Asymmetric Cover: Balanced tournament fairness with expressive positioning options.',
      'Camera Frustum Bounds: Zero visual obstruction during extreme zoom-ins and screen shake freeze-frames.'
    ],
    lightingAtmosphere: [
      'High-contrast Neon emissive shaders with localized bloom.',
      'Subtle ambient rim lights to separate character silhouettes from dark urban backgrounds.',
      'Reactive impact flash rings along perimeter boundaries.'
    ],
    toolsUsed: ['Unity (URP)', 'ProBuilder', 'HLSL Shaders', 'Blender'],
    keyFeatures: [
      'Pixel-Perfect Hitbox Clamping',
      'Zero Camera Clip Geometry',
      'High Contrast Fighting Readability',
      'Modular Sci-Fi Prop Kit'
    ]
  },
  {
    id: 'torii-shrine-sanctuary',
    title: 'Torii Sanctuary & Sacred Forest Grove',
    subtitle: 'Atmospheric Environmental Dressing, Light Moods & Zen Composition',
    category: 'lighting',
    categoryLabel: 'Lighting & Environmental Dressing',
    engine: 'Unity URP',
    year: '2025',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    images: [
      {
        id: 'ts-1',
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
        title: 'Crimson Torii Gateway & Lantern Trail',
        caption: 'Leading stone lantern path guiding player eye through dense autumn foliage toward sacred shrine.',
        tag: 'Mood & Lighting'
      },
      {
        id: 'ts-2',
        url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1200&auto=format&fit=crop',
        title: 'Sakura Canopy & Reflection Pool',
        caption: 'Soft diffused moonlight reflecting across still water with floating petal geometry.',
        tag: 'Water & Reflections'
      }
    ],
    overview: 'An environmental showcase inspired by traditional Japanese Shinto shrines and Ghibli aesthetics. Focuses on peaceful exploration pacing, emotional color palettes, and ambient nature feedback.',
    designPhilosophy: 'Pacing through spatial compression and expansion: Tight forest pathways open into grand sunlit courtyards to evoke a sense of discovery.',
    metricsAndFlow: [
      'Compression & Expansion: Dense tree tunnels leading to open waterside sanctuaries.',
      'Stepped Approaches: Stone stairs paced to match character cadence.',
      'Environmental Storytelling: Weathered moss, cracked masonry, and offerings tell the shrine history.'
    ],
    lightingAtmosphere: [
      'Warm point light falloff inside stone lanterns (Tōrō).',
      'Volumetric moonbeams filtering through cedar and maple canopies.',
      'Stylized water shader with dynamic normal ripples and foam edges.'
    ],
    toolsUsed: ['Unity URP', 'Maya', 'Shader Graph', 'Photoshop'],
    keyFeatures: [
      'Ghibli-Style Hand-Painted Textures',
      'Dynamic Falling Sakura Simulation',
      'Custom Water & Shimmer Shaders',
      'Atmospheric Audio Zone Triggers'
    ]
  }
];
