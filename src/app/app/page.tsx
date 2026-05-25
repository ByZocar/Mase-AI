import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Stat, Card, CardHeader, CardTitle, CardBody, Pill } from "@/components/ui";
import { SEGMENT_LABELS, STAGE_LABELS } from "@/lib/types";
import { formatRelative } from "@/lib/utils";
import { ArrowUpRight, Radio, Sparkles, Mic } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getMetrics() {
  const [
    { count: leadsCount },
    { count: leadsHigh },
    { count: convsActive },
    { count: msgsAi },
    { count: msgsSent },
    { data: recentLeads },
    { data: recentEvents },
    { data: segmentBreakdown },
  ] = await Promise.all([
    supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("intent_score", 70),
    supabaseAdmin
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender", "ai"),
    supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .not("sent_at", "is", null),
    supabaseAdmin
      .from("leads")
      .select("id, full_name, role, company_name, segment, journey_stage, intent_score, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin
      .from("events")
      .select("event_type, entity_type, entity_id, payload, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabaseAdmin.from("leads").select("segment"),
  ]);

  const segCounts: Record<string, number> = {};
  for (const r of segmentBreakdown || []) {
    segCounts[r.segment] = (segCounts[r.segment] || 0) + 1;
  }

  return {
    leadsCount: leadsCount || 0,
    leadsHigh: leadsHigh || 0,
    convsActive: convsActive || 0,
    msgsAi: msgsAi || 0,
    msgsSent: msgsSent || 0,
    recentLeads: recentLeads || [],
    recentEvents: recentEvents || [],
    segCounts,
  };
}

export default async function AppHome() {
  const m = await getMetrics();

  return (
    <>
      <div className="border-b border-[var(--mase-silver)] bg-[var(--mase-paper)]">
        <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mase-eyebrow mb-3">
              <span className="pulse-dot mr-2" />
              Sistema operando — LATAM edition
            </div>
            <h1 className="mase-headline text-[42px] tracking-tight text-[var(--mase-taupe)]">
              Outbound multicanal con tacto humano.
            </h1>
            <p className="text-[15px] text-[var(--mase-grey-olive)] mt-4 leading-relaxed max-w-xl">
              Un solo operador haciendo el trabajo de veinte. Voice notes en
              español LATAM, detección de intención en tiempo real, y la IA
              cediéndote control en el momento exacto que cuenta.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <Link href="/app/discovery" className="mase-cta">
                <Radio size={14} /> Disparar discovery
              </Link>
              <Link href="/app/content" className="mase-cta-ghost">
                <Sparkles size={14} /> Generar contenido
              </Link>
              <Link href="/app/inbox" className="mase-cta-ghost">
                <Mic size={14} /> Ver inbox
              </Link>
            </div>
          </div>
          <div className="md:border-l md:border-[var(--mase-silver)] md:pl-8 flex flex-col justify-between">
            <div>
              <div className="mase-eyebrow mb-2">Capacidad operativa</div>
              <div className="mase-headline text-[60px] tracking-tight text-[var(--mase-blush-deep)] leading-none">
                20<span className="text-[var(--mase-grey-olive)]">×</span>
              </div>
              <p className="text-xs text-[var(--mase-grey-olive)] mt-3 max-w-[260px] leading-relaxed">
                de un equipo SDR a un solo operador, con la misma cobertura
                de pipeline.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[var(--mase-grey-olive)]">
              <div>
                <span className="block text-[var(--mase-taupe)] font-medium text-sm">
                  $250/mes
                </span>
                <span>costo operativo</span>
              </div>
              <div>
                <span className="block text-[var(--mase-taupe)] font-medium text-sm">
                  $12k/mes
                </span>
                <span>equipo equivalente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="Leads totales"
            value={m.leadsCount}
            hint="Identificados por el sistema"
          />
          <Stat
            label="Alta intención"
            value={m.leadsHigh}
            hint="Score ≥ 70"
            tone="accent"
          />
          <Stat
            label="Conversaciones activas"
            value={m.convsActive}
            hint="IA operando"
            tone="success"
          />
          <Stat
            label="Mensajes generados"
            value={m.msgsAi}
            hint={`${m.msgsSent} enviados`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Leads recientes</CardTitle>
              <Link
                href="/app/leads"
                className="text-xs text-[var(--mase-grey-olive)] hover:text-[var(--mase-taupe)] inline-flex items-center gap-1"
              >
                ver todos <ArrowUpRight size={12} />
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {m.recentLeads.length === 0 ? (
                <div className="p-8 text-center text-sm text-[var(--mase-grey-olive)]">
                  Aún no hay leads. Ve a Discovery y dispara el primer scouting.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-[var(--mase-grey-olive)] border-b border-[var(--mase-silver)] bg-[var(--mase-parchment)]">
                      <th className="text-left px-4 py-2 font-medium">Lead</th>
                      <th className="text-left px-4 py-2 font-medium">Segmento</th>
                      <th className="text-left px-4 py-2 font-medium">Stage</th>
                      <th className="text-right px-4 py-2 font-medium">Score</th>
                      <th className="text-right px-4 py-2 font-medium">Descubierto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.recentLeads.map((l) => (
                      <tr
                        key={l.id}
                        className="border-b border-[var(--mase-silver)] last:border-0 hover:bg-[var(--mase-parchment)]"
                      >
                        <td className="px-4 py-2.5">
                          <Link
                            href={`/app/leads/${l.id}`}
                            className="font-medium text-[var(--mase-taupe)] hover:text-[var(--mase-blush-deep)]"
                          >
                            {l.full_name}
                          </Link>
                          <div className="text-[11px] text-[var(--mase-grey-olive)]">
                            {l.role} · {l.company_name}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Pill tone="violet">{SEGMENT_LABELS[l.segment as keyof typeof SEGMENT_LABELS]}</Pill>
                        </td>
                        <td className="px-4 py-2.5">
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
                            {STAGE_LABELS[l.journey_stage as keyof typeof STAGE_LABELS]}
                          </Pill>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs">
                          <span
                            className={
                              l.intent_score >= 70
                                ? "text-[var(--mase-success)]"
                                : l.intent_score >= 40
                                ? "text-[var(--mase-warning)]"
                                : "text-[var(--mase-grey-olive)]"
                            }
                          >
                            {l.intent_score}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-[var(--mase-grey-olive)]">
                          {formatRelative(l.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por segmento</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {Object.entries(SEGMENT_LABELS).map(([key, label]) => {
                const count = m.segCounts[key] || 0;
                const max = Math.max(1, ...Object.values(m.segCounts));
                const pct = (count / max) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1.5 text-[var(--mase-taupe)]">
                      <span>{label}</span>
                      <span className="text-[var(--mase-grey-olive)] tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--mase-parchment-dim)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--mase-blush-deep)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actividad del sistema</CardTitle>
            <Link
              href="/app/activity"
              className="text-xs text-[var(--mase-grey-olive)] hover:text-[var(--mase-taupe)] inline-flex items-center gap-1"
            >
              ver todo <ArrowUpRight size={12} />
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {m.recentEvents.length === 0 ? (
              <div className="p-6 text-center text-sm text-[var(--mase-grey-olive)]">
                Sin actividad reciente.
              </div>
            ) : (
              <ul className="divide-y divide-[var(--mase-silver)]">
                {m.recentEvents.map((e, i) => (
                  <li
                    key={i}
                    className="px-4 py-2.5 flex items-center gap-3 text-sm"
                  >
                    <Pill
                      tone={
                        e.event_type.startsWith("lead.")
                          ? "info"
                          : e.event_type.startsWith("message.")
                          ? "violet"
                          : e.event_type.startsWith("content.")
                          ? "success"
                          : "default"
                      }
                    >
                      {e.event_type}
                    </Pill>
                    <span className="text-xs text-[var(--mase-grey-olive)] truncate flex-1">
                      {JSON.stringify(e.payload).slice(0, 100)}
                    </span>
                    <span className="text-xs text-[var(--mase-grey-olive)] tabular-nums shrink-0">
                      {formatRelative(e.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
