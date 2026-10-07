import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { checkPhishingApi } from '../../api/client';
import { AnalysisResult, Incident } from '../../types';
import { LoadingState } from '../common/LoadingState';
import { PhishingResultView } from './PhishingResultView';
import { ThreatLensButton } from '../common/ThreatLensButton';
import { MessageSquare, Link as LinkIcon, Mail, Sparkles, Search } from 'lucide-react';

interface PhishingCheckerProps {
  onSaveAsIncident: (incident: Incident) => void;
  onGetHelp: () => void;
}

export const PhishingChecker: React.FC<PhishingCheckerProps> = ({
  onSaveAsIncident,
  onGetHelp,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'message' | 'link' | 'email'>('message');

  // Input states
  const [messageText, setMessageText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Execution states
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);

    let contentToAnalyze = '';
    let sender = '';
    let subject = '';

    if (activeTab === 'message') {
      contentToAnalyze = messageText;
    } else if (activeTab === 'link') {
      contentToAnalyze = linkUrl;
    } else {
      contentToAnalyze = emailBody;
      sender = emailSender;
      subject = emailSubject;
    }

    try {
      const res = await checkPhishingApi({
        type: activeTab,
        content: contentToAnalyze,
        sender,
        subject,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run phishing analysis', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMessageText('');
    setLinkUrl('');
    setEmailSender('');
    setEmailSubject('');
    setEmailBody('');
  };

  // Sample quick testers for citizen convenience
  const loadSample = (sampleType: 'bank_sms' | 'lottery' | 'clean_link') => {
    if (sampleType === 'bank_sms') {
      setActiveTab('message');
      setMessageText('Dear Customer, your State Bank account will be suspended today due to expired KYC. Update immediately to prevent block: http://sbi-kyc-verify-portal.in/update-pan');
    } else if (sampleType === 'lottery') {
      setActiveTab('message');
      setMessageText('Congratulations! You have won ₹25,00,000 in Kaun Banega Crorepati lucky draw. Call WhatsApp +91-9876543210 and pay ₹2,500 registration charge immediately to claim.');
    } else if (sampleType === 'clean_link') {
      setActiveTab('link');
      setLinkUrl('https://onlinesbi.sbi');
    }
  };

  const isFormValid = () => {
    if (activeTab === 'message') return messageText.trim().length > 0;
    if (activeTab === 'link') return linkUrl.trim().length > 0;
    if (activeTab === 'email') return emailBody.trim().length > 0 || emailSender.trim().length > 0;
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('phishingHeader')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          {t('phishingSubtitle')}
        </p>
      </div>

      {isLoading ? (
        <LoadingState
          stages={[
            t('analyzingStage1'),
            t('analyzingStage2'),
            t('analyzingStage3'),
          ]}
          defaultMessage={t('btnAnalyzing')}
        />
      ) : result ? (
        <PhishingResultView
          result={result}
          onReset={handleReset}
          onGetHelp={onGetHelp}
          onSaveAsIncident={onSaveAsIncident}
          submissionContent={activeTab === 'message' ? messageText : activeTab === 'link' ? linkUrl : `${emailSender} | ${emailSubject}`}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                activeTab === 'message'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('tabMessage')}</span>
            </button>

            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                activeTab === 'link'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>{t('tabLink')}</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                activeTab === 'email'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t('tabEmail')}</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            {activeTab === 'message' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {language === 'te' ? 'సందేశం లేదా SMS టెక్స్ట్' : 'Message Text'}
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('placeholderMessage')}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all"
                />
              </div>
            )}

            {activeTab === 'link' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  {language === 'te' ? 'వెబ్‌సైట్ చిరునామా (URL)' : 'Website Address (URL)'}
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder={t('placeholderLink')}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all"
                />
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {language === 'te' ? 'పంపినవారి చిరునామా' : 'Sender Email'}
                  </label>
                  <input
                    type="text"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    placeholder={t('placeholderSender')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {language === 'te' ? 'ఈమెయిల్ విషయం' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder={t('placeholderSubject')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    {language === 'te' ? 'ఈమెయిల్ పూర్తి విషయం' : 'Message Body'}
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder={t('placeholderEmailBody')}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Quick test samples for citizen testing */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">
                {language === 'te' ? 'నమూనాను పరీక్షించండి:' : 'Try sample:'}
              </span>
              <button
                type="button"
                onClick={() => loadSample('bank_sms')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                Fake Bank SMS
              </button>
              <button
                type="button"
                onClick={() => loadSample('lottery')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                Lottery Trap
              </button>
              <button
                type="button"
                onClick={() => loadSample('clean_link')}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                Legitimate Bank Link
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <ThreatLensButton
                variant="prominent"
                size="lg"
                icon={Search}
                onClick={handleAnalyze}
                disabled={!isFormValid()}
                className="w-full"
              >
                {activeTab === 'link' ? 'Check Link' : 'Analyze Message or Email'}
              </ThreatLensButton>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
