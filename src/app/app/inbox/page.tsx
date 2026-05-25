import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader, Card, CardBody, Pill } from "@/components/ui";
import {
  CHANNEL_LABELS,
  SEGMENT_LABELS,
  type ChannelType,
  type LeadSegment,
} from "@/lib/types";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const { data: conversations } = await supabaseAdmin
    .from("conversations")
    .select(
      "id, channel, status, last_message_at, current_sequence_step, leads(id, full_name, role, company_name, segment, intent_score), messages(id, content, direction, sender, created_at, read_at)"
    )
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(50);

  return (
    <>
      <PageHeader
        title="Inbox unificado"
        subtitle="Todas las conversaciones en todos los canales. Cualquier hilo puede ser tomado por humano."
      />

      <div className="p-8">
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            {!conversations || conversations.length === 0 ? (
              <div className="py-16 text-center text-sm text-[var(--muted)]">
                Sin conversaciones todavía. Genera un mensaje desde una vista de
                lead.
              </div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {conversations.map((c) => {
                  const lead = c.leads as unknown as {
                    id: string;
                    full_name: string;
                    role: string;
                    company_name: string;
                    segment: LeadSegment;
                    intent_score: number;
                  };
                  const msgs = (c.messages || []) as Array<{
                    id: string;
                    content: string;
                    direction: string;
                    sender: string;
                    created_at: string;
                    read_at?: string;
                  }>;
                  const last = msgs.sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )[0];
                  const unread = msgs.some(
                    (m) => m.direction === "inbound" && !m.read_at
                  );
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/app/inbox/${c.id}`}
                        className="flex items-start gap-4 px-4 py-3.5 hover:bg-white/[0.02]"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {lead?.full_name || "—"}
                            </span>
                            <Pill tone="violet">
                              {CHANNEL_LABELS[c.channel as ChannelType]}
                            </Pill>
                            {lead?.segment && (
                              <Pill tone="info">
                                {SEGMENT_LABELS[lead.segment]}
                              </Pill>
                            )}
                            {c.status === "human_takeover" && (
                              <Pill tone="warning">Manual</Pill>
                            )}
                            {unread && <Pill tone="danger">Nuevo</Pill>}
                          </div>
                          <p className="text-xs text-[var(--muted)] truncate">
                            {last?.direction === "outbound" ? "Tú: " : ""}
                            {last?.content?.slice(0, 140) || "—"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] text-[var(--muted)]">
                            {formatRelative(c.last_message_at)}
                          </div>
                          <div className="text-[10px] text-[var(--muted)] mt-1">
                            Step {c.current_sequence_step}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
