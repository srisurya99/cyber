import React, { useState } from 'react';
import { X, ExternalLink, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SafetyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (tab: 'wizard' | 'phishing' | 'media' | 'scam' | 'help', initialData?: any) => void;
}

export const SafetyCheckModal: React.FC<SafetyCheckModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
}) => {
  const { t, language } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  const options = [
    {
      id: 'wizard',
      label: language === 'te' ? 'మార్గదర్శక ఇన్సిడెంట్ విజార్డ్ (స్టెప్ బై స్టెప్ రక్షణ)' : 'Guided Incident Wizard (Step-by-step triage)',
      target: 'wizard' as const,
      hint: 'Incident Wizard',
      highlight: true,
    },
    {
      id: 'link',
      label: language === 'te' ? 'ఎవరో నాకు అనుమానాస్పద లింక్ లేదా SMS పంపించారు' : 'Someone sent me a suspicious link or SMS',
      target: 'phishing' as const,
      hint: 'Link / Message',
    },
    {
      id: 'media',
      label: language === 'te' ? 'అనుమానాస్పద ఫోటో లేదా వీడియో వచ్చింది (డీప్‌ఫేక్ / AI)' : 'Suspicious image or video (deepfake / AI provenance)',
      target: 'media' as const,
      hint: 'Media Forensics',
    },
    {
      id: 'money',
      label: language === 'te' ? 'నేను మోసపోయాను / డబ్బు నష్టపోయాను / UPI మోసం' : 'I was scammed / transferred money / financial fraud',
      target: 'scam' as const,
      hint: 'I Was Scammed',
      urgent: true,
    },
    {
      id: 'other',
      label: language === 'te' ? 'అధికారిక హెల్ప్‌లైన్ / సైబర్ క్రైమ్ 1930 గైడ్' : 'Helpline & Official Legal Escalation (1930)',
      target: 'help' as const,
      hint: 'Helpline & Resources',
    },
  ];

  const handleProceed = (target: any) => {
    onSelectRoute(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {language === 'te' ? 'మార్గదర్శక తనిఖీ' : 'Triage Guidance'}
            </span>
            <h3 id="modal-headline" className="text-xl font-bold text-slate-900 mt-0.5">
              {t('whatHappenedQuestion')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mt-3 mb-4">
          {language === 'te' 
            ? 'మీ ప్రస్తుత పరిస్థితిని ఎంచుకోండి. సరైన సాధనం మరియు మార్గదర్శకాలను మేము సిద్ధం చేస్తాము.' 
            : 'Select what best describes your situation. We will take you straight to the right safety tool.'}
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleProceed(opt.target)}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-between group min-h-[50px]"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-900">
                  {opt.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  → {opt.hint}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{t('privacyNotice')}</span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
