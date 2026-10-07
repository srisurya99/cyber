import React from 'react';
import { Incident } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArrowRight, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RecentActivityProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onViewAll: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  incidents,
  onSelectIncident,
  onViewAll,
}) => {
  const { t, language } = useLanguage();

  const totalIncidents = incidents.length;
  const totalEvidence = incidents.reduce((sum, inc) => sum + (inc.evidence?.length || 0), 0);
  const openActions = incidents.reduce((sum, inc) => {
    return sum + (inc.actions?.filter(a => !a.is_completed).length || 0);
  }, 0);

  const recentIncidents = incidents.slice(0, 4);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {t('yourDigitalSafety')}
        </h3>
        {totalIncidents > 0 && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 p-1 rounded focus:outline-none"
          >
            <span>{language === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Metric counters (clean, quiet, anti-slop) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4">
          <p className="text-xs font-medium text-slate-500">{t('statIncidents')}</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{totalIncidents}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4">
          <p className="text-xs font-medium text-slate-500">{t('statEvidenceSaved')}</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{totalEvidence}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4">
          <p className="text-xs font-medium text-slate-500">{t('statOpenActions')}</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-0.5">{openActions}</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('recentActivity')}
          </span>
          <span className="text-xs text-slate-400">
            {language === 'te' ? 'తాజా సంఘటనలు' : 'Recent Cases'}
          </span>
        </div>

        {recentIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            {t('noRecentActivity')}
          </div>
        ) : (
          recentIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className="px-4 sm:px-6 py-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <RiskBadge level={inc.risk_level} size="sm" />
                  <span className="text-xs text-slate-400 font-mono">
                    {inc.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    {inc.platform || 'Online'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-medium text-slate-900 truncate">
                  {inc.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {inc.description || (language === 'te' ? 'వివరాలు నమోదు చేయబడ్డాయి' : 'Incident recorded')}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:block text-right text-xs text-slate-400">
                  <span>
                    {inc.status === 'RESOLVED' ? t('statusResolved') : t('statusInProgress')}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
