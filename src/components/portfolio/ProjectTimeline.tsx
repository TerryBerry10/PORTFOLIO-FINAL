import React, { useState } from 'react';
import { ProjectTimelineStage } from '../../types/project';
import { Clock, CheckCircle2, AlertTriangle, Milestone } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface ProjectTimelineProps {
  stages: ProjectTimelineStage[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ stages }) => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const activeStage = stages[activeStageIdx] || stages[0];

  const handleStageSelect = (idx: number) => {
    AudioEngine.playSfx('buttonHover');
    setActiveStageIdx(idx);
  };

  return (
    <div className="bg-paper-50 border border-paper-300 rounded-xl p-5 shadow-journal">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-moss-700" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-charcoal-900">
            // ITERATION & EVOLUTION TIMELINE
          </h4>
        </div>
        <span className="text-[11px] font-mono text-charcoal-600 bg-paper-200 px-2.5 py-0.5 rounded">
          Select milestone to inspect
        </span>
      </div>

      {/* Timeline Steps Track */}
      <div className="relative mb-6">
        <div className="absolute top-4 left-4 right-4 h-1 bg-paper-300 -z-0 rounded" />
        <div className="flex justify-between relative z-10">
          {stages.map((stage, idx) => {
            const isSelected = idx === activeStageIdx;
            return (
              <button
                key={idx}
                onClick={() => handleStageSelect(idx)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-moss-700 text-paper-50 scale-110 shadow-moss-glow ring-4 ring-moss-100'
                      : 'bg-paper-200 text-charcoal-700 hover:bg-paper-300'
                  }`}
                >
                  0{idx + 1}
                </div>
                <span className={`text-[10px] font-mono mt-1.5 font-bold transition-colors ${
                  isSelected ? 'text-moss-800' : 'text-charcoal-500'
                }`}>
                  {stage.phase}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      {activeStage && (
        <div className="bg-paper-100 border border-paper-300 rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h5 className="font-bold text-sm text-charcoal-900 flex items-center gap-2">
              <span>{activeStage.title}</span>
              <span className="text-[11px] font-mono font-normal text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-200">
                {activeStage.date}
              </span>
            </h5>
            <span className="text-[11px] font-mono text-charcoal-600">
              Phase {activeStageIdx + 1} of {stages.length}
            </span>
          </div>

          <p className="text-xs text-charcoal-800 leading-relaxed mb-4">
            {activeStage.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-paper-200 text-xs">
            <div className="bg-paper-50 p-3 rounded border border-paper-300">
              <div className="flex items-center gap-1.5 text-sunset-600 font-mono font-bold text-[11px] mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>KEY CHALLENGE FACED</span>
              </div>
              <p className="text-charcoal-700 text-xs leading-relaxed">{activeStage.keyChallenge}</p>
            </div>

            <div className="bg-paper-50 p-3 rounded border border-paper-300">
              <div className="flex items-center gap-1.5 text-moss-700 font-mono font-bold text-[11px] mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>KEY MILESTONE ACHIEVED</span>
              </div>
              <p className="text-charcoal-700 text-xs leading-relaxed">{activeStage.milestone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
