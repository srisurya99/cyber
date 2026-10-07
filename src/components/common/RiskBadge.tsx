import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const { t } = useLanguage();

  const config = {
    LOW: {
      text: t('riskLow') || 'Low Risk',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
    },
    SUSPICIOUS: {
      text: t('riskSuspicious') || 'Suspicious',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
    },
    HIGH: {
      text: t('riskHigh') || 'High Risk',
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      dotColor: 'bg-orange-500',
    },
    CRITICAL: {
      text: t('riskCritical') || 'Critical Risk',
      bg: 'bg-red-50 text-red-800 border-red-200',
      icon: AlertOctagon,
      iconColor: 'text-red-600',
      dotColor: 'bg-red-600',
    },
    INCONCLUSIVE: {
      text: 'Inconclusive',
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: HelpCircle,
      iconColor: 'text-slate-500',
      dotColor: 'bg-slate-400',
    },
  }[level] || {
    text: level,
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: HelpCircle,
    iconColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-md gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 rounded-lg gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span className={`inline-flex items-center border font-medium ${config.bg} ${sizeClasses}`}>
      {showIcon && <IconComponent className={`${iconSizes} ${config.iconColor} shrink-0`} />}
      <span>{config.text}</span>
    </span>
  );
};
