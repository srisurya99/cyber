import crypto from 'crypto';
import { AnalysisResult, PhishingAnalysisRequest, RiskLevel, AnalysisFinding } from '../../types';
import { inspectUrlOrDomain, DomainInspectionResult } from './domainIntelligence';
import { inspectThreatIntelligence } from './threatIntelligence';
import { GoogleGenAI } from '@google/genai';

export async function analyzePhishing(
  request: PhishingAnalysisRequest,
  aiClient?: GoogleGenAI | null
): Promise<AnalysisResult> {
  const analysisId = `AN-PHISH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const content = (request.content || '').trim();
  const sender = (request.sender || '').trim();
  const subject = (request.subject || '').trim();
  const inputType = request.type || 'message';
  const inputHash = crypto.createHash('sha256').update(content || '').digest('hex');

  const checksPerformed = [
    'INPUT_NORMALIZATION_AND_PARSING',
    'EXTRACTED_URL_DOMAIN_INTELLIGENCE',
    'PUBLIC_SUFFIX_REGISTRY_VERIFICATION',
    'HEURISTIC_LINGUISTIC_COERCION_CHECK',
    'CREDENTIAL_SOLICITATION_DETECTION',
  ];
  const checksUnavailable = [
    'LIVE_URL_SANDBOX_RENDERING (Disabled to preserve citizen IP privacy)',
    'EXTERNAL_TELECOM_DLT_GATEWAY_LOOKUP (No carrier telecom API credentials configured)',
  ];
  const limitations = [
    'Automated analysis combines domain registration checks, threat feed intelligence, and linguistic heuristics. Phishing techniques evolve rapidly; always verify unexpected account alerts through verified official customer care channels.',
  ];

  // 1. If pure link input, route through domain intelligence AND live threat intelligence
  if (inputType === 'link') {
    const domainResult = inspectUrlOrDomain(content);
    let threatIntel = null;
    if (domainResult.isValidUrl && !domainResult.isOfficialDomain) {
      try {
        threatIntel = await inspectThreatIntelligence(content);
      } catch (err) {
        console.warn('Threat intelligence lookup skipped:', err);
      }
    }
    return formatResultFromDomainInspection(analysisId, inputType, domainResult, content, threatIntel, inputHash);
  }

  // 2. Message / Email Analysis: Extract embedded URLs
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
  const rawUrls = content.match(urlRegex) || [];
  // Deduplicate and filter out email addresses masquerading as domains
  const extractedUrls = Array.from(new Set(rawUrls)).filter((u) => !u.includes('@'));

  const urlInspections: DomainInspectionResult[] = extractedUrls.map((u) => inspectUrlOrDomain(u));

  // 3. Linguistic & Message Pattern Matchers
  const lowerContent = content.toLowerCase();
  const lowerSubject = subject.toLowerCase();
  const lowerSender = sender.toLowerCase();
  const combinedText = `${lowerSubject} ${lowerContent}`;

  const urgencyKeywords = [
    'urgent',
    'immediately',
    'suspended',
    'blocked',
    'block your account',
    'expire',
    'kyc update',
    'pan update',
    'action required',
    'within 24 hours',
    'within 12 hours',
    'electricity will be disconnected',
    'power disconnected tonight',
    'lottery',
    'won prize',
    'winner',
    'unauthorized login',
  ];

  const credentialKeywords = [
    'otp',
    'one time password',
    'upi pin',
    'atm pin',
    'cvv',
    'net banking password',
    'share password',
    'debit card details',
    'download anydesk',
    'download rustdesk',
    'download teamviewer',
  ];

  const matchedUrgency = urgencyKeywords.filter((k) => combinedText.includes(k));
  const matchedCredentials = credentialKeywords.filter((k) => combinedText.includes(k));

  const detailedFindings: AnalysisFinding[] = [];
  let riskScore = 0;

  // Add findings from extracted URLs
  if (urlInspections.length > 0) {
    for (const uRes of urlInspections) {
      if (uRes.isOfficialDomain) {
        detailedFindings.push({
          code: 'EMBEDDED_OFFICIAL_DOMAIN',
          title: `Referenced Official Portal (${uRes.registeredDomain})`,
          description: `Message references the verified official website of ${uRes.officialOrgName}.`,
          source: 'domain-intelligence',
          status: 'confirmed',
          severity: 'low',
        });
      } else if (uRes.riskLevel === 'CRITICAL' || uRes.riskLevel === 'HIGH') {
        riskScore += uRes.riskScore;
        detailedFindings.push(...uRes.findings);
      } else if (uRes.isShortener) {
        riskScore += 35;
        detailedFindings.push(...uRes.findings);
      }
    }
  }

  // Urgency Coercion findings
  if (matchedUrgency.length > 0) {
    riskScore += 30;
    detailedFindings.push({
      code: 'MANUFACTURED_URGENCY',
      title: 'Coercive Urgency & Pressure Tactics',
      description: `The communication applies psychological pressure using deadline warnings: "${matchedUrgency.slice(0, 3).join('", "')}". Attackers use false urgency to bypass victim critical thinking.`,
      source: 'linguistic-heuristics',
      status: 'confirmed',
      severity: 'high',
    });
  }

  // Credential Harvesting findings
  if (matchedCredentials.length > 0) {
    riskScore += 40;
    detailedFindings.push({
      code: 'CREDENTIAL_HARVESTING_SOLICITATION',
      title: 'Solicitation of Confidential Authentication Credentials',
      description: `Message asks for sensitive banking secrets: "${matchedCredentials.slice(0, 3).join('", "')}". Authentic financial institutions never request OTP, UPI PIN, or remote-desktop software via message.`,
      source: 'linguistic-heuristics',
      status: 'confirmed',
      severity: 'critical',
    });
  }

  // Sender authenticity check
  if (sender) {
    if (lowerSender.includes('sbi') || lowerSender.includes('hdfc') || lowerSender.includes('bank') || lowerSender.includes('rbi')) {
      const isOfficialSenderDomain = urlInspections.some((u) => u.isOfficialDomain);
      if (!isOfficialSenderDomain && !lowerSender.endsWith('.sbi') && !lowerSender.endsWith('sbi.co.in')) {
        riskScore += 25;
        detailedFindings.push({
          code: 'UNAUTHENTICATED_SENDER_HEADER',
          title: 'Unverified Sender Branding',
          description: `Sender header "${sender}" claims bank association but lacks cryptographic DLT or domain authentication.`,
          source: 'sender-verification',
          status: 'suspected',
          severity: 'suspicious',
        });
      }
    }
  }

  // If no negative signals were found at all
  if (detailedFindings.length === 0) {
    detailedFindings.push({
      code: 'NO_SUSPICIOUS_INDICATORS',
      title: 'No Recognized Phishing Indicators Detected',
      description: 'Linguistic patterns and referenced links do not display recognized social engineering or credential harvesting signatures.',
      source: 'threatlens-heuristics',
      status: 'informational',
      severity: 'low',
    });
  }

  // Determine baseline risk score, level, and verdict
  const finalRiskScore = Math.min(100, Math.max(0, riskScore));
  let riskLevel: RiskLevel = 'LOW';
  let verdict: 'safe' | 'suspicious' | 'malicious' | 'inconclusive' = 'safe';
  const recommendations: string[] = [];

  if (finalRiskScore >= 65) {
    riskLevel = 'CRITICAL';
    verdict = 'malicious';
    recommendations.push(
      'Do NOT click any links, open attachments, or reply to this communication.',
      'Never disclose OTP, UPI PIN, ATM PIN, or passwords to anyone, even if they claim to represent your bank.',
      'If you suspect a financial compromise, dial the 1930 Cyber Fraud Helpline immediately.',
      'Report and block the sender on your device and on the national Chakshu / Sanchar Saathi portal.',
    );
  } else if (finalRiskScore >= 35) {
    riskLevel = 'HIGH';
    verdict = 'suspicious';
    recommendations.push(
      'Exercise high caution. Do not follow instructions in this message without direct verification.',
      'Call the official customer care phone number printed on the back of your bank debit card to verify.',
      'Do not download remote-access apps (AnyDesk, TeamViewer) requested by unsolicited callers or messages.',
    );
  } else if (finalRiskScore >= 20) {
    riskLevel = 'SUSPICIOUS';
    verdict = 'suspicious';
    recommendations.push(
      'Proceed cautiously. Verify the legitimacy of the sender before taking any requested action.',
      'Check your official banking app directly instead of clicking SMS links.',
    );
  } else {
    riskLevel = 'LOW';
    verdict = 'safe';
    recommendations.push(
      'Standard caution: Keep banking apps updated and never share your UPI PIN or OTP with third parties.',
    );
  }

  let summary =
    riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
      ? 'ThreatLens detected deceptive phishing signals, manufactured urgency, or fraudulent verification targets in this submission.'
      : riskLevel === 'SUSPICIOUS'
      ? 'This communication exhibits questionable social-engineering characteristics that require independent verification.'
      : 'No malicious phishing signatures or deceptive credential forms were identified in this submission.';

  // 4. If Gemini is available, augment with contextual citizen reasoning while respecting verified domain facts
  if (aiClient && content.length > 8) {
    try {
      const prompt = `You are a cybersecurity expert analyzing a potential phishing or scam submission for an ordinary citizen.
Domain Intelligence Findings already verified by ThreatLens:
- Official Domain Verified: ${urlInspections.some((u) => u.isOfficialDomain) ? 'YES (' + urlInspections.map((u) => u.officialOrgName).join(', ') + ')' : 'NO'}
- Extracted URLs: ${extractedUrls.join(', ') || 'None'}
- Matched Threat Findings: ${detailedFindings.map((f) => f.title).join('; ')}
- Baseline Verdict: ${verdict} (Risk: ${riskLevel})

User Submission Content:
Type: ${inputType}
Sender: ${sender || 'N/A'}
Subject: ${subject || 'N/A'}
Text: "${content.slice(0, 1000)}"

Instructions:
1. If the submission is an official institutional link (e.g. sbi.co.in or onlinesbi.sbi), DO NOT classify it as phishing or suspicious. Confirm it is the genuine institutional domain.
2. If the message uses urgency or threats (KYC, electricity disconnect, lottery, SIM block), explain clearly why it is a scam.
3. Return STRICTLY valid JSON with:
{
  "summary": "Clear, direct 1-2 sentence non-technical summary for citizen",
  "additional_observations": ["specific observation 1", "specific observation 2"],
  "specific_advice": ["actionable advice 1", "actionable advice 2"]
}
Do not use markdown backticks or commentary. Only raw JSON.`;

      const generatePromise = aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI inference timeout')), 4000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const text = response.text?.trim() || '';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.summary) {
        summary = parsed.summary;
      }
      if (Array.isArray(parsed.additional_observations) && parsed.additional_observations.length > 0) {
        parsed.additional_observations.forEach((obs: string) => {
          if (!detailedFindings.some((f) => f.description.includes(obs))) {
            detailedFindings.push({
              code: 'CONTEXTUAL_AI_OBSERVATION',
              title: 'Contextual AI Threat Observation',
              description: obs,
              source: 'gemini-3.8-flash',
              status: 'confirmed',
              severity: riskLevel === 'LOW' ? 'low' : 'suspicious',
            });
          }
        });
      }
      if (Array.isArray(parsed.specific_advice) && parsed.specific_advice.length > 0) {
        recommendations.unshift(...parsed.specific_advice);
      }
    } catch (geminiErr) {
      console.warn('Gemini phishing reasoning augmentation skipped:', geminiErr);
    }
  }

  const findingsStrings = detailedFindings.map((f) => `${f.title}: ${f.description}`);

  return {
    id: analysisId,
    analysisId,
    analysis_type: 'phishing',
    inputType,
    inputHash,
    status: 'completed',
    analysisStatus: 'completed',
    verdict,
    risk_level: riskLevel,
    riskLevel,
    riskScore: finalRiskScore,
    confidence: null, // Transparent: no fabricated percentage
    summary,
    findings: findingsStrings,
    detailedFindings,
    checksPerformed,
    checksUnavailable,
    recommendations: Array.from(new Set(recommendations)).slice(0, 5),
    limitations,
    technical_signals: {
      analyzedType: inputType,
      characterCount: content.length,
      extractedUrls,
      urlCount: extractedUrls.length,
      matchedUrgencyKeywords: matchedUrgency,
      matchedCredentialKeywords: matchedCredentials,
      riskScore: finalRiskScore,
      verdict,
      evaluationTimestamp: new Date().toISOString(),
    },
    disclaimer: 'ThreatLens analysis combines verified institutional domain registries with linguistic pattern heuristics. Automated detection serves as an analytical aid.',
    created_at: new Date().toISOString(),
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Format domain inspection output into standard AnalysisResult
 */
function formatResultFromDomainInspection(
  analysisId: string,
  inputType: string,
  dRes: DomainInspectionResult,
  rawContent: string,
  threatIntel?: any,
  inputHash?: string
): AnalysisResult {
  const findingsCopy = [...dRes.findings];
  let finalRiskLevel = dRes.riskLevel;
  let finalRiskScore = dRes.riskScore;
  let finalVerdict = dRes.verdict;

  // Augment with threat intelligence if verified match
  if (threatIntel && threatIntel.confirmedThreat) {
    findingsCopy.unshift({
      code: 'THREAT_INTEL_ACTIVE_MATCH',
      title: 'Active Threat Intelligence Match (URLhaus / CERT-In)',
      description: threatIntel.summary,
      source: 'threat-intelligence-feed',
      status: 'confirmed',
      severity: 'critical',
    });
    finalRiskLevel = 'CRITICAL';
    finalRiskScore = Math.max(88, finalRiskScore);
    finalVerdict = 'malicious';
  }

  const summary = threatIntel && threatIntel.confirmedThreat
    ? `Confirmed Malicious Endpoint: ${dRes.registeredDomain || dRes.hostname} is actively flagged in global malware/phishing feeds.`
    : dRes.isOfficialDomain
    ? `Verified Official Domain: ${dRes.registeredDomain} belongs to the genuine infrastructure of ${dRes.officialOrgName}.`
    : finalRiskLevel === 'CRITICAL' || finalRiskLevel === 'HIGH'
    ? `High-Risk Web Address: ${dRes.registeredDomain || dRes.hostname} exhibits deceptive lookalike brand mimicry or unauthenticated infrastructure.`
    : finalRiskLevel === 'SUSPICIOUS'
    ? `Suspicious Web Address: ${dRes.registeredDomain || dRes.hostname} contains anomalies requiring caution.`
    : `Standard Domain: ${dRes.registeredDomain} does not exhibit recognized brand-spoofing or malicious patterns.`;

  const findingsStrings = findingsCopy.map((f) => `${f.title}: ${f.description}`);

  const checksPerformed = [...dRes.checksPerformed];
  if (threatIntel) {
    checksPerformed.push('LIVE_URLHAUS_REPUTATION_QUERY', 'CERT_IN_ACTIVE_CAMPAIGN_SCAN');
  }

  return {
    id: analysisId,
    analysisId,
    analysis_type: 'phishing',
    inputType,
    inputHash,
    status: dRes.isValidUrl ? 'completed' : 'inconclusive',
    analysisStatus: dRes.isValidUrl ? 'completed' : 'inconclusive',
    verdict: finalVerdict,
    risk_level: finalRiskLevel,
    riskLevel: finalRiskLevel,
    riskScore: finalRiskScore,
    confidence: null, // Honest: no fabricated percentage
    summary,
    findings: findingsStrings,
    detailedFindings: findingsCopy,
    checksPerformed,
    checksUnavailable: dRes.checksUnavailable,
    recommendations: dRes.recommendations,
    limitations: dRes.limitations,
    technical_signals: {
      analyzedType: 'link',
      rawInput: rawContent,
      normalizedUrl: dRes.normalizedUrl,
      hostname: dRes.hostname,
      registeredDomain: dRes.registeredDomain,
      publicSuffix: dRes.publicSuffix,
      subdomain: dRes.subdomain,
      isOfficialDomain: dRes.isOfficialDomain,
      officialOrgName: dRes.officialOrgName,
      isIpAddress: dRes.isIpAddress,
      isShortener: dRes.isShortener,
      riskScore: finalRiskScore,
      verdict: finalVerdict,
      threatIntelProviders: threatIntel?.providers || [],
      evaluationTimestamp: new Date().toISOString(),
    },
    disclaimer: 'Domain reputation evaluates structural provenance and authoritative registrations. It does not inspect dynamically served client-side JavaScript.',
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    analyzedAt: new Date().toISOString(),
  };
}
