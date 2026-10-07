import React from 'react';
import { Home, Link as LinkIcon, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { language } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 safe-area-bottom shadow-lg">
      <div className="grid grid-cols-4 items-center text-center">
        <button
          type="button"
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate max-w-[72px]">
            {language === 'te' ? 'హోమ్' : 'Home'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentTab('phishing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentTab === 'phishing' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate max-w-[72px]">
            {language === 'te' ? 'లింక్' : 'Link/Msg'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentTab('media');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentTab === 'media' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate max-w-[72px]">
            {language === 'te' ? 'మీడియా' : 'Media'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentTab('scam');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-lg transition-colors cursor-pointer ${
            currentTab === 'scam' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate max-w-[72px]">
            {language === 'te' ? 'స్కామ్' : 'Scammed'}
          </span>
        </button>
      </div>
    </nav>
  );
};
