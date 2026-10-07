import React from 'react';
import { ArrowRight, Link, Image, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface InteractiveSafetyCheckBannerProps {
  onOpenSafetyModal: () => void;
  onSelectAction: (actionKey: 'wizard' | 'phishing' | 'media' | 'scam') => void;
}

export const InteractiveSafetyCheckBanner: React.FC<InteractiveSafetyCheckBannerProps> = ({
  onOpenSafetyModal,
  onSelectAction,
}) => {
  const { language } = useLanguage();

  return (
    <section className="py-8 border-b border-slate-200/80">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                {language === 'te' ? 'తక్షణ భద్రతా తనిఖీ' : 'Citizen Triage Entry'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {language === 'te' 
                ? 'ఏమి జరిగిందో ఎంచుకోండి — నేరుగా పరిష్కారాన్ని పొందండి' 
                : 'What happened? Select your situation for immediate triage:'}
            </h3>
          </div>

          <button
            onClick={onOpenSafetyModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-200/80 transition-colors shrink-0 cursor-pointer"
          >
            <span>{language === 'te' ? 'పూర్తి గైడ్ తెరవండి' : 'Full Guided Triage'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Interactive Quick Decision Buttons: The 4 Core Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          
          <button
            onClick={() => onSelectAction('wizard')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block group-hover:text-blue-900">
                {language === 'te' ? 'మార్గదర్శక విజార్డ్' : 'Incident Wizard'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {language === 'te' ? 'స్టెప్ బై స్టెప్ రక్షణ' : 'Step-by-step guidance'}
              </span>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('phishing')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block group-hover:text-blue-900">
                {language === 'te' ? 'అనుమానాస్పద లింక్' : 'Link / Message'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {language === 'te' ? 'ఫిషింగ్ తనిఖీ చేయండి' : 'Scan URL or SMS'}
              </span>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('media')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block group-hover:text-indigo-900">
                {language === 'te' ? 'మీడియా ఫోరెన్సిక్స్' : 'Media Forensics'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {language === 'te' ? 'SynthID & ఆర్టిఫాక్ట్ స్కాన్' : 'Video & image verification'}
              </span>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('scam')}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block group-hover:text-amber-900">
                {language === 'te' ? 'నేను మోసపోయాను' : 'I Was Scammed'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {language === 'te' ? 'గోల్డెన్ అవర్ 1930 రక్షణ' : '1930 & Golden Hour'}
              </span>
            </div>
          </button>

        </div>

      </div>
    </section>
  );
};
