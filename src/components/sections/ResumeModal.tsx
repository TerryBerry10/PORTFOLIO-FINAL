import React, { useState } from 'react';
import { developerInfo } from '../../data/developerInfo';
import { X, Download, Copy, Check, FileText, Printer, Sparkles, MapPin, Phone, Mail, Globe, ExternalLink } from 'lucide-react';
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
Email: ${developerInfo.email} | Portfolio: ${developerInfo.portfolioUrl || 'https://terryberry10.github.io/PORTFOLIO-FINAL'}

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

  const handlePrint = () => {
    AudioEngine.playSfx('interact');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-[#090d16]/95 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto flex flex-col max-h-[94vh] text-white">
        
        {/* Top Control Bar */}
        <div className="bg-white/[0.04] border-b border-white/15 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// CURRICULUM VITAE · OFFICIAL PDF</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-sans text-white tracking-tight">
                {developerInfo.name} — Resume Document
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download Button */}
            <a
              href={`${import.meta.env.BASE_URL}Vinay_Sankar_Resume.pdf`}
              download="Vinay_Sankar_Resume.pdf"
              onClick={() => AudioEngine.playSfx('interact')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs sm:text-sm font-black rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:shadow-[0_0_35px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>DOWNLOAD PDF</span>
            </a>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-full border border-white/20 transition-all cursor-pointer active:scale-95"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>PRINT</span>
            </button>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-full border border-white/20 transition-all cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY TEXT'}</span>
            </button>

            {/* Close Button */}
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

        {/* Scrollable PDF Document Canvas Viewport */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/80 flex justify-center items-start">
          
          {/* Authentic A4 Document Sheet */}
          <div className="w-full max-w-[820px] bg-white text-slate-900 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 sm:p-10 font-sans border border-slate-300 select-text">
            
            {/* Header: Name, Title & Contacts */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1e40af] pb-3 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {developerInfo.name.toUpperCase()}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#1e40af] mt-1 tracking-wider uppercase">
                  {developerInfo.title}
                </p>
              </div>

              <div className="text-right text-xs font-normal text-slate-700 space-y-0.5">
                <div className="flex items-center justify-end gap-1.5 font-medium">
                  <span>{developerInfo.location}</span>
                  <span>•</span>
                  <span>{developerInfo.phone || '+91 7356749187'}</span>
                </div>
                <div>
                  <a href={`mailto:${developerInfo.email}`} className="text-[#1e40af] hover:underline font-medium">
                    {developerInfo.email}
                  </a>
                </div>
                <div className="text-slate-600">
                  Portfolio:{' '}
                  <a href={developerInfo.portfolioUrl || 'https://terryberry10.github.io/PORTFOLIO-FINAL'} target="_blank" rel="noreferrer" className="text-[#1e40af] hover:underline font-medium">
                    terryberry10.github.io/PORTFOLIO-FINAL
                  </a>
                </div>
              </div>
            </div>

            {/* Section 1: Professional Summary */}
            <section className="mb-4">
              <h2 className="text-xs font-black text-[#1e40af] uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-[12px] sm:text-[13px] text-slate-800 leading-relaxed font-normal">
                {resume.summary}
              </p>
            </section>

            {/* Section 2: Technical Skills & Tools */}
            <section className="mb-4">
              <h2 className="text-xs font-black text-[#1e40af] uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
                TECHNICAL SKILLS & TOOLS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[12px] sm:text-[12.5px] leading-snug">
                {resume.technicalSkills?.map((skill, i) => (
                  <div key={i} className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-bold text-slate-900">{skill.category}:</span>
                    <span className="text-slate-700">{skill.items}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Featured Game Projects */}
            <section className="mb-4">
              <h2 className="text-xs font-black text-[#1e40af] uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2.5">
                FEATURED GAME PROJECTS
              </h2>
              <div className="space-y-3">
                {resume.featuredProjects?.map((proj, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[13px] sm:text-[13.5px] font-bold text-slate-900">
                        {proj.title} <span className="font-normal text-slate-600">({proj.tech})</span>
                      </h3>
                      <span className="text-[12px] font-bold text-[#1e40af]">{proj.role}</span>
                    </div>

                    <ul className="space-y-1 text-[11.5px] sm:text-[12px] text-slate-800 list-disc list-outside pl-4">
                      {proj.bullets.map((b, bi) => (
                        <li key={bi} className="leading-relaxed">
                          <strong className="font-bold text-slate-900">{b.heading}:</strong> {b.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Freelance Experience */}
            <section className="mb-4">
              <h2 className="text-xs font-black text-[#1e40af] uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
                FREELANCE EXPERIENCE
              </h2>
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-bold text-slate-900">Freelance Web & Application Developer</h3>
                  <span className="text-[12px] font-bold text-[#1e40af]">Bangalore, India</span>
                </div>
                <ul className="space-y-1 text-[11.5px] sm:text-[12px] text-slate-800 list-disc list-outside pl-4">
                  {resume.experience[0]?.bullets.map((bullet, bi) => (
                    <li key={bi} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 5: Education */}
            <section>
              <h2 className="text-xs font-black text-[#1e40af] uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2">
                EDUCATION
              </h2>
              <div className="space-y-1.5 text-[12px] sm:text-[12.5px]">
                {resume.education.map((ed, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{ed.degree}</span>
                      <span className="text-slate-700"> • {ed.institution}</span>
                    </div>
                    <div className="text-[12px] font-bold text-[#1e40af]">
                      {ed.year} {ed.location && `• ${ed.location}`}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-3.5 flex flex-wrap items-center justify-between text-xs font-mono text-paper-300 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold">📄 Vinay_Sankar_Resume.pdf</span>
            <span>•</span>
            <span>PDF</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${import.meta.env.BASE_URL}Vinay_Sankar_Resume.pdf`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
