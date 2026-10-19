import { Billboard, billboards } from '../data/billboards';
import { DayNightPalette } from './DayNightCycle';

const POSTER_W = 176;
const POSTER_H = 104;
const POST_H = 62;
const POSTER_SCALE = 2; // poster cache resolution multiplier
const INTERACT_RADIUS = 95;

/**
 * Wooden notice-board billboards that advertise released and upcoming games.
 * Posters are pre-rendered once to offscreen canvases, so each frame is a single drawImage per board.
 */
export class BillboardRenderer {
  public readonly boards: Billboard[] = billboards;
  private posterCache = new Map<string, HTMLCanvasElement>();

  constructor() {
    this.buildPosters();
    // Re-render once web fonts are ready so poster titles use the portfolio typefaces.
    document.fonts?.ready.then(() => this.buildPosters());
  }

  /** Nearest billboard within interaction range of a world point. */
  public findNear(x: number, y: number): Billboard | null {
    let best: Billboard | null = null;
    let bestDist = INTERACT_RADIUS;
    for (const b of this.boards) {
      const d = Math.hypot(b.x - x, b.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    return best;
  }

  /** Billboard whose poster/frame contains a world point (for mouse clicks). */
  public hitTest(x: number, y: number): Billboard | null {
    for (const b of this.boards) {
      const left = b.x - POSTER_W / 2 - 10;
      const top = b.y - POST_H - POSTER_H - 24;
      if (x >= left && x <= left + POSTER_W + 20 && y >= top && y <= b.y) return b;
    }
    return null;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    palette: DayNightPalette,
    time: number,
    camX: number,
    activeId: string | null,
    snow: number
  ) {
    const isNight = palette.starAlpha > 0.5;
    for (const b of this.boards) {
      if (b.x < camX - 1150 || b.x > camX + 1150) continue;
      this.drawBoard(ctx, b, time, isNight, b.id === activeId, snow);
    }
  }

  private drawBoard(
    ctx: CanvasRenderingContext2D,
    b: Billboard,
    time: number,
    isNight: boolean,
    isActive: boolean,
    snow: number
  ) {
    const posterTop = -POST_H - POSTER_H;
    const halfW = POSTER_W / 2;

    ctx.save();
    ctx.translate(b.x, b.y);

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 2, halfW * 0.8, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lantern glow on the ground at night
    if (isNight) {
      const flicker = 0.85 + Math.sin(time * 0.009 + b.x) * 0.08;
      ctx.globalAlpha = 0.22 * flicker;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(0, 0, halfW + 30, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Posts
    ctx.fillStyle = '#3a271d';
    ctx.fillRect(-halfW + 14, posterTop, 9, POSTER_H + POST_H);
    ctx.fillRect(halfW - 23, posterTop, 9, POSTER_H + POST_H);
    ctx.fillStyle = '#4a3326';
    ctx.fillRect(-halfW + 14, posterTop, 3, POSTER_H + POST_H);
    ctx.fillRect(halfW - 23, posterTop, 3, POSTER_H + POST_H);

    // Wooden frame
    ctx.fillStyle = '#5c4d3c';
    ctx.beginPath();
    ctx.roundRect(-halfW - 8, posterTop - 8, POSTER_W + 16, POSTER_H + 16, 5);
    ctx.fill();
    ctx.strokeStyle = '#2a1c14';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Poster
    const poster = this.posterCache.get(b.id);
    if (poster) ctx.drawImage(poster, -halfW, posterTop, POSTER_W, POSTER_H);

    // Active highlight
    if (isActive) {
      ctx.strokeStyle = `rgba(250, 204, 21, ${0.65 + Math.sin(time * 0.006) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-halfW - 10, posterTop - 10, POSTER_W + 20, POSTER_H + 20, 7);
      ctx.stroke();
    }

    // Shingle roof
    const roofY = posterTop - 8;
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(-halfW - 20, roofY);
    ctx.lineTo(-halfW + 2, roofY - 20);
    ctx.lineTo(halfW - 2, roofY - 20);
    ctx.lineTo(halfW + 20, roofY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 1.5;
    for (let sx = -halfW - 6; sx < halfW + 10; sx += 14) {
      ctx.beginPath();
      ctx.moveTo(sx, roofY);
      ctx.lineTo(sx + 6, roofY - 19);
      ctx.stroke();
    }

    // Snow cap
    if (snow > 0.02) {
      ctx.globalAlpha = snow * 0.95;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-halfW - 2, roofY - 25, POSTER_W + 4, 8, 4);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Hanging lantern
    const swing = Math.sin(time * 0.0025 + b.x * 0.01) * 0.12;
    ctx.save();
    ctx.translate(halfW + 12, roofY + 2);
    ctx.rotate(swing);
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 12);
    ctx.stroke();
    if (isNight) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 20, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = isNight ? '#fcd34d' : '#d97706';
    ctx.beginPath();
    ctx.roundRect(-5, 12, 10, 14, 3);
    ctx.fill();
    ctx.fillStyle = '#292524';
    ctx.fillRect(-6, 11, 12, 2);
    ctx.fillRect(-6, 25, 12, 2);
    ctx.restore();

    ctx.restore();

    if (isActive) {
      this.drawPrompt(ctx, b.x, b.y + posterTop - 58 + Math.sin(time * 0.005) * 4,
        b.kind === 'released' ? `Play ${b.title}` : 'View Upcoming');
    }
  }

  /** Same [E] badge style as the zone prompts. */
  private drawPrompt(ctx: CanvasRenderingContext2D, x: number, y: number, label: string) {
    ctx.save();
    ctx.translate(x, y);
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const badgeW = ctx.measureText(label).width + 50;
    const badgeH = 26;
    const bx = -badgeW / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.beginPath();
    ctx.roundRect(bx, 0, badgeW, badgeH, 13);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-5, badgeH);
    ctx.lineTo(0, badgeH + 5);
    ctx.lineTo(5, badgeH);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(bx + 4, 4, 18, 18, 4);
    ctx.fill();

    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('E', bx + 13, 13);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, bx + 27, 13);

    ctx.fillStyle = '#facc15';
    ctx.fillText('✦', bx + badgeW - 14, 13);
    ctx.restore();
  }

  private buildPosters() {
    for (const b of this.boards) {
      const canvas = document.createElement('canvas');
      canvas.width = POSTER_W * POSTER_SCALE;
      canvas.height = POSTER_H * POSTER_SCALE;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      ctx.scale(POSTER_SCALE, POSTER_SCALE);
      this.paintPoster(ctx, b);
      this.posterCache.set(b.id, canvas);
    }
  }

  private paintPoster(ctx: CanvasRenderingContext2D, b: Billboard) {
    const w = POSTER_W;
    const h = POSTER_H;
    const [top, bottom] = b.colors;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, bottom);
    bg.addColorStop(1, '#05080f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    this.paintMotif(ctx, b.motif, top, w, h);

    // Readability fade behind the text
    const fade = ctx.createLinearGradient(0, h * 0.35, 0, h);
    fade.addColorStop(0, 'rgba(0,0,0,0)');
    fade.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);

    // Title & tagline
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff7e6';
    ctx.font = '700 21px "Playfair Display", Georgia, serif';
    ctx.fillText(b.title, 10, h - 26, w - 20);
    ctx.fillStyle = top;
    ctx.font = '600 8.5px "JetBrains Mono", monospace';
    ctx.fillText(b.tagline.toUpperCase(), 10, h - 12, w - 20);

    // Ribbon
    const isReleased = b.kind === 'released';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    const rw = ctx.measureText(b.ribbon).width + 12;
    ctx.fillStyle = isReleased ? '#facc15' : '#fb7185';
    ctx.beginPath();
    ctx.roundRect(w - rw - 6, 6, rw, 13, 6.5);
    ctx.fill();
    ctx.fillStyle = '#0b0b0b';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.ribbon, w - rw, 13);

    // Paper grain & worn edge
    ctx.fillStyle = 'rgba(255, 245, 220, 0.04)';
    for (let i = 0; i < 140; i++) {
      ctx.fillRect((i * 37) % w, (i * 53) % h, 1, 1);
    }
    ctx.strokeStyle = 'rgba(255, 240, 210, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(3.5, 3.5, w - 7, h - 7);
  }

  private paintMotif(ctx: CanvasRenderingContext2D, motif: Billboard['motif'], accent: string, w: number, h: number) {
    ctx.save();
    ctx.fillStyle = accent;
    ctx.strokeStyle = accent;
    switch (motif) {
      case 'moon': {
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(w * 0.72, h * 0.36, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(w * 0.72, h * 0.36, 28, 0, Math.PI * 2);
        ctx.fill();
        this.paintHills(ctx, w, h, '#0b0f1a');
        break;
      }
      case 'mountains': {
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.75);
        ctx.lineTo(w * 0.28, h * 0.25);
        ctx.lineTo(w * 0.45, h * 0.5);
        ctx.lineTo(w * 0.66, h * 0.18);
        ctx.lineTo(w, h * 0.7);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(w * 0.66, h * 0.18);
        ctx.lineTo(w * 0.6, h * 0.28);
        ctx.lineTo(w * 0.72, h * 0.27);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'waves': {
        ctx.lineWidth = 2.5;
        for (let row = 0; row < 4; row++) {
          ctx.globalAlpha = 0.25 + row * 0.18;
          ctx.beginPath();
          const y0 = h * 0.28 + row * 12;
          for (let x = 0; x <= w; x += 4) {
            const y = y0 + Math.sin(x * 0.08 + row) * 4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        break;
      }
      case 'stars': {
        for (let i = 0; i < 26; i++) {
          ctx.globalAlpha = 0.3 + ((i * 7) % 10) / 14;
          const sx = (i * 47) % w;
          const sy = (i * 29) % (h * 0.6);
          ctx.fillRect(sx, sy, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
        }
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.15, h * 0.62);
        ctx.quadraticCurveTo(w * 0.5, h * 0.2, w * 0.9, h * 0.3);
        ctx.stroke();
        break;
      }
      case 'spark': {
        ctx.translate(w * 0.7, h * 0.36);
        for (let i = 0; i < 8; i++) {
          ctx.globalAlpha = i % 2 ? 0.45 : 0.9;
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(0, -4);
          ctx.lineTo(i % 2 ? 22 : 34, 0);
          ctx.lineTo(0, 4);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
    }
    ctx.restore();
  }

  private paintHills(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h * 0.62);
    ctx.quadraticCurveTo(w * 0.3, h * 0.42, w * 0.55, h * 0.6);
    ctx.quadraticCurveTo(w * 0.8, h * 0.48, w, h * 0.58);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }
}
