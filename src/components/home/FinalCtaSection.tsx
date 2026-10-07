import React from 'react';
import { ShieldCheck, ArrowRight, PhoneCall, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const FinalCtaSection: React.FC<{
  onStartSafetyCheck: () => void;
  onOpenCheckTab: () => void;
}> = ({ onStartSafetyCheck, onOpenCheckTab }) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-20 text-center">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6">
        
        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
          {t('finalCtaTitle')}
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {t('finalCtaSubtitle')}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartSafetyCheck}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[48px]"
          >
            <span>{t('startSafetyCheckBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCheckTab}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer min-h-[48px]"
          >
            <span>{language === 'te' ? 'అన్ని టూల్స్ తెరవండి' : 'Open Analysis Workspace'}</span>
          </button>
        </div>

        {/* Emergency contact reminder */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            <span>National Cyber Crime Helpline: <strong>1930</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div>
            <span>Official Reporting: </span>
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              cybercrime.gov.in ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
