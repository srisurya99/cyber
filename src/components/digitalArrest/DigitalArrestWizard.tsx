import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneOff, 
  AlertOctagon, 
  AlertTriangle, 
  PhoneCall, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { DigitalArrestRequest, Incident } from '../../types';
import { analyzeDigitalArrestApi } from '../../api/client';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { useLanguage } from '../../i18n/LanguageContext';

interface DigitalArrestWizardProps {
  onIncidentCreated?: (incident: Incident) => void;
  onGetHelp?: () => void;
}

export const DigitalArrestWizard: React.FC<DigitalArrestWizardProps> = ({
  onIncidentCreated,
  onGetHelp,
}) => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [callerClaim, setCallerClaim] = useState<DigitalArrestRequest['callerClaim']>('cbi');
  const [channel, setChannel] = useState<DigitalArrestRequest['channel']>('skype');
  const [currentlyOnCall, setCurrentlyOnCall] = useState(false);
  const [moneyDemanded, setMoneyDemanded] = useState(true);
  const [demandedAmount, setDemandedAmount] = useState('250000');
  const [immediateSafetyRisk, setImmediateSafetyRisk] = useState(false);
  const [selectedThreats, setSelectedThreats] = useState<string[]>([
    'FedEx courier with illegal narcotics / passports',
    'Aadhaar card linked to money laundering',
    'Immediate SWAT / local police raid threat',
  ]);
  const [callerDetails, setCallerDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolvedIncident, setResolvedIncident] = useState<Incident | null>(null);

  const agencyOptions = [
    { id: 'cbi', label: 'Central Bureau of Investigation (CBI)' },
    { id: 'ed', label: 'Enforcement Directorate (ED)' },
    { id: 'police', label: 'State Police / Cyber Crime Branch (Mumbai/Delhi/Cyber Cell)' },
    { id: 'customs_courier', label: 'Customs & Narcotics Bureau (FedEx / DHL contraband courier)' },
    { id: 'court_judge', label: 'Supreme Court / High Court Judicial Magistrate' },
    { id: 'trai_telecom', label: 'TRAI / Telecom Ministry (SIM deactivation within 2 hours)' },
  ];

  const threatOptions = [
    'FedEx courier with illegal narcotics / passports',
    'Aadhaar card linked to money laundering',
    'Immediate SWAT / local police raid threat',
    'Demand to stay in a closed room on video 24x7',
    'Fake Supreme Court / CBI official letterhead sent on WhatsApp',
    'Demanding transfer to "RBI Security Verification Account"',
  ];

  const toggleThreat = (threat: string) => {
    setSelectedThreats(prev =>
      prev.includes(threat) ? prev.filter(t => t !== threat) : [...prev, threat]
    );
  };

  const handleRunTriage = async () => {
    setIsSubmitting(true);
    try {
      const res = await analyzeDigitalArrestApi({
        callerClaim,
        channel,
        currentlyOnCall,
        moneyDemanded,
        demandedAmount: moneyDemanded ? demandedAmount : '0',
        immediateSafetyRisk,
        threatClaims: selectedThreats,
        callerDetails,
      });

      setResolvedIncident(res.incident);
    } catch (err) {
      console.error('Failed to triage digital arrest incident:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Critical Reassurance & Statutory Truth Banner */}
      <div className="bg-red-950 text-white rounded-2xl p-6 sm:p-8 border border-red-800 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600/30 text-red-300 rounded-xl shrink-0">
            <AlertOctagon className="w-8 h-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-900/60 px-2 py-0.5 rounded-sm">
              LEGAL CLARIFICATION UNDER INDIAN LAW (BNSS / CrPC)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {isTe
                ? 'భారతీయ చట్టంలో "డిజిటల్ అరెస్ట్" అనే నిబంధన లేదు!'
                : 'There is NO provision for "Digital Arrest" under Indian Law!'}
            </h2>
            <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
              {isTe
                ? 'పోలీసులు, సిబిఐ, ఇడి లేదా ఏ న్యాయస్థానం కూడా వాట్సాప్ లేదా స్కైప్ వీడియో కాల్స్ ద్వారా ప్రజలను విచారించవు లేదా నిర్బంధించవు. ప్రభుత్వ ఖాతాలకు డబ్బు బదిలీ చేయమని ఏ అధికారిక సంస్థ అడగదు.'
                : 'No law enforcement agency (Police, CBI, ED, NCB, Customs) or Court ever conducts interrogations, trials, or arrests over WhatsApp or Skype video calls. They never demand fund transfers to "RBI verification accounts". This is 100% fraudulent extortion.'}
            </p>
          </div>
        </div>
      </div>

      {/* Immediate Crisis Callout */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isTe ? '1. అత్యవసర పరిస్థితి తనిఖీ' : '1. Immediate Situation Triage'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isTe ? 'మీ ప్రస్తుత పరిస్థితిని తెలుపండి. మేము మీకు తక్షణ దశలను నిర్దేశిస్తాము.' : 'Tell us what is happening right now so we can direct safe defensive steps.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div
            onClick={() => setCurrentlyOnCall(!currentlyOnCall)}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              currentlyOnCall
                ? 'border-red-500 bg-red-50 text-red-900 font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <PhoneOff className="w-4 h-4 text-red-600" />
              <span>{isTe ? 'నేను ప్రస్తుతం వీడియో కాల్‌లో ఉన్నాను' : 'I am currently on the video call right now'}</span>
            </div>
            <p className="text-slate-600 mt-1.5 text-xs font-normal">
              {isTe ? 'వెంటనే కాల్ కట్ చేయండి! తెర వెనుక నుండి మిమ్మల్ని ఎవరూ అరెస్ట్ చేయలేరు.' : 'Disconnect immediately! Scammers use screen intimidation. They have no lawful power.'}
            </p>
          </div>

          <div
            onClick={() => setImmediateSafetyRisk(!immediateSafetyRisk)}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              immediateSafetyRisk
                ? 'border-red-500 bg-red-50 text-red-900 font-semibold'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{isTe ? 'నేను శారీరక భద్రతా ప్రమాదాన్ని ఎదుర్కొంటున్నాను' : 'I feel in immediate physical danger'}</span>
            </div>
            <p className="text-slate-600 mt-1.5 text-xs font-normal">
              {isTe ? 'ఎవరైనా బయట ఉంటే వెంటనే 112 కి డయల్ చేయండి.' : 'If anyone is physically intimidating you outside, call 112 immediately.'}
            </p>
          </div>
        </div>

        {/* Agency Claimed */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {isTe ? 'కాలర్ ఏ ప్రభుత్వ సంస్థ పేరుతో బెదిరించారు?' : 'Which Agency Did the Callers Claim to Represent?'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {agencyOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setCallerClaim(opt.id as any)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  callerClaim === opt.id
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* Coercive Tactics Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {isTe ? 'వారు ఏ రకమైన ఆరోపణలు / బెదిరింపులు చేశారు?' : 'Coercive Tactics & Fabricated Allegations Made:'}
          </label>
          <div className="space-y-2">
            {threatOptions.map((threat, idx) => {
              const isChecked = selectedThreats.includes(threat);
              return (
                <div
                  key={idx}
                  onClick={() => toggleThreat(threat)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'border-red-300 bg-red-50 text-red-950 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{threat}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Extortion Input */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={moneyDemanded}
              onChange={(e) => setMoneyDemanded(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-slate-900">
              {isTe ? 'వారు డబ్బు బదిలీ చేయమని డిమాండ్ చేశారా లేదా మీరు ఇప్పటికే పంపారా?' : 'Did they demand money transfer, or have you already sent funds?'}
            </span>
          </label>

          {moneyDemanded && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isTe ? 'డిమాండ్ చేసిన లేదా బదిలీ చేసిన మొత్తం (₹ INR)' : 'Amount Demanded or Transferred (₹ INR)'}
              </label>
              <input
                type="number"
                value={demandedAmount}
                onChange={(e) => setDemandedAmount(e.target.value)}
                placeholder="250000"
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          <ThreatLensButton
            variant="primary"
            size="lg"
            className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
            onClick={handleRunTriage}
            disabled={isSubmitting}
          >
            <ShieldAlert className="w-5 h-5 mr-2" />
            {isTe ? 'అత్యవసర కట్టడి ప్రణాళికను రూపొందించండి' : 'Activate Digital Arrest Emergency Response Plan'}
          </ThreatLensButton>
        </div>
      </div>

      {/* Result Dossier & Action Directives */}
      {resolvedIncident && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                INCIDENT DOSSIER GENERATED
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {resolvedIncident.title}
              </h3>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 font-black rounded-lg text-xs tracking-wider uppercase">
              CRITICAL EXTORTION ALERT
            </span>
          </div>

          {/* Golden Hour Callout */}
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                NATIONAL CYBERCRIME HELPLINE
              </span>
              <h4 className="text-lg font-bold text-blue-950">
                Dial 1930 Immediately (Golden Hour Window)
              </h4>
              <p className="text-xs text-blue-800">
                If money was transferred, Indian financial fraud desks can freeze the beneficiary accounts if reported promptly.
              </p>
            </div>
            <a
              href="tel:1930"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              Call 1930 Now
            </a>
          </div>

          {/* Prioritized Response Steps */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              {isTe ? 'మీ తక్షణ రక్షణ చర్యల జాబితా:' : 'Your Emergency Action Checklist:'}
            </h4>
            <div className="space-y-2.5">
              {resolvedIncident.actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {act.priority}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm">{act.title}</div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{act.description}</p>
                    {act.official_link && (
                      <a
                        href={act.official_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:underline mt-2"
                      >
                        Official Channel <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save / Dossier CTA */}
          {onIncidentCreated && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Incident record <span className="font-mono font-semibold text-slate-700">{resolvedIncident.id}</span> preserved in private vault.
              </p>
              <ThreatLensButton
                variant="primary"
                size="md"
                onClick={() => onIncidentCreated(resolvedIncident)}
              >
                {isTe ? 'పూర్తి నివేదిక మరియు PDF ని డౌన్‌లోడ్ చేయండి' : 'Open Dossier & Download Official PDF'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </ThreatLensButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
