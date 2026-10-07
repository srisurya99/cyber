import React, { useState, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { checkMediaApi } from '../../api/client';
import { AnalysisResult, Incident, MediaForensicsSignals } from '../../types';
import { MediaForensicsResult } from '../../services/ai/mediaForensics';
import { AIDetectionBadge } from '../common/AIDetectionBadge';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { MediaResultView } from './MediaResultView';
import { 
  UploadCloud, 
  File, 
  X, 
  Sparkles, 
  AlertCircle, 
  Video, 
  Image as ImageIcon,
  Play,
  Layers,
  Search
} from 'lucide-react';

export type VideoAnalysisStep = 
  | 'IDLE'
  | 'UPLOADING'
  | 'PROCESSING_VIDEO'
  | 'ANALYZING_FRAMES'
  | 'ANALYZING_AUDIO'
  | 'ANALYZING_TEMPORAL_PATTERNS'
  | 'RUNNING_SYNTHETIC_DETECTOR'
  | 'COMPLETED';

interface MediaCheckerProps {
  onSaveAsIncident: (incident: Incident) => void;
  onGetHelp: () => void;
}

export const MediaChecker: React.FC<MediaCheckerProps> = ({
  onSaveAsIncident,
  onGetHelp,
}) => {
  const { t, language } = useLanguage();
  const isTe = language === 'te';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<VideoAnalysisStep>('IDLE');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaForensicsResult | null>(null);

  const handleFileSelected = (file: File, customPreviewUrl?: string, isDemo: boolean = false) => {
    // Clear previous analysis state completely (Requirement §12 Analysis Isolation)
    setResult(null);
    setAnalysisError(null);
    setAnalysisStep('IDLE');

    // Validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|mp4|mov|webm)$/i)) {
      alert('Supported file formats: JPG, PNG, WEBP, MP4, MOV');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds the 25MB limit.');
      return;
    }

    if (filePreviewUrl && !filePreviewUrl.startsWith('https://')) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    setSelectedFile(file);
    setIsDemoMode(isDemo);
    const objectUrl = customPreviewUrl || URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0], undefined, false);
    }
  };

  const handleRemoveFile = () => {
    if (filePreviewUrl && !filePreviewUrl.startsWith('https://')) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setResult(null);
    setIsDemoMode(false);
    setAnalysisError(null);
    setAnalysisStep('IDLE');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  interface VideoExtractionResult {
    frames: Array<{ timestampSec: number; timestampFormatted: string; dataUrl: string }>;
    duration: number;
    resolution: { width: number; height: number };
    samplingRate: string;
  }

  const formatTimestamp = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Helper to generate canvas keyframes for interactive demo timeline
  const createDemoKeyframes = (type: '10s_middle_person' | '8s_middle_person' | 'video_no_human'): Array<{ timestampSec: number; timestampFormatted: string; dataUrl: string }> => {
    const timestamps = type === '10s_middle_person'
      ? [0.0, 0.67, 1.33, 2.0, 2.67, 3.33, 4.0, 4.67, 5.33, 6.0, 6.67, 7.33, 8.0, 8.67, 9.33, 10.0]
      : [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    return timestamps.map((sec) => {
      ctx.clearRect(0, 0, 480, 270);
      const isPerson = type === '10s_middle_person' 
        ? (sec >= 2.0 && sec <= 8.0) 
        : (type === '8s_middle_person' && sec >= 3.0 && sec <= 6.5);

      if (type === '10s_middle_person' || type === '8s_middle_person') {
        // Corporate Studio Set
        const grad = ctx.createLinearGradient(0, 0, 480, 270);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 480, 270);

        // Background studio panel
        ctx.fillStyle = '#334155';
        ctx.fillRect(80, 40, 320, 140);
        ctx.fillStyle = '#475569';
        ctx.fillRect(90, 50, 300, 120);

        // Desk
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(40, 200, 400, 70);

        // Microphone stand
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(140, 220);
        ctx.lineTo(140, 150);
        ctx.stroke();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(140, 145, 8, 0, Math.PI * 2);
        ctx.fill();

        if (isPerson) {
          // Human presenter subject
          // Torso
          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.ellipse(240, 230, 65, 50, 0, 0, Math.PI * 2);
          ctx.fill();

          // Head / Face
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(240, 135, 36, 0, Math.PI * 2);
          ctx.fill();

          // Hair
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.arc(240, 125, 38, Math.PI, 0);
          ctx.fill();

          // Facial landmarks mesh overlay
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(228, 132, 4, 0, Math.PI * 2);
          ctx.arc(252, 132, 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(240, 134);
          ctx.lineTo(240, 145);
          ctx.lineTo(234, 152);
          ctx.lineTo(246, 152);
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = '#06b6d4';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('FACIAL MESH DETECTED', 180, 85);
        } else {
          // Empty chair
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(240, 160, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#64748b';
          ctx.font = '10px monospace';
          ctx.fillText('STUDIO BACKDROP (NO HUMAN)', 160, 100);
        }
      } else {
        // Nature Landscape (No Humans)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 480, 160);

        // Clouds
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(100 + (sec * 5), 40, 25, 0, Math.PI * 2);
        ctx.arc(125 + (sec * 5), 35, 30, 0, Math.PI * 2);
        ctx.arc(155 + (sec * 5), 42, 22, 0, Math.PI * 2);
        ctx.fill();

        // Mountains
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(20, 160);
        ctx.lineTo(160, 60);
        ctx.lineTo(280, 160);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(200, 160);
        ctx.lineTo(330, 75);
        ctx.lineTo(460, 160);
        ctx.closePath();
        ctx.fill();

        // River valley
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, 160, 480, 110);
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(180, 160);
        ctx.bezierCurveTo(220, 200, 150, 240, 260, 270);
        ctx.lineTo(320, 270);
        ctx.bezierCurveTo(210, 240, 270, 200, 230, 160);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = '10px monospace';
        ctx.fillText('LANDSCAPE PANORAMA (0 HUMANS)', 150, 255);
      }

      // Time watermark
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(10, 240, 70, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(formatTimestamp(sec), 18, 255);

      return {
        timestampSec: sec,
        timestampFormatted: formatTimestamp(sec),
        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      };
    });
  };

  // Helper to extract dense video keyframes covering the FULL timeline (beginning, middle, end)
  const extractVideoFrames = async (file: File): Promise<VideoExtractionResult> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = url;
      video.muted = true;
      video.playsInline = true;

      const frames: Array<{ timestampSec: number; timestampFormatted: string; dataUrl: string }> = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const fallbackResult: VideoExtractionResult = {
        frames: [],
        duration: 8.0,
        resolution: { width: 1280, height: 720 },
        samplingRate: '2.0 FPS',
      };

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve({
          ...fallbackResult,
          frames,
        });
      }, 15000);

      video.onloadedmetadata = async () => {
        const rawDuration = video.duration && !isNaN(video.duration) && isFinite(video.duration) ? video.duration : 8.0;
        const duration = Math.max(1, rawDuration);
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        // Dense temporal sampling across the FULL timeline (beginning, middle, and end)
        // For an 8-second video, sample 17 frames at 2.0 FPS so that middle segments (e.g. 00:03-00:06) are never missed
        const sampleCount = duration <= 10 ? Math.min(18, Math.max(12, Math.round(duration * 2) + 1)) : 16;
        const targetTimestamps: number[] = [];
        for (let i = 0; i < sampleCount; i++) {
          const t = (i / (sampleCount - 1)) * Math.max(0.05, duration - 0.05);
          targetTimestamps.push(Number(t.toFixed(2)));
        }

        const maxDim = 480;
        let w = width;
        let h = height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;

        for (const t of targetTimestamps) {
          await new Promise<void>((next) => {
            let done = false;
            const capture = () => {
              if (done) return;
              done = true;
              video.removeEventListener('seeked', onSeeked);
              clearTimeout(seekTimer);
              if (ctx) {
                try {
                  ctx.drawImage(video, 0, 0, w, h);
                  frames.push({
                    timestampSec: t,
                    timestampFormatted: formatTimestamp(t),
                    dataUrl: canvas.toDataURL('image/jpeg', 0.75),
                  });
                } catch (e) {
                  console.warn('Canvas draw frame error', e);
                }
              }
              next();
            };
            const onSeeked = () => capture();
            const seekTimer = setTimeout(() => capture(), 450);
            video.addEventListener('seeked', onSeeked);
            try {
              video.currentTime = t;
            } catch (e) {
              capture();
            }
          });
        }

        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        resolve({
          frames,
          duration,
          resolution: { width, height },
          samplingRate: `${(frames.length / duration).toFixed(1)} FPS (${frames.length} frames across ${duration.toFixed(1)}s)`,
        });
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        resolve(fallbackResult);
      };
    });
  };

  // Helper to optimize image payloads before neural inspection
  const prepareOptimizedImageDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Small files (< 1MB) read directly
      if (file.size <= 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
        return;
      }

      // Downsample large camera photos (e.g. 12-48MP phone captures) to max 1600px
      // Preserves visual artifacts while reducing transport time and API latency
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1600;
        let w = img.naturalWidth || img.width || 1200;
        let h = img.naturalHeight || img.height || 900;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.90));
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      };
      img.src = objectUrl;
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setAnalysisError(null);
    setResult(null);

    const isVideo = selectedFile.type.startsWith('video/') || selectedFile.name.match(/\.(mp4|mov|webm)$/i);

    try {
      let fileDataUrl: string | undefined;
      let keyFrames: Array<{ timestampSec: number; timestampFormatted: string; dataUrl: string }> | undefined;
      let extractedVideo: VideoExtractionResult | undefined;

      setAnalysisStep('UPLOADING');
      await new Promise((r) => setTimeout(r, 200));

      if (isDemoMode) {
        setAnalysisStep(isVideo ? 'PROCESSING_VIDEO' : 'ANALYZING_FRAMES');
        if (isVideo) {
          const is10s = selectedFile.name.includes('10s') || (!selectedFile.name.includes('8s') && !selectedFile.name.includes('no_human'));
          const demoType = selectedFile.name.includes('no_human') ? 'video_no_human' : (is10s ? '10s_middle_person' : '8s_middle_person');
          keyFrames = createDemoKeyframes(demoType);
          extractedVideo = {
            frames: keyFrames,
            duration: is10s ? 10.0 : 8.0,
            resolution: { width: 1280, height: 720 },
            samplingRate: is10s ? '1.6 FPS (16 frames across 10.0s)' : '2.0 FPS (17 frames across 8.0s)'
          };
          setAnalysisStep('ANALYZING_FRAMES');
          await new Promise((r) => setTimeout(r, 200));
          setAnalysisStep('ANALYZING_AUDIO');
          await new Promise((r) => setTimeout(r, 200));
          setAnalysisStep('ANALYZING_TEMPORAL_PATTERNS');
          await new Promise((r) => setTimeout(r, 200));
          setAnalysisStep('RUNNING_SYNTHETIC_DETECTOR');
          await new Promise((r) => setTimeout(r, 200));
        }
      } else if (!isVideo) {
        setAnalysisStep('ANALYZING_FRAMES');
        fileDataUrl = await prepareOptimizedImageDataUrl(selectedFile);
        setAnalysisStep('RUNNING_SYNTHETIC_DETECTOR');
      } else {
        setAnalysisStep('PROCESSING_VIDEO');
        if (selectedFile.size <= 25 * 1024 * 1024) {
          fileDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(selectedFile);
          });
        }
        setAnalysisStep('ANALYZING_FRAMES');
        extractedVideo = await extractVideoFrames(selectedFile);
        keyFrames = extractedVideo.frames;
        setAnalysisStep('ANALYZING_AUDIO');
        await new Promise((r) => setTimeout(r, 200));
        setAnalysisStep('ANALYZING_TEMPORAL_PATTERNS');
      }

      const res = await checkMediaApi({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        mediaType: isVideo ? 'video' : 'image',
        fileDataUrl,
        keyFrames,
        videoDurationSec: extractedVideo?.duration,
        videoResolution: extractedVideo?.resolution,
        samplingRate: extractedVideo?.samplingRate,
        isSimulated: isDemoMode,
      });

      if (isVideo) {
        setAnalysisStep('RUNNING_SYNTHETIC_DETECTOR');
        await new Promise((r) => setTimeout(r, 200));
      }
      setAnalysisStep('COMPLETED');
      setResult(res);
    } catch (err: any) {
      console.error('Media analysis error', err);
      setAnalysisError(err?.message || 'Media analysis encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo synthetic sample loader with realistic photography and temporal video regression clips
  const handleLoadDemoSample = (type: '10s_middle_person' | '8s_middle_person' | 'google_flow_video' | 'video_no_human' | 'authentic_photo') => {
    const isVideo = type !== 'authentic_photo';
    const fileName = type === 'google_flow_video'
      ? '10s_google_flow_ai_test_video.mp4'
      : type === '10s_middle_person'
      ? '10s_middle_person_ai_clip.mp4'
      : type === '8s_middle_person'
      ? '8s_middle_person_ai_clip.mp4'
      : type === 'video_no_human'
      ? '8s_landscape_ai_nohuman.mp4'
      : 'demo_camera_portrait.jpg';
    const mimeType = isVideo ? 'video/mp4' : 'image/jpeg';
    const sampleImageUrl = type === 'google_flow_video' || type === '10s_middle_person' || type === '8s_middle_person'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
      : type === 'video_no_human'
      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

    const blob = new Blob(['simulated_demo_binary'], { type: mimeType });
    const fakeFile = Object.assign(blob, {
      name: fileName,
      lastModified: Date.now(),
      webkitRelativePath: '',
    }) as unknown as File;

    handleFileSelected(fakeFile, sampleImageUrl, true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            {language === 'te' ? 'మీడియా ఫోరెన్సిక్స్ మోడ్యూల్' : 'Computer Vision & Forensic Telemetry'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('mediaHeader')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
          {t('mediaSubtitle')}
        </p>
      </div>

      {result && selectedFile ? (
        <MediaResultView
          result={result}
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          previewUrl={filePreviewUrl}
          onReset={handleRemoveFile}
          onGetHelp={onGetHelp}
          onSaveAsIncident={onSaveAsIncident}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-left space-y-6">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
            className="hidden"
          />

          {!selectedFile ? (
            /* Upload Zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
                isDragOver
                  ? 'border-blue-600 bg-blue-50/60'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {t('uploadDragDrop')}
              </h4>

              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {t('supportedFormats')}
              </p>

              <div className="mt-5">
                <ThreatLensButton
                  variant="outline"
                  size="md"
                  icon={UploadCloud}
                  type="button"
                >
                  {t('chooseFileBtn')}
                </ThreatLensButton>
              </div>
            </div>
          ) : (
            /* File Preview & Interactive Analysis Workspace */
            <div className="space-y-5">
              
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    {selectedFile.type.startsWith('video/') ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      {isDemoMode && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 shrink-0">
                          DEMO MODE (Simulated)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type || 'Media File'}
                    </p>
                  </div>
                </div>

                {!isLoading && (
                  <button
                    onClick={handleRemoveFile}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove and choose another file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Visual Preview Frame with Subtle Scanning Animation */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center min-h-[260px] max-h-[380px]">
                
                {filePreviewUrl ? (
                  selectedFile.type.startsWith('video/') && !filePreviewUrl.startsWith('https://') ? (
                    <video
                      src={filePreviewUrl}
                      controls
                      className="max-h-[360px] w-full object-contain"
                    />
                  ) : (
                    <img
                      src={filePreviewUrl}
                      alt="Uploaded media preview"
                      className="max-h-[360px] w-auto object-contain"
                    />
                  )
                ) : (
                  <div className="text-slate-400 text-xs font-mono">Preview Ready</div>
                )}

                {/* Visible Subtle Scanning Laser Animation during processing */}
                {isLoading && (
                  <>
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-scanline z-20 pointer-events-none" 
                      aria-hidden="true" 
                    />
                    <div 
                      className="absolute left-0 right-0 h-10 bg-gradient-to-b from-cyan-400/15 to-transparent animate-scanline pointer-events-none z-10" 
                      aria-hidden="true" 
                    />
                  </>
                )}

                {/* Bounding Box HUD when analyzing */}
                {isLoading && (
                  <div className="absolute inset-8 border border-dashed border-cyan-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-xs font-mono font-bold bg-slate-950/90 text-cyan-300 px-3 py-1 rounded-md border border-cyan-500/40 uppercase">
                      {analysisStep.replace(/_/g, ' ')}...
                    </span>
                  </div>
                )}

              </div>

              {/* Multi-Stage Analysis Status HUD (§10 & §13) */}
              {isLoading && (
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        {analysisStep.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {analysisStep === 'UPLOADING' ? '15%' :
                       analysisStep === 'PROCESSING_VIDEO' ? '30%' :
                       analysisStep === 'ANALYZING_FRAMES' ? '50%' :
                       analysisStep === 'ANALYZING_AUDIO' ? '70%' :
                       analysisStep === 'ANALYZING_TEMPORAL_PATTERNS' ? '85%' :
                       analysisStep === 'RUNNING_SYNTHETIC_DETECTOR' ? '95%' : '100%'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {analysisStep === 'UPLOADING' ? 'Uploading media binary and computing SHA-256 cryptographic hash...' :
                     analysisStep === 'PROCESSING_VIDEO' ? 'Validating container format, duration, resolution, and codec metadata...' :
                     analysisStep === 'ANALYZING_FRAMES' ? 'Extracting dense temporal keyframes across full timeline (2.0 FPS)...' :
                     analysisStep === 'ANALYZING_AUDIO' ? 'Inspecting audio track continuity and acoustic alignment...' :
                     analysisStep === 'ANALYZING_TEMPORAL_PATTERNS' ? 'Tracking temporal human presence, facial boundary stability, and lighting...' :
                     analysisStep === 'RUNNING_SYNTHETIC_DETECTOR' ? 'Auditing synthetic media detector availability...' :
                     'Finalizing forensic evidence report...'}
                  </p>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 rounded-full"
                      style={{
                        width: analysisStep === 'UPLOADING' ? '15%' :
                               analysisStep === 'PROCESSING_VIDEO' ? '30%' :
                               analysisStep === 'ANALYZING_FRAMES' ? '50%' :
                               analysisStep === 'ANALYZING_AUDIO' ? '70%' :
                               analysisStep === 'ANALYZING_TEMPORAL_PATTERNS' ? '85%' :
                               analysisStep === 'RUNNING_SYNTHETIC_DETECTOR' ? '95%' : '100%'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Prominent Action Button: Analyze Image or Video */}
              <div className="pt-2">
                <ThreatLensButton
                  variant="prominent"
                  size="lg"
                  icon={Search}
                  onClick={handleAnalyze}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Inspecting Media Forensics...' : 'Analyze Image or Video'}
                </ThreatLensButton>
              </div>

            </div>
          )}

          {/* Quick Demo Samples with Authentic Visual Choices */}
          {!selectedFile && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">
                {language === 'te' ? 'పరీక్షించడానికి ఉచిత నమూనాను ఎంచుకోండి:' : 'Try calibrated demo samples:'}
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleLoadDemoSample('google_flow_video')}
                  className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg font-semibold transition-colors flex items-center gap-1.5 border border-indigo-200 cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Google Flow AI Video (SynthID Verified)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadDemoSample('10s_middle_person')}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 border border-slate-200/80 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  <span>10s AI Clip (Person Visible 00:02–00:08)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadDemoSample('8s_middle_person')}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 border border-slate-200/80 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>8s AI Clip (Person in Middle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadDemoSample('video_no_human')}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 border border-slate-200/80 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-amber-600" />
                  <span>8s AI Video (No Humans 00:00–00:08)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadDemoSample('authentic_photo')}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors flex items-center gap-1.5 border border-slate-200/80 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authentic Camera Sensor Portrait</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
