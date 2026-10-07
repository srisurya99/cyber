import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back to ThreatLens',
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </button>
  );
};
