import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  FileText, 
  Lock, 
  ArrowRight,
  RefreshCw,
  Eye,
  Key
} from 'lucide-react';
import { ApkAnalysisRequest, ApkAnalysisResult, Incident } from '../../types';
import { analyzeApkApi } from '../../api/client';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface ApkInspectorProps {
  onIncidentCreated?: (incident: Incident) => void;
  onGetHelp?: () => void;
}

export const ApkInspector: React.FC<ApkInspectorProps> = ({
  onIncidentCreated,
  onGetHelp,
}) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [fileName, setFileName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [fileSize, setFileSize] = useState<number>(14500000);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'android.permission.BIND_ACCESSIBILITY_SERVICE',
    'android.permission.RECEIVE_SMS',
    'android.permission.SYSTEM_ALERT_WINDOW',
  ]);
  const [isInstalled, setIsInstalled] = useState(true);
  const [hasSensitiveAccess, setHasSensitiveAccess] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ApkAnalysisResult | null>(null);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  const availablePermissions = [
    { id: 'android.permission.BIND_ACCESSIBILITY_SERVICE', label: 'Accessibility Service Control (Auto-tap / Keylogger)', risk: 'Critical' },
    { id: 'android.permission.RECEIVE_SMS', label: 'Receive SMS (Intercepting Bank OTPs)', risk: 'Critical' },
    { id: 'android.permission.READ_SMS', label: 'Read SMS Inbox (Scraping OTPs & Statements)', risk: 'Critical' },
    { id: 'android.permission.READ_CONTACTS', label: 'Read Contacts (Address book scraping / loan blackmail)', risk: 'High' },
    { id: 'android.permission.SYSTEM_ALERT_WINDOW', label: 'Draw Over Other Apps (Fake Banking Login Overlays)', risk: 'High' },
    { id: 'android.permission.REQUEST_INSTALL_PACKAGES', label: 'Install Unknown Apps (Secondary Malware Dropper)', risk: 'High' },
    { id: 'android.permission.RECORD_AUDIO', label: 'Record Audio (Covert Microphone)', risk: 'High' },
    { id: 'android.permission.CAMERA', label: 'Camera Access (Covert Photography)', risk: 'High' },
  ];

  const presets = [
    {
      title: isTe ? 'నకిలీ SBI YONO బ్యాంకింగ్ ట్రోజన్' : 'Fake SBI YONO Banking Trojan (SMS + Accessibility)',
      fileName: 'SBI_YONO_Update_v4.2.apk',
      packageName: 'com.sbi.lotus.secureapp',
      permissions: [
        'android.permission.BIND_ACCESSIBILITY_SERVICE',
        'android.permission.RECEIVE_SMS',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.READ_SMS',
      ],
      isInstalled: true,
      hasSensitiveAccess: true,
    },
    {
      title: isTe ? 'తక్షణ లోన్ కాంటాక్ట్ స్క్రాపర్ యాప్' : 'Predatory Instant Rupee Loan (Contact Scraper)',
      fileName: 'Fast_Rupee_Instant_Loan.apk',
      packageName: 'com.instant.rupee.cashcredit',
      permissions: [
        'android.permission.READ_CONTACTS',
        'android.permission.CAMERA',
        'android.permission.READ_SMS',
      ],
      isInstalled: true,
      hasSensitiveAccess: false,
    },
    {
      title: isTe ? 'నిరపాయకరమైన అధికారిక యాప్' : 'Standard Calculator / Utility (Safe Baseline)',
      fileName: 'Clean_Utility_Calc.apk',
      packageName: 'org.foss.simplecalculator',
      permissions: [],
      isInstalled: false,
      hasSensitiveAccess: false,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setFileName(p.fileName);
    setPackageName(p.packageName);
    setSelectedPermissions(p.permissions);
    setIsInstalled(p.isInstalled);
    setHasSensitiveAccess(p.hasSensitiveAccess);
    setAnalysisResult(null);
    setCreatedIncident(null);
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeApkApi({
        fileName: fileName || 'unnamed_android_app.apk',
        fileSize,
        packageName: packageName || 'com.unspecified.package',
        permissions: selectedPermissions,
        installedOnDevice: isInstalled,
        sensitiveAccessGranted: hasSensitiveAccess,
      });

      setAnalysisResult(res.analysis);
      if (res.incident) {
        setCreatedIncident(res.incident);
      }
    } catch (err) {
      console.error('Failed to analyze APK:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Smartphone className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                THREATLENS FORENSICS 2.0
              </span>
              <span className="text-xs text-slate-500 font-medium">Safe Static Inspector</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {isTe ? 'అనుమానాస్పద యాండ్రాయిడ్ యాప్ (APK) తనిఖీ' : 'Malicious Application & APK Inspector'}
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {isTe
                ? 'మీరు వాట్సాప్ లేదా తెలియని లింకుల ద్వారా డౌన్‌లోడ్ చేసిన APK ఫైల్ అనుమతులను విశ్లేషించండి. బ్యాంకింగ్ ట్రోజన్లు, లోన్ యాప్‌ల వేధింపులను అరికట్టండి.'
                : 'Safely audit suspicious Android package files (APKs) without executing untrusted code on your device. Identifies SMS interception, accessibility hijacking, and contact scraping.'}
            </p>
          </div>
        </div>

        {/* Real-world Scenarios Quick Pick */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
            {isTe ? 'వాస్తవ నమూనా దృశ్యాలు (పరీక్షించడానికి ఎంచుకోండి):' : 'Sample Real-World Threat Scenarios (Click to test):'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs font-medium text-slate-800"
              >
                <div className="font-semibold text-slate-900">{preset.title}</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5 truncate">{preset.fileName}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Inspection Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isTe ? 'APK ఫైల్ పేరు' : 'APK File Name'}
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. SBI_YONO_Verification.apk"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {isTe ? 'ప్యాకేజీ పేరు (Package Name)' : 'Package Identifier (if known)'}
            </label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="e.g. com.sbi.lotus.secureapp"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Current State Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isInstalled}
              onChange={(e) => setIsInstalled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-800">
              {isTe ? 'నేను ఈ యాప్‌ను నా ఫోన్‌లో ఇన్‌స్టాల్ చేశాను' : 'I have already installed this application on my phone'}
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSensitiveAccess}
              onChange={(e) => setHasSensitiveAccess(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-800">
              {isTe ? 'నేను దీనిలో బ్యాంకింగ్ లేదా వ్యక్తిగత వివరాలు నమోదు చేశాను' : 'I entered bank details or granted Accessibility permissions'}
            </span>
          </label>
        </div>

        {/* Declared Permissions Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {isTe ? 'అభ్యర్థించిన / ప్రకటించిన అనుమతులు (Permissions requested):' : 'Declared Android Permissions (Select all that apply):'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availablePermissions.map((perm) => {
              const isChecked = selectedPermissions.includes(perm.id);
              return (
                <div
                  key={perm.id}
                  onClick={() => handleTogglePermission(perm.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isChecked
                      ? 'border-red-300 bg-red-50/60 text-red-900 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{perm.label}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{perm.id}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                    perm.risk === 'Critical' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                    {perm.risk}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <ThreatLensButton
            variant="primary"
            size="lg"
            className="w-full justify-center"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                {isTe ? 'స్టాటిక్ మానిఫెస్ట్ తనిఖీ జరుగుతోంది...' : 'Auditing Package Permissions...'}
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 mr-2" />
                {isTe ? 'APK భద్రతను విశ్లేషించండి' : 'Analyze Application Safety & Containment'}
              </>
            )}
          </ThreatLensButton>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                ANALYSIS VERDICT
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {analysisResult.summary}
              </h3>
            </div>
            <RiskBadge level={analysisResult.risk_level} />
          </div>

          {/* Classification & SHA256 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">CLASSIFICATION</span>
              <span className="font-bold text-slate-900 mt-0.5 block uppercase">
                {analysisResult.trojanCategory?.replace('_', ' ') || 'SUSPICIOUS APP'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">PACKAGE IDENTIFIER</span>
              <span className="font-mono text-slate-900 mt-0.5 block truncate">
                {analysisResult.packageName || fileName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">PACKAGE SHA-256 HASH</span>
              <span className="font-mono text-slate-900 mt-0.5 block truncate">
                {analysisResult.technical_signals?.fileHash || 'Calculated in Dossier'}
              </span>
            </div>
          </div>

          {/* Dangerous Permissions Evaluated */}
          {analysisResult.dangerousPermissions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                {isTe ? 'గుర్తించిన ప్రమాదకర అనుమతులు:' : 'High-Risk Permissions Identified:'}
              </h4>
              <div className="space-y-2">
                {analysisResult.dangerousPermissions.map((dp, idx) => (
                  <div key={idx} className="p-3 bg-red-50/50 rounded-xl border border-red-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-red-900">{dp.permission}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-red-200 text-red-800 rounded-sm">
                        {dp.risk}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1">{dp.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Containment Roadmap */}
          <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{isTe ? 'తక్షణ ఫోన్ రక్షణ & కట్టడి చర్యలు (Containment Roadmap):' : 'Immediate Citizen Containment Roadmap:'}</span>
            </div>
            <ol className="space-y-2 text-xs text-amber-950 leading-relaxed list-none pl-0">
              {analysisResult.containmentRoadmap.map((step, idx) => (
                <li key={idx} className="p-2.5 bg-white/90 rounded-lg border border-amber-200/60 font-medium flex items-start gap-2">
                  <span className="font-bold text-amber-700 whitespace-nowrap">{idx + 1}.</span>
                  <span>{step.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Save / Dossier CTA */}
          {createdIncident && onIncidentCreated && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Incident record <span className="font-mono font-semibold text-slate-700">{createdIncident.id}</span> generated.
              </p>
              <ThreatLensButton
                variant="primary"
                size="md"
                onClick={() => onIncidentCreated(createdIncident)}
              >
                {isTe ? 'ఈ సంఘటనను భద్రపరచి నివేదిక చూడండి' : 'Save Incident & View Full Dossier'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </ThreatLensButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
