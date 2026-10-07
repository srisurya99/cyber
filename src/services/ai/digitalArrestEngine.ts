import { DigitalArrestRequest, AnalysisResult, Incident, IncidentAction, TimelineEvent, RiskLevel } from '../../types';

export function analyzeDigitalArrestIncident(request: DigitalArrestRequest): {
  analysis: AnalysisResult;
  incident: Incident;
} {
  const incNum = Math.floor(10000 + Math.random() * 90000);
  const incidentId = `TL-2026-${incNum}`;
  const now = new Date().toISOString();

  const callerClaimNames: Record<string, string> = {
    cbi: 'Central Bureau of Investigation (CBI)',
    ed: 'Enforcement Directorate (ED)',
    police: 'State Police / Cyber Crime Branch (Mumbai/Delhi/Crime Branch)',
    customs_courier: 'Customs & Narcotics Control Bureau (NCB - FedEx / DHL courier)',
    court_judge: 'Supreme Court / High Court Judicial Officer',
    trai_telecom: 'TRAI / Telecom Department (Mobile SIM disconnection order)',
    other: 'Government Authority / Law Enforcement Agency',
  };

  const agencyName = callerClaimNames[request.callerClaim] || 'Law Enforcement Agency';
  const hasMoneyLoss = Boolean(request.moneyDemanded && request.demandedAmount && parseFloat(request.demandedAmount) > 0);

  // Critical Law Enforcement Clarification
  const statutoryNotice =
    'LEGAL REALITY UNDER INDIAN LAW: There is NO provision for "Digital Arrest" under the Bharatiya Nagarik Suraksha Sanhita (BNSS), CrPC, or Information Technology Act. Legitimate police, CBI, ED, and judges NEVER conduct trials, interrogations, or issue arrest warrants via WhatsApp or Skype video calls, and NEVER ask citizens to transfer money to "RBI verification accounts".';

  const findings: string[] = [
    `Impersonation of Sovereign Agency: Callers fraudulently claimed association with ${agencyName}.`,
    `Extortion Channel: Communication conducted via ${request.channel.toUpperCase().replace('_', ' ')} (unauthorized for lawful summons).`,
    statutoryNotice,
  ];

  if (request.threatClaims && request.threatClaims.length > 0) {
    findings.push(`Manufactured Coercion Tactics: ${request.threatClaims.join(', ')}.`);
  }

  if (request.moneyDemanded) {
    findings.push(
      `Financial Extortion Demand: Coercing victim to transfer funds under the guise of a "Supreme Court Verification Fund" or "RBI Escrow Account".`
    );
  }

  // Priority Incident Response Actions
  const actions: IncidentAction[] = [
    {
      id: `act-da-1-${Date.now()}`,
      incident_id: incidentId,
      priority: 1,
      title: 'DISCONNECT THE CALL IMMEDIATELY',
      description:
        'Hang up and block the number immediately. Scammers exploit video calls to isolate you psychologically. They cannot arrest you through a screen.',
      is_completed: false,
      urgent: true,
    },
  ];

  if (request.immediateSafetyRisk) {
    actions.push({
      id: `act-da-safe-${Date.now()}`,
      incident_id: incidentId,
      priority: 2,
      title: 'Dial National Emergency Service 112',
      description:
        'If anyone is physically intimidating you outside your home or you feel in immediate danger, call 112 for local police assistance.',
      is_completed: false,
      urgent: true,
      official_link: 'tel:112',
    });
  }

  if (hasMoneyLoss) {
    actions.push({
      id: `act-da-1930-${Date.now()}`,
      incident_id: incidentId,
      priority: request.immediateSafetyRisk ? 3 : 2,
      title: 'Dial 1930 Cyber Fraud Helpline (Golden Hour window)',
      description:
        'If you transferred funds to the scammer\'s account or UPI, call 1930 immediately. Provide the transaction UTR number to trigger a lien freeze on beneficiary accounts.',
      is_completed: false,
      urgent: true,
      official_link: 'tel:1930',
    });
  }

  actions.push(
    {
      id: `act-da-ev-${Date.now()}`,
      incident_id: incidentId,
      priority: 3,
      title: 'Preserve Call Logs, Video Recordings, & Fake Warrants',
      description:
        'Take screenshots of the caller\'s profile, incoming phone number, Skype handle, and any fake court/police letterheads received over WhatsApp.',
      is_completed: false,
      urgent: true,
    },
    {
      id: `act-da-portal-${Date.now()}`,
      incident_id: incidentId,
      priority: 4,
      title: 'Lodge Official Complaint on cybercrime.gov.in',
      description:
        'Submit a formal complaint under "Financial Fraud" or "Impersonation / Digital Extortion" attaching this generated ThreatLens dossier.',
      is_completed: false,
      official_link: 'https://cybercrime.gov.in',
    },
    {
      id: `act-da-fam-${Date.now()}`,
      incident_id: incidentId,
      priority: 5,
      title: 'Talk to a Trusted Family Member or Friend',
      description:
        'Scammers demand total secrecy ("Do not tell your family or they will be arrested"). Break the isolation by talking to someone you trust.',
      is_completed: false,
    }
  );

  const timeline: TimelineEvent[] = [
    {
      id: `tl-da-1-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'initial_threat_call',
      title: 'Digital Arrest Intimidation Call Received',
      description: `Citizen received coercive call purporting to be from ${agencyName} via ${request.channel}.`,
      timestamp: 'Recorded Time',
    },
    {
      id: `tl-da-2-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'threatlens_triage',
      title: 'ThreatLens Crisis Response Activated',
      description: 'Confirmed fraudulent Digital Arrest modus operandi. Generated statutory notice and emergency checklist.',
      timestamp: 'Just now',
    },
  ];

  const analysis: AnalysisResult = {
    id: `AN-DA-${Date.now()}`,
    incident_id: incidentId,
    analysis_type: 'blackmail',
    risk_level: 'CRITICAL',
    riskLevel: 'CRITICAL',
    riskScore: 98,
    confidence: null,
    summary: `CRITICAL FRAUD ALERT: High-severity Digital Arrest extortion scam detected. The callers are impersonating ${agencyName} using manufactured legal threats to provoke panic.`,
    findings,
    checksPerformed: [
      'STATUTORY_LAW_ENFORCEMENT_VALIDATION',
      'DIGITAL_ARREST_MODUS_OPERANDI_MATCH',
      'VIDEO_EXTORTION_CHANNEL_AUDIT',
      'BENEFICIARY_ESCROW_TRAP_EVALUATION',
    ],
    checksUnavailable: [
      'LIVE_CALL_TRACE (Requires statutory telecom interception warrant by authorized state police)',
    ],
    recommendations: [
      'Disconnect and block the callers immediately—there is no such thing as Digital Arrest.',
      'Never transfer money to any "police verification" or "RBI security" account.',
      'Dial 1930 immediately if money was transferred.',
      'Contact family or friends to break the psychological isolation.',
    ],
    limitations: [
      'ThreatLens provides defensive guidance and evidence preservation. Legal enforcement and suspect arrests are conducted exclusively by State Police and Cyber Crime cells.',
    ],
    technical_signals: {
      claimedAgency: agencyName,
      channel: request.channel,
      demandedAmount: request.demandedAmount || '0',
      currentlyOnCall: request.currentlyOnCall,
      immediateSafetyRisk: request.immediateSafetyRisk,
      evaluationTimestamp: now,
    },
    disclaimer: statutoryNotice,
    created_at: now,
    analyzedAt: now,
  };

  const incident: Incident = {
    id: incidentId,
    type: 'digital_arrest',
    title: `Digital Arrest Extortion Scheme (${agencyName})`,
    description: `Citizen targeted by fraudulent Digital Arrest scheme claiming illegal package / money laundering on behalf of ${agencyName} via ${request.channel}. Demanded: ${request.demandedAmount || 'Financial Verification'}.`,
    risk_level: 'CRITICAL',
    status: 'IN_PROGRESS',
    financial_loss: hasMoneyLoss ? parseFloat(request.demandedAmount!) : 0,
    currency: 'INR',
    platform: request.channel === 'skype' ? 'Skype Video Call' : request.channel === 'whatsapp_video' ? 'WhatsApp Video Call' : 'Phone Call',
    created_at: now,
    updated_at: now,
    evidence: [
      {
        id: `ev-da-${incidentId}-1`,
        incident_id: incidentId,
        type: 'phone',
        title: 'Extortion Caller Identifiers',
        notes: `Channel: ${request.channel}. Caller claimed: ${agencyName}. Details: ${request.callerDetails || 'Caller profile not specified'}.`,
        created_at: now,
      },
    ],
    timeline,
    actions,
    analysis,
  };

  return { analysis, incident };
}
