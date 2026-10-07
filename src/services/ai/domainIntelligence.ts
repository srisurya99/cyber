import { parse } from 'tldts';
import { AnalysisFinding, RiskLevel } from '../../types';

export interface DomainInspectionResult {
  rawInput: string;
  normalizedUrl: string | null;
  isValidUrl: boolean;
  scheme: string | null;
  hostname: string | null;
  registeredDomain: string | null;
  publicSuffix: string | null;
  subdomain: string | null;
  isOfficialDomain: boolean;
  officialOrgName?: string;
  isIpAddress: boolean;
  isInternalOrPrivateIp: boolean;
  isShortener: boolean;
  isLookalikeOrTyposquat: boolean;
  hasSubdomainImpersonation: boolean;
  hasSuspiciousEncoding: boolean;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdict: 'safe' | 'suspicious' | 'malicious' | 'inconclusive';
  findings: AnalysisFinding[];
  checksPerformed: string[];
  checksUnavailable: string[];
  recommendations: string[];
  limitations: string[];
}

// Known official banking, regulatory, and public portals
const OFFICIAL_INSTITUTION_REGISTRY: Record<string, { org: string; domains: string[] }> = {
  sbi: {
    org: 'State Bank of India (SBI)',
    domains: ['sbi.co.in', 'onlinesbi.sbi', 'sbi.bank.in', 'statebankofindia.com', 'sbicard.com'],
  },
  hdfc: {
    org: 'HDFC Bank',
    domains: ['hdfcbank.com', 'hdfc.com', 'hdfcbank.net'],
  },
  icici: {
    org: 'ICICI Bank',
    domains: ['icicibank.com', 'icicidirect.com'],
  },
  axis: {
    org: 'Axis Bank',
    domains: ['axisbank.com', 'axisb.in'],
  },
  kotak: {
    org: 'Kotak Mahindra Bank',
    domains: ['kotak.com', 'kotakbank.com'],
  },
  pnb: {
    org: 'Punjab National Bank',
    domains: ['pnbindia.in', 'pnb.bank.in'],
  },
  bob: {
    org: 'Bank of Baroda',
    domains: ['bankofbaroda.in', 'bob.bank.in'],
  },
  canara: {
    org: 'Canara Bank',
    domains: ['canarabank.com'],
  },
  rbi: {
    org: 'Reserve Bank of India (RBI)',
    domains: ['rbi.org.in'],
  },
  incometax: {
    org: 'Income Tax Department (Govt of India)',
    domains: ['incometax.gov.in', 'tin-nsdl.com', 'protean-tin.com'],
  },
  cybercrime: {
    org: 'National Cyber Crime Reporting Portal (MHA)',
    domains: ['cybercrime.gov.in', 'mha.gov.in'],
  },
  uidai: {
    org: 'Unique Identification Authority of India (Aadhaar)',
    domains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
  },
  gov_in: {
    org: 'Government of India Official Portal',
    domains: ['gov.in', 'nic.in', 'sancharsaathi.gov.in', 'digitalindia.gov.in', 'mygov.in'],
  },
  paytm: {
    org: 'Paytm (One97 Communications)',
    domains: ['paytm.com', 'paytmbank.com'],
  },
  phonepe: {
    org: 'PhonePe',
    domains: ['phonepe.com'],
  },
  google: {
    org: 'Google',
    domains: ['google.com', 'google.co.in', 'gstatic.com', 'googleusercontent.com'],
  },
  microsoft: {
    org: 'Microsoft',
    domains: ['microsoft.com', 'live.com', 'office.com', 'windows.com'],
  },
  amazon: {
    org: 'Amazon',
    domains: ['amazon.in', 'amazon.com', 'media-amazon.com'],
  },
  apple: {
    org: 'Apple',
    domains: ['apple.com', 'icloud.com'],
  },
};

// Known URL Shortener Domains
const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'cutt.ly',
  'rb.gy',
  'shorte.st',
  'rebrand.ly',
  'trib.al',
  'linktr.ee',
]);

// Target brands that attackers commonly spoof
const MONITORED_BRAND_TOKENS = [
  'sbi',
  'onlinesbi',
  'hdfc',
  'icici',
  'axisbank',
  'kotak',
  'pnb',
  'baroda',
  'rbi',
  'incometax',
  'kyc',
  'aadhaar',
  'panupdate',
  'refund',
  'ebill',
  'electricity',
  'bsnl',
  'jio',
  'airtel',
  'paytm',
  'phonepe',
];

// High-abuse top-level domains frequently observed in disposable phishing campaigns
const HIGH_ABUSE_TLDS = new Set([
  'xyz',
  'top',
  'club',
  'work',
  'click',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'buzz',
  'icu',
  'cfd',
  'rest',
  'sbs',
  'monster',
  'surf',
]);

// Private and internal IP ranges to prevent SSRF
function isPrivateOrInternalIp(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
    return true;
  }
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = parseInt(ipv4Match[1], 10);
    const b = parseInt(ipv4Match[2], 10);
    // 10.0.0.0/8
    if (a === 10) return true;
    // 127.0.0.0/8
    if (a === 127) return true;
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local / cloud metadata)
    if (a === 169 && b === 254) return true;
  }
  return false;
}

/**
 * Safely inspects a URL or domain string.
 * Never executes remote HTTP fetches to avoid SSRF and tracking traps.
 */
export function inspectUrlOrDomain(input: string): DomainInspectionResult {
  const trimmed = (input || '').trim();
  const checksPerformed = [
    'URL_SYNTAX_VALIDATION',
    'PUBLIC_SUFFIX_EXTRACTION',
    'AUTHORITATIVE_REGISTRY_MATCH',
    'SSRF_IP_BOUNDARY_CHECK',
    'HOMOGLYPH_PUNYCODE_DETECTION',
    'SUBDOMAIN_DECEPTION_INSPECTION',
    'TYPOSQUAT_BRAND_COLLISION',
    'SUSPICIOUS_TLD_EVALUATION',
  ];
  const checksUnavailable = [
    'LIVE_REMOTE_PAGE_CRAWL (Disabled to prevent SSRF and citizen IP disclosure)',
    'EXTERNAL_PAID_REPUTATION_API (No external commercial threat-feed token configured)',
  ];
  const recommendations: string[] = [];
  const limitations = [
    'Domain reputation evaluates structural provenance and authoritative registrations. It does not inspect dynamically served client-side JavaScript.',
    'An official-domain match confirms infrastructure authenticity, but users should never enter credentials if directed to third-party forms.',
  ];

  if (!trimmed) {
    return {
      rawInput: input,
      normalizedUrl: null,
      isValidUrl: false,
      scheme: null,
      hostname: null,
      registeredDomain: null,
      publicSuffix: null,
      subdomain: null,
      isOfficialDomain: false,
      isIpAddress: false,
      isInternalOrPrivateIp: false,
      isShortener: false,
      isLookalikeOrTyposquat: false,
      hasSubdomainImpersonation: false,
      hasSuspiciousEncoding: false,
      riskScore: 0,
      riskLevel: 'INCONCLUSIVE',
      verdict: 'inconclusive',
      findings: [
        {
          code: 'EMPTY_INPUT',
          title: 'Empty URL Submitted',
          description: 'No URL or domain string was provided for inspection.',
          source: 'input-validator',
          status: 'informational',
          severity: 'low',
        },
      ],
      checksPerformed,
      checksUnavailable,
      recommendations: ['Please enter a valid web address (e.g., https://sbi.co.in).'],
      limitations,
    };
  }

  // Handle URL normalization
  let candidateUrl = trimmed;
  let hasExplicitScheme = false;

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidateUrl)) {
    hasExplicitScheme = true;
  } else {
    // If user entered sbi.co.in or www.sbi.co.in, default to https
    candidateUrl = `https://${candidateUrl}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidateUrl);
  } catch {
    return {
      rawInput: input,
      normalizedUrl: null,
      isValidUrl: false,
      scheme: null,
      hostname: null,
      registeredDomain: null,
      publicSuffix: null,
      subdomain: null,
      isOfficialDomain: false,
      isIpAddress: false,
      isInternalOrPrivateIp: false,
      isShortener: false,
      isLookalikeOrTyposquat: false,
      hasSubdomainImpersonation: false,
      hasSuspiciousEncoding: false,
      riskScore: 60,
      riskLevel: 'SUSPICIOUS',
      verdict: 'suspicious',
      findings: [
        {
          code: 'MALFORMED_URL_SYNTAX',
          title: 'Malformed or Obfuscated Web Address',
          description: `The input "${trimmed}" does not follow RFC 3986 standard URI syntax. Phishers frequently distribute malformed or control-character links to bypass automated filters.`,
          source: 'syntax-validator',
          status: 'confirmed',
          severity: 'suspicious',
        },
      ],
      checksPerformed,
      checksUnavailable,
      recommendations: ['Do not visit this link; malformed URLs frequently indicate obfuscation or injection attempts.'],
      limitations,
    };
  }

  const scheme = parsed.protocol.toLowerCase();
  const hostname = parsed.hostname.toLowerCase();
  const findings: AnalysisFinding[] = [];
  let riskScore = 0;

  // 1. SSRF and IP address detection
  const isInternal = isPrivateOrInternalIp(hostname);
  const isDirectIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith('[') || hostname.includes(':');

  if (isInternal) {
    findings.push({
      code: 'SSRF_INTERNAL_DESTINATION_BLOCKED',
      title: 'Restricted Internal IP / Localhost Address',
      description: `The destination "${hostname}" resolves to a private, loopback, or cloud-metadata network space. Legitimate financial institutions and public services never direct consumers to private IP spaces.`,
      source: 'ssrf-guard',
      status: 'confirmed',
      severity: 'critical',
    });
    return {
      rawInput: input,
      normalizedUrl: parsed.toString(),
      isValidUrl: true,
      scheme,
      hostname,
      registeredDomain: hostname,
      publicSuffix: null,
      subdomain: null,
      isOfficialDomain: false,
      isIpAddress: true,
      isInternalOrPrivateIp: true,
      isShortener: false,
      isLookalikeOrTyposquat: false,
      hasSubdomainImpersonation: false,
      hasSuspiciousEncoding: false,
      riskScore: 95,
      riskLevel: 'CRITICAL',
      verdict: 'malicious',
      findings,
      checksPerformed,
      checksUnavailable,
      recommendations: [
        'Block and discard this link immediately.',
        'This URL attempts to target internal infrastructure or local device endpoints.',
      ],
      limitations,
    };
  }

  if (isDirectIp) {
    riskScore += 50;
    findings.push({
      code: 'DIRECT_IP_HOST',
      title: 'Direct Numerical IP Host Address',
      description: `The link directs to raw IP address "${hostname}" instead of an authenticated domain name. Legitimate corporate banks utilize verified DNS domains with verified SSL certificates.`,
      source: 'network-inspector',
      status: 'confirmed',
      severity: 'high',
    });
  }

  // 2. Scheme security check
  if (scheme !== 'https:' && scheme !== 'http:') {
    riskScore += 45;
    findings.push({
      code: 'NON_WEB_SCHEME',
      title: `Unusual Protocol Scheme (${scheme})`,
      description: `The URL uses a non-standard protocol "${scheme}". Non-HTTP schemes can trigger native application handlers or local execution.`,
      source: 'protocol-inspector',
      status: 'confirmed',
      severity: 'high',
    });
  } else if (scheme === 'http:') {
    riskScore += 20;
    findings.push({
      code: 'INSECURE_HTTP_SCHEME',
      title: 'Unencrypted HTTP Connection (No TLS)',
      description: 'The URL uses unencrypted plain "http://". Modern financial institutions mandate HTTPS with Transport Layer Security (TLS) across all consumer services.',
      source: 'transport-inspector',
      status: 'confirmed',
      severity: 'suspicious',
    });
  }

  // 3. Userinfo / @ symbol deception check
  if (parsed.username || parsed.password) {
    riskScore += 65;
    findings.push({
      code: 'USERINFO_CREDENTIAL_SPOOF',
      title: 'Embedded Credentials / @ Character Spoofing',
      description: 'The URL contains userinfo credentials before an "@" symbol. This technique is commonly used to deceive users into believing they are visiting the brand displayed before the "@".',
      source: 'syntax-inspector',
      status: 'confirmed',
      severity: 'critical',
    });
  }

  // 4. Public Suffix Domain Extraction via tldts
  const parsedTld = parse(hostname);
  const registeredDomain = parsedTld.domain ? parsedTld.domain.toLowerCase() : hostname;
  const publicSuffix = parsedTld.publicSuffix ? parsedTld.publicSuffix.toLowerCase() : null;
  const subdomain = parsedTld.subdomain ? parsedTld.subdomain.toLowerCase() : '';
  const domainWithoutSuffix = parsedTld.domainWithoutSuffix ? parsedTld.domainWithoutSuffix.toLowerCase() : '';

  // 5. Official Domain Registry Verification
  let isOfficialDomain = false;
  let officialOrgName: string | undefined;

  for (const [key, registry] of Object.entries(OFFICIAL_INSTITUTION_REGISTRY)) {
    const isMatch = registry.domains.some((d) => registeredDomain === d || registeredDomain.endsWith(`.${d}`));
    if (isMatch) {
      isOfficialDomain = true;
      officialOrgName = registry.org;
      break;
    }
  }

  // If verified official domain
  if (isOfficialDomain) {
    findings.push({
      code: 'VERIFIED_OFFICIAL_DOMAIN',
      title: `Verified Official Infrastructure: ${officialOrgName}`,
      description: `The registered domain "${registeredDomain}" is an authenticated, official institutional domain belonging to ${officialOrgName}.`,
      source: 'official-registry',
      status: 'confirmed',
      severity: 'low',
    });

    // Check if there are suspicious query parameters or open-redirect signatures
    const openRedirectParams = ['redirect', 'url', 'return', 'next', 'dest', 'target', 'link'];
    let hasSuspiciousRedirectParam = false;
    for (const [paramKey, paramVal] of parsed.searchParams.entries()) {
      if (openRedirectParams.includes(paramKey.toLowerCase()) && /^https?:\/\//i.test(paramVal)) {
        hasSuspiciousRedirectParam = true;
        findings.push({
          code: 'POTENTIAL_OPEN_REDIRECT',
          title: 'External Open-Redirect Query Parameter Detected',
          description: `While the host domain is official, the URL parameter "${paramKey}=${paramVal.slice(0, 40)}..." redirects to a secondary external location. Verify the secondary target carefully.`,
          source: 'url-parameters',
          status: 'suspected',
          severity: 'suspicious',
        });
        break;
      }
    }

    const finalRiskScore = hasSuspiciousRedirectParam ? 30 : scheme === 'https:' ? 5 : 15;
    const finalRiskLevel: RiskLevel = hasSuspiciousRedirectParam ? 'SUSPICIOUS' : 'LOW';
    const finalVerdict = hasSuspiciousRedirectParam ? 'suspicious' : 'safe';

    recommendations.push(
      `This address matches the genuine web portal of ${officialOrgName}.`,
      'Always verify that your browser lock icon displays a valid certificate issued to the institution before entering credentials.',
    );

    return {
      rawInput: input,
      normalizedUrl: parsed.toString(),
      isValidUrl: true,
      scheme,
      hostname,
      registeredDomain,
      publicSuffix,
      subdomain,
      isOfficialDomain: true,
      officialOrgName,
      isIpAddress: isDirectIp,
      isInternalOrPrivateIp: false,
      isShortener: false,
      isLookalikeOrTyposquat: false,
      hasSubdomainImpersonation: false,
      hasSuspiciousEncoding: false,
      riskScore: finalRiskScore,
      riskLevel: finalRiskLevel,
      verdict: finalVerdict,
      findings,
      checksPerformed,
      checksUnavailable,
      recommendations,
      limitations,
    };
  }

  // 6. URL Shortener Detection
  const isShortener = URL_SHORTENERS.has(registeredDomain);
  if (isShortener) {
    riskScore += 35;
    findings.push({
      code: 'OBSCURED_URL_SHORTENER',
      title: 'Link Shortening Service Used',
      description: `The destination "${registeredDomain}" is a public link shortener. Shortened URLs hide the actual recipient server, making it impossible to verify the genuine destination without resolution.`,
      source: 'shortener-detector',
      status: 'confirmed',
      severity: 'suspicious',
    });
    recommendations.push('Do NOT input banking or identity credentials on shortened links without expanding them first.');
  }

  // 7. Subdomain Impersonation Analysis (e.g. sbi.co.in.attacker.xyz)
  let hasSubdomainImpersonation = false;
  if (subdomain) {
    for (const brand of MONITORED_BRAND_TOKENS) {
      if (subdomain.includes(brand)) {
        hasSubdomainImpersonation = true;
        riskScore += 55;
        findings.push({
          code: 'SUBDOMAIN_IMPERSONATION',
          title: `Brand Mimicry in Subdomain (${brand.toUpperCase()})`,
          description: `The prefix "${subdomain}" mimics a trusted organization, but the actual registered domain receiving your data is "${registeredDomain}". This is a primary phishing technique.`,
          source: 'subdomain-analyzer',
          status: 'confirmed',
          severity: 'critical',
        });
        break;
      }
    }
  }

  // 8. Typosquatting and Lookalike Domain Analysis (e.g. sbi-kyc-portal.in)
  let isLookalikeOrTyposquat = false;
  if (!isOfficialDomain && domainWithoutSuffix) {
    for (const brand of MONITORED_BRAND_TOKENS) {
      if (domainWithoutSuffix.includes(brand)) {
        isLookalikeOrTyposquat = true;
        riskScore += 45;
        findings.push({
          code: 'TYPOSQUAT_BRAND_COLLISION',
          title: `Unauthorized Lookalike Domain (${brand.toUpperCase()})`,
          description: `The domain "${registeredDomain}" contains brand name "${brand}" but is NOT an authorized portal registered by the legitimate organization.`,
          source: 'typosquat-engine',
          status: 'confirmed',
          severity: 'high',
        });
        break;
      }
    }
  }

  // 9. Punycode / IDN Homoglyph Attack (e.g. xn--...)
  let hasSuspiciousEncoding = false;
  if (hostname.startsWith('xn--') || /[^\u0000-\u007F]/.test(hostname)) {
    hasSuspiciousEncoding = true;
    riskScore += 40;
    findings.push({
      code: 'IDN_PUNYCODE_HOMOGLYPH',
      title: 'Internationalized Domain Name (Punycode / Homoglyph)',
      description: `The host "${hostname}" uses Unicode or Punycode encoding. Attackers frequently use visually indistinguishable foreign alphabet letters (such as Cyrillic "а") to spoof English domains.`,
      source: 'homoglyph-detector',
      status: 'confirmed',
      severity: 'high',
    });
  }

  // 10. High-Abuse / Suspicious TLD check
  if (publicSuffix && HIGH_ABUSE_TLDS.has(publicSuffix)) {
    riskScore += 25;
    findings.push({
      code: 'HIGH_ABUSE_TLD',
      title: `High-Risk Top Level Domain (.${publicSuffix})`,
      description: `The domain extension ".${publicSuffix}" is statistically associated with disposable domain registration and malicious phishing infrastructure.`,
      source: 'tld-intelligence',
      status: 'suspected',
      severity: 'suspicious',
    });
  }

  // 11. Suspicious Path & Query Keywords (e.g. /update-pan, /verify-kyc, /login)
  const pathAndQuery = (parsed.pathname + parsed.search).toLowerCase();
  const suspiciousPathTokens = ['update-pan', 'kyc', 'verify', 'account-blocked', 'claim', 'refund', 'login-now', 'ebill'];
  const matchedPathTokens = suspiciousPathTokens.filter((token) => pathAndQuery.includes(token));

  if (matchedPathTokens.length > 0 && (isLookalikeOrTyposquat || hasSubdomainImpersonation || isShortener || isDirectIp)) {
    riskScore += 20;
    findings.push({
      code: 'PHISHING_PATH_CREDENTIAL_HARVEST',
      title: 'Credential Solicitation Path Signature',
      description: `URL path solicits sensitive verification actions: ${matchedPathTokens.join(', ')}`,
      source: 'heuristic-path-scanner',
      status: 'confirmed',
      severity: 'high',
    });
  }

  // Determine overall risk score and level
  const finalRiskScore = Math.min(100, Math.max(0, riskScore));
  let finalRiskLevel: RiskLevel = 'LOW';
  let finalVerdict: 'safe' | 'suspicious' | 'malicious' | 'inconclusive' = 'safe';

  if (finalRiskScore >= 70) {
    finalRiskLevel = 'CRITICAL';
    finalVerdict = 'malicious';
    recommendations.push(
      'Do NOT click or enter any information on this website.',
      'Never input NetBanking credentials, OTP, or UPI PIN on unverified domains.',
      'Report this URL to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930.',
    );
  } else if (finalRiskScore >= 40) {
    finalRiskLevel = 'HIGH';
    finalVerdict = 'suspicious';
    recommendations.push(
      'Exercise high caution. This address exhibits multiple deceptive markers commonly found in phishing campaigns.',
      'Confirm directly with the official organization through their verified phone number or physical card contact.',
    );
  } else if (finalRiskScore >= 20) {
    finalRiskLevel = 'SUSPICIOUS';
    finalVerdict = 'suspicious';
    recommendations.push(
      'Exercise caution before providing any information.',
      'Inspect the full domain name in your browser address bar to verify ownership.',
    );
  } else {
    finalRiskLevel = 'LOW';
    finalVerdict = 'safe';
    findings.push({
      code: 'NO_CRITICAL_URL_ANOMALIES',
      title: 'No Explicit Impersonation Signatures',
      description: `Domain "${registeredDomain}" does not exhibit known brand-typosquatting or homoglyph spoofing signatures.`,
      source: 'threatlens-heuristics',
      status: 'informational',
      severity: 'low',
    });
    recommendations.push(
      'Standard cyber hygiene: Verify that the website presents a valid TLS certificate matching the organization before entering sensitive personal credentials.',
    );
  }

  return {
    rawInput: input,
    normalizedUrl: parsed.toString(),
    isValidUrl: true,
    scheme,
    hostname,
    registeredDomain,
    publicSuffix,
    subdomain,
    isOfficialDomain: false,
    isIpAddress: isDirectIp,
    isInternalOrPrivateIp: false,
    isShortener,
    isLookalikeOrTyposquat,
    hasSubdomainImpersonation,
    hasSuspiciousEncoding,
    riskScore: finalRiskScore,
    riskLevel: finalRiskLevel,
    verdict: finalVerdict,
    findings,
    checksPerformed,
    checksUnavailable,
    recommendations,
    limitations,
  };
}
