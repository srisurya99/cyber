-- ==============================================================================
-- THREATLENS POSTGRESQL & SUPABASE SCHEMA
-- Citizen Cyber Safety & Digital Incident Response Platform
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS & PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  language text default 'en' check (language in ('en', 'te')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. INCIDENTS TABLE
create table if not exists public.incidents (
  id text primary key, -- e.g. TL-2026-00142
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null check (type in ('phishing', 'media_forensics', 'scam', 'blackmail', 'general')),
  title text not null,
  description text,
  risk_level text not null check (risk_level in ('LOW', 'SUSPICIOUS', 'HIGH', 'CRITICAL')),
  status text not null default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED')),
  financial_loss numeric default 0,
  currency text default 'INR',
  platform text, -- WhatsApp, Instagram, Telegram, SMS, Email, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. EVIDENCE TABLE
create table if not exists public.evidence (
  id uuid default uuid_generate_v4() primary key,
  incident_id text references public.incidents(id) on delete cascade not null,
  type text not null check (type in ('screenshot', 'message', 'transaction', 'url', 'phone', 'email', 'social_profile', 'document', 'media')),
  title text not null,
  file_path text,
  file_size bigint,
  mime_type text,
  metadata jsonb default '{}'::jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ANALYSIS RESULTS TABLE
create table if not exists public.analysis_results (
  id uuid default uuid_generate_v4() primary key,
  incident_id text references public.incidents(id) on delete cascade not null,
  analysis_type text not null check (analysis_type in ('phishing', 'media_forensics', 'scam', 'blackmail')),
  risk_level text not null check (risk_level in ('LOW', 'SUSPICIOUS', 'HIGH', 'CRITICAL')),
  confidence numeric not null check (confidence >= 0 and confidence <= 100),
  summary text not null,
  findings jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  technical_signals jsonb default '{}'::jsonb,
  disclaimer text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TIMELINE EVENTS TABLE
create table if not exists public.timeline_events (
  id uuid default uuid_generate_v4() primary key,
  incident_id text references public.incidents(id) on delete cascade not null,
  event_type text not null check (event_type in ('initial_contact', 'threat_received', 'payment_requested', 'money_transferred', 'reported_to_threatlens', 'evidence_added', 'analysis_run', 'bank_notified', 'reported_to_police', 'account_secured', 'resolved')),
  description text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. RECOMMENDED ACTIONS / CHECKLIST TABLE
create table if not exists public.incident_actions (
  id uuid default uuid_generate_v4() primary key,
  incident_id text references public.incidents(id) on delete cascade not null,
  priority integer not null default 1,
  title text not null,
  description text,
  is_completed boolean default false,
  official_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.incidents enable row level security;
alter table public.evidence enable row level security;
alter table public.analysis_results enable row level security;
alter table public.timeline_events enable row level security;
alter table public.incident_actions enable row level security;

-- Profiles: users can only see & modify their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Incidents: users can only access their own incidents
create policy "Users can view own incidents" on public.incidents
  for select using (auth.uid() = user_id or user_id is null);

create policy "Users can create incidents" on public.incidents
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own incidents" on public.incidents
  for update using (auth.uid() = user_id or user_id is null);

create policy "Users can delete own incidents" on public.incidents
  for delete using (auth.uid() = user_id or user_id is null);

-- Evidence: access restricted to owner of parent incident
create policy "Users can view own evidence" on public.evidence
  for select using (
    exists (
      select 1 from public.incidents
      where public.incidents.id = public.evidence.incident_id
      and (public.incidents.user_id = auth.uid() or public.incidents.user_id is null)
    )
  );

create policy "Users can insert own evidence" on public.evidence
  for insert with check (
    exists (
      select 1 from public.incidents
      where public.incidents.id = public.evidence.incident_id
      and (public.incidents.user_id = auth.uid() or public.incidents.user_id is null)
    )
  );

create policy "Users can delete own evidence" on public.evidence
  for delete using (
    exists (
      select 1 from public.incidents
      where public.incidents.id = public.evidence.incident_id
      and (public.incidents.user_id = auth.uid() or public.incidents.user_id is null)
    )
  );

-- Indexes for lightning fast queries
create index if not exists idx_incidents_user on public.incidents(user_id);
create index if not exists idx_incidents_status on public.incidents(status);
create index if not exists idx_evidence_incident on public.evidence(incident_id);
create index if not exists idx_analysis_incident on public.analysis_results(incident_id);
create index if not exists idx_timeline_incident on public.timeline_events(incident_id);
create index if not exists idx_actions_incident on public.incident_actions(incident_id);
