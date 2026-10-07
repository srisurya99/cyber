import React from 'react';
import { ArrowRight, Link as LinkIcon, Image as ImageIcon, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  BrowserScanningVisual, 
  MediaForensicsVisual, 
  ScamTransitionVisual, 
  BlackmailShieldVisual 
} from './FeatureVisuals';

interface ActionCardsProps {
  onSelectAction: (actionKey: 'phishing' | 'media' | 'scam' | 'blackmail') => void;
  onOpenSafetyCheck: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({ onSelectAction, onOpenSafetyCheck }) => {
  const { t, language } = useLanguage();

  return (
    <section className="mt-10 space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'te' ? 'నాలుగు ప్రధాన రక్షణ సాధనాలు' : 'Core Citizen Safety Workflows'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'te' 
              ? 'ముప్పును పరిశీలించి, తక్షణమే సురక్షిత చర్యను ప్రారంభించండి.' 
              : 'Choose the appropriate tool to analyze your threat and get immediate response guidance.'}
          </p>
        </div>
      </div>

      {/* 1. PRIMARY ACTION: Check a Link or Message (Heroic Wide Card with Live Browser Scanning Visual) */}
      <div 
        onClick={() => onSelectAction('phishing')}
        className="group relative bg-white border-2 border-blue-600/30 hover:border-blue-600 rounded-2xl p-6 sm:p-7 cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                {language === 'te' ? 'ప్రాథమిక రక్షణ' : 'Primary Check'}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                {language === 'te' ? 'తక్షణ విశ్లేషణ' : 'Instant AI Analysis'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-2xl">🎣</span>
              <span>{t('action1Title')}</span>
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {t('action1Desc')}
            </p>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAction('phishing');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors min-h-[44px]"
              >
                <span>{t('action1Btn')}</span>
              </button>
            </div>
          </div>

          {/* Embedded Interactive Browser Visual */}
          <div className="lg:col-span-6">
            <BrowserScanningVisual />
          </div>

        </div>
      </div>

      {/* 2 & 3. SECONDARY ACTIONS: Grid of 2 Intentional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Secondary: Check Media (with Media Forensics Visual) */}
        <div
          onClick={() => onSelectAction('media')}
          className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                {language === 'te' ? 'డీప్‌ఫేక్ డిటెక్షన్' : 'Forensic Inspection'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-xl">🎭</span>
              <span>{t('action2Title')}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('action2Desc')}
            </p>
          </div>

          {/* Embedded Media Forensics HUD */}
          <div>
            <MediaForensicsVisual />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>{t('action2Btn')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Secondary: I Was Scammed (with Scam Transition Visual) */}
        <div
          onClick={() => onSelectAction('scam')}
          className="group bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                {language === 'te' ? 'గోల్డెన్ అవర్ సహాయం' : 'Emergency Triage'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <span>{t('action3Title')}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('action3Desc')}
            </p>
          </div>

          {/* Embedded Transition Alert Visual */}
          <div>
            <ScamTransitionVisual />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-800 group-hover:text-amber-900">
            <span>{t('action3Btn')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. EMERGENCY ACTION: I'm Being Threatened (Urgent Distinct Banner Card with Shield Visual) */}
      <div
        onClick={() => onSelectAction('blackmail')}
        className="group relative bg-[#0F172A] text-white rounded-2xl p-6 sm:p-7 cursor-pointer hover:bg-slate-900 transition-colors shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                {language === 'te' ? 'అత్యవసర భద్రత' : 'Emergency Safety'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                {language === 'te' ? 'రహస్య సహాయం' : '100% Confidential'}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <span>{t('action4Title')}</span>
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t('action4Desc')}
            </p>

            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAction('blackmail');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors min-h-[44px]"
              >
                <span>{t('action4Btn')}</span>
              </button>
            </div>
          </div>

          {/* Embedded Reassuring Shield Visual */}
          <div className="lg:col-span-5">
            <BlackmailShieldVisual />
          </div>

        </div>
      </div>

      {/* 5. Not sure what to do? -> Safety Check CTA */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left mt-6">
        <div>
          <h4 className="font-semibold text-sm sm:text-base text-slate-900">
            {t('notSurePrompt')}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {language === 'te'
              ? 'మా మార్గదర్శక సహాయకుడు మీకు తగిన రక్షణ సాధనాన్ని సూచిస్తారు.'
              : 'Answer two simple questions to identify the best action plan for your situation.'}
          </p>
        </div>
        <button
          onClick={onOpenSafetyCheck}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm rounded-lg border border-slate-300 shadow-2xs transition-colors shrink-0 min-h-[44px] cursor-pointer"
        >
          <span>{t('startSafetyCheckBtn')}</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

    </section>
  );
};
