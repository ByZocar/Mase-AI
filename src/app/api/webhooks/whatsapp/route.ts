import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { personalizeMessage } from "@/lib/ai/personalize";
import { personalizeMessageFallback, tryWithFallback } from "@/lib/ai/fallback";
import { sendWhatsAppText } from "@/lib/channels/whatsapp";
import type { ChannelType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const fromPhone = (payload.payload?.from || payload.from || "").replace(
      /@.*$/,
      ""
    );
    const text =
      payload.payload?.body || payload.payload?.text?.body || payload.text || "";

    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("phone", fromPhone)
      .maybeSingle();

    if (!lead) {
      return NextResponse.json({ ok: true, ignored: "lead not found" });
    }

    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .select("*, leads(*)")
      .eq("lead_id", lead.id)
      .in("channel", ["whatsapp_text", "whatsapp_voice"])
      .maybeSingle();

    if (!conv) {
      return NextResponse.json({ ok: true, ignored: "no active conversation" });
    }

    await supabaseAdmin.from("messages").insert({
      conversation_id: conv.id,
      direction: "inbound",
      sender: "lead",
      content_type: "text",
      content: text,
    });

    if (conv.status === "human_takeover") {
      return NextResponse.json({ ok: true, action: "handed_off_to_human" });
    }

    const { data: prior } = await supabaseAdmin
      .from("messages")
      .select("direction, content")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })
      .limit(20);

    const { value: personalized } = await tryWithFallback(
      () =>
        personalizeMessage({
          lead: conv.leads,
          channel: conv.channel as ChannelType,
          sequence_step: conv.current_sequence_step + 1,
          prior_messages: prior || [],
        }),
      () =>
        personalizeMessageFallback({
          lead: conv.leads,
          channel: conv.channel as ChannelType,
          sequence_step: conv.current_sequence_step + 1,
        })
    );

    const { data: newMsg } = await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conv.id,
        direction: "outbound",
        sender: "ai",
        content_type: "text",
        content: personalized.body,
        llm_reasoning: personalized.reasoning,
      })
      .select("*")
      .single();

    if (fromPhone) {
      await sendWhatsAppText({ phone: fromPhone, text: personalized.body });
    }

    await supabaseAdmin
      .from("conversations")
      .update({
        current_sequence_step: conv.current_sequence_step + 1,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conv.id);

    return NextResponse.json({ ok: true, reply_message_id: newMsg?.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: "WhatsApp inbound webhook. POST with WAHA payload shape.",
  });
}
