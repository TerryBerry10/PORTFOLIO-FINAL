import { CameraState, TimeOfDay, WeatherType, WorldState, ZoneId } from '../types/world';
import { clamp, distance, lerp } from '../utils/math';
import { Billboard } from '../data/billboards';
import { AudioEngine } from './AudioEngine';
import { AirshipRenderer } from './AirshipRenderer';
import { DayNightCycle } from './DayNightCycle';
import { ParallaxRenderer } from './ParallaxRenderer';
import { ParticleSystem } from './ParticleSystem';
import { PlayerController } from './PlayerController';
import { WeatherSystem } from './WeatherSystem';

export class WorldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime = 0;

  // Subsystems
  public player: PlayerController;
  public renderer: ParallaxRenderer;
  public airships: AirshipRenderer;
  public particles: ParticleSystem;
  public dayNight: DayNightCycle;
  public weather: WeatherSystem;

  public camera: CameraState = {
    x: 120,
    y: 180,
    targetX: 120,
    targetY: 180,
    zoom: 1.0,
    targetZoom: 1.0,
    shakeIntensity: 0,
  };

  // Telemetry for DEV mode
  public fps = 60;
  public frameTime = 16.6;
  private frameCount = 0;
  private fpsTimer = 0;
  private slowWindows = 0;
  private renderScale = 1.5;

  // State callbacks
  public onZoneChange?: (zoneId: ZoneId | null) => void;
  public onInteractTrigger?: (zoneId: ZoneId) => void;
  public onBillboardInteract?: (billboard: Billboard) => void;

  private currentActiveZone: ZoneId | null = null;


  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;

    this.player = new PlayerController(120, 180);
    this.renderer = new ParallaxRenderer();
    this.airships = new AirshipRenderer();
    this.particles = new ParticleSystem();
    this.dayNight = new DayNightCycle();
    this.weather = new WeatherSystem();

    // Automated weather progression callback
    this.weather.onWeatherChanged = (nextWeather) => {
      const dpr = this.getDpr();
      const viewW = (this.canvas.width / dpr) / this.viewZoom;
      const viewH = (this.canvas.height / dpr) / this.viewZoom;
      const camLeft = this.camera.x - viewW * 0.5 - 150;
      const camRight = this.camera.x + viewW * 0.5 + 150;
      const camTop = this.camera.y - viewH * 0.5 - 150;
      const camBottom = this.camera.y + viewH * 0.5 + 150;
      this.particles.seedWeather(
        nextWeather,
        camLeft,
        camRight,
        camTop,
        camBottom,
        this.weather.getWindSpeed()
      );
    };

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  /** Extra zoom-out on narrow screens so phones see as much of the world as a laptop. */
  private fitZoom = 1;

  /** Zoom actually used for rendering: user/photo zoom times the responsive fit. */
  public get viewZoom() {
    return this.camera.zoom * this.fitZoom;
  }

  public setScreenMouse(screenX: number, screenY: number) {
    const hoverX = (screenX - window.innerWidth * 0.5) / this.viewZoom + this.camera.x;
    const hoverY = (screenY - window.innerHeight * 0.5) / this.viewZoom + this.camera.y;
    this.airships.hoveredId = this.airships.hitTest(hoverX, hoverY, performance.now())?.id ?? null;
    this.canvas.style.cursor = this.airships.hoveredId ? 'pointer' : '';

    this.particles.setMousePos(hoverX, hoverY);
  }

  public handleResize = () => {
    // Fit roughly 1000 world units across; never zoom out past 0.6 or in past 1.
    this.fitZoom = Math.min(1, Math.max(0.6, window.innerWidth / 1000));
    const dpr = this.getDpr();
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.ctx.resetTransform?.();
  };

  /** Backing-store scale; drops to 1x on hardware that can't hold 60fps. */
  private getDpr() {
    return Math.min(window.devicePixelRatio || 1, this.renderScale);
  }

  public start() {
    if (this.animFrameId) return;
    this.lastTime = performance.now();
    // Don't let time spent paused count against the FPS monitor.
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }

  public interact() {
    if (this.currentActiveZone) {
      AudioEngine.playSfx('interact');
      this.onInteractTrigger?.(this.currentActiveZone);
    }
  }

  /** Opens the promo of an airship/banner clicked or tapped. Returns true if one was hit. */
  public clickAt(screenX: number, screenY: number): boolean {
    const worldX = (screenX - window.innerWidth * 0.5) / this.viewZoom + this.camera.x;
    const worldY = (screenY - window.innerHeight * 0.5) / this.viewZoom + this.camera.y;
    const hit = this.airships.hitTest(worldX, worldY, performance.now());
    if (!hit) return false;
    AudioEngine.playSfx('interact');
    this.onBillboardInteract?.(hit);
    return true;
  }

  public fastTravelToZone(zoneId: ZoneId) {
    const target = this.renderer.zones.find(z => z.id === zoneId);
    if (target) {
      this.player.teleport(target.x, target.y + 20);
      this.camera.x = target.x;
      this.camera.y = target.y;
      AudioEngine.playSfx('interact');
    }
  }

  private loop = (currentTime: number) => {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Measure FPS & Adaptive Performance Monitor
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimer));
      this.frameTime = +(dt * 1000).toFixed(1);
      
      // Auto-adapt on low-end hardware, only after sustained slowness (not one hitch)
      this.slowWindows = this.fps < 45 && this.fps > 0 ? this.slowWindows + 1 : 0;
      if (this.slowWindows >= 4) {
        this.particles.setLowPerformanceMode(true);
        if (this.renderScale > 1) {
          this.renderScale = 1;
          this.handleResize();
        }
        this.slowWindows = 0;
      }
      
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    this.update(dt, currentTime);
    this.render(currentTime);

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number, _currentTime: number) {
    // 1. Update systems (automated weather progression)
    this.weather.update(dt);
    const windSpeed = this.weather.getWindSpeed();
    const isSnow = this.weather.getWeather() === 'snow';
    const isBreeze = this.weather.getWeather() === 'breeze';
    this.dayNight.update(dt);
    this.renderer.update(dt, windSpeed, isSnow, isBreeze);
    this.airships.update(dt);

    // Is player in water (near Moon Lake: X 2600-3000, Y 150-300)
    const isWater = distance(this.player.state.x, this.player.state.y, 2800, 220) < 170;
    this.player.update(
      dt,
      this.particles,
      isWater,
      this.renderer.snowAccumulation > 0.2,
      this.renderer.sakuraAccumulation > 0.2
    );

    // 2. Continuous environmental emissions
    this.particles.emitChimneySmoke(152, 75); // Home chimney

    const isRaining = this.weather.getWeather() === 'rain';
    if (!isRaining) {
      this.particles.emitCampfireEmbers(350, 535); // Campfire burns bright with embers
    } else {
      this.particles.emitRainSizzleSmoke(350, 535); // Campfire extinguished in rain with wet sizzle steam
    }
    
    // Full-Screen Viewport Bounds in World Coordinates
    const dpr = this.getDpr();
    const viewW = (this.canvas.width / dpr) / this.viewZoom;
    const viewH = (this.canvas.height / dpr) / this.viewZoom;
    const camLeft = this.camera.x - viewW * 0.5 - 150;
    const camRight = this.camera.x + viewW * 0.5 + 150;
    const camTop = this.camera.y - viewH * 0.5 - 150;
    const camBottom = this.camera.y + viewH * 0.5 + 150;

    // Weather specific emissions (Strictly isolated)
    const currentWeather = this.weather.getWeather();
    if (currentWeather === 'breeze') {
      this.particles.emitWindLeaves(camLeft, camRight, camTop, camBottom, windSpeed);
    } else if (currentWeather === 'rain') {
      this.particles.emitRain(camLeft, camRight, camTop, camBottom);
    } else if (currentWeather === 'snow') {
      this.particles.emitSnow(camLeft, camRight, camTop, camBottom, windSpeed);
    }
    // In 'clear' / CALM mode, no weather particles are emitted — ONLY fireflies!

    this.particles.update(dt, windSpeed);

    // 3. Smooth Camera Tracking
    this.camera.targetX = this.player.state.x;
    this.camera.targetY = this.player.state.y - 30;

    const camLag = 6.0;
    this.camera.x = lerp(this.camera.x, this.camera.targetX, clamp(dt * camLag, 0, 1));
    this.camera.y = lerp(this.camera.y, this.camera.targetY, clamp(dt * camLag, 0, 1));

    // 4. Zone Interaction Detection
    let foundZone: ZoneId | null = null;
    for (const z of this.renderer.zones) {
      const d = distance(this.player.state.x, this.player.state.y, z.x, z.y);
      if (d <= z.radius) {
        foundZone = z.id;
        break;
      }
    }

    if (foundZone !== this.currentActiveZone) {
      this.currentActiveZone = foundZone;
      this.player.state.activeZone = foundZone;
      this.onZoneChange?.(foundZone);
    }

  }

  private render(currentTime: number) {
    const dpr = this.getDpr();
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;

    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    const palette = this.dayNight.getPalette();
    const isNight = palette.starAlpha > 0.5;
    const isRaining = this.weather.getWeather() === 'rain';

    // 1. Render Sky, Mountains, and Parallax Clouds
    this.renderer.renderBackground(
      this.ctx,
      this.camera.x,
      this.camera.y,
      width,
      height,
      palette,
      currentTime
    );

    // 2. Camera Transform in World Space
    this.ctx.save();
    this.ctx.translate(width * 0.5, height * 0.5);
    this.ctx.scale(this.viewZoom, this.viewZoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // 2b. Promo airships drifting high above the meadow (behind world structures)
    this.airships.render(this.ctx, palette, currentTime, this.camera.x);

    // 3. World Entities with Viewport Frustum Culling
    this.renderer.renderWorldEntities(
      this.ctx,
      palette,
      currentTime,
      this.currentActiveZone,
      this.weather.getWindSpeed(),
      isRaining,
      this.camera.x
    );

    // 4. Render Dynamic Particles (Ember, Dust, Ripples, Leaves)
    this.particles.render(this.ctx, isNight);

    // 5. Render Player Character
    this.player.render(this.ctx, isNight);

    this.ctx.restore(); // Exit World Transform

    // 6. Fullscreen Atmosphere Lighting Overlay (Day/Sunset/Night ambient tint)
    if (palette.ambientLightAlpha > 0.02) {
      this.ctx.save();
      this.ctx.fillStyle = palette.ambientLight;
      this.ctx.globalAlpha = palette.ambientLightAlpha;
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();
    }

    // 7. Weather Mist / Fog Overlay
    this.weather.renderWeatherEffects(this.ctx, width, height, currentTime);

    this.ctx.restore(); // Exit DPR Transform
  }
}
