import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  ShieldAlert, 
  Search, 
  Lock,
  ArrowRight,
  Globe
} from 'lucide-react';
import { RiskBadge } from '../../common/RiskBadge';
import { ThreatLensButton } from '../../common/ThreatLensButton';
import { useLanguage } from '../../../i18n/LanguageContext';

export const LivePhishingDemo: React.FC<{ onNavigateToTool: () => void }> = ({ onNavigateToTool }) => {
  const { language } = useLanguage();
  
  // Animation timeline step:
  // 0: SMS arrives
  // 1: Laser scanning line moves across
  // 2: Phrase 1 highlighted (Urgency)
  // 3: Phrase 2 highlighted (Domain spoof)
  // 4: Verdict & Recommended Action appears
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleRestart = () => {
    setStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Demo Top Banner */}
      <div className="px-4 py-2 bg-slate-900 text-slate-300 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-blue-300">
            {language === 'te' ? 'ప్రత్యక్ష డెమో: ఫిషింగ్ ఇంటర్‌సెప్షన్' : 'LIVE DEMONSTRATION · PHISHING SCANNER'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            title="Replay demonstration"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Realistic Browser Frame Header */}
      <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
        </div>

        {/* Address bar with live scanning indicator */}
        <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-xs font-mono flex items-center justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="font-bold text-red-600 truncate">sbi-kyc-verify-portal.in</span>
            <span className="text-slate-400">/update-pan</span>
          </div>
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shrink-0 ml-1">
            {step >= 3 ? 'TYPOSQUAT' : 'INSPECTING'}
          </span>
        </div>
      </div>

      {/* Dynamic Content Canvas */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pb-1 border-b border-slate-100">
          <span>Stage: {step === 0 ? 'Message Received' : step === 1 ? 'Laser Scanning Text' : step === 2 ? 'Analyzing Linguistic Pressure' : step === 3 ? 'Domain DNS & Entropy Flagged' : 'Verdict Generated'}</span>
          <span className="text-blue-600 font-bold">{step + 1} / 5</span>
        </div>

        {/* Suspicious SMS Container with Laser Scanner Beam */}
        <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-hidden">
          
          {/* Animated Laser Scanning Beam */}
          {step === 1 && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '96%' }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_#06b6d4] z-20 pointer-events-none"
            />
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Sender: <strong>VM-SBIBNK</strong></span>
            <span className="text-slate-400 font-mono">10:42 AM · SMS</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            Dear Customer, your NetBanking access is 
            <span className={`transition-all duration-300 mx-1 px-1.5 py-0.5 rounded font-bold ${
              step >= 2 ? 'bg-red-100 text-red-700 border border-red-300' : ''
            }`}>
              suspended today
            </span> 
            due to unverified PAN. Update immediately to prevent block: 
            <span className={`transition-all duration-300 ml-1 px-1.5 py-0.5 rounded font-mono font-bold ${
              step >= 3 ? 'bg-red-200 text-red-800 border border-red-400 underline' : 'text-slate-700 underline'
            }`}>
              http://sbi-kyc-verify-portal.in
            </span>
          </p>

          {/* Dynamic Highlight Badges */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
            {step >= 2 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-md font-semibold flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>Manufactured Urgency: "suspended today"</span>
              </motion.span>
            )}

            {step >= 3 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-semibold flex items-center gap-1"
              >
                <Globe className="w-3 h-3 text-amber-600" />
                <span>Impersonated Domain: not sbi.co.in</span>
              </motion.span>
            )}
          </div>

        </div>

        {/* Verdict and Actions Display */}
        <AnimatePresence mode="wait">
          {step >= 4 ? (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pt-1"
            >
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RiskBadge level="HIGH" size="md" />
                    <span className="font-mono text-xs font-bold text-red-700">94% Confidence</span>
                  </div>
                  <p className="text-xs text-red-950 font-medium leading-tight">
                    Deceptive credential-harvesting trap impersonating State Bank of India.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Recommended Safe Steps:</span>
                <p className="text-blue-950">
                  1. Do NOT click the link. 2. Block sender VM-SBIBNK. 3. Call official bank branch number.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scanning-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center justify-between font-mono"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Analyzing URL entropy, WHOIS records & NLP pressure...</span>
              </span>
              <span className="text-blue-600 font-bold">Scanning</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="pt-2">
          <ThreatLensButton
            variant="prominent"
            size="md"
            icon={Search}
            onClick={onNavigateToTool}
            className="w-full"
          >
            Check a Link or Message in Real Time
          </ThreatLensButton>
        </div>

      </div>

    </div>
  );
};
