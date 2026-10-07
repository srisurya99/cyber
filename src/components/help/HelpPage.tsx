import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  PhoneCall, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Lock, 
  AlertTriangle,
  HelpCircle,
  FileText
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t, language } = useLanguage();

  const resources = [
    {
      title: 'National Cyber Crime Reporting Portal',
      desc: 'Official Government of India portal for filing cybercrime complaints, financial fraud cases, and cyber offences against women and children.',
      linkText: 'cybercrime.gov.in',
      linkUrl: 'https://cybercrime.gov.in',
      badge: 'Official Police Portal',
      urgent: false,
    },
    {
      title: 'Citizen Financial Cyber Fraud Helpline: 1930',
      desc: 'Dial 1930 immediately if money has been deducted fraudulently. Managed by Indian Cyber Crime Coordination Centre (I4C) under MHA.',
      linkText: 'Dial 1930',
      linkUrl: 'tel:1930',
      badge: '24/7 Emergency Line',
      urgent: true,
    },
    {
      title: 'StopNCII.org (Non-Consensual Intimate Imagery)',
      desc: 'Generates secure cryptographic hash of private photos directly on your device so platforms like Instagram, Facebook, and Threads can block uploads before they appear.',
      linkText: 'stopncii.org',
      linkUrl: 'https://stopncii.org',
      badge: 'Sextortion Protection',
      urgent: false,
    },
    {
      title: 'Sanchar Saathi & Chakshu (DoT)',
      desc: 'Department of Telecommunications portal to report fraudulent SMS, spoofed calls, suspect WhatsApp numbers, and block lost/stolen mobile phones.',
      linkText: 'sancharsaathi.gov.in',
      linkUrl: 'https://sancharsaathi.gov.in',
      badge: 'Telecom Fraud Portal',
      urgent: false,
    },
  ];

  const safetyFaqs = [
    {
      q: language === 'te' ? 'యూపీఐ ద్వారా డబ్బులు స్వీకరించడానికి పిన్ (PIN) అవసరమా?' : 'Do I ever need to enter my UPI PIN to receive money?',
      a: language === 'te' 
        ? 'ఖచ్చితంగా లేదు. మీ ఖాతాలోకి డబ్బులు రావడానికి UPI PIN ఎప్పుడూ అవసరం లేదు. PIN ఎంటర్ చేయడం అంటే మీ ఖాతా నుండి డబ్బులు చెల్లించడం మాత్రమే.'
        : 'NEVER. You NEVER need to enter your UPI MPIN to receive money. Entering your PIN always sends money out of your account. If anyone asks you to scan a QR code or enter a PIN to receive a payment or refund, it is guaranteed fraud.',
    },
    {
      q: language === 'te' ? 'డిజిటల్ బ్లాక్‌మెయిల్ జరిగినప్పుడు డబ్బులు చెల్లించవచ్చా?' : 'Should I pay blackmailers if they threaten to leak private photos?',
      a: language === 'te'
        ? 'ఎట్టి పరిస్థితుల్లోనూ డబ్బులు పంపవద్దు. ఒక్కసారి డబ్బులు పంపితే వారు మరింత ఎక్కువ డిమాండ్ చేస్తారు. స్క్రీన్‌షాట్లు భద్రపరచి StopNCII.org మరియు 1930 లో ఫిర్యాదు చేయండి.'
        : 'Never pay. Paying proves you can be coerced and inevitably leads to greater financial demands. Immediately capture screenshots of the threat and user profile, hash your imagery on StopNCII.org, lock down your social media accounts, and file a report on cybercrime.gov.in.',
    },
    {
      q: language === 'te' ? '"గోల్డెన్ అవర్" అంటే ఏమిటి?' : 'What is the "Golden Hour" in financial cyber fraud?',
      a: language === 'te'
        ? 'మోసం జరిగిన మొదటి 2-3 గంటల సమయం. ఈ సమయంలో 1930 కు లేదా మీ బ్యాంకుకు కాల్ చేస్తే నేరస్థుల ఖాతాలో డబ్బులు నిలిపివేయడానికి (ఫ్రీజ్) అత్యధిక అవకాశం ఉంటుంది.'
        : 'The first 2 to 3 hours immediately following an unauthorized transaction. If reported to 1930 or your bank within this critical window, banking liaison officers can intervene through the CFCFRMS system to freeze the funds in the beneficiary account before cash withdrawal.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('helpHeader')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          {t('helpSubtitle')}
        </p>
      </div>

      {/* Official Government & Emergency Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((res, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
              res.urgent ? 'border-red-300 shadow-xs' : 'border-slate-200 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  res.urgent ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {res.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {res.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {res.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <a
                href={res.linkUrl}
                target={res.linkUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                  res.urgent
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{res.linkText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Citizen Safety FAQs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>{language === 'te' ? 'సాధారణ సైబర్ భద్రతా ప్రశ్నలు' : 'Citizen Safety Guidelines & FAQs'}</span>
        </h3>

        <div className="space-y-4">
          {safetyFaqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="text-sm font-bold text-slate-900">
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
