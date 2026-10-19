import React, { useState } from 'react';
import { Project } from '../../types/project';
import { SystemDiagram } from './SystemDiagram';
import { LivePlayground } from './LivePlayground';
import { XRayViewer } from './XRayViewer';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ProjectTimeline } from './ProjectTimeline';
import { 
  X, 
  Play, 
  BookOpen, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  History, 
  Lightbulb, 
  Sliders,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { AudioEngine } from '../../engine/AudioEngine';
import { openGameTV } from '../../utils/gameTV';

interface ProjectBreakdownModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectBreakdownModal: React.FC<ProjectBreakdownModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'playground' | 'xray' | 'timeline'>('journal');

  const { breakdown } = project;

  const handleTabChange = (tab: 'journal' | 'playground' | 'xray' | 'timeline') => {
    AudioEngine.playSfx('buttonHover');
    setActiveTab(tab);
  };

  const handleClose = () => {
    AudioEngine.playSfx('closeModal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[92vh] text-white">
        
        {/* Field Journal Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// TECHNICAL FIELD JOURNAL · CASE STUDY</span>
              </span>
              <span className="text-white/30 font-bold">/</span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {project.category} · {project.year}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-paper-300 mt-1 font-mono">
              {project.subtitle}
            </p>
          </div>

          {/* Action Links & Close */}
          <div className="flex items-center gap-2.5">
            {project.playableUrl && (
              <a
                href={project.playableUrl}
                onClick={e => { e.preventDefault(); openGameTV(project.id); }}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>REPO</span>
              </a>
            )}
            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95 ml-1"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-black/40 px-6 py-3 border-b border-white/10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTabChange('journal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'journal' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'text-paper-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>01-08 FIELD JOURNAL</span>
          </button>

          <button
            onClick={() => handleTabChange('playground')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'playground' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'text-paper-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>09 LIVE PLAYGROUND</span>
          </button>

          <button
            onClick={() => handleTabChange('xray')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'xray' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'text-paper-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINE X-RAY</span>
          </button>

          <button
            onClick={() => handleTabChange('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timeline' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'text-paper-300 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>ITERATION TIMELINE</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Journal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          {/* TAB 1: FULL FIELD JOURNAL */}
          {activeTab === 'journal' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 mr-2 uppercase">TECHNOLOGIES:</span>
                {project.technologies.map((t, i) => (
                  <span key={i} className="text-xs font-mono bg-white/10 text-paper-100 px-3 py-1 rounded-full border border-white/15 font-bold">
                    {t}
                  </span>
                ))}
              </div>

              {/* 01 — THE IDEA */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>01 // THE IDEA & MOTIVATION</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-3">Core Vision & Player Experience</h3>
                <p className="text-sm text-paper-200 leading-relaxed mb-5 font-sans">
                  {breakdown.idea.summary}
                </p>
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 mb-4">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase block mb-1">Player Experience:</span>
                  <p className="text-xs sm:text-sm text-paper-200 leading-relaxed">{breakdown.idea.playerExperience}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-paper-300 font-mono">
                  <span className="font-bold text-amber-400">Influences:</span>
                  {breakdown.idea.influences.map((inf, i) => (
                    <span key={i} className="bg-white/10 px-2.5 py-1 rounded-full text-paper-200 border border-white/10">
                      {inf}
                    </span>
                  ))}
                </div>
              </section>

              {/* 02 — THE CORE SYSTEM */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <Layers className="w-4 h-4" />
                  <span>02 // THE CORE SYSTEM & MECHANICS</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-3">{breakdown.coreSystem.title}</h3>
                <p className="text-sm text-paper-200 leading-relaxed mb-5 font-sans">
                  {breakdown.coreSystem.explanation}
                </p>
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 text-xs sm:text-sm font-mono text-paper-200">
                  <strong className="text-amber-300">Technical Depth: </strong>
                  {breakdown.coreSystem.technicalDepth}
                </div>
              </section>

              {/* 03 — UNDER THE HOOD (System Architecture Diagram) */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="text-xs font-mono font-bold text-amber-400 mb-4">
                  03 // UNDER THE HOOD & ARCHITECTURE
                </div>
                <SystemDiagram nodes={breakdown.architecture.nodes} edges={breakdown.architecture.edges} />
              </section>

              {/* 04 — THE PROBLEM */}
              <section className="bg-black/45 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>04 // THE PROBLEM (WHAT BROKE)</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-3">{breakdown.problem.title}</h3>
                <p className="text-sm text-paper-200 leading-relaxed mb-3">
                  <strong className="font-mono text-xs uppercase text-amber-400">Symptom: </strong>
                  {breakdown.problem.symptom}
                </p>
                <p className="text-sm text-paper-200 leading-relaxed mb-5">
                  <strong className="font-mono text-xs uppercase text-amber-400">Root Cause: </strong>
                  {breakdown.problem.rootCause}
                </p>
                <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase block mb-2">Failed Approaches:</span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-paper-300 list-disc list-inside">
                    {breakdown.problem.failedAttempts.map((att, i) => (
                      <li key={i}>{att}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 05 — THE SOLUTION */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>05 // THE SOLUTION & CODE HIGHLIGHT</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-3">Architectural Redesign</h3>
                <p className="text-sm text-paper-200 leading-relaxed mb-5">
                  {breakdown.solution.approach}
                </p>

                {/* Code Snippet Box */}
                <div className="bg-black/90 text-paper-100 rounded-xl overflow-hidden border border-white/15 shadow-inner">
                  <div className="bg-white/5 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {breakdown.solution.codeHighlight.filename}
                    </span>
                    <span className="font-mono text-[10px] text-paper-400 uppercase">
                      {breakdown.solution.codeHighlight.language}
                    </span>
                  </div>
                  <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-amber-200">
                    <code>{breakdown.solution.codeHighlight.code}</code>
                  </pre>
                </div>
              </section>

              {/* 06 — PERFORMANCE METRICS */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>06 // PERFORMANCE & OPTIMIZATION RESULTS</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-4">Real Profiling Metrics</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/15 font-mono text-amber-300 bg-white/5">
                        <th className="p-3">MEASURED METRIC</th>
                        <th className="p-3">BEFORE OPTIMIZATION</th>
                        <th className="p-3">AFTER OPTIMIZATION</th>
                        <th className="p-3">IMPROVEMENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {breakdown.performance.metrics.map((m, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="p-3 font-bold text-white">{m.metric}</td>
                          <td className="p-3 font-mono text-paper-400">{m.before}</td>
                          <td className="p-3 font-mono text-amber-300 font-bold">{m.after}</td>
                          <td className="p-3 font-mono font-bold text-amber-400 bg-amber-500/10">{m.delta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Before / After Slider */}
              <BeforeAfterSlider comparison={breakdown.beforeAfter} />

              {/* 08 — WHAT I LEARNED */}
              <section className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>08 // WHAT I LEARNED & RETROSPECTIVE</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase block mb-1">Technical Insight:</span>
                    <p className="text-xs sm:text-sm text-paper-200 leading-relaxed">{breakdown.lessonsLearned.technical}</p>
                  </div>
                  <div className="bg-black/60 p-4 rounded-xl border border-white/10">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase block mb-1">Design Insight:</span>
                    <p className="text-xs sm:text-sm text-paper-200 leading-relaxed">{breakdown.lessonsLearned.design}</p>
                  </div>
                </div>
              </section>

              {/* Final Play Callout */}
              <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="font-bold text-lg text-white">Experience this system in action</h4>
                  <p className="text-xs sm:text-sm text-paper-300">Play the web build or switch to the Live Playground tab to tweak parameters in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTabChange('playground')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-full border border-white/20 transition-all cursor-pointer"
                  >
                    OPEN PLAYGROUND
                  </button>
                  {project.playableUrl && (
                    <a
                      href={project.playableUrl}
                      onClick={e => { e.preventDefault(); openGameTV(project.id); }}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono text-xs font-black rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all cursor-pointer"
                    >
                      PLAY GAME
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="animate-fadeIn space-y-6">
              <LivePlayground
                type={breakdown.playground.type}
                description={breakdown.playground.description}
                params={breakdown.playground.params}
              />
            </div>
          )}

          {/* TAB 3: ENGINE X-RAY */}
          {activeTab === 'xray' && (
            <div className="animate-fadeIn space-y-6">
              <XRayViewer data={breakdown.xrayData} />
            </div>
          )}

          {/* TAB 4: ITERATION TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="animate-fadeIn space-y-6">
              <ProjectTimeline stages={breakdown.iteration} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-paper-300 hover:text-amber-300 transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO WORLD</span>
          </button>
          <span className="text-amber-300 font-bold">// VINAY SANKAR ARCHITECTURE LOG</span>
        </div>
      </div>
    </div>
  );
};
