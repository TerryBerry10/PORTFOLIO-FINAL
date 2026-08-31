import { WorldParticle } from '../types/world';
import { randomRange } from '../utils/math';

export class ParticleSystem {
  private particles: WorldParticle[] = [];
  private maxParticles = 2500;
  private mouseX = 0;
  private mouseY = 0;
  private hasMouse = false;
  private currentActiveWeather: string = 'breeze';
  private fireflyMasterAlpha = 0.0; // 0.0 during non-clear weather, 1.0 during clear weather

  constructor() {
    this.initAmbientParticles();
  }

  public setMousePos(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
    this.hasMouse = true;
  }

  private initAmbientParticles() {
    // Seed 320 delicate small pinpoint glowing fireflies (size 1.2 to 2.2)
    const colors = ['#fef08a', '#facc15', '#6ee7b7', '#a7f3d0', '#7dd3fc', '#fde047', '#f472b6'];
    for (let i = 0; i < 320; i++) {
      this.particles.push({
        x: randomRange(-1600, 4400),
        y: randomRange(-900, 1400),
        vx: randomRange(-0.25, 0.25),
        vy: randomRange(-0.25, 0.25),
        size: randomRange(1.2, 2.2), // Delicate small pinpoint starlight size
        alpha: randomRange(0.4, 0.95),
        maxLife: randomRange(15, 45),
        life: randomRange(0, 45),
        color: colors[i % colors.length],
        type: 'firefly',
      });
    }
  }

  // Smooth weather cross-fade: fades out existing weather particles over 2 seconds
  public transitionWeather(nextWeather: string) {
    this.currentActiveWeather = nextWeather;
    for (const p of this.particles) {
      if (p.type !== 'firefly' && p.type !== 'dust') {
        if (
          (nextWeather === 'clear') ||
          (nextWeather === 'breeze' && p.type !== 'leaf' && p.type !== 'ember') ||
          (nextWeather === 'snow' && p.type !== 'snow') ||
          (nextWeather === 'rain' && p.type !== 'rain' && p.type !== 'ripple')
        ) {
          p.life = Math.min(p.life, 2.0);
          p.maxLife = Math.max(p.maxLife, 2.0);
        }
      }
    }
  }

  // Seamlessly populate new weather state across the entire screen
  public seedWeather(
    weatherType: 'clear' | 'breeze' | 'rain' | 'snow' | 'fog',
    worldLeft: number,
    worldRight: number,
    worldTop: number,
    worldBottom: number,
    windSpeed: number
  ) {
    this.transitionWeather(weatherType);

    if (weatherType === 'breeze') {
      // Instantly distribute 120 aesthetic Sakura petals falling straight down across the entire screen
      const sakuraColors = ['#f472b6', '#fbcfe8', '#fda4af', '#fff1f2', '#fecdd3'];
      for (let i = 0; i < 120; i++) {
        const isStardust = i % 4 === 0;
        this.emit({
          x: randomRange(worldLeft - 100, worldRight + 100),
          y: randomRange(worldTop - 80, worldBottom + 80),
          vx: randomRange(-0.25, 0.25), // Centered gentle floating sway
          vy: randomRange(0.65, 1.25),  // Steady downward fall
          size: isStardust ? randomRange(2.0, 3.2) : randomRange(4.0, 7.2),
          alpha: isStardust ? randomRange(0.5, 0.8) : randomRange(0.65, 0.9),
          maxLife: randomRange(18.0, 30.0),
          color: isStardust ? '#fef08a' : sakuraColors[i % sakuraColors.length],
          type: isStardust ? 'ember' : 'leaf',
          rotation: randomRange(0, Math.PI * 2),
          rotationSpeed: randomRange(-0.015, 0.015),
        });
      }
    } else if (weatherType === 'snow') {
      // Instantly distribute 200 fluffy snowflakes across the whole viewport
      for (let i = 0; i < 200; i++) {
        const isLargeFlake = Math.random() > 0.65;
        this.emit({
          x: randomRange(worldLeft - 100, worldRight + 100),
          y: randomRange(worldTop - 100, worldBottom + 100),
          vx: windSpeed * 0.5 + randomRange(-0.5, 0.9),
          vy: randomRange(1.8, 3.8),
          size: isLargeFlake ? randomRange(5.0, 9.0) : randomRange(2.2, 4.8),
          alpha: isLargeFlake ? randomRange(0.7, 0.95) : randomRange(0.8, 1.0),
          maxLife: randomRange(14.0, 24.0),
          color: '#ffffff',
          type: 'snow',
          rotation: randomRange(0, Math.PI * 2),
          rotationSpeed: randomRange(-0.04, 0.04),
        });
      }
    } else if (weatherType === 'rain') {
      // Instantly distribute 120 rain streaks
      for (let i = 0; i < 120; i++) {
        this.emit({
          x: randomRange(worldLeft - 100, worldRight + 100),
          y: randomRange(worldTop - 100, worldBottom + 100),
          vx: randomRange(-2.0, -1.0),
          vy: randomRange(16, 24),
          size: randomRange(14, 24),
          alpha: randomRange(0.4, 0.75),
          maxLife: 1.2,
          color: '#93c5fd',
          type: 'rain',
        });
      }
    }
  }

  public emit(particle: Omit<WorldParticle, 'life'>) {
    if (this.particles.length >= this.maxParticles) {
      const idx = this.particles.findIndex(p => p.type !== 'firefly');
      if (idx !== -1) {
        this.particles.splice(idx, 1);
      }
    }
    this.particles.push({
      ...particle,
      life: particle.maxLife,
    });
  }

  public emitFootstep(x: number, y: number, isWater = false, isSnow = false, isSakura = false) {
    if (isSnow) {
      for (let i = 0; i < 3; i++) {
        this.emit({
          x: x + randomRange(-4, 4),
          y: y + randomRange(4, 8),
          vx: randomRange(-0.4, 0.4),
          vy: randomRange(-0.7, -0.2),
          size: randomRange(2.5, 4.5),
          alpha: 0.85,
          maxLife: 0.6,
          color: '#ffffff',
          type: 'snow',
        });
      }
    } else if (isSakura) {
      for (let i = 0; i < 3; i++) {
        this.emit({
          x: x + randomRange(-4, 4),
          y: y + randomRange(4, 8),
          vx: randomRange(-0.5, 0.5),
          vy: randomRange(-0.8, -0.3),
          size: randomRange(2.5, 4.5),
          alpha: 0.85,
          maxLife: 0.8,
          color: Math.random() > 0.5 ? '#f472b6' : '#fbcfe8',
          type: 'leaf',
        });
      }
    } else if (isWater) {
      this.emit({
        x,
        y: y + 8,
        vx: 0,
        vy: 0,
        size: 3,
        alpha: 0.8,
        maxLife: 0.8,
        color: '#7dd3fc',
        type: 'ripple',
      });
    } else {
      for (let i = 0; i < 4; i++) {
        this.emit({
          x: x + randomRange(-5, 5),
          y: y + randomRange(4, 8),
          vx: randomRange(-0.6, 0.6),
          vy: randomRange(-0.5, -0.1),
          size: randomRange(2, 4.5),
          alpha: 0.6,
          maxLife: 0.5,
          color: '#d5ccbe',
          type: 'dust',
        });
      }
    }
  }

  public emitCampfireEmbers(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      this.emit({
        x: x + randomRange(-10, 10),
        y: y + randomRange(-6, 6),
        vx: randomRange(-0.7, 0.7),
        vy: randomRange(-2.2, -0.9),
        size: randomRange(1.8, 3.8),
        alpha: 0.95,
        maxLife: randomRange(1.2, 2.5),
        color: Math.random() > 0.4 ? '#f59e0b' : '#fef08a',
        type: 'ember',
      });
    }
  }

  public emitChimneySmoke(x: number, y: number) {
    this.emit({
      x: x + randomRange(-4, 4),
      y,
      vx: randomRange(0.2, 0.9),
      vy: randomRange(-0.9, -0.4),
      size: randomRange(4, 8),
      alpha: 0.35,
      maxLife: randomRange(3.5, 6.0),
      color: '#e7e0d3',
      type: 'dust',
    });
  }

  public emitRainSizzleSmoke(x: number, y: number) {
    if (Math.random() > 0.5) {
      this.emit({
        x: x + randomRange(-8, 8),
        y: y + randomRange(-4, 2),
        vx: randomRange(-0.25, 0.25),
        vy: randomRange(-0.7, -0.2),
        size: randomRange(3.5, 7.0),
        alpha: 0.3,
        maxLife: randomRange(1.2, 2.2),
        color: '#94a3b8',
        type: 'dust',
      });
    }
  }

  // Full-Screen Straight Downward Cherry Blossom (Sakura) Petal Fall
  public emitWindLeaves(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number, _windSpeed: number) {
    for (let i = 0; i < 4; i++) {
      const isStardust = Math.random() > 0.5;
      const spawnX = randomRange(worldLeft - 150, worldRight + 150);
      const spawnY = worldTop - randomRange(20, 80);

      const sakuraColors = ['#f472b6', '#fbcfe8', '#fda4af', '#fff1f2', '#fecdd3', '#fb7185'];
      this.emit({
        x: spawnX,
        y: spawnY,
        vx: randomRange(-0.25, 0.25), // Gentle floating side-to-side sway
        vy: randomRange(1.15, 1.85),  // Steady downward fall across entire viewport
        size: isStardust ? randomRange(2.0, 3.2) : randomRange(4.5, 7.8),
        alpha: isStardust ? randomRange(0.6, 0.9) : randomRange(0.75, 0.95),
        maxLife: randomRange(35.0, 55.0), // Long life ensuring full descent past screen bottom
        color: isStardust ? '#fef08a' : sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        type: isStardust ? 'ember' : 'leaf',
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(-0.015, 0.015),
      });
    }
  }

  // Full-Screen Moonlit Rain with ground splash ripples
  public emitRain(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number) {
    for (let i = 0; i < 14; i++) {
      const rx = randomRange(worldLeft - 200, worldRight + 200);
      const ry = worldTop - randomRange(20, 100);
      this.emit({
        x: rx,
        y: ry,
        vx: randomRange(-2.0, -1.0),
        vy: randomRange(16, 24),
        size: randomRange(14, 24),
        alpha: randomRange(0.4, 0.75),
        maxLife: 1.2,
        color: '#93c5fd',
        type: 'rain',
      });
    }
  }

  // Full-Screen Magical Snow: soft, fluffy, floating snowflakes drifting in gentle flurries
  public emitSnow(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number, windSpeed: number) {
    for (let i = 0; i < 10; i++) {
      const sx = randomRange(worldLeft - 150, worldRight + 150);
      const sy = worldTop - randomRange(20, 60);
      const isLargeFlake = Math.random() > 0.65;
      this.emit({
        x: sx,
        y: sy,
        vx: windSpeed * 0.5 + randomRange(-0.5, 0.9),
        vy: randomRange(1.8, 3.8),
        size: isLargeFlake ? randomRange(5.0, 9.0) : randomRange(2.2, 4.8),
        alpha: isLargeFlake ? randomRange(0.7, 0.95) : randomRange(0.8, 1.0),
        maxLife: randomRange(14.0, 24.0),
        color: '#ffffff',
        type: 'snow',
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(-0.04, 0.04),
      });
    }
  }

  public update(dt: number, windSpeed: number) {
    const timeNow = Date.now() * 0.001;

    // Smoothly fade in/out firefly visibility: ONLY active in 'clear' / Calm weather
    if (this.currentActiveWeather === 'clear') {
      this.fireflyMasterAlpha = Math.min(1.0, this.fireflyMasterAlpha + dt * 0.8);
    } else {
      this.fireflyMasterAlpha = Math.max(0.0, this.fireflyMasterAlpha - dt * 1.2);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        if (p.type === 'firefly') {
          p.life = p.maxLife;
        } else {
          this.particles.splice(i, 1);
          continue;
        }
      }

      // Update positions with silky organic curves
      if (p.type === 'firefly') {
        // Natural harmonic float
        const freqX = 1.2 + (i % 7) * 0.2;
        const freqY = 1.5 + (i % 5) * 0.3;
        p.vx = Math.sin(timeNow * freqX + p.x * 0.01) * 0.45;
        p.vy = Math.cos(timeNow * freqY + p.y * 0.01) * 0.35;

        // Subtle interactive mouse reaction: fireflies gently steer around cursor
        if (this.hasMouse && this.fireflyMasterAlpha > 0.05) {
          const dx = p.x - this.mouseX;
          const dy = p.y - this.mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 200 && dist > 1) {
            const push = (1 - dist / 200) * 1.6;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Breathing glowing pulse
        const pulse = Math.sin(timeNow * 2.5 + i * 0.8) * 0.35;
        p.alpha = Math.max(0.2, Math.min(1.0, 0.65 + pulse));
      } else if (p.type === 'leaf') {
        // Aesthetic Sakura petal steady downward fall & gentle sinusoidal sway
        p.x += p.vx + Math.sin(timeNow * 1.6 + p.y * 0.02) * 0.45;
        p.y += p.vy;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }
      } else if (p.type === 'snow') {
        // Organic drifting snow flurry with gentle sinusoidal sway
        p.x += p.vx + Math.sin(timeNow * 1.8 + p.y * 0.03) * 0.7;
        p.y += p.vy;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }
      } else if (p.type === 'ripple') {
        p.size += dt * 28;
        p.alpha = Math.max(0, p.life / p.maxLife) * 0.7;
      } else if (p.type === 'ember') {
        // Soft glowing stardust drift
        p.x += p.vx + Math.sin(timeNow * 1.4 + p.y * 0.02) * 0.25;
        p.y += p.vy * 0.7;
        p.size = Math.max(0.5, p.size - dt * 0.1);
      } else if (p.type === 'rain') {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > 180 && Math.random() < 0.08) {
          this.emit({
            x: p.x,
            y: p.y,
            vx: 0,
            vy: 0,
            size: 2,
            alpha: 0.5,
            maxLife: 0.4,
            color: '#93c5fd',
            type: 'ripple',
          });
        }
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, isNight: boolean) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.save();

      if (p.type === 'firefly') {
        // Fireflies appear ONLY in clear / calm weather via smooth fireflyMasterAlpha
        if (this.fireflyMasterAlpha <= 0.01) {
          ctx.restore();
          continue;
        }
        const finalAlpha = p.alpha * this.fireflyMasterAlpha;
        const glowColor = p.color || '#fde047';

        // Outer delicate soft halo (small, max 4-6px)
        ctx.globalAlpha = finalAlpha * 0.25;
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Mid bioluminescent bloom
        ctx.globalAlpha = finalAlpha * 0.55;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner sharp glowing pinpoint white core (0.6-1.1px)
        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'leaf') {
        // Aesthetic Cherry Blossom (Sakura) Petal - Full opacity until screen exit
        const fadeIn = Math.min(1, (p.maxLife - p.life) / 0.8);
        const fadeOut = Math.min(1, p.life / 1.5);
        ctx.globalAlpha = fadeIn * fadeOut * p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);

        // 3D Fluttering Flip (Scale X based on sin of rotation)
        const flutterX = Math.cos((p.rotation || 0) * 1.5);
        ctx.scale(Math.abs(flutterX) * 0.7 + 0.3, 1.0);

        // Petal Gradient from soft rose base to pale translucent tip
        const petalGrad = ctx.createLinearGradient(0, p.size, 0, -p.size);
        petalGrad.addColorStop(0, p.color);
        petalGrad.addColorStop(0.7, '#fbcfe8');
        petalGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = petalGrad;

        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 4;

        // Realistic notched Cherry Blossom (Sakura) petal curve
        ctx.beginPath();
        ctx.moveTo(0, p.size * 1.2); // Base stem
        ctx.bezierCurveTo(p.size * 1.1, p.size * 0.5, p.size * 1.2, -p.size * 0.6, p.size * 0.4, -p.size * 1.2); // Right lobe
        ctx.lineTo(0, -p.size * 0.8); // Notched center dip
        ctx.lineTo(-p.size * 0.4, -p.size * 1.2); // Left lobe top
        ctx.bezierCurveTo(-p.size * 1.2, -p.size * 0.6, -p.size * 1.1, p.size * 0.5, 0, p.size * 1.2); // Left lobe to base
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === 'snow') {
        // Magical glowing snowflake
        const alpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.globalAlpha = alpha;
        
        if (p.size > 5.5) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          
          ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.4;
          ctx.shadowColor = '#bae6fd';
          ctx.shadowBlur = 8;
          for (let arm = 0; arm < 3; arm++) {
            ctx.beginPath();
            ctx.moveTo(-p.size, 0);
            ctx.lineTo(p.size, 0);
            ctx.stroke();
            ctx.rotate(Math.PI / 3);
          }

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.type === 'ripple') {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'ember') {
        // Soft glowing stardust mote
        ctx.globalAlpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === 'rain') {
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 2.2, p.y + p.size);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.globalAlpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  public getFirefliesNearby(x: number, y: number, radius: number): WorldParticle[] {
    return this.particles.filter(p => p.type === 'firefly' && Math.hypot(p.x - x, p.y - y) <= radius);
  }

  public removeParticle(particle: WorldParticle) {
    const idx = this.particles.indexOf(particle);
    if (idx !== -1) {
      this.particles.splice(idx, 1);
    }
  }
}
