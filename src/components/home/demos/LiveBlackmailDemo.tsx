import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Shield, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ThreatLensButton } from '../../common/ThreatLensButton';
import { useLanguage } from '../../../i18n/LanguageContext';

export const LiveBlackmailDemo: React.FC<{ onNavigateToTool: () => void }> = ({ onNavigateToTool }) => {
  const { language } = useLanguage();

  // Progressively reveal 4 safety checklist steps
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleRestart = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  const safetySteps = [
    {
      title: 'Rule 1: Strict Non-Payment Policy',
      desc: 'Halt all money transfers, gift cards, and cryptocurrency. Paying guarantees escalated extortion.',
      status: 'VERIFIED ENFORCED',
      statusColor: 'text-red-400 bg-red-950/80 border-red-500/40',
    },
    {
      title: 'Digital Evidence Preservation',
      desc: 'Captured uncropped screenshots of blackmail handle, bio, payment UPI QR, and threat messages.',
      status: 'PROOF SECURED',
      statusColor: 'text-blue-400 bg-blue-950/80 border-blue-500/40',
    },
    {
      title: 'StopNCII.org Cryptographic Hashing',
      desc: 'Calculated device-side non-reversible hash to prevent media dissemination across Meta and TikTok.',
      status: 'DISTRIBUTION BLOCKED',
      statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    },
    {
      title: 'Account Isolation & Active 2FA Lockdown',
      desc: 'Revoked all active web sessions, updated passwords, and activated app-based Authenticator.',
      status: 'CHANNELS LOCKED',
      statusColor: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
    },
    {
      title: 'National Cybercrime Portal Escalation',
      desc: 'Anonymous safety complaint packet compiled with legal provisions for 1930 / cybercrime.gov.in.',
      status: 'READY TO FILE',
      statusColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
    },
  ];

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-left">
      
      {/* Top Bar with Demo Identifier */}
      <div className="px-4 py-2.5 bg-black border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-red-400">
            {language === 'te' ? 'ప్రత్యక్ష డెమో: అత్యవసర భద్రతా ప్రోటోకాల్' : 'LIVE DEMONSTRATION · EXTORTION CONTAINMENT'}
          </span>
        </div>

        <button
          onClick={handleRestart}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          title="Replay protocol"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Reassurance Banner */}
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-slate-200 font-semibold">Immediate Containment Protocol</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px]">100% Confidential</span>
        </div>

        {/* Progressively Activating Safety Checklist */}
        <div className="space-y-2.5">
          {safetySteps.map((step, idx) => {
            const isCompleted = idx <= activeStep;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: isCompleted ? 1 : 0.35, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`p-3 rounded-xl border transition-all ${
                  idx === activeStep 
                    ? 'bg-slate-900 border-red-500/50 shadow-sm' 
                    : isCompleted 
                    ? 'bg-slate-900/70 border-slate-800' 
                    : 'bg-slate-950/50 border-slate-900 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <strong className="text-xs font-bold text-slate-100 truncate">
                      {step.title}
                    </strong>
                  </div>

                  {isCompleted && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${step.statusColor}`}>
                      {step.status}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Tool Launcher Button */}
        <div className="pt-2">
          <ThreatLensButton
            variant="safety"
            size="md"
            icon={Shield}
            onClick={onNavigateToTool}
            className="w-full"
          >
            Get Immediate Blackmail Guidance
          </ThreatLensButton>
        </div>

      </div>

    </div>
  );
};
