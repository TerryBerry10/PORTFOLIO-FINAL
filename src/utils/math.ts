export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Simple 1D/2D Perlin-like pseudo noise generator for smooth wind and procedural waves
export class SimpleNoise {
  private p: number[] = [];

  constructor(seed = 42) {
    const permutation: number[] = [];
    for (let i = 0; i < 256; i++) permutation[i] = i;
    // Shuffle with seed
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const temp: number = permutation[i];
      permutation[i] = permutation[j];
      permutation[j] = temp;
    }
    this.p = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  noise1D(x: number): number {
    const xi = Math.floor(x) & 255;
    const xf = x - Math.floor(x);
    const u = smoothstep(0, 1, xf);
    const a = this.p[xi];
    const b = this.p[xi + 1];
    return lerp(a / 255, b / 255, u);
  }

  noise2D(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = smoothstep(0, 1, xf);
    const v = smoothstep(0, 1, yf);

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + yi + 1];
    const ba = this.p[this.p[xi + 1] + yi];
    const bb = this.p[this.p[xi + 1] + yi + 1];

    const x1 = lerp(aa / 255, ba / 255, u);
    const x2 = lerp(ab / 255, bb / 255, u);
    return lerp(x1, x2, v);
  }
}
