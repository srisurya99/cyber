import React, { useState } from 'react';
import { AnalysisResult, Incident } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { ReportPreviewModal } from '../common/ReportPreviewModal';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateIncidentPdf } from '../../utils/pdfGenerator';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Upload, 
  Download,
  RefreshCw, 
  ExternalLink,
  Code,
  AlertOctagon
} from 'lucide-react';

interface PhishingResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onGetHelp: () => void;
  onSaveAsIncident: (incident: Incident) => void;
  submissionContent?: string;
}

export const PhishingResultView: React.FC<PhishingResultViewProps> = ({
  result,
  onReset,
  onGetHelp,
  onSaveAsIncident,
  submissionContent = '',
}) => {
  const { t, language } = useLanguage();
  const [showTechnical, setShowTechnical] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [previewIncident, setPreviewIncident] = useState<Incident | null>(null);

  const isHighRisk = result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL';

  const handleSave = () => {
    const incId = `TL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newIncident: Incident = {
      id: incId,
      type: 'phishing',
      title: `Phishing Detection: ${result.risk_level} Risk Verification`,
      description: submissionContent || result.summary,
      risk_level: result.risk_level,
      status: result.risk_level === 'LOW' ? 'RESOLVED' : 'OPEN',
      platform: 'Analyzed Link / Message',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: submissionContent ? [
        {
          id: `ev-${Date.now()}`,
          incident_id: incId,
          type: 'message',
          title: 'Submitted Text / URL Content',
          notes: submissionContent.slice(0, 300),
          created_at: new Date().toISOString(),
        }
      ] : [],
      timeline: [
        {
          id: `tl-1-${Date.now()}`,
          incident_id: incId,
          event_type: 'reported_to_threatlens',
          title: 'Phishing inspection completed',
          description: `Flagged as ${result.risk_level} risk (${result.confidence}% calibrated confidence).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      actions: result.recommendations.map((rec, idx) => ({
        id: `act-${idx}-${Date.now()}`,
        incident_id: incId,
        priority: idx + 1,
        title: rec,
        description: 'Recommended safe action.',
        is_completed: false,
      })),
      analysis: result,
    };

    onSaveAsIncident(newIncident);
    setIsSaved(true);
  };

  const handleDownloadReport = () => {
    const incId = `TL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const tempIncident: Incident = {
      id: incId,
      type: 'phishing',
      title: `Phishing Forensic Analysis Report`,
      description: submissionContent || result.summary,
      risk_level: result.risk_level,
      status: 'OPEN',
      platform: 'Analyzed URL / Email',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: [
        {
          id: `ev-rep-phish`,
          incident_id: incId,
          type: 'url',
          title: 'Analyzed Content Item',
          notes: submissionContent || 'Suspicious submission',
          created_at: new Date().toISOString(),
        }
      ],
      timeline: [
        {
          id: `tl-phish-rep`,
          incident_id: incId,
          event_type: 'analysis_run',
          title: 'Inspection Completed',
          description: `${result.risk_level} (${result.confidence}% confidence).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      actions: result.recommendations.map((rec, idx) => ({
        id: `act-p-${idx}`,
        incident_id: incId,
        priority: idx + 1,
        title: rec,
        description: 'Defensive recommendation.',
        is_completed: false,
      })),
      analysis: result,
    };

    setPreviewIncident(tempIncident);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-left">
      
      {/* 1. Header Banner / Main Verdict */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Detection Result:
            </span>
            <RiskBadge level={result.risk_level} size="lg" />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {result.riskScore !== undefined && result.riskScore !== null ? (
              <span>Threat Score: <strong className="text-slate-800">{result.riskScore}/100</strong></span>
            ) : result.confidence ? (
              <span>Model Confidence: <strong className="text-slate-800">{result.confidence}%</strong></span>
            ) : (
              <span>Verified Rule Engine</span>
            )}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {result.summary}
        </h3>
        
        {result.disclaimer && (
          <p className="text-xs text-slate-500 mt-2 italic">
            {result.disclaimer}
          </p>
        )}
      </div>

      {/* 2. Why we flagged it */}
      <div>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{t('whyWeFlaggedTitle')}</span>
        </h4>
        <ul className="space-y-2">
          {result.findings.map((finding, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. What should you do? */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>{t('whatShouldYouDoTitle')}</span>
        </h4>
        <ol className="space-y-2.5">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="font-medium">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 4. Action Buttons adhering to Unified Button Design System */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Upload / Save Evidence Button */}
          <ThreatLensButton
            variant="primary"
            size="md"
            icon={isSaved ? CheckCircle2 : Upload}
            onClick={handleSave}
            disabled={isSaved}
            className="flex-1 sm:flex-initial"
          >
            {isSaved ? 'Evidence Saved' : 'Upload Evidence'}
          </ThreatLensButton>

          {/* Download Report Button */}
          <ThreatLensButton
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleDownloadReport}
            className="flex-1 sm:flex-initial"
          >
            Download Report
          </ThreatLensButton>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Try Another Link Button */}
          <ThreatLensButton
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={onReset}
            className="flex-1 sm:flex-initial"
          >
            Try Another Link
          </ThreatLensButton>

          {/* Get Immediate Help Button */}
          {isHighRisk && (
            <ThreatLensButton
              variant="safety"
              size="md"
              icon={AlertOctagon}
              onClick={onGetHelp}
              className="flex-1 sm:flex-initial"
            >
              Get Immediate Help
            </ThreatLensButton>
          )}
        </div>

      </div>

      {/* 5. View Analysis / Technical Telemetry (Subtle Outlined Expander) */}
      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            <span>{showTechnical ? 'Hide Technical Signals' : 'View Analysis Signals'}</span>
          </span>
          {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnical && (
          <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-3 overflow-x-auto text-left">
            <div className="text-slate-400 border-b border-slate-800 pb-1 font-bold">
              // ThreatLens URL & Linguistic Analysis Engine Signals
            </div>
            <div>
              <span className="text-blue-400">Risk Assessment:</span> {result.risk_level} 
              {result.riskScore !== undefined && result.riskScore !== null && (
                <span className="ml-2 text-slate-400">(Score: {result.riskScore}/100)</span>
              )}
            </div>

            {result.checksPerformed && result.checksPerformed.length > 0 && (
              <div>
                <div className="text-emerald-400 font-semibold mb-1">✓ Checks Performed:</div>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-300 text-[11px]">
                  {result.checksPerformed.map((chk, i) => (
                    <li key={i}>{chk}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.checksUnavailable && result.checksUnavailable.length > 0 && (
              <div>
                <div className="text-amber-400 font-semibold mb-1">⚠ Checks Unavailable / Scope Boundaries:</div>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-400 text-[11px]">
                  {result.checksUnavailable.map((chk, i) => (
                    <li key={i}>{chk}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.technical_signals && (
              <pre className="whitespace-pre-wrap text-[11px] text-cyan-300 mt-2 p-2 bg-slate-950 rounded border border-slate-800">
                {JSON.stringify(result.technical_signals, null, 2)}
              </pre>
            )}
          </div>
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
