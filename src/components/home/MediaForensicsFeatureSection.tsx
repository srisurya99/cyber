import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LiveMediaForensicsDemo } from './demos/LiveMediaForensicsDemo';

export const MediaForensicsFeatureSection: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-20 border-b border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left: Live Interactive Media Forensics Detector Demonstration Component */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <LiveMediaForensicsDemo onNavigateToTool={onNavigate} />
        </div>

        {/* Right: Feature Description & CTAs */}
        <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-2">
          
          <div className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/80">
            <span>Capability 02</span>
            <span className="text-slate-300">·</span>
            <span>{language === 'te' ? 'మీడియా ఫోరెన్సిక్స్' : 'AI Deepfake & Media Forensics'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {language === 'te' ? 'మార్ఫింగ్ లేదా సింథటిక్ వీడియోలను పరిశీలించండి' : 'Uncover Synthetic Manipulation in Photos & Video'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'డీప్‌ఫేక్ వీడియో కాల్స్, వాయిస్ క్లోన్స్ లేదా సవరించిన చిత్రాల ద్వారా ప్రజలను భయపెట్టే లేదా మోసం చేసే ప్రయత్నాలను గుర్తించండి. బయోమెట్రిక్ సరిహద్దులు, లైటింగ్ మరియు కంప్రెషన్ నమూనాల ఆధారంగా విశ్లేషిస్తుంది.'
              : 'Extortionists and executive impersonators use AI face swaps and voice cloning to deceive citizens. ThreatLens evaluates multi-pass neural rendering artifacts, lighting vector divergence, and sensor metadata integrity.'}
          </p>

          <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Biometric Consistency:</strong> Identifies face-boundary warping, unnatural pupil reflections, and blending jitter.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Lighting Physics & Shadows:</strong> Evaluates directional divergence between the subject and background environment.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Uncertainty-Aware Reporting:</strong> Clearly presents probabilistic confidence without claiming 100% perfection.
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onNavigate}
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[46px]"
            >
              <span>{t('ctaCheckMedia')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
