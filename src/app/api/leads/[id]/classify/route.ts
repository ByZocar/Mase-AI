import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { classifyLead } from "@/lib/ai/classify";
import { classifyLeadFallback, tryWithFallback } from "@/lib/ai/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json(
        { ok: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    const { value: result, usedFallback } = await tryWithFallback(
      () => classifyLead(lead),
      () => classifyLeadFallback(lead)
    );

    const { error: updErr } = await supabaseAdmin
      .from("leads")
      .update({
        segment: result.segment,
        journey_stage: result.journey_stage,
        intent_score: result.intent_score,
        pain_points: result.pain_points,
        preferred_channels: result.preferred_channels,
        enriched_data: {
          ...(lead.enriched_data || {}),
          emotional_trigger: result.emotional_trigger,
          recommended_opening: result.recommended_opening,
          classifier_reasoning: result.reasoning,
          segment_confidence: result.segment_confidence,
        },
        enriched_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (updErr) throw updErr;

    for (const p of result.pain_points) {
      await supabaseAdmin
        .from("pain_points_library")
        .upsert(
          {
            pain_point: p.text,
            segment: result.segment,
            last_seen_at: new Date().toISOString(),
            related_lead_ids: [id],
          },
          { onConflict: "pain_point", ignoreDuplicates: false }
        );
    }

    await supabaseAdmin.from("events").insert({
      event_type: "lead.classified",
      entity_type: "lead",
      entity_id: id,
      payload: {
        segment: result.segment,
        stage: result.journey_stage,
        score: result.intent_score,
        used_fallback: usedFallback,
      },
    });

    return NextResponse.json({
      ok: true,
      classification: result,
      used_fallback: usedFallback,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
