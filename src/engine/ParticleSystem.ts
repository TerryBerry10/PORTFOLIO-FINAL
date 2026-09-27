import { WorldParticle } from '../types/world';
import { randomRange } from '../utils/math';

export class ParticleSystem {
  private particles: WorldParticle[] = [];
  private maxParticles = 900; // Optimized particle budget for 60-144 FPS
  private mouseX = 0;
  private mouseY = 0;
  private hasMouse = false;
  private currentActiveWeather: string = 'breeze';
  private fireflyMasterAlpha = 0.0;
  private isLowPerformanceMode = false;

  constructor() {
    this.initAmbientParticles();
  }

  public setLowPerformanceMode(enabled: boolean) {
    this.isLowPerformanceMode = enabled;
    this.maxParticles = enabled ? 350 : 900;
  }

  public setMousePos(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
    this.hasMouse = true;
  }

  private initAmbientParticles() {
    // Seed delicate small pinpoint glowing fireflies
    const count = this.isLowPerformanceMode ? 120 : 220;
    const colors = ['#fef08a', '#facc15', '#6ee7b7', '#a7f3d0', '#7dd3fc', '#fde047', '#f472b6'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: randomRange(-1400, 4200),
        y: randomRange(-800, 1300),
        vx: randomRange(-0.25, 0.25),
        vy: randomRange(-0.25, 0.25),
        size: randomRange(1.2, 2.2),
        alpha: randomRange(0.4, 0.95),
        maxLife: randomRange(15, 45),
        life: randomRange(0, 45),
        color: colors[i % colors.length],
        type: 'firefly',
      });
    }
  }

  public transitionWeather(nextWeather: string) {
    this.currentActiveWeather = nextWeather;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.type !== 'firefly' && p.type !== 'dust') {
        if (
          (nextWeather === 'clear') ||
          (nextWeather === 'breeze' && p.type !== 'leaf' && p.type !== 'ember') ||
          (nextWeather === 'snow' && p.type !== 'snow') ||
          (nextWeather === 'rain' && p.type !== 'rain' && p.type !== 'ripple')
        ) {
          p.life = Math.min(p.life, 1.5);
          p.maxLife = Math.max(p.maxLife, 1.5);
        }
      }
    }
  }

  public seedWeather(
    weatherType: 'clear' | 'breeze' | 'rain' | 'snow' | 'fog',
    worldLeft: number,
    worldRight: number,
    worldTop: number,
    worldBottom: number,
    windSpeed: number
  ) {
    this.transitionWeather(weatherType);

    const countMultiplier = this.isLowPerformanceMode ? 0.45 : 1.0;

    if (weatherType === 'breeze') {
      const sakuraColors = ['#f472b6', '#fbcfe8', '#fda4af', '#fff1f2', '#fecdd3'];
      const targetCount = Math.floor(90 * countMultiplier);
      for (let i = 0; i < targetCount; i++) {
        const isStardust = i % 4 === 0;
        this.emit({
          x: randomRange(worldLeft - 100, worldRight + 100),
          y: randomRange(worldTop - 80, worldBottom + 80),
          vx: randomRange(-0.25, 0.25),
          vy: randomRange(0.65, 1.25),
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
      const targetCount = Math.floor(130 * countMultiplier);
      for (let i = 0; i < targetCount; i++) {
        const isLargeFlake = Math.random() > 0.65;
        this.emit({
          x: randomRange(worldLeft - 100, worldRight + 100),
          y: randomRange(worldTop - 100, worldBottom + 100),
          vx: windSpeed * 0.5 + randomRange(-0.5, 0.9),
          vy: randomRange(1.8, 3.8),
          size: isLargeFlake ? randomRange(4.5, 7.5) : randomRange(2.0, 4.0),
          alpha: isLargeFlake ? randomRange(0.7, 0.95) : randomRange(0.8, 1.0),
          maxLife: randomRange(14.0, 24.0),
          color: '#ffffff',
          type: 'snow',
          rotation: randomRange(0, Math.PI * 2),
          rotationSpeed: randomRange(-0.04, 0.04),
        });
      }
    } else if (weatherType === 'rain') {
      const targetCount = Math.floor(80 * countMultiplier);
      for (let i = 0; i < targetCount; i++) {
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
        this.particles[idx] = { ...particle, life: particle.maxLife };
        return;
      }
    }
    this.particles.push({
      ...particle,
      life: particle.maxLife,
    });
  }

  public emitFootstep(x: number, y: number, isWater = false, isSnow = false, isSakura = false) {
    if (isSnow) {
      for (let i = 0; i < 2; i++) {
        this.emit({
          x: x + randomRange(-4, 4),
          y: y + randomRange(-2, 2),
          vx: randomRange(-0.3, 0.3),
          vy: randomRange(-0.6, -0.2),
          size: randomRange(1.8, 3.5),
          alpha: 0.7,
          maxLife: 0.8,
          color: '#ffffff',
          type: 'snow',
        });
      }
    } else if (isSakura) {
      if (Math.random() < 0.6) {
        this.emit({
          x: x + randomRange(-4, 4),
          y: y + randomRange(-2, 2),
          vx: randomRange(-0.4, 0.4),
          vy: randomRange(-0.8, -0.3),
          size: randomRange(3.0, 5.0),
          alpha: 0.85,
          maxLife: 1.5,
          color: '#f472b6',
          type: 'leaf',
          rotation: randomRange(0, Math.PI * 2),
          rotationSpeed: randomRange(-0.04, 0.04),
        });
      }
    } else if (isWater) {
      this.emit({
        x: x + randomRange(-3, 3),
        y: y + randomRange(-1, 1),
        vx: 0,
        vy: 0,
        size: 3,
        alpha: 0.6,
        maxLife: 0.6,
        color: '#93c5fd',
        type: 'ripple',
      });
    } else {
      if (Math.random() < 0.5) {
        this.emit({
          x: x + randomRange(-2, 2),
          y: y + randomRange(-1, 1),
          vx: randomRange(-0.2, 0.2),
          vy: randomRange(-0.4, -0.1),
          size: randomRange(1.5, 3.5),
          alpha: 0.35,
          maxLife: 0.4,
          color: '#94a3b8',
          type: 'dust',
        });
      }
    }
  }

  public emitCampfireEmbers(x: number, y: number) {
    if (Math.random() < 0.6) {
      this.emit({
        x: x + randomRange(-10, 10),
        y: y + randomRange(-6, 6),
        vx: randomRange(-0.7, 0.7),
        vy: randomRange(-2.2, -0.9),
        size: randomRange(1.8, 3.5),
        alpha: 0.95,
        maxLife: randomRange(1.2, 2.2),
        color: Math.random() > 0.4 ? '#f59e0b' : '#fef08a',
        type: 'ember',
      });
    }
  }

  public emitRainSizzleSmoke(x: number, y: number) {
    if (Math.random() > 0.6) {
      this.emit({
        x: x + randomRange(-8, 8),
        y: y + randomRange(-4, 2),
        vx: randomRange(-0.25, 0.25),
        vy: randomRange(-0.7, -0.2),
        size: randomRange(3.5, 7.0),
        alpha: 0.3,
        maxLife: randomRange(1.0, 2.0),
        color: '#94a3b8',
        type: 'dust',
      });
    }
  }

  public emitChimneySmoke(x: number, y: number) {
    if (Math.random() < 0.35) {
      this.emit({
        x: x + randomRange(-4, 4),
        y,
        vx: randomRange(0.2, 0.9),
        vy: randomRange(-0.9, -0.4),
        size: randomRange(4, 8),
        alpha: 0.3,
        maxLife: randomRange(3.5, 5.5),
        color: '#e7e0d3',
        type: 'dust',
      });
    }
  }

  public emitWindLeaves(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number, _windSpeed: number) {
    const count = this.isLowPerformanceMode ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const isStardust = Math.random() > 0.5;
      const spawnX = randomRange(worldLeft - 100, worldRight + 100);
      const spawnY = worldTop - randomRange(20, 60);

      const sakuraColors = ['#f472b6', '#fbcfe8', '#fda4af', '#fff1f2', '#fecdd3', '#fb7185'];
      this.emit({
        x: spawnX,
        y: spawnY,
        vx: randomRange(-0.25, 0.25),
        vy: randomRange(1.15, 1.85),
        size: isStardust ? randomRange(2.0, 3.2) : randomRange(4.5, 7.5),
        alpha: isStardust ? randomRange(0.6, 0.9) : randomRange(0.75, 0.95),
        maxLife: randomRange(30.0, 48.0),
        color: isStardust ? '#fef08a' : sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        type: isStardust ? 'ember' : 'leaf',
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(-0.015, 0.015),
      });
    }
  }

  public emitRain(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number) {
    const count = this.isLowPerformanceMode ? 6 : 10;
    for (let i = 0; i < count; i++) {
      const rx = randomRange(worldLeft - 150, worldRight + 150);
      const ry = worldTop - randomRange(20, 80);
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

  public emitSnow(worldLeft: number, worldRight: number, worldTop: number, _worldBottom: number, windSpeed: number) {
    const count = this.isLowPerformanceMode ? 3 : 6;
    for (let i = 0; i < count; i++) {
      const sx = randomRange(worldLeft - 120, worldRight + 120);
      const sy = worldTop - randomRange(20, 50);
      const isLargeFlake = Math.random() > 0.7;
      this.emit({
        x: sx,
        y: sy,
        vx: windSpeed * 0.5 + randomRange(-0.5, 0.9),
        vy: randomRange(1.8, 3.8),
        size: isLargeFlake ? randomRange(4.5, 7.5) : randomRange(2.0, 4.0),
        alpha: isLargeFlake ? randomRange(0.7, 0.95) : randomRange(0.8, 1.0),
        maxLife: randomRange(14.0, 22.0),
        color: '#ffffff',
        type: 'snow',
        rotation: randomRange(0, Math.PI * 2),
        rotationSpeed: randomRange(-0.04, 0.04),
      });
    }
  }

  public update(dt: number, windSpeed: number) {
    const timeNow = Date.now() * 0.001;

    if (this.currentActiveWeather === 'clear') {
      this.fireflyMasterAlpha = Math.min(1.0, this.fireflyMasterAlpha + dt * 0.8);
    } else {
      this.fireflyMasterAlpha = Math.max(0.0, this.fireflyMasterAlpha - dt * 1.2);
    }

    let writeIdx = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life > 0) {
        if (p.type === 'firefly') {
          p.x += p.vx + Math.sin(timeNow * 1.2 + p.size * 5) * 0.35;
          p.y += p.vy + Math.cos(timeNow * 0.9 + p.size * 4) * 0.35;

          if (this.hasMouse) {
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 10000 && distSq > 0) {
              const dist = Math.sqrt(distSq);
              p.vx -= (dx / dist) * 0.25;
              p.vy -= (dy / dist) * 0.25;
            }
          }

          if (p.x < -1600) p.x = 4400;
          if (p.x > 4400) p.x = -1600;
          if (p.y < -900) p.y = 1400;
          if (p.y > 1400) p.y = -900;
        } else if (p.type === 'leaf') {
          p.x += p.vx + Math.sin(timeNow * 0.6 + p.y * 0.003) * 0.15;
          p.y += p.vy;
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
        } else if (p.type === 'snow') {
          p.x += p.vx + Math.sin(timeNow * 1.5 + p.y * 0.01) * 0.4;
          p.y += p.vy;
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
        } else if (p.type === 'dust') {
          p.x += p.vx + windSpeed * 0.2;
          p.y += p.vy;
          p.size = Math.min(p.size + dt * 1.8, 14);
        } else if (p.type === 'rain') {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > 180 && Math.random() < 0.05) {
            this.emit({
              x: p.x,
              y: p.y,
              vx: 0,
              vy: 0,
              size: 2,
              alpha: 0.4,
              maxLife: 0.3,
              color: '#93c5fd',
              type: 'ripple',
            });
          }
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        this.particles[writeIdx++] = p;
      }
    }
    this.particles.length = writeIdx;
  }

  public render(ctx: CanvasRenderingContext2D, _isNight: boolean) {
    if (this.particles.length === 0) return;

    // Fast Batched Rendering (Zero shadowBlur overhead & Minimal Save/Restore)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.type === 'firefly') {
        if (this.fireflyMasterAlpha <= 0.01) continue;
        const finalAlpha = p.alpha * this.fireflyMasterAlpha;
        const glowColor = p.color || '#fde047';

        // Outer delicate soft halo without shadowBlur
        ctx.globalAlpha = finalAlpha * 0.3;
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Inner white pinpoint core
        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'leaf') {
        ctx.save();
        const fadeIn = Math.min(1, (p.maxLife - p.life) / 0.8);
        const fadeOut = Math.min(1, p.life / 1.5);
        ctx.globalAlpha = fadeIn * fadeOut * p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);

        const flutterX = Math.cos((p.rotation || 0) * 1.5);
        ctx.scale(Math.abs(flutterX) * 0.7 + 0.3, 1.0);

        ctx.fillStyle = p.color || '#f472b6';
        ctx.beginPath();
        ctx.moveTo(0, p.size * 1.2);
        ctx.bezierCurveTo(p.size * 1.1, p.size * 0.5, p.size * 1.2, -p.size * 0.6, p.size * 0.4, -p.size * 1.2);
        ctx.lineTo(0, -p.size * 0.8);
        ctx.lineTo(-p.size * 0.4, -p.size * 1.2);
        ctx.bezierCurveTo(-p.size * 1.2, -p.size * 0.6, -p.size * 1.1, p.size * 0.5, 0, p.size * 1.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'snow') {
        const alpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ripple') {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.75, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'ember') {
        ctx.globalAlpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'rain') {
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 2.2, p.y + p.size);
        ctx.stroke();
      } else {
        ctx.globalAlpha = Math.max(0, (p.life / p.maxLife) * p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }
}
