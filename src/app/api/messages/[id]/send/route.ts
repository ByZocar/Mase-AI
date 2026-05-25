import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/channels/email";
import { sendWhatsAppText, sendWhatsAppVoice } from "@/lib/channels/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const { data: msg, error } = await supabaseAdmin
      .from("messages")
      .select("*, conversations(*, leads(*))")
      .eq("id", id)
      .single();
    if (error || !msg) {
      return NextResponse.json(
        { ok: false, error: "Message not found" },
        { status: 404 }
      );
    }

    const conv = msg.conversations as {
      id: string;
      channel: string;
      leads: { email?: string; phone?: string; full_name: string };
    };
    const lead = conv.leads;
    let result: unknown;

    switch (conv.channel) {
      case "email":
        if (!lead.email) {
          return NextResponse.json(
            { ok: false, error: "Lead has no email" },
            { status: 400 }
          );
        }
        result = await sendEmail({
          to: lead.email,
          subject: msg.transcript?.slice(0, 80) || "Hablemos un momento",
          text: msg.content || "",
        });
        break;
      case "whatsapp_text":
        if (!lead.phone) {
          result = {
            mocked: true,
            note: "No phone available for lead; message stored as draft.",
          };
        } else {
          result = await sendWhatsAppText({
            phone: lead.phone,
            text: msg.content || "",
          });
        }
        break;
      case "whatsapp_voice":
        if (!lead.phone || !msg.audio_url) {
          result = {
            mocked: true,
            note: "No phone/audio for voice send; stored as draft.",
          };
        } else {
          result = await sendWhatsAppVoice({
            phone: lead.phone,
            audioUrl: msg.audio_url,
          });
        }
        break;
      case "linkedin_dm":
      case "linkedin_voice":
      case "twitter_dm":
      case "twitter_engage":
        result = {
          mocked: true,
          channel: conv.channel,
          note: "Channel adapter pending in production; would be sent via Apify or PhantomBuster.",
        };
        break;
      default:
        result = { mocked: true, channel: conv.channel };
    }

    await supabaseAdmin
      .from("messages")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", id);

    await supabaseAdmin
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conv.id);

    await supabaseAdmin.from("events").insert({
      event_type: "message.sent",
      entity_type: "message",
      entity_id: id,
      payload: { channel: conv.channel, result },
    });

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
