import { NextResponse } from "next/server";
import { generateWeeklyContent } from "@/lib/modules/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await generateWeeklyContent({
      windowDays: body.windowDays ?? 7,
      maxPosts: body.maxPosts ?? 3,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
