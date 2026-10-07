import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LiveScamResponseDemo } from './demos/LiveScamResponseDemo';

export const ScamResponseFeatureSection: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-20 border-b border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left: Educational & Incident Response Protocol */}
        <div className="lg:col-span-6 space-y-5 text-left">
          
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
            <span>Capability 03</span>
            <span className="text-slate-300">·</span>
            <span>{language === 'te' ? 'ఆర్థిక మోసాల రక్షణ' : 'Scam Incident Management'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {language === 'te' ? 'డబ్బు నష్టపోయినా ఆందోళన వద్దు. దశలవారీ చర్యలు ఉన్నాయి.' : 'Act Within the Golden Hour to Freeze Fraudulent Transfers'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'యూపీఐ రివర్స్ పేమెంట్స్, నకిలీ ఉద్యోగ ఆఫర్లు లేదా బ్యాంక్ మోసాల బారిన పడినప్పుడు మొదటి 2-3 గంటలు అత్యంత కీలకం. ఆధారాలను భద్రపరచి, బ్యాంకు మరియు 1930 అధికారులకు అవసరమైన నివేదికను రూపొందిస్తుంది.'
              : 'Victims of financial fraud often panic and lose critical time. ThreatLens structures your response within the Golden Hour window, assembling transaction IDs, chat transcripts, and police-ready reporting dossiers.'}
          </p>

          <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Golden Hour Protocol:</strong> Direct 1930 guidance to initiate beneficiary account freeze through banking liaison desks.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Structured Evidence Vault:</strong> Organizes transaction UTR numbers, debit alerts, and chat transcripts.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>One-Click PDF Report:</strong> Exports an official evidence file ready for your bank fraud department and cyber police.
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onNavigate}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[46px]"
            >
              <span>{t('ctaGetScamHelp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Live Interactive Scam Timeline & Incident Demonstration Component */}
        <div className="lg:col-span-6">
          <LiveScamResponseDemo onNavigateToTool={onNavigate} />
        </div>

      </div>
    </section>
  );
};
