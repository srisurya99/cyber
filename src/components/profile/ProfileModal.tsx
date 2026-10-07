import React, { useState } from 'react';
import { X, User, Globe, Database, Shield, Trash2, RotateCcw, Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { resetDemoIncidents } from '../../db/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemo: () => void;
  onClearAll: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onResetDemo,
  onClearAll,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('navProfile')} & Privacy Settings
              </h3>
              <p className="text-xs text-slate-500">Citizen Digital Identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Language / భాష</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-colors ${
                  language === 'en'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-colors ${
                  language === 'te'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>

          {/* Database / Supabase status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>Supabase PostgreSQL Integration</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Row Level Security (RLS) enabled. Offline & online state synchronized. Schema in <code>/supabase/schema.sql</code>.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-600 text-xs flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('privacyNotice')}
            </p>
          </div>

          {/* Demo Data Management */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload 4 Hackathon Demo Scenarios</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Clear all stored incidents?')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="w-full py-2 px-3 text-red-600 hover:bg-red-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Incident Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
