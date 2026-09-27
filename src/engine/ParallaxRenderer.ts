import { WorldZone, ZoneId } from '../types/world';
import { SimpleNoise } from '../utils/math';
import { DayNightPalette } from './DayNightCycle';

export class ParallaxRenderer {
  private noise: SimpleNoise;
  public snowAccumulation = 0.0; // 0.0 (lush summer) to 1.0 (deep winter snow blanket)
  public sakuraAccumulation = 0.0; // 0.0 to 1.0 (carpet of fallen sakura petals)

  public zones: WorldZone[] = [
    {
      id: 'home',
      name: 'The Home Cottage',
      subtitle: 'Personal Introduction & Origins',
      description: 'The traveler’s peaceful dwelling. Welcome to my creative domain.',
      x: 120,
      y: 180,
      radius: 95,
      icon: 'Home',
      themeColor: '#3d5a45',
      interactLabel: 'Enter Cottage // Introduction'
    },
    {
      id: 'workshop',
      name: 'The Game Workshop',
      subtitle: 'Featured Projects & Miniature Dioramas',
      description: 'An artisan studio displaying living miniature dioramas of shipped games.',
      x: 750,
      y: 160,
      radius: 130,
      icon: 'Gamepad2',
      themeColor: '#d4a359',
      interactLabel: 'Inspect Projects // Field Journal'
    },
    {
      id: 'forest',
      name: 'Whispering Forest',
      subtitle: 'Technical Experiments & Procedural Tech',
      description: 'Ancient woods where experimental shaders and interactive mechanics flourish.',
      x: 1450,
      y: 100,
      radius: 115,
      icon: 'Trees',
      themeColor: '#4c785d',
      interactLabel: 'Explore Experiments'
    },
    {
      id: 'tree',
      name: 'The Ancient Tree of Milestones',
      subtitle: 'Career Journey & Development History',
      description: 'A thousand-year spirit tree inscribed with development milestones and shipped titles.',
      x: 2150,
      y: 140,
      radius: 125,
      icon: 'Milestone',
      themeColor: '#5282ad',
      interactLabel: 'Read Journey // Milestones'
    },
    {
      id: 'lake',
      name: 'Moon Lake of Reflection',
      subtitle: 'Development Philosophy & Values',
      description: 'A serene reflective lake holding the core principles of game feel and craft.',
      x: 2800,
      y: 220,
      radius: 120,
      icon: 'Sparkles',
      themeColor: '#6b9ac4',
      interactLabel: 'Contemplate Philosophy'
    },
    {
      id: 'lab',
      name: 'The Experiment Lab',
      subtitle: 'Interactive Shaders & Physics Gizmos',
      description: 'A hands-on engineering station with real-time flocking, shaders, and verlet physics.',
      x: 1100,
      y: 520,
      radius: 110,
      icon: 'FlaskConical',
      themeColor: '#d97757',
      interactLabel: 'Open Lab // Interactive Demos'
    },
    {
      id: 'campfire',
      name: 'The Cozy Campfire',
      subtitle: 'Contact, Collaboration & Socials',
      description: 'Warm flames under the night sky. Let’s connect and build something extraordinary.',
      x: 350,
      y: 540,
      radius: 105,
      icon: 'Flame',
      themeColor: '#e07a5f',
      interactLabel: 'Sit by Fire // Contact Me'
    },
    {
      id: 'skyIsland',
      name: 'The Floating Sky Sanctuary',
      subtitle: 'Official Resume & Credentials',
      description: 'An elevated sanctuary reached via ascending wind trails, housing the formal resume.',
      x: 1800,
      y: -260,
      radius: 110,
      icon: 'FileText',
      themeColor: '#d4a359',
      interactLabel: 'Inspect Resume Document'
    }
  ];

  // Stars for night sky (550+ multi-magnitude dense constellations)
  private stars: { x: number; y: number; size: number; alpha: number; color: string }[] = [];
  // Shooting stars / Meteors
  private shootingStarTimer = 1.0;
  private shootingStars: Array<{
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    alpha: number;
    life: number;
    maxLife: number;
  }> = [];

  constructor() {
    this.noise = new SimpleNoise(1337);
    this.initStars();
  }

  private initStars() {
    const starColors = ['#ffffff', '#fef08a', '#e0f2fe', '#fbcfe8', '#bae6fd', '#fed7aa'];
    for (let i = 0; i < 550; i++) {
      this.stars.push({
        x: ((i * 31) % 4800) - 1500,
        y: -650 + ((i * 27) % 720),
        size: (i % 9 === 0) ? 2.8 : ((i % 3 === 0) ? 1.8 : 1.1),
        alpha: 0.75 + (i % 4) * 0.08,
        color: starColors[i % starColors.length],
      });
    }
  }

  public update(dt: number, _windSpeed: number, isSnow: boolean = false, isBreeze: boolean = false) {
    // Dynamic snow accumulation & gentle thawing physics
    if (isSnow) {
      this.snowAccumulation = Math.min(1.0, this.snowAccumulation + dt * 0.22);
    } else {
      this.snowAccumulation = Math.max(0.0, this.snowAccumulation - dt * 0.35);
    }

    // Dynamic Cherry Blossom (Sakura) Petal accumulation & gentle dispersion
    if (isBreeze) {
      this.sakuraAccumulation = Math.min(1.0, this.sakuraAccumulation + dt * 0.22);
    } else {
      this.sakuraAccumulation = Math.max(0.0, this.sakuraAccumulation - dt * 0.28);
    }

    // Update Live Shooting Stars (Frequent streaks every 1.0 to 2.5s)
    this.shootingStarTimer -= dt;
    if (this.shootingStarTimer <= 0) {
      this.shootingStarTimer = 1.0 + Math.random() * 1.5;
      const count = Math.random() > 0.6 ? 2 : 1;
      for (let k = 0; k < count; k++) {
        this.shootingStars.push({
          x: -600 + Math.random() * 3600,
          y: -520 + Math.random() * 260,
          length: 180 + Math.random() * 140,
          speed: 900 + Math.random() * 450,
          angle: 0.72 + (Math.random() - 0.5) * 0.16, // ~42-45 degree diagonal streak
          alpha: 1.0,
          life: 0.95 + Math.random() * 0.45,
          maxLife: 1.4,
        });
      }
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.life -= dt;
      if (s.life <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }
      s.x += Math.cos(s.angle) * s.speed * dt;
      s.y += Math.sin(s.angle) * s.speed * dt;
      s.alpha = Math.min(1.0, s.life / (s.maxLife * 0.5));
    }
  }

  public renderBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    palette: DayNightPalette,
    time: number
  ) {
    // 1. Seamless Deep Midnight Cosmic Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#000000'); // Pure space black at zenith
    skyGrad.addColorStop(0.45, '#040b17'); // Midnight deep starlight
    skyGrad.addColorStop(0.85, '#0a182b'); // Soft moonlit horizon glow
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 1b. Soft Luminous Ethereal Aurora Ribbons
    ctx.save();
    const auroraY = height * 0.2 - camY * 0.02;
    const auroraGrad = ctx.createLinearGradient(0, auroraY - 90, 0, auroraY + 90);
    auroraGrad.addColorStop(0, 'transparent');
    auroraGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.07)');
    auroraGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.05)');
    auroraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auroraGrad;
    ctx.beginPath();
    ctx.moveTo(0, auroraY);
    for (let ax = 0; ax <= width + 50; ax += 50) {
      const ay = auroraY + Math.sin(time * 0.0014 + ax * 0.0035) * 40;
      ctx.lineTo(ax, ay);
    }
    ctx.lineTo(width, auroraY + 110);
    ctx.lineTo(0, auroraY + 110);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Crystal Clear Stars & Multi-Magnitude Constellations (550+ Stars)
    ctx.save();
    for (const s of this.stars) {
      const sx = s.x - camX * 0.05 + width * 0.5;
      const sy = s.y - camY * 0.05 + height * 0.35;
      if (sx >= -10 && sx <= width + 10 && sy >= -10 && sy <= height * 0.85) {
        const twinkle = Math.sin(time * 0.004 + s.x * 0.1) * 0.3;
        const starAlpha = Math.max(0.35, Math.min(1.0, s.alpha + twinkle));
        ctx.globalAlpha = starAlpha;
        
        // Crisp star core
        ctx.fillStyle = s.color || '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo for larger bright stars without expensive shadowBlur
        if (s.size > 2.0) {
          ctx.globalAlpha = starAlpha * 0.35;
          ctx.beginPath();
          ctx.arc(sx, sy, s.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Render Radiant Live Shooting Stars / Meteors
    for (const star of this.shootingStars) {
      const sx = star.x - camX * 0.05 + width * 0.5;
      const sy = star.y - camY * 0.05 + height * 0.35;
      const tailX = sx - Math.cos(star.angle) * star.length;
      const tailY = sy - Math.sin(star.angle) * star.length;

      ctx.globalAlpha = star.alpha;
      const grad = ctx.createLinearGradient(sx, sy, tailX, tailY);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.15, '#fde047');
      grad.addColorStop(0.45, '#38bdf8');
      grad.addColorStop(0.8, '#c084fc');
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Radiant Meteor Core Flare
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow aura without shadowBlur
      ctx.globalAlpha = star.alpha * 0.45;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sx, sy, 7.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Radiant Celestial Moon & Concentric Aura
    ctx.save();
    const moonX = width * 0.78 - camX * 0.04;
    const moonY = height * 0.24 - camY * 0.04;

    // Outer wide luminous corona aura
    const moonCorona = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 160);
    moonCorona.addColorStop(0, 'rgba(254, 240, 138, 0.32)');
    moonCorona.addColorStop(0.35, 'rgba(254, 240, 138, 0.09)');
    moonCorona.addColorStop(1, 'transparent');
    ctx.fillStyle = moonCorona;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Moon body with inner glow
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, palette.sunMoonSize, 0, Math.PI * 2);
    ctx.fill();

    // Soft moon crater texture
    ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.beginPath();
    ctx.arc(moonX - 8, moonY - 6, 9, 0, Math.PI * 2);
    ctx.arc(moonX + 10, moonY + 4, 7, 0, Math.PI * 2);
    ctx.arc(moonX - 4, moonY + 12, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Far Majestic Mountain Silhouettes (Parallax factor 0.18) with smooth atmospheric depth
    this.drawMountainRange(ctx, camX, camY, width, height, 0.18, '#0f1d30', '#060f1a', 230, 1.1, true);

    // 5. Mid Mountain Ridge (Parallax factor 0.32)
    this.drawMountainRange(ctx, camX, camY, width, height, 0.32, '#12253d', '#081624', 150, 1.9, false);

    // 6. Distant Forest Treeline & Rolling Hills (Parallax factor 0.52)
    this.drawRollingHills(ctx, camX, camY, width, height, 0.52, '#0c2822', '#061812', 85);
  }

  private drawMountainRange(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    parallax: number,
    topColor: string,
    bottomColor: string,
    peakHeight: number,
    frequency: number,
    hasSnowCaps: boolean = false
  ) {
    ctx.save();

    const baseY = height * 0.58 - camY * parallax;
    const step = 20;
    const points: Array<{ x: number; y: number }> = [];

    for (let x = 0; x <= width + step; x += step) {
      const worldX = (x + camX * parallax) * 0.003 * frequency;
      const h = Math.sin(worldX) * peakHeight + Math.cos(worldX * 2.3) * (peakHeight * 0.4);
      const py = baseY - h;
      points.push({ x, y: py });
    }

    // Smooth gradient fill from peak down to base
    const mtnGrad = ctx.createLinearGradient(0, baseY - peakHeight * 1.2, 0, height);
    mtnGrad.addColorStop(0, topColor);
    mtnGrad.addColorStop(1, bottomColor);
    ctx.fillStyle = mtnGrad;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, points[0]?.y ?? baseY);
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Luminous starlight rim-light on mountain peaks
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Optional glowing moonlit snow caps
    if (hasSnowCaps) {
      ctx.fillStyle = 'rgba(224, 242, 254, 0.25)';
      for (let i = 1; i < points.length - 1; i++) {
        if (points[i].y < points[i - 1].y && points[i].y < points[i + 1].y) {
          // Peak detected
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[i].x - 18, points[i].y + 22);
          ctx.lineTo(points[i].x + 18, points[i].y + 22);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  private drawRollingHills(
    ctx: CanvasRenderingContext2D,
    camX: number,
    camY: number,
    width: number,
    height: number,
    parallax: number,
    topColor: string,
    bottomColor: string,
    waveHeight: number
  ) {
    ctx.save();

    const baseY = height * 0.68 - camY * parallax;
    const step = 20;
    const hillPoints: Array<{ x: number; y: number }> = [];

    for (let x = 0; x <= width + step; x += step) {
      const worldX = (x + camX * parallax) * 0.005;
      const h = Math.sin(worldX) * waveHeight + Math.cos(worldX * 1.7) * (waveHeight * 0.5);
      const py = baseY - h;
      hillPoints.push({ x, y: py });
    }

    const hillGrad = ctx.createLinearGradient(0, baseY - waveHeight, 0, height);
    hillGrad.addColorStop(0, topColor);
    hillGrad.addColorStop(1, bottomColor);
    ctx.fillStyle = hillGrad;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, hillPoints[0]?.y ?? baseY);
    for (let i = 0; i < hillPoints.length; i++) {
      ctx.lineTo(hillPoints[i].x, hillPoints[i].y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw silhouetted distant pine trees along the hill crests
    ctx.fillStyle = 'rgba(8, 28, 22, 0.85)';
    for (let i = 2; i < hillPoints.length; i += 3) {
      const px = hillPoints[i].x;
      const py = hillPoints[i].y;
      const treeH = 14 + ((i * 7) % 10);
      
      ctx.beginPath();
      ctx.moveTo(px, py - treeH);
      ctx.lineTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // Renders foreground world geometry, pathways, water, flora and landmarks in world space
  public renderWorldEntities(
    ctx: CanvasRenderingContext2D,
    palette: DayNightPalette,
    time: number,
    activeZoneId: ZoneId | null,
    windSpeed: number,
    isRaining: boolean = false,
    camX: number = 0
  ) {
    const cullMinX = camX - 1150;
    const cullMaxX = camX + 1150;

    // 1. Painted Earth & Grassy Meadow Ground with Smooth Horizon Blending
    const groundGrad = ctx.createLinearGradient(0, 45, 0, 900);
    groundGrad.addColorStop(0, '#113824'); // Rich Ghibli dark emerald night grass
    groundGrad.addColorStop(0.35, '#0c281a'); // Middle meadow
    groundGrad.addColorStop(1, '#05140d'); // Deep ground
    ctx.fillStyle = groundGrad;

    ctx.beginPath();
    ctx.moveTo(-1800, 1200);
    ctx.lineTo(-1800, 50);
    for (let gx = -1800; gx <= 4200; gx += 50) {
      const gy = 45 + Math.sin(gx * 0.003) * 25 + Math.cos(gx * 0.008) * 15;
      ctx.lineTo(gx, gy);
    }
    ctx.lineTo(4200, 1200);
    ctx.closePath();
    ctx.fill();

    // Subtle moonlit starlight edge along the meadow horizon
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.3)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-1800, 50);
    for (let gx = -1800; gx <= 4200; gx += 50) {
      const gy = 45 + Math.sin(gx * 0.003) * 25 + Math.cos(gx * 0.008) * 15;
      ctx.lineTo(gx, gy);
    }
    ctx.stroke();
    ctx.restore();

    // 1b. Lush swaying night grass blade tufts (Viewport Culled)
    ctx.save();
    const grassColors = ['#0f3827', '#134631', '#18593f', '#0c2e20'];
    const grassStart = Math.max(-1300, Math.floor(cullMinX / 40) * 40);
    const grassEnd = Math.min(3600, Math.ceil(cullMaxX / 40) * 40);

    for (let bx = grassStart; bx <= grassEnd; bx += 40) {
      const by = 160 + Math.sin(bx * 0.008) * 80 + (bx % 29);
      const sway = Math.sin(time * 0.002 + bx * 0.01) * 4;
      const gColor = grassColors[Math.abs(bx) % grassColors.length];
      
      ctx.strokeStyle = gColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + sway, by - 12, bx + sway * 1.5, by - 16);
      ctx.moveTo(bx + 4, by);
      ctx.quadraticCurveTo(bx + 4 - sway, by - 10, bx + 4 - sway * 1.2, by - 14);
      ctx.stroke();
    }

    // Glowing Night Wildflowers (Viewport Culled without shadowBlur)
    const flowerColors = ['#f472b6', '#facc15', '#38bdf8', '#c084fc', '#fef08a'];
    const flowerStart = Math.max(-1200, Math.floor(cullMinX / 85) * 85);
    const flowerEnd = Math.min(3500, Math.ceil(cullMaxX / 85) * 85);

    for (let fx = flowerStart; fx <= flowerEnd; fx += 85) {
      const fy = 150 + Math.sin(fx * 0.01) * 70 + (fx % 37);
      const fColor = flowerColors[Math.abs(fx) % flowerColors.length];
      
      ctx.fillStyle = fColor;
      ctx.beginPath();
      ctx.arc(fx, fy - 6, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Dynamic Accumulated Snow Blanket on Terrain
    if (this.snowAccumulation > 0.01) {
      ctx.save();
      ctx.globalAlpha = this.snowAccumulation * 0.94;
      
      const snowGrad = ctx.createLinearGradient(0, 40, 0, 900);
      snowGrad.addColorStop(0, '#e0f2fe');
      snowGrad.addColorStop(0.3, '#f0f9ff');
      snowGrad.addColorStop(0.7, '#ffffff');
      snowGrad.addColorStop(1, '#dbeafe');
      ctx.fillStyle = snowGrad;
      
      ctx.beginPath();
      ctx.moveTo(-1800, 1200);
      ctx.lineTo(-1800, 50);
      for (let gx = -1800; gx <= 4200; gx += 50) {
        const gy = 45 + Math.sin(gx * 0.003) * 25 + Math.cos(gx * 0.008) * 15;
        ctx.lineTo(gx, gy);
      }
      ctx.lineTo(4200, 1200);
      ctx.closePath();
      ctx.fill();

      // Fluffy undulating soft snow drifts (Viewport Culled)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const snowDriftStart = Math.max(-1200, Math.floor(cullMinX / 160) * 160);
      const snowDriftEnd = Math.min(3800, Math.ceil(cullMaxX / 160) * 160);
      for (let sx = snowDriftStart; sx <= snowDriftEnd; sx += 160) {
        ctx.beginPath();
        ctx.ellipse(sx, 160 + Math.sin(sx * 0.01) * 50, 120, 24, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2b. Dynamic Accumulated Cherry Blossom (Sakura) Petal Blanket on Terrain
    if (this.sakuraAccumulation > 0.01) {
      ctx.save();
      ctx.globalAlpha = this.sakuraAccumulation * 0.88;
      
      // Full rose petal blanket across entire meadow
      const sakuraGrad = ctx.createLinearGradient(0, 40, 0, 900);
      sakuraGrad.addColorStop(0, '#fda4af');
      sakuraGrad.addColorStop(0.2, '#f472b6');
      sakuraGrad.addColorStop(0.5, '#db2777');
      sakuraGrad.addColorStop(1, '#831843');
      ctx.fillStyle = sakuraGrad;
      
      ctx.beginPath();
      ctx.moveTo(-1800, 1200);
      ctx.lineTo(-1800, 50);
      for (let gx = -1800; gx <= 4200; gx += 50) {
        const gy = 45 + Math.sin(gx * 0.003) * 25 + Math.cos(gx * 0.008) * 15;
        ctx.lineTo(gx, gy);
      }
      ctx.lineTo(4200, 1200);
      ctx.closePath();
      ctx.fill();

      // Dense carpet of individual fallen petals scattered across the terrain (Viewport Culled)
      const petalColors = ['#f472b6', '#fbcfe8', '#fda4af', '#fecdd3', '#ffffff', '#fb7185'];
      const petalStart = Math.max(-1400, Math.floor(cullMinX / 30) * 30);
      const petalEnd = Math.min(4000, Math.ceil(cullMaxX / 30) * 30);

      for (let px = petalStart; px <= petalEnd; px += 30) {
        const py = 140 + Math.sin(px * 0.007) * 75 + Math.cos(px * 0.024) * 35;
        const rot = (px * 0.17) % (Math.PI * 2);
        const pColor = petalColors[Math.abs(Math.floor(px * 3.7)) % petalColors.length];
        
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 5.0, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // 3. Western Scenery (Culled)
    if (cullMaxX >= -950 && cullMinX <= 0) {
      this.drawWesternScenery(ctx, palette, time);
    }

    // 4. Cobblestone Path connecting all zones
    this.drawCobblestonePath(ctx);

    // 5. Moon Lake Water Body & Shimmer (Culled)
    if (cullMaxX >= 2550 && cullMinX <= 3100) {
      this.drawMoonLake(ctx, palette, time);
    }

    // 6. Floating Sky Island & Wind Stream (Culled)
    if (cullMaxX >= 1550 && cullMinX <= 2050) {
      this.drawSkyIsland(ctx, palette, time);
    }

    // 7. Zone Structures & Landmarks (Frustum Culled for High FPS)
    if (cullMaxX >= -80 && cullMinX <= 320) {
      this.drawHomeCottage(ctx, palette, time);
    }
    if (cullMaxX >= 550 && cullMinX <= 950) {
      this.drawGameWorkshop(ctx, palette, time);
    }
    if (cullMaxX >= 1050 && cullMinX <= 1700) {
      this.drawWhisperingForest(ctx, palette, time, windSpeed);
    }
    if (cullMaxX >= 1950 && cullMinX <= 2350) {
      this.drawAncientTree(ctx, palette, time);
    }
    if (cullMaxX >= 2250 && cullMinX <= 2550) {
      this.drawExperimentLab(ctx, palette, time);
    }
    if (cullMaxX >= 180 && cullMinX <= 520) {
      this.drawCampfire(ctx, palette, time, isRaining);
    }

    // 8. Interactive Zone Indicators
    this.drawZoneTriggers(ctx, activeZoneId, palette, time);
  }

  private drawWesternScenery(ctx: CanvasRenderingContext2D, palette: DayNightPalette, time: number) {
    // A. Western Pine Grove
    const pinePositions = [
      { x: -850, y: 70, scale: 1.1 },
      { x: -750, y: 65, scale: 0.95 },
      { x: -550, y: 80, scale: 1.05 },
      { x: -450, y: 60, scale: 0.9 },
      { x: -200, y: 75, scale: 1.15 },
      { x: -90, y: 65, scale: 0.85 },
      { x: -20, y: 90, scale: 1.0 },
    ];

    for (const pine of pinePositions) {
      this.drawStylizedPineTree(ctx, pine.x, pine.y, pine.scale, time);
    }

    // B. Sacred Torii Gate & Twin Stone Lanterns at x = -680, y = 145
    this.drawToriiGate(ctx, -680, 145, time);

    // C. Rustic Wooden Windmill at x = -320, y = 135
    this.drawWindmill(ctx, -320, 135, palette, time);
  }

  private drawStylizedPineTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, time: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const sway = Math.sin(time * 0.0018 + x * 0.02) * 2.5;

    // Tree Trunk
    ctx.fillStyle = '#3a271d';
    ctx.fillRect(-6, -10, 12, 50);

    // Pine Foliage Tiers (Tier 1 base to Tier 3 top)
    const tiers = [
      { y: -10, w: 42, h: 32, color: '#0d2e20' },
      { y: -30, w: 34, h: 28, color: '#103827' },
      { y: -48, w: 24, h: 24, color: '#144631' },
      { y: -64, w: 14, h: 18, color: '#18543c' },
    ];

    for (const t of tiers) {
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.moveTo(0 + sway * 0.3, t.y - t.h);
      ctx.lineTo(-t.w * 0.5, t.y);
      ctx.lineTo(t.w * 0.5, t.y);
      ctx.closePath();
      ctx.fill();

      // Snow on pine tier
      if (this.snowAccumulation > 0.05) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = this.snowAccumulation * 0.85;
        ctx.beginPath();
        ctx.moveTo(-t.w * 0.5, t.y);
        ctx.lineTo(-t.w * 0.5 + 8, t.y - 4);
        ctx.lineTo(0 + sway * 0.3, t.y - t.h + 6);
        ctx.lineTo(t.w * 0.5 - 8, t.y - 4);
        ctx.lineTo(t.w * 0.5, t.y);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    ctx.restore();
  }

  private drawToriiGate(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    ctx.translate(x, y);

    // Vermilion Torii Pillars
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-35, -75, 8, 75);
    ctx.fillRect(27, -75, 8, 75);

    // Stone base collars
    ctx.fillStyle = '#475569';
    ctx.fillRect(-37, -8, 12, 10);
    ctx.fillRect(25, -8, 12, 10);

    // Horizontal Upper Lintels (Kasagi & Nuki)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-45, -55, 90, 7);

    // Curved Top Crossbeam (Kasagi with upward swept ends)
    ctx.fillStyle = '#0f172a'; // Black top ridge cap
    ctx.beginPath();
    ctx.moveTo(-52, -84);
    ctx.quadraticCurveTo(0, -80, 52, -84);
    ctx.lineTo(54, -76);
    ctx.quadraticCurveTo(0, -73, -54, -76);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-48, -76, 96, 8);

    // Twin Stone Lanterns (Tōrō) on each side
    [-55, 55].forEach(lx => {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(lx - 6, -18, 12, 18);
      ctx.fillRect(lx - 9, -24, 18, 6);

      // Glowing Amber Lantern Core
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lx - 4, -22, 8, 5);

      // Lantern roof
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(lx, -30);
      ctx.lineTo(lx - 10, -24);
      ctx.lineTo(lx + 10, -24);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  private drawWindmill(ctx: CanvasRenderingContext2D, x: number, y: number, palette: DayNightPalette, time: number) {
    ctx.save();
    ctx.translate(x, y);

    // Stone Foundation
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(-30, -8, 60, 16, 4);
    ctx.fill();

    // Tapered Wooden Mill Body
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(-24, -8);
    ctx.lineTo(-14, -95);
    ctx.lineTo(14, -95);
    ctx.lineTo(24, -8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Warm Glowing Lattice Windows
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-6, -45, 12, 14);
    ctx.fillRect(-5, -75, 10, 12);

    // Windmill Conical Cap Roof
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(0, -118);
    ctx.lineTo(-20, -95);
    ctx.lineTo(20, -95);
    ctx.closePath();
    ctx.fill();

    // Rotating 4-Blade Canvas Windmill Rotor
    ctx.save();
    ctx.translate(0, -100);
    const bladeRot = time * 0.0012;
    ctx.rotate(bladeRot);

    // Center Axle Hub
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // 4 Blades with wooden spar and canvas sails
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI * 0.5);

      // Wooden spar arm
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -58);
      ctx.stroke();

      // White/Cream Canvas Sail
      ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
      ctx.beginPath();
      ctx.moveTo(2, -14);
      ctx.lineTo(14, -18);
      ctx.lineTo(12, -54);
      ctx.lineTo(2, -56);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  private drawCobblestonePath(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = '#1e2638';
    ctx.strokeStyle = this.snowAccumulation > 0.3 ? '#cbd5e1' : '#1e293b';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(-780, 150); // West Torii entrance
    ctx.quadraticCurveTo(-520, 130, -320, 135); // Past Windmill
    ctx.quadraticCurveTo(-100, 160, 120, 180); // To Home Cottage
    ctx.quadraticCurveTo(230, 360, 350, 540); // To Campfire
    ctx.quadraticCurveTo(550, 480, 750, 160); // To Workshop
    ctx.quadraticCurveTo(900, 380, 1100, 520); // To Lab
    ctx.quadraticCurveTo(1280, 320, 1450, 100); // To Forest
    ctx.quadraticCurveTo(1800, 120, 2150, 140); // To Ancient Tree
    ctx.quadraticCurveTo(2500, 180, 2800, 220); // To Lake
    ctx.stroke();

    // Inner subtle stepping stone highlight
    ctx.strokeStyle = '#2b3952';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-780, 150);
    ctx.quadraticCurveTo(-520, 130, -320, 135);
    ctx.quadraticCurveTo(-100, 160, 120, 180);
    ctx.quadraticCurveTo(230, 360, 350, 540);
    ctx.quadraticCurveTo(550, 480, 750, 160);
    ctx.quadraticCurveTo(900, 380, 1100, 520);
    ctx.quadraticCurveTo(1280, 320, 1450, 100);
    ctx.quadraticCurveTo(1800, 120, 2150, 140);
    ctx.quadraticCurveTo(2500, 180, 2800, 220);
    ctx.stroke();

    // Snow Dusting on path
    if (this.snowAccumulation > 0.05) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation * 0.75;
      for (let x = 80; x < 2900; x += 40) {
        ctx.beginPath();
        ctx.arc(x + (x % 19), 160 + Math.sin(x * 0.01) * 60 + (x % 13), 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sakura Petal Dusting on path
    if (this.sakuraAccumulation > 0.05) {
      ctx.save();
      ctx.globalAlpha = this.sakuraAccumulation * 0.85;
      const pathPetalColors = ['#f472b6', '#fbcfe8', '#fda4af'];
      for (let x = 80; x < 2900; x += 32) {
        const pColor = pathPetalColors[x % pathPetalColors.length];
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.ellipse(x + (x % 17), 160 + Math.sin(x * 0.01) * 60 + (x % 11), 3.5, 1.8, (x * 0.2) % 3.14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  private drawMoonLake(ctx: CanvasRenderingContext2D, palette: DayNightPalette, time: number) {
    const lx = 2800;
    const ly = 220;

    ctx.save();
    // Lake shoreline sand or snow
    ctx.fillStyle = this.snowAccumulation > 0.2 ? '#f1f5f9' : '#dfd5c4';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 190, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lake water body (Ice or clear night water)
    ctx.fillStyle = this.snowAccumulation > 0.4 ? '#1e293b' : palette.waterColor;
    ctx.beginPath();
    ctx.ellipse(lx, ly, 175, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water surface light ripples & reflections
    ctx.fillStyle = this.snowAccumulation > 0.4 ? 'rgba(224, 242, 254, 0.4)' : 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 6; i++) {
      const rx = lx - 100 + i * 35 + Math.sin(time * 0.002 + i) * 12;
      const ry = ly - 40 + i * 14 + Math.cos(time * 0.002 + i) * 6;
      ctx.fillRect(rx, ry, 28, 2);
    }

    // Wooden Pier / Dock
    ctx.fillStyle = '#6b4f3a';
    ctx.fillRect(lx - 160, ly - 10, 70, 22);
    ctx.fillStyle = '#4a3525';
    ctx.fillRect(lx - 155, ly + 10, 6, 12);
    ctx.fillRect(lx - 100, ly + 10, 6, 12);

    // Snow on Pier
    if (this.snowAccumulation > 0.05) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation * 0.9;
      ctx.beginPath();
      ctx.roundRect(lx - 160, ly - 14, 70, 6, 3);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Philosophy Monolith Stone at center of lake
    ctx.fillStyle = '#4c5c56';
    ctx.beginPath();
    ctx.roundRect(lx + 20, ly - 35, 26, 45, 4);
    ctx.fill();
    ctx.fillStyle = palette.starAlpha > 0.5 ? '#e5b76b' : '#a8d5ba';
    ctx.beginPath();
    ctx.arc(lx + 33, ly - 15, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawSkyIsland(ctx: CanvasRenderingContext2D, palette: DayNightPalette, time: number) {
    const sx = 1800;
    const sy = -260;
    const hover = Math.sin(time * 0.002) * 8;

    ctx.save();
    ctx.translate(sx, sy + hover);

    // Ascending wind elevator stream from ground
    ctx.strokeStyle = 'rgba(212, 163, 89, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 12]);
    ctx.lineDashOffset = -time * 0.04;
    ctx.beginPath();
    ctx.moveTo(-15, 400);
    ctx.lineTo(-5, 50);
    ctx.moveTo(15, 400);
    ctx.lineTo(5, 50);
    ctx.stroke();
    ctx.setLineDash([]);

    // Island rock underside
    ctx.fillStyle = '#4a3c31';
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(110, 0);
    ctx.lineTo(40, 95);
    ctx.lineTo(-20, 110);
    ctx.closePath();
    ctx.fill();

    // Island lush grass top or snow top
    ctx.fillStyle = this.snowAccumulation > 0.2 ? '#f8fafc' : '#4c785d';
    ctx.beginPath();
    ctx.ellipse(0, 0, 115, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Shrine & Floating Resume Pedestal
    ctx.fillStyle = '#d4a359';
    ctx.beginPath();
    ctx.roundRect(-24, -40, 48, 40, 4);
    ctx.fill();
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(-12, -32, 24, 24);
    ctx.fillStyle = '#272b30';
    ctx.fillRect(-8, -26, 16, 2);
    ctx.fillRect(-8, -20, 16, 2);
    ctx.fillRect(-8, -14, 10, 2);

    ctx.restore();
  }

  private drawHomeCottage(ctx: CanvasRenderingContext2D, palette: DayNightPalette, _time: number) {
    const hx = 120;
    const hy = 180;

    ctx.save();
    ctx.translate(hx, hy);

    // Stone Foundation
    ctx.fillStyle = '#7a766c';
    ctx.fillRect(-65, -10, 130, 20);

    // Cozy Timber Walls
    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(-55, -70, 110, 60);

    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-55, -70, 110, 60);
    ctx.beginPath();
    ctx.moveTo(0, -70);
    ctx.lineTo(0, -10);
    ctx.stroke();

    // Wooden Door
    ctx.fillStyle = '#5c3818';
    ctx.beginPath();
    ctx.roundRect(-14, -45, 28, 35, [14, 14, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#d4a359';
    ctx.beginPath();
    ctx.arc(8, -25, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Warm Window
    ctx.fillStyle = palette.starAlpha > 0.5 ? '#f5d77f' : '#bfe3f7';
    ctx.fillRect(20, -52, 24, 24);
    ctx.strokeRect(20, -52, 24, 24);
    ctx.beginPath();
    ctx.moveTo(32, -52);
    ctx.lineTo(32, -28);
    ctx.moveTo(20, -40);
    ctx.lineTo(44, -40);
    ctx.stroke();

    // Stone Chimney
    ctx.fillStyle = '#5e564d';
    ctx.fillRect(32, -105, 18, 45);
    ctx.fillRect(29, -108, 24, 6);

    // Ghibli Terracotta Roof
    ctx.fillStyle = '#a65335';
    ctx.beginPath();
    ctx.moveTo(-75, -65);
    ctx.lineTo(0, -115);
    ctx.lineTo(75, -65);
    ctx.closePath();
    ctx.fill();

    // Fluffy Accumulated Snow Cap on Roof & Chimney
    if (this.snowAccumulation > 0.02) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation;
      
      // Roof snow blanket
      ctx.beginPath();
      ctx.moveTo(-78, -68);
      ctx.quadraticCurveTo(-38, -100, 0, -122);
      ctx.quadraticCurveTo(38, -100, 78, -68);
      ctx.lineTo(70, -60);
      ctx.quadraticCurveTo(35, -92, 0, -114);
      ctx.quadraticCurveTo(-35, -92, -70, -60);
      ctx.closePath();
      ctx.fill();

      // Chimney snow cap
      ctx.beginPath();
      ctx.roundRect(26, -112, 30, 6, 3);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Soft Accumulated Sakura Petals on Cottage Roof
    if (this.sakuraAccumulation > 0.02) {
      ctx.save();
      ctx.fillStyle = '#f472b6';
      ctx.globalAlpha = this.sakuraAccumulation * 0.85;
      for (let rx = -65; rx <= 65; rx += 14) {
        const ry = -65 - (1 - Math.abs(rx) / 75) * 45;
        ctx.beginPath();
        ctx.ellipse(rx, ry, 3.5, 1.8, (rx * 0.3) % 3.14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Welcome Sign
    ctx.fillStyle = '#3a271d';
    ctx.fillRect(-70, -25, 5, 30);
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(-85, -38, 35, 14);
    ctx.fillStyle = '#272b30';
    ctx.font = '700 8px monospace';
    ctx.fillText('// HOME', -82, -28);

    ctx.restore();
  }

  private drawGameWorkshop(ctx: CanvasRenderingContext2D, _palette: DayNightPalette, time: number) {
    const wx = 750;
    const wy = 160;

    ctx.save();
    ctx.translate(wx, wy);

    // Artisan Studio Stone Platform
    ctx.fillStyle = '#6b706c';
    ctx.beginPath();
    ctx.roundRect(-100, -15, 200, 30, 6);
    ctx.fill();

    // Wooden Studio Pillars
    ctx.fillStyle = '#5c3818';
    ctx.fillRect(-85, -80, 12, 70);
    ctx.fillRect(73, -80, 12, 70);

    // Workshop Canopy
    ctx.fillStyle = '#f8f6f0';
    ctx.beginPath();
    ctx.moveTo(-105, -75);
    ctx.lineTo(0, -110);
    ctx.lineTo(105, -75);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#3d5a45';
    for (let i = -80; i <= 60; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, -75);
      ctx.lineTo(i + 20, -75);
      ctx.lineTo(i * 0.3 + 10, -100);
      ctx.lineTo(i * 0.3, -100);
      ctx.fill();
    }

    // Snow on Workshop Canopy
    if (this.snowAccumulation > 0.02) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation;
      ctx.beginPath();
      ctx.moveTo(-108, -78);
      ctx.quadraticCurveTo(-50, -100, 0, -118);
      ctx.quadraticCurveTo(50, -100, 108, -78);
      ctx.lineTo(95, -70);
      ctx.quadraticCurveTo(45, -92, 0, -110);
      ctx.quadraticCurveTo(-45, -92, -95, -70);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Sakura Petals on Workshop Canopy
    if (this.sakuraAccumulation > 0.02) {
      ctx.save();
      ctx.fillStyle = '#fbcfe8';
      ctx.globalAlpha = this.sakuraAccumulation * 0.85;
      for (let wx2 = -90; wx2 <= 90; wx2 += 16) {
        const wy2 = -75 - (1 - Math.abs(wx2) / 105) * 30;
        ctx.beginPath();
        ctx.ellipse(wx2, wy2, 3.5, 1.8, (wx2 * 0.25) % 3.14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Rotating Holographic Game Dioramas on Pedestals
    const themes = [
      { name: 'Dottie', color: '#f59e0b', x: -50, shape: 'blade' },
      { name: 'Bait', color: '#10b981', x: 0, shape: 'orbit' },
      { name: 'Astral Rally', color: '#06b6d4', x: 50, shape: 'leaf' }
    ];

    themes.forEach((d, idx) => {
      const rot = time * 0.003 + idx * 2.1;
      const hoverY = Math.sin(rot) * 5;

      ctx.fillStyle = '#4a4e4a';
      ctx.fillRect(d.x - 12, -35, 24, 25);

      ctx.save();
      ctx.translate(d.x, -50 + hoverY);
      ctx.fillStyle = d.color;

      if (d.shape === 'blade') {
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(6, 6);
        ctx.lineTo(0, 12);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
      } else if (d.shape === 'orbit') {
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 5, rot, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Workshop Banner
    ctx.fillStyle = '#d4a359';
    ctx.fillRect(-50, -95, 100, 16);
    ctx.fillStyle = '#1c1b18';
    ctx.font = '700 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('// GAME WORKSHOP', 0, -84);

    ctx.restore();
  }

  private drawWhisperingForest(ctx: CanvasRenderingContext2D, _palette: DayNightPalette, time: number, windSpeed: number) {
    const fx = 1450;
    const fy = 100;

    ctx.save();
    ctx.translate(fx, fy);

    const treeOffsets = [-90, -40, 20, 80];
    treeOffsets.forEach((ox, i) => {
      const sway = Math.sin(time * 0.002 + i) * (4 * windSpeed);
      ctx.fillStyle = '#4a3424';
      ctx.fillRect(ox - 6, -60, 12, 70);

      // Lush foliage puffs
      ctx.fillStyle = i % 2 === 0 ? '#2f4f3e' : '#3d5a45';
      ctx.beginPath();
      ctx.arc(ox + sway, -85, 34, 0, Math.PI * 2);
      ctx.arc(ox - 18 + sway, -65, 24, 0, Math.PI * 2);
      ctx.arc(ox + 18 + sway, -65, 24, 0, Math.PI * 2);
      ctx.fill();

      // Frosted Snow on Tree Canopies
      if (this.snowAccumulation > 0.02) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = this.snowAccumulation * 0.95;
        ctx.beginPath();
        ctx.arc(ox + sway, -100, 20, 0, Math.PI * 2);
        ctx.arc(ox - 16 + sway, -80, 14, 0, Math.PI * 2);
        ctx.arc(ox + 16 + sway, -80, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    });

    // Prismatic Shader Crystal Obelisk
    const crystalHover = Math.sin(time * 0.003) * 6;
    ctx.fillStyle = '#3a4a40';
    ctx.beginPath();
    ctx.roundRect(-15, -20, 30, 25, 4);
    ctx.fill();

    ctx.fillStyle = '#a8d5ba';
    ctx.beginPath();
    ctx.moveTo(0, -55 + crystalHover);
    ctx.lineTo(12, -40 + crystalHover);
    ctx.lineTo(0, -25 + crystalHover);
    ctx.lineTo(-12, -40 + crystalHover);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawAncientTree(ctx: CanvasRenderingContext2D, palette: DayNightPalette, _time: number) {
    const tx = 2150;
    const ty = 140;

    ctx.save();
    ctx.translate(tx, ty);

    // Giant Ancient Roots
    ctx.fillStyle = '#3e2a1b';
    ctx.beginPath();
    ctx.moveTo(-70, 10);
    ctx.quadraticCurveTo(-30, -30, -15, -90);
    ctx.lineTo(15, -90);
    ctx.quadraticCurveTo(30, -30, 70, 10);
    ctx.closePath();
    ctx.fill();

    // Giant Canopy
    ctx.fillStyle = '#243c30';
    ctx.beginPath();
    ctx.arc(0, -140, 85, 0, Math.PI * 2);
    ctx.arc(-60, -110, 55, 0, Math.PI * 2);
    ctx.arc(60, -110, 55, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Snow on Ancient Tree Canopy
    if (this.snowAccumulation > 0.02) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation * 0.95;
      ctx.beginPath();
      ctx.arc(0, -170, 55, 0, Math.PI * 2);
      ctx.arc(-55, -135, 40, 0, Math.PI * 2);
      ctx.arc(55, -135, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Carved Glowing Milestones on trunk
    const isNight = palette.starAlpha > 0.5;
    ctx.fillStyle = isNight ? '#e5b76b' : '#a3c2b0';
    for (let r = 0; r < 4; r++) {
      ctx.fillRect(-6, -75 + r * 14, 12, 4);
    }

    ctx.restore();
  }

  private drawExperimentLab(ctx: CanvasRenderingContext2D, _palette: DayNightPalette, _time: number) {
    const lx = 1100;
    const ly = 520;

    ctx.save();
    ctx.translate(lx, ly);

    ctx.fillStyle = '#5c4d3c';
    ctx.fillRect(-60, -25, 120, 28);
    ctx.fillStyle = '#3a2f24';
    ctx.fillRect(-55, 3, 10, 15);
    ctx.fillRect(45, 3, 10, 15);

    // Snow on Lab workbench
    if (this.snowAccumulation > 0.02) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation * 0.85;
      ctx.beginPath();
      ctx.roundRect(-62, -30, 124, 8, 4);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Bubbling Flasks & Glassware
    ctx.fillStyle = '#6b9ac4';
    ctx.beginPath();
    ctx.arc(-30, -38, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e07a5f';
    ctx.beginPath();
    ctx.arc(20, -35, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawCampfire(ctx: CanvasRenderingContext2D, palette: DayNightPalette, time: number, isRaining: boolean = false) {
    const cx = 350;
    const cy = 540;

    ctx.save();
    ctx.translate(cx, cy);

    // Surrounding Stone Fire Ring
    ctx.fillStyle = isRaining ? '#3f3f46' : '#5a554c';
    for (let a = 0; a < Math.PI * 2; a += 0.7) {
      const sx = Math.cos(a) * 25;
      const sy = Math.sin(a) * 16;
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isRaining) {
      // Wet Charred Extinguished Logs
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.roundRect(-14, -6, 28, 12, 4);
      ctx.fill();

      // Soft steam wisps rising from wet embers in rain
      ctx.save();
      ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
      for (let i = 0; i < 4; i++) {
        const sx = -8 + i * 5 + Math.sin(time * 0.003 + i) * 4;
        const sy = -6 - ((time * 25 + i * 18) % 40);
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5 + i * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else {
      // Active Roaring Flame
      const f1 = Math.sin(time * 0.01) * 3;
      const f2 = Math.cos(time * 0.015) * 4;

      ctx.fillStyle = '#e07a5f';
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.quadraticCurveTo(0, -32 + f1, 0, -32 + f1);
      ctx.quadraticCurveTo(12, 0, 12, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f2d192';
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.quadraticCurveTo(0, -20 + f2, 0, -20 + f2);
      ctx.quadraticCurveTo(7, 0, 7, 0);
      ctx.closePath();
      ctx.fill();

      // Campfire Warm Radial Glow at Night
      ctx.fillStyle = 'rgba(217, 119, 87, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wooden Log Bench
    ctx.fillStyle = '#6b4c33';
    ctx.beginPath();
    ctx.roundRect(40, -15, 30, 14, 4);
    ctx.fill();

    // Snow on Bench
    if (this.snowAccumulation > 0.02) {
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.snowAccumulation * 0.85;
      ctx.beginPath();
      ctx.roundRect(38, -19, 34, 6, 3);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Sakura Petal Dusting on Bench
    if (this.sakuraAccumulation > 0.02) {
      ctx.save();
      ctx.fillStyle = '#f472b6';
      ctx.globalAlpha = this.sakuraAccumulation * 0.9;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(42 + i * 7, -16, 2.5, 1.3, (i * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  private drawZoneTriggers(
    ctx: CanvasRenderingContext2D,
    activeZoneId: ZoneId | null,
    _palette: DayNightPalette,
    time: number
  ) {
    for (const z of this.zones) {
      const isCurrent = z.id === activeZoneId;
      if (!isCurrent) continue;

      const bob = Math.sin(time * 0.005) * 4;
      const heightOffset = this.getZoneHeightOffset(z.id) + bob;
      const actionLabel = this.getZoneActionLabel(z.id);

      ctx.save();
      ctx.translate(z.x, z.y);

      // Subtle ground ring glow
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -time * 0.01;
      ctx.beginPath();
      ctx.ellipse(0, 10, z.radius, z.radius * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Minimal Floating [E] Dialogue Box above the house/structure
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
      const textWidth = ctx.measureText(actionLabel).width;
      const badgeW = textWidth + 50;
      const badgeH = 26;
      const badgeX = -badgeW / 2;
      const badgeY = heightOffset;

      // Dark glass container with gold border
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 13);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Little indicator arrow pointing down to the house
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-5, badgeY + badgeH);
      ctx.lineTo(0, badgeY + badgeH + 5);
      ctx.lineTo(5, badgeY + badgeH);
      ctx.closePath();
      ctx.fill();

      // [E] Keycap icon
      const keyX = badgeX + 4;
      const keyY = badgeY + 4;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.roundRect(keyX, keyY, 18, 18, 4);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('E', keyX + 9, keyY + 9);

      // Action text
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(actionLabel, keyX + 23, keyY + 9);

      // Star sparkle icon
      ctx.fillStyle = '#facc15';
      ctx.fillText('✦', badgeX + badgeW - 14, keyY + 9);

      ctx.restore();
    }
  }

  private getZoneHeightOffset(id: string): number {
    switch (id) {
      case 'cottage': return -155;
      case 'workshop': return -165;
      case 'forest': return -170;
      case 'tree': return -235;
      case 'lake': return -70;
      case 'lab': return -80;
      case 'campfire': return -70;
      case 'skyIsland': return -110;
      default: return -130;
    }
  }

  private getZoneActionLabel(id: string): string {
    switch (id) {
      case 'cottage': return 'Enter Cottage';
      case 'workshop': return 'Play Games';
      case 'forest': return 'Explore Experiments';
      case 'tree': return 'Milestones & Journey';
      case 'lake': return 'Philosophy';
      case 'lab': return 'Shaders Lab';
      case 'campfire': return 'Campfire & Contact';
      case 'skyIsland': return 'Resume Document';
      default: return 'Interact';
    }
  }
}
