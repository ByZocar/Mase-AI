import { supabaseAdmin } from "../supabase/admin";
import {
  buildDemoProfiles,
  searchLinkedInPeople,
  type ApifyLinkedInProfile,
} from "../scraping/apify";
import { findHiringSignals, researchCompany } from "../scraping/valueserp";
import type { Lead } from "../types";

export type DiscoveryConfig = {
  query: string;
  countries?: string[];
  maxResults?: number;
  useDemoData?: boolean;
};

export type DiscoveredLead = {
  lead: Pick<
    Lead,
    | "id"
    | "full_name"
    | "linkedin_url"
    | "role"
    | "company_name"
    | "intent_score"
    | "discovered_via"
  > & {
    recent_activity: { text: string; type: string }[];
    raw_profile: ApifyLinkedInProfile;
  };
  hiring_signals_count: number;
  news_count: number;
};

export async function discoverLeads(
  config: DiscoveryConfig
): Promise<DiscoveredLead[]> {
  let profiles: ApifyLinkedInProfile[] = [];

  if (config.useDemoData) {
    profiles = buildDemoProfiles();
  } else {
    try {
      profiles = await searchLinkedInPeople({
        search: config.query,
        maxResults: config.maxResults ?? 10,
      });
      if (profiles.length === 0) {
        profiles = buildDemoProfiles();
      }
    } catch (err) {
      console.warn("Apify search failed, falling back to demo data:", err);
      profiles = buildDemoProfiles();
    }
  }

  const results: DiscoveredLead[] = [];

  for (const p of profiles) {
    if (!p.fullName) continue;

    const initialScore = computeInitialIntent(p);

    const recent = (p.recent_posts || []).map((r) => ({
      text: r.text,
      type: "post",
    }));

    let hiringCount = 0;
    let newsCount = 0;

    if (p.companyName && !config.useDemoData) {
      try {
        const [hiring, research] = await Promise.all([
          findHiringSignals(p.companyName),
          researchCompany(p.companyName, p.country),
        ]);
        hiringCount = hiring.length;
        newsCount = research.news.length;
      } catch {
        // ignore enrichment errors
      }
    } else if (config.useDemoData) {
      hiringCount = Math.floor(Math.random() * 4);
      newsCount = Math.floor(Math.random() * 6);
    }

    const intent_score = Math.min(
      100,
      initialScore + hiringCount * 8 + newsCount * 2
    );

    const insertPayload = {
      full_name: p.fullName,
      first_name: p.firstName ?? null,
      last_name: p.lastName ?? null,
      linkedin_url: p.url ?? null,
      role: p.jobTitle || p.headline || null,
      company_name: p.companyName ?? null,
      seniority: inferSeniority(p.jobTitle || p.headline || ""),
      intent_score,
      recent_activity: recent,
      enriched_data: {
        country: p.country,
        location: p.location,
        followers: p.followersCount,
        connections: p.connectionsCount,
        about: p.about,
        experiences: p.experiences,
      },
      discovered_via: config.useDemoData ? "demo_seed" : "apify_linkedin",
      raw_data: p.raw || (p as unknown as Record<string, unknown>),
    };

    const { data: existing } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("linkedin_url", p.url || "__none__")
      .maybeSingle();

    let leadId: string;
    if (existing?.id) {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .update(insertPayload)
        .eq("id", existing.id)
        .select("id")
        .single();
      if (error) throw error;
      leadId = data.id;
    } else {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert(insertPayload)
        .select("id")
        .single();
      if (error) throw error;
      leadId = data.id;
    }

    await supabaseAdmin.from("events").insert({
      event_type: "lead.discovered",
      entity_type: "lead",
      entity_id: leadId,
      payload: {
        query: config.query,
        score: intent_score,
        source: insertPayload.discovered_via,
      },
    });

    results.push({
      lead: {
        id: leadId,
        full_name: p.fullName,
        linkedin_url: p.url ?? null,
        role: p.jobTitle || p.headline || null,
        company_name: p.companyName ?? null,
        intent_score,
        discovered_via: insertPayload.discovered_via,
        recent_activity: recent,
        raw_profile: p,
      },
      hiring_signals_count: hiringCount,
      news_count: newsCount,
    });
  }

  return results;
}

function computeInitialIntent(p: ApifyLinkedInProfile): number {
  let score = 30;
  const headline = (p.headline || p.jobTitle || "").toLowerCase();
  const about = (p.about || "").toLowerCase();
  const allPosts = (p.recent_posts || [])
    .map((x) => x.text.toLowerCase())
    .join(" ");

  if (
    /founder|ceo|cofounder|co-founder|fundador/i.test(headline) ||
    /founder|ceo/i.test(about)
  )
    score += 15;
  if (/cfo|finance|financiera|controller/i.test(headline)) score += 18;
  if (/vp.*sales|director.*ventas|head of sales/i.test(headline)) score += 18;
  if (/yc|y combinator|techstars|500 startups/i.test(headline + about))
    score += 10;
  if (/escalar|growth|crecer|outbound|sdr|cac|churn/i.test(allPosts))
    score += 15;
  if (/concilia|factura|cierre/i.test(allPosts)) score += 18;
  if (/hiring|contratando|buscamos/i.test(allPosts)) score += 12;
  if ((p.followersCount || 0) > 5000) score += 5;

  return Math.min(80, score);
}

function inferSeniority(text: string): string {
  const t = text.toLowerCase();
  if (/ceo|cfo|coo|cto|founder|cofounder|presidente/.test(t)) return "c_level";
  if (/vp|vice president|director|head of/.test(t)) return "director";
  if (/lead|manager|gerente/.test(t)) return "manager";
  if (/senior|sr\./.test(t)) return "senior_ic";
  return "ic";
}
