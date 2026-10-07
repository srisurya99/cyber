import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { HeroSaaS } from './components/home/HeroSaaS';
import { InteractiveSafetyCheckBanner } from './components/home/InteractiveSafetyCheckBanner';
import { PhishingFeatureSection } from './components/home/PhishingFeatureSection';
import { MediaForensicsFeatureSection } from './components/home/MediaForensicsFeatureSection';
import { ScamResponseFeatureSection } from './components/home/ScamResponseFeatureSection';
import { HowItWorksSteps } from './components/home/HowItWorksSteps';
import { PrivacyResponsibleAI } from './components/home/PrivacyResponsibleAI';
import { FaqSection } from './components/home/FaqSection';
import { FinalCtaSection } from './components/home/FinalCtaSection';
import { RecentActivity } from './components/home/RecentActivity';
import { SafetyCheckModal } from './components/home/SafetyCheckModal';
import { PhishingChecker } from './components/phishing/PhishingChecker';
import { MediaChecker } from './components/media/MediaChecker';
import { ScamWizard } from './components/scam/ScamWizard';
import { IncidentListPage } from './components/incidents/IncidentListPage';
import { IncidentDetailView } from './components/scam/IncidentDetailView';
import { HelpPage } from './components/help/HelpPage';
import { ProfileModal } from './components/profile/ProfileModal';
import { FloatingAssistant } from './components/assistant/FloatingAssistant';
import { CitizenIncidentWizard } from './components/wizard/CitizenIncidentWizard';
import { ThreatLensBackButton } from './components/common/ThreatLensBackButton';
import { 
  fetchIncidents, 
  persistIncident, 
  removeIncident, 
  toggleActionStatus, 
  appendEvidence, 
  deleteEvidence, 
  appendTimelineEvent, 
  resetDemoIncidents,
  saveIncidents
} from './db/supabase';
import { Incident } from './types';
import { 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlertTriangle, 
  HelpCircle 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { t, language } = useLanguage();

  const [currentTab, setCurrentTab] = useState<'home' | 'check' | 'incidents' | 'help' | 'incident-detail'>('home');
  const [checkSubTab, setCheckSubTab] = useState<'wizard' | 'phishing' | 'media' | 'scam'>('wizard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const [isSafetyCheckModalOpen, setIsSafetyCheckModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load incidents from persistent store
  useEffect(() => {
    async function loadData() {
      const data = await fetchIncidents();
      setIncidents(data);
    }
    loadData();
  }, []);

  // Handlers for switching workflows
  const handleSelectHomeAction = (actionKey: 'wizard' | 'phishing' | 'media' | 'scam') => {
    setCheckSubTab(actionKey);
    setCurrentTab('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSafetyCheckRoute = (tab: 'wizard' | 'phishing' | 'media' | 'scam' | 'help') => {
    if (tab === 'help') {
      setCurrentTab('help');
    } else {
      setCheckSubTab(tab);
      setCurrentTab('check');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromAssistant = (route: string) => {
    if (route.includes('tab=wizard')) {
      setCheckSubTab('wizard');
      setCurrentTab('check');
    } else if (route.includes('tab=phishing')) {
      setCheckSubTab('phishing');
      setCurrentTab('check');
    } else if (route.includes('tab=media')) {
      setCheckSubTab('media');
      setCurrentTab('check');
    } else if (route.includes('tab=scam')) {
      setCheckSubTab('scam');
      setCurrentTab('check');
    } else if (route.includes('incidents')) {
      setCurrentTab('incidents');
    } else {
      setCurrentTab('check');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIncidentCreatedOrSaved = async (newIncident: Incident) => {
    await persistIncident(newIncident);
    const updated = await fetchIncidents();
    setIncidents(updated);
    setSelectedIncidentId(newIncident.id);
    setCurrentTab('incident-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenIncidentDetail = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('incident-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAction = async (incidentId: string, actionId: string) => {
    await toggleActionStatus(incidentId, actionId);
    const updated = await fetchIncidents();
    setIncidents(updated);
  };

  const handleAddEvidence = async (incidentId: string, evidence: any) => {
    await appendEvidence(incidentId, evidence);
    const updated = await fetchIncidents();
    setIncidents(updated);
  };

  const handleDeleteEvidence = async (incidentId: string, evidenceId: string) => {
    await deleteEvidence(incidentId, evidenceId);
    const updated = await fetchIncidents();
    setIncidents(updated);
  };

  const handleAddTimeline = async (incidentId: string, event: any) => {
    await appendTimelineEvent(incidentId, event);
    const updated = await fetchIncidents();
    setIncidents(updated);
  };

  const handleDeleteIncident = async (incidentId: string) => {
    await removeIncident(incidentId);
    const updated = await fetchIncidents();
    setIncidents(updated);
    setSelectedIncidentId(null);
    setCurrentTab('incidents');
  };

  const handleResetDemo = () => {
    const demo = resetDemoIncidents();
    setIncidents(demo);
  };

  const handleClearAll = () => {
    saveIncidents([]);
    setIncidents([]);
  };

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        checkSubTab={checkSubTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectModule={(module) => {
          setCheckSubTab(module);
          setCurrentTab('check');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* VIEW: HOME - Premium SaaS Redesign */}
        {currentTab === 'home' && (
          <div className="animate-in fade-in duration-150 space-y-4">
            
            {/* 1. Distinctive SaaS Hero with Realistic Product Demonstration */}
            <HeroSaaS
              onStartSafetyCheck={() => setIsSafetyCheckModalOpen(true)}
              onExploreHowItWorks={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectAction={handleSelectHomeAction}
            />

            {/* 2. Interactive Safety-Check Entry Point */}
            <InteractiveSafetyCheckBanner
              onOpenSafetyModal={() => setIsSafetyCheckModalOpen(true)}
              onSelectAction={handleSelectHomeAction}
            />

            {/* 3. Core Feature 1: AI Phishing Detection (Split-screen with Browser Inspection) */}
            <PhishingFeatureSection
              onNavigate={() => handleSelectHomeAction('phishing')}
            />

            {/* 4. Core Feature 2: AI Media Forensics (Media Inspection Workspace) */}
            <MediaForensicsFeatureSection
              onNavigate={() => handleSelectHomeAction('media')}
            />

            {/* 5. Core Feature 3: Scam Incident Response (Incident Dossier & Golden Hour 1930) */}
            <ScamResponseFeatureSection
              onNavigate={() => handleSelectHomeAction('scam')}
            />

            {/* 6. Simple Three-Step Explanation of User Journey */}
            <HowItWorksSteps
              onStartCheck={() => setIsSafetyCheckModalOpen(true)}
            />

            {/* 7. Citizen Digital Safety Dashboard Overview (Real DB / LocalStorage data) */}
            <RecentActivity
              incidents={incidents}
              onSelectIncident={handleOpenIncidentDetail}
              onViewAll={() => setCurrentTab('incidents')}
            />

            {/* 8. Privacy & Responsible AI Section */}
            <PrivacyResponsibleAI />

            {/* 9. Frequently Asked Questions */}
            <FaqSection />

            {/* 10. Final Call To Action */}
            <FinalCtaSection
              onStartSafetyCheck={() => setIsSafetyCheckModalOpen(true)}
              onOpenCheckTab={() => {
                setCheckSubTab('phishing');
                setCurrentTab('check');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

          </div>
        )}

        {/* VIEW: CHECK (Unified workspace for advanced cyber defence capabilities) */}
        {currentTab === 'check' && (
          <div className="animate-in fade-in duration-150">
            {/* Consistent ThreatLens Back Button */}
            <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
              <ThreatLensBackButton
                label="← Back to ThreatLens"
                onBack={() => setCurrentTab('home')}
              />
            </div>

            {/* Sub-navigation Segmented Bar: 4 MAIN MODULES ONLY */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl max-w-4xl mx-auto mb-8 overflow-x-auto">
              <button
                onClick={() => setCheckSubTab('wizard')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  checkSubTab === 'wizard'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'మార్గదర్శక విజార్డ్' : 'Incident Wizard'}</span>
              </button>

              <button
                onClick={() => setCheckSubTab('phishing')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  checkSubTab === 'phishing'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'te' ? 'లింక్ / మెసేజ్' : 'Link / Message'}</span>
              </button>

              <button
                onClick={() => setCheckSubTab('media')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  checkSubTab === 'media'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'te' ? 'మీడియా ఫోరెన్సిక్స్' : 'Media Forensics'}</span>
              </button>

              <button
                onClick={() => setCheckSubTab('scam')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  checkSubTab === 'scam'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'te' ? 'నేను మోసపోయాను' : 'I Was Scammed'}</span>
              </button>
            </div>

            {/* Subtab Contents */}
            {checkSubTab === 'wizard' && (
              <CitizenIncidentWizard
                onIncidentCreated={handleIncidentCreatedOrSaved}
                onNavigateTab={(target) => {
                  setCheckSubTab(target as any);
                }}
              />
            )}

            {checkSubTab === 'phishing' && (
              <PhishingChecker
                onSaveAsIncident={handleIncidentCreatedOrSaved}
                onGetHelp={() => setCurrentTab('help')}
              />
            )}

            {checkSubTab === 'media' && (
              <MediaChecker
                onSaveAsIncident={handleIncidentCreatedOrSaved}
                onGetHelp={() => setCurrentTab('help')}
              />
            )}

            {checkSubTab === 'scam' && (
              <ScamWizard
                onIncidentCreated={handleIncidentCreatedOrSaved}
              />
            )}
          </div>
        )}

        {/* VIEW: MY INCIDENTS */}
        {currentTab === 'incidents' && (
          <div className="animate-in fade-in duration-150">
            <div className="max-w-4xl mx-auto mb-4">
              <ThreatLensBackButton
                label="← Back to ThreatLens"
                onBack={() => setCurrentTab('home')}
              />
            </div>
            <IncidentListPage
              incidents={incidents}
              onSelectIncident={handleOpenIncidentDetail}
              onNewCheck={() => {
                setCheckSubTab('wizard');
                setCurrentTab('check');
              }}
            />
          </div>
        )}

        {/* VIEW: INCIDENT DETAIL */}
        {currentTab === 'incident-detail' && selectedIncident && (
          <div className="animate-in fade-in duration-150">
            <IncidentDetailView
              incident={selectedIncident}
              allIncidents={incidents}
              onBack={() => setCurrentTab('incidents')}
              onToggleAction={handleToggleAction}
              onAddEvidence={handleAddEvidence}
              onDeleteEvidence={handleDeleteEvidence}
              onAddTimelineEvent={handleAddTimeline}
              onDeleteIncident={handleDeleteIncident}
            />
          </div>
        )}

        {/* VIEW: HELP */}
        {currentTab === 'help' && (
          <div className="animate-in fade-in duration-150">
            <HelpPage />
          </div>
        )}

      </main>

      {/* Floating Universal AI Assistant */}
      <FloatingAssistant onNavigate={handleNavigateFromAssistant} />

      {/* Bottom Mobile Navigation */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer onOpenSafetyCheck={() => setIsSafetyCheckModalOpen(true)} />

      {/* Triage / Safety Check Modal */}
      <SafetyCheckModal
        isOpen={isSafetyCheckModalOpen}
        onClose={() => setIsSafetyCheckModalOpen(false)}
        onSelectRoute={handleSafetyCheckRoute}
      />

      {/* Profile & Privacy Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}
