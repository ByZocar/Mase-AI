import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader, Card, CardBody, Pill } from "@/components/ui";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="Log de todo lo que ocurre en el sistema. Auditable, observable, debuggeable."
      />
      <div className="p-8">
        <Card>
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--border)]">
              {(events || []).map((e) => (
                <li
                  key={e.id}
                  className="px-4 py-3 flex items-start gap-3 hover:bg-white/[0.02]"
                >
                  <Pill
                    tone={
                      e.event_type.startsWith("lead.")
                        ? "info"
                        : e.event_type.startsWith("message.")
                        ? "violet"
                        : e.event_type.startsWith("content.")
                        ? "success"
                        : e.event_type.startsWith("conversation.")
                        ? "warning"
                        : "default"
                    }
                  >
                    {e.event_type}
                  </Pill>
                  <div className="flex-1 min-w-0">
                    {e.entity_type && (
                      <div className="text-[11px] text-[var(--muted)]">
                        {e.entity_type} · {e.entity_id}
                      </div>
                    )}
                    <pre className="text-xs text-[var(--muted)] truncate font-mono mt-0.5">
                      {JSON.stringify(e.payload).slice(0, 200)}
                    </pre>
                  </div>
                  <span className="text-[11px] text-[var(--muted)] shrink-0">
                    {formatRelative(e.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
