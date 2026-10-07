import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PrivacyResponsibleAI: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-14 sm:py-18 border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          {language === 'te' ? 'పారదర్శకత & నమ్మకం' : 'Integrity & Ethics'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {t('responsibleAiTitle')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          {t('responsibleAiSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Probabilistic AI Limitations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'te' ? 'సంభావ్యతా విశ్లేషణ పరిమితులు' : 'Probabilistic, Not Infallible'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'ఏ AI డిటెక్షన్ కూడా 100% ఖచ్చితమైనది కాదు. థ్రెట్‌లెన్స్ ఫలితాలను కీలక సంకేతంగా మాత్రమే పరిగణించాలి, ఖచ్చితమైన చట్టపరమైన ఆధారంగా కాదు.'
              : 'No cybersecurity or deepfake model is 100% accurate. ThreatLens computes probabilistic risk indicators. We clearly present uncertainty margins and emphasize human verification.'}
          </p>
        </div>

        {/* Card 2: Zero Unauthorized Tracking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'te' ? 'జీరో ట్రాకింగ్ & గోప్యత' : 'Zero Commercial Tracking'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'మేము యూజర్ ప్రైవేట్ సమాచారాన్ని విక్రయించము లేదా నిల్వ చేయము. మీ ఆధారాలు మీ పరికరంలో మరియు సురక్షిత డేటాబేస్‌లో మాత్రమే భద్రపరచబడతాయి.'
              : 'We do not sell citizen data, monetize submitted screenshots, or run third-party surveillance trackers. Evidence is managed exclusively under strict user control.'}
          </p>
        </div>

        {/* Card 3: Admissible Evidentiary Standards */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'te' ? 'చట్టపరమైన నివేదిక ప్రమాణాలు' : 'Official Police & Bank Dossiers'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'te'
              ? 'జాతీయ సైబర్ క్రైమ్ పోర్టల్ (1930) మరియు బ్యాంకుల ఫ్రాడ్ విభాగాలు కోరే ఫార్మాట్‌లో ఆధారాలు మరియు కాలక్రమం భద్రపరచబడతాయి.'
              : 'Timeline timestamps, sender VPAs, and original media hashes are cataloged in accordance with National Cyber Crime Reporting Portal (1930 / I4C) intake standards.'}
          </p>
        </div>

      </div>

      <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">
        {t('responsibleAiDisclaimer')}
      </div>
    </section>
  );
};
