"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Hash, Globe, AtSign } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle, Pill } from "@/components/ui";
import { formatRelative } from "@/lib/utils";

type Post = {
  id: string;
  platform: string;
  format: string;
  title?: string;
  body: string;
  hashtags?: string[];
  based_on_pain_points?: string[];
  status: string;
  created_at: string;
};

type Pain = {
  pain_point: string;
  segment?: string;
  frequency_count: number;
};

export function ContentClient({
  initialPosts,
  pains,
}: {
  initialPosts: Post[];
  pains: Pain[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [generating, setGenerating] = useState(false);

  async function generate() {
    setGenerating(true);
    try {
      const r = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windowDays: 30, maxPosts: 3 }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      setPosts((prev) => [...j.posts, ...prev]);
      toast.success(`${j.posts.length} piezas de contenido generadas`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generar contenido educativo</CardTitle>
            <Pill tone="info">Basado en dolores reales</Pill>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-[var(--muted)] mb-3">
              El sistema agrega los dolores más frecuentes detectados en tus
              leads y genera contenido que conecta con ellos. Distribuye entre
              LinkedIn, Twitter y blog.
            </p>
            <Button
              onClick={generate}
              variant="primary"
              loading={generating}
            >
              <Sparkles size={14} /> Generar 3 piezas ahora
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top dolores detectados</CardTitle>
          </CardHeader>
          <CardBody className="space-y-1.5 max-h-72 overflow-y-auto">
            {pains.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">
                Aún no se han detectado dolores. Clasifica algunos leads
                primero.
              </p>
            ) : (
              pains.slice(0, 8).map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs border-b last:border-0 border-[var(--border)] pb-1.5"
                >
                  <span className="text-[var(--muted)] tabular-nums shrink-0">
                    {p.frequency_count}x
                  </span>
                  <span className="line-clamp-2">{p.pain_point}</span>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => {
          const Icon =
            post.platform === "twitter"
              ? Hash
              : post.platform === "blog"
              ? Globe
              : AtSign;
          return (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-indigo-300" />
                  <CardTitle>
                    {post.title || post.platform.toUpperCase()}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  <Pill tone="violet">{post.format}</Pill>
                  <Pill tone={post.status === "published" ? "success" : "info"}>
                    {post.status}
                  </Pill>
                </div>
              </CardHeader>
              <CardBody className="space-y-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed line-clamp-[12]">
                  {post.body}
                </p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((h) => (
                      <span
                        key={h}
                        className="text-[11px] text-cyan-300"
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                )}
                {post.based_on_pain_points &&
                  post.based_on_pain_points.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border)]">
                      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
                        Basado en dolores
                      </div>
                      <ul className="text-xs text-[var(--muted)] space-y-0.5">
                        {post.based_on_pain_points.slice(0, 3).map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="flex justify-between text-[11px] text-[var(--muted)] pt-2 border-t border-[var(--border)]">
                  <span>{formatRelative(post.created_at)}</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {posts.length === 0 && (
        <Card className="subtle-grid">
          <CardBody className="py-12 text-center">
            <Sparkles
              className="mx-auto text-indigo-400"
              size={32}
            />
            <p className="text-sm font-medium mt-3">
              Sin contenido generado todavía
            </p>
            <p className="text-xs text-[var(--muted)] mt-1 max-w-md mx-auto">
              Clasifica algunos leads para que detectemos dolores, después
              presiona Generar para producir 3 piezas educativas.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
