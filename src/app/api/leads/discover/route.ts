import { NextResponse } from "next/server";
import { discoverLeads } from "@/lib/modules/discovery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const config = {
      query:
        body.query ??
        "founder startup colombia OR mexico OR latam VP sales CFO",
      countries: body.countries,
      maxResults: body.maxResults ?? 10,
      useDemoData: body.useDemoData ?? false,
    };

    const results = await discoverLeads(config);
    return NextResponse.json({
      ok: true,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST { query, useDemoData } to discover leads.",
  });
}
