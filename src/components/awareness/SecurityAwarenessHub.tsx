import React, { useState } from 'react';
import { 
  GraduationCap, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Info
} from 'lucide-react';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { useLanguage } from '../../i18n/LanguageContext';

export const SecurityAwarenessHub: React.FC = () => {
  const { language } = useLanguage();
  const isTe = language === 'te';

  const [activeModule, setActiveModule] = useState<'qr' | 'digital_arrest' | 'receipt'>('qr');
  const [qrStep, setQrStep] = useState<'intro' | 'scanned' | 'lesson'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              CITIZEN CYBER DEFENCE ACADEMY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {isTe ? 'ఇంటరాక్టివ్ సైబర్ మోసాల అవగాహన & శిక్షణ' : 'Interactive Citizen Fraud Simulations'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {isTe
                ? 'సైబర్ నేరగాళ్ళు ఉపయోగించే అసలైన మోసపూరిత ఎత్తుగడలను ఇంటరాక్టివ్ విధానంలో స్వయంగా అనుభవించి నేర్చుకోండి.'
                : 'Experience real-world fraud tactics in a safe interactive simulator to learn how modern UPI traps, Digital Arrest calls, and fake screenshots work.'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => { setActiveModule('qr'); setQrStep('intro'); }}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeModule === 'qr'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{isTe ? '1. QR కోడ్ ట్రాప్ సిమ్యులేటర్' : '1. UPI QR Trap Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveModule('digital_arrest')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeModule === 'digital_arrest'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isTe ? '2. డిజిటల్ అరెస్ట్ గుర్తింపు' : '2. Digital Arrest Anatomy'}</span>
          </button>

          <button
            onClick={() => setActiveModule('receipt')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeModule === 'receipt'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isTe ? '3. నకిలీ పేమెంట్ స్క్రీన్‌షాట్' : '3. Fake Payment Screenshot'}</span>
          </button>
        </div>
      </div>

      {/* MODULE 1: QR TRAP SIMULATOR */}
      {activeModule === 'qr' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                SIMULATION 1
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                The "Scan QR to Receive Money" Trap
              </h3>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full">
              Most Common OLX/Marketplace Scam
            </span>
          </div>

          {qrStep === 'intro' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Scenario:</span>
                <p className="text-slate-700 leading-relaxed">
                  You put an old sofa or phone up for sale on an online marketplace for ₹15,000. Within 10 minutes, an interested "buyer" messages on WhatsApp:
                </p>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 font-medium">
                  "Sir, I am in the army / out of town. I am sending an official Google Pay QR code. Just scan it with your phone and enter your PIN to immediately receive the ₹15,000 advance into your bank."
                </div>
              </div>

              <div className="flex flex-col items-center p-6 bg-slate-900 rounded-xl text-white space-y-3">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-xs text-slate-400 font-mono">SCAN_TO_RECEIVE_15000_INR</span>
                <ThreatLensButton
                  variant="primary"
                  size="md"
                  onClick={() => setQrStep('scanned')}
                >
                  Simulate Scanning the QR Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ThreatLensButton>
              </div>
            </div>
          )}

          {qrStep === 'scanned' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 bg-red-50 rounded-2xl border border-red-200 space-y-3">
                <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>LOOK AT WHAT ACTUALLY APPEARED ON YOUR PHONE SCREEN:</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>PAYING TO:</span>
                    <span className="font-mono text-slate-900">merchant_settlement_desk@okaxis</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>DEBIT AMOUNT:</span>
                    <span className="font-bold text-red-600 text-base">₹15,000.00</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900 font-bold text-center border border-amber-200">
                    ENTER 6-DIGIT UPI PIN TO APPROVE
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Question: If you enter your UPI PIN right now, what will happen?
                </span>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedAnswer('receive'); setQrStep('lesson'); }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700"
                  >
                    A) I will receive ₹15,000 into my bank account.
                  </button>
                  <button
                    onClick={() => { setSelectedAnswer('debit'); setQrStep('lesson'); }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-medium text-slate-700"
                  >
                    B) ₹15,000 will be instantly DEDUCTED (debited) from my bank account!
                  </button>
                </div>
              </div>
            </div>
          )}

          {qrStep === 'lesson' && (
            <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                <h4 className="text-lg font-bold">
                  {selectedAnswer === 'debit' ? 'CORRECT! YOU AVOIDED THE SCAM.' : 'WRONG! ₹15,000 WOULD BE LOST INSTANTLY.'}
                </h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p className="p-3 bg-white/10 rounded-xl font-bold text-white text-sm">
                  GOLDEN RULE OF UPI: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.
                </p>
                <p>
                  • Entering a UPI PIN always authorises an outward debit from your account.
                  <br />
                  • QR codes are strictly payment destinations—they only pull money, they never push money into your wallet.
                  <br />
                  • To receive legitimate payments, the sender only needs your mobile number or UPI ID (VPA). Nothing else!
                </p>
              </div>

              <ThreatLensButton
                variant="outline"
                size="sm"
                onClick={() => setQrStep('intro')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Try Scenario Again
              </ThreatLensButton>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: DIGITAL ARREST ANATOMY */}
      {activeModule === 'digital_arrest' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                SIMULATION 2
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Recognizing the Anatomy of a "Digital Arrest"
              </h3>
            </div>
            <span className="text-xs bg-red-100 text-red-900 font-bold px-2.5 py-1 rounded-full uppercase">
              Extortion Modus Operandi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-red-50/70 rounded-2xl border border-red-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>WHAT SCAMMERS DO (FRAUD):</span>
              </div>
              <ul className="space-y-2 text-slate-700 list-disc pl-4">
                <li>Call on WhatsApp or Skype wearing fake police uniforms with fake agency backdrops.</li>
                <li>Claim a FedEx parcel containing passports, narcotics, or ATM cards was seized in your name.</li>
                <li>Threaten an immediate SWAT / police raid if you disconnect the call or talk to family.</li>
                <li>Demand that you stay confined in a room on 24x7 video ("Digital Arrest").</li>
                <li>Order you to break fixed deposits and transfer all savings to a "Secret RBI Verification Account".</li>
              </ul>
            </div>

            <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>HOW REAL POLICE / COURTS WORK (LAW):</span>
              </div>
              <ul className="space-y-2 text-slate-700 list-disc pl-4">
                <li>Under Indian law (BNSS / CrPC), there is NO legal concept of "Digital Arrest".</li>
                <li>Police and CBI NEVER conduct interrogations or trials over video calls.</li>
                <li>Formal summons are served physically in writing by an officer with official service records.</li>
                <li>No government agency ever asks citizens to transfer money to "verify innocence".</li>
                <li>Real officers will never instruct you to hide calls from your family or lawyers.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between gap-4">
            <div>
              <span className="font-bold block">If you receive such a call:</span>
              <span className="text-slate-300">Hang up immediately. Scammers cannot arrest you through a glass screen. Dial 1930 / 112.</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: FAKE PAYMENT SCREENSHOT */}
      {activeModule === 'receipt' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                SIMULATION 3
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Spotting Fabricated Payment Screenshots
              </h3>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-1 rounded-full">
              Visual Forensics
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Scammers use mobile applications like "Spoof Pay" to generate fake payment-success screens and convince shopkeepers or sellers that money has been transferred.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">3 Tell-Tale Markers of Altered Screenshots:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-red-600 block">1. Font Inconsistencies</span>
                  The rupee amount font does not match the native app typography; numerals may appear pixelated or misaligned.
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-red-600 block">2. Absent Bank UTR</span>
                  A real UPI transaction has a 12-digit numeric Unique Transaction Reference (UTR) generated by NPCI. Fake screens often omit it or use random digits.
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-red-600 block">3. Missing Bank SMS</span>
                  Never dispatch goods or accept transfers based on the buyer's phone screen. Check your own bank account balance directly.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
