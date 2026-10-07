import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  stages?: string[];
  defaultMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  stages = [
    'Checking your submission...',
    'Analyzing suspicious signals...',
    'Preparing your result...',
  ],
  defaultMessage,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (!stages || stages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStageIdx(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [stages]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
      <div className="relative mb-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <p className="text-base font-medium text-slate-800">
        {defaultMessage || stages[currentStageIdx]}
      </p>
      <p className="text-xs text-slate-500 mt-2">
        ThreatLens AI security engine processing
      </p>
      
      {/* Subtle stage indicator */}
      {stages.length > 1 && (
        <div className="flex items-center gap-1.5 mt-5">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStageIdx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
