import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Incident, EvidenceItem, TimelineEvent, IncidentAction } from '../types';
import { demoIncidents } from '../utils/demoData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = 'threatlens_incidents_v1';

// Seed or retrieve incidents
export function getStoredIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read stored incidents from localStorage', err);
  }
  // Initialize with demo incidents
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoIncidents));
  return demoIncidents;
}

export function saveIncidents(incidents: Incident[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (err) {
    console.error('Failed to save incidents to localStorage', err);
  }
}

export async function fetchIncidents(): Promise<Incident[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*, evidence(*), timeline_events(*), incident_actions(*), analysis_results(*)')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          evidence: item.evidence || [],
          timeline: item.timeline_events || [],
          actions: item.incident_actions || [],
          analysis: item.analysis_results?.[0] || undefined,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local persistent store', err);
    }
  }
  return getStoredIncidents();
}

export async function fetchIncidentById(id: string): Promise<Incident | null> {
  const incidents = await fetchIncidents();
  return incidents.find(i => i.id === id) || null;
}

export async function persistIncident(incident: Incident): Promise<Incident> {
  const incidents = getStoredIncidents();
  const existingIdx = incidents.findIndex(i => i.id === incident.id);
  if (existingIdx >= 0) {
    incidents[existingIdx] = { ...incidents[existingIdx], ...incident, updated_at: new Date().toISOString() };
  } else {
    incidents.unshift(incident);
  }
  saveIncidents(incidents);

  // Sync with Supabase if online
  if (supabase) {
    try {
      await supabase.from('incidents').upsert({
        id: incident.id,
        type: incident.type,
        title: incident.title,
        description: incident.description,
        risk_level: incident.risk_level,
        status: incident.status,
        financial_loss: incident.financial_loss,
        platform: incident.platform,
        created_at: incident.created_at,
        updated_at: incident.updated_at,
      });
    } catch (err) {
      console.warn('Supabase upsert background sync notification', err);
    }
  }

  return incident;
}

export async function removeIncident(id: string): Promise<void> {
  const incidents = getStoredIncidents().filter(i => i.id !== id);
  saveIncidents(incidents);

  if (supabase) {
    try {
      await supabase.from('incidents').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete sync notification', err);
    }
  }
}

export async function toggleActionStatus(incidentId: string, actionId: string): Promise<Incident | null> {
  const incidents = getStoredIncidents();
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return null;

  incident.actions = incident.actions.map(act => {
    if (act.id === actionId) {
      return { ...act, is_completed: !act.is_completed };
    }
    return act;
  });

  // If all actions are completed, update status to RESOLVED
  const allCompleted = incident.actions.every(a => a.is_completed);
  if (allCompleted && incident.actions.length > 0) {
    incident.status = 'RESOLVED';
  } else if (incident.status === 'RESOLVED' && !allCompleted) {
    incident.status = 'IN_PROGRESS';
  }

  incident.updated_at = new Date().toISOString();
  saveIncidents(incidents);
  return incident;
}

export async function appendEvidence(incidentId: string, evidence: EvidenceItem): Promise<Incident | null> {
  const incidents = getStoredIncidents();
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return null;

  incident.evidence = incident.evidence || [];
  incident.evidence.push(evidence);
  
  // Also add a timeline event for evidence
  incident.timeline = incident.timeline || [];
  incident.timeline.push({
    id: `tl-ev-${Date.now()}`,
    incident_id: incidentId,
    event_type: 'evidence_added',
    title: 'Evidence item uploaded',
    description: `Added ${evidence.title} (${evidence.type}).`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  incident.updated_at = new Date().toISOString();
  saveIncidents(incidents);
  return incident;
}

export async function deleteEvidence(incidentId: string, evidenceId: string): Promise<Incident | null> {
  const incidents = getStoredIncidents();
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return null;

  incident.evidence = incident.evidence.filter(e => e.id !== evidenceId);
  incident.updated_at = new Date().toISOString();
  saveIncidents(incidents);
  return incident;
}

export async function appendTimelineEvent(incidentId: string, event: Omit<TimelineEvent, 'id' | 'incident_id'>): Promise<Incident | null> {
  const incidents = getStoredIncidents();
  const incident = incidents.find(i => i.id === incidentId);
  if (!incident) return null;

  incident.timeline = incident.timeline || [];
  incident.timeline.push({
    ...event,
    id: `tl-${Date.now()}`,
    incident_id: incidentId,
  });

  incident.updated_at = new Date().toISOString();
  saveIncidents(incidents);
  return incident;
}

export function resetDemoIncidents(): Incident[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoIncidents));
  return demoIncidents;
}
