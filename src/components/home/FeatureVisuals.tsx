import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Lock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Search, 
  Shield, 
  Clock, 
  ArrowRight,
  Eye,
  Key,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// 1. LINK DETECTION ILLUSTRATION: Browser window with URL scanning animation
export const BrowserScanningVisual: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full rounded-xl bg-slate-900 text-slate-100 p-3 shadow-md border border-slate-700/80 overflow-hidden relative select-none">
      
      {/* Browser Chrome Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar with Scanning Radar */}
        <div className="flex-1 bg-slate-800/90 rounded-lg px-2.5 py-1 text-[11px] font-mono flex items-center justify-between border border-slate-700">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="text-red-400 font-bold truncate">sbi-kyc-verify-portal.in</span>
            <span className="text-slate-400">/login</span>
          </div>
          <span className="text-[9px] font-semibold text-red-300 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/50 shrink-0 ml-1">
            TYPOSQUAT
          </span>
        </div>
      </div>

      {/* Browser Body / Page Analysis Canvas */}
      <div className="pt-3 pb-1 relative min-h-[96px] flex flex-col justify-between">
        
        {/* Animated Scanning Beam across Page */}
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#60a5fa] animate-scanline z-10 pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[9px]">Domain Age</span>
            <span className="font-bold text-red-400">3 Days Old</span>
          </div>

          <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[9px]">SSL Issuer</span>
            <span className="font-bold text-amber-300">Untrusted CA</span>
          </div>

          <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[9px]">Form Action</span>
            <span className="font-bold text-red-400">Steals NetBanking</span>
          </div>
        </div>

        {/* Live Safety Output Bar */}
        <div className="mt-2.5 p-1.5 bg-red-950/50 rounded-lg border border-red-500/30 flex items-center justify-between text-[10px]">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>{language === 'te' ? 'మోసపూరిత బ్యాంకింగ్ సైట్' : 'Deceptive Banking Clone Intercepted'}</span>
          </span>
          <span className="font-mono text-red-400 font-bold">Risk: 96/100</span>
        </div>

      </div>

    </div>
  );
};

// 2. MEDIA FORENSICS ILLUSTRATION: Media preview with subtle frame-analysis effect
export const MediaForensicsVisual: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full rounded-xl bg-slate-900 text-slate-100 p-3 shadow-md border border-slate-700/80 relative overflow-hidden select-none">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>NEURAL FORENSIC HUD</span>
        </div>
        <span className="text-[9px] text-slate-400 font-mono">Frame 142/300</span>
      </div>

      {/* Frame Preview with Biometric Bounding Box & Landmarks */}
      <div className="mt-2.5 relative bg-slate-950 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between gap-3">
        
        {/* Synthetic Face Silhouette with HUD Grid */}
        <div className="relative w-16 h-16 rounded-lg bg-indigo-950/40 border border-indigo-500/50 flex items-center justify-center shrink-0 overflow-hidden">
          
          {/* Facial Landmark Points */}
          <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_#22d3ee]" />
          <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_#22d3ee]" />
          <div className="absolute top-7 left-7 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          <div className="absolute bottom-4 left-5 right-5 h-1 border-b border-red-400/80" />

          {/* Corner HUD Reticles */}
          <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-indigo-400" />
          <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-indigo-400" />
          <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-indigo-400" />
          <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-indigo-400" />

          <span className="text-[8px] font-mono text-indigo-300">AI DETECT</span>
        </div>

        {/* Forensic Signals Status */}
        <div className="flex-1 space-y-1 text-[10px]">
          <div className="flex justify-between items-center text-slate-300">
            <span>Face Boundary:</span>
            <span className="text-red-400 font-mono font-bold">Warping Detected</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Lighting Physics:</span>
            <span className="text-amber-400 font-mono font-bold">Vector Incoherent</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>EXIF Camera:</span>
            <span className="text-slate-400 font-mono">Missing / Altered</span>
          </div>
        </div>

      </div>

      {/* Likelihood Meter */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
        <span className="text-slate-300 font-medium">Synthetic Likelihood</span>
        <span className="font-mono font-bold text-red-400">87% MANIPULATED</span>
      </div>

    </div>
  );
};

// 3. SCAM RESPONSE ILLUSTRATION: Transaction alert transitioning into a guided action checklist
export const ScamTransitionVisual: React.FC = () => {
  const { language } = useLanguage();
  const [activeView, setActiveView] = useState<'debit' | 'checklist'>('debit');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveView(prev => (prev === 'debit' ? 'checklist' : 'debit'));
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-xl bg-slate-900 text-slate-100 p-3 shadow-md border border-slate-700/80 relative overflow-hidden select-none min-h-[148px] flex flex-col justify-between">
      
      {/* Header with Step Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>GOLDEN HOUR DISPATCH</span>
        </div>
        <span className="text-[9px] font-mono text-slate-400">
          {activeView === 'debit' ? 'Step 1: Incident Trigger' : 'Step 2: Containment Active'}
        </span>
      </div>

      {/* Dynamic Transition Canvas */}
      {activeView === 'debit' ? (
        <div className="py-2.5 space-y-2 animate-in fade-in duration-300">
          <div className="p-2 bg-red-950/60 border border-red-500/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center font-bold text-xs">
                ₹
              </span>
              <div>
                <p className="text-[11px] font-bold text-slate-100 leading-tight">₹15,000 Debited via Fake QR</p>
                <p className="text-[9px] text-slate-400 font-mono">UTR: 326798124982</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-red-400 bg-red-900/50 px-1.5 py-0.5 rounded">
              FRAUD
            </span>
          </div>
          <p className="text-[9px] text-amber-300 italic text-center">
            {language === 'te' ? 'ఆందోళన చెందకండి. తక్షణ స్పందన ప్రారంభమైంది.' : 'Immediate Response Roadmap Activating...'}
          </p>
        </div>
      ) : (
        <div className="py-2 space-y-1.5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-[10px] text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>1930 Cyber Helpline Case Registered</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Recipient VPA Freeze Request Sent</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-300">
            <span className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />
            <span>Admissible Police Report Generated</span>
          </div>
        </div>
      )}

      {/* Footer reassurance bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span>Helpline: <strong>1930</strong> (24x7)</span>
        <span className="text-blue-400 font-semibold cursor-pointer">Open Triage →</span>
      </div>

    </div>
  );
};

// 4. BLACKMAIL RESPONSE ILLUSTRATION: Secure shield animation with a calm, reassuring visual style
export const BlackmailShieldVisual: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="w-full rounded-xl bg-slate-900 text-slate-100 p-3 shadow-md border border-slate-700/80 relative overflow-hidden select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 font-semibold text-red-400 font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>EXTORTION CONTAINMENT</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400">100% Confidential</span>
      </div>

      {/* Calm, Reassuring Layered Shield Grid */}
      <div className="py-2.5 flex items-center gap-3">
        
        {/* Layered Security Shield Icon with Pulse */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-950/60 to-slate-900 border border-red-500/40 flex items-center justify-center shrink-0 shadow-inner">
          <Shield className="w-7 h-7 text-red-400 animate-pulse-subtle" />
          <Lock className="w-3.5 h-3.5 text-white absolute bottom-2 right-2" />
        </div>

        {/* Core Protection Pillars */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="font-bold">Rule 1: Never Pay Extortionists</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>StopNCII.org Image Hash Lock</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Account Lockdown & 2FA Enforced</span>
          </div>
        </div>

      </div>

      {/* Status Bar */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Citizen Safety Roadmap</span>
        <span className="text-red-400 font-semibold cursor-pointer">Emergency Plan →</span>
      </div>

    </div>
  );
};
