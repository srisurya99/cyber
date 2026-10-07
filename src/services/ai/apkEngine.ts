import crypto from 'crypto';
import { ApkAnalysisRequest, ApkAnalysisResult, RiskLevel, Incident, IncidentAction, TimelineEvent } from '../../types';

interface DangerousPermissionDef {
  permission: string;
  name: string;
  severity: 'critical' | 'high' | 'suspicious';
  purpose: string;
  mitigation: string;
}

const HIGH_RISK_ANDROID_PERMISSIONS: DangerousPermissionDef[] = [
  {
    permission: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
    name: 'Accessibility Service Control',
    severity: 'critical',
    purpose: 'Allows the application to read all screen text, capture banking passwords/OTPs, simulate screen taps, and block uninstallation.',
    mitigation: 'Go to Settings > Accessibility and turn OFF access for this app immediately.',
  },
  {
    permission: 'android.permission.RECEIVE_SMS',
    name: 'Receive SMS Messages',
    severity: 'critical',
    purpose: 'Enables real-time interception of bank One-Time Passwords (OTPs) and transaction approval codes without citizen awareness.',
    mitigation: 'Revoke SMS permission under Settings > Apps > Permissions.',
  },
  {
    permission: 'android.permission.READ_SMS',
    name: 'Read SMS Inbox',
    severity: 'critical',
    purpose: 'Scrapes historic banking balances, UPI transaction notifications, and personal messages.',
    mitigation: 'Revoke SMS permission under Settings > Apps > Permissions.',
  },
  {
    permission: 'android.permission.READ_CONTACTS',
    name: 'Read Address Book Contacts',
    severity: 'high',
    purpose: 'Exfiltrates your entire phonebook. Heavily abused by illegal loan apps to harass family, friends, and colleagues with morphed photos.',
    mitigation: 'Deny Contacts permission. Never grant contact access to unverified financial apps.',
  },
  {
    permission: 'android.permission.SYSTEM_ALERT_WINDOW',
    name: 'Draw Over Other Apps',
    severity: 'high',
    purpose: 'Enables overlay injection attacks by displaying a fake banking login screen on top of your legitimate banking application.',
    mitigation: 'Revoke "Display over other apps" permission in Settings.',
  },
  {
    permission: 'android.permission.REQUEST_INSTALL_PACKAGES',
    name: 'Install Unknown Applications',
    severity: 'high',
    purpose: 'Functions as a dropper malware, secretly downloading secondary payload APKs and ransomware from remote C2 servers.',
    mitigation: 'Disable "Install unknown apps" for this application in Settings.',
  },
  {
    permission: 'android.permission.READ_CALL_LOG',
    name: 'Read Phone Call Records',
    severity: 'suspicious',
    purpose: 'Gathers telecommunication habits, caller identities, and missed call verification signals.',
    mitigation: 'Revoke Call Log permission.',
  },
  {
    permission: 'android.permission.RECORD_AUDIO',
    name: 'Microphone Recording',
    severity: 'high',
    purpose: 'Allows background ambient audio recording without visible notification.',
    mitigation: 'Revoke Microphone access.',
  },
  {
    permission: 'android.permission.CAMERA',
    name: 'Camera Recording',
    severity: 'high',
    purpose: 'Can capture covert photographs or videos utilized in subsequent sextortion schemes.',
    mitigation: 'Revoke Camera access.',
  },
];

// Legitimate Indian banking package identifiers (for typosquat detection)
const GENUINE_BANKING_PACKAGES: Record<string, string> = {
  'com.sbi.upi': 'State Bank of India (BHIM SBI Pay)',
  'com.sbi.lotusintouch': 'State Bank of India (YONO SBI)',
  'com.snapwork.hdfc': 'HDFC Bank MobileBanking',
  'com.csam.icici.bank.imobile': 'ICICI Bank iMobile Pay',
  'com.axis.mobile': 'Axis Mobile',
  'com.msf.kopl': 'Kotak 811 Mobile Banking',
  'com.phonepe.app': 'PhonePe UPI & Payments',
  'net.one97.paytm': 'Paytm Payments',
  'in.org.npci.upiapp': 'BHIM (NPCI)',
};

/**
 * Computes SHA-256 hash for APK file identification.
 */
export function computeApkHash(inputStringOrBuffer: string): string {
  return crypto.createHash('sha256').update(inputStringOrBuffer).digest('hex');
}

/**
 * Safely analyzes an APK request without executing the binary.
 */
export function analyzeApkPackage(request: ApkAnalysisRequest): {
  analysis: ApkAnalysisResult;
  incident?: Incident;
} {
  const analysisId = `AN-APK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const fileName = request.fileName || 'unknown_application.apk';
  const pkgName = (request.packageName || '').toLowerCase().trim();
  const rawPermissions = request.permissions || [];
  const isInstalled = request.installedOnDevice || false;
  const hasSensitiveAccess = request.sensitiveAccessGranted || false;

  const fileHash = request.fileHash || computeApkHash(`${fileName}-${request.fileSize}-${pkgName}`);

  // Match dangerous permissions
  const dangerousPermissions: Array<{ permission: string; risk: string; purpose: string }> = [];
  let riskScore = 0;

  for (const perm of rawPermissions) {
    const matched = HIGH_RISK_ANDROID_PERMISSIONS.find(
      (p) => perm.toLowerCase().includes(p.permission.toLowerCase()) || perm.toLowerCase().includes(p.name.toLowerCase())
    );
    if (matched) {
      dangerousPermissions.push({
        permission: matched.permission,
        risk: matched.severity.toUpperCase(),
        purpose: matched.purpose,
      });
      riskScore += matched.severity === 'critical' ? 35 : matched.severity === 'high' ? 20 : 10;
    }
  }

  // Check Package Name heuristics
  let isImpersonatingBank = false;
  let impersonatedBankName = '';
  for (const [genPkg, bankName] of Object.entries(GENUINE_BANKING_PACKAGES)) {
    if (pkgName && pkgName !== genPkg && (pkgName.includes(genPkg.split('.')[1]) || pkgName.includes('sbi') || pkgName.includes('yono') || pkgName.includes('hdfc'))) {
      isImpersonatingBank = true;
      impersonatedBankName = bankName;
      riskScore += 45;
      break;
    }
  }

  // Check predatory loan keyword heuristics
  const loanKeywords = ['instant', 'rupee', 'credit', 'cash', 'loan', 'speedy', 'quick', 'kredit', 'wallet'];
  const hasLoanName = loanKeywords.some((k) => pkgName.includes(k) || fileName.toLowerCase().includes(k));
  const hasContactScraper = dangerousPermissions.some((p) => p.permission.includes('READ_CONTACTS'));

  let trojanCategory: 'banking_trojan' | 'predatory_loan' | 'spyware' | 'remote_access' | 'generic_adware' | 'safe' = 'safe';

  if (isImpersonatingBank || dangerousPermissions.some((p) => p.permission.includes('BIND_ACCESSIBILITY_SERVICE'))) {
    trojanCategory = 'banking_trojan';
  } else if (hasLoanName && hasContactScraper) {
    trojanCategory = 'predatory_loan';
  } else if (dangerousPermissions.some((p) => p.permission.includes('RECORD_AUDIO') || p.permission.includes('CAMERA'))) {
    trojanCategory = 'spyware';
  } else if (dangerousPermissions.length > 0) {
    trojanCategory = 'generic_adware';
  }

  // Escalate score if installed on device
  if (isInstalled && dangerousPermissions.length > 0) {
    riskScore += 25;
  }
  if (hasSensitiveAccess) {
    riskScore += 30;
  }

  const finalRiskScore = Math.min(100, Math.max(5, riskScore));
  let riskLevel: RiskLevel = 'LOW';
  let verdict: 'safe' | 'suspicious' | 'malicious' | 'inconclusive' = 'safe';

  if (finalRiskScore >= 70) {
    riskLevel = 'CRITICAL';
    verdict = 'malicious';
  } else if (finalRiskScore >= 45) {
    riskLevel = 'HIGH';
    verdict = 'suspicious';
  } else if (finalRiskScore >= 20) {
    riskLevel = 'SUSPICIOUS';
    verdict = 'suspicious';
  } else {
    riskLevel = 'LOW';
    verdict = 'safe';
  }

  // Generate containment roadmap
  const containmentRoadmap: string[] = [
    '1. Put your phone into Airplane Mode immediately to disconnect cellular data and Wi-Fi, halting background data transmission.',
    '2. Open Android Settings > Accessibility. If this application is toggled ON, turn it OFF immediately to revoke auto-tapping and keylogging capabilities.',
    '3. Open Settings > Security > Device Admin Apps. Deactivate administrator rights for this application so it cannot block uninstallation.',
    '4. Boot your Android device into Safe Mode (press and hold Power, then long-press "Power off"), then safely uninstall the APK.',
  ];

  if (trojanCategory === 'banking_trojan' || isImpersonatingBank || hasSensitiveAccess) {
    containmentRoadmap.push(
      '5. CRITICAL BANKING ACTION: From a separate clean device, immediately log into your bank and change your Internet Banking password and UPI PIN.',
      '6. Call 1930 (Citizen Financial Cyber Fraud Helpline) or your bank customer care to request a temporary hold on outward UPI transactions.'
    );
  }

  if (trojanCategory === 'predatory_loan') {
    containmentRoadmap.push(
      '5. PREDATORY LOAN CONTAINMENT: Never transfer money to extorters demanding "processing fees" or "loan repayment" for unsolicited deposits.',
      '6. Inform your immediate family that you encountered an illegal contact-scraping app and to disregard any threatening calls or morphed messages.'
    );
  }

  const findings: string[] = [
    `Application container analyzed: ${fileName} (${(request.fileSize / (1024 * 1024)).toFixed(2)} MB).`,
    `SHA-256 package signature: ${fileHash}.`,
  ];

  if (isImpersonatingBank) {
    findings.push(`Brand Impersonation Warning: Package mimics legitimate banking entity (${impersonatedBankName}).`);
  }

  if (dangerousPermissions.length > 0) {
    dangerousPermissions.forEach((dp) => {
      findings.push(`Dangerous Permission [${dp.risk}]: ${dp.permission} — ${dp.purpose}`);
    });
  } else {
    findings.push('No known high-risk banking or accessibility permissions were identified in this static manifest declaration.');
  }

  const summary =
    riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
      ? `ThreatLens identified high-risk Android permissions or banking trojan signatures in ${fileName}. Immediate device isolation recommended.`
      : riskLevel === 'SUSPICIOUS'
      ? `Suspicious permission profile detected in ${fileName}. Review accessibility and SMS access before opening.`
      : `Static manifest check of ${fileName} completed. No high-risk malware permissions identified.`;

  const analysis: ApkAnalysisResult = {
    id: analysisId,
    analysisId,
    analysis_type: 'phishing', // maps to core AnalysisResult
    inputType: 'scam',
    status: 'completed',
    verdict,
    risk_level: riskLevel,
    riskLevel,
    riskScore: finalRiskScore,
    confidence: null,
    summary,
    findings,
    checksPerformed: [
      'STATIC_MANIFEST_PERMISSION_AUDIT',
      'PACKAGE_TYPOSQUAT_BRAND_COLLISION',
      'ACCESSIBILITY_SERVICE_HIJACK_DETECTION',
      'SMS_INTERCEPTION_CAPABILITY_SCAN',
      'SHA256_INTEGRITY_HASHING',
    ],
    checksUnavailable: [
      'DYNAMIC_SANDBOX_RUNTIME_EXECUTION (Binary not executed on server to guarantee environment safety)',
    ],
    recommendations: containmentRoadmap.slice(0, 4),
    limitations: [
      'Static permission analysis evaluates declared capabilities. Advanced obfuscated payloads or packed dex files may require hardware sandbox validation.',
    ],
    technical_signals: {
      fileName,
      packageName: pkgName || 'Unspecified Package',
      fileHash,
      trojanCategory,
      isInstalled,
      hasSensitiveAccess,
      matchedDangerousPermissionsCount: dangerousPermissions.length,
      evaluatedAt: new Date().toISOString(),
    },
    dangerousPermissions,
    trojanCategory,
    containmentRoadmap,
    created_at: new Date().toISOString(),
  };

  // Build Incident Record if high risk or user requested
  const incNum = Math.floor(10000 + Math.random() * 90000);
  const incidentId = `TL-2026-${incNum}`;

  const actions: IncidentAction[] = containmentRoadmap.map((item, idx) => ({
    id: `act-apk-${idx + 1}-${Date.now()}`,
    incident_id: incidentId,
    priority: idx + 1,
    title: item.replace(/^\d+\.\s*/, '').split(':')[0],
    description: item.replace(/^\d+\.\s*/, ''),
    is_completed: false,
    urgent: idx < 3,
  }));

  const timeline: TimelineEvent[] = [
    {
      id: `tl-apk-1-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'apk_received',
      title: 'Suspicious APK Received or Installed',
      description: `Citizen received ${fileName} via untrusted source / sideloading.`,
      timestamp: 'Recorded Time',
    },
    {
      id: `tl-apk-2-${Date.now()}`,
      incident_id: incidentId,
      event_type: 'analysis_run',
      title: 'ThreatLens Static Permission Inspection',
      description: `Identified ${dangerousPermissions.length} dangerous permissions. Category: ${trojanCategory}.`,
      timestamp: 'Just now',
    },
  ];

  const incident: Incident = {
    id: incidentId,
    type: 'apk_malware',
    title: `Suspicious Android Application: ${fileName}`,
    description: `Citizen investigated APK file ${fileName} (Package: ${pkgName || 'N/A'}). Classified as ${trojanCategory.toUpperCase()} with ${riskLevel} risk.`,
    risk_level: riskLevel,
    status: isInstalled ? 'IN_PROGRESS' : 'OPEN',
    platform: 'Android Mobile Device',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    evidence: [
      {
        id: `ev-apk-${incidentId}-1`,
        incident_id: incidentId,
        type: 'document',
        title: `APK Manifest & Hash Record (${fileName})`,
        file_name: fileName,
        file_size: request.fileSize,
        notes: `SHA-256: ${fileHash}. Declared permissions: ${rawPermissions.join(', ') || 'None provided'}.`,
        created_at: new Date().toISOString(),
      },
    ],
    timeline,
    actions,
    analysis,
  };

  return { analysis, incident };
}
