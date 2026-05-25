"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Pill, Spinner } from "@/components/ui";
import { toast } from "sonner";
import { Radio, Sparkles, ChevronRight, ExternalLink, Brain } from "lucide-react";
import Link from "next/link";

const PRESET_QUERIES = [
  {
    label: "Founders YC LATAM",
    query: "founder OR ceo Y Combinator latam colombia mexico startup",
  },
  {
    label: "Scale-up founders LATAM",
    query: "founder ceo scale-up series A startup colombia mexico chile",
  },
  {
    label: "VP Sales fintech",
    query: "VP sales OR director ventas fintech mexico colombia",
  },
  {
    label: "CFOs mid-market",
    query: "CFO OR director financiero distribuidora colombia peru chile",
  },
];

type DiscoveredResult = {
  lead: {
    id: string;
    full_name: string;
    role?: string | null;
    company_name?: string | null;
    intent_score: number;
    linkedin_url?: string | null;
    discovered_via?: string | null;
    recent_activity: { text: string; type: string }[];
  };
  hiring_signals_count: number;
  news_count: number;
};

export function DiscoveryClient() {
  const [query, setQuery] = useState(PRESET_QUERIES[0].query);
  const [useDemo, setUseDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState<Record<string, boolean>>({});
  const [classified, setClassified] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<DiscoveredResult[]>([]);

  async function runDiscovery() {
    setLoading(true);
    setResults([]);
    try {
      const r = await fetch("/api/leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, useDemoData: useDemo, maxResults: 8 }),
      });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Unknown error");
      setResults(json.results);
      toast.success(`${json.count} leads descubiertos`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function classifyAll() {
    if (results.length === 0) return;
    toast.message(`Clasificando ${results.length} leads con IA...`);
    for (const r of results) {
      setClassifying((s) => ({ ...s, [r.lead.id]: true }));
      try {
        const resp = await fetch(`/api/leads/${r.lead.id}/classify`, {
          method: "POST",
        });
        const json = await resp.json();
        if (json.ok) {
          setClassified((s) => ({ ...s, [r.lead.id]: json.classification }));
        }
      } catch {
        // continue
      } finally {
        setClassifying((s) => ({ ...s, [r.lead.id]: false }));
      }
    }
    toast.success("Clasificación completa");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva búsqueda de leads</CardTitle>
          <Pill tone="info">
            {useDemo ? "modo demo (instantáneo)" : "modo real (Apify + ValueSerp)"}
          </Pill>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((p) => (
              <button
                key={p.label}
                onClick={() => setQuery(p.query)}
                className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] hover:border-indigo-500/50 hover:bg-indigo-500/10"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[var(--muted)] mb-1.5">
              Query de búsqueda
            </label>
            <textarea
              className="w-full bg-[var(--panel)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <input
                type="checkbox"
                checked={useDemo}
                onChange={(e) => setUseDemo(e.target.checked)}
                className="accent-indigo-500"
              />
              Modo demo (sin llamar Apify, usa 5 perfiles reales seed)
            </label>
            <Button
              variant="primary"
              onClick={runDiscovery}
              loading={loading}
              className="!px-4"
            >
              <Radio size={14} /> Disparar discovery
            </Button>
          </div>
        </CardBody>
      </Card>

      {results.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">
              {results.length} leads encontrados
            </h2>
            <Button variant="secondary" onClick={classifyAll}>
              <Brain size={14} /> Clasificar todos con IA
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r) => {
              const c = classified[r.lead.id] as
                | {
                    segment?: string;
                    journey_stage?: string;
                    intent_score?: number;
                    pain_points?: { text: string; severity: string }[];
                    emotional_trigger?: string;
                    recommended_opening?: string;
                  }
                | undefined;
              const isClassifying = classifying[r.lead.id];
              return (
                <Card key={r.lead.id}>
                  <CardHeader>
                    <div>
                      <CardTitle>{r.lead.full_name}</CardTitle>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">
                        {r.lead.role} · {r.lead.company_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Pill
                        tone={
                          r.lead.intent_score >= 70
                            ? "success"
                            : r.lead.intent_score >= 50
                            ? "warning"
                            : "default"
                        }
                      >
                        intent {r.lead.intent_score}
                      </Pill>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.hiring_signals_count > 0 && (
                        <Pill tone="warning">
                          {r.hiring_signals_count} señales hiring
                        </Pill>
                      )}
                      {r.news_count > 0 && (
                        <Pill tone="info">{r.news_count} news</Pill>
                      )}
                      <Pill>{r.lead.discovered_via}</Pill>
                    </div>

                    {r.lead.recent_activity.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                          Posts recientes
                        </div>
                        <div className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed border-l-2 border-[var(--border-strong)] pl-2 italic">
                          {r.lead.recent_activity[0]?.text}
                        </div>
                      </div>
                    )}

                    {c && (
                      <div className="border-t border-[var(--border)] pt-3 space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Pill tone="violet">{c.segment}</Pill>
                          <Pill tone="warning">{c.journey_stage}</Pill>
                          <Pill tone="success">score {c.intent_score}</Pill>
                        </div>
                        {c.emotional_trigger && (
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-0.5">
                              Trigger emocional
                            </div>
                            <p className="text-xs italic">{c.emotional_trigger}</p>
                          </div>
                        )}
                        {c.pain_points && c.pain_points.length > 0 && (
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                              Dolores detectados
                            </div>
                            <ul className="space-y-1">
                              {c.pain_points.slice(0, 3).map((p, i) => (
                                <li
                                  key={i}
                                  className="text-xs flex items-start gap-1.5"
                                >
                                  <span
                                    className={
                                      p.severity === "critical" || p.severity === "high"
                                        ? "text-rose-400"
                                        : "text-amber-400"
                                    }
                                  >
                                    ●
                                  </span>
                                  <span>{p.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {isClassifying && (
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <Spinner /> Clasificando con IA...
                      </div>
                    )}

                    <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                      {r.lead.linkedin_url && (
                        <a
                          href={r.lead.linkedin_url}
                          target="_blank"
                          rel="noopener"
                          className="text-xs text-[var(--muted)] hover:text-cyan-300 flex items-center gap-1"
                        >
                          LinkedIn <ExternalLink size={11} />
                        </a>
                      )}
                      <Link
                        href={`/app/leads/${r.lead.id}`}
                        className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center gap-1 ml-auto"
                      >
                        Abrir lead <ChevronRight size={12} />
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {results.length === 0 && !loading && (
        <Card className="subtle-grid">
          <CardBody className="py-12 text-center">
            <Sparkles className="mx-auto text-indigo-400" size={32} />
            <h3 className="text-base font-semibold mt-3">
              Listo para descubrir tus primeros leads
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1.5 max-w-md mx-auto">
              Selecciona un preset, ajusta el query y dispara. En modo demo verás
              5 perfiles reales seed para LATAM. En modo real usaremos Apify +
              ValueSerp.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
