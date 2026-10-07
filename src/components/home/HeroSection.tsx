import React from 'react';
import { ShieldCheck, ArrowRight, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AnimatedHeroPhone } from './AnimatedHeroPhone';

interface HeroSectionProps {
  onSelectAction: (actionKey: 'wizard' | 'phishing' | 'media' | 'scam') => void;
  onOpenSafetyCheck: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectAction,
  onOpenSafetyCheck,
}) => {
  const { t, language } = useLanguage();

  return (
    <section className="pt-2 pb-8 sm:pb-12 border-b border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Headline, Value Proposition & Direct CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-full text-xs font-bold text-blue-700 font-mono tracking-tight shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{t('brandTagline')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onSelectAction('phishing')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-xs hover:shadow-md transition-all min-h-[50px] cursor-pointer"
            >
              <span>{t('action1Btn')}</span>
            </button>

            <button
              onClick={onOpenSafetyCheck}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 shadow-2xs transition-colors min-h-[50px] cursor-pointer"
            >
              <span>{t('startSafetyCheckBtn')}</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Citizen Trust Indicators */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'te' ? 'ఉచిత & సురక్షితం' : '100% Free & Citizen-First'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{language === 'te' ? '1930 హెల్ప్‌లైన్ సమన్వయం' : '1930 Cybercrime Compatible'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{language === 'te' ? 'ఖచ్చితమైన విశ్లేషణ' : 'Probabilistic AI Forensics'}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Animated Realistic Smartphone Mockup */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <AnimatedHeroPhone onSelectAction={onSelectAction} />
        </div>

      </div>
    </section>
  );
};
