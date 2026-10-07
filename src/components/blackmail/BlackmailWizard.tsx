import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { createBlackmailIncidentApi } from '../../api/client';
import { Incident } from '../../types';
import { LoadingState } from '../common/LoadingState';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertOctagon, 
  ArrowRight, 
  CheckSquare, 
  Lock, 
  Eye, 
  Users, 
  DollarSign, 
  Key, 
  AlertTriangle 
} from 'lucide-react';

interface BlackmailWizardProps {
  onIncidentCreated: (incident: Incident) => void;
  onGetOfficialHelp: () => void;
}

export const BlackmailWizard: React.FC<BlackmailWizardProps> = ({
  onIncidentCreated,
  onGetOfficialHelp,
}) => {
  const { t, language } = useLanguage();

  // Step 0: Immediate Physical Danger Triage
  // Step 1: Threat Vectors & Account Access Questions
  const [step, setStep] = useState<0 | 1>(0);
  const [physicalDanger, setPhysicalDanger] = useState<boolean | null>(null);

  // Threat types checkboxes
  const [threatTypes, setThreatTypes] = useState<string[]>(['private_images']);
  const [hasAccountAccess, setHasAccountAccess] = useState<boolean>(true);
  const [blackmailerPlatform, setBlackmailerPlatform] = useState<string>('Instagram Direct');
  const [isLoading, setIsLoading] = useState(false);

  const threatOptions = [
    { id: 'private_images', label: t('threatPrivateImages'), icon: Eye },
    { id: 'personal_info', label: t('threatPersonalInfo'), icon: Lock },
    { id: 'contact_family', label: t('threatContactFamily'), icon: Users },
    { id: 'demand_money', label: t('threatDemandMoney'), icon: DollarSign },
    { id: 'takeover_account', label: t('threatAccountTakeover'), icon: Key },
    { id: 'physical_harm', label: t('threatPhysicalHarm'), icon: AlertOctagon },
    { id: 'other', label: t('threatOther'), icon: AlertTriangle },
  ];

  const handleToggleThreat = (id: string) => {
    setThreatTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGenerateSafetyPlan = async () => {
    setIsLoading(true);
    try {
      const res = await createBlackmailIncidentApi({
        physicalDanger: physicalDanger === true,
        threatTypes,
        hasAccountAccess,
        blackmailerPlatform,
      });

      onIncidentCreated(res.incident);
    } catch (err) {
      console.error('Failed to create blackmail safety response', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('blackmailHeader')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          {t('blackmailSubtitle')}
        </p>
      </div>

      {isLoading ? (
        <LoadingState
          stages={[
            'Assessing intimidation patterns & victim safety...',
            'Compiling account lockdown & non-payment protocol...',
            'Preparing evidence preservation & StopNCII guidance...',
          ]}
          defaultMessage="Preparing your digital safety roadmap..."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* STEP 0: Physical Danger Verification */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-red-900">
                      {t('emergencyDangerTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-red-800 mt-1 leading-relaxed">
                      {t('emergencyDangerWarning')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="tel:112"
                  onClick={() => setPhysicalDanger(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors min-h-[48px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t('btnYes')} — {t('emergencyContactBtn')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setPhysicalDanger(false);
                    setStep(1);
                  }}
                  className="flex-1 inline-flex items-center justify-center py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm rounded-xl transition-colors min-h-[48px]"
                >
                  <span>{t('btnNo')}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 text-center">
                ThreatLens provides cyber incident containment. Physical safety threats require immediate emergency law enforcement (112).
              </div>
            </div>
          )}

          {/* STEP 1: Threat Analysis & Account Access */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Question 1: What are they threatening? */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  {t('whatAreTheyThreatening')}
                </label>
                <div className="space-y-2">
                  {threatOptions.map((opt) => {
                    const isSelected = threatTypes.includes(opt.id);
                    const Icon = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleToggleThreat(opt.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between min-h-[48px] ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Account Access Check */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  {t('haveAccountAccessQuestion')}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHasAccountAccess(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                      hasAccountAccess
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'te' ? 'అవును, నా ఆధీనంలోనే ఉంది' : 'Yes, I can still log in'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasAccountAccess(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all min-h-[44px] ${
                      !hasAccountAccess
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'te' ? 'లేదు, ఖాతా లాకవుట్ అయింది' : 'No, I am locked out'}
                  </button>
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {language === 'te' ? 'బెదిరింపులు వస్తున్న వేదిక' : 'Platform / Channel'}
                </label>
                <input
                  type="text"
                  value={blackmailerPlatform}
                  onChange={(e) => setBlackmailerPlatform(e.target.value)}
                  placeholder="e.g. Instagram, WhatsApp, Telegram, Snapchat"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateSafetyPlan}
                  disabled={threatTypes.length === 0}
                  className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>{t('generateSafetyPlanBtn')}</span>
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
