import { PageHeader, Card, CardBody, CardHeader, CardTitle, Pill } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const integrations = [
    { name: "Supabase", status: !!process.env.NEXT_PUBLIC_SUPABASE_URL, role: "Database, Storage, Realtime" },
    { name: "OpenAI", status: !!process.env.OPENAI_API_KEY, role: "LLM (clasificación, personalización)" },
    { name: "ElevenLabs", status: !!process.env.ELEVENLABS_API_KEY, role: "Voice notes hiperpersonalizados" },
    { name: "Apify", status: !!process.env.APIFY_API_KEY, role: "LinkedIn Sales Navigator scraping" },
    { name: "ValueSerp", status: !!process.env.VALUESERP_API_KEY, role: "SERP & news intelligence" },
    { name: "Resend", status: !!process.env.RESEND_API_KEY, role: "Outbound email (transaccional)" },
    { name: "WAHA WhatsApp", status: !!process.env.WAHA_BASE_URL, role: "WhatsApp text + voice notes" },
  ];

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Integraciones y configuración del sistema"
      />
      <div className="p-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Integraciones</CardTitle>
            <Pill tone="info">
              {integrations.filter((i) => i.status).length}/{integrations.length} activas
            </Pill>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--border)]">
              {integrations.map((i) => (
                <li
                  key={i.name}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-[var(--muted)]">{i.role}</div>
                  </div>
                  <Pill tone={i.status ? "success" : "danger"}>
                    {i.status ? "Conectado" : "Falta API key"}
                  </Pill>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arquitectura del sistema</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2 text-sm">
            <p className="text-[var(--muted)]">
              Zolvo Engine usa una arquitectura event-driven con 8 módulos
              orquestados:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--muted)]">
              <li>Discovery Engine (Apify + ValueSerp + X/Twitter)</li>
              <li>Enrichment Pipeline (perfil + empresa + señales)</li>
              <li>Segmentation Classifier (LLM)</li>
              <li>Personalization Engine (mensaje por canal)</li>
              <li>Voice Generation (ElevenLabs)</li>
              <li>Multi-Channel Sender (WhatsApp, Email, LinkedIn)</li>
              <li>Conversation Manager (auto-reply + handoff)</li>
              <li>Content Studio (publicación automática)</li>
            </ol>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
