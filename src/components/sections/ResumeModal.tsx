import React, { useState } from 'react';
import { developerInfo } from '../../data/developerInfo';
import { X, Download, Copy, Check, FileText, Briefcase, GraduationCap, Award, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface ResumeModalProps {
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const { resume } = developerInfo;

  const handleCopyText = () => {
    const textResume = `
${developerInfo.name} - ${developerInfo.title}
Email: ${developerInfo.email} | GitHub: ${developerInfo.links.github} | LinkedIn: ${developerInfo.links.linkedin}

SUMMARY
${resume.summary}

KEY HIGHLIGHTS
${resume.highlights.map(h => `• ${h}`).join('\n')}

EXPERIENCE
${resume.experience.map(e => `
${e.role} | ${e.company} (${e.period}) - ${e.location}
${e.bullets.map(b => `  • ${b}`).join('\n')}
`).join('\n')}

EDUCATION
${resume.education.map(ed => `${ed.degree} - ${ed.institution} (${ed.year})\nFocus: ${ed.focus}`).join('\n')}
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
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// THE FLOATING SKY SANCTUARY · OFFICIAL RESUME</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              {developerInfo.name} — Curriculum Vitae
            </h2>
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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-transparent text-paper-100 font-sans">
          
          {/* Top Intro */}
          <div className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-black text-white">{developerInfo.name}</h3>
            <p className="text-sm font-mono text-amber-400 font-bold mt-1 mb-2">{developerInfo.title}</p>
            <p className="text-xs sm:text-sm text-paper-300 font-mono">
              Email: {developerInfo.email} · {developerInfo.location} · {developerInfo.status}
            </p>
          </div>

          {/* Executive Summary */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>// EXECUTIVE SUMMARY</span>
            </h4>
            <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans">
              {resume.summary}
            </p>
          </section>

          {/* Key Technical Highlights */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>// CORE ENGINEERING HIGHLIGHTS</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {resume.highlights.map((h, i) => (
                <div key={i} className="bg-black/50 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-paper-200 flex items-start gap-2.5">
                  <span className="text-amber-400 font-mono font-bold text-base">✓</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Experience */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>// PRODUCTION EXPERIENCE</span>
            </h4>
            <div className="space-y-6">
              {resume.experience.map((exp, i) => (
                <div key={i} className="bg-black/50 p-5 sm:p-6 rounded-xl border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                    <h5 className="font-bold text-base text-white">{exp.role}</h5>
                    <span className="text-xs font-mono text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-paper-400 mb-4">
                    {exp.company} · {exp.location}
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-paper-200 list-disc list-inside">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-black/45 backdrop-blur-xl border border-white/15 p-6 sm:p-7 rounded-2xl shadow-lg">
            <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>// EDUCATION</span>
            </h4>
            {resume.education.map((ed, i) => (
              <div key={i} className="bg-black/50 p-5 rounded-xl border border-white/10 text-xs sm:text-sm text-paper-200">
                <div className="flex justify-between font-bold text-white mb-1.5">
                  <span>{ed.degree}</span>
                  <span className="font-mono text-amber-400">{ed.year}</span>
                </div>
                <div className="text-paper-300 mb-1.5">{ed.institution}</div>
                <div className="text-xs font-mono text-amber-300 font-bold">Focus: {ed.focus}</div>
              </div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <span className="text-amber-300 font-bold">AVAILABLE FOR GAMEPLAY ENGINEERING ROLES</span>
          <span className="text-paper-300">{developerInfo.email}</span>
        </div>
      </div>
    </div>
  );
};
