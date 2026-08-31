import React, { useEffect, useRef } from 'react';

interface ProjectThumbnailCanvasProps {
  type: string;
  className?: string;
}

export const ProjectThumbnailCanvas: React.FC<ProjectThumbnailCanvasProps> = ({ type, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = Math.random() * 100;
    let mousePos = { x: canvas.width / 2, y: canvas.height / 2, isHovered: false };

    // Ambient particles for Ghibli aesthetic
    const ambientMotes = Array.from({ length: 18 }, () => ({
      x: Math.random() * 280,
      y: Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.3,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
      color: Math.random() > 0.5 ? '#f2d192' : '#a8d5ba',
    }));

    // Galaxy spirit stars
    const spiritStars = Array.from({ length: 55 }, (_, i) => ({
      angle: (i / 55) * Math.PI * 4,
      radius: 8 + (i / 55) * 58,
      speed: 0.015 + (1 - i / 55) * 0.02,
      color: i % 3 === 0 ? '#e5b76b' : i % 3 === 1 ? '#a8d5ba' : '#f5bca8',
      size: 1.5 + (i % 3) * 0.8,
    }));

    // Wooden physics blocks
    const woodenBlocks = [
      { x: 35, y: 35, w: 14, h: 50, color: '#8b5a3c', grain: '#6e442a' },
      { x: 35, y: 70, w: 14, h: 15, color: '#d4a359', grain: '#b8863b' },
      { x: 110, y: 75, w: 14, h: 14, color: '#c7ab78', grain: '#a88f5d' },
      { x: 124, y: 75, w: 14, h: 14, color: '#c7ab78', grain: '#a88f5d' },
      { x: 138, y: 75, w: 14, h: 14, color: '#c7ab78', grain: '#a88f5d' },
      { x: 117, y: 61, w: 14, h: 14, color: '#d4a359', grain: '#b8863b' },
      { x: 131, y: 61, w: 14, h: 14, color: '#d4a359', grain: '#b8863b' },
      { x: 124, y: 47, w: 14, h: 14, color: '#4c785d', grain: '#3d5a45' },
      { x: 175, y: 75, w: 14, h: 14, color: '#6b9ac4', grain: '#5282ad' },
      { x: 189, y: 75, w: 14, h: 14, color: '#6b9ac4', grain: '#5282ad' },
      { x: 203, y: 75, w: 14, h: 14, color: '#6b9ac4', grain: '#5282ad' },
      { x: 182, y: 61, w: 14, h: 14, color: '#6b9ac4', grain: '#5282ad' },
      { x: 196, y: 61, w: 14, h: 14, color: '#6b9ac4', grain: '#5282ad' },
      { x: 189, y: 47, w: 14, h: 14, color: '#e07a5f', grain: '#c25e3c' },
    ];

    const inkSpirits = [
      { x: 70, color: '#d97757', glow: 'rgba(217, 119, 87, 0.45)', name: 'Ember' },
      { x: 140, color: '#4c785d', glow: 'rgba(76, 120, 93, 0.45)', name: 'Moss' },
      { x: 210, color: '#6b9ac4', glow: 'rgba(107, 154, 196, 0.45)', name: 'Stream' },
    ];

    const handleMouseEnter = () => { mousePos.isHovered = true; };
    const handleMouseLeave = () => { mousePos.isHovered = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep Ghibli night forest background
      ctx.fillStyle = '#0f1713';
      ctx.fillRect(0, 0, w, h);

      if (type === 'dottie' || type.includes('dottie')) {
        // Flagship: Dottie - 1 v 1 Anime Style Battle & Rage Clashes
        // Dark anime arena background with energy sparks
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#150a18');
        bgGrad.addColorStop(0.5, '#0e0b16');
        bgGrad.addColorStop(1, '#050308');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Anime speedlines / energy particles
        for (let i = 0; i < 15; i++) {
          const lx = (i * 22 + time * 65) % (w + 40) - 20;
          const ly = (i * 9 + (i % 2 === 0 ? 15 : 75)) % h;
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(244, 114, 182, 0.35)' : 'rgba(250, 204, 21, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + 25, ly);
          ctx.stroke();
        }

        // Combat Arena Floor
        ctx.strokeStyle = 'rgba(217, 119, 87, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(15, h * 0.78);
        ctx.lineTo(w - 15, h * 0.78);
        ctx.stroke();

        // 1 v 1 Combatants Clash Simulation
        const clashCycle = (time * (mousePos.isHovered ? 4.5 : 2.5)) % (Math.PI * 2);
        const clashOffset = Math.sin(clashCycle) * 35;
        const p1X = w * 0.35 + clashOffset * 0.4;
        const p2X = w * 0.65 - clashOffset * 0.4;
        const battleY = h * 0.78 - 14;

        // Fighter 1 (Golden Rage Dottie)
        ctx.save();
        ctx.translate(p1X, battleY);
        // Golden Aura Flare
        ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.sin(time * 12) * 2, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        // Anime Fierce Eyes
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(3, -2, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Fighter 2 (Crimson Shadow Rival)
        ctx.save();
        ctx.translate(p2X, battleY);
        // Crimson Rage Aura
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.cos(time * 12) * 2, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        // Rival Fierce Eye
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(-3, -2, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Anime Clash Spark Burst in Center
        const clashDist = Math.abs(p2X - p1X);
        if (clashDist < 45) {
          const midClashX = (p1X + p2X) * 0.5;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(midClashX, battleY, 7, 0, Math.PI * 2);
          ctx.fill();
          // Slash spark lines
          for (let s = 0; s < 6; s++) {
            const angle = (s * Math.PI) / 3 + time * 8;
            ctx.strokeStyle = s % 2 === 0 ? '#facc15' : '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(midClashX, battleY);
            ctx.lineTo(midClashX + Math.cos(angle) * 22, battleY + Math.sin(angle) * 22);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      } else if (type === 'bait' || type.includes('bait')) {
        // Flagship: Bait - Survival Platformer: You are the bait trying to save your life!
        // Dark perilous dungeon gradient
        const abyssGrad = ctx.createLinearGradient(0, 0, 0, h);
        abyssGrad.addColorStop(0, '#0c1511');
        abyssGrad.addColorStop(0.5, '#070e0b');
        abyssGrad.addColorStop(1, '#020504');
        ctx.fillStyle = abyssGrad;
        ctx.fillRect(0, 0, w, h);

        // Perilous stepping platforms
        const baitPlatforms = [
          { x: 20, y: h * 0.78, w: 55 },
          { x: 95, y: h * 0.65, w: 50 },
          { x: 165, y: h * 0.52, w: 50 },
          { x: 235, y: h * 0.72, w: 50 }
        ];

        baitPlatforms.forEach(bp => {
          ctx.fillStyle = '#1c2e24';
          ctx.beginPath();
          ctx.roundRect(bp.x, bp.y, bp.w, 7, 3);
          ctx.fill();
          ctx.strokeStyle = '#4c785d';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });

        // Danger Hazard Spikes below
        for (let x = 0; x < w; x += 14) {
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(x, h);
          ctx.lineTo(x + 7, h - 12);
          ctx.lineTo(x + 14, h);
          ctx.closePath();
          ctx.fill();
        }

        // Bait Character (Cute glowing hero leaping for survival)
        const pCycle = (time * (mousePos.isHovered ? 3.2 : 2.0)) % 4;
        const currentPlat = baitPlatforms[Math.floor(pCycle) % baitPlatforms.length];
        const nextPlat = baitPlatforms[(Math.floor(pCycle) + 1) % baitPlatforms.length];
        const subT = pCycle % 1;
        const charX = currentPlat.x + (nextPlat.x - currentPlat.x) * subT + 20;
        const charY = currentPlat.y + (nextPlat.y - currentPlat.y) * subT - Math.sin(subT * Math.PI) * 28 - 8;

        // Draw Player Bait Character
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(charX, charY, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Scared cute survival eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(charX + 2, charY - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Pursuing Shadow Monster reaching out from left
        const monsterX = charX - 55;
        const monsterY = charY + 12;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(monsterX, monsterY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Monster Glowing Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(monsterX + 8, monsterY - 4, 2.5, 0, Math.PI * 2);
        ctx.arc(monsterX + 8, monsterY + 4, 2.5, 0, Math.PI * 2);
      } else if (type === 'astral-rally' || type.includes('rally') || type.includes('astral')) {
        // Flagship: Astral Rally - Celestial Arcade Drift & Hovercraft Kinetics
        // Cosmic space track background
        const spaceGrad = ctx.createLinearGradient(0, 0, 0, h);
        spaceGrad.addColorStop(0, '#0a0d1a');
        spaceGrad.addColorStop(0.5, '#121226');
        spaceGrad.addColorStop(1, '#080814');
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, w, h);

        // Distant space stars
        for (let i = 0; i < 20; i++) {
          const sx = (i * 19 + time * 12) % w;
          const sy = (i * 11) % h;
          ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#f472b6' : '#f2d192';
          ctx.beginPath();
          ctx.arc(sx, sy, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        // Curved Floating Neon Cosmic Track
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 42;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.75);
        ctx.bezierCurveTo(w * 0.35, h * 0.25, w * 0.65, h * 0.95, w, h * 0.35);
        ctx.stroke();

        // Neon Track Glowing Borders (Cyan & Gold)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.75 - 20);
        ctx.bezierCurveTo(w * 0.35, h * 0.25 - 20, w * 0.65, h * 0.95 - 20, w, h * 0.35 - 20);
        ctx.stroke();

        ctx.strokeStyle = '#e5b76b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.75 + 20);
        ctx.bezierCurveTo(w * 0.35, h * 0.25 + 20, w * 0.65, h * 0.95 + 20, w, h * 0.35 + 20);
        ctx.stroke();

        // Neon Chevron Boost Pad on Track
        const boostX = w * 0.45;
        const boostY = h * 0.55;
        ctx.fillStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(boostX - 8, boostY + 8);
        ctx.lineTo(boostX + 4, boostY);
        ctx.lineTo(boostX - 8, boostY - 8);
        ctx.lineTo(boostX - 4, boostY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Vehicle Position (Tracks mouse or loops smoothly along drift arc)
        const carT = (time * (mousePos.isHovered ? 1.6 : 0.8)) % 1;
        const driftAngle = Math.sin(time * 3) * 0.45;
        const carX = mousePos.isHovered ? mousePos.x : 40 + carT * (w - 80);
        const carY = mousePos.isHovered ? Math.min(Math.max(mousePos.y, 35), 105) : h * 0.55 + Math.sin(time * 3) * 22;

        // Dual Neon Thruster Plasma Trails
        for (let i = 1; i <= 6; i++) {
          const trailAlpha = 0.6 - i * 0.09;
          ctx.fillStyle = `rgba(56, 189, 248, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(carX - i * 5, carY - 4 - driftAngle * 4, 3.5 - i * 0.4, 0, Math.PI * 2);
          ctx.arc(carX - i * 5, carY + 4 - driftAngle * 4, 3.5 - i * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drift Spark Particles
        if (mousePos.isHovered || Math.abs(driftAngle) > 0.2) {
          for (let i = 0; i < 4; i++) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(carX - 12 + (Math.random() - 0.5) * 8, carY + 6 + (Math.random() - 0.5) * 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw Sleek Hovercraft Vehicle
        ctx.save();
        ctx.translate(carX, carY);
        ctx.rotate(driftAngle + 0.1);

        // Vehicle Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hovercraft Chassis (Sharp aerodynamic wedge)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(-12, -9);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-12, 9);
        ctx.closePath();
        ctx.fill();

        // Neon Trim Accents (Cyan body stripes)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Cockpit Canopy (Glowing cyan/magenta glass)
        ctx.fillStyle = '#f472b6';
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(2, 0, 7, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Front Headlight Beam
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(45, -15);
        ctx.lineTo(45, 15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.restore();
      } else if (type === 'ocean-tank' || type.includes('ocean')) {
        // 1. Ocean Tank: Ghibli Sunlit Water Basin
        // Warm twilight sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.42);
        skyGrad.addColorStop(0, '#2d2438');
        skyGrad.addColorStop(1, '#634b5c');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Golden Ghibli sun/moon
        ctx.fillStyle = '#fce7ac';
        ctx.shadowColor = '#fce7ac';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(w * 0.82, h * 0.22, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Clear water body
        const waterY = h * 0.4;
        const waterGrad = ctx.createLinearGradient(0, waterY, 0, h);
        waterGrad.addColorStop(0, '#2a6f7d');
        waterGrad.addColorStop(0.6, '#1a4f5c');
        waterGrad.addColorStop(1, '#0e2b33');
        ctx.fillStyle = waterGrad;

        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, waterY);
        for (let x = 0; x <= w; x += 8) {
          const wave = Math.sin(time * 2 + x * 0.06) * 3.5;
          ctx.lineTo(x, waterY + wave);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Water surface foam edge
        ctx.strokeStyle = '#a5d8d8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, waterY);
        for (let x = 0; x <= w; x += 8) {
          const wave = Math.sin(time * 2 + x * 0.06) * 3.5;
          ctx.lineTo(x, waterY + wave);
        }
        ctx.stroke();

        // Riverbed sand & pebbles
        ctx.fillStyle = '#4a3b2c';
        ctx.fillRect(0, h - 14, w, 14);

        // Lush freshwater reeds / kelp swaying
        for (let i = 0; i < 9; i++) {
          const sx = 20 + i * 29;
          ctx.strokeStyle = i % 2 === 0 ? '#4c785d' : '#3d5a45';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(sx, h - 14);
          for (let y = h - 14; y > waterY + 8; y -= 10) {
            const sway = Math.sin(time * 1.6 + sx * 0.08 + y * 0.05) * 8;
            ctx.lineTo(sx + sway, y);
          }
          ctx.stroke();
        }

        // Interactive golden koi ripple ring
        const rippleX = mousePos.isHovered ? mousePos.x : w * 0.35;
        const rippleY = mousePos.isHovered ? mousePos.y : h * 0.65;
        const ripplePulse = (time * 18) % 24;
        ctx.strokeStyle = '#e5b76b';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(rippleX, rippleY, 8 + ripplePulse, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'physics-sandbox' || type.includes('sandbox')) {
        // 2. Physics Sandbox: Artisan Wood & Craft Stacking Table
        // Workshop workbench grid
        ctx.strokeStyle = '#1b2a22';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 16) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 16) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Timber workbench floor
        ctx.fillStyle = '#3a2a1d';
        ctx.fillRect(15, h - 16, w - 30, 16);
        ctx.fillStyle = '#5c432e';
        ctx.fillRect(15, h - 16, w - 30, 3);

        // Render stacked wooden craft blocks
        woodenBlocks.forEach((b, idx) => {
          const hoverLift = mousePos.isHovered && idx === 1 ? Math.sin(time * 4) * 6 : 0;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(b.x, b.y + hoverLift, b.w, b.h, 2);
          ctx.fill();
          ctx.strokeStyle = b.grain;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });
      } else if (type === 'particle-galaxy' || type.includes('galaxy') || type.includes('chronovoid')) {
        // 3. Starlight Well / Celestial Spirit Galaxy
        const cx = w * 0.5;
        const cy = h * 0.5;

        // Warm celestial core
        ctx.fillStyle = '#f2d192';
        ctx.shadowColor = '#f2d192';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Swirling starlight spirit streams
        spiritStars.forEach(s => {
          s.angle += s.speed;
          const sx = cx + Math.cos(s.angle) * s.radius;
          const sy = cy + Math.sin(s.angle) * s.radius * 0.65;

          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'kaleidoscope' || type.includes('kaleido')) {
        // 4. Kaleidoscope: Spirit Sunbeam Mandala
        const cx = w * 0.5;
        const cy = h * 0.5;
        const rayCount = 14;

        ctx.fillStyle = '#fdf6e7';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < rayCount; i++) {
          const ang = (i / rayCount) * Math.PI * 2 + time * 0.35;
          const len = 44 + Math.sin(time * 2.5 + i) * 10;
          const ex = cx + Math.cos(ang) * len;
          const ey = cy + Math.sin(ang) * len;

          ctx.strokeStyle = i % 2 === 0 ? '#d4a359' : '#4c785d';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Petal orb
          ctx.fillStyle = i % 2 === 0 ? '#f2d192' : '#a8d5ba';
          ctx.beginPath();
          ctx.arc(ex, ey, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'inkwell' || type.includes('ink')) {
        // 5. Inkwell: Bioluminescent Sumi-e Spirit Drops
        inkSpirits.forEach((spirit, i) => {
          const dropY = h * 0.62 + Math.sin(time * 2 + i * 1.4) * 6;

          // Trailing watercolor tendril
          ctx.strokeStyle = spirit.color;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(spirit.x, dropY);
          for (let y = dropY; y > 15; y -= 10) {
            const sway = Math.sin(time * 2.8 + y * 0.08 + i) * 7;
            ctx.lineTo(spirit.x + sway, y);
          }
          ctx.stroke();

          // Glowing watercolor droplet
          ctx.fillStyle = spirit.color;
          ctx.shadowColor = spirit.color;
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(spirit.x, dropY, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner highlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(spirit.x - 3, dropY - 3, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'sanctum' || type.includes('sanctum')) {
        // 6. Sanctum: Forest Shrine with Sunbeams (Komorebi)
        const cx = w * 0.5;
        const cy = 30;

        // Wooden Torii / Shrine Gateway
        ctx.fillStyle = '#a34727'; // Japanese vermillion
        ctx.fillRect(cx - 30, cy - 10, 60, 6);
        ctx.fillRect(cx - 24, cy - 4, 48, 4);
        ctx.fillRect(cx - 22, cy, 6, 45);
        ctx.fillRect(cx + 16, cy, 6, 45);

        // Volumetric warm sunbeams (Komorebi light shafts)
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        // Golden beam
        ctx.fillStyle = '#fce7ac';
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + 5);
        ctx.lineTo(cx + 15, cy + 5);
        ctx.lineTo(cx + 50, h);
        ctx.lineTo(cx - 50, h);
        ctx.closePath();
        ctx.fill();

        // Emerald canopy beam
        ctx.fillStyle = '#a8d5ba';
        ctx.beginPath();
        ctx.moveTo(cx + 10, cy + 5);
        ctx.lineTo(cx + 25, cy + 5);
        ctx.lineTo(cx + 90, h);
        ctx.lineTo(cx + 50, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Stone shrine basin at base
        ctx.fillStyle = '#4c5c56';
        ctx.beginPath();
        ctx.roundRect(cx - 16, h - 22, 32, 14, 3);
        ctx.fill();

        // Stone lantern glow
        ctx.fillStyle = '#f2d192';
        ctx.shadowColor = '#f2d192';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(cx, h - 28, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Ambient floating dust motes across all thumbnails
      ambientMotes.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        if (m.y < 0) {
          m.y = h;
          m.x = Math.random() * w;
        }
        ctx.fillStyle = m.color;
        ctx.globalAlpha = m.alpha * 0.6;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [type]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden bg-[#0c1410] border border-moss-800/60 select-none shadow-inner ${className}`}>
      <canvas
        ref={canvasRef}
        width={280}
        height={140}
        className="w-full h-full block cursor-pointer"
      />
    </div>
  );
};
