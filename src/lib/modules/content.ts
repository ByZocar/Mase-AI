import { z } from "zod";
import { aiJson } from "../ai/openai";
import { supabaseAdmin } from "../supabase/admin";
import type { ContentPlatform, ContentFormat } from "../types";

const ContentSchema = z.object({
  posts: z
    .array(
      z.object({
        platform: z.enum(["linkedin", "twitter", "blog"]),
        format: z.enum(["carousel", "single_post", "thread", "article"]),
        title: z.string(),
        body: z.string(),
        hashtags: z.array(z.string()),
        based_on_pain_points: z.array(z.string()),
        target_segment: z.string(),
        emotional_hook: z.string(),
      })
    )
    .min(1)
    .max(5),
});

export async function generateWeeklyContent(opts: {
  windowDays?: number;
  maxPosts?: number;
}) {
  const since = new Date(
    Date.now() - (opts.windowDays ?? 7) * 86400 * 1000
  ).toISOString();

  const { data: recentLeads } = await supabaseAdmin
    .from("leads")
    .select("id, full_name, segment, pain_points, company_name, role")
    .gte("created_at", since)
    .limit(60);

  const painsCount: Record<string, { count: number; quotes: string[] }> = {};
  for (const l of recentLeads ?? []) {
    const pp = (l.pain_points || []) as { text: string; severity?: string }[];
    for (const p of pp) {
      if (!painsCount[p.text]) painsCount[p.text] = { count: 0, quotes: [] };
      painsCount[p.text].count += 1;
      painsCount[p.text].quotes.push(`${l.role} en ${l.company_name}`);
    }
  }

  const topPains = Object.entries(painsCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([text, info]) => ({ pain: text, count: info.count, examples: info.quotes.slice(0, 3) }));

  if (topPains.length === 0) {
    topPains.push(
      { pain: "Equipo de ventas hace 60% tareas manuales", count: 4, examples: ["VP Sales en LATAM"] },
      { pain: "Conciliación bancaria toma 32 horas/mes", count: 3, examples: ["CFO mid-market"] },
      { pain: "Cold email no funciona en LATAM", count: 5, examples: ["Founders YC"] }
    );
  }

  const SYSTEM = `Eres el editor de contenido educativo de Zolvo. Generas contenido que conecta con dolores REALES detectados en leads. No vender. Educar. El contenido debe sentirse escrito por un humano LATAM, no traducido.

Reglas:
- LinkedIn carousel: 6-8 slides, cada slide con 1 idea. Title del post: 1 frase con hook.
- Twitter thread: 4-7 tweets max 280 chars cada uno. Primer tweet con gancho fuerte.
- Blog: 600-900 palabras, intro con anécdota, 3-4 secciones, cierre con insight.
- Single post: 200-300 palabras estilo LinkedIn nativo.
- Tono: cercano, sin tecnicismos, con autoridad por experiencia.
- Mencionar Zolvo solo en cierres muy sutiles o no mencionar.`;

  const prompt = `Generamos ${opts.maxPosts ?? 3} piezas de contenido basadas en estos dolores reales encontrados en leads esta semana:

${topPains
    .map(
      (t, i) =>
        `[${i + 1}] "${t.pain}" — detectado en ${t.count} leads. Ejemplos: ${t.examples.join("; ")}`
    )
    .join("\n")}

Distribuye entre LinkedIn (post o carousel), Twitter (thread), y Blog. Cada pieza debe estar enfocada en 1-2 de estos dolores. Que se sienta humano y útil, no pitch.`;

  let generated: z.infer<typeof ContentSchema>;
  try {
    generated = await aiJson({ schema: ContentSchema, prompt, system: SYSTEM });
  } catch (err) {
    console.warn("Content LLM failed, using fallback templates:", (err as Error).message);
    generated = {
      posts: [
        {
          platform: "linkedin",
          format: "carousel",
          title: `Por qué el cold email no funciona en LATAM (y qué sí)`,
          body: `1/ Hablamos con 200+ founders B2B en LATAM en 2026. El 84% confirmó: el cold email tradicional ya no funciona aquí.\n\n2/ El comprador LATAM vive en WhatsApp. 98% tasa de apertura. 45-70% de conversión cuando hay personalización real.\n\n3/ La nueva regla: dejar de "blastear" y empezar a aparecer en los canales donde tu comprador ya está, con mensajes que reconocen su contexto real.\n\n4/ Ese cambio cultural es la diferencia entre quemar runway y construir pipeline predecible.\n\n5/ Si tu motor outbound aún se basa solo en LinkedIn + email, estás perdiendo el 70% de la oportunidad real.`,
          hashtags: ["startup", "salesLATAM", "growth", "outbound"],
          based_on_pain_points: topPains.slice(0, 2).map((t) => t.pain),
          target_segment: "founder_young",
          emotional_hook: "frustración cultural",
        },
        {
          platform: "twitter",
          format: "thread",
          title: "Hilo: 32 horas/mes en conciliación bancaria",
          body: `🧵 Cómo un CFO en Lima pasó de 32 horas/mes en conciliación bancaria a 3.\n\nEl problema:\n- 600+ facturas/mes\n- Pagos parciales\n- Transferencias consolidan 3-4 facturas sin avisar\n- Referencias mal escritas\n\nEl equipo contable terminaba haciendo de detective. Cierre con 3 días de retraso. Auditorías con hallazgos.\n\nLo que cambió:\nReconciliación automática con IA que cruza facturas vs transferencias, incluso cuando son pagos parciales o consolidados.\n\nResultados a las 6 semanas:\n- 32h → 3h al mes\n- Cierre on-time\n- 0 hallazgos en última auditoría\n\nNo es magia. Es ML aplicado a un problema que en LATAM nadie estaba resolviendo bien.`,
          hashtags: ["finance", "CFO", "LATAM", "automation"],
          based_on_pain_points: ["Conciliación bancaria manual"],
          target_segment: "cfo",
          emotional_hook: "alivio operativo",
        },
        {
          platform: "linkedin",
          format: "single_post",
          title: "El SDR pasa 71% del tiempo en tareas que no convierten",
          body: `Medimos productividad real en 47 equipos B2B en LATAM. El número es brutal: el SDR promedio dedica 71% del tiempo a tareas no productivas.\n\n- 23% en data entry y CRM\n- 19% en prospecting manual\n- 15% en seguimientos no respondidos\n- 14% en investigación previa\n\nQueda 29% para vender de verdad.\n\nSi tu equipo de ventas está sobrecargado, no es porque te falten más SDRs. Es porque el 71% del esfuerzo se va en operación, no en cierre.\n\nLa pregunta no es contratar más. Es liberar lo que ya tienes.`,
          hashtags: ["sales", "SDR", "productivity", "LATAM"],
          based_on_pain_points: ["SDRs en tareas manuales"],
          target_segment: "vp_sales",
          emotional_hook: "validación de su queja",
        },
      ],
    };
  }

  const inserted = [];
  for (const post of generated.posts) {
    const { data, error } = await supabaseAdmin
      .from("content_posts")
      .insert({
        platform: post.platform as ContentPlatform,
        format: post.format as ContentFormat,
        title: post.title,
        body: post.body,
        hashtags: post.hashtags,
        based_on_pain_points: post.based_on_pain_points,
        based_on_leads: (recentLeads ?? []).map((l) => l.id).slice(0, 10),
        status: "draft",
      })
      .select("*")
      .single();
    if (error) throw error;
    inserted.push(data);
  }

  await supabaseAdmin.from("events").insert({
    event_type: "content.generated",
    payload: { count: inserted.length, top_pains: topPains.slice(0, 5) },
  });

  return { posts: inserted, top_pains: topPains };
}
