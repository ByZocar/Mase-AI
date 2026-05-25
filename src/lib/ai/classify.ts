import { z } from "zod";
import { aiJson } from "./openai";
import type { Lead } from "../types";

const ClassifierSchema = z.object({
  segment: z.enum(["founder_young", "founder_scaleup", "vp_sales", "cfo", "other"]),
  segment_confidence: z.number().min(0).max(1),
  journey_stage: z.enum([
    "latent_pain",
    "active_frustration",
    "searching",
    "evaluating",
    "closing",
  ]),
  intent_score: z.number().min(0).max(100),
  pain_points: z
    .array(
      z.object({
        text: z.string(),
        severity: z.enum(["low", "medium", "high", "critical"]),
        evidence: z.string().optional(),
      })
    )
    .min(1)
    .max(5),
  preferred_channels: z.array(
    z.enum([
      "linkedin_dm",
      "linkedin_voice",
      "whatsapp_text",
      "whatsapp_voice",
      "email",
      "twitter_dm",
      "twitter_engage",
    ])
  ),
  emotional_trigger: z.string().describe("Momento o sentimiento que activaría a este lead a buscar Zolvo"),
  recommended_opening: z.string().describe("Primera línea ideal para abrir conversación con este lead"),
  reasoning: z.string(),
});

const SYSTEM_PROMPT = `Eres el cerebro de clasificación de Zolvo, una empresa B2B SaaS de Bogotá que ayuda a startups y empresas medianas en LATAM a escalar sus ventas con automatización inteligente y a reconciliar facturas/transferencias bancarias.

Tu tarea: dado el perfil de una persona (nombre, cargo, empresa, posts recientes, señales), clasificar:

1. SEGMENTO (en cuál de estos 5 perfiles cae):
- founder_young: Fundador 25-35 años, startup pre-Serie A, equipo pequeño, usa Twitter/X y LinkedIn, prefiere mensajes cortos. Dolor: no puede pagar SDRs.
- founder_scaleup: Fundador 36-45, scale-up con equipo 10-100, ya tiene equipo de ventas pero el pipeline no escala. Dolor: CAC sube, LTV no.
- vp_sales: VP/Director/Head de Ventas con equipo 5-20 SDRs. Dolor: SDRs pierden tiempo en tareas manuales.
- cfo: CFO/Finance/Controller en empresa mediana con >100 facturas/mes. Dolor: conciliación bancaria manual, cierre de mes caótico.
- other: No cae claramente en ningún cubo arriba.

2. JOURNEY_STAGE: latent_pain (el dolor existe pero no es urgente), active_frustration (evento reciente activó dolor), searching (buscando activamente), evaluating (comparando opciones), closing (listo para decidir).

3. INTENT_SCORE: 0-100. Sube si: posts recientes mencionan el dolor; empresa contratando SDRs; usa stack moderno; menciona "escalar"; queja sobre proceso manual; news positivas; funding reciente.

4. PAIN_POINTS: 1-5 dolores específicos detectados en este perfil concreto. NO genéricos. Cada uno con evidencia del perfil cuando exista.

5. PREFERRED_CHANNELS: ordena los canales por probabilidad de éxito con este lead específico, dado su perfil.
- Founders jóvenes: twitter_engage, linkedin_dm, whatsapp_voice
- Scale-up founders: linkedin_dm, email, whatsapp_text
- VP Ventas: linkedin_voice, email, linkedin_dm
- CFO: email, linkedin_dm (referido sería ideal pero no es canal automatizado)

6. EMOTIONAL_TRIGGER: el momento o sentimiento específico que haría a esta persona buscar Zolvo HOY.

7. RECOMMENDED_OPENING: una primera línea de mensaje que reconozca su contexto particular (NO una plantilla genérica).

Responde SIEMPRE en español de LATAM, tono cercano pero profesional. Nada de "estimado", nada de "espero que se encuentre bien".`;

export type ClassificationResult = z.infer<typeof ClassifierSchema>;

export async function classifyLead(lead: Partial<Lead> & {
  raw_data?: Record<string, unknown>;
  recent_activity?: { text: string; type?: string }[];
}): Promise<ClassificationResult> {
  const prompt = `Clasifica a este lead:

Nombre: ${lead.full_name ?? "Desconocido"}
Cargo: ${lead.role ?? "Desconocido"}
Empresa: ${lead.company_name ?? "Desconocida"}
LinkedIn: ${lead.linkedin_url ?? "N/A"}
Twitter: ${lead.twitter_handle ?? "N/A"}
Seniority: ${lead.seniority ?? "Desconocido"}

Actividad reciente:
${
  (lead.recent_activity || [])
    .slice(0, 8)
    .map((a, i) => `[${i + 1}] ${a.type ?? "post"}: ${a.text.slice(0, 240)}`)
    .join("\n") || "Sin actividad reciente capturada."
}

Datos extras:
${JSON.stringify(lead.enriched_data || lead.raw_data || {}, null, 2).slice(0, 2000)}

Devuelve el JSON estructurado.`;

  return aiJson({
    schema: ClassifierSchema,
    prompt,
    system: SYSTEM_PROMPT,
  });
}
