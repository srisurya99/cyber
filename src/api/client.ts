import { 
  AnalysisResult, 
  Incident, 
  MediaForensicsRequest, 
  MediaForensicsSignals, 
  PhishingAnalysisRequest, 
  ScamTriageRequest, 
  BlackmailTriageRequest,
  ThreatIntelligenceResult,
  ApkAnalysisRequest,
  ApkAnalysisResult,
  DigitalArrestRequest
} from '../types';
import { analyzePhishing as localAnalyzePhishing } from '../services/ai/phishingEngine';
import { analyzeMedia as localAnalyzeMedia, MediaForensicsResult } from '../services/ai/mediaForensics';
import { analyzeScam as localAnalyzeScam } from '../services/ai/scamEngine';
import { analyzeBlackmail as localAnalyzeBlackmail } from '../services/ai/blackmailEngine';
import { inspectThreatIntelligence as localInspectThreatIntel } from '../services/ai/threatIntelligence';
import { analyzeApkPackage as localAnalyzeApk } from '../services/ai/apkEngine';
import { analyzeDigitalArrestIncident as localAnalyzeDigitalArrest } from '../services/ai/digitalArrestEngine';

export async function checkPhishingApi(req: PhishingAnalysisRequest): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/analyze/phishing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API call failed, using client engine fallback', err);
  }
  return localAnalyzePhishing(req);
}

export async function checkMediaApi(req: MediaForensicsRequest): Promise<MediaForensicsResult> {
  try {
    const res = await fetch('/api/analyze/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API call failed, using client engine fallback', err);
  }
  return localAnalyzeMedia(req);
}

export async function createScamIncidentApi(req: ScamTriageRequest): Promise<{ incident: Incident; analysis: AnalysisResult }> {
  try {
    const res = await fetch('/api/analyze/scam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API call failed, using client engine fallback', err);
  }
  return localAnalyzeScam(req);
}

export async function createBlackmailIncidentApi(req: BlackmailTriageRequest): Promise<{ incident: Incident; analysis: AnalysisResult }> {
  try {
    const res = await fetch('/api/analyze/blackmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API call failed, using client engine fallback', err);
  }
  return localAnalyzeBlackmail(req);
}

export async function checkThreatIntelApi(url: string): Promise<ThreatIntelligenceResult> {
  try {
    const res = await fetch('/api/threat-intel/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend threat intel API failed, using client engine fallback', err);
  }
  return localInspectThreatIntel(url);
}

export async function analyzeApkApi(req: ApkAnalysisRequest): Promise<{ analysis: ApkAnalysisResult; incident?: Incident }> {
  try {
    const res = await fetch('/api/analyze/apk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend APK API failed, using client engine fallback', err);
  }
  return localAnalyzeApk(req);
}

export async function analyzeDigitalArrestApi(req: DigitalArrestRequest): Promise<{ analysis: AnalysisResult; incident: Incident }> {
  try {
    const res = await fetch('/api/analyze/digital-arrest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend digital arrest API failed, using client engine fallback', err);
  }
  return localAnalyzeDigitalArrest(req);
}

export async function sendAssistantChat(message: string): Promise<{ reply: string; suggestedAction?: { label: string; route: string } }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend chat API failed, using fallback', err);
  }

  // Graceful in-browser guidance fallback
  const lower = message.toLowerCase();
  if (lower.includes('threat') || lower.includes('blackmail') || lower.includes('private')) {
    return {
      reply: 'Take a deep breath. Never send money to an extortionist. We have a dedicated Emergency Blackmail tool to help you preserve evidence and secure your accounts safely.',
      suggestedAction: { label: 'Go to Blackmail Response', route: '/check?tab=blackmail' },
    };
  }
  if (lower.includes('money') || lower.includes('upi') || lower.includes('scam')) {
    return {
      reply: 'If money was transferred, call 1930 immediately within the golden hour. ThreatLens will generate an official incident report and recovery steps for you.',
      suggestedAction: { label: 'Go to Scam Incident Response', route: '/check?tab=scam' },
    };
  }
  if (lower.includes('photo') || lower.includes('video') || lower.includes('deepfake')) {
    return {
      reply: 'Upload the media to our Media Forensics tool to check for deepfake markers, lighting physics inconsistencies, and synthetic generation.',
      suggestedAction: { label: 'Go to Media Forensics', route: '/check?tab=media' },
    };
  }
  return {
    reply: 'ThreatLens is ready to help. Paste any suspicious link, SMS, email, or message into our Phishing Checker to evaluate its safety risk.',
    suggestedAction: { label: 'Go to Phishing Checker', route: '/check?tab=phishing' },
  };
}
