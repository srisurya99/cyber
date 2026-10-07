import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Layers, 
  Search, 
  Eye, 
  Info, 
  CheckCircle2, 
  Video,
  ImageIcon
} from 'lucide-react';
import { AIDetectionBadge } from '../../common/AIDetectionBadge';
import { ThreatLensButton } from '../../common/ThreatLensButton';
import { useLanguage } from '../../../i18n/LanguageContext';

export const LiveMediaForensicsDemo: React.FC<{ onNavigateToTool: () => void }> = ({ onNavigateToTool }) => {
  const { language } = useLanguage();

  const [activeSample, setActiveSample] = useState<'synthetic' | 'authentic'>('synthetic');
  const [progress, setProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    setProgress(0);
    setIsScanning(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [activeSample]);

  const handleRestart = () => {
    setProgress(0);
    setIsScanning(true);
  };

  const sampleImage = activeSample === 'synthetic'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-left">
      
      {/* Top Bar with Demo Identifier & Sample Toggles */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-indigo-300">
            {language === 'te' ? 'ప్రత్యక్ష డెమో: మీడియా ఫోరెన్సిక్స్' : 'LIVE DEMONSTRATION · MEDIA FORENSICS'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSample(activeSample === 'synthetic' ? 'authentic' : 'synthetic')}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Switch to {activeSample === 'synthetic' ? 'Authentic' : 'Deepfake'}
          </button>
          <button
            onClick={handleRestart}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            title="Replay scan"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Sample Info Strip */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-semibold text-slate-200">
            {activeSample === 'synthetic' ? 'exec_video_instruction.mp4' : 'authentic_photo.jpg'}
          </span>
          <span className="font-mono text-[11px]">
            {activeSample === 'synthetic' ? 'Video Frame 142/300' : 'Camera Raw Sensor'}
          </span>
        </div>

        {/* Media Preview Canvas with Laser Scanning Beam */}
        <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          
          <img
            src={sampleImage}
            alt="Forensic examination preview"
            className="w-full h-full object-cover opacity-75"
          />

          {/* Real-time Laser Scanning Beam */}
          {isScanning && (
            <motion.div
              initial={{ top: '0%' }}
              animate={{ top: '96%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20 pointer-events-none"
            />
          )}

          {/* Facial Landmark & Biometric HUD Overlays */}
          <div className="absolute inset-8 border border-dashed border-indigo-400/70 rounded-lg pointer-events-none">
            <span className="absolute -top-2 left-2 text-[9px] font-mono font-bold bg-indigo-600 px-1 rounded text-white">
              ROI: BIOMETRIC REGION
            </span>
            <span className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
          </div>

          {/* HUD status banner on bottom */}
          <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-300">
              {isScanning 
                ? (progress < 50 ? 'Phase 1: Biometric Landmark Detection' : 'Phase 2: Raytracing Illumination Coherence')
                : (activeSample === 'synthetic' ? 'Synthesis Artifacts: DETECTED' : 'Camera Sensor Coherent: VERIFIED')}
            </span>
            <span className="text-indigo-400 font-bold">{progress}%</span>
          </div>

        </div>

        {/* Progress Bar & Telemetry Status */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Forensic Pipeline Progress</span>
            <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Analysis Result Banner */}
        <AnimatePresence mode="wait">
          {!isScanning ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Verdict:</span>
                <AIDetectionBadge
                  status={activeSample === 'synthetic' ? 'likely_ai' : 'no_clear_signs'}
                  size="md"
                  confidence={activeSample === 'synthetic' ? 87 : 12}
                />
              </div>

              <p className="text-xs text-slate-300 leading-snug">
                {activeSample === 'synthetic'
                  ? 'Facial boundary jitter, pupil specular mismatch, and missing sensor EXIF headers indicate synthetic generation.'
                  : 'Natural facial pore distribution, coherent ambient lighting vectors, and genuine camera Bayer filter pattern confirmed.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="scanning-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs text-slate-400 font-mono"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Extracting biometric landmarks & DCT frequencies...</span>
              </span>
              <span className="text-cyan-400">Scanning</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notice */}
        <div className="p-3 bg-amber-950/30 border border-amber-600/30 rounded-xl flex items-start gap-2 text-[11px] text-amber-300 leading-relaxed">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Automated detection is probabilistic. Always verify identities independently before responding to financial instructions.
          </span>
        </div>

        {/* Tool Launcher Button */}
        <div className="pt-1">
          <ThreatLensButton
            variant="prominent"
            size="md"
            icon={Search}
            onClick={onNavigateToTool}
            className="w-full bg-indigo-600 hover:bg-indigo-700 border-indigo-500/20"
          >
            Check an Image or Video in Real Time
          </ThreatLensButton>
        </div>

      </div>

    </div>
  );
};
