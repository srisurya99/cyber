import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  PhoneCall, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertOctagon, 
  ShieldCheck,
  ArrowRight,
  Upload
} from 'lucide-react';
import { ThreatLensButton } from '../../common/ThreatLensButton';
import { useLanguage } from '../../../i18n/LanguageContext';

export const LiveScamResponseDemo: React.FC<{ onNavigateToTool: () => void }> = ({ onNavigateToTool }) => {
  const { language } = useLanguage();
  
  // Step in timeline creation:
  // 0: Transaction Alert occurs (₹15,000 debit)
  // 1: Helpline 1930 contacted
  // 2: Evidence uploaded to Vault
  // 3: Official Police Dossier ready
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleRestart = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  const timelineItems = [
    {
      time: '11:20 AM',
      title: 'Unauthorized UPI Debit Recorded',
      desc: '₹15,000 debited via deceptive Reverse-QR collect request. UTR: 326798124982.',
      icon: AlertOctagon,
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      time: '11:24 AM',
      title: 'Golden Hour Containment Initiated',
      desc: '1930 Cyber Fraud Helpline alert dispatched to trigger beneficiary VPA freeze.',
      icon: PhoneCall,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      time: '11:27 AM',
      title: 'Cryptographic Evidence Vault Locked',
      desc: 'PhonePe transaction screenshot and WhatsApp extortion chat cryptographically timestamped.',
      icon: Upload,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      time: '11:30 AM',
      title: 'Official Law Enforcement Dossier Generated',
      desc: 'Structured PDF report ready for cybercrime.gov.in and bank fraud mitigation desk.',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-left">
      
      {/* Top Bar with Demo Identifier */}
      <div className="px-4 py-2.5 bg-slate-900 text-slate-300 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-amber-300">
            {language === 'te' ? 'ప్రత్యక్ష డెమో: సంఘటన టైమ్‌లైన్' : 'LIVE DEMONSTRATION · SCAM TIMELINE'}
          </span>
        </div>

        <button
          onClick={handleRestart}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          title="Replay timeline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Incident Summary Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Incident ID</span>
            <strong className="text-xs sm:text-sm text-slate-900 font-mono">TL-2026-00142</strong>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Containment Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Clock className="w-3 h-3" />
              <span>Golden Hour Active</span>
            </span>
          </div>
        </div>

        {/* Step by Step Timeline Building Dynamically */}
        <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timelineItems.map((item, index) => {
            const isVisible = index <= activeStep;
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: isVisible ? 1 : 0.35, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative pl-10 transition-all ${isVisible ? 'scale-100' : 'scale-98 opacity-40'}`}
              >
                {/* Node icon */}
                <div className={`absolute left-1.5 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10 ${item.iconBg}`}>
                  <Icon className="w-3 h-3" />
                </div>

                <div className={`p-3 rounded-xl border transition-all ${
                  index === activeStep 
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs' 
                    : isVisible 
                    ? 'bg-white border-slate-200' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <strong className="text-xs font-bold text-slate-900">
                      {item.title}
                    </strong>
                    <span className="font-mono text-[10px] text-slate-500">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Status ticker */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Stage {activeStep + 1} of 4 Executed</span>
          <span className="text-emerald-700 font-bold">1930 Direct Escalation</span>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <ThreatLensButton
            variant="prominent"
            size="md"
            icon={PhoneCall}
            onClick={onNavigateToTool}
            className="w-full bg-amber-700 hover:bg-amber-800 border-amber-600/30"
          >
            Launch Emergency Scam Response
          </ThreatLensButton>
        </div>

      </div>

    </div>
  );
};
