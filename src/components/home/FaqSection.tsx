import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'te' 
        ? 'యూపీఐ ద్వారా డబ్బులు అందుకోవడానికి నేను పిన్ (PIN) లేదా క్యూఆర్ కోడ్ స్కాన్ చేయాలా?' 
        : 'Do I ever need to enter my UPI MPIN or scan a QR code to receive money?',
      a: language === 'te'
        ? 'ఖచ్చితంగా అవసరం లేదు! యూపీఐ ద్వారా మీ ఖాతాలోకి డబ్బులు జమ కావడానికి మీరు ఎటువంటి పిన్ ఎంటర్ చేయవలసిన అవసరం లేదు. PIN ఎంటర్ చేయడం అంటే మీ ఖాతా నుండి డబ్బులు కట్ కావడం మాత్రమే.'
        : 'NEVER. You NEVER need to enter your UPI MPIN or scan a QR code to receive funds. An MPIN authorizes outbound debits from your bank account only. If a buyer on OLX, WhatsApp, or Facebook Marketplace tells you to scan a QR code or enter your PIN to receive an advance or refund, it is 100% a fraudulent collect request.',
    },
    {
      q: language === 'te' 
        ? 'ఆర్థిక సైబర్ మోసాలలో "గోల్డెన్ అవర్" (Golden Hour) అంటే ఏమిటి?' 
        : 'What is the "Golden Hour" in financial cyber fraud and why does it matter?',
      a: language === 'te'
        ? 'మోసం జరిగిన మొదటి 2 నుండి 3 గంటల సమయాన్ని గోల్డెన్ అవర్ అంటారు. ఈ సమయంలో జాతీయ హెల్ప్‌లైన్ 1930 లేదా బ్యాంకుకు కాల్ చేసి UTR నంబర్ అందిస్తే, నేరస్థుల ఖాతా నుండి నగదు డ్రా కాకముందే నిధులను ఫ్రీజ్ చేయవచ్చు.'
        : 'The Golden Hour refers to the critical initial 2 to 3 hours following an unauthorized transaction. If reported immediately to the 1930 Cyber Fraud Helpline or your bank fraud desk with the transaction UTR number, authorities can leverage the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) to freeze funds in the beneficiary account before cash withdrawal.',
    },
    {
      q: language === 'te' 
        ? 'ఎవరైనా నా వ్యక్తిగత చిత్రాలతో బ్లాక్‌మెయిల్ చేస్తుంటే నేను డబ్బులు చెల్లించవచ్చా?' 
        : 'Should I pay blackmailers if they threaten to leak private photos or videos?',
      a: language === 'te'
        ? 'ఎట్టి పరిస్థితుల్లోనూ డబ్బులు చెల్లించవద్దు. ఒకసారి డబ్బు పంపితే నేరస్థులు మరింత ఎక్కువ డిమాండ్ చేస్తారు. వెంటనే చాట్ స్క్రీన్‌షాట్లు భద్రపరచి, StopNCII.org లో ఇమేజ్ హ్యాష్ సమర్పించండి మరియు 1930 లో ఫిర్యాదు చేయండి.'
        : 'Do not pay under any circumstances. Complying with extortion demands proves that coercion works and reliably triggers larger demands. Instead: 1) Cease communication without deleting the chat, 2) Screenshot all handles and messages, 3) Submit a hash to StopNCII.org to prevent distribution across Meta/TikTok, and 4) Report to cybercrime.gov.in.',
    },
    {
      q: language === 'te' 
        ? 'థ్రెట్‌లెన్స్ AI డీప్‌ఫేక్ మరియు ఫిషింగ్ డిటెక్షన్ ఎంత ఖచ్చితమైనది?' 
        : 'How accurate is ThreatLens AI detection for deepfakes and suspicious links?',
      a: language === 'te'
        ? 'థ్రెట్‌లెన్స్ ధృవీకరించదగిన సాంకేతిక ఆధారాలను (క్రిప్టోగ్రాఫిక్ హ్యాష్‌లు, కంటైనర్ సరిహద్దులు మరియు న్యూరల్ డిటెక్టర్ ఆర్టిఫాక్ట్‌లు) మాత్రమే పరిగణిస్తుంది. అందుబాటులో లేని పరీక్షలను స్పష్టంగా వేరు చేసి చూపిస్తుంది మరియు అనిశ్చిత సందర్భాలలో నిర్ధారణకు రాలేని ఫలితంగా వర్గీకరిస్తుంది.'
        : 'ThreatLens evaluates verifiable technical evidence: cryptographic container hashes, file boundaries, domain authentication records, and multimodal neural artifact inspection. ThreatLens strictly separates completed checks from unavailable checks (such as sensor hardware EXIF provenance), refuses to fabricate confidence percentages, and marks uncertain findings as Inconclusive.',
    },
    {
      q: language === 'te' 
        ? 'థ్రెట్‌లెన్స్ సేవలు సామాన్య పౌరులకు ఉచితమా?' 
        : 'Is ThreatLens completely free for citizens to use?',
      a: language === 'te'
        ? 'అవును, థ్రెట్‌లెన్స్ పౌరుల సైబర్ భద్రతా వేదిక పూర్తిగా ఉచితం. లింక్ విశ్లేషణ, మీడియా తనిఖీ మరియు 1930 కోసం పోలీస్ డాసియర్ నివేదికలను ఉచితంగా పొందవచ్చు.'
        : 'Yes. ThreatLens is engineered as a public-interest digital safety platform for ordinary citizens. All link inspection, media forensic screening, scam response guides, and police-ready PDF reports are provided free with zero paywalls.',
    },
  ];

  return (
    <section className="py-14 sm:py-18 border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
          {language === 'te' ? 'సందేహాలు & సమాధానాలు' : 'Questions & Verification'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {t('faqTitle')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          {t('faqSubtitle')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
