import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { personalizeMessage } from "@/lib/ai/personalize";
import { personalizeMessageFallback, tryWithFallback } from "@/lib/ai/fallback";
import { generateVoiceNote } from "@/lib/voice/elevenlabs";
import { classifyLeadFallback } from "@/lib/ai/fallback";
import type { ChannelType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const requestedChannel: ChannelType | undefined = body.channel;
    const sequenceStep: number = body.sequence_step ?? 1;
    const voicePreset = body.voice_preset || "default";

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

    const channel: ChannelType =
      requestedChannel ||
      (lead.preferred_channels?.[0] as ChannelType) ||
      "linkedin_dm";

    const { data: priorMessages } = await supabaseAdmin
      .from("messages")
      .select("direction, content")
      .in(
        "conversation_id",
        (
          await supabaseAdmin
            .from("conversations")
            .select("id")
            .eq("lead_id", id)
        ).data?.map((c) => c.id) || []
      )
      .order("created_at", { ascending: true })
      .limit(20);

    let workingLead = lead;
    if (!lead.segment || lead.segment === "other" || !lead.enriched_at) {
      const fallback = classifyLeadFallback(lead);
      workingLead = {
        ...lead,
        segment: fallback.segment,
        pain_points: fallback.pain_points,
        preferred_channels: fallback.preferred_channels,
      };
    }

    const { value: personalized, usedFallback } = await tryWithFallback(
      () =>
        personalizeMessage({
          lead: workingLead,
          channel,
          sequence_step: sequenceStep,
          campaign_intent: body.campaign_intent,
          prior_messages: priorMessages || [],
        }),
      () =>
        personalizeMessageFallback({
          lead: workingLead,
          channel,
          sequence_step: sequenceStep,
        })
    );

    let audioUrl: string | null = null;
    let durationSec: number | undefined;
    if (
      (channel === "whatsapp_voice" || channel === "linkedin_voice") &&
      personalized.voice_script
    ) {
      const voice = await generateVoiceNote({
        text: personalized.voice_script,
        voicePreset,
        leadId: id,
      });
      audioUrl = voice.audioUrl;
      durationSec = voice.durationSec;
    }

    let conversationId: string;
    const { data: existingConv } = await supabaseAdmin
      .from("conversations")
      .select("id")
      .eq("lead_id", id)
      .eq("channel", channel)
      .maybeSingle();

    if (existingConv?.id) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv, error: convErr } = await supabaseAdmin
        .from("conversations")
        .insert({
          lead_id: id,
          channel,
          status: "active",
          current_sequence_step: sequenceStep,
        })
        .select("id")
        .single();
      if (convErr) throw convErr;
      conversationId = newConv.id;
    }

    const { data: msg, error: msgErr } = await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conversationId,
        direction: "outbound",
        sender: "ai",
        content_type: audioUrl ? "audio" : "text",
        content: personalized.body,
        audio_url: audioUrl,
        transcript: personalized.voice_script || null,
        llm_reasoning: personalized.reasoning,
        variant_id: `seq${sequenceStep}_${Date.now()}`,
      })
      .select("*")
      .single();
    if (msgErr) throw msgErr;

    await supabaseAdmin.from("events").insert({
      event_type: "message.generated",
      entity_type: "message",
      entity_id: msg.id,
      payload: {
        channel,
        emotional_hook: personalized.emotional_hook,
        has_audio: !!audioUrl,
      },
    });

    return NextResponse.json({
      ok: true,
      message: msg,
      conversation_id: conversationId,
      personalized,
      audio_url: audioUrl,
      duration_sec: durationSec,
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
