import { Billboard, billboards } from '../data/billboards';
import { DayNightPalette } from './DayNightCycle';

const BANNER_W = 150;
const BANNER_H = 46;
const BANNER_SCALE = 2; // cached cloth texture resolution
const STRIPS = 15; // vertical slices used to ripple the banner
const ROPE_GAP = 26; // horizontal distance between the ship's tail and the banner
const SHIP_SCALE = 1.35; // overall size of ship + banner in the world
const WORLD_MIN_X = -1100;
const WORLD_MAX_X = 3600;

interface Airship {
  banner: Billboard;
  x: number;
  dir: 1 | -1;
}

/**
 * Small Ghibli-style airships that drift across the sky towing cloth promo banners.
 * Banner cloth is pre-painted once; each frame slices it into strips to make it ripple.
 */
export class AirshipRenderer {
  private ships: Airship[];
  private clothCache = new Map<string, HTMLCanvasElement>();
  /** Banner currently under the mouse (highlighted with a click hint). */
  public hoveredId: string | null = null;

  constructor() {
    this.ships = billboards.map(b => ({ banner: b, x: b.startX, dir: b.speed >= 0 ? 1 : -1 }));
    this.buildCloth();
    // Repaint once web fonts load so banner titles use the portfolio typefaces.
    document.fonts?.ready.then(() => this.buildCloth());
  }

  public update(dt: number) {
    const span = WORLD_MAX_X - WORLD_MIN_X;
    for (const s of this.ships) {
      s.x += s.banner.speed * dt;
      if (s.x > WORLD_MAX_X) s.x -= span;
      else if (s.x < WORLD_MIN_X) s.x += span;
    }
  }

  /** Airship or banner under a world point (for clicks / taps). */
  public hitTest(wx: number, wy: number, time: number): Billboard | null {
    // Banners win over hulls, and the closest candidate wins when ships overlap.
    let best: Billboard | null = null;
    let bestScore = Infinity;
    for (const s of this.ships) {
      const y = this.shipY(s, time);
      // Undo the ship scale so the checks below work in unscaled ship space.
      const px = s.x + (wx - s.x) / SHIP_SCALE;
      const py = y + (wy - y) / SHIP_SCALE;
      const bannerLeft = s.dir > 0 ? s.x - 78 - ROPE_GAP - BANNER_W : s.x + 78 + ROPE_GAP;
      const onBanner = px >= bannerLeft - 6 && px <= bannerLeft + BANNER_W + 6 && py >= y - 14 && py <= y + BANNER_H + 4;
      const onShip = Math.abs(px - s.x) <= 72 && py >= y - 24 && py <= y + 42;
      if (!onBanner && !onShip) continue;
      const cx = onBanner ? bannerLeft + BANNER_W / 2 : s.x;
      const cy = onBanner ? y + BANNER_H / 2 - 6 : y + 8;
      const score = Math.hypot(px - cx, py - cy) + (onBanner ? 0 : 1000);
      if (score < bestScore) {
        bestScore = score;
        best = s.banner;
      }
    }
    return best;
  }

  public render(ctx: CanvasRenderingContext2D, palette: DayNightPalette, time: number, camX: number) {
    const isNight = palette.starAlpha > 0.5;
    for (const s of this.ships) {
      if (s.x < camX - 1350 || s.x > camX + 1350) continue;
      const y = this.shipY(s, time);
      const hovered = s.banner.id === this.hoveredId;
      ctx.save();
      ctx.translate(s.x, y);
      ctx.scale(SHIP_SCALE, SHIP_SCALE);
      ctx.translate(-s.x, -y);
      this.drawTrail(ctx, s, y, time);
      this.drawBanner(ctx, s, y, time, isNight, hovered);
      this.drawShip(ctx, s, y, time, isNight);
      ctx.restore();
    }
  }

  /** Twinkling stardust left behind the propeller. */
  private drawTrail(ctx: CanvasRenderingContext2D, s: Airship, y: number, time: number) {
    const [accent] = s.banner.colors;
    ctx.fillStyle = accent;
    for (let i = 0; i < 10; i++) {
      const back = 34 + i * 11;
      const tx = s.x - s.dir * (back + 40);
      const ty = y + 34 + Math.sin(time * 0.004 + i * 1.3) * 4;
      ctx.globalAlpha = (1 - i / 10) * (0.45 + 0.35 * Math.sin(time * 0.012 + i * 2.1));
      const r = 1.8 - i * 0.12;
      ctx.fillRect(tx - r, ty - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }

  private shipY(s: Airship, time: number) {
    return s.banner.altitude + Math.sin(time * 0.0009 + s.banner.startX) * 6;
  }

  private drawShip(ctx: CanvasRenderingContext2D, s: Airship, y: number, time: number, isNight: boolean) {
    const [accent] = s.banner.colors;
    ctx.save();
    ctx.translate(s.x, y);
    ctx.scale(s.dir, 1); // nose always points in the direction of travel
    ctx.rotate(Math.sin(time * 0.0011 + s.banner.startX) * 0.025);

    // Tail fins
    ctx.fillStyle = '#7c4a2a';
    ctx.beginPath();
    ctx.moveTo(-58, -6);
    ctx.lineTo(-84, -26);
    ctx.lineTo(-76, -4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-58, 6);
    ctx.lineTo(-84, 24);
    ctx.lineTo(-76, 4);
    ctx.closePath();
    ctx.fill();

    // Envelope
    ctx.fillStyle = isNight ? '#b9a07a' : '#e6d2ac';
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    // Moonlit shading along the belly
    ctx.fillStyle = 'rgba(40, 24, 12, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 7, 64, 13, 0, 0, Math.PI);
    ctx.fill();
    // Accent band & panel seams
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 22, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(14, -24, 10, 48);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(92, 60, 36, 0.45)';
    ctx.lineWidth = 1;
    for (let sx = -48; sx <= 48; sx += 16) {
      ctx.beginPath();
      ctx.moveTo(sx, -24);
      ctx.quadraticCurveTo(sx + 4, 0, sx, 24);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#5c3a22';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, 68, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Highlight
    ctx.strokeStyle = 'rgba(255, 248, 230, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(4, -6, 50, 12, 0, Math.PI * 1.1, Math.PI * 1.75);
    ctx.stroke();

    // Rigging & gondola
    ctx.strokeStyle = '#3a271d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-16, 18);
    ctx.lineTo(-12, 30);
    ctx.moveTo(16, 18);
    ctx.lineTo(12, 30);
    ctx.stroke();
    ctx.fillStyle = '#5c3a22';
    ctx.beginPath();
    ctx.roundRect(-20, 29, 40, 12, 4);
    ctx.fill();
    ctx.fillStyle = isNight ? '#fde68a' : '#f5e6c8';
    for (const wx of [-12, -2, 8]) ctx.fillRect(wx, 32, 6, 5);
    if (isNight) {
      ctx.fillStyle = 'rgba(253, 230, 138, 0.18)';
      ctx.beginPath();
      ctx.ellipse(0, 36, 34, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spinning propeller at the rear of the gondola
    const blade = Math.abs(Math.sin(time * 0.03)) * 11 + 1;
    ctx.fillStyle = '#2a1c14';
    ctx.fillRect(-26, 33, 6, 3);
    ctx.fillStyle = 'rgba(60, 40, 28, 0.85)';
    ctx.beginPath();
    ctx.ellipse(-28, 34.5, 2, blade, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose lamp
    ctx.fillStyle = isNight ? '#fbbf24' : '#b45309';
    ctx.beginPath();
    ctx.arc(66, 2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawBanner(ctx: CanvasRenderingContext2D, s: Airship, y: number, time: number, isNight: boolean, hovered: boolean) {
    const cloth = this.clothCache.get(s.banner.id);
    if (!cloth) return;

    const tailX = s.x - s.dir * 78;
    const tailY = y + 4;
    const left = s.dir > 0 ? tailX - ROPE_GAP - BANNER_W : tailX + ROPE_GAP;
    const top = y - 6;
    const stripW = BANNER_W / STRIPS;
    const srcW = cloth.width / STRIPS;

    // Ripple offset for a strip, growing toward the free (trailing) end
    const waveAt = (i: number) => {
      const fromShip = s.dir > 0 ? (STRIPS - i) / STRIPS : i / STRIPS;
      return Math.sin(time * 0.005 - fromShip * 5 + s.banner.startX) * 5 * fromShip;
    };

    // Tow ropes to the banner's leading edge
    const leadI = s.dir > 0 ? STRIPS - 1 : 0;
    const leadX = s.dir > 0 ? left + BANNER_W : left;
    const leadWave = waveAt(leadI);
    ctx.strokeStyle = 'rgba(58, 39, 29, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo((tailX + leadX) / 2, tailY + 10, leadX, top + leadWave);
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo((tailX + leadX) / 2, tailY + 22, leadX, top + BANNER_H + leadWave);
    ctx.stroke();

    // Warm lantern halo behind the cloth so it reads against the night sky
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.003 + s.banner.startX);
    const haloA = (isNight ? 0.22 : 0.12) + pulse * 0.08 + (hovered ? 0.2 : 0);
    const cx = left + BANNER_W / 2;
    const cy = top + BANNER_H / 2;
    const haloR = BANNER_W * 0.78;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.62);
    const halo = ctx.createRadialGradient(0, 0, BANNER_H * 0.3, 0, 0, haloR);
    halo.addColorStop(0, `rgba(253, 214, 120, ${haloA})`);
    halo.addColorStop(1, 'rgba(253, 214, 120, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, haloR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cloth strips with soft shading on the folds
    for (let i = 0; i < STRIPS; i++) {
      const off = waveAt(i);
      const slope = waveAt(Math.min(STRIPS - 1, i + 1)) - off;
      const dx = left + i * stripW;
      ctx.drawImage(cloth, i * srcW, 0, srcW, cloth.height, dx, top + off, stripW + 0.6, BANNER_H);
      if (slope > 0.4) {
        ctx.fillStyle = `rgba(30, 18, 10, ${Math.min(0.22, slope * 0.06)})`;
        ctx.fillRect(dx, top + off, stripW + 0.6, BANNER_H);
      }
    }

    // Fairy lights strung along the top hem
    for (let i = 0; i <= STRIPS; i += 1) {
      const lx = left + i * stripW;
      const ly = top + waveAt(Math.min(STRIPS - 1, i)) - 1;
      const twinkle = 0.55 + 0.45 * Math.sin(time * 0.008 + i * 1.7 + s.banner.startX);
      ctx.fillStyle = `rgba(253, 230, 138, ${0.25 * twinkle})`;
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = i % 3 === 0 ? s.banner.colors[0] : '#fde68a';
      ctx.globalAlpha = 0.6 + 0.4 * twinkle;
      ctx.beginPath();
      ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Hover: gold outline + click hint above the banner
    if (hovered) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(left - 2, top - 3, BANNER_W + 4, BANNER_H + 6);
      const label = s.banner.kind === 'released' ? '▶ CLICK TO PLAY' : '✦ SNEAK PEEK';
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      const lw = ctx.measureText(label).width + 14;
      const lx = left + BANNER_W / 2 - lw / 2;
      const ly = top + BANNER_H + 8;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(lx, ly, lw, 15, 7.5);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx + lw / 2, ly + 8);
    }
  }

  private buildCloth() {
    for (const b of billboards) {
      const canvas = document.createElement('canvas');
      canvas.width = BANNER_W * BANNER_SCALE;
      canvas.height = BANNER_H * BANNER_SCALE;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      ctx.scale(BANNER_SCALE, BANNER_SCALE);
      this.paintCloth(ctx, b);
      this.clothCache.set(b.id, canvas);
    }
  }

  /** Hand-painted cream cloth: ink title, accent swash, stitched hem and a play/soon tag. */
  private paintCloth(ctx: CanvasRenderingContext2D, b: Billboard) {
    const w = BANNER_W;
    const h = BANNER_H;
    const [accent, deep] = b.colors;
    const isReleased = b.kind === 'released';

    ctx.fillStyle = '#f3e6cc';
    ctx.fillRect(0, 0, w, h);

    // Weave texture
    ctx.fillStyle = 'rgba(120, 90, 60, 0.07)';
    for (let yy = 1; yy < h; yy += 3) ctx.fillRect(0, yy, w, 1);

    // Brush swash in the game's accent color
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(4, h - 13);
    ctx.quadraticCurveTo(w * 0.4, h - 21, w * 0.68, h - 12);
    ctx.lineTo(w * 0.66, h - 8);
    ctx.quadraticCurveTo(w * 0.4, h - 15, 4, h - 8);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Ink title & tagline
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = deep;
    ctx.font = '700 17px "Playfair Display", Georgia, serif';
    ctx.fillText(b.title, 9, 22, w - 50);
    ctx.fillStyle = 'rgba(40, 28, 20, 0.8)';
    ctx.font = '600 6.5px "JetBrains Mono", monospace';
    ctx.fillText(b.tagline.toUpperCase(), 9, 32, w - 50);

    // Tag: play for released games, a wax-seal style "soon" for upcoming ones
    const tagX = w - 26;
    const tagY = h / 2 - 2;
    ctx.fillStyle = isReleased ? '#b45309' : '#9f1239';
    ctx.beginPath();
    ctx.arc(tagX, tagY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff7e6';
    if (isReleased) {
      ctx.beginPath();
      ctx.moveTo(tagX - 4, tagY - 6);
      ctx.lineTo(tagX + 6, tagY);
      ctx.lineTo(tagX - 4, tagY + 6);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.font = 'bold 6px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SOON', tagX, tagY);
    }

    // Stitched hem
    ctx.strokeStyle = 'rgba(92, 60, 36, 0.55)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 2]);
    ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
    ctx.setLineDash([]);
  }
}
