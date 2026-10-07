import React from 'react';
import { 
  Link as LinkIcon, 
  Image as ImageIcon, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  PhoneCall, 
  HelpCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CitizenHomePageProps {
  onSelectFeature: (feature: 'phishing' | 'media' | 'scam' | 'help') => void;
}

export const CitizenHomePage: React.FC<CitizenHomePageProps> = ({ onSelectFeature }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-200 text-left">
      
      {/* ========================================================
          1. HERO SECTION (Clean, Simple, Trustworthy)
         ======================================================== */}
      <section className="pt-4 sm:pt-10 pb-4 text-center max-w-3xl mx-auto space-y-6">
        
        {/* Subtle Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="tracking-wide">THREATLENS · CITIZEN SAFETY ASSISTANT</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
          {language === 'te' 
            ? 'క్లిక్ చేయడానికి, నమ్మడానికి లేదా పంచుకోవడానికి ముందు తనిఖీ చేయండి.' 
            : 'Check before you click, trust or share.'}
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {language === 'te'
            ? 'అనుమానాస్పద లింకులు, సందేశాలు, చిత్రాలు మరియు వీడియోలను అర్థం చేసుకోవడానికి మరియు తదుపరి ఏమి చేయాలో తెలుసుకోవడానికి ThreatLens మీకు సహాయపడుతుంది.'
            : 'ThreatLens helps you understand suspicious links, messages, images and videos and guides you on what to do next.'}
        </p>

        {/* Primary & Secondary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onSelectFeature('phishing')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer min-h-[48px]"
          >
            <LinkIcon className="w-4 h-4" />
            <span>{language === 'te' ? 'లింక్ లేదా మెసేజ్ తనిఖీ చేయండి' : 'Check a Link or Message'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFeature('media')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer min-h-[48px]"
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>{language === 'te' ? 'చిత్రం లేదా వీడియో తనిఖీ చేయండి' : 'Check an Image or Video'}</span>
          </button>
        </div>

        {/* Secondary Action: I Was Scammed */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onSelectFeature('scam')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>{language === 'te' ? 'నేను ఇప్పటికే మోసపోయాను — తక్షణ సహాయం' : 'I Was Scammed — Get Emergency Guidance'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* ========================================================
          2. THREE FEATURE CARDS (Core Citizen Tools)
         ======================================================== */}
      <section className="space-y-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {language === 'te' ? 'ముఖ్యమైన సాధనాలు' : 'Core Safety Features'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {language === 'te' ? 'మీరు ఏమి తనిఖీ చేయాలనుకుంటున్నారు?' : 'What would you like to check?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* CARD 1: Link / Message */}
          <div className="bg-white border border-slate-200 hover:border-blue-500/70 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {language === 'te' ? 'లింక్ / మెసేజ్' : 'Link / Message'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'te'
                    ? 'మీరు ప్రతిస్పందించే ముందు అనుమానాస్పద లింకులు, సందేశాలు మరియు ఆన్‌లైన్ అభ్యర్థనలను తనిఖీ చేయండి.'
                    : 'Check suspicious links, messages and online requests before you respond.'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onSelectFeature('phishing')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{language === 'te' ? 'ఇప్పుడే తనిఖీ చేయండి' : 'Check Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2: Media Forensics */}
          <div className="bg-white border border-slate-200 hover:border-indigo-500/70 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {language === 'te' ? 'మీడియా ఫోరెన్సిక్స్' : 'Media Forensics'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'te'
                    ? 'నిశిత పరిశీలన అవసరమైన సంకేతాల కోసం అనుమానాస్పద చిత్రాలు మరియు వీడియోలను తనిఖీ చేయండి.'
                    : 'Check suspicious images and videos for signs that need closer attention.'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onSelectFeature('media')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{language === 'te' ? 'మీడియాను తనిఖీ చేయండి' : 'Check Media'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 3: I Was Scammed */}
          <div className="bg-white border border-slate-200 hover:border-amber-500/70 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {language === 'te' ? 'నేను మోసపోయాను' : 'I Was Scammed'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === 'te'
                    ? 'మీ ఖాతాలను రక్షించుకోవడానికి, ఆధారాలను భద్రపరచడానికి మరియు సురక్షితంగా ప్రతిస్పందించడానికి ఆచరణాత్మక దశలను పొందండి.'
                    : 'Get practical steps to protect your accounts, preserve evidence and respond safely.'}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => onSelectFeature('scam')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{language === 'te' ? 'సహాయం పొందండి' : 'Get Help'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. HOW IT WORKS (Simple 3 Steps for Citizens)
         ======================================================== */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-left space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {language === 'te' ? 'సరళమైన ప్రక్రియ' : 'How ThreatLens Works'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'te' ? 'మూడు సులభమైన దశలలో రక్షణ' : 'Safety in three simple steps'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'te' ? 'అంశాన్ని అతికించండి లేదా అప్‌లోడ్ చేయండి' : 'Submit what you received'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'అనుమానాస్పద లింక్, SMS, WhatsApp మెసేజ్ అతికించండి లేదా చిత్రం/వీడియోను అప్‌లోడ్ చేయండి.'
                : 'Paste a suspicious link, SMS message, or upload an image or video that feels questionable.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'te' ? 'ఏమి అనుమానాస్పదంగా ఉందో తెలుసుకోండి' : 'Understand what looks suspicious'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'ThreatLens స్పష్టమైన పదాలలో కారణాలను మరియు ముప్పు సంకేతాలను వివరిస్తుంది — తప్పుడు స్కోర్‌లు లేకుండా.'
                : 'ThreatLens inspects available evidence and clearly explains what looks suspicious without fake percentages.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'te' ? 'సురక్షితమైన చర్య తీసుకోండి' : 'Take calm, practical action'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'మీ డబ్బు మరియు ఖాతాలను కాపాడుకోవడానికి ఖచ్చితమైన దశలను పొందండి, అవసరమైతే 1930 హెల్ప్‌లైన్‌ను సంప్రదించండి.'
                : 'Get step-by-step guidance to secure your accounts, freeze fraudulent transfers, or report to 1930.'}
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          4. CITIZEN REASSURANCE & HELPLINE NOTICE
         ======================================================== */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-left">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'te' ? 'భారత జాతీయ సైబర్ హెల్ప్‌లైన్: 1930' : 'National Cyber Crime Helpline: 1930'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'మీరు ఆన్‌లైన్ ఆర్థిక మోసానికి గురైతే, వెంటనే 1930 కు కాల్ చేయండి లేదా cybercrime.gov.in లో ఫిర్యాదు చేయండి.'
                : 'If you have lost money to cyber fraud, report within the Golden Hour to freeze fraudulent bank transfers.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectFeature('help')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          <span>{language === 'te' ? 'అధికారిక హెల్ప్‌లైన్ గైడ్' : 'Helpline & Resources'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* ========================================================
          5. FREQUENTLY ASKED QUESTIONS (Simple & Helpful)
         ======================================================== */}
      <section className="space-y-4 pt-2">
        <div className="text-left space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {language === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Common Questions'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'te' ? 'పౌరులకు సహాయపడే సమాధానాలు' : 'Questions citizens often ask'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'te' ? 'ThreatLens ఉచితంగా ఉపయోగించవచ్చా?' : 'Is ThreatLens free to use?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'అవును. ThreatLens పూర్తిగా ఉచితం మరియు లాగిన్ లేకుండా అనుమానాస్పద లింకులు, మెసేజ్‌లు మరియు మీడియాను తనిఖీ చేయడానికి పౌరులకు సహాయపడుతుంది.'
                : 'Yes. ThreatLens is free for citizens to inspect suspicious messages, verify links, and get practical recovery steps.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'te' ? 'నేను డబ్బు పంపితే మొదట ఏమి చేయాలి?' : 'What should I do first if I sent money to a scammer?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'వెంటనే మీ బ్యాంకు మరియు 1930 జాతీయ సైబర్ హెల్ప్‌లైన్‌ను సంప్రదించండి. మొదటి 2-3 గంటలలో ఫిర్యాదు చేయడం వలన డబ్బు నిలిపివేసే అవకాశం ఎక్కువ.'
                : 'Immediately dial 1930 and contact your bank. Quick reporting within 2–3 hours significantly increases the chance of freezing the transfer.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'te' ? 'నా డేటా సురక్షితంగా ఉంటుందా?' : 'Is my submitted data kept private?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'మీరు తనిఖీ చేసే లింకులు లేదా సందేశాలు కేవలం భద్రతా విశ్లేషణ కోసం మాత్రమే ఉపయోగించబడతాయి. ఎటువంటి వ్యక్తిగత సమాచారం విక్రయించబడదు.'
                : 'Your checks are analyzed solely for forensic safety indicators. No personal data is harvested or sold.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'te' ? 'ThreatLens డీప్‌ఫేక్‌లను నిర్ధారిస్తుందా?' : 'How does ThreatLens check images and videos?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'ThreatLens దృశ్య లోపాలు మరియు Google SynthID వాటర్‌మార్క్ మూలాలను పరిశీలిస్తుంది. నిజమైన ఆధారాలు లేకపోతే తప్పుడు నిర్ధారణలు చేయదు.'
                : 'ThreatLens inspects visual continuity and digital watermark provenance (such as Google SynthID). It never shows fake certainty percentages.'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
