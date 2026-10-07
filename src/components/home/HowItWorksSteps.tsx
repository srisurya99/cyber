import React from 'react';
import { Search, Brain, ShieldAlert, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const HowItWorksSteps: React.FC<{ onStartCheck: () => void }> = ({ onStartCheck }) => {
  const { t, language } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Search,
      badge: language === 'te' ? 'సమర్పణ' : 'Submission',
      visualHint: 'Link · SMS · Image · Video',
    },
    {
      num: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Brain,
      badge: language === 'te' ? 'విశ్లేషణ' : 'Evaluation',
      visualHint: 'Probabilistic AI · Heuristics',
    },
    {
      num: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: ShieldAlert,
      badge: language === 'te' ? 'రక్షణ' : 'Containment',
      visualHint: 'Golden Hour 1930 · StopNCII',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-18 border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
          {language === 'te' ? 'పౌరుల భద్రతా ప్రక్రియ' : 'The Citizen Safety Pathway'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {t('threeStepsHeading')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          {t('threeStepsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-300">
                    {st.num}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {st.badge}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {st.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{st.visualHint}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
