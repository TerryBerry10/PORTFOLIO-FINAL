import { PlayerState, ZoneId } from '../types/world';
import { clamp, lerp } from '../utils/math';
import { AudioEngine } from './AudioEngine';
import { ParticleSystem } from './ParticleSystem';

export class PlayerController {
  public state: PlayerState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 210, // Pixels per second
    facing: 'right',
    actionState: 'idle',
    isMoving: false,
    isRunning: false,
    activeZone: null,
    footstepTimer: 0,
  };

  private keys: Record<string, boolean> = {};
  private inputVector = { x: 0, y: 0 };
  private walkCycleTime = 0;

  constructor(startX = 120, startY = 180) {
    this.state.x = startX;
    this.state.y = startY;
  }

  public setInputVector(x: number, y: number, isRunning = false) {
    this.inputVector.x = x;
    this.inputVector.y = y;
    this.state.isRunning = isRunning;
  }

  public handleKeyDown(code: string, shiftKey: boolean) {
    this.keys[code] = true;
    this.state.isRunning = shiftKey;
  }

  public handleKeyUp(code: string, shiftKey: boolean) {
    this.keys[code] = false;
    this.state.isRunning = shiftKey;
  }

  public teleport(x: number, y: number) {
    this.state.x = x;
    this.state.y = y;
    this.state.vx = 0;
    this.state.vy = 0;
  }

  public update(dt: number, particleSystem: ParticleSystem, isWaterZone = false, isSnow = false, isSakura = false) {
    // 1. Calculate keyboard input vector if no touch joystick
    let ix = 0;
    let iy = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) iy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) iy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) ix -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) ix += 1;

    // Merge keyboard and touch input
    if (ix === 0 && iy === 0) {
      ix = this.inputVector.x;
      iy = this.inputVector.y;
    }

    // Normalize diagonal velocity
    const len = Math.hypot(ix, iy);
    if (len > 0.05) {
      ix /= len;
      iy /= len;
      this.state.isMoving = true;

      // Determine facing direction
      if (Math.abs(ix) > Math.abs(iy)) {
        this.state.facing = ix > 0 ? 'right' : 'left';
      } else {
        this.state.facing = iy > 0 ? 'down' : 'up';
      }
    } else {
      this.state.isMoving = false;
    }

    // Target velocity with acceleration
    const moveSpeed = this.state.speed * (this.state.isRunning ? 1.6 : 1.0);
    const targetVx = ix * moveSpeed;
    const targetVy = iy * moveSpeed;

    const accel = this.state.isMoving ? 16 : 12;
    this.state.vx = lerp(this.state.vx, targetVx, clamp(dt * accel, 0, 1));
    this.state.vy = lerp(this.state.vy, targetVy, clamp(dt * accel, 0, 1));

    // Update position
    this.state.x += this.state.vx * dt;
    this.state.y += this.state.vy * dt;

    // Bounds limit (large seamless world: -1200 to +3800 X, -500 to +900 Y)
    this.state.x = clamp(this.state.x, -1100, 3600);
    this.state.y = clamp(this.state.y, -400, 800);

    // Animation state
    if (this.state.isMoving) {
      this.state.actionState = this.state.isRunning ? 'run' : 'walk';
      this.walkCycleTime += dt * (this.state.isRunning ? 14 : 9);

      // Footstep particle & audio triggering
      this.state.footstepTimer += dt * (this.state.isRunning ? 1.5 : 1.0);
      if (this.state.footstepTimer > 0.32) {
        this.state.footstepTimer = 0;
        particleSystem.emitFootstep(this.state.x, this.state.y, isWaterZone, isSnow, isSakura);
        if (isWaterZone) {
          AudioEngine.playSfx('waterStep');
        } else {
          AudioEngine.playSfx('footstep');
        }
      }
    } else {
      this.state.actionState = 'idle';
      this.state.footstepTimer = 0.2; // Ready to step immediately upon start
    }
  }

  public render(ctx: CanvasRenderingContext2D, isNight: boolean) {
    const { x, y, facing, actionState, isRunning } = this.state;

    ctx.save();
    ctx.translate(x, y);

    // Dynamic ground shadow
    ctx.fillStyle = 'rgba(20, 30, 25, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle breathing / walk bobbing
    const bob = actionState !== 'idle' ? Math.sin(this.walkCycleTime) * (isRunning ? 3 : 2) : Math.sin(Date.now() * 0.003) * 1.2;
    const legSwing = actionState !== 'idle' ? Math.sin(this.walkCycleTime) * 6 : 0;

    const flip = facing === 'left' ? -1 : 1;
    ctx.scale(flip, 1);

    // 1. Legs
    ctx.fillStyle = '#2f4f3e'; // Forest dark trousers
    // Left leg
    ctx.fillRect(-6 - legSwing * 0.5, -4 - bob, 4, 10 + legSwing * 0.4);
    // Right leg
    ctx.fillRect(2 + legSwing * 0.5, -4 - bob, 4, 10 - legSwing * 0.4);

    // Boots
    ctx.fillStyle = '#4a3828';
    ctx.fillRect(-7 - legSwing * 0.5, 4 + legSwing * 0.4 - bob, 5, 4);
    ctx.fillRect(1 + legSwing * 0.5, 4 - legSwing * 0.4 - bob, 5, 4);

    // 2. Backpack (drawn behind or to the left)
    ctx.fillStyle = '#8b5a3c'; // Earthy leather backpack
    ctx.beginPath();
    ctx.roundRect(-13, -24 - bob, 8, 14, 3);
    ctx.fill();
    // Backpack strap buckle
    ctx.fillStyle = '#d4a359';
    ctx.fillRect(-11, -18 - bob, 4, 2);

    // 3. Traveler Coat / Body (Warm cream / moss cloak)
    ctx.fillStyle = '#f8f6f0'; // Warm cream tunic
    ctx.beginPath();
    ctx.roundRect(-8, -26 - bob, 16, 20, 4);
    ctx.fill();

    // Cloak over-layer (Warm moss green)
    ctx.fillStyle = '#3d5a45';
    ctx.beginPath();
    ctx.moveTo(-8, -26 - bob);
    ctx.lineTo(8, -26 - bob);
    ctx.lineTo(10, -10 - bob);
    ctx.lineTo(-10, -10 - bob);
    ctx.closePath();
    ctx.fill();

    // 4. Traveler Scarf / Neck Wrap (Rust orange)
    ctx.fillStyle = '#d97757';
    ctx.beginPath();
    ctx.roundRect(-8, -29 - bob, 16, 6, 3);
    ctx.fill();
    // Scarf tail trailing behind in wind
    const scarfWind = Math.sin(Date.now() * 0.006) * 4;
    ctx.beginPath();
    ctx.moveTo(-6, -26 - bob);
    ctx.lineTo(-15, -22 - bob + scarfWind);
    ctx.lineTo(-12, -18 - bob + scarfWind);
    ctx.closePath();
    ctx.fill();

    // 5. Head
    ctx.fillStyle = '#f3d9c4'; // Warm skin tone
    ctx.beginPath();
    ctx.arc(0, -35 - bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair (Warm chestnut / dark brown)
    ctx.fillStyle = '#3a271d';
    ctx.beginPath();
    ctx.arc(0, -37 - bob, 8.5, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-8.5, -37 - bob, 5, 8); // Side tuft

    // Traveler Hat (Straw / Wanderer Cap)
    ctx.fillStyle = '#c7ab78';
    ctx.beginPath();
    ctx.ellipse(0, -39 - bob, 13, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hat crown
    ctx.beginPath();
    ctx.roundRect(-6, -46 - bob, 12, 8, 3);
    ctx.fill();
    // Hat ribbon band
    ctx.fillStyle = '#2f4f3e';
    ctx.fillRect(-6, -40 - bob, 12, 2.5);

    // Cute minimal eye (only visible if facing right/down)
    if (facing !== 'up') {
      ctx.fillStyle = '#272b30';
      ctx.beginPath();
      ctx.arc(3, -35 - bob, 1.3, 0, Math.PI * 2);
      ctx.fill();
      // Eye highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(3.4, -35.5 - bob, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Little lantern at waist at night
    if (isNight) {
      ctx.fillStyle = '#d4a359';
      ctx.beginPath();
      ctx.roundRect(5, -16 - bob, 5, 7, 1);
      ctx.fill();
      // Glow
      ctx.fillStyle = 'rgba(242, 209, 146, 0.35)';
      ctx.beginPath();
      ctx.arc(7.5, -12.5 - bob, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
