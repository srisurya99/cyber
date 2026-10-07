import React from 'react';
import { PhoneCall, ShieldAlert, Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer: React.FC<{ onOpenSafetyCheck: () => void }> = ({ onOpenSafetyCheck }) => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-white mt-16 pb-20 md:pb-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        
        {/* Emergency contact banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm md:text-base text-slate-900">
                {t('nationalCybercrimeHelpline')}
              </h4>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                {t('bankEmergencyNote')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="tel:1930"
              className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              Call 1930
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-medium rounded-lg transition-colors min-h-[44px]"
            >
              cybercrime.gov.in ↗
            </a>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>{t('privacyNotice')}</span>
          </div>
          <div className="text-center md:text-right">
            <span>ThreatLens &copy; 2026. Empowering citizens against cyber fraud and digital harm.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
