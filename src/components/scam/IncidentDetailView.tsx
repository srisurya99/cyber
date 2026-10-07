import React, { useState } from 'react';
import { Incident, EvidenceItem } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { ReportPreviewModal } from '../common/ReportPreviewModal';
import { CorrelationBadge } from '../correlation/CorrelationBadge';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateIncidentPdf } from '../../utils/pdfGenerator';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  Trash2, 
  Plus, 
  FileText, 
  PhoneCall, 
  Clock, 
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Lock,
  ExternalLink
} from 'lucide-react';

interface IncidentDetailViewProps {
  incident: Incident;
  allIncidents?: Incident[];
  onBack: () => void;
  onToggleAction: (incidentId: string, actionId: string) => void;
  onAddEvidence: (incidentId: string, evidence: EvidenceItem) => void;
  onDeleteEvidence: (incidentId: string, evidenceId: string) => void;
  onAddTimelineEvent: (incidentId: string, event: { event_type: string; title: string; description: string; timestamp: string }) => void;
  onDeleteIncident: (incidentId: string) => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incident,
  allIncidents = [],
  onBack,
  onToggleAction,
  onAddEvidence,
  onDeleteEvidence,
  onAddTimelineEvent,
  onDeleteIncident,
}) => {
  const { t, language } = useLanguage();

  // State for adding evidence modal/inline form
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evidenceType, setEvidenceType] = useState<EvidenceItem['type']>('screenshot');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // State for manual timeline event
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim()) return;

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      incident_id: incident.id,
      type: evidenceType,
      title: evidenceTitle,
      notes: evidenceNotes,
      file_name: evidenceType === 'screenshot' ? 'evidence_screen.png' : undefined,
      created_at: new Date().toISOString(),
    };

    onAddEvidence(incident.id, newEvidence);
    setEvidenceTitle('');
    setEvidenceNotes('');
    setShowAddEvidence(false);
  };

  const handleAddTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineTitle.trim()) return;

    onAddTimelineEvent(incident.id, {
      event_type: 'reported_to_threatlens',
      title: timelineTitle,
      description: timelineDesc,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setTimelineTitle('');
    setTimelineDesc('');
    setShowAddTimeline(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'te' ? 'సంఘటనల జాబితాకు తిరిగి వెళ్లండి' : 'Back to Incidents'}</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <ThreatLensButton
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => setIsPreviewModalOpen(true)}
          >
            Download Report
          </ThreatLensButton>

          <ThreatLensButton
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => {
              if (confirm('Are you sure you want to permanently delete this incident record?')) {
                onDeleteIncident(incident.id);
                onBack();
              }
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <span className="hidden sm:inline">{t('btnDeleteIncident')}</span>
          </ThreatLensButton>
        </div>
      </div>

      {/* Incident Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-slate-800">
              {incident.id}
            </span>
            <span className="text-slate-300">·</span>
            <RiskBadge level={incident.risk_level} size="md" />
            <span className="text-slate-300">·</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              incident.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
            }`}>
              {incident.status === 'RESOLVED' ? t('statusResolved') : t('statusInProgress')}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            {new Date(incident.created_at).toLocaleDateString()}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {incident.title}
        </h2>

        {incident.financial_loss && incident.financial_loss > 0 ? (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200">
            <span>Stolen / Transferred Amount:</span>
            <span className="font-mono text-sm">₹{incident.financial_loss.toLocaleString()}</span>
          </div>
        ) : null}

        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          {incident.description || (language === 'te' ? 'సంఘటన నమోదు చేయబడింది.' : 'Digital incident documented on ThreatLens.')}
        </p>

        {/* Golden Hour / 1930 quick call bar */}
        <div className="mt-5 p-3.5 bg-red-50/70 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-red-900">
            <PhoneCall className="w-4 h-4 text-red-700 shrink-0" />
            <span>National Cyber Crime Reporting Helpline (24x7): <strong>1930</strong></span>
          </div>
          <a
            href="tel:1930"
            className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
          >
            Call 1930 Now
          </a>
        </div>

        {/* Privacy-Preserving Incident Correlation Callout */}
        {allIncidents.length > 0 && (
          <div className="mt-4">
            <CorrelationBadge currentIncident={incident} allIncidents={allIncidents} />
          </div>
        )}
      </div>

      {/* Section 1: Recommended Actions Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('recommendedActions')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'te'
                ? 'ప్రాధాన్యతా క్రమంలో ఈ చర్యలను పూర్తి చేయండి.'
                : 'Follow these prioritized actions to mitigate risk and safeguard your funds.'}
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {incident.actions.filter(a => a.is_completed).length} / {incident.actions.length} {language === 'te' ? 'పూర్తయ్యాయి' : 'Done'}
          </div>
        </div>

        <div className="space-y-3">
          {incident.actions.map((action, idx) => (
            <div
              key={action.id}
              onClick={() => onToggleAction(incident.id, action.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                action.is_completed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : action.urgent
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={action.is_completed}
                onChange={() => {}} // handled by parent div
                className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <h4 className={`text-sm font-semibold ${action.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {action.title}
                  </h4>
                  {action.urgent && !action.is_completed && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-800 rounded">
                      URGENT
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {action.description}
                </p>

                {action.official_link && (
                  <div className="mt-2">
                    <a
                      href={action.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Evidence Collection */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('evidenceCollection')} ({incident.evidence?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('privacyNotice')}
            </p>
          </div>
          <ThreatLensButton
            variant="primary"
            size="sm"
            icon={Upload}
            onClick={() => setShowAddEvidence(!showAddEvidence)}
          >
            Upload Evidence
          </ThreatLensButton>
        </div>

        {/* Add Evidence Modal / Inline Form */}
        {showAddEvidence && (
          <form onSubmit={handleAddEvidenceSubmit} className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="screenshot">Screenshot (Chat/Payment)</option>
                  <option value="transaction">Transaction Screenshot / UTR</option>
                  <option value="message">Chat / SMS Transcript</option>
                  <option value="url">Malicious URL / Website</option>
                  <option value="phone">Phone Number / Caller ID</option>
                  <option value="social_profile">Social Media Profile Handle</option>
                  <option value="document">Document / PDF</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Identifier</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. WhatsApp Chat with Scammer"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Context (e.g. UTR number, recipient handle)</label>
              <input
                type="text"
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="e.g. UTR: 326798124982, sent at 11:20 AM"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddEvidence(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                {t('save')}
              </button>
            </div>
          </form>
        )}

        {/* Evidence List */}
        {(!incident.evidence || incident.evidence.length === 0) ? (
          <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl">
            No evidence files attached yet. Add screenshots or transaction IDs to strengthen your official cybercrime report.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {incident.evidence.map((ev) => (
              <div key={ev.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span className="uppercase text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">
                      {ev.type}
                    </span>
                    <span className="truncate">{ev.title}</span>
                  </div>
                  {ev.notes && (
                    <p className="text-slate-600 mt-1 line-clamp-2">
                      {ev.notes}
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Recorded: {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteEvidence(incident.id, ev.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Delete evidence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Incident Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {t('incidentTimeline')}
          </h3>
          <button
            onClick={() => setShowAddTimeline(!showAddTimeline)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 p-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Add timeline modal/inline */}
        {showAddTimeline && (
          <form onSubmit={handleAddTimelineSubmit} className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
              <input
                type="text"
                value={timelineTitle}
                onChange={(e) => setTimelineTitle(e.target.value)}
                placeholder="e.g. Bank fraud division confirmed complaint lodged"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Details</label>
              <input
                type="text"
                value={timelineDesc}
                onChange={(e) => setTimelineDesc(e.target.value)}
                placeholder="e.g. Provided complaint acknowledgment number #5892"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddTimeline(false)}
                className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Visual timeline */}
        <div className="relative pl-6 space-y-5 border-l-2 border-slate-200 ml-2">
          {incident.timeline?.map((evt) => (
            <div key={evt.id} className="relative group">
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
              <div>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {evt.timestamp}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                  {evt.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Forensic PDF Preview Modal */}
      <ReportPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        incident={incident}
      />

    </div>
  );
};
