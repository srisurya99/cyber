import { Incident, IndicatorCorrelationResult, CorrelatedIncidentSummary } from '../../types';

/**
 * Extracts sanitized, normalized correlation indicators from an incident.
 */
function extractIndicatorsFromIncident(incident: Incident): Array<{ value: string; type: 'domain' | 'vpa' | 'phone' | 'apk_hash' | 'scam_phrase' }> {
  const indicators: Array<{ value: string; type: 'domain' | 'vpa' | 'phone' | 'apk_hash' | 'scam_phrase' }> = [];

  // Extract domain indicators
  if (incident.analysis?.technical_signals?.registeredDomain) {
    indicators.push({
      value: incident.analysis.technical_signals.registeredDomain.toLowerCase(),
      type: 'domain',
    });
  }

  // Extract from extracted URLs
  if (Array.isArray(incident.analysis?.technical_signals?.extractedUrls)) {
    incident.analysis.technical_signals.extractedUrls.forEach((u: string) => {
      try {
        const hostname = new URL(u.startsWith('http') ? u : `https://${u}`).hostname.toLowerCase();
        if (hostname && !indicators.some((i) => i.value === hostname)) {
          indicators.push({ value: hostname, type: 'domain' });
        }
      } catch {
        // invalid url, skip
      }
    });
  }

  // Extract APK file hashes
  if (incident.analysis?.technical_signals?.fileHash) {
    indicators.push({
      value: incident.analysis.technical_signals.fileHash.toLowerCase(),
      type: 'apk_hash',
    });
  }

  // Extract from evidence items
  if (incident.evidence) {
    incident.evidence.forEach((ev) => {
      if (ev.type === 'url' && ev.notes) {
        const domainMatch = ev.notes.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/);
        if (domainMatch && !indicators.some((i) => i.value === domainMatch[1].toLowerCase())) {
          indicators.push({ value: domainMatch[1].toLowerCase(), type: 'domain' });
        }
      }
      if (ev.type === 'phone' && ev.notes) {
        const phoneMatch = ev.notes.match(/(\+91[\d\s-]{10,13}|\b[6-9]\d{9}\b)/);
        if (phoneMatch && !indicators.some((i) => i.value === phoneMatch[1])) {
          indicators.push({ value: phoneMatch[1], type: 'phone' });
        }
      }
    });
  }

  return indicators;
}

/**
 * Evaluates an incident against the community incident repository.
 * Detects whether identical domains, phone numbers, or file hashes have appeared in other incidents.
 * Strictly preserves privacy: NEVER exposes victim identities, chat transcripts, or personal data.
 */
export function correlateIncidentIndicators(
  currentIncident: Incident,
  allIncidents: Incident[]
): IndicatorCorrelationResult {
  const currentIndicators = extractIndicatorsFromIncident(currentIncident);

  if (currentIndicators.length === 0) {
    return {
      hasCorrelation: false,
      matchedCount: 0,
      correlations: [],
      privacyPreservingNote: 'No high-confidence correlation indicators found for cross-incident analysis.',
    };
  }

  const matches: CorrelatedIncidentSummary[] = [];

  for (const other of allIncidents) {
    if (other.id === currentIncident.id) continue;

    const otherIndicators = extractIndicatorsFromIncident(other);

    for (const curInd of currentIndicators) {
      // Exclude generic or benign domains
      if (curInd.type === 'domain' && (curInd.value === 'sbi.co.in' || curInd.value === 'google.com' || curInd.value === 'onlinesbi.sbi' || curInd.value === 'cybercrime.gov.in')) {
        continue;
      }

      const foundMatch = otherIndicators.find((oi) => oi.type === curInd.type && oi.value === curInd.value);
      if (foundMatch) {
        matches.push({
          incidentId: other.id,
          matchedIndicator: curInd.value,
          indicatorType: curInd.type,
          created_at: other.created_at,
        });
        break; // Match once per other incident
      }
    }
  }

  const hasCorrelation = matches.length > 0;
  const privacyPreservingNote = hasCorrelation
    ? `Possible relationship detected: ${matches.length} other incident report(s) in the database share sanitized technical indicators (${Array.from(new Set(matches.map((m) => m.matchedIndicator))).join(', ')}). Victim identities and personal information remain strictly confidential.`
    : 'No correlated campaign indicators identified across known reports.';

  return {
    hasCorrelation,
    matchedCount: matches.length,
    correlations: matches,
    privacyPreservingNote,
  };
}
