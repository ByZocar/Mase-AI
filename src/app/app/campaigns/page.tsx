import { PageHeader, Card, CardBody, CardHeader, CardTitle, Pill } from "@/components/ui";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const { data: campaigns } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Estrategias coordinadas con secuencia y target segment definidos"
      />
      <div className="p-8">
        {!campaigns || campaigns.length === 0 ? (
          <Card className="subtle-grid">
            <CardBody className="py-12 text-center">
              <p className="text-sm font-medium">Sin campañas todavía</p>
              <p className="text-xs text-[var(--muted)] mt-1">
                Las campañas se generan automáticamente al clasificar leads.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.name}</CardTitle>
                  <Pill
                    tone={
                      c.status === "active"
                        ? "success"
                        : c.status === "draft"
                        ? "default"
                        : "warning"
                    }
                  >
                    {c.status}
                  </Pill>
                </CardHeader>
                <CardBody className="text-xs text-[var(--muted)]">
                  Segment: {c.target_segment} · Países:{" "}
                  {(c.target_country || []).join(", ") || "all"}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
