import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Loader2,
  XCircle,
  ShieldOff,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type AIDetectionStatus = 
  | 'analyzing'
  | 'likely_ai' 
  | 'possible_manipulation' 
  | 'no_clear_signs' 
  | 'inconclusive' 
  | 'detection_unavailable'
  | 'analysis_failed';

interface AIDetectionBadgeProps {
  status: AIDetectionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  confidence?: number | null;
}

export const AIDetectionBadge: React.FC<AIDetectionBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  confidence,
}) => {
  const { language } = useLanguage();

  const configs: Record<AIDetectionStatus, {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    dotColor: string;
  }> = {
    analyzing: {
      label: language === 'te' ? 'విశ్లేషణ కొనసాగుతోంది...' : 'Analyzing Image...',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: Loader2,
      iconColor: 'text-blue-600',
      dotColor: 'bg-blue-600',
    },
    likely_ai: {
      label: language === 'te' ? 'AI సృష్టించినదిగా గుర్తించబడింది' : 'Likely AI-Generated',
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: AlertOctagon,
      iconColor: 'text-red-600',
      dotColor: 'bg-red-600',
    },
    possible_manipulation: {
      label: language === 'te' ? 'మార్ఫింగ్ లేదా మార్పులు సాధ్యమే' : 'Possible Manipulation',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
    },
    no_clear_signs: {
      label: language === 'te' ? 'సందేహాస్పద సంకేతాలు కనిపించలేదు' : 'No Clear Signs Detected',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      dotColor: 'bg-emerald-600',
    },
    inconclusive: {
      label: language === 'te' ? 'నిర్ధారణకు రాలేని ఫలితం' : 'Inconclusive',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: HelpCircle,
      iconColor: 'text-slate-500',
      dotColor: 'bg-slate-400',
    },
    detection_unavailable: {
      label: language === 'te' ? 'డిటెక్టర్ సేవ అందుబాటులో లేదు' : 'Detection Unavailable',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: ShieldOff,
      iconColor: 'text-orange-600',
      dotColor: 'bg-orange-500',
    },
    analysis_failed: {
      label: language === 'te' ? 'విశ్లేషణ విఫలమైంది' : 'Analysis Failed',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-600',
      dotColor: 'bg-rose-600',
    },
  };

  const config = configs[status] || configs.inconclusive;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1 font-medium',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 rounded-xl gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span 
      className={`inline-flex items-center border ${config.bg} ${config.text} ${config.border} ${sizeClasses} transition-colors select-none`}
    >
      {showIcon && (
        <IconComponent 
          className={`${iconSizes} ${config.iconColor} shrink-0 ${status === 'analyzing' ? 'animate-spin' : ''}`} 
        />
      )}
      <span>{config.label}</span>
      {typeof confidence === 'number' && 
       confidence > 0 && 
       status !== 'analyzing' && 
       status !== 'detection_unavailable' && 
       status !== 'analysis_failed' && 
       status !== 'inconclusive' && (
        <span className="font-mono text-[10px] opacity-80 pl-1 border-l border-current/20 ml-0.5">
          {confidence}%
        </span>
      )}
    </span>
  );
};
