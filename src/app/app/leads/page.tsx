import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader, Card, CardBody, Pill } from "@/components/ui";
import {
  SEGMENT_LABELS,
  STAGE_LABELS,
  type JourneyStage,
  type LeadSegment,
} from "@/lib/types";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; stage?: string; q?: string }>;
}) {
  const sp = await searchParams;

  let q = supabaseAdmin
    .from("leads")
    .select(
      "id, full_name, role, company_name, segment, journey_stage, intent_score, preferred_channels, created_at, last_contacted_at"
    )
    .order("intent_score", { ascending: false })
    .limit(100);

  if (sp.segment) q = q.eq("segment", sp.segment);
  if (sp.stage) q = q.eq("journey_stage", sp.stage);
  if (sp.q) q = q.ilike("full_name", `%${sp.q}%`);

  const { data: leads } = await q;

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${leads?.length || 0} leads en pipeline (ordenados por intent score)`}
      />

      <div className="p-8 space-y-4">
        <Card>
          <CardBody className="p-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--muted)] mr-2">Segmento:</span>
            <Link
              href="/app/leads"
              className={`text-xs px-2 py-1 rounded-md border ${
                !sp.segment
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200"
                  : "border-[var(--border)]"
              }`}
            >
              Todos
            </Link>
            {Object.entries(SEGMENT_LABELS).map(([k, v]) => (
              <Link
                key={k}
                href={`/app/leads?segment=${k}`}
                className={`text-xs px-2 py-1 rounded-md border ${
                  sp.segment === k
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200"
                    : "border-[var(--border)]"
                }`}
              >
                {v}
              </Link>
            ))}
            <span className="text-xs text-[var(--muted)] mx-2">|</span>
            <span className="text-xs text-[var(--muted)] mr-2">Stage:</span>
            <Link
              href={
                sp.segment ? `/leads?segment=${sp.segment}` : "/leads"
              }
              className={`text-xs px-2 py-1 rounded-md border ${
                !sp.stage
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200"
                  : "border-[var(--border)]"
              }`}
            >
              Todas
            </Link>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <Link
                key={k}
                href={`/app/leads?stage=${k}${
                  sp.segment ? `&segment=${sp.segment}` : ""
                }`}
                className={`text-xs px-2 py-1 rounded-md border ${
                  sp.stage === k
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-200"
                    : "border-[var(--border)]"
                }`}
              >
                {v}
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          {!leads || leads.length === 0 ? (
            <CardBody className="py-16 text-center">
              <p className="text-sm text-[var(--muted)]">
                No hay leads que coincidan. Ve a{" "}
                <Link
                  href="/app/discovery"
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  Discovery
                </Link>{" "}
                para descubrir.
              </p>
            </CardBody>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-[var(--muted)] border-b border-[var(--border)] bg-[var(--panel)]/40">
                  <th className="text-left px-4 py-2.5 font-medium">Lead</th>
                  <th className="text-left px-4 py-2.5 font-medium">Empresa</th>
                  <th className="text-left px-4 py-2.5 font-medium">Segmento</th>
                  <th className="text-left px-4 py-2.5 font-medium">Stage</th>
                  <th className="text-left px-4 py-2.5 font-medium">Canales</th>
                  <th className="text-right px-4 py-2.5 font-medium">Score</th>
                  <th className="text-right px-4 py-2.5 font-medium">Visto</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-[var(--border)] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/leads/${l.id}`}
                        className="font-medium hover:text-indigo-300"
                      >
                        {l.full_name}
                      </Link>
                      <div className="text-[11px] text-[var(--muted)]">
                        {l.role}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">
                      {l.company_name}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone="violet">
                        {SEGMENT_LABELS[l.segment as LeadSegment]}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill
                        tone={
                          l.journey_stage === "active_frustration"
                            ? "warning"
                            : l.journey_stage === "evaluating" ||
                              l.journey_stage === "closing"
                            ? "success"
                            : "info"
                        }
                      >
                        {STAGE_LABELS[l.journey_stage as JourneyStage]}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {((l.preferred_channels || []) as string[]).slice(0, 3).map((c: string) => (
                          <Pill key={c}>{c.replace("_", " ")}</Pill>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-xs ${
                          l.intent_score >= 70
                            ? "text-emerald-300"
                            : l.intent_score >= 40
                            ? "text-amber-300"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {l.intent_score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[var(--muted)]">
                      {formatRelative(l.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
