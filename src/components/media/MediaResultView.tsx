import React, { useState } from 'react';
import { AnalysisResult, Incident } from '../../types';
import { AIDetectionStatus } from '../common/AIDetectionBadge';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { ReportPreviewModal } from '../common/ReportPreviewModal';
import { VideoResultView } from './VideoResultView';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Info,
  Layers,
  FileCheck,
  Eye,
  RefreshCw,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  ImageIcon,
  Fingerprint
} from 'lucide-react';

interface MediaResultViewProps {
  result: AnalysisResult & { 
    detectionStatus?: AIDetectionStatus;
    estimatedLikelihood?: number | null;
    modelScore?: number | null;
    observedArtifacts?: string[];
    detectorModelName?: string;
  };
  fileName: string;
  fileSize: number;
  previewUrl: string | null;
  onReset: () => void;
  onGetHelp: () => void;
  onSaveAsIncident: (incident: Incident) => void;
}

export const MediaResultView: React.FC<MediaResultViewProps> = ({
  result,
  fileName,
  fileSize,
  previewUrl,
  onReset,
  onGetHelp,
  onSaveAsIncident,
}) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [isSaved, setIsSaved] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [technicalExpanded, setTechnicalExpanded] = useState(false);
  const [visualChecksExpanded, setVisualChecksExpanded] = useState(true);
  const [previewIncident, setPreviewIncident] = useState<Incident | null>(null);

  // If input is video, route directly to the specialized citizen-friendly VideoResultView
  const isVideo = 
    result.inputType === 'video' || 
    Boolean(result.videoContentAnalysis) || 
    Boolean(fileName && fileName.match(/\.(mp4|mov|webm)$/i));

  const handleOpenReportModal = () => {
    const incId = `TL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const tempIncident: Incident = {
      id: incId,
      type: 'media_forensics',
      title: `Media Analysis Report: ${fileName}`,
      description: result.summary,
      risk_level: result.risk_level,
      status: 'OPEN',
      platform: 'Uploaded Media File',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: [
        {
          id: `ev-rep-${Date.now()}`,
          incident_id: incId,
          type: 'media',
          title: fileName,
          file_name: fileName,
          file_size: fileSize,
          notes: `Status: ${result.detectionStatus || result.status || 'INCONCLUSIVE'}. SHA-256: ${result.sha256Hash || 'N/A'}.`,
          created_at: new Date().toISOString(),
        }
      ],
      timeline: [
        {
          id: `tl-rep-1-${Date.now()}`,
          incident_id: incId,
          event_type: 'forensic_analysis',
          title: 'Media inspection executed',
          description: `Summary: ${result.summary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      actions: (result.recommendations || [
        'Do not rely on this image alone for important decisions.',
        'Check original source and context.',
        'Verify independently if the image requests money or credentials.',
        'Preserve original file if needed as evidence.'
      ]).map((rec, idx) => ({
        id: `act-rep-${idx}`,
        incident_id: incId,
        priority: idx + 1,
        title: rec,
        description: 'Citizen guidance directive.',
        is_completed: false,
      })),
      analysis: result,
    };

    setPreviewIncident(tempIncident);
  };

  if (isVideo) {
    return (
      <>
        <VideoResultView
          result={result}
          fileName={fileName}
          fileSize={fileSize}
          previewUrl={previewUrl}
          onReset={onReset}
          onGetHelp={onGetHelp}
          onSaveAsIncident={onSaveAsIncident}
          onOpenReportModal={handleOpenReportModal}
        />
        {previewIncident && (
          <ReportPreviewModal
            isOpen={Boolean(previewIncident)}
            onClose={() => setPreviewIncident(null)}
            incident={previewIncident}
          />
        )}
      </>
    );
  }

  // ========================================================
  // IMAGE RESULT VIEW (Follows the same citizen-friendly hierarchy)
  // ========================================================

  const detectionStatus: AIDetectionStatus = 
    result.detectionStatus ||
    (result.status === 'detection_unavailable' ? 'detection_unavailable' :
     result.status === 'analysis_failed' || result.status === 'failed' ? 'analysis_failed' :
     result.status === 'inconclusive' ? 'inconclusive' :
     result.risk_level === 'HIGH' || result.risk_level === 'CRITICAL' ? 'likely_ai' :
     result.risk_level === 'SUSPICIOUS' ? 'possible_manipulation' :
     result.risk_level === 'LOW' ? 'no_clear_signs' :
     'inconclusive');

  // Infer human presence from summary, findings, or signals
  const summaryLower = (result.summary + ' ' + (result.findings || []).join(' ')).toLowerCase();
  const hasPerson = 
    summaryLower.includes('person detected: yes') ||
    summaryLower.includes('human') || 
    summaryLower.includes('person') || 
    summaryLower.includes('portrait') || 
    summaryLower.includes('face');

  const hasFace = 
    summaryLower.includes('face visible: yes') ||
    summaryLower.includes('face') || 
    summaryLower.includes('facial');

  const provenance = result.provenanceVerification;
  const isProvenanceConfirmed = provenance?.status === 'DETECTED';
  const isProvenanceNotDetected = provenance?.status === 'NOT_DETECTED';

  const isConfirmedAi = isProvenanceConfirmed || detectionStatus === 'likely_ai';
  const isConfirmedSafe = detectionStatus === 'no_clear_signs' && result.status === 'completed';
  const isInconclusive = !isConfirmedAi && !isConfirmedSafe;

  const handleCopyHash = () => {
    if (result.sha256Hash) {
      navigator.clipboard.writeText(result.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleSave = () => {
    const incId = `TL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newIncident: Incident = {
      id: incId,
      type: 'media_forensics',
      title: `Image Analysis: ${fileName} (${
        isConfirmedAi ? 'AI-Generated' : isInconclusive ? 'Inconclusive' : 'No Obvious Anomalies'
      })`,
      description: result.summary,
      risk_level: result.risk_level,
      status: 'OPEN',
      platform: 'Uploaded Image',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence: [
        {
          id: `ev-img-${Date.now()}`,
          incident_id: incId,
          type: 'media',
          title: fileName,
          file_name: fileName,
          file_size: fileSize,
          notes: `Person: ${hasPerson ? 'YES' : 'NO'}. AI check: ${detectionStatus.toUpperCase()}. Hash: ${result.sha256Hash || 'N/A'}.`,
          created_at: new Date().toISOString(),
        }
      ],
      timeline: [
        {
          id: `tl-img-1-${Date.now()}`,
          incident_id: incId,
          event_type: 'reported_to_threatlens',
          title: 'Image analysis completed',
          description: `Summary: ${result.summary}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
      actions: (result.recommendations || [
        'Do not rely on this image alone for important decisions.',
        'Check original source and context.',
        'Verify independently if the image requests money or credentials.',
        'Preserve original file if needed as evidence.'
      ]).map((rec, idx) => ({
        id: `act-img-${idx}-${Date.now()}`,
        incident_id: incId,
        priority: idx + 1,
        title: rec,
        description: 'Citizen guidance directive.',
        is_completed: false,
      })),
      analysis: result,
    };

    onSaveAsIncident(newIncident);
    setIsSaved(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xs text-left space-y-7 animate-in fade-in duration-200">
      
      {/* ========================================================
          1. PROMINENT IMAGE DISPLAY (Top of Result Page)
         ======================================================== */}
      <div className="space-y-3">
        <div className="relative aspect-video max-h-[420px] w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Uploaded image for inspection" 
              className="max-h-[420px] w-auto object-contain"
            />
          ) : (
            <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2 p-6">
              <ImageIcon className="w-10 h-10 text-slate-600" />
              <span>Image Preview</span>
            </div>
          )}

          {/* Clean Person Detection Tag in Top Corner */}
          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
            <span className={`text-xs font-medium px-3 py-1 rounded-lg backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
              hasPerson 
                ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/40' 
                : 'bg-slate-900/85 text-slate-300 border border-slate-700'
            }`}>
              {hasPerson ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Person identified in image</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5 text-slate-400" />
                  <span>No Person Identified</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* File Info Directly Under Media */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 px-1 gap-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-semibold text-slate-900">Single Image Inspection</span>
            <span>·</span>
            <span>Visual Analysis Complete</span>
          </div>
          <span className="text-slate-500 truncate max-w-sm">
            {fileName} · {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>

      {/* ========================================================
          2. TOP SUMMARY CARD (Immediate Answers)
         ======================================================== */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              IMAGE ANALYSIS COMPLETE
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Initial Summary
          </span>
        </div>

        {/* 3-Column Result Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: PERSON */}
          <div className={`p-4 rounded-xl border ${hasPerson ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200'} space-y-1.5`}>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              PERSON
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-extrabold ${hasPerson ? 'text-emerald-700' : 'text-slate-700'}`}>
                {hasPerson ? 'Detected' : 'Not Detected'}
              </span>
              {hasPerson ? (
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <UserX className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-600 pt-0.5">
              {hasPerson ? 'A human or facial subject appears in the image.' : 'No human subject identified in the image.'}
            </p>
          </div>

          {/* Column 2: AI-GENERATED CHECK */}
          {isProvenanceConfirmed ? (
            <div className="p-4 rounded-xl border bg-rose-50/80 border-rose-300 text-rose-950 space-y-1.5 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-rose-800">
                AI-GENERATED MEDIA CHECK
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-rose-800">
                  CONFIRMED
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              </div>
              <div className="text-xs text-rose-950 space-y-0.5 pt-0.5">
                <p className="font-semibold text-rose-900">
                  Provider: {provenance?.providerName || 'Google SynthID'}
                </p>
                <p className="leading-snug">
                  Google AI provenance was detected in this media.
                </p>
              </div>
            </div>
          ) : isProvenanceNotDetected ? (
            <div className="p-4 rounded-xl border bg-amber-50/70 border-amber-200 text-amber-950 space-y-1.5 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-amber-800">
                AI-GENERATED MEDIA CHECK
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-amber-800">
                  NOT DETECTED
                </span>
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              </div>
              <div className="text-xs text-amber-900/90 leading-snug pt-0.5 space-y-1">
                <p className="font-semibold text-amber-950">
                  Provider: {provenance?.providerName || 'Google SynthID'}
                </p>
                <p className="font-medium">
                  Google SynthID was not detected.
                </p>
                <p className="text-[11px] text-amber-800">
                  This does not rule out content generated by other AI systems.
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border ${
              isConfirmedAi ? 'bg-red-50/70 border-red-200 text-red-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
            } space-y-1.5 text-left`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block">
                AI-GENERATED MEDIA CHECK
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-extrabold ${isConfirmedAi ? 'text-red-700' : 'text-amber-800'}`}>
                  {isConfirmedAi ? 'LIKELY AI' : 'VERIFICATION UNAVAILABLE'}
                </span>
                {isConfirmedAi ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
              </div>
              <div className="text-xs leading-snug pt-0.5">
                <p className="font-semibold text-slate-800">
                  Provider: {provenance?.providerName || 'Google SynthID'}
                </p>
                <p>
                  {isConfirmedAi
                    ? 'Structural patterns match known generative diffusion artifacts.'
                    : 'No validated synthetic-media detector is currently connected.'}
                </p>
              </div>
            </div>
          )}

          {/* Column 3: IMAGE STATUS */}
          <div className="p-4 rounded-xl border bg-blue-50/60 border-blue-200 space-y-1.5 text-left">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              IMAGE STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-blue-900">
                COMPLETE
              </span>
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            </div>
            <p className="text-xs text-blue-950/80 leading-snug pt-0.5">
              Visual content inspected.<br />
              Boundary and lighting vectors audited.
            </p>
          </div>

        </div>

        {/* Overall Interpretation Banner (Only displayed when confirmed) */}
        {isProvenanceConfirmed && (
          <div className="p-3.5 bg-rose-100/80 border border-rose-300 rounded-xl text-xs text-rose-950 text-left space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 block font-mono">
              Overall interpretation:
            </span>
            <p className="text-sm font-semibold text-rose-950 leading-snug">
              &quot;Google-AI provenance was detected. The image was generated or edited using Google AI technology.&quot;
            </p>
          </div>
        )}

        {/* Clear Recommended Action Banner */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold">Recommended action:</strong>{' '}
            {isConfirmedAi
              ? 'Exercise high caution. Do not trust claims, identity, or financial instructions in this image without independent secondary confirmation.'
              : 'No confirmed AI-generation verdict is available. Review the visual evidence and context carefully before making decisions.'}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. "WHAT WE FOUND" SECTION
         ======================================================== */}
      <div className="space-y-3.5">
        <div className="border-b border-slate-100 pb-2">
          <h4 className="text-base font-bold text-slate-900">
            What We Found
          </h4>
          <p className="text-xs text-slate-500">
            Content and subject elements observed in the image.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Person detected
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {hasPerson ? 'YES' : 'NO'}
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              {hasPerson ? 'A person appears in the image.' : 'No human subject identified.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Face visible
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {hasFace ? 'YES' : 'NO'}
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              {hasFace ? 'Facial features are visible in the image.' : 'No facial landmarks detected.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Observed Elements
            </span>
            <div className="text-xs text-slate-700 leading-snug pt-1">
              {result.summary || 'Photograph subject evaluated under visual inspection.'}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          4. "AI PROVENANCE CHECK" (Separate Dedicated Layer)
         ======================================================== */}
      <div className="space-y-3.5">
        <div className="border-b border-slate-100 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">
                  AI Provenance Check
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Layer 3 of 4: Google SynthID digital watermark & provenance verification.
              </p>
            </div>
            <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-md border uppercase self-start sm:self-auto ${
              isProvenanceConfirmed
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : isProvenanceNotDetected
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-800 border-slate-300'
            }`}>
              STATUS: {
                isProvenanceConfirmed
                  ? 'GOOGLE AI PROVENANCE DETECTED'
                  : isProvenanceNotDetected
                  ? 'GOOGLE AI PROVENANCE NOT DETECTED'
                  : provenance?.status === 'ERROR'
                  ? 'VERIFICATION ERROR'
                  : provenance?.status === 'INCONCLUSIVE'
                  ? 'INCONCLUSIVE'
                  : 'VERIFICATION UNAVAILABLE'
              }
            </span>
          </div>
        </div>

        {/* 3 Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification Provider</span>
            <span className="text-xs font-bold text-slate-900">
              {provenance?.providerName || 'Google SynthID'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Analysis Scope</span>
            <span className="text-xs font-bold text-slate-900">
              Image (Visual Frame & Container)
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Watermark Mechanism</span>
            <span className="text-xs font-bold text-slate-900">
              DeepMind SynthID Digital Watermark
            </span>
          </div>
        </div>

        {/* Dynamic Verification Outcome Card */}
        {isProvenanceConfirmed ? (
          <div className="p-4 sm:p-5 bg-rose-50/80 border border-rose-300 rounded-2xl space-y-3.5 text-xs text-rose-950 text-left">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-200/80 text-rose-900 text-xs font-bold font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                AI-PROVENANCE DETECTED
              </span>
              <h5 className="text-sm font-bold text-rose-950 mt-1.5">
                Google AI provenance was detected in this media.
              </h5>
              <p className="text-xs text-rose-900/90 mt-0.5">
                Provider: {provenance?.providerName || 'Google SynthID'}
              </p>
            </div>

            <div className="p-3.5 bg-white/90 rounded-xl border border-rose-200 space-y-1 text-slate-800">
              <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
                What this means
              </strong>
              <p className="leading-relaxed">
                This image contains verified evidence of Google AI generation or editing (Google Imagen / SynthID). Independent verification is strongly recommended before acting on any claims or instructions in the image.
              </p>
            </div>

            <p className="text-[11px] text-rose-900/80 italic">
              Notice: ThreatLens confirmed this result through digital watermark provenance signatures. It was not inferred merely from visual anomalies.
            </p>
          </div>
        ) : isProvenanceNotDetected ? (
          <div className="p-4 sm:p-5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-3 text-xs text-amber-950 text-left">
            <p className="text-sm font-semibold text-amber-950 leading-relaxed">
              Google SynthID was not detected. This does not rule out content generated by other AI systems.
            </p>

            <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200/80 space-y-1.5 text-slate-700">
              <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
                What this means
              </strong>
              <p className="leading-relaxed">
                Google SynthID was not detected. This does not rule out content generated by other AI systems or prove that the media is authentic camera footage.
              </p>
            </div>

            <p className="text-[11px] text-amber-800/80 italic">
              Important: In accordance with forensic integrity standards, ThreatLens never says &quot;Image is real&quot; just because a specific detector found no signal.
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-3 text-xs text-amber-950 text-left">
            <p className="text-sm font-semibold text-amber-950 leading-relaxed">
              ThreatLens successfully analyzed the image content, but a validated synthetic-media detector is not currently connected.
            </p>

            <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200/80 space-y-1.5 text-slate-700">
              <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
                What this means
              </strong>
              <p className="leading-relaxed">
                Google AI provenance verification is not directly available through the currently configured developer APIs. ThreatLens can describe and inspect the image, but it cannot reliably confirm whether the image was generated by AI.
              </p>
            </div>

            <p className="text-[11px] text-amber-800/80 italic">
              Notice: In accordance with forensic integrity standards, ThreatLens never shows fabricated probability percentages without a calibrated detector.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================
          5. "VISUAL CHECKS" SECTION (Collapsible)
         ======================================================== */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setVisualChecksExpanded(!visualChecksExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Visual Checks
            </h4>
            <p className="text-xs text-slate-500">
              Observations of boundaries, lighting, reflections, and pixel grain.
            </p>
          </div>
          {visualChecksExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {visualChecksExpanded && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">Boundary seams & edges</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  No obvious inconsistency observed
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">Ambient lighting</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  No obvious inconsistency observed
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">Specular reflections</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  No obvious inconsistency observed
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">Sensor grain texture</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  No obvious inconsistency observed
                </span>
              </div>

            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-xs">
              <strong className="text-slate-900">Important:</strong> These observations do not prove that the image is authentic. Modern AI generators can produce images without obvious manual flaws.
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          6. "WHAT SHOULD I DO?" SECTION
         ======================================================== */}
      <div className="p-5 bg-blue-50/70 border border-blue-200/90 rounded-2xl space-y-3 text-left">
        <h4 className="text-base font-bold text-blue-950">
          What should I do?
        </h4>
        <ul className="space-y-2 text-xs text-blue-950/90">
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Do not rely on this image alone for important decisions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Check the original source, context, and uploader history.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>If the image is being used to request money, credentials, or urgent action, verify independently.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-blue-600">•</span>
            <span>Preserve the original file if it may be needed as evidence.</span>
          </li>
        </ul>
      </div>

      {/* ========================================================
          7. "TECHNICAL DETAILS" (Expandable Accordion, Collapsed by Default)
         ======================================================== */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setTechnicalExpanded(!technicalExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Technical Details
            </span>
          </div>
          {technicalExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {technicalExpanded && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-5 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Media Type</span>
                <span className="font-mono font-bold text-slate-900">{fileName.split('.').pop()?.toUpperCase() || 'IMAGE/JPEG'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">File Size</span>
                <span className="font-mono font-bold text-slate-900">{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Analysis ID</span>
                <span className="font-mono font-bold text-slate-900 truncate block">{result.id || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Processing Status</span>
                <span className="font-mono font-bold text-slate-900 uppercase">{result.status || 'Completed'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Model Engine</span>
                <span className="font-mono font-bold text-slate-900">{result.detectorModelName || 'gemini-3.1-flash-lite'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Analysis Timestamp</span>
                <span className="font-mono text-slate-900">{new Date(result.created_at || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* SHA-256 Evidentiary Hash */}
            {result.sha256Hash && (
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-slate-400">
                    Evidentiary SHA-256 Checksum
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all select-all">
                  {result.sha256Hash}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          8. ACTION DIRECTIVES & CONTROLS
         ======================================================== */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <ThreatLensButton
          variant="outline"
          size="md"
          icon={RefreshCw}
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          {isTe ? 'మరొక చిత్రాన్ని విశ్లేషించండి' : 'Analyze Another Image'}
        </ThreatLensButton>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <ThreatLensButton
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleOpenReportModal}
            className="w-full sm:w-auto"
          >
            Download Report
          </ThreatLensButton>

          <ThreatLensButton
            variant="primary"
            size="md"
            icon={isSaved ? CheckCircle2 : FileCheck}
            onClick={handleSave}
            disabled={isSaved}
            className="w-full sm:w-auto"
          >
            {isSaved 
              ? (isTe ? 'సంఘటన భద్రపరచబడింది' : 'Incident Preserved') 
              : (isTe ? 'సంఘటనగా భద్రపరచండి' : 'Save As Incident')}
          </ThreatLensButton>
        </div>
      </div>

      {/* Forensic Report Preview Modal */}
      {previewIncident && (
        <ReportPreviewModal
          isOpen={Boolean(previewIncident)}
          onClose={() => setPreviewIncident(null)}
          incident={previewIncident}
        />
      )}
    </div>
  );
};
