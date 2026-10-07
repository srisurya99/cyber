import React, { useState } from 'react';
import { Incident } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ReportPreviewModal } from '../common/ReportPreviewModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateIncidentPdf } from '../../utils/pdfGenerator';
import { 
  ArrowRight, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ShieldAlert,
  Search
} from 'lucide-react';

interface IncidentListPageProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onNewCheck: () => void;
}

export const IncidentListPage: React.FC<IncidentListPageProps> = ({
  incidents,
  onSelectIncident,
  onNewCheck,
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewIncident, setPreviewIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    // Status filter
    if (filter === 'OPEN' && inc.status === 'RESOLVED') return false;
    if (filter === 'RESOLVED' && inc.status !== 'RESOLVED') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchDesc = (inc.description || '').toLowerCase().includes(q);
      const matchId = inc.id.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchId;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('navIncidents')}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {language === 'te'
              ? 'మీరు సమర్పించిన లేదా భద్రపరచిన సైబర్ సంఘటనలు మరియు రక్షణ నివేదికలు.'
              : 'Review your analyzed security events, saved evidence, and official reports.'}
          </p>
        </div>

        <button
          onClick={onNewCheck}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'te' ? 'కొత్త తనిఖీని ప్రారంభించండి' : 'New Security Check'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        
        {/* Interactive segmented filter control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? 'అన్నీ' : 'All'} ({incidents.length})
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'OPEN'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? 'చర్య కొనసాగుతోంది' : 'Open'} ({incidents.filter(i => i.status !== 'RESOLVED').length})
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'RESOLVED'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? 'పరిష్కరించబడింది' : 'Resolved'} ({incidents.filter(i => i.status === 'RESOLVED').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'te' ? 'శోధించండి...' : 'Search incidents...'}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Clean Incidents List */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800">
              {language === 'te' ? 'సంఘటనలు కనుగొనబడలేదు' : 'No incidents match your filter'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t('noRecentActivity')}
            </p>
            <button
              onClick={onNewCheck}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{t('startSafetyCheckBtn')}</span>
            </button>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => onSelectIncident(incident.id)}
              className="p-5 sm:p-6 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <RiskBadge level={incident.risk_level} size="sm" />
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {incident.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    {incident.platform || 'Online'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-400">
                    {new Date(incident.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {incident.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  {incident.description || (language === 'te' ? 'వివరాలు నమోదు చేయబడ్డాయి.' : 'Incident documented.')}
                </p>

                {incident.financial_loss && incident.financial_loss > 0 ? (
                  <div className="mt-2 text-xs font-semibold text-red-600">
                    Loss: ₹{incident.financial_loss.toLocaleString()}
                  </div>
                ) : null}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIncident(incident);
                  }}
                  title="Download Official PDF Report"
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="text-right">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${
                    incident.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {incident.status === 'RESOLVED' ? t('statusResolved') : t('statusInProgress')}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Forensic Report Preview Modal */}
      <ReportPreviewModal
        isOpen={!!previewIncident}
        onClose={() => setPreviewIncident(null)}
        incident={previewIncident}
      />

    </div>
  );
};
