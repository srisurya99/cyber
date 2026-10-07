import React from 'react';
import { Shield, Sparkles, User, Globe, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface NavbarProps {
  currentTab: string;
  checkSubTab?: string;
  setCurrentTab: (tab: string) => void;
  onSelectModule: (module: 'wizard' | 'phishing' | 'media' | 'scam') => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  checkSubTab,
  setCurrentTab,
  onSelectModule,
  onOpenProfile,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-bold shadow-sm">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-base md:text-lg tracking-tight text-[#0F172A]">
                THREATLENS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-500 font-medium border-l border-slate-300 pl-2">
                Citizen Safety
              </span>
            </div>
          </button>

          {/* Primary Navigation: The 4 Core Modules */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectModule('wizard')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'check' && checkSubTab === 'wizard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {language === 'te' ? 'మార్గదర్శక విజార్డ్' : 'Incident Wizard'}
            </button>
            <button
              onClick={() => onSelectModule('phishing')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'check' && checkSubTab === 'phishing'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {language === 'te' ? 'లింక్ / మెసేజ్' : 'Link / Message'}
            </button>
            <button
              onClick={() => onSelectModule('media')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'check' && checkSubTab === 'media'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {language === 'te' ? 'మీడియా ఫోరెన్సిక్స్' : 'Media Forensics'}
            </button>
            <button
              onClick={() => onSelectModule('scam')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                currentTab === 'check' && checkSubTab === 'scam'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-700 hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              {language === 'te' ? 'నేను మోసపోయాను' : 'I Was Scammed'}
            </button>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Incidents Quick Link */}
          <button
            onClick={() => setCurrentTab('incidents')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentTab === 'incidents'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{t('navIncidents')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Switch Language / భాషను మార్చండి"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="font-semibold">{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* Profile / Emergency contact trigger */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-2 text-slate-700 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Profile and Settings"
          >
            <User className="w-5 h-5 text-slate-600" />
            <span className="hidden xl:inline text-sm font-medium">{t('navProfile')}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
