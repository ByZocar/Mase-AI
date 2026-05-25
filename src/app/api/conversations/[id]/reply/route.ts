import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { personalizeMessage } from "@/lib/ai/personalize";
import { personalizeMessageFallback, tryWithFallback } from "@/lib/ai/fallback";
import type { ChannelType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));

    const { data: conv, error } = await supabaseAdmin
      .from("conversations")
      .select("*, leads(*)")
      .eq("id", id)
      .single();
    if (error || !conv) {
      return NextResponse.json({ ok: false, error: "Conversation not found" }, { status: 404 });
    }

    const { data: priorMessages } = await supabaseAdmin
      .from("messages")
      .select("direction, content, sender")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(20);

    if (body.inbound_text) {
      await supabaseAdmin.from("messages").insert({
        conversation_id: id,
        direction: "inbound",
        sender: "lead",
        content_type: "text",
        content: body.inbound_text,
      });
    }

    const { value: personalized } = await tryWithFallback(
      () =>
        personalizeMessage({
          lead: conv.leads,
          channel: conv.channel as ChannelType,
          sequence_step: conv.current_sequence_step + 1,
          prior_messages: (priorMessages || []).concat(
            body.inbound_text
              ? [{ direction: "inbound", content: body.inbound_text, sender: "lead" }]
              : []
          ),
        }),
      () =>
        personalizeMessageFallback({
          lead: conv.leads,
          channel: conv.channel as ChannelType,
          sequence_step: conv.current_sequence_step + 1,
        })
    );

    const { data: newMsg, error: msgErr } = await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: id,
        direction: "outbound",
        sender: "ai",
        content_type: "text",
        content: personalized.body,
        llm_reasoning: personalized.reasoning,
      })
      .select("*")
      .single();
    if (msgErr) throw msgErr;

    await supabaseAdmin
      .from("conversations")
      .update({
        current_sequence_step: conv.current_sequence_step + 1,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.json({ ok: true, message: newMsg, personalized });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
