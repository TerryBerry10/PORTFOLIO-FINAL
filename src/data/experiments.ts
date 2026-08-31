import { ExperimentItem } from '../types/skills';

export const labExperiments: ExperimentItem[] = [
  {
    id: 'exp-boids',
    title: 'Flocking Boids & Predator Evasion Simulation',
    category: 'AI / Boids',
    shortDesc: 'Craig Reynolds 3-rule flocking algorithm (Separation, Alignment, Cohesion) with dynamic obstacle avoidance and cursor predation.',
    tech: ['Vector2 Math', 'Spatial Grid', 'Reynolds Boids', 'Canvas 2D'],
    interactiveDemoId: 'boids',
    instruction: 'Move mouse over the canvas to act as an attractor or predator. Click to spawn new boid bursts.',
    codeSnippet: `// Craig Reynolds 3-Rule Boid Steer
Vector2 SteerFlock(Boid b, List<Boid> neighbors) {
    Vector2 sep = ComputeSeparation(b, neighbors) * 1.5f;
    Vector2 ali = ComputeAlignment(b, neighbors) * 1.0f;
    Vector2 coh = ComputeCohesion(b, neighbors) * 1.0f;
    return ClampMagnitude(sep + ali + coh, MaxForce);
}`
  },
  {
    id: 'exp-grass',
    title: 'Procedural Wind Waves & Grass Blade Displacement',
    category: 'Shaders',
    shortDesc: 'Real-time wind wave propagation simulation displacing individual grass blades with interactive mouse-trample physics.',
    tech: ['Perlin Noise', 'Spring Damper Kinematics', 'Trigonometric Waveforms'],
    interactiveDemoId: 'grass-wind',
    instruction: 'Drag your cursor through the grass field to trample blades. Observe natural elastic spring-back.',
    codeSnippet: `// Spring-Damper Grass Tip Elasticity
float fSpring = -k * (tipOffset - restPos);
float fDamper = -c * tipVelocity;
tipVelocity += (fSpring + fDamper + windGust) * dt;
tipOffset += tipVelocity * dt;`
  },
  {
    id: 'exp-gravity',
    title: 'Orbital Gravity Well & Particle Trajectories',
    category: 'Physics',
    shortDesc: 'Multi-body point-mass gravitational simulator with real-time future trajectory prediction cones and relativistic slingshots.',
    tech: ['Velocity Verlet', 'Newtonian Gravity', 'RK4 Numerical Solver'],
    interactiveDemoId: 'gravity-field',
    instruction: 'Click and drag to launch new orbiting particles with initial velocity vectors into the gravity well.',
    codeSnippet: `// Velocity Verlet Symplectic Step
vec2 acc = CalculateTotalGravity(pos, masses);
vel += 0.5 * (acc + prevAcc) * dt;
pos += vel * dt + 0.5 * acc * dt * dt;`
  },
  {
    id: 'exp-rope',
    title: 'Verlet Integration Fabric & Chain Physics',
    category: 'Kinematics',
    shortDesc: 'Constraint-based Verlet physics simulating swinging lanterns, rope bridges, and cloth tearing with constraint relaxation.',
    tech: ['Verlet Integration', 'Constraint Relaxation (Jakobsen Method)', 'Distance Constraints'],
    interactiveDemoId: 'rope-verlet',
    instruction: 'Click and drag any joint of the rope to stretch or swing it in real-time.',
    codeSnippet: `// Jakobsen Distance Constraint Relaxation
vec2 delta = p2.pos - p1.pos;
float dist = length(delta);
float diff = (dist - restingDist) / dist;
p1.pos += delta * 0.5 * diff;
p2.pos -= delta * 0.5 * diff;`
  }
];
