import React, { useState } from 'react';
import { 
  HelpCircle, 
  Link as LinkIcon, 
  Send, 
  Smartphone, 
  Image as ImageIcon, 
  ShieldAlert, 
  UserX, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  Save,
  RotateCcw
} from 'lucide-react';
import { Incident, RiskLevel, IncidentAction, TimelineEvent } from '../../types';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { useLanguage } from '../../i18n/LanguageContext';

interface CitizenIncidentWizardProps {
  onIncidentCreated: (incident: Incident) => void;
  onNavigateTab: (tab: 'phishing' | 'media' | 'scam' | 'blackmail' | 'apk' | 'digital-arrest') => void;
}

export type WizardScenario = 
  | 'link'
  | 'money'
  | 'account'
  | 'apk'
  | 'media'
  | 'threat'
  | 'impersonation'
  | 'other';

export const CitizenIncidentWizard: React.FC<CitizenIncidentWizardProps> = ({
  onIncidentCreated,
  onNavigateTab,
}) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedScenario, setSelectedScenario] = useState<WizardScenario | null>(null);

  // Scenario specific state
  const [scenarioDetails, setScenarioDetails] = useState({
    transferredAmount: '',
    paymentApp: 'Google Pay',
    suspiciousUrl: '',
    accountPlatform: 'WhatsApp',
    appName: '',
    threatDetails: '',
    immediateHarmRisk: false,
    enteredOtpOrPin: false,
  });

  const scenarioOptions = [
    {
      id: 'link' as const,
      icon: LinkIcon,
      title: isTe ? 'నేను అనుమానాస్పద లింక్‌పై క్లిక్ చేసాను' : 'I clicked a suspicious link',
      subtitle: isTe ? 'బ్యాంకింగ్ లేదా అపరిచిత SMS లింక్' : 'Banking SMS, electricity bill, or lottery message link',
      targetTool: 'phishing' as const,
    },
    {
      id: 'money' as const,
      icon: Send,
      title: isTe ? 'నేను డబ్బు బదిలీ చేసాను / నష్టపోయాను' : 'I transferred money to someone',
      subtitle: isTe ? 'UPI QR స్కాన్, తప్పుడు రీఫండ్ లేదా పెట్టుబడి మోసం' : 'UPI collect request, fake QR code, or task scam',
      targetTool: 'scam' as const,
    },
    {
      id: 'account' as const,
      icon: UserX,
      title: isTe ? 'ఎవరో నా ఖాతాలోకి ప్రవేశించారు (హ్యాకింగ్)' : 'Someone accessed my account without permission',
      subtitle: isTe ? 'WhatsApp, Gmail, Instagram లేదా నెట్ బ్యాంకింగ్' : 'Unauthorized login, SIM swap, or hijacked session',
      targetTool: 'scam' as const,
    },
    {
      id: 'apk' as const,
      icon: Smartphone,
      title: isTe ? 'నేను అనుమానాస్పద యాప్‌ను ఇన్‌స్టాల్ చేసాను' : 'I installed a suspicious application (APK)',
      subtitle: isTe ? 'వాట్సాప్ లేదా లింక్ ద్వారా పంపిన లోన్ లేదా బ్యాంకింగ్ ఫైల్' : 'Sideloaded APK, fake banking app, or remote access tool',
      targetTool: 'apk' as const,
    },
    {
      id: 'media' as const,
      icon: ImageIcon,
      title: isTe ? 'అనుమానాస్పద ఫోటో లేదా వీడియో వచ్చింది' : 'I received a suspicious image or video',
      subtitle: isTe ? 'డీప్‌ఫేక్ వీడియో, మార్ఫింగ్ లేదా నకిలీ చెల్లింపు స్క్రీన్‌షాట్' : 'Deepfake video call, altered identity proof, or fake receipt',
      targetTool: 'media' as const,
    },
    {
      id: 'threat' as const,
      icon: ShieldAlert,
      title: isTe ? 'ఎవరైనా నన్ను బెదిరిస్తున్నారు / బ్లాక్‌మెయిల్ చేస్తున్నారు' : 'Someone is threatening or blackmailing me',
      subtitle: isTe ? 'డిజిటల్ అరెస్ట్, సెక్స్‌టార్షన్ లేదా ప్రైవేట్ ఫోటోల లీక్ బెదిరింపు' : 'Digital Arrest, sextortion, or intimate photo threats',
      targetTool: 'digital-arrest' as const,
    },
    {
      id: 'impersonation' as const,
      icon: HelpCircle,
      title: isTe ? 'ఎవరైనా నా పేరుతో నకిలీ ప్రొఫైల్ సృష్టించారు' : 'Someone is impersonating me online',
      subtitle: isTe ? 'నా ఫోటోతో బంధువుల నుండి డబ్బులు అడుగుతున్నారు' : 'Fake social profile asking money from friends/family',
      targetTool: 'blackmail' as const,
    },
    {
      id: 'other' as const,
      icon: AlertTriangle,
      title: isTe ? 'ఇతర రకమైన మోసం లేదా సైబర్ సమస్య' : 'I suspect another type of scam or fraud',
      subtitle: isTe ? 'ఉద్యోగ ఆఫర్లు, కస్టమ్స్ లేదా కొరియర్ మోసాలు' : 'Work from home task, fake parcel, or customs fee trap',
      targetTool: 'scam' as const,
    },
  ];

  const handleSelectScenario = (sc: WizardScenario) => {
    setSelectedScenario(sc);
    setStep(2);
  };

  const handleGenerateImmediateAction = () => {
    setStep(3);
  };

  // Build Incident from Wizard answers
  const handleFinalizeIncident = () => {
    const incNum = Math.floor(10000 + Math.random() * 90000);
    const incidentId = `TL-2026-${incNum}`;
    const now = new Date().toISOString();

    let title = 'Citizen Reported Cyber Incident';
    let riskLevel: RiskLevel = 'HIGH';
    let platform = 'Mobile Communication';
    const actions: IncidentAction[] = [];
    const timeline: TimelineEvent[] = [
      {
        id: `tl-wiz-1-${Date.now()}`,
        incident_id: incidentId,
        event_type: 'citizen_wizard_started',
        title: 'Citizen Initiated Guided Triage',
        description: `User reported: "${scenarioOptions.find(o => o.id === selectedScenario)?.title}".`,
        timestamp: 'Just now',
      },
    ];

    if (selectedScenario === 'money') {
      title = `Unauthorized Fund Transfer / Scam (₹${scenarioDetails.transferredAmount || '5,000'})`;
      riskLevel = 'CRITICAL';
      platform = scenarioDetails.paymentApp;
      actions.push(
        {
          id: `act-wiz-1-${Date.now()}`,
          incident_id: incidentId,
          priority: 1,
          title: 'Dial 1930 Cyber Fraud Helpline Immediately',
          description: 'Provide your bank account details and transaction UTR numbers to initiate an emergency lien freeze on the recipient account within the Golden Hour.',
          is_completed: false,
          urgent: true,
          official_link: 'tel:1930',
        },
        {
          id: `act-wiz-2-${Date.now()}`,
          incident_id: incidentId,
          priority: 2,
          title: 'Preserve Transaction Receipt & UTR Numbers',
          description: 'Take full-screen screenshots of the payment app debit confirmation and bank SMS notifications.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-3-${Date.now()}`,
          incident_id: incidentId,
          priority: 3,
          title: 'File an Official Complaint on cybercrime.gov.in',
          description: 'Lodge formal incident report for financial dispute tracking.',
          is_completed: false,
          official_link: 'https://cybercrime.gov.in',
        }
      );
    } else if (selectedScenario === 'apk') {
      title = `Suspicious APK Installed: ${scenarioDetails.appName || 'Unknown Application'}`;
      riskLevel = scenarioDetails.enteredOtpOrPin ? 'CRITICAL' : 'HIGH';
      platform = 'Android Mobile';
      actions.push(
        {
          id: `act-wiz-1-${Date.now()}`,
          incident_id: incidentId,
          priority: 1,
          title: 'Turn on Airplane Mode Immediately',
          description: 'Disconnect cellular data and Wi-Fi to stop remote command and control transmission.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-2-${Date.now()}`,
          incident_id: incidentId,
          priority: 2,
          title: 'Revoke Accessibility & Device Admin Rights',
          description: 'Open Settings > Accessibility and turn OFF permissions for the untrusted application.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-3-${Date.now()}`,
          incident_id: incidentId,
          priority: 3,
          title: 'Boot into Safe Mode & Uninstall APK',
          description: 'Long-press Power, hold Power Off, and select Safe Mode to delete the APK without resistance.',
          is_completed: false,
        }
      );
    } else if (selectedScenario === 'threat') {
      title = 'Extortion / Digital Threat Crisis';
      riskLevel = 'CRITICAL';
      platform = 'WhatsApp / Video Call';
      actions.push(
        {
          id: `act-wiz-1-${Date.now()}`,
          incident_id: incidentId,
          priority: 1,
          title: 'Disconnect All Video / Audio Calls Immediately',
          description: 'Indian law has no provision for Digital Arrest. Do not stay on camera or negotiate with extortionists.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-2-${Date.now()}`,
          incident_id: incidentId,
          priority: 2,
          title: 'Never Send Money to Sovereign Impersonators',
          description: 'Police and CBI never request security funds or escrow verification deposits.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-3-${Date.now()}`,
          incident_id: incidentId,
          priority: 3,
          title: 'Call 112 (Police Emergency) or 1930',
          description: 'Report the harassment immediately to authorized statutory authorities.',
          is_completed: false,
          official_link: 'tel:112',
        }
      );
    } else {
      title = `Cyber Incident: ${scenarioOptions.find(o => o.id === selectedScenario)?.title}`;
      riskLevel = 'HIGH';
      actions.push(
        {
          id: `act-wiz-1-${Date.now()}`,
          incident_id: incidentId,
          priority: 1,
          title: 'Preserve All Digital Evidence',
          description: 'Do not delete chat logs, phone numbers, or received messages.',
          is_completed: false,
          urgent: true,
        },
        {
          id: `act-wiz-2-${Date.now()}`,
          incident_id: incidentId,
          priority: 2,
          title: 'Secure Account Credentials',
          description: 'Reset passwords and activate Two-Factor Authentication (TOTP).',
          is_completed: false,
        }
      );
    }

    const incident: Incident = {
      id: incidentId,
      type: selectedScenario === 'apk' ? 'apk_malware' : selectedScenario === 'threat' ? 'digital_arrest' : selectedScenario === 'money' ? 'scam' : 'general',
      title,
      description: `Citizen completed guided triage for: ${selectedScenario}. Actions assigned and evidence vault initialised.`,
      risk_level: riskLevel,
      status: 'IN_PROGRESS',
      financial_loss: scenarioDetails.transferredAmount ? parseFloat(scenarioDetails.transferredAmount) : 0,
      currency: 'INR',
      platform,
      created_at: now,
      updated_at: now,
      evidence: [],
      timeline,
      actions,
    };

    onIncidentCreated(incident);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {step}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {step === 1 
              ? (isTe ? 'దశ 1: సమస్య ఎంపిక' : 'Step 1: What happened to you?')
              : step === 2
              ? (isTe ? 'దశ 2: అవసరమైన వివరాలు' : 'Step 2: Key Details')
              : (isTe ? 'దశ 3: తక్షణ రక్షణ దశ' : 'Step 3: Immediate Next Action')}
          </span>
        </div>

        {step > 1 && (
          <button
            onClick={() => setStep((step - 1) as any)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isTe ? 'వెనుకకు' : 'Back'}
          </button>
        )}
      </div>

      {/* STEP 1: What happened to you? */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5 animate-in fade-in duration-150">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isTe ? 'మీకు ఏమి జరిగింది?' : 'What happened to you?'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isTe 
                ? 'కింది ఎంపికలలో మీ పరిస్థితికి సరిపోయే దాన్ని ఎంచుకోండి. మేము మీకు దశలవారీగా సహాయం చేస్తాము.' 
                : 'Select the option that best describes your situation. We will tailor the response plan specifically for you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {scenarioOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectScenario(opt.id)}
                  className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-start gap-3.5 group"
                >
                  <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 shrink-0 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-900 leading-snug">
                      {opt.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {opt.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Only Relevant Questions */}
      {step === 2 && selectedScenario && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {scenarioOptions.find(o => o.id === selectedScenario)?.title}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {isTe ? 'అవసరమైన వివరాలను మాత్రమే అందించండి' : 'A few quick questions to guide your response'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Never share passwords, PINs, or OTPs. We only collect details needed for your safety roadmap.
            </p>
          </div>

          {/* Conditional Form Fields */}
          {selectedScenario === 'money' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'బదిలీ చేసిన సుమారు మొత్తం (₹ INR):' : 'Approximate Amount Transferred (₹ INR):'}
                </label>
                <input
                  type="number"
                  value={scenarioDetails.transferredAmount}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, transferredAmount: e.target.value })}
                  placeholder="e.g. 25000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'చెల్లింపు యాప్ లేదా బ్యాంక్:' : 'Payment App or Bank Used:'}
                </label>
                <select
                  value={scenarioDetails.paymentApp}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, paymentApp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option>Google Pay (GPay)</option>
                  <option>PhonePe</option>
                  <option>Paytm</option>
                  <option>BHIM UPI</option>
                  <option>SBI Net Banking</option>
                  <option>HDFC Net Banking</option>
                  <option>Other Bank / Credit Card</option>
                </select>
              </div>
            </div>
          )}

          {selectedScenario === 'apk' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'యాప్ లేదా APK ఫైల్ పేరు:' : 'Application or APK File Name (if remembered):'}
                </label>
                <input
                  type="text"
                  value={scenarioDetails.appName}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, appName: e.target.value })}
                  placeholder="e.g. YONO_KYC_Update.apk or InstantRupeeLoan.apk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scenarioDetails.enteredOtpOrPin}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, enteredOtpOrPin: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded-sm"
                />
                <span className="text-xs font-medium text-red-950">
                  {isTe ? 'నేను ఆ యాప్‌లో బ్యాంక్ వివరాలు లేదా పాస్‌వర్డ్ నమోదు చేసాను' : 'I entered my bank details, UPI PIN, or password inside this app'}
                </span>
              </label>
            </div>
          )}

          {selectedScenario === 'threat' && (
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scenarioDetails.immediateHarmRisk}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, immediateHarmRisk: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded-sm"
                />
                <span className="text-xs font-medium text-red-950">
                  {isTe ? 'నన్ను శారీరకంగా లేదా కుటుంబ సభ్యులను హాని చేస్తామని బెదిరిస్తున్నారు' : 'They are threatening immediate physical harm to me or my family'}
                </span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'బెదిరింపు వివరాలు (సంక్షిప్తంగా):' : 'Brief Details of the Threat:'}
                </label>
                <textarea
                  rows={3}
                  value={scenarioDetails.threatDetails}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, threatDetails: e.target.value })}
                  placeholder="e.g. Caller claiming to be Mumbai Police / CBI saying a FedEx parcel has drugs in my name."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {selectedScenario !== 'money' && selectedScenario !== 'apk' && selectedScenario !== 'threat' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isTe ? 'వేదిక లేదా యాప్ (ఉదా: WhatsApp, Instagram):' : 'Platform or Medium (e.g. WhatsApp, SMS, Instagram):'}
                </label>
                <input
                  type="text"
                  value={scenarioDetails.accountPlatform}
                  onChange={(e) => setScenarioDetails({ ...scenarioDetails, accountPlatform: e.target.value })}
                  placeholder="WhatsApp / Telegram / Instagram"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const target = scenarioOptions.find(o => o.id === selectedScenario)?.targetTool;
                if (target) onNavigateTab(target);
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              {isTe ? 'నేరుగా ప్రత్యేక విశ్లేషణ సాధనానికి వెళ్ళండి →' : 'Or open specialized inspection tool →'}
            </button>

            <ThreatLensButton
              variant="primary"
              size="md"
              onClick={handleGenerateImmediateAction}
            >
              {isTe ? 'తదుపరి స్పష్టమైన చర్యను చూడండి' : 'Show My Single Next Action'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </ThreatLensButton>
          </div>
        </div>
      )}

      {/* STEP 3: One Clear Next Action at a Time */}
      {step === 3 && selectedScenario && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              {isTe ? 'మీ తక్షణ చర్య' : 'YOUR SINGLE NEXT ACTION'}
            </span>
          </div>

          {/* Action 1 Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                1
              </span>
              <h3 className="text-lg sm:text-xl font-bold">
                {selectedScenario === 'money'
                  ? (isTe ? 'వెంటనే 1930 హెల్ప్‌లైన్‌కు కాల్ చేయండి' : 'Dial 1930 Cyber Fraud Helpline Immediately')
                  : selectedScenario === 'apk'
                  ? (isTe ? 'ఫోన్‌ను వెంటనే ఎయిర్‌ప్లేన్ మోడ్‌లో ఉంచండి' : 'Turn on Airplane Mode on your phone immediately')
                  : selectedScenario === 'threat'
                  ? (isTe ? 'కాల్‌ను వెంటనే కట్ చేసి నంబర్‌ను బ్లాక్ చేయండి' : 'Disconnect the video call & block the number immediately')
                  : (isTe ? 'స్క్రీన్‌షాట్ తీసి ఆధారాలను భద్రపరచండి' : 'Take a screenshot and preserve the evidence')}
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pl-11">
              {selectedScenario === 'money'
                ? 'Under the Golden Hour protocol, reporting cyber financial fraud immediately allows banks to freeze recipient wallets before funds are cashed out.'
                : selectedScenario === 'apk'
                ? 'Putting your device in Airplane Mode immediately severs the attacker\'s command and control connection, preventing them from remotely extracting bank balances or SMS OTPs.'
                : selectedScenario === 'threat'
                ? 'Indian courts and police NEVER interrogate or arrest citizens over WhatsApp/Skype. Scammers exploit video calls for psychological paralysis. They cannot arrest you through a screen.'
                : 'Do not delete the chat, SMS, or profile. Official investigators need the exact timestamps, phone numbers, and sender headers as proof.'}
            </p>

            {selectedScenario === 'money' && (
              <div className="pl-11 pt-1">
                <a
                  href="tel:1930"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call 1930 (Toll-Free, 24x7)
                </a>
              </div>
            )}
          </div>

          {/* Save & Create Incident */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-semibold text-slate-900 block">
                {isTe ? 'ఈ సంఘటన రికార్డును భద్రపరచాలా?' : 'Save this incident record in your secure vault?'}
              </span>
              <p className="text-xs text-slate-500">
                ThreatLens will generate an official timeline, action tracker, and downloadable PDF report.
              </p>
            </div>

            <ThreatLensButton
              variant="primary"
              size="md"
              onClick={handleFinalizeIncident}
              className="whitespace-nowrap"
            >
              <Save className="w-4 h-4 mr-2" />
              {isTe ? 'సంఘటనను భద్రపరచండి & PDF పొందండి' : 'Save Record & Download PDF'}
            </ThreatLensButton>
          </div>
        </div>
      )}
    </div>
  );
};
