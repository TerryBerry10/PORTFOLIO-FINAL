import React, { useState } from 'react';
import { levelDesignProjects, LevelDesignProject, LevelImage } from '../../data/levelDesigns';
import { 
  X, 
  Sparkles, 
  Layers, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Sun, 
  Boxes, 
  Swords, 
  ExternalLink,
  Info,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface LevelDesignModalProps {
  onClose: () => void;
}

export const LevelDesignModal: React.FC<LevelDesignModalProps> = ({ onClose }) => {
  const [selectedProject, setSelectedProject] = useState<LevelDesignProject | null>(levelDesignProjects[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<LevelImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All Environments', icon: Layers },
    { id: 'environment-art', label: 'Environment Art', icon: Compass },
    { id: 'combat-arena', label: 'Combat Arenas', icon: Swords },
    { id: 'lighting', label: 'Lighting & Mood', icon: Sun },
  ];

  const filteredProjects = activeCategory === 'all'
    ? levelDesignProjects
    : levelDesignProjects.filter(p => p.category === activeCategory);

  const handleOpenLightbox = (image: LevelImage, index: number) => {
    AudioEngine.playSfx('openModal');
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    const nextIdx = (lightboxIndex + 1) % selectedProject.images.length;
    setLightboxIndex(nextIdx);
    setLightboxImage(selectedProject.images[nextIdx]);
    AudioEngine.playSfx('interact');
  };

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    const prevIdx = (lightboxIndex - 1 + selectedProject.images.length) % selectedProject.images.length;
    setLightboxIndex(prevIdx);
    setLightboxImage(selectedProject.images[prevIdx]);
    AudioEngine.playSfx('interact');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Container */}
      <div className="relative w-full max-w-6xl bg-[#090d16]/95 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto flex flex-col max-h-[94vh] text-white">
        
        {/* Top Header Bar */}
        <div className="bg-white/[0.04] border-b border-white/15 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// LEVEL DESIGN & ENVIRONMENT ART SHOWCASE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-sans text-white tracking-tight">
                Level Design & Spatial Composition
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              AudioEngine.playSfx('closeModal');
              onClose();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-xl transition-all cursor-pointer active:scale-95"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 pt-4 pb-2 flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.02]">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  AudioEngine.playSfx('buttonHover');
                  setActiveCategory(cat.id);
                  const matched = cat.id === 'all' 
                    ? levelDesignProjects[0] 
                    : levelDesignProjects.find(p => p.category === cat.id) || levelDesignProjects[0];
                  setSelectedProject(matched);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-paper-200 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Project Navigation Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filteredProjects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    AudioEngine.playSfx('interact');
                    setSelectedProject(proj);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/30 shadow-[0_0_30px_rgba(16,185,129,0.35)] scale-[1.02]'
                      : 'border-white/15 hover:border-emerald-400/60 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={proj.heroImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono text-emerald-300 font-bold">
                      {proj.images.length} Shots
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      {proj.categoryLabel}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-paper-300 line-clamp-1 font-normal">
                      {proj.engine}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Project Full Details & Photo Gallery */}
          {selectedProject && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Project Header Banner */}
              <div className="bg-white/[0.03] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{selectedProject.categoryLabel} · {selectedProject.engine}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="text-sm sm:text-base text-paper-200 font-normal max-w-3xl">
                      {selectedProject.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.toolsUsed.map((tool, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-black/60 border border-white/20 text-xs font-mono text-amber-300 font-bold">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overview Text */}
                <p className="text-sm sm:text-base text-paper-100 leading-relaxed font-sans border-t border-white/10 pt-4">
                  {selectedProject.overview}
                </p>
              </div>

              {/* Photo Gallery Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-emerald-400" />
                    <span>Level Screenshots & Breakdown Gallery</span>
                  </h4>
                  <span className="text-xs font-mono text-paper-400">Click any image to expand full-screen</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {selectedProject.images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => handleOpenLightbox(img, idx)}
                      className="group relative rounded-2xl overflow-hidden bg-black/60 border-2 border-white/15 hover:border-emerald-400/80 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:-translate-y-1"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                        
                        {/* Hover Fullscreen Cue */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <div className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-mono text-xs font-black flex items-center gap-2 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>VIEW FULLSCREEN</span>
                          </div>
                        </div>

                        {/* Tag Badge */}
                        {img.tag && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-white/25 text-[10px] font-mono text-emerald-300 font-bold backdrop-blur-md">
                            {img.tag}
                          </div>
                        )}
                      </div>

                      {/* Image Caption & Title */}
                      <div className="p-4 space-y-1.5">
                        <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {img.title}
                        </h5>
                        <p className="text-xs text-paper-300 leading-relaxed font-normal">
                          {img.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Breakdown Matrix: Spatial Flow, Lighting & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Spatial Flow & Metrics */}
                <div className="bg-black/40 border border-white/15 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 text-emerald-400">
                    <Compass className="w-5 h-5" />
                    <h4 className="text-base font-bold font-sans text-white">Spatial Metrics & Pacing</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-paper-200">
                    {selectedProject.metricsAndFlow.map((metric, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lighting & Environmental Juice */}
                <div className="bg-black/40 border border-white/15 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <Sun className="w-5 h-5" />
                    <h4 className="text-base font-bold font-sans text-white">Lighting & Atmospheric Juice</h4>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-paper-200">
                    {selectedProject.lightingAtmosphere.map((light, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{light}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

          {/* Quick Guide on adding more pictures */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-paper-300">
            <div className="flex items-center gap-3">
              <FolderPlus className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-300 font-bold uppercase">Add More Screenshots: </span>
                <span>Drop images into <code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">public/levels/</code> and they will instantly render here!</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxImage && selectedProject && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn select-none"
        >
          {/* Top Lightbox Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                {selectedProject.title} · [{lightboxIndex + 1} / {selectedProject.images.length}]
              </span>
            </div>

            <button
              onClick={() => setLightboxImage(null)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Lightbox Image */}
          <div 
            onClick={e => e.stopPropagation()}
            className="relative max-w-5xl max-h-[75vh] flex flex-col items-center justify-center"
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[72vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/20"
            />

            {/* Prev / Next Navigation Arrows */}
            {selectedProject.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevLightbox}
                  className="absolute left-2 sm:-left-16 p-3 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextLightbox}
                  className="absolute right-2 sm:-right-16 p-3 rounded-full bg-black/70 hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Lightbox Caption Card */}
          <div 
            onClick={e => e.stopPropagation()}
            className="absolute bottom-4 max-w-2xl text-center space-y-1 bg-black/80 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/15"
          >
            <h4 className="text-base font-bold text-white">{lightboxImage.title}</h4>
            <p className="text-xs text-paper-200">{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};
