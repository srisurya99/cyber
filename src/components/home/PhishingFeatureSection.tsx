import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LivePhishingDemo } from './demos/LivePhishingDemo';

export const PhishingFeatureSection: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-20 border-b border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left: Text & Educational Breakdown */}
        <div className="lg:col-span-6 space-y-5 text-left">
          
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80">
            <span>Capability 01</span>
            <span className="text-slate-300">·</span>
            <span>{language === 'te' ? 'ఫిషింగ్ గుర్తింపు' : 'Deceptive Link & SMS Detection'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {language === 'te' ? 'క్లిక్ చేసే ముందే నకిలీ లింకులను గుర్తించండి' : 'Stop Phishing Before You Enter Your Credentials'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'బ్యాంకులు, విద్యుత్ బిల్లులు లేదా లాటరీ పేరిట వచ్చే నకిలీ లింకులు మరియు సందేశాలను తనిఖీ చేయండి. డొమైన్ వయస్సు, ఎంట్రోపీ మరియు సున్నితమైన సమాచారాన్ని దొంగిలించే ఫారమ్‌లను గుర్తిస్తుంది.'
              : 'Cybercriminals routinely clone legitimate bank portals and tax authorities using typosquatted domains. ThreatLens cross-checks URL entropy, newly registered domain lists, and credential-harvesting signatures in seconds.'}
          </p>

          {/* Key Checklist Points */}
          <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Typosquatting & Subdomain Analysis:</strong> Identifies fraudulent hosts mimicking verified banks.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Manufactured Urgency Detection:</strong> Unmasks coercive deadlines designed to panic victims into hasty clicks.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Plain-Language Guidance:</strong> Exactly what to do next—verify via official helpline numbers and block senders.
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onNavigate}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[46px]"
            >
              <span>{t('ctaCheckLink')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right: Live Interactive Phishing Scanner Demonstration Component */}
        <div className="lg:col-span-6">
          <LivePhishingDemo onNavigateToTool={onNavigate} />
        </div>

      </div>
    </section>
  );
};
