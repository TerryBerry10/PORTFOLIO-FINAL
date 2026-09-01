import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'dottie',
    title: 'Dottie',
    subtitle: '1 v 1 Anime Battle',
    year: '2026',
    category: 'Action Battle',
    role: 'Lead Gameplay Engineer & Game Designer',
    platform: 'WebGL / Unity (Playable in Browser)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#'],
    playableUrl: 'https://play.unity.com/en/games/80577269-b219-42a4-8bc2-07ebde267f23/dottie',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'floating_island',
    shortDescription: '1 v 1 anime style battle — unleash your rage!',
    hook: 'How do you make a simple dot character feel alive, ultra-responsive, and endlessly satisfying to control?',
    breakdown: {
      idea: {
        summary: 'Built to explore the absolute limits of pure character responsiveness and tactile game feel. Every single movement parameter — from jump acceleration curves to ground landing squash — was tuned for instant physical satisfaction.',
        playerExperience: 'Leaping across tight platforms with pixel-perfect momentum control, feeling the elastic recoil of high-speed bounces, and navigating precision physics obstacles with zero input latency.',
        influences: ['Celeste player feel physics', 'Super Meat Boy tight responsiveness', 'LocoRoco organic squash-and-stretch']
      },
      coreSystem: {
        title: 'Custom Kinematic Velocity Solver & Spring-Damper Deformation',
        explanation: 'Rather than relying on generic Unity Rigidbody physics (which feels floaty and imprecise), Dottie is powered by a custom deterministic Kinematic Velocity Solver with sub-pixel raycast snapping, 6-frame coyote time window, and jump input buffering.',
        technicalDepth: 'The character mesh dynamically deforms on impact using a 2D mass-spring-damper system: F = -k * x - c * v. As vertical velocity peaks or impacts ground surfaces, volume-preserving scale matrices (scaleX = 1 / sqrt(scaleY)) maintain authentic mass feel.',
        mechanicsSummary: 'Variable jump height (jump cut on button release), wall slides, ledge tolerance raycasts, spring squash deformation, and particle dust puffs.'
      },
      architecture: {
        overview: 'Raw Input -> Input Buffer & Coyote Timer -> Kinematic Velocity Integrator -> Raycast Collision Solver -> Spring Squash Mesh -> Impact Juice Emitter.',
        nodes: [
          {
            id: 'node-input',
            label: 'Input Buffer & Coyote Timer',
            sublabel: '6-frame grace window',
            category: 'input',
            description: 'Buffers jump presses 120ms before landing and allows jumping 100ms after leaving ledges.',
            details: ['Sub-frame input timestamps', 'Jump release height cut listener'],
            x: 100,
            y: 80
          },
          {
            id: 'node-kinematic',
            label: 'Kinematic Velocity Solver',
            sublabel: 'Custom Euler step',
            category: 'physics',
            description: 'Calculates acceleration curves, terminal velocity, and variable gravity multipliers.',
            details: ['Asymmetric fall gravity (1.8x on downward arc)', 'Horizontal friction drag'],
            x: 320,
            y: 80
          },
          {
            id: 'node-spring',
            label: 'Spring-Damper Mesh',
            sublabel: 'Volume-preserving squash',
            category: 'logic',
            description: 'Deforms character scale on jumps and landings without losing perceived mass.',
            details: ['Harmonic oscillator math', 'scaleX * scaleY = constant volume'],
            x: 540,
            y: 80
          },
          {
            id: 'node-juice',
            label: 'Impact Juice Emitter',
            sublabel: 'Camera trauma & particles',
            category: 'vfx',
            description: 'Triggers landing dust puffs, sound transients, and micro-screen trauma on hard falls.',
            details: ['Object pooled landing particles', 'Velocity-scaled audio pitch'],
            x: 320,
            y: 240
          }
        ],
        edges: [
          { from: 'node-input', to: 'node-kinematic', label: 'Jump Impulse', animated: true },
          { from: 'node-kinematic', to: 'node-spring', label: 'Velocity Vector', animated: true },
          { from: 'node-kinematic', to: 'node-juice', label: 'Ground Contact', animated: true }
        ]
      },
      problem: {
        title: 'Floaty Jump Arcs & Corner Snagging',
        symptom: 'Standard Rigidbody jump felt sluggish at the apex, and character corners would catch on pixel-width platform edges, ruining player momentum.',
        rootCause: 'Linear gravity produces identical rise and fall durations, making jumps feel floaty. Square colliders snag on tilemap seams.',
        failedAttempts: ['Increasing standard gravity (made the jump feel like dropping an anvil, losing precision).']
      },
      solution: {
        approach: 'Implemented asymmetric gravity (higher downward gravity when falling or releasing jump button early) and added round corner rays that gently nudge the player around edge corners.',
        whyItWorked: 'Gave the player absolute precision at the jump peak while eliminating all edge catching.',
        codeHighlight: {
          language: 'csharp',
          filename: 'DottieCharacterController.cs',
          explanation: 'Asymmetric gravity and jump cut physics:',
          code: `// Custom Kinematic Gravity with Asymmetric Downward Weight
private void ApplyCustomGravity(float dt) {
    if (_isGrounded) {
        _velocity.y = -_groundSnapForce;
        return;
    }
    
    float gravityMultiplier = 1.0f;
    // Faster falling for punchy game feel
    if (_velocity.y < 0) {
        gravityMultiplier = _fallGravityMultiplier; // 1.8x
    } else if (_velocity.y > 0 && !Input.GetButton("Jump")) {
        gravityMultiplier = _jumpCutGravityMultiplier; // 2.2x for short hops
    }
    
    _velocity.y -= _baseGravity * gravityMultiplier * dt;
    _velocity.y = Mathf.Max(_velocity.y, -_maxFallSpeed);
}`
        }
      },
      performance: {
        bottleneck: 'Physics trigger overhead and garbage collection during rapid jumping.',
        metrics: [
          { metric: 'Input-to-Action Latency', before: '32ms (Standard PhysX)', after: '4ms (Direct Kinematic)', delta: '-87.5%' },
          { metric: 'Framerate on WebGL', before: '45-55 FPS', after: '60 FPS Solid', delta: '+25%' },
          { metric: 'Ledge Jump Forgiveness', before: '0ms (Unforgiving)', after: '100ms (Coyote Time)', delta: '+100%' },
          { metric: 'GC Allocation / Frame', before: '1.2 KB', after: '0 Bytes', delta: '-100%' }
        ],
        keyTechnique: 'Custom Kinematic Velocity Solver + Pre-allocated RaycastCommand NonAlloc queries.'
      },
      iteration: [
        {
          phase: 'Phase 01',
          title: 'Core Kinematics Blockout',
          date: 'Jan 2026',
          description: 'Implemented 2D kinematic box caster and basic jump arc.',
          keyChallenge: 'Floaty jump feel.',
          milestone: 'Added asymmetric fall gravity multiplier.'
        },
        {
          phase: 'Phase 02',
          title: 'Juice & Squash Deformation',
          date: 'Feb 2026',
          description: 'Added mass-spring mesh deformation, landing dust particles, and coyote time.',
          keyChallenge: 'Maintaining volume preservation on extreme squash.',
          milestone: 'Shipped playable build to Unity Play with stellar community game feel feedback.'
        }
      ],
      lessonsLearned: {
        technical: 'Never use standard Rigidbody gravity for platformers. Custom kinematic velocity calculations give total deterministic control over game feel.',
        design: 'Coyote time and jump buffering are non-negotiable for platformers. They forgive human reaction imperfections without making the game easy.',
        takeaway: 'Game feel is not an afterthought — it is the core mechanic.'
      },
      playground: {
        type: 'platformer-feel',
        description: 'Test the live Dottie movement physics below. Adjust Jump Height, Fall Gravity Multiplier, Coyote Time Window, and Squash Spring Stiffness.',
        params: [
          { id: 'damageWeight', name: 'Jump Impulse Force', min: 8.0, max: 24.0, step: 0.5, defaultValue: 16.5, unit: 'm/s', description: 'Initial vertical upward velocity upon jumping.' },
          { id: 'heatRisk', name: 'Fall Gravity Multiplier', min: 1.0, max: 3.0, step: 0.1, defaultValue: 1.8, unit: 'x', description: 'Downward gravity multiplier acting during fall arc.' },
          { id: 'coverPriority', name: 'Coyote Time Window', min: 0.02, max: 0.20, step: 0.01, defaultValue: 0.10, unit: 'sec', description: 'Grace period allowing jump after leaving platform ledge.' },
          { id: 'squadTokens', name: 'Squash Spring Elasticity', min: 0.2, max: 2.0, step: 0.1, defaultValue: 1.2, unit: 'k', description: 'Spring restorative force returning Dottie to spherical shape.' }
        ]
      },
      xrayData: {
        colliders: [
          { name: 'Dottie_Kinematic_Circle', type: 'circle', color: '#f2d192', desc: 'Active sub-pixel kinematic collider' },
          { name: 'Platform_Top_Ray_Probe', type: 'capsule', color: '#4c785d', desc: 'Downwards 3-point ground snap probe' }
        ],
        raycasts: [
          { name: 'Coyote_Ledge_Probe', length: 0.4, purpose: 'Detects ledge transitions for jump forgiveness' },
          { name: 'Corner_Nudge_Ray', length: 0.6, purpose: 'Pushes character around platform corners smoothly' }
        ],
        stateMachines: [
          { state: 'Grounded_Idle', trigger: 'Jump_Pressed', next: 'Airborne_Ascending' },
          { state: 'Airborne_Ascending', trigger: 'Velocity_Y <= 0', next: 'Airborne_Descending' },
          { state: 'Airborne_Descending', trigger: 'Ground_Contact', next: 'Landing_Squash' },
          { state: 'Landing_Squash', trigger: 'Spring_Equilibrium', next: 'Grounded_Idle' }
        ],
        performance: { drawCalls: 3, triangleCount: '3.2k', frameTime: '0.9ms', gcAlloc: '0 B / frame' }
      },
      beforeAfter: {
        title: 'Platformer Feel: Standard PhysX vs Custom Kinematics',
        description: 'Drag the slider to compare standard Unity PhysX Rigidbody platforming (left: floaty, delayed, no coyote time) against custom Kinematic Velocity Solver with squash-and-stretch (right: snappy, juicy, 100% responsive).',
        aspectRatio: '16/9',
        beforeLabel: 'Standard Unity PhysX (Floaty & Laggy)',
        afterLabel: 'Custom Kinematic Solver (Juicy & Crisp)',
        beforeType: 'canvas-unoptimized',
        afterType: 'canvas-final',
        notes: 'Notice how the custom solver eliminates apex floatiness and delivers instant tactile control.'
      }
    }
  },
  {
    id: 'bait',
    title: 'Bait',
    subtitle: 'Escape Platformer',
    year: '2026',
    category: 'Platformer',
    role: 'Lead Developer & Systems Architect',
    platform: 'WebGL / Unity (Playable in Browser)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#'],
    playableUrl: 'https://play.unity.com/en/games/198ab285-790a-46e0-97d0-45cdd3be176f/bait',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'ancient_forest',
    shortDescription: 'A platformer where you are the bait — try saving your life!',
    hook: 'How do you engineer high-tension predator AI with dynamic line-of-sight sensory cones and elastic lure physics?',
    breakdown: {
      idea: {
        summary: 'Created to produce an unbearable sense of atmospheric tension and risk-reward calculation. The player uses fragile lures to bait mysterious entities from the deep while managing line tension and avoiding sudden lunges.',
        playerExperience: 'Dangling glowing bait into murky abyss waters, watching shadowed silhouettes circle just outside the illumination threshold, and feeling the controller pulse right before an aggressive strike.',
        influences: ['Dredge atmospheric horror', 'Alien: Isolation tension pacing', 'Classic arcade fishing tension mechanics']
      },
      coreSystem: {
        title: 'Verlet Line Tension Physics & Multi-Sensory Predator AI',
        explanation: 'The lure is modeled as a multi-segment Verlet integration cable that transfers physical drag, line tension, and water resistance to the player. Lurking predator entities use dual-cone sensory perception (Vision Angle + Acoustic Vibration Radii).',
        technicalDepth: 'When bait is jiggled, it emits acoustic vibration pulses that fall off with inverse-square distance: I = I_0 / (1 + k * r^2). The predator’s state machine dynamically transitions between Stalk, Circle, Agitate, and High-Velocity Lunge.',
        mechanicsSummary: 'Verlet line tension, acoustic ripple emitter, shadow predator stealth AI, bite timing reflex, and adaptive tension audio.'
      },
      architecture: {
        overview: 'Player Input -> Cable Verlet Solver -> Vibration Wave Emitter -> Predator Sensory Cone -> Predator State Machine -> Tension Audio Synthesizer.',
        nodes: [
          {
            id: 'node-cable',
            label: 'Verlet Cable Solver',
            sublabel: 'Distance-constrained chain',
            category: 'physics',
            description: 'Computes elastic cable sag, fluid drag, and snap-back tension.',
            details: ['Multi-node Verlet integration', 'Dynamic buoyancy forces'],
            x: 100,
            y: 80
          },
          {
            id: 'node-sensor',
            label: 'Acoustic Wave Emitter',
            sublabel: 'Inverse-square ripple math',
            category: 'logic',
            description: 'Broadcasts vibration frequency pulses when bait moves rapidly.',
            details: ['Velocity-scaled vibration amplitude', 'Occlusion checking through obstacles'],
            x: 320,
            y: 80
          },
          {
            id: 'node-ai',
            label: 'Predator State Machine',
            sublabel: 'Perception & Stalk AI',
            category: 'state',
            description: 'Coordinates lurking, circling, strike preparation, and instant bite lunges.',
            details: ['Vision cone + Hearing sphere', 'Dynamic aggression threshold'],
            x: 540,
            y: 80
          },
          {
            id: 'node-audio',
            label: 'Adaptive Tension Audio',
            sublabel: 'Heartbeat & Sub-Bass pulse',
            category: 'audio',
            description: 'Modulates low-frequency rumble and dissonant drones as predators approach.',
            details: ['Real-time Web Audio low-pass filtering', 'Dynamic heartbeat tempo'],
            x: 320,
            y: 240
          }
        ],
        edges: [
          { from: 'node-cable', to: 'node-sensor', label: 'Bait Jiggle', animated: true },
          { from: 'node-sensor', to: 'node-ai', label: 'Perceived Noise', animated: true },
          { from: 'node-ai', to: 'node-audio', label: 'Proximity Threat', animated: true }
        ]
      },
      problem: {
        title: 'Predator Predictability & Cable Instability',
        symptom: 'Predators felt like robotic drones that instantly attacked on any input, while rapid reel-ins caused the Verlet cable nodes to explode into infinite coordinates.',
        rootCause: 'Linear distance-to-attack logic lacked suspense, and excessive delta-time spikes destabilized unconstrained Verlet integration.',
        failedAttempts: ['Adding random delays (made enemies feel unresponsive rather than calculating).']
      },
      solution: {
        approach: 'Implemented an "Aggression & Hesitation" pacing meter that forces predators to circle and stalk before committing, and added sub-step positional relaxation loops with maximum length clamping.',
        whyItWorked: 'Created genuine psychological suspense as players watch silhouettes pace cautiously before lunging, while cables remain 100% physically stable under extreme strain.',
        codeHighlight: {
          language: 'csharp',
          filename: 'PredatorSensoryController.cs',
          explanation: 'Sensory perception evaluation with acoustic and visual weights:',
          code: `public void EvaluateThreat(BaitLure lure, float dt) {
    Vector3 toLure = lure.transform.position - transform.position;
    float distance = toLure.magnitude;
    
    // 1. Acoustic Hearing Check (Inverse square falloff)
    float acousticStimulus = lure.VibrationEnergy / (1.0f + _acousticDamping * distance * distance);
    
    // 2. Vision Cone Check
    float angle = Vector3.Angle(transform.forward, toLure.normalized);
    bool inVisionCone = angle < _visionHalfAngle && distance < _visionRange;
    
    // 3. Update Suspense / Agitation Curve
    if (inVisionCone || acousticStimulus > _hearingThreshold) {
        _agitationMeter += (_agitationRate * (inVisionCone ? 1.5f : 1.0f)) * dt;
        if (_agitationMeter >= _lungeThreshold && _currentState != PredatorState.Lunging) {
            TriggerPredatorLunge(lure);
        }
    } else {
        _agitationMeter = Mathf.Max(0, _agitationMeter - _calmRate * dt);
    }
}`
        }
      },
      performance: {
        bottleneck: 'Raycasting for underwater vision occlusion and Verlet cable iterations.',
        metrics: [
          { metric: 'Cable Simulation Stability', before: 'Exploded on fast drag', after: '100% Stable Clamped', delta: '+100%' },
          { metric: 'AI Frame Compute Time', before: '6.4ms', after: '0.4ms (Cached Grid)', delta: '-93.7%' },
          { metric: 'Framerate on WebGL', before: '42 FPS', after: '60 FPS Locked', delta: '+42.8%' },
          { metric: 'Draw Calls (Murky Depths)', before: '78 calls', after: '5 Batched passes', delta: '-93.5%' }
        ],
        keyTechnique: 'Sub-Stepped Positional Relaxation + Distance-Field Sensory Occlusion.'
      },
      iteration: [
        {
          phase: 'Phase 01',
          title: 'Tension Cable Prototype',
          date: 'Jan 2026',
          description: 'Tested 2D Verlet rope physics with weight physics.',
          keyChallenge: 'Rope elasticity and whipping bugs.',
          milestone: 'Implemented Jacobi relaxation iterations.'
        },
        {
          phase: 'Phase 02',
          title: 'Predator AI & Sensory Cones',
          date: 'Feb 2026',
          description: 'Added acoustic hearing falloff, silhouette shaders, and lunging attack states.',
          keyChallenge: 'Balancing player reaction windows.',
          milestone: 'Shipped to Unity Play with players praising the suspenseful game atmosphere.'
        }
      ],
      lessonsLearned: {
        technical: 'Suspense in games is built on sensory asymmetry. Giving the enemy clear perceptual rules while obscuring their exact position creates profound player tension.',
        design: 'A predator that hesitates and circles is ten times scarier than a predator that runs straight at you.',
        takeaway: 'Atmosphere is code, audio, and physics working in perfect synchronization.'
      },
      playground: {
        type: 'combat-sandbox',
        description: 'Test the live Bait tension parameters below. Adjust Lure Vibration Sensitivity, Predator Lunge Speed, Hearing Radius, and Water Murkiness.',
        params: [
          { id: 'hitstop', name: 'Predator Aggression Rate', min: 0.2, max: 2.5, step: 0.1, defaultValue: 1.2, unit: 'x', description: 'Speed at which lurking predator builds up courage to strike.' },
          { id: 'cameraTrauma', name: 'Cable Spring Stiffness', min: 10, max: 100, step: 5, defaultValue: 65, unit: 'N/m', description: 'Elastic tension of the fishing line connection.' },
          { id: 'attackSpeed', name: 'Lunge Velocity Impulse', min: 5.0, max: 25.0, step: 1.0, defaultValue: 16.0, unit: 'm/s', description: 'Instantaneous forward speed during predator strike.' },
          { id: 'parryWindow', name: 'Reactivity Reflex Window', min: 2, max: 12, step: 1, defaultValue: 6, unit: 'frames', description: 'Tolerance window to jerk lure away from predator bite.' }
        ]
      },
      xrayData: {
        colliders: [
          { name: 'Lure_Bait_Trigger', type: 'circle', color: '#f59e0b', desc: 'Bioluminescent lure bait sensor' },
          { name: 'Predator_Jaws_Hurtbox', type: 'box', color: '#e07a5f', desc: 'Active strike and catch damage volume' }
        ],
        raycasts: [
          { name: 'Acoustic_Noise_Cone', length: 12.0, purpose: 'Samples vibration intensity and water occlusion' },
          { name: 'Lunge_Trajectory_Ray', length: 8.0, purpose: 'Calculates high-velocity strike path' }
        ],
        stateMachines: [
          { state: 'Lurk_Shadows', trigger: 'Noise_Exceeds_Threshold', next: 'Stalk_Circle_Bait' },
          { state: 'Stalk_Circle_Bait', trigger: 'Aggression_Max', next: 'High_Speed_Lunge' },
          { state: 'High_Speed_Lunge', trigger: 'Bite_Complete_Or_Miss', next: 'Retreat_Murk' }
        ],
        performance: { drawCalls: 5, triangleCount: '6.4k', frameTime: '1.1ms', gcAlloc: '0 B / frame' }
      },
      beforeAfter: {
        title: 'Predator Behavior: Instant Drone Attack vs Suspenseful Stalking',
        description: 'Drag the slider to compare naive immediate chase AI (left: robotic, predictable, zero tension) against sensory stalking and hesitating predator AI (right: terrifying, suspenseful, dynamic).',
        aspectRatio: '16/9',
        beforeLabel: 'Linear Chase AI (Robotic & Predictable)',
        afterLabel: 'Sensory Stalker AI (Suspenseful & Organic)',
        beforeType: 'canvas-unoptimized',
        afterType: 'canvas-final',
        notes: 'Notice how the sensory stalker circles and watches the bait, creating immense psychological suspense.'
      }
    }
  },
  {
    id: 'astral-rally',
    title: 'Astral Rally',
    subtitle: 'Arcade Reflex Racer',
    year: '2026',
    category: 'Arcade Racing',
    role: 'Lead Vehicle Physics Engineer & Gameplay Designer',
    platform: 'WebGL / Unity (Playable in Browser)',
    status: 'Released',
    featured: true,
    technologies: ['UNITY', 'C#'],
    playableUrl: 'https://play.unity.com/en/games/90b58e1c-61d8-4e4b-9b0e-38d395bec322/astral-rally',
    repositoryUrl: 'https://github.com/Nigatron911',
    dioramaTheme: 'cyber_arena',
    shortDescription: 'An arcade kinda game — let’s test your reflexes!',
    hook: 'How do you engineer high-speed arcade drift physics with tactile weight, zero spinouts, and responsive air-roll stabilization?',
    breakdown: {
      idea: {
        summary: 'Built to capture the exhilarating speed of arcade anti-gravity racers combined with the precision counter-steering mechanics of rally drift simulators.',
        playerExperience: 'Power-sliding around zero-gravity orbital hairpins, chaining blue spark drift boosts into supersonic straightaways, and launching off celestial ramps with gyro-stabilized flight control.',
        influences: ['F-Zero GX supersonic speed', 'Mario Kart drift spark tiers', 'Trackmania precision time-attack physics']
      },
      coreSystem: {
        title: 'Raycast Suspension Springs & Pacejka Lateral Friction Model',
        explanation: 'Rather than using default Unity WheelColliders (which lack snappy arcade drift responsiveness), Astral Rally uses a custom 4-point Raycast Suspension with Hooke’s Law damping (F = -k*x - c*v) and a simplified Pacejka "Magic Formula" lateral friction curve.',
        technicalDepth: 'When drifting, lateral tire friction transitions from peak static grip into a dynamic sliding friction plateau. Steering input dynamically biases the rear slip angle while applying stabilizing counter-torque to prevent unrecoverable snap oversteer.',
        mechanicsSummary: 'Raycast spring suspension, dynamic drift slip angles, 3-tier mini-turbo boost charge, surface normal track gravity alignment, and air-roll gyros.'
      },
      architecture: {
        overview: 'Input Steer & Drift Trigger -> Raycast Suspension Solver -> Pacejka Lateral Friction Evaluator -> Drift Angle & Boost Charger -> Track Normal Gravity Snapper -> Camera Lookahead Trajectory.',
        nodes: [
          {
            id: 'node-suspension',
            label: 'Raycast Suspension Solver',
            sublabel: '4-Point Hooke’s Spring',
            category: 'physics',
            description: 'Samples ground surface normals and computes compression spring force per hover pad.',
            details: ['Sub-frame surface normal projection', 'Zero clipping on bumpy terrain'],
            x: 100,
            y: 80
          },
          {
            id: 'node-drift',
            label: 'Pacejka Drift Controller',
            sublabel: 'Lateral slip calculation',
            category: 'logic',
            description: 'Calculates slip velocity ratio and applies counter-steering stabilization torque.',
            details: ['Nonlinear friction falloff curve', 'Oversteer recovery prevention'],
            x: 320,
            y: 80
          },
          {
            id: 'node-boost',
            label: 'Turbo Boost Charger',
            sublabel: '3-Tier spark accumulation',
            category: 'state',
            description: 'Accumulates turbo energy during sustained drifts, releasing explosive velocity bursts on drift release.',
            details: ['Tier 1 (Blue Spark) -> Tier 2 (Orange) -> Tier 3 (Purple Warp)', 'Camera FOV punch on boost'],
            x: 540,
            y: 80
          },
          {
            id: 'node-camera',
            label: 'Lookahead Trajectory Cam',
            sublabel: 'Smooth velocity framing',
            category: 'render',
            description: 'Offsets camera toward drift apex to give players maximum visibility around blind turns.',
            details: ['Damped spring lookahead', 'High-speed motion blur streaking'],
            x: 320,
            y: 240
          }
        ],
        edges: [
          { from: 'node-suspension', to: 'node-drift', label: 'Ground Contact', animated: true },
          { from: 'node-drift', to: 'node-boost', label: 'Sustained Slip', animated: true },
          { from: 'node-boost', to: 'node-camera', label: 'Boost Impulse', animated: true }
        ]
      },
      problem: {
        title: 'Spinout Catastrophes & Zero-G Disorientation',
        symptom: 'Standard physics torque caused hovercrafts to spin out 360 degrees on sharp turns, and launching off ramps inverted the vehicle into tumbling disorienting flips.',
        rootCause: 'Linear angular drag cannot distinguish between intentional drifting and uncontrolled spinning. Lack of track surface normal alignment caused vehicles to fly into deep space.',
        failedAttempts: ['Restricting all yaw rotation (destroyed the fun of drifting and made turning feel stiff).']
      },
      solution: {
        approach: 'Implemented an active Counter-Steer Torque Assist that caps yaw rate during drift states and added an Air-Roll Slerp Quaternion that aligns the vehicle chassis with the track normal plane within 180ms.',
        whyItWorked: 'Drifting feels accessible and intensely satisfying for beginners while preserving deep mastery for competitive lap-time shaving.',
        codeHighlight: {
          language: 'csharp',
          filename: 'AstralHoverPhysics.cs',
          explanation: 'Raycast suspension and Pacejka lateral drift calculation:',
          code: `// Computes lateral tire slip and drift friction force
private void ApplyLateralDriftFriction(Rigidbody rb, Transform pad, bool isDrifting, float dt) {
    Vector3 padVelocity = rb.GetPointVelocity(pad.position);
    Vector3 lateralDir = pad.right;
    float lateralVelocity = Vector3.Dot(padVelocity, lateralDir);
    
    // Pacejka simplified friction coefficient (mu)
    float slipRatio = Mathf.Abs(lateralVelocity) / (padVelocity.magnitude + 0.001f);
    float gripMultiplier = isDrifting ? _driftSlideGrip : _standardStaticGrip;
    float frictionForceMagnitude = -lateralVelocity * gripMultiplier * _vehicleMass;
    
    rb.AddForceAtPosition(lateralDir * frictionForceMagnitude, pad.position);
}`
        }
      },
      performance: {
        bottleneck: 'Wheel raycasts and particle trailing during 8-vehicle multiplayer races.',
        metrics: [
          { metric: 'Vehicle Kinematic Stability', before: 'Frequent spinout glitches', after: '100% Deterministic', delta: '+100%' },
          { metric: 'Suspension Compute Time', before: '4.8ms (PhysX Wheels)', after: '0.3ms (Raycast Springs)', delta: '-93.7%' },
          { metric: 'Framerate on WebGL', before: '38 FPS (Heavy particles)', after: '60 FPS Solid', delta: '+57.8%' },
          { metric: 'Draw Calls (Track + FX)', before: '112 calls', after: '12 Batched passes', delta: '-89.2%' }
        ],
        keyTechnique: 'Custom Raycast Spring Solver + NonAlloc Physics RaycastCommand + GPU Particle Instancing.'
      },
      iteration: [
        {
          phase: 'Phase 01',
          title: 'Arcade Physics Blockout',
          date: 'Jan 2026',
          description: 'Tested 4-ray hovercraft controller on simple circular track.',
          keyChallenge: 'Floating and bottoming out on hill crests.',
          milestone: 'Tuned Hooke’s spring damping coefficients.'
        },
        {
          phase: 'Phase 02',
          title: 'Drift & Boost Mechanics',
          date: 'Feb 2026',
          description: 'Added Pacejka slip friction, 3-tier turbo sparks, and celestial neon track shaders.',
          keyChallenge: 'Camera trajectory whip on hairpin drifts.',
          milestone: 'Shipped to Unity Play with players raving about speed and game feel.'
        }
      ],
      lessonsLearned: {
        technical: 'Arcade vehicle physics require custom raycast suspension rather than built-in wheel colliders. Total control over lateral slip curves is essential for satisfying drifting.',
        design: 'Speed in racing games is 80% camera design and visual juice: FOV expansion on boost, dynamic camera lookahead into turns, and tire sparks create high-octane excitement.',
        takeaway: 'Kinematic control combined with physical weight produces unforgettable racing feel.'
      },
      playground: {
        type: 'combat-sandbox',
        description: 'Test the live Astral Rally vehicle parameters below. Adjust Drift Friction Slip, Turbo Boost Multiplier, Suspension Spring Damping, and Downforce Gravity.',
        params: [
          { id: 'hitstop', name: 'Drift Lateral Slip Grip', min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.45, unit: 'μ', description: 'Resistance to sideways sliding during active drift.' },
          { id: 'cameraTrauma', name: 'Turbo Boost Multiplier', min: 1.2, max: 3.0, step: 0.1, defaultValue: 2.2, unit: 'x', description: 'Velocity boost multiplier triggered upon drift release.' },
          { id: 'attackSpeed', name: 'Suspension Spring Stiffness', min: 10, max: 80, step: 5, defaultValue: 45, unit: 'k', description: 'Restorative force holding hovercraft above track.' },
          { id: 'parryWindow', name: 'Track Normal Downforce', min: 1.0, max: 4.0, step: 0.2, defaultValue: 2.5, unit: 'G', description: 'Magnetic downward attraction keeping craft snapped to track.' }
        ]
      },
      xrayData: {
        colliders: [
          { name: 'Hovercraft_Chassis_Box', type: 'box', color: '#38bdf8', desc: 'Aerodynamic craft hull collision volume' },
          { name: 'Drift_Slip_Angle_Vector', type: 'capsule', color: '#ec4899', desc: 'Lateral velocity vs forward heading vector' }
        ],
        raycasts: [
          { name: 'Raycast_Suspension_FL/FR/RL/RR', length: 1.5, purpose: '4-point spring damping raycasts to track surface' },
          { name: 'Track_Normal_Gravity_Ray', length: 4.0, purpose: 'Aligns vehicle orientation to curved loop-de-loops' }
        ],
        stateMachines: [
          { state: 'Straight_Acceleration', trigger: 'Drift_Button_Pressed', next: 'Drift_Power_Slide' },
          { state: 'Drift_Power_Slide', trigger: 'Drift_Button_Released', next: 'Turbo_Boost_Burst' },
          { state: 'Turbo_Boost_Burst', trigger: 'Boost_Decay_Complete', next: 'Straight_Acceleration' }
        ],
        performance: { drawCalls: 12, triangleCount: '18.4k', frameTime: '1.2ms', gcAlloc: '0 B / frame' }
      },
      beforeAfter: {
        title: 'Vehicle Physics: Built-in WheelColliders vs Custom Raycast Drift',
        description: 'Drag the slider to compare standard Unity WheelColliders (left: stiff, unrealistic spinouts, unresponsive) against custom Raycast Suspension with Pacejka Drift (right: silky smooth, satisfying power-slides, supersonic boost).',
        aspectRatio: '16/9',
        beforeLabel: 'Built-in WheelColliders (Stiff & Spinouts)',
        afterLabel: 'Custom Raycast Drift (Silky & Responsive)',
        beforeType: 'canvas-unoptimized',
        afterType: 'canvas-final',
        notes: 'Notice how the custom raycast solver maintains perfect chassis balance through 100-degree drift turns.'
      }
    }
  }
];
