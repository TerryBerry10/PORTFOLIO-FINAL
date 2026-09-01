import React, { useState } from 'react';
import { developerInfo } from '../../data/developerInfo';
import { X, Download, Copy, Check, FileText, Briefcase, GraduationCap, Wrench, Sparkles, Phone, Mail, MapPin, Globe, Gamepad2 } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface ResumeModalProps {
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const { resume } = developerInfo;

  const handleCopyText = () => {
    const textResume = `
${developerInfo.name.toUpperCase()}
${developerInfo.title.toUpperCase()}
Location: ${developerInfo.location} | Phone: ${developerInfo.phone || '+91 7356749187'}
Email: ${developerInfo.email} | Portfolio: ${developerInfo.portfolioUrl || 'https://final-portfolio-xi-topaz.vercel.app'}

==================================================
PROFESSIONAL SUMMARY
==================================================
${resume.summary}

==================================================
TECHNICAL SKILLS & TOOLS
==================================================
${resume.technicalSkills?.map(s => `${s.category}: ${s.items}`).join('\n')}

==================================================
FEATURED GAME PROJECTS
==================================================
${resume.featuredProjects?.map(p => `
${p.title} (${p.tech}) — ${p.role}
${p.bullets.map(b => `• ${b.heading}: ${b.text}`).join('\n')}
`).join('\n')}

==================================================
FREELANCE EXPERIENCE
==================================================
${resume.experience.map(e => `
${e.role} — ${e.location}
${e.bullets.map(b => `• ${b}`).join('\n')}
`).join('\n')}

==================================================
EDUCATION
==================================================
${resume.education.map(ed => `• ${ed.degree} • ${ed.institution} (${ed.year}) • ${ed.location || ''}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    AudioEngine.playSfx('interact');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    AudioEngine.playSfx('interact');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[92vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// OFFICIAL RESUME · CURRICULUM VITAE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                {developerInfo.name} — Resume
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-full border border-white/20 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY TEXT'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>PRINT / PDF</span>
            </button>

            <button
              onClick={() => {
                AudioEngine.playSfx('closeModal');
                onClose();
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95 ml-1"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-transparent text-paper-100 font-sans">
          
          {/* Header Contact Strip */}
          <div className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{developerInfo.name.toUpperCase()}</h3>
                <p className="text-sm sm:text-base font-mono text-amber-400 font-bold mt-1 tracking-wide">{developerInfo.title.toUpperCase()}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-paper-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {developerInfo.location}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> <a href={`tel:${developerInfo.phone || '+917356749187'}`} className="hover:text-amber-300">{developerInfo.phone || '+91 7356749187'}</a></span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> <a href={`mailto:${developerInfo.email}`} className="text-amber-400 hover:underline">{developerInfo.email}</a></span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-amber-400" /> <a href={developerInfo.portfolioUrl || 'https://final-portfolio-xi-topaz.vercel.app'} target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">Portfolio ↗</a></span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>// PROFESSIONAL SUMMARY</span>
            </h4>
            <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans">
              {resume.summary}
            </p>
          </section>

          {/* Technical Skills & Tools */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>// TECHNICAL SKILLS & TOOLS</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resume.technicalSkills?.map((skill, i) => (
                <div key={i} className="bg-black/50 p-4 rounded-xl border border-white/10">
                  <div className="text-xs font-mono font-bold text-amber-300 mb-1">{skill.category}</div>
                  <div className="text-xs sm:text-sm text-paper-200 font-sans">{skill.items}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Game Projects */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>// FEATURED GAME PROJECTS</span>
            </h4>
            <div className="space-y-6">
              {resume.featuredProjects?.map((proj, i) => (
                <div key={i} className="bg-black/50 p-5 sm:p-6 rounded-xl border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h5 className="font-bold text-base sm:text-lg text-white font-sans">{proj.title}</h5>
                      <span className="text-xs font-mono text-amber-400 font-semibold">{proj.role}</span>
                    </div>
                    <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
                      {proj.tech}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-paper-200">
                    {proj.bullets.map((b, bi) => (
                      <li key={bi} className="leading-relaxed flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">▪</span>
                        <span>
                          <strong className="text-white font-semibold">{b.heading}:</strong> {b.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Freelance Experience */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>// FREELANCE EXPERIENCE</span>
            </h4>
            <div className="space-y-4">
              {resume.experience.map((exp, i) => (
                <div key={i} className="bg-black/50 p-5 rounded-xl border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                    <h5 className="font-bold text-base text-white">{exp.role}</h5>
                    <span className="text-xs font-mono text-amber-300 font-bold">{exp.location}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-paper-200">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="leading-relaxed flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">▪</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>// EDUCATION</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resume.education.map((ed, i) => (
                <div key={i} className="bg-black/50 p-5 rounded-xl border border-white/10 text-xs sm:text-sm text-paper-200 space-y-1">
                  <div className="font-bold text-base text-white">{ed.degree}</div>
                  <div className="text-paper-300 text-xs font-mono">{ed.institution}</div>
                  <div className="flex justify-between text-xs font-mono text-amber-400 pt-1">
                    <span>{ed.year}</span>
                    {ed.location && <span>{ed.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex flex-wrap items-center justify-between text-xs font-mono text-paper-400 gap-2">
          <span className="text-amber-300 font-bold">AVAILABLE FOR TECHNICAL ARTIST & GAME DEVELOPER ROLES</span>
          <span className="text-paper-300">{developerInfo.email} · {developerInfo.phone || '+91 7356749187'}</span>
        </div>
      </div>
    </div>
  );
};
