import React from 'react';
import { Share2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Incident } from '../../types';
import { correlateIncidentIndicators } from '../../services/correlation/correlationEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface CorrelationBadgeProps {
  currentIncident: Incident;
  allIncidents: Incident[];
}

export const CorrelationBadge: React.FC<CorrelationBadgeProps> = ({
  currentIncident,
  allIncidents,
}) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const correlation = correlateIncidentIndicators(currentIncident, allIncidents);

  if (!correlation.hasCorrelation) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>{isTe ? 'ఇతర నివేదికలతో సాంకేతిక సూచికల సారూప్యత లేదు' : 'No related campaign indicators detected in other reports.'}</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1.5 animate-in fade-in duration-150">
      <div className="flex items-center gap-2 font-bold text-indigo-900">
        <Share2 className="w-4 h-4 text-indigo-600" />
        <span>
          {isTe
            ? `సాంకేతిక సారూప్యత గుర్తించబడింది: ${correlation.matchedCount} ఇతర నివేదికలతో సరిపోలింది`
            : `Possible relationship detected: ${correlation.matchedCount} other incident report(s) share indicators`}
        </span>
      </div>
      <p className="text-indigo-950/80 leading-relaxed">
        {correlation.privacyPreservingNote}
      </p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {Array.from(new Set(correlation.correlations.map(c => `${c.indicatorType}: ${c.matchedIndicator}`))).map((ind, idx) => (
          <span key={idx} className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-900">
            {ind}
          </span>
        ))}
      </div>
    </div>
  );
};
