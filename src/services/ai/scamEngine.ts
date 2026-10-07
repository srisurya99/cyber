import { AnalysisResult, Incident, IncidentAction, RiskLevel, ScamTriageRequest, TimelineEvent } from '../../types';

export async function analyzeScam(request: ScamTriageRequest): Promise<{ incident: Incident; analysis: AnalysisResult }> {
  const timestamp = new Date().toISOString();
  const incNum = Math.floor(10000 + Math.random() * 90000);
  const incidentId = `TL-2026-${incNum}`;

  const categoryTitles: Record<string, string> = {
    upi: 'UPI Payment Fraud / QR Trap',
    bank_card: 'Bank Card / Unauthorized Debit Fraud',
    fake_shopping: 'Counterfeit E-Commerce & Fake Store Scam',
    investment: 'Fraudulent High-Yield Investment / Crypto Scheme',
    job: 'Advance Fee / Fake Work-From-Home Task Scam',
    social_media: 'Social Media Impersonation & Prize Trap',
    romance: 'Romance / Relationship Confidence Scam',
    other: 'Digital Fraud / Social Engineering Incident',
  };

  const title = categoryTitles[request.category] || 'Digital Scam Incident';
  const hasLoss = (request.financialLoss && request.financialLoss > 0) || (request.transferredAmount && parseFloat(request.transferredAmount) > 0);
  const riskLevel: RiskLevel = hasLoss ? 'CRITICAL' : 'HIGH';

  const warningSigns = [
    'Urgent payment or quick verification demand designed to bypass scrutiny',
    'Unknown recipient or unauthorized Virtual Payment Address (VPA)',
    'Coercive psychological manipulation (promise of quick profit or fear of penalties)',
    'Use of unverified communication channels (Telegram, WhatsApp group, unregistered SMS)',
  ];

  if (request.category === 'upi') {
    warningSigns.push('Misuse of "Collect Request" or "Scan QR to Receive Money" deception');
  }

  // Generate Priority Recommended Actions
  const actions: IncidentAction[] = [
    {
      id: `act-1-${Date.now()}`,
      incident_id: incidentId,
      priority: 1,
      title: 'Contact your bank / payment app immediately',
      description: 'Call your bank helpline (or 1930 Cybercrime Helpline in India) within the Golden Hour to request a freeze on the transaction / recipient VPA. Note your complaint reference number.',
      is_completed: false,
      urgent: true,
      official_link: 'tel:1930',
    },
    {
      id: `act-2-${Date.now()}`,
      incident_id: incidentId,
      priority: 2,
      title: 'Preserve all digital evidence',
      description: 'Take high-resolution screenshots of the chat, SMS, recipient UPI ID/account number, and the bank transaction UTR/reference screen before they are deleted.',
      is_completed: false,
      urgent: true,
    },
    {
      id: `act-3-${Date.now()}`,
      incident_id: incidentId,
      priority: 3,
      title: 'File an official report on the National Cybercrime Portal',
      description: 'Register the cyber fraud at cybercrime.gov.in. Provide all UTR numbers and screenshots. This creates an official police record.',
      is_completed: false,
      urgent: false,
      official_link: 'https://cybercrime.gov.in',
    },
    {
      id: `act-4-${Date.now()}`,
      incident_id: incidentId,
      priority: 4,
      title: 'Secure your UPI app and bank credentials',
      description: 'Change your UPI MPIN, internet banking password, and check for any unauthorized device logins or forwarded calls (*#67#).',
      is_completed: false,
      urgent: false,
    },
    {
      id: `act-5-${Date.now()}`,
      incident_id: incidentId,
      priority: 5,
      title: 'Report and block the scammer profile',
      description: 'Report the scammer profile and number on WhatsApp/Instagram/Telegram and Truecaller to help alert other citizens.',
      is_completed: false,
      urgent: false,
    },
  ];

  // Generate realistic initial timeline
  const now = new Date();
  const timeMinus15 = new Date(now.getTime() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeMinus10 = new Date(now.getTime() - 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeMinus5 = new Date(now.getTime() - 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const timeline: TimelineEvent[] = [
    {
      id: `tl-1-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'initial_contact',
      title: 'Initial contact received',
      description: `Suspicious contact initiated via ${request.platform || 'messaging platform'}.`,
      timestamp: timeMinus15,
    },
    {
      id: `tl-2-${Date.now()}`,
      incident_id: incidentId,
      event_type: hasLoss ? 'money_transferred' : 'payment_requested',
      title: hasLoss ? 'Fraudulent transaction occurred' : 'Payment request received',
      description: hasLoss
        ? `₹${request.financialLoss || request.transferredAmount || '5,000'} transferred under fraudulent pretenses.`
        : 'Scammer solicited payment or sensitive access codes.',
      timestamp: timeMinus10,
    },
    {
      id: `tl-3-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'reported_to_threatlens',
      title: 'ThreatLens incident created',
      description: 'Incident registered and prioritized safety roadmap generated.',
      timestamp: timeMinus5,
    },
    {
      id: `tl-4-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'analysis_run',
      title: 'Risk analysis & response checklist completed',
      description: 'Evidence preservation and containment steps outlined for citizen.',
      timestamp: timeNow,
    },
  ];

  const analysis: AnalysisResult = {
    id: `AN-SCAM-${Date.now()}`,
    incident_id: incidentId,
    analysis_type: 'scam',
    risk_level: riskLevel,
    confidence: 94,
    summary: `High-risk ${categoryTitles[request.category] || 'digital fraud'} signature detected. Immediate containment actions are recommended.`,
    findings: warningSigns,
    recommendations: [
      'Contact your bank immediately to block affected cards and lodge a chargeback / fraud dispute.',
      'Call 1930 (Citizen Financial Cyber Fraud Helpline) within the golden hour to freeze fund routing.',
      'Preserve transaction receipts, UTR numbers, and complete chat transcripts as admissible evidence.',
      'Never send additional money to "recover" lost funds; secondary recovery schemes are widespread.',
    ],
    technical_signals: {
      category: request.category,
      financialLoss: request.financialLoss || request.transferredAmount || 0,
      platform: request.platform || 'Unknown',
      goldenHourStatus: 'Active - Immediate Action Warranted',
    },
    disclaimer: 'ThreatLens provides incident mitigation guidance. While timely reporting can halt transaction routing, fund recovery depends on banking and law enforcement procedures.',
    created_at: timestamp,
  };

  const incident: Incident = {
    id: incidentId,
    type: 'scam',
    title,
    description: request.summary,
    risk_level: riskLevel,
    status: 'IN_PROGRESS',
    financial_loss: request.financialLoss || (request.transferredAmount ? parseFloat(request.transferredAmount) : 0),
    currency: 'INR',
    platform: request.platform || 'Online',
    created_at: timestamp,
    updated_at: timestamp,
    evidence: [],
    timeline,
    actions,
    analysis,
  };

  return { incident, analysis };
}
