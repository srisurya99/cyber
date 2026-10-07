import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ThreatLensBackButtonProps {
  label?: string;
  onBack?: () => void;
  className?: string;
}

export const ThreatLensBackButton: React.FC<ThreatLensBackButtonProps> = ({
  label,
  onBack,
  className = '',
}) => {
  const { language } = useLanguage();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
      window.history.back();
    }
  };

  const defaultLabel = language === 'te' ? 'వెనుకకు (ThreatLens)' : 'Back to ThreatLens';

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 shadow-2xs transition-all cursor-pointer select-none group ${className}`}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
      <span>{label || defaultLabel}</span>
    </button>
  );
};
