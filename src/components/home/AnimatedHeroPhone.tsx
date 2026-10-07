import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Lock, 
  Sparkles, 
  ExternalLink,
  Layers,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface AnimatedHeroPhoneProps {
  onSelectAction: (actionKey: 'wizard' | 'phishing' | 'media' | 'scam') => void;
}

export const AnimatedHeroPhone: React.FC<AnimatedHeroPhoneProps> = ({ onSelectAction }) => {
  const { language } = useLanguage();
  const [scanStep, setScanStep] = useState<'scanning' | 'flagged' | 'protected'>('scanning');

  useEffect(() => {
    // Loop through realistic citizen threat detection sequence
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev === 'scanning') return 'flagged';
        if (prev === 'flagged') return 'protected';
        return 'scanning';
      });
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none py-4">
      
      {/* Ambient background glow behind device */}
      <div 
        className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-slate-200/40 rounded-3xl blur-2xl -z-10" 
        aria-hidden="true" 
      />

      {/* Floating Badge 1: Phishing Alert (Top Left) */}
      <div 
        onClick={() => onSelectAction('phishing')}
        className="hidden sm:flex absolute -left-6 top-10 z-20 items-center gap-2.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-red-200 shadow-md animate-float-slow cursor-pointer hover:scale-105 transition-transform"
        role="button"
        title="Check Phishing Detection"
      >
        <div className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-900 leading-tight">
            {language === 'te' ? 'ఫిషింగ్ లింక్ గుర్తించబడింది' : 'Phishing Intercepted'}
          </div>
          <div className="text-[9px] font-mono text-red-600">
            sbi-kyc-verify-portal.in
          </div>
        </div>
      </div>

      {/* Floating Badge 2: Media Forensics (Top Right) */}
      <div 
        onClick={() => onSelectAction('media')}
        className="hidden sm:flex absolute -right-6 top-32 z-20 items-center gap-2.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-indigo-200 shadow-md animate-float-alt cursor-pointer hover:scale-105 transition-transform"
        role="button"
        title="Check Media Forensics"
      >
        <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-900 leading-tight">
            {language === 'te' ? 'డీప్‌ఫేక్ వీడియో స్కాన్' : 'Media Forensic Scan'}
          </div>
          <div className="text-[9px] font-mono text-indigo-600">
            SynthID & Provenance Check
          </div>
        </div>
      </div>

      {/* Floating Badge 3: Scam Prevention (Bottom Left) */}
      <div 
        onClick={() => onSelectAction('scam')}
        className="hidden sm:flex absolute -left-4 bottom-14 z-20 items-center gap-2.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-emerald-200 shadow-md animate-float-delayed cursor-pointer hover:scale-105 transition-transform"
        role="button"
        title="Check Scam Response"
      >
        <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-900 leading-tight">
            {language === 'te' ? 'యూపీఐ రివర్స్ ట్రాప్ నివారించబడింది' : 'UPI Trap Neutralized'}
          </div>
          <div className="text-[9px] text-slate-500">
            Golden Hour 1930 Active
          </div>
        </div>
      </div>

      {/* REALISTIC 3D SMARTPHONE CHASSIS */}
      <div className="relative mx-auto w-[290px] sm:w-[310px] rounded-[44px] p-[10px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.22),0_4px_12px_rgba(15,23,42,0.12)] border border-slate-600/40">
        
        {/* Device Outer Metallic Edge Highlights */}
        <div className="absolute inset-[1px] rounded-[43px] border border-white/20 pointer-events-none" />
        
        {/* Hardware Button Insets */}
        <div className="absolute -left-[13px] top-[90px] w-[3px] h-[32px] bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[13px] top-[135px] w-[3px] h-[32px] bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[13px] top-[110px] w-[3px] h-[48px] bg-slate-700 rounded-r-sm" />

        {/* SCREEN BEZEL & INNER DISPLAY */}
        <div className="relative bg-[#090D16] text-white rounded-[36px] overflow-hidden border-[4px] border-[#0F172A] aspect-[9/19] flex flex-col justify-between">
          
          {/* Subtle Screen Diagonal Glare Line */}
          <div 
            className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none z-30" 
            aria-hidden="true" 
          />

          {/* STATUS BAR & DYNAMIC ISLAND */}
          <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-slate-300 font-medium z-20">
            <span>10:42</span>

            {/* Dynamic Island Pill */}
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-slate-300" />
              <Wifi className="w-3 h-3 text-slate-300" />
              <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* SMS / MESSAGING APP HEADER */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-200">
                SBI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  <span>VM-SBIBNK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Unverified sender" />
                </p>
                <p className="text-[9px] text-slate-400">SMS · Priority Alert</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Today</span>
          </div>

          {/* MESSAGE FEED & SCANNING VISUAL ENGINE */}
          <div className="p-3.5 flex-1 flex flex-col justify-center space-y-3 z-10">
            
            {/* The Suspicious Message Bubble with Live Scanning Line */}
            <div className="relative bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-left shadow-lg overflow-hidden">
              
              {/* Animated Scanning Laser Line */}
              {scanStep === 'scanning' && (
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38bdf8] animate-scanline z-20 pointer-events-none" 
                  aria-hidden="true" 
                />
              )}

              {/* Laser Veil Glow */}
              {scanStep === 'scanning' && (
                <div 
                  className="absolute left-0 right-0 h-6 bg-gradient-to-b from-cyan-500/15 to-transparent animate-scanline pointer-events-none z-10" 
                  aria-hidden="true" 
                />
              )}

              <p className="text-[11px] leading-relaxed text-slate-200">
                Dear SBI user, your NetBanking access will be 
                <span className="text-red-400 font-bold mx-0.5 underline decoration-red-500/80">suspended today</span> 
                due to unverified PAN. Update immediately:
              </p>
              
              <div className="mt-1.5 p-1.5 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center justify-between text-[10px] font-mono text-red-300">
                <span className="truncate">http://sbi-kyc-verify-portal.in</span>
                <ExternalLink className="w-3 h-3 text-red-400 shrink-0 ml-1" />
              </div>
            </div>

            {/* REAL-TIME ANALYSIS TELEMETRY CARD */}
            <div className="transition-all duration-300">
              {scanStep === 'scanning' && (
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-blue-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-[10px] font-medium text-blue-200">
                      ThreatLens AI analyzing URL & syntax...
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-blue-400">Scanning</span>
                </div>
              )}

              {scanStep === 'flagged' && (
                <div className="p-3 bg-red-950/70 border border-red-500/60 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>HIGH RISK PHISHING</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-red-300 bg-red-900/50 px-1.5 py-0.5 rounded">
                      94% Confident
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    Deceptive domain mimicking State Bank. Credential harvesting detected.
                  </p>
                </div>
              )}

              {scanStep === 'protected' && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/60 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CITIZEN PROTECTED</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300">Safe</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    Link blocked. Incident logged with official 1930 reporting dossier.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Simulator Button on Phone */}
            <button
              onClick={() => onSelectAction('phishing')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'పూర్తి విశ్లేషణను తెరవండి' : 'Inspect Threat in ThreatLens'}</span>
            </button>
          </div>

          {/* HOME INDICATOR BAR */}
          <div className="py-2 flex justify-center z-20">
            <div className="w-28 h-1 bg-slate-500/70 rounded-full" />
          </div>

        </div>
      </div>

    </div>
  );
};
