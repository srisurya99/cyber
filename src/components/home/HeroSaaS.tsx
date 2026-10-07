import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Lock, 
  RotateCcw,
  Sparkles,
  Signal,
  Wifi,
  BatteryMedium,
  Play,
  Pause
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { AnimatedHeroPhone } from './AnimatedHeroPhone';

interface HeroSaaSProps {
  onStartSafetyCheck: () => void;
  onExploreHowItWorks: () => void;
  onSelectAction: (actionKey: 'wizard' | 'phishing' | 'media' | 'scam') => void;
}

export const HeroSaaS: React.FC<HeroSaaSProps> = ({
  onStartSafetyCheck,
  onExploreHowItWorks,
  onSelectAction,
}) => {
  const { t, language } = useLanguage();

  return (
    <section className="relative pt-4 sm:pt-8 pb-14 lg:pb-18 border-b border-slate-200/80">
      
      {/* Ambient background illumination */}
      <div 
        className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-transparent -z-10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Authentic SaaS Product Headline & Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono text-blue-700 uppercase tracking-tight text-[11px]">
              {language === 'te' ? 'పౌరుల డిజిటల్ రక్షణ' : 'Citizen Digital Safety'}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              {language === 'te' ? 'ఉచిత & సురక్షితం' : 'Free & Confidential'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
            {t('saasHeroHeadline')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            {t('saasHeroSubtext')}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStartSafetyCheck}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-xs hover:shadow-md transition-all min-h-[50px] cursor-pointer"
            >
              <span>{t('startSafetyCheckBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreHowItWorks}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 shadow-2xs transition-colors min-h-[50px] cursor-pointer"
            >
              <span>{t('exploreHowItWorks')}</span>
            </button>
          </div>

          {/* Authentic Trust Indicators */}
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-sm">1930</span>
              <span className="text-slate-500 text-[11px] block leading-tight">
                {language === 'te' ? 'సైబర్ క్రైమ్ సమన్వయం' : 'Cyber Helpline Link'}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-sm">Zero Data</span>
              <span className="text-slate-500 text-[11px] block leading-tight">
                {language === 'te' ? 'గోప్యతకు హామీ' : 'Stored Without Consent'}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-sm">StopNCII</span>
              <span className="text-slate-500 text-[11px] block leading-tight">
                {language === 'te' ? 'బ్లాక్‌మెయిల్ రక్షణ' : 'Cryptographic Hash'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Live Animated Realistic Smartphone with Real Movement */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Subtle live indicator tag */}
          <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-slate-300 text-[10px] font-mono border border-slate-800 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>REAL-TIME INCIDENT INSPECTION DEMO</span>
          </div>

          {/* Realistic Moving Smartphone Mockup */}
          <AnimatedHeroPhone onSelectAction={onSelectAction} />

        </div>

      </div>
    </section>
  );
};
