import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader, Card, CardBody, CardHeader, CardTitle, Pill } from "@/components/ui";
import {
  SEGMENT_LABELS,
  STAGE_LABELS,
  CHANNEL_LABELS,
  type ChannelType,
  type JourneyStage,
  type LeadSegment,
  type PainPoint,
} from "@/lib/types";
import { LeadActions } from "./lead-actions";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) notFound();

  const { data: conversations } = await supabaseAdmin
    .from("conversations")
    .select("*, messages(id, direction, sender, content, audio_url, created_at, sent_at)")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const enriched = (lead.enriched_data || {}) as {
    country?: string;
    location?: string;
    followers?: number;
    about?: string;
    emotional_trigger?: string;
    recommended_opening?: string;
    classifier_reasoning?: string;
    segment_confidence?: number;
  };

  return (
    <>
      <PageHeader
        title={lead.full_name}
        subtitle={`${lead.role || ""}${
          lead.company_name ? ` · ${lead.company_name}` : ""
        }${enriched.location ? ` · ${enriched.location}` : ""}`}
        actions={
          <>
            <Pill
              tone={
                lead.intent_score >= 70
                  ? "success"
                  : lead.intent_score >= 50
                  ? "warning"
                  : "default"
              }
            >
              Intent {lead.intent_score}
            </Pill>
            <Pill tone="violet">{SEGMENT_LABELS[lead.segment as LeadSegment]}</Pill>
            <Pill tone="info">
              {STAGE_LABELS[lead.journey_stage as JourneyStage]}
            </Pill>
          </>
        }
      />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {enriched.emotional_trigger && (
            <Card>
              <CardHeader>
                <CardTitle>Trigger emocional detectado</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm italic">{enriched.emotional_trigger}</p>
                {enriched.recommended_opening && (
                  <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-md">
                    <div className="text-[10px] uppercase tracking-widest text-indigo-300 mb-1">
                      Opening recomendado por IA
                    </div>
                    <p className="text-sm">{enriched.recommended_opening}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {lead.pain_points && (lead.pain_points as PainPoint[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dolores detectados</CardTitle>
                <Pill tone="warning">
                  {(lead.pain_points as PainPoint[]).length}
                </Pill>
              </CardHeader>
              <CardBody className="space-y-2">
                {(lead.pain_points as PainPoint[]).map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b last:border-0 border-[var(--border)]"
                  >
                    <Pill
                      tone={
                        p.severity === "critical" || p.severity === "high"
                          ? "danger"
                          : p.severity === "medium"
                          ? "warning"
                          : "default"
                      }
                    >
                      {p.severity}
                    </Pill>
                    <div className="flex-1">
                      <p className="text-sm">{p.text}</p>
                      {p.evidence && (
                        <p className="text-xs text-[var(--muted)] italic mt-1">
                          Evidencia: {p.evidence}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          <LeadActions
            leadId={lead.id}
            preferredChannels={(lead.preferred_channels || []) as ChannelType[]}
            isClassified={!!lead.enriched_at}
          />

          {conversations && conversations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Conversaciones</CardTitle>
                <Pill>{conversations.length}</Pill>
              </CardHeader>
              <CardBody className="space-y-3 p-0">
                {conversations.map((conv) => {
                  const msgs = (conv.messages || []) as Array<{
                    id: string;
                    direction: string;
                    sender: string;
                    content?: string;
                    audio_url?: string;
                    created_at: string;
                  }>;
                  const sorted = [...msgs].sort(
                    (a, b) =>
                      new Date(a.created_at).getTime() -
                      new Date(b.created_at).getTime()
                  );
                  return (
                    <div
                      key={conv.id}
                      className="px-4 py-3 border-b last:border-0 border-[var(--border)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Pill tone="violet">
                            {CHANNEL_LABELS[conv.channel as ChannelType]}
                          </Pill>
                          <Pill
                            tone={
                              conv.status === "human_takeover"
                                ? "warning"
                                : conv.status === "active"
                                ? "info"
                                : "default"
                            }
                          >
                            {conv.status}
                          </Pill>
                        </div>
                        <a
                          href={`/inbox/${conv.id}`}
                          className="text-xs text-indigo-300 hover:text-indigo-200"
                        >
                          Abrir →
                        </a>
                      </div>
                      <div className="space-y-2">
                        {sorted.slice(-3).map((m) => (
                          <div
                            key={m.id}
                            className={`text-xs p-2.5 rounded-md border ${
                              m.direction === "outbound"
                                ? "bg-indigo-500/5 border-indigo-500/20 ml-6"
                                : "bg-white/[0.02] border-[var(--border)] mr-6"
                            }`}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest">
                                {m.sender}
                              </span>
                              <span className="text-[10px] text-[var(--muted)]">
                                {formatRelative(m.created_at)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap line-clamp-4">
                              {m.content}
                            </p>
                            {m.audio_url && (
                              <audio
                                controls
                                src={m.audio_url}
                                className="w-full mt-2 h-8"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              {enriched.about && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                    Sobre
                  </div>
                  <p className="text-xs leading-relaxed">{enriched.about}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
                <Field label="LinkedIn" value={lead.linkedin_url} href={lead.linkedin_url} />
                <Field label="Email" value={lead.email} />
                <Field label="WhatsApp" value={lead.phone} />
                <Field label="Twitter" value={lead.twitter_handle} />
                <Field label="País" value={enriched.country} />
                <Field
                  label="Followers"
                  value={enriched.followers ? String(enriched.followers) : null}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canales preferidos</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-wrap gap-1.5">
              {(lead.preferred_channels || []).map((c: string, i: number) => (
                <Pill key={c} tone={i === 0 ? "success" : "default"}>
                  {i === 0 && "★ "}
                  {CHANNEL_LABELS[c as ChannelType] || c}
                </Pill>
              ))}
            </CardBody>
          </Card>

          {lead.recent_activity &&
            (lead.recent_activity as { text: string; type: string }[]).length >
              0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Actividad reciente</CardTitle>
                </CardHeader>
                <CardBody className="space-y-2">
                  {(lead.recent_activity as { text: string; type: string }[])
                    .slice(0, 5)
                    .map((a, i) => (
                      <div
                        key={i}
                        className="text-xs border-l-2 border-[var(--border-strong)] pl-2 leading-relaxed"
                      >
                        <Pill className="mb-1">{a.type}</Pill>
                        <p className="italic text-[var(--muted)]">{a.text}</p>
                      </div>
                    ))}
                </CardBody>
              </Card>
            )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="text-xs text-cyan-300 hover:text-cyan-200 break-all"
        >
          {value}
        </a>
      ) : (
        <div className="text-xs break-all">{value}</div>
      )}
    </div>
  );
}
