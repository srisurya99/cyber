import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { createScamIncidentApi } from '../../api/client';
import { Incident } from '../../types';
import { LoadingState } from '../common/LoadingState';
import { 
  CreditCard, 
  ShoppingBag, 
  TrendingUp, 
  Briefcase, 
  Users, 
  Heart, 
  HelpCircle, 
  Smartphone,
  ArrowRight,
  ArrowLeft,
  IndianRupee,
  Clock
} from 'lucide-react';

interface ScamWizardProps {
  onIncidentCreated: (incident: Incident) => void;
}

export const ScamWizard: React.FC<ScamWizardProps> = ({ onIncidentCreated }) => {
  const { t, language } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<string>('upi');
  const [financialLoss, setFinancialLoss] = useState<string>('5000');
  const [hadLoss, setHadLoss] = useState<boolean>(true);
  const [platform, setPlatform] = useState<string>('WhatsApp / PhonePe');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = [
    { id: 'upi', label: t('scamCategoryUpi'), icon: Smartphone, defaultPlatform: 'UPI (GPay / PhonePe / Paytm)' },
    { id: 'bank_card', label: t('scamCategoryBank'), icon: CreditCard, defaultPlatform: 'Net Banking / Card' },
    { id: 'fake_shopping', label: t('scamCategoryShopping'), icon: ShoppingBag, defaultPlatform: 'Fake Online Store' },
    { id: 'investment', label: t('scamCategoryInvestment'), icon: TrendingUp, defaultPlatform: 'Telegram Crypto Group' },
    { id: 'job', label: t('scamCategoryJob'), icon: Briefcase, defaultPlatform: 'Telegram / WhatsApp Job Offer' },
    { id: 'social_media', label: t('scamCategorySocial'), icon: Users, defaultPlatform: 'Instagram / Facebook' },
    { id: 'romance', label: t('scamCategoryRomance'), icon: Heart, defaultPlatform: 'Dating App / Social' },
    { id: 'other', label: t('scamCategoryOther'), icon: HelpCircle, defaultPlatform: 'Online' },
  ];

  const handleSelectCategory = (catId: string, defPlatform: string) => {
    setCategory(catId);
    setPlatform(defPlatform);
    setStep(2);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const res = await createScamIncidentApi({
        category: category as any,
        financialLoss: hadLoss ? parseFloat(financialLoss) || 0 : 0,
        transferredAmount: hadLoss ? financialLoss : '0',
        platform,
        summary: summary || `${categories.find(c => c.id === category)?.label} reported by citizen.`,
      });

      onIncidentCreated(res.incident);
    } catch (err) {
      console.error('Failed to create scam incident', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('scamHeader')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          {t('scamSubtitle')}
        </p>

        {/* Golden hour notice banner */}
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
          <Clock className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            {language === 'te'
              ? 'ముఖ్యమైన గమనిక: మోసం జరిగిన మొదటి 2-3 గంటలలో (గోల్డెన్ అవర్) బ్యాంకు లేదా 1930 కు ఫిర్యాదు చేస్తే డబ్బు నిలిపివేసే అవకాశం ఎక్కువ.'
              : 'Golden Hour Rule: Reporting within the first 2-3 hours to 1930 or your bank dramatically increases the chance of freezing the fraudulent transaction.'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <LoadingState
          stages={[
            'Classifying scam taxonomy & threat vectors...',
            'Building Golden Hour containment protocol...',
            'Generating official evidence checklist & incident dossier...',
          ]}
          defaultMessage={t('scamSubtitle')}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* STEP 1: What happened? (Progressive Disclosure) */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('whatHappenedQuestion')}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  Step 1 of 2
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id, cat.defaultPlatform)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 min-h-[58px] ${
                        category === cat.id
                          ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 leading-snug">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Financial impact & Platform details */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 rounded"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('btnBack')}</span>
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  Step 2 of 2
                </span>
              </div>

              {/* Financial loss question */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {t('financialLossPrompt')}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHadLoss(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                      hadLoss
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'te' ? 'అవును, డబ్బు నష్టపోయాను' : 'Yes, I lost money'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHadLoss(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                      !hadLoss
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'te' ? 'లేదు, కేవలం అనుమానం' : 'No, avoided transfer'}
                  </button>
                </div>
              </div>

              {hadLoss && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {t('lossAmountLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={financialLoss}
                      onChange={(e) => setFinancialLoss(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t('platformPrompt')}
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. PhonePe, WhatsApp, OLX, Telegram"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Brief details */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {language === 'te' ? 'సంఘటన వివరాలు' : 'Brief Details'}
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={t('detailsPlaceholder')}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Generate Plan Button */}
              <div className="pt-2">
                <button
                  onClick={handleGeneratePlan}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>{t('btnCreateIncident')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
