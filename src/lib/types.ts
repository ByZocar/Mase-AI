export type LeadSegment =
  | "founder_young"
  | "founder_scaleup"
  | "vp_sales"
  | "cfo"
  | "other";

export type JourneyStage =
  | "latent_pain"
  | "active_frustration"
  | "searching"
  | "evaluating"
  | "closing"
  | "won"
  | "lost";

export type ChannelType =
  | "linkedin_dm"
  | "linkedin_voice"
  | "whatsapp_text"
  | "whatsapp_voice"
  | "email"
  | "twitter_dm"
  | "twitter_engage";

export type ConversationStatus =
  | "active"
  | "paused"
  | "human_takeover"
  | "closed_won"
  | "closed_lost";

export type MessageDirection = "outbound" | "inbound";
export type MessageSender = "ai" | "human" | "lead";
export type ContentMediaType = "text" | "audio" | "video" | "image";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type ContentPlatform = "linkedin" | "twitter" | "blog";
export type ContentFormat = "carousel" | "single_post" | "thread" | "article";
export type ContentStatus = "draft" | "scheduled" | "published";

export type PainPoint = {
  text: string;
  severity: "low" | "medium" | "high" | "critical";
  evidence?: string;
  source?: string;
};

export type RecentActivity = {
  type: "post" | "comment" | "share" | "reaction" | "news";
  url?: string;
  text: string;
  timestamp?: string;
  engagement?: { likes?: number; comments?: number; reposts?: number };
};

export type Company = {
  id: string;
  name: string;
  domain?: string | null;
  linkedin_url?: string | null;
  size_band?: string | null;
  industry?: string | null;
  country?: string | null;
  monthly_invoices?: number | null;
  tech_stack?: string[];
  funding_stage?: string | null;
  last_funding_amount?: number | null;
  last_funding_date?: string | null;
  signals?: Record<string, unknown>;
  enriched_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  full_name: string;
  first_name?: string | null;
  last_name?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  phone?: string | null;
  twitter_handle?: string | null;
  company_id?: string | null;
  company_name?: string | null;
  role?: string | null;
  seniority?: string | null;
  segment: LeadSegment;
  journey_stage: JourneyStage;
  intent_score: number;
  pain_points: PainPoint[];
  preferred_channels: ChannelType[];
  recent_activity: RecentActivity[];
  enriched_data?: Record<string, unknown>;
  discovered_via?: string | null;
  discovered_at: string;
  enriched_at?: string | null;
  last_contacted_at?: string | null;
  raw_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: string;
  name: string;
  target_segment?: LeadSegment | null;
  target_country?: string[];
  target_industries?: string[];
  messaging_strategy?: Record<string, unknown>;
  sequence?: SequenceStep[];
  status: CampaignStatus;
  metrics?: Record<string, number>;
  created_at: string;
  updated_at: string;
};

export type SequenceStep = {
  step: number;
  channel: ChannelType;
  delay_hours: number;
  template_id?: string;
  instructions: string;
};

export type Conversation = {
  id: string;
  lead_id: string;
  campaign_id?: string | null;
  channel: ChannelType;
  status: ConversationStatus;
  current_sequence_step: number;
  next_action_at?: string | null;
  last_message_at?: string | null;
  assigned_to?: string | null;
  human_takeover_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  sender: MessageSender;
  content_type: ContentMediaType;
  content?: string | null;
  audio_url?: string | null;
  video_url?: string | null;
  image_url?: string | null;
  transcript?: string | null;
  sentiment?: string | null;
  intent_detected?: string | null;
  llm_reasoning?: string | null;
  variant_id?: string | null;
  sent_at?: string | null;
  delivered_at?: string | null;
  read_at?: string | null;
  replied_at?: string | null;
  created_at: string;
};

export type ContentPost = {
  id: string;
  platform: ContentPlatform;
  title?: string | null;
  body: string;
  format: ContentFormat;
  based_on_pain_points: string[];
  based_on_leads: string[];
  hashtags: string[];
  media_urls: string[];
  status: ContentStatus;
  scheduled_at?: string | null;
  published_at?: string | null;
  external_post_id?: string | null;
  engagement_stats?: Record<string, number>;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  event_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  payload: Record<string, unknown>;
  created_at: string;
};

export const SEGMENT_LABELS: Record<LeadSegment, string> = {
  founder_young: "Founder 25-35",
  founder_scaleup: "Scale-up Founder",
  vp_sales: "VP / Director Ventas",
  cfo: "CFO / Finance",
  other: "Other",
};

export const STAGE_LABELS: Record<JourneyStage, string> = {
  latent_pain: "Dolor latente",
  active_frustration: "Frustración activa",
  searching: "Buscando",
  evaluating: "Evaluando",
  closing: "Cerrando",
  won: "Ganado",
  lost: "Perdido",
};

export const STAGE_COLORS: Record<JourneyStage, string> = {
  latent_pain: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  active_frustration: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  searching: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  evaluating: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  closing: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  won: "bg-emerald-500/25 text-emerald-200 border-emerald-500/50",
  lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export const SEGMENT_COLORS: Record<LeadSegment, string> = {
  founder_young: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  founder_scaleup: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  vp_sales: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  cfo: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  other: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  linkedin_dm: "LinkedIn DM",
  linkedin_voice: "LinkedIn Voice",
  whatsapp_text: "WhatsApp",
  whatsapp_voice: "WhatsApp Voice",
  email: "Email",
  twitter_dm: "Twitter DM",
  twitter_engage: "Twitter Engage",
};
