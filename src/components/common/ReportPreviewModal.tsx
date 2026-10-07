import React, { useState, useEffect } from 'react';
import { Incident } from '../../types';
import { getIncidentPdfPreview, generateIncidentPdf } from '../../utils/pdfGenerator';
import { ThreatLensButton } from './ThreatLensButton';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Printer,
  Eye,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const { language } = useLanguage();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !incident) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      setDownloadSuccess(false);
      setErrorMessage(null);
      return;
    }

    setIsGenerating(true);
    setDownloadSuccess(false);
    setErrorMessage(null);

    try {
      // Validate incident record
      if (!incident.id || !incident.title) {
        throw new Error('Incident data incomplete or missing mandatory identifiers.');
      }

      const preview = getIncidentPdfPreview(incident);
      setBlobUrl(preview.blobUrl);
      setFilename(preview.filename);
      setPageCount(preview.pageCount);
      setFileSizeBytes(preview.sizeBytes);
    } catch (err: any) {
      console.error('PDF preview error:', err);
      setErrorMessage(err?.message || 'Failed to render PDF document preview.');
    } finally {
      setIsGenerating(false);
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, incident]);

  if (!isOpen || !incident) return null;

  const handleDownload = () => {
    try {
      const generatedName = generateIncidentPdf(incident);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      console.error('PDF download error:', err);
      setErrorMessage('Failed to trigger PDF download: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-left"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate">
                Forensic Report Preview · {filename || incident.id}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {pageCount > 0 ? `${pageCount} Pages` : 'Generating...'} · {(fileSizeBytes / 1024).toFixed(1)} KB · ThreatLens Forensic v1.2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Frame */}
        <div className="flex-1 bg-slate-100 p-3 sm:p-5 overflow-y-auto min-h-[420px] flex flex-col items-center justify-center">
          {isGenerating ? (
            <div className="text-center p-8 space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600 font-mono">
                Compiling multi-page forensic vector report...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="max-w-md p-5 bg-red-50 border border-red-200 rounded-xl text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
              <h4 className="text-sm font-bold text-red-900">PDF Generation Notice</h4>
              <p className="text-xs text-red-700">{errorMessage}</p>
              <ThreatLensButton variant="secondary" size="sm" onClick={onClose}>
                Close
              </ThreatLensButton>
            </div>
          ) : blobUrl ? (
            <div className="w-full h-[520px] bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <iframe
                src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title="Incident Report PDF Preview"
                className="w-full h-full border-0"
              />
            </div>
          ) : null}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-slate-600">
            {downloadSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Download initiated successfully ({filename})</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                Admissible format for Bank Fraud Dep. & 1930 / cybercrime.gov.in
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <ThreatLensButton
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Close
            </ThreatLensButton>

            <ThreatLensButton
              variant="prominent"
              size="md"
              icon={Download}
              onClick={handleDownload}
              disabled={isGenerating || !!errorMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {downloadSuccess ? 'Downloaded!' : 'Download Official PDF Report'}
            </ThreatLensButton>
          </div>

        </div>

      </div>
    </div>
  );
};
