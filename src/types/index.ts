export type RiskLevel = 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL' | 'INCONCLUSIVE';

export type IncidentType = 
  | 'phishing' 
  | 'media_forensics' 
  | 'scam' 
  | 'blackmail' 
  | 'apk_malware' 
  | 'digital_arrest' 
  | 'account_takeover' 
  | 'impersonation' 
  | 'general';

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'te';
  created_at: string;
}

export interface AnalysisFinding {
  code: string;
  title: string;
  description: string;
  source: string;
  status: 'confirmed' | 'suspected' | 'informational';
  severity?: 'low' | 'suspicious' | 'high' | 'critical';
}

export interface StandardAnalysisResponse {
  analysisId: string;
  inputType: 'url' | 'message' | 'link' | 'email' | 'image' | 'video' | 'scam' | 'blackmail';
  status: 'completed' | 'inconclusive' | 'failed' | 'simulated';
  verdict: 'safe' | 'suspicious' | 'malicious' | 'inconclusive';
  riskLevel: RiskLevel;
  riskScore: number | null;
  confidence: number | null;
  summary: string;
  findings: (string | AnalysisFinding)[];
  detailedFindings?: AnalysisFinding[];
  checksPerformed: string[];
  checksUnavailable: string[];
  recommendations: string[];
  limitations: string[];
  analyzedAt: string;
  technical_signals?: Record<string, any>;
}

export interface AnalysisResult {
  id: string;
  analysisId?: string;
  incident_id?: string;
  analysis_type: 'phishing' | 'media_forensics' | 'scam' | 'blackmail';
  inputType?: string;
  inputHash?: string;
  status?: 'completed' | 'inconclusive' | 'failed' | 'simulated' | 'detection_unavailable' | 'analysis_failed' | 'analyzing';
  analysisStatus?: string;
  verdict?: 'safe' | 'suspicious' | 'malicious' | 'inconclusive';
  risk_level: RiskLevel;
  riskLevel?: RiskLevel;
  riskScore?: number | null;
  confidence: number | null;
  estimatedLikelihood?: number | null;
  modelScore?: number | null;
  detectionStatus?: 'analyzing' | 'likely_ai' | 'possible_manipulation' | 'no_clear_signs' | 'inconclusive' | 'detection_unavailable' | 'analysis_failed';
  observedArtifacts?: string[];
  detectorModelName?: string;
  sha256Hash?: string;
  summary: string;
  findings: string[];
  detailedFindings?: AnalysisFinding[];
  checksPerformed?: string[];
  checksUnavailable?: string[];
  recommendations: string[];
  limitations?: string[];
  technical_signals?: Record<string, any>;
  disclaimer?: string;
  created_at: string;
  createdAt?: string;
  analyzedAt?: string;
  // Video Temporal & Forensic Sub-Analyses
  videoContentAnalysis?: VideoContentAnalysis;
  videoForensicAnalysis?: VideoForensicAnalysis;
  syntheticMediaAnalysis?: SyntheticMediaAnalysis;
  provenanceVerification?: SyntheticMediaVerificationResult;
  videoDurationSec?: number;
  videoResolution?: { width: number; height: number };
  samplingRate?: string;
  extractedKeyframes?: Array<{ timestampSec: number; timestampFormatted: string; dataUrl: string }>;
}

export interface SceneChange {
  timestampSec: number;
  timestampFormatted: string; // e.g. "00:03"
  description: string;
}

export interface TimestampObservation {
  timestampSec: number;
  timestampFormatted: string; // e.g. "00:04"
  label: string;
  detail: string;
  category: 'person' | 'face' | 'scene_change' | 'artifact' | 'audio' | 'lighting' | 'anomaly';
  keyframeDataUrl?: string;
}

export interface VideoContentAnalysis {
  personDetected: boolean;
  firstDetected?: string | null;
  lastDetected?: string | null;
  detectedTimestamps: string[];
  framesAnalyzed: number;
  framesContainingPerson: number;
  faceDetected: boolean;
  faceCount: number;
  detectedObjects: string[];
  sceneChanges: SceneChange[];
  timestamps: TimestampObservation[];
  summary: string;
}

export interface ForensicIndicator {
  name: string;
  status: 'normal' | 'suspicious' | 'irregular' | 'unverified';
  details: string;
  timestamps?: string[];
}

export interface VideoForensicAnalysis {
  visualIndicators: ForensicIndicator[];
  temporalIndicators: ForensicIndicator[];
  metadataFindings: Array<{ field: string; value: string; notes?: string }>;
}

export interface SyntheticMediaAnalysis {
  status: 'available' | 'unavailable' | 'inconclusive';
  verdict: 'likely_ai_generated' | 'possibly_manipulated' | 'no_clear_signs' | 'inconclusive' | null;
  modelName?: string;
  modelVersion?: string;
  score?: number | null;
  explanation: string;
  whatWasAnalyzed: string[];
  whatCouldNotBeDetermined: string[];
}

export type ProvenanceVerificationStatus =
  | 'DETECTED'
  | 'NOT_DETECTED'
  | 'INCONCLUSIVE'
  | 'UNAVAILABLE'
  | 'ERROR'
  | 'NOT_CONFIGURED';

export interface SyntheticMediaVerificationResult {
  provider: string; // e.g. "google_synthid"
  providerName?: string; // e.g. "Google SynthID"
  status: ProvenanceVerificationStatus;
  scope: 'VIDEO' | 'IMAGE' | 'AUDIO' | 'UNKNOWN';
  source?: string;
  explanation: string;
  whatThisMeans?: string;
  interpretation?: string;
  segments?: Array<{
    startSeconds: number;
    endSeconds: number;
    detected: boolean;
  }>;
  details?: Record<string, any>;
  verifiedAt?: string;
}

export interface EvidenceItem {
  id: string;
  incident_id: string;
  type: 'screenshot' | 'message' | 'transaction' | 'url' | 'phone' | 'email' | 'social_profile' | 'document' | 'media';
  title: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  preview_url?: string;
  metadata?: Record<string, any>;
  notes?: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  incident_id: string;
  event_type: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface IncidentAction {
  id: string;
  incident_id: string;
  priority: number;
  title: string;
  description: string;
  is_completed: boolean;
  official_link?: string;
  urgent?: boolean;
}

export interface Incident {
  id: string;
  user_id?: string;
  type: IncidentType;
  title: string;
  description?: string;
  risk_level: RiskLevel;
  status: IncidentStatus;
  financial_loss?: number;
  currency?: string;
  platform?: string;
  created_at: string;
  updated_at: string;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  actions: IncidentAction[];
  analysis?: AnalysisResult;
}

export interface PhishingAnalysisRequest {
  type: 'message' | 'link' | 'email';
  content: string;
  sender?: string;
  subject?: string;
}

export interface MediaForensicsRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl?: string;
  mediaType: 'image' | 'video';
  keyFrames?: Array<{ timestampSec: number; dataUrl: string; timestampFormatted?: string }>;
  videoDurationSec?: number;
  videoResolution?: { width: number; height: number };
  samplingRate?: string;
  isSimulated?: boolean;
}

export interface MediaForensicsSignals {
  faceConsistency: { score: number; status: 'normal' | 'suspicious' | 'irregular'; details: string };
  lightingConsistency: { score: number; status: 'normal' | 'suspicious' | 'irregular'; details: string };
  frameArtifacts: { score: number; status: 'normal' | 'suspicious' | 'irregular'; details: string };
  metadataIntegrity: { score: number; status: 'intact' | 'stripped' | 'altered'; details: string };
  compressionPatterns: { score: number; status: 'uniform' | 'anomalous'; details: string };
  aiGenerationLikelihood: { score: number; label: string };
}

export interface ScamTriageRequest {
  category: 'upi' | 'bank_card' | 'fake_shopping' | 'investment' | 'job' | 'social_media' | 'romance' | 'other';
  financialLoss?: number;
  transferredAmount?: string;
  paymentApp?: string;
  suspiciousContact?: string;
  platform?: string;
  summary: string;
  evidenceList?: Array<{ title: string; type: string; notes?: string }>;
}

export interface BlackmailTriageRequest {
  physicalDanger: boolean;
  threatTypes: string[]; // 'private_images' | 'personal_info' | 'contact_family' | 'demand_money' | 'takeover_account' | 'physical_harm' | 'other'
  hasAccountAccess: boolean;
  blackmailerPlatform?: string;
  demandDetails?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    route: string;
  };
}

// Threat Intelligence Types
export interface ThreatIntelProviderStatus {
  provider: string;
  status: 'checked' | 'unavailable' | 'timeout';
  match: boolean;
  verdict?: 'malicious' | 'suspicious' | 'clean' | 'unknown';
  details?: string;
  responseTimeMs?: number;
}

export interface ThreatIntelligenceResult {
  targetUrl: string;
  normalizedDomain: string;
  providers: ThreatIntelProviderStatus[];
  confirmedThreat: boolean;
  threatType?: string;
  summary: string;
  evaluatedAt: string;
  cached: boolean;
}

// APK Malware & Suspicious App Types
export interface ApkAnalysisRequest {
  fileName: string;
  fileSize: number;
  packageName?: string;
  appLabel?: string;
  permissions?: string[];
  fileHash?: string;
  installedOnDevice?: boolean;
  sensitiveAccessGranted?: boolean;
}

export interface ApkAnalysisResult extends AnalysisResult {
  packageName?: string;
  dangerousPermissions: Array<{ permission: string; risk: string; purpose: string }>;
  trojanCategory?: 'banking_trojan' | 'predatory_loan' | 'spyware' | 'remote_access' | 'generic_adware' | 'safe';
  containmentRoadmap: string[];
}

// Digital Arrest Scam Request
export interface DigitalArrestRequest {
  callerClaim: 'cbi' | 'ed' | 'police' | 'customs_courier' | 'court_judge' | 'trai_telecom' | 'other';
  channel: 'skype' | 'whatsapp_video' | 'phone_call' | 'telegram' | 'other';
  threatClaims: string[];
  moneyDemanded: boolean;
  demandedAmount?: string;
  currentlyOnCall: boolean;
  immediateSafetyRisk: boolean;
  callerDetails?: string;
  notes?: string;
}

// Incident Correlation
export interface CorrelatedIncidentSummary {
  incidentId: string;
  matchedIndicator: string;
  indicatorType: 'domain' | 'vpa' | 'phone' | 'apk_hash' | 'scam_phrase';
  created_at: string;
}

export interface IndicatorCorrelationResult {
  hasCorrelation: boolean;
  matchedCount: number;
  correlations: CorrelatedIncidentSummary[];
  privacyPreservingNote: string;
}

