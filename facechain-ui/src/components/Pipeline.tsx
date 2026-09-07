import React from 'react';
import { PipelineStage } from '../types/verification';

interface PipelineProps {
  currentStage: PipelineStage;
}

const stages: { id: PipelineStage; label: string; index: string }[] = [
  { id: 'upload', label: 'IMAGE INPUT', index: '01' },
  { id: 'detect', label: 'FACE DETECTION', index: '02' },
  { id: 'encode', label: 'FACE ENCODING', index: '03' },
  { id: 'search', label: 'REVERSE SEARCH', index: '04' },
  { id: 'match', label: 'MATCH VERIFICATION', index: '05' },
  { id: 'blockchain', label: 'BLOCKCHAIN', index: '06' },
];

const Pipeline: React.FC<PipelineProps> = ({ currentStage }) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 xl:gap-2 justify-between">
      {stages.map((stage, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div key={stage.id} className={`flex xl:flex-col items-center xl:items-start gap-4 xl:gap-2 group transition-opacity flex-1 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs ${isCurrent ? 'text-fc-pink' : (isPast ? 'text-fc-yellow' : 'text-fc-emerald-light')}`}>
                {stage.index}
              </span>
              {/* Desktop horizontal connector */}
              {i < stages.length - 1 && (
                <div className="hidden xl:block h-px w-8 bg-fc-emerald-light/30 ml-2" />
              )}
            </div>
            
            <div className="flex flex-col flex-grow xl:flex-grow-0 border-b xl:border-b-0 xl:border-l border-fc-emerald-light/30 pb-2 xl:pb-0 xl:pl-3 xl:h-full">
              <span className={`font-sans tracking-widest text-xs uppercase mb-1 ${isCurrent ? 'text-fc-cream' : (isPast ? 'text-fc-cream opacity-80' : 'text-fc-emerald-light')}`}>
                {stage.label}
              </span>
              <span className={`font-mono text-[9px] tracking-[0.1em] uppercase ${isCurrent ? 'text-fc-pink animate-pulse' : (isPast ? 'text-fc-yellow' : 'text-fc-emerald-light')}`}>
                {isPast ? 'COMPLETE ✓' : isCurrent ? 'RUNNING...' : 'WAITING'}
              </span>
            </div>
            
            {/* Visual Indicator for mobile */}
            <div className="xl:hidden flex items-center justify-center w-4">
              {isCurrent && (
                <div className="w-2 h-2 rounded-full bg-fc-pink shadow-[0_0_8px_#FF1688]" />
              )}
              {isPast && (
                <div className="w-1.5 h-1.5 rounded-full bg-fc-yellow opacity-50" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Pipeline;
