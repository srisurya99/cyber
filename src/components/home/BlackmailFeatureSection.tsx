import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LiveBlackmailDemo } from './demos/LiveBlackmailDemo';

export const BlackmailFeatureSection: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-20 border-b border-slate-200/80">
      <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Empathetic, Calm, High-Security Guidance */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-1 rounded-md border border-red-500/40">
              <span>Capability 04</span>
              <span className="text-slate-600">·</span>
              <span>{language === 'te' ? 'అత్యవసర బ్లాక్‌మెయిల్ రక్షణ' : 'Digital Extortion & Sextortion'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'te' ? 'భయపడకండి. మీరు బాధితులు మాత్రమే. తక్షణ రక్షణ పొందండి.' : 'You Are Not Alone. Take Decisive Action Against Extortion.'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {language === 'te'
                ? 'వ్యక్తిగత చిత్రాలు లేదా వీడియోలు బయటపెడతామని బెదిరించి డబ్బులు అడిగే నేరస్థులకు ఎట్టి పరిస్థితుల్లోనూ డబ్బులు పంపవద్దు. StopNCII.org ద్వారా చిత్రాలను బ్లాక్ చేయడం మరియు ఖాతాలను లాక్‌డౌన్ చేయడంపై దశలవారీ మార్గదర్శకం.'
                : 'Sextortionists and extortionists rely on shame, urgency, and intimidation. ThreatLens enforces a strict non-compliance and containment roadmap to cut off leverage, preserve proof, and block distribution without exposing your imagery.'}
            </p>

            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Strict Non-Payment Principle:</strong> Paying never deletes the media; it only accelerates demands.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">StopNCII.org Cryptographic Hashing:</strong> Creates non-reversible device-level hashes so major platforms block uploads automatically.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Account Isolation & 2FA:</strong> Immediate password reset, remote session revocation, and social account lockdown.
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onNavigate}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer min-h-[46px]"
              >
                <span>{t('ctaGetBlackmailGuidance')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors min-h-[46px]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Physical Threat? Dial 112</span>
              </a>
            </div>

          </div>

          {/* Right: Live Interactive Extortion Containment Safety Checklist Demonstration */}
          <div className="lg:col-span-6">
            <LiveBlackmailDemo onNavigateToTool={onNavigate} />
          </div>

        </div>
      </div>
    </section>
  );
};
