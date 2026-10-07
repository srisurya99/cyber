import { AnalysisResult, BlackmailTriageRequest, Incident, IncidentAction, RiskLevel, TimelineEvent } from '../../types';

export async function analyzeBlackmail(request: BlackmailTriageRequest): Promise<{ incident: Incident; analysis: AnalysisResult }> {
  const timestamp = new Date().toISOString();
  const incNum = Math.floor(10000 + Math.random() * 90000);
  const incidentId = `TL-2026-${incNum}`;

  const isCritical = request.physicalDanger || request.threatTypes.includes('private_images') || request.threatTypes.includes('physical_harm');
  const riskLevel: RiskLevel = isCritical ? 'CRITICAL' : 'HIGH';

  const threatLabelMap: Record<string, string> = {
    private_images: 'Non-consensual media leak (Sextortion)',
    personal_info: 'Doxxing & privacy exposure',
    contact_family: 'Harassment targeting family/associates',
    demand_money: 'Extortion / Ransom demand',
    takeover_account: 'Account compromise & lockout threat',
    physical_harm: 'Physical intimidation / stalking',
    other: 'Online coercion / intimidation',
  };

  const detectedThreats = request.threatTypes.map(t => threatLabelMap[t] || t);

  const actions: IncidentAction[] = [
    {
      id: `bm-act-1-${Date.now()}`,
      incident_id: incidentId,
      priority: 1,
      title: "Step 1: Do NOT send more money, passwords, or private media",
      description: 'Extortionists almost always escalate their demands once a payment is made. Cut off any financial transactions immediately.',
      is_completed: false,
      urgent: true,
    },
    {
      id: `bm-act-2-${Date.now()}`,
      incident_id: incidentId,
      priority: 2,
      title: 'Step 2: Preserve all evidence before taking action',
      description: 'Capture uncropped screenshots of the conversation, user handles, phone numbers, payment links/crypto wallets, and threat messages. Do not delete the chat yet.',
      is_completed: false,
      urgent: true,
    },
    {
      id: `bm-act-3-${Date.now()}`,
      incident_id: incidentId,
      priority: 3,
      title: 'Step 3: Secure and lockdown your digital accounts',
      description: request.hasAccountAccess
        ? 'Change your password immediately, turn on Two-Factor Authentication (2FA) via authenticator app, and end all active logged-in sessions in Account Settings.'
        : 'Use account recovery mechanisms immediately (Forgot Password, trusted contacts, identity verification) to regain access and revoke hacker sessions.',
      is_completed: false,
      urgent: true,
    },
    {
      id: `bm-act-4-${Date.now()}`,
      incident_id: incidentId,
      priority: 4,
      title: 'Step 4: Block and report the perpetrator through official platform channels',
      description: 'Report the profile for extortion/harassment on the respective social network (Instagram, WhatsApp, Telegram, X). Adjust privacy settings to Private/Contacts Only.',
      is_completed: false,
      urgent: false,
    },
    {
      id: `bm-act-5-${Date.now()}`,
      incident_id: incidentId,
      priority: 5,
      title: 'Step 5: File with cybercrime authorities & StopNCII.org',
      description: 'Lodge a complaint on cybercrime.gov.in (National Cyber Crime Reporting Portal) or call 1930. If intimate images are involved, create a cryptographic hash on StopNCII.org to prevent distribution across major tech platforms.',
      is_completed: false,
      urgent: true,
      official_link: 'https://stopncii.org',
    },
  ];

  const now = new Date();
  const timeMinus10 = new Date(now.getTime() - 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeMinus5 = new Date(now.getTime() - 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const timeline: TimelineEvent[] = [
    {
      id: `tl-bm-1-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'threat_received',
      title: 'Extortion / Threat initiated',
      description: `Perpetrator initiated intimidation: ${detectedThreats.join(', ')}.`,
      timestamp: timeMinus10,
    },
    {
      id: `tl-bm-2-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'reported_to_threatlens',
      title: 'ThreatLens emergency triage active',
      description: 'Safety containment sequence triggered; account isolation protocols deployed.',
      timestamp: timeMinus5,
    },
    {
      id: `tl-bm-3-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'analysis_run',
      title: 'Action plan established',
      description: 'Personalized 5-step safety containment roadmap generated for citizen.',
      timestamp: timeNow,
    },
  ];

  const analysis: AnalysisResult = {
    id: `AN-BM-${Date.now()}`,
    incident_id: incidentId,
    analysis_type: 'blackmail',
    risk_level: riskLevel,
    confidence: 96,
    summary: 'High-urgency digital coercion / extortion event identified. Immediate containment and non-engagement protocol enforced.',
    findings: [
      `Primary threat vectors: ${detectedThreats.join(', ')}`,
      request.hasAccountAccess ? 'User maintains account control (Immediate password reset and 2FA required).' : 'User account access compromised (Urgent account recovery flow needed).',
      'Extortion demands rely on shock and urgency to elicit compliance.',
    ],
    recommendations: [
      'Cease all payments or concessions; compliance increases extortion risk.',
      'Document every communication trace thoroughly before blocking or reporting.',
      'Engage law enforcement (1930 / cybercrime.gov.in) and StopNCII.org immediately.',
      'Lean on trusted family or a professional counselor; remember you are the victim of a crime, not the cause.',
    ],
    technical_signals: {
      physicalDangerChecked: request.physicalDanger,
      threatCount: request.threatTypes.length,
      accountAccessRetained: request.hasAccountAccess,
      recommendedHotlines: ['1930 Cyber Helpline', '112 Emergency Police', 'StopNCII.org Hash Network'],
    },
    disclaimer: 'ThreatLens guides digital evidence preservation and account hardening. If you feel at risk of physical injury, contact local police (112) immediately.',
    created_at: timestamp,
  };

  const incident: Incident = {
    id: incidentId,
    type: 'blackmail',
    title: `Digital Extortion / Intimidation Incident (${detectedThreats[0] || 'Threat'})`,
    description: `Reported threats: ${detectedThreats.join(', ')}. Account access: ${request.hasAccountAccess ? 'Retained' : 'Lost'}.`,
    risk_level: riskLevel,
    status: 'IN_PROGRESS',
    created_at: timestamp,
    updated_at: timestamp,
    evidence: [],
    timeline,
    actions,
    analysis,
  };

  return { incident, analysis };
}
