-- =============================================================================
-- ZOLVO ENGINE - DATABASE SCHEMA
-- Version: 0001 (initial)
-- =============================================================================

-- ------------------------- Extensions -------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ------------------------- Enums -------------------------
do $$ begin
  create type lead_segment as enum (
    'founder_young', 'founder_scaleup', 'vp_sales', 'cfo', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type journey_stage as enum (
    'latent_pain', 'active_frustration', 'searching', 'evaluating', 'closing', 'won', 'lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type channel_type as enum (
    'linkedin_dm', 'linkedin_voice', 'whatsapp_text', 'whatsapp_voice',
    'email', 'twitter_dm', 'twitter_engage'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type conversation_status as enum (
    'active', 'paused', 'human_takeover', 'closed_won', 'closed_lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_direction as enum ('outbound', 'inbound');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_sender as enum ('ai', 'human', 'lead');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_type as enum ('text', 'audio', 'video', 'image');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status as enum ('draft', 'active', 'paused', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_platform as enum ('linkedin', 'twitter', 'blog');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_format as enum ('carousel', 'single_post', 'thread', 'article');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft', 'scheduled', 'published');
exception when duplicate_object then null; end $$;

-- ------------------------- Companies -------------------------
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text unique,
  linkedin_url text unique,
  size_band text,
  industry text,
  country text,
  monthly_invoices int,
  tech_stack text[] default '{}',
  funding_stage text,
  last_funding_amount numeric,
  last_funding_date date,
  signals jsonb default '{}'::jsonb,
  enriched_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_companies_country on companies(country);
create index if not exists idx_companies_industry on companies(industry);

-- ------------------------- Leads -------------------------
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  first_name text,
  last_name text,
  linkedin_url text unique,
  email text,
  phone text,
  twitter_handle text,
  company_id uuid references companies(id) on delete set null,
  company_name text,
  role text,
  seniority text,
  segment lead_segment default 'other',
  journey_stage journey_stage default 'latent_pain',
  intent_score int default 0 check (intent_score >= 0 and intent_score <= 100),
  pain_points jsonb default '[]'::jsonb,
  preferred_channels text[] default '{}',
  recent_activity jsonb default '[]'::jsonb,
  enriched_data jsonb default '{}'::jsonb,
  discovered_via text,
  discovered_at timestamptz default now(),
  enriched_at timestamptz,
  last_contacted_at timestamptz,
  raw_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_leads_segment on leads(segment);
create index if not exists idx_leads_journey on leads(journey_stage);
create index if not exists idx_leads_intent on leads(intent_score desc);
create index if not exists idx_leads_company on leads(company_id);
create index if not exists idx_leads_created on leads(created_at desc);

-- ------------------------- Campaigns -------------------------
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  target_segment lead_segment,
  target_country text[] default '{}',
  target_industries text[] default '{}',
  messaging_strategy jsonb default '{}'::jsonb,
  sequence jsonb default '[]'::jsonb,
  status campaign_status default 'draft',
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------- Conversations -------------------------
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references leads(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  channel channel_type not null,
  status conversation_status default 'active',
  current_sequence_step int default 0,
  next_action_at timestamptz,
  last_message_at timestamptz,
  assigned_to uuid,
  human_takeover_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_conv_lead on conversations(lead_id);
create index if not exists idx_conv_status on conversations(status);
create index if not exists idx_conv_next_action on conversations(next_action_at) where status = 'active';

-- ------------------------- Messages -------------------------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction message_direction not null,
  sender message_sender not null,
  content_type content_type default 'text',
  content text,
  audio_url text,
  video_url text,
  image_url text,
  transcript text,
  sentiment text,
  intent_detected text,
  llm_reasoning text,
  variant_id text,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_msg_conv on messages(conversation_id, created_at desc);
create index if not exists idx_msg_unread on messages(conversation_id) where direction = 'inbound' and read_at is null;

-- ------------------------- Content Posts -------------------------
create table if not exists content_posts (
  id uuid primary key default uuid_generate_v4(),
  platform content_platform not null,
  title text,
  body text not null,
  format content_format default 'single_post',
  based_on_pain_points jsonb default '[]'::jsonb,
  based_on_leads uuid[] default '{}',
  hashtags text[] default '{}',
  media_urls text[] default '{}',
  status content_status default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  engagement_stats jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_content_status on content_posts(status);
create index if not exists idx_content_scheduled on content_posts(scheduled_at);

-- ------------------------- Events (audit log) -------------------------
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_events_entity on events(entity_type, entity_id);
create index if not exists idx_events_type on events(event_type, created_at desc);

-- ------------------------- Voice Generations Cache -------------------------
create table if not exists voice_generations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  script text not null,
  voice_id text not null,
  audio_url text not null,
  duration_seconds numeric,
  cost_credits int,
  created_at timestamptz default now()
);

-- ------------------------- Pain Points Library -------------------------
create table if not exists pain_points_library (
  id uuid primary key default uuid_generate_v4(),
  pain_point text not null,
  segment lead_segment,
  industry text,
  frequency_count int default 1,
  example_quotes jsonb default '[]'::jsonb,
  related_lead_ids uuid[] default '{}',
  last_seen_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ------------------------- Triggers: updated_at -------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_companies_updated on companies;
create trigger trg_companies_updated before update on companies for each row execute function set_updated_at();

drop trigger if exists trg_leads_updated on leads;
create trigger trg_leads_updated before update on leads for each row execute function set_updated_at();

drop trigger if exists trg_campaigns_updated on campaigns;
create trigger trg_campaigns_updated before update on campaigns for each row execute function set_updated_at();

drop trigger if exists trg_conversations_updated on conversations;
create trigger trg_conversations_updated before update on conversations for each row execute function set_updated_at();

drop trigger if exists trg_content_updated on content_posts;
create trigger trg_content_updated before update on content_posts for each row execute function set_updated_at();

-- ------------------------- Storage Bucket for audios -------------------------
insert into storage.buckets (id, name, public)
values ('voice-notes', 'voice-notes', true)
on conflict (id) do nothing;

-- ------------------------- Realtime publication -------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table events;
