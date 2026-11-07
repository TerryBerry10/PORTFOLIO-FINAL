const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4'
});

const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
const margin = 36; // 0.5 inch margins
const contentWidth = pageWidth - margin * 2; // 523.28 pt

let y = margin + 10;

// Colors
const primaryBlue = [30, 64, 175]; // #1e40af
const darkText = [30, 41, 59]; // #1e293b
const mutedText = [71, 85, 105]; // #475569
const lineGrey = [203, 213, 225]; // #cbd5e1

// 1. Header
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(...darkText);
doc.text('VINAY SANKAR', margin, y);

doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(...primaryBlue);
doc.text('GAME DEVELOPER', margin, y + 14);

// Header Right (Contact Info)
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(...darkText);
const rightX = pageWidth - margin;
doc.text('Bangalore, India • +91 7356749187', rightX, y, { align: 'right' });
doc.setTextColor(...primaryBlue);
doc.text('sankarvinay70@gmail.com', rightX, y + 12, { align: 'right' });
doc.setTextColor(...darkText);
doc.text('Portfolio: terryberry10.github.io/PORTFOLIO-FINAL', rightX, y + 24, { align: 'right' });

y += 32;

// Horizontal Divider
doc.setDrawColor(...primaryBlue);
doc.setLineWidth(1.5);
doc.line(margin, y, rightX, y);
y += 14;

// Section Helper
function drawSectionHeading(title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryBlue);
  doc.text(title.toUpperCase(), margin, y);
  
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.75);
  doc.line(margin, y + 3, rightX, y + 3);
  y += 13;
}

// 2. Professional Summary
drawSectionHeading('Professional Summary');
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(...darkText);

const summaryText = "Game Developer with a Bachelor of Computer Applications (BCA) and a post-graduate specialization in Game Technology (M.Sc., in progress). Hands-on with the real-time rendering pipeline through custom HLSL and Shader Graph shaders, particle VFX and GPU-side optimization in Unity (URP), plus prototyping and cinematics in Unreal Engine. Programs in C++ and C# with an object-oriented design approach; familiar with Vulkan, DirectX 11/12 and OpenGL. Experienced in profiling and debugging frame-time problems with the Unity Profiler and Frame Debugger. Based in Bangalore.";

const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
doc.text(summaryLines, margin, y);
y += summaryLines.length * 11 + 6;

// 3. Technical Skills & Tools
drawSectionHeading('Technical Skills & Tools');
doc.setFontSize(8.5);

const col1X = margin;
const col2X = margin + contentWidth * 0.52;
const colW = contentWidth * 0.46;

const skills = [
  { c1T: 'Programming:', c1D: 'C++, C#, C, Object-Oriented Design, JavaScript, HTML5', c2T: 'Graphics APIs & Shaders:', c2D: 'Vulkan, DirectX 11/12, OpenGL, HLSL, Unity Shader Graph' },
  { c1T: 'Game Engines:', c1D: 'Unity (Advanced - URP / 2D / 3D), Unreal Engine, Godot', c2T: 'Rendering & VFX:', c2D: 'Real-time rendering pipeline, stylized shaders, Shuriken Particles, Combat VFX, Overdraw Control' },
  { c1T: 'Profiling & Debugging:', c1D: 'Unity Profiler, Frame Debugger, Object Pooling, GC-spike elimination', c2T: 'Animation & Tools:', c2D: 'Unity Mecanim, Blend Trees, Ragdoll Physics, Maya / Blender, Git / GitHub' }
];

for (const row of skills) {
  const rowStartY = y;
  
  // Col 1
  doc.setFont('helvetica', 'bold');
  doc.text(row.c1T, col1X, y);
  const c1TLen = doc.getTextWidth(row.c1T) + 4;
  doc.setFont('helvetica', 'normal');
  const c1Lines = doc.splitTextToSize(row.c1D, colW - c1TLen);
  doc.text(c1Lines[0] || '', col1X + c1TLen, y);
  if (c1Lines.length > 1) {
    doc.text(c1Lines.slice(1), col1X, y + 10.5);
  }
  
  // Col 2
  doc.setFont('helvetica', 'bold');
  doc.text(row.c2T, col2X, y);
  const c2TLen = doc.getTextWidth(row.c2T) + 4;
  doc.setFont('helvetica', 'normal');
  const c2Lines = doc.splitTextToSize(row.c2D, colW - c2TLen);
  doc.text(c2Lines[0] || '', col2X + c2TLen, y);
  if (c2Lines.length > 1) {
    doc.text(c2Lines.slice(1), col2X, y + 10.5);
  }

  const maxLines = Math.max(c1Lines.length, c2Lines.length);
  y += 12 + (maxLines - 1) * 10.5;
}
y += 4;

// 4. Featured Game Projects
drawSectionHeading('Featured Game Projects');

const projectsList = [
  {
    title: 'Dottie — 2D Anime-Style 1v1 Combat Game (Unity / C#)',
    role: 'Solo Developer',
    bullets: [
      { tag: 'GPU Rendering & Custom Shaders:', desc: "Engineered stylized HLSL and Shader Graph shaders inside Unity's URP rendering pipeline for dynamic combat auras, afterimage motion trails, and distortion effects inspired by anime fighters." },
      { tag: 'Combat Feel & Game Feedback:', desc: 'Designed responsive combo attack choreography, special attacks, and punchy audiovisual feedback loops (screen shake, hitstop freeze-frames, hit sparks, physics knockback).' },
      { tag: 'Profiling & Performance:', desc: 'Traced frame-time spikes to garbage collection and fixed them with a modular, object-oriented C# pooling architecture for high-frequency hit particles and projectiles, holding a smooth 60 FPS.' },
      { tag: 'Full-Cycle Execution:', desc: 'Solo developed all gameplay programming, animation states, custom shaders, and particle systems from scratch.' }
    ]
  },
  {
    title: 'Escape the Miraj & Unreal Cinematics (Unreal Engine)',
    role: 'Solo Developer',
    bullets: [
      { tag: 'Grapple Hook Tech Demo:', desc: 'Built a playable grapple-hook movement prototype in Unreal Engine as the foundation for a planned action game.' },
      { tag: 'Cinematic Sequences:', desc: 'Produced two rendered cinematics in Unreal Engine: a car chase and the story intro for Life of an Ant.' }
    ]
  },
  {
    title: 'Astral Rally — Fast-Paced Multi-Ball Arcade Game (Unity / C#)',
    role: 'Gameplay Programmer',
    bullets: [
      { tag: 'Shader & Arena Visuals:', desc: 'Authored dynamic glowing neon shaders and reactive boundary collision materials that respond visually to high-velocity ball impacts.' },
      { tag: 'Physics & Mechanics:', desc: 'Implemented responsive paddle controls, multi-ball trajectory math, collision detection, and custom trail renderers in C#.' }
    ]
  },
  {
    title: 'Bait — Reverse-Snake Survival Game (Unity / C#)',
    role: 'Programmer',
    bullets: [
      { tag: 'Visual Indicators & Shaders:', desc: 'Built custom trail shaders, danger-zone visual cues, and lightweight particle bursts for near-misses and capture events.' },
      { tag: 'AI & Movement Logic:', desc: 'Programmed predator pursuit algorithms and fluid player navigation mechanics in Unity.' }
    ]
  }
];

for (const proj of projectsList) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(...darkText);
  doc.text(proj.title, margin, y);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryBlue);
  doc.text(proj.role, rightX, y, { align: 'right' });
  y += 10.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...darkText);

  for (const b of proj.bullets) {
    const bulletPrefix = '• ';
    doc.text(bulletPrefix, margin + 4, y);
    
    doc.setFont('helvetica', 'bold');
    doc.text(b.tag, margin + 12, y);
    const tagW = doc.getTextWidth(b.tag) + 3;
    
    doc.setFont('helvetica', 'normal');
    const remainingW = contentWidth - 12 - tagW;
    const textLines = doc.splitTextToSize(b.desc, remainingW);
    
    doc.text(textLines[0] || '', margin + 12 + tagW, y);
    if (textLines.length > 1) {
      const subLines = doc.splitTextToSize(textLines.slice(1).join(' '), contentWidth - 16);
      for (let s = 0; s < subLines.length; s++) {
        y += 9.5;
        doc.text(subLines[s], margin + 12, y);
      }
    }
    y += 10;
  }
  y += 2;
}

// 5. Freelance Experience
drawSectionHeading('Freelance Experience');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.8);
doc.setTextColor(...darkText);
doc.text('Freelance Web & Application Developer', margin, y);
doc.setFont('helvetica', 'normal');
doc.setTextColor(...primaryBlue);
doc.text('Bangalore, India', rightX, y, { align: 'right' });
y += 10;

doc.setFont('helvetica', 'normal');
doc.setFontSize(8.2);
doc.setTextColor(...darkText);

const freeBullets = [
  'Built and deployed custom web applications and interactive interfaces using JavaScript and HTML5.',
  'Translated client specifications into clean, modular code with responsive UI and optimized assets.'
];

for (const fb of freeBullets) {
  doc.text('• ' + fb, margin + 4, y);
  y += 10;
}
y += 2;

// 6. Education
drawSectionHeading('Education');
doc.setFontSize(8.5);

// Edu 1
doc.setFont('helvetica', 'bold');
doc.setTextColor(...darkText);
doc.text('M.Sc. in Game Technology', margin, y);
const edu1W = doc.getTextWidth('M.Sc. in Game Technology');
doc.setFont('helvetica', 'normal');
doc.text(' • ICAT Design & Media College (Alagappa University)', margin + edu1W + 1, y);

doc.setFont('helvetica', 'normal');
doc.setTextColor(...primaryBlue);
doc.text('2nd Year (Pursuing) • Chennai, India', rightX, y, { align: 'right' });
y += 12;

// Edu 2
doc.setFont('helvetica', 'bold');
doc.setTextColor(...darkText);
doc.text('Bachelor of Computer Applications (BCA)', margin, y);
const edu2W = doc.getTextWidth('Bachelor of Computer Applications (BCA)');
doc.setFont('helvetica', 'normal');
doc.text(' • Lovely Professional University (LPU)', margin + edu2W + 1, y);

doc.setFont('helvetica', 'normal');
doc.setTextColor(...primaryBlue);
doc.text('Graduated 2025 • Punjab, India', rightX, y, { align: 'right' });

// Output PDF to public directory
const outPath = path.join(__dirname, '..', 'public', 'Vinay_Sankar_Resume.pdf');
const pdfBuffer = doc.output('arraybuffer');
fs.writeFileSync(outPath, Buffer.from(pdfBuffer));
console.log('Successfully generated public/Vinay_Sankar_Resume.pdf (' + pdfBuffer.byteLength + ' bytes); pages=' + doc.getNumberOfPages() + ', final y=' + y.toFixed(1) + '/' + pageHeight.toFixed(1));
