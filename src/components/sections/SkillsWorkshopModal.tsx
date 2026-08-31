import React, { useState } from 'react';
import { workshopSkills } from '../../data/skills';
import { X, Wrench, Sparkles, CheckCircle, Cpu, Globe, Compass, Box, Music } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface SkillsWorkshopModalProps {
  onClose: () => void;
}

export const SkillsWorkshopModal: React.FC<SkillsWorkshopModalProps> = ({ onClose }) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(workshopSkills[0]?.id || '');

  const selectedSkill = workshopSkills.find(s => s.id === selectedSkillId) || workshopSkills[0];

  const handleSelectSkill = (id: string) => {
    AudioEngine.playSfx('buttonHover');
    setSelectedSkillId(id);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'Globe': return <Globe className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-300" />;
      case 'Box': return <Box className="w-5 h-5 text-amber-400" />;
      case 'Music': return <Music className="w-5 h-5 text-amber-300" />;
      default: return <Wrench className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Transparent Frosted Glass Modal Container */}
      <div className="relative w-full max-w-5xl bg-black/35 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="bg-white/[0.04] border-b border-white/15 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// THE ARTISAN WORKSHOP · TECHNICAL SKILLS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
                Interactive Tools & Systems Matrix
              </h2>
            </div>
          </div>
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

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <p className="text-sm sm:text-base text-paper-200 leading-relaxed font-sans">
            Every technology in the workshop represents concrete production experience across shipped titles like <strong className="text-amber-300">Dottie</strong>, <strong className="text-amber-300">Bait</strong>, and <strong className="text-amber-300">Astral Rally</strong>. Select a domain to inspect systems architecture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Skills Grid List */}
            <div className="md:col-span-5 grid grid-cols-1 gap-2.5">
              {workshopSkills.map(skill => {
                const isSelected = skill.id === selectedSkillId;
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSelectSkill(skill.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.35)] font-bold text-white scale-[1.02]'
                        : 'bg-black/40 hover:bg-black/60 border-white/15 text-paper-200 hover:border-white/30'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                      {getIcon(skill.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate font-sans font-bold">{skill.name}</div>
                      <div className="text-xs font-mono text-paper-400 truncate">{skill.category}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Skill Detail */}
            {selectedSkill && (
              <div className="md:col-span-7 bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
                      {selectedSkill.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      PROFICIENCY // 5+ YRS
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-white mb-2">{selectedSkill.name}</h3>
                  <p className="text-sm text-paper-200 leading-relaxed mb-6 font-sans">
                    {selectedSkill.description}
                  </p>

                  {/* Concrete Capabilities */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                      Key Capabilities & Systems:
                    </div>
                    <div className="space-y-2">
                      {selectedSkill.whatIUseItFor?.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-paper-200">
                          <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Specialties */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-paper-400 mb-2 font-bold">
                    Key Specialties:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.keySpecialties?.map(t => (
                      <span key={t} className="text-xs font-mono bg-white/10 text-paper-100 px-3 py-1 rounded-full border border-white/15 font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.04] border-t border-white/15 px-6 py-4 flex items-center justify-between text-xs font-mono text-paper-400">
          <span className="text-amber-300 font-bold">VINAY SANKAR // TECHNICAL SKILLS MATRIX</span>
          <span>UNITY & C# SPECIALIST</span>
        </div>
      </div>
    </div>
  );
};
