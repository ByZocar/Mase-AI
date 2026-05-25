import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const action = body.action as "takeover" | "release";

    const update =
      action === "release"
        ? {
            status: "active" as const,
            assigned_to: null,
            human_takeover_at: null,
          }
        : {
            status: "human_takeover" as const,
            assigned_to: body.user_id ?? null,
            human_takeover_at: new Date().toISOString(),
          };

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    await supabaseAdmin.from("events").insert({
      event_type: `conversation.${action === "release" ? "released" : "takeover"}`,
      entity_type: "conversation",
      entity_id: id,
      payload: { user_id: body.user_id || null },
    });

    return NextResponse.json({ ok: true, conversation: data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
