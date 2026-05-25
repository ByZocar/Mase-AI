import { z } from "zod";
import { aiJson } from "./openai";
import type { ChannelType, Lead, LeadSegment } from "../types";

const MessageSchema = z.object({
  channel: z.enum([
    "linkedin_dm",
    "linkedin_voice",
    "whatsapp_text",
    "whatsapp_voice",
    "email",
    "twitter_dm",
    "twitter_engage",
  ]),
  subject: z.string().optional().describe("Solo si es email"),
  body: z.string().describe("Mensaje a enviar al lead"),
  voice_script: z
    .string()
    .optional()
    .describe("Si es voice, el guion exacto a leer por ElevenLabs (max ~200 chars)"),
  cta: z.string().describe("Call to action: qué queremos que haga el lead al final"),
  reasoning: z.string().describe("Por qué este mensaje funciona para este lead"),
  emotional_hook: z.string().describe("La emoción exacta que el mensaje toca"),
});

export type PersonalizedMessage = z.infer<typeof MessageSchema>;

const CHANNEL_RULES: Record<ChannelType, string> = {
  linkedin_dm:
    "LinkedIn DM. Máximo 3 párrafos cortos, 600 chars. Profesional pero cercano. Sin formalismos. Termina con pregunta abierta.",
  linkedin_voice:
    "LinkedIn Voice Note. 30-45 segundos máximo (~200 chars). Habla como hablarías a un colega. Menciona algo específico de su perfil. Cierre suave con pregunta.",
  whatsapp_text:
    "WhatsApp texto. 2-4 líneas máximo. Estilo conversacional, como un colega. Una sola idea por mensaje. Sin links largos.",
  whatsapp_voice:
    "WhatsApp Voice Note. 20-30 segundos (~150 chars). Empezar con su nombre. Estilo conversacional natural, pausas implícitas. NO leer una carta - sonar humano.",
  email:
    "Email. Máximo 100 palabras. Subject line con curiosidad o número específico. Cuerpo: contexto -> dolor -> propuesta -> CTA. PD opcional con dato sorpresa.",
  twitter_dm:
    "Twitter DM. 1-2 líneas. Casual, mencionar algo de su timeline. CTA suave.",
  twitter_engage:
    "Twitter engagement: un comentario público en un tweet del lead. Debe aportar valor, no vender. Construir familiaridad antes de cualquier DM.",
};

const SEGMENT_TONE: Record<LeadSegment, string> = {
  founder_young:
    "Tono peer-to-peer. Founder hablándole a founder. Directo, sin BS, con autoconciencia. Puede usar emojis con mesura. Referencias a 'levantar plata', 'CAC', 'churn', 'tracción'.",
  founder_scaleup:
    "Tono ejecutivo cercano. Reconoce que está ocupado. Va al grano con un dato concreto. Sin tecnicismos innecesarios. Foco en ROI y crecimiento predecible.",
  vp_sales:
    "Tono de colega de industria. Benchmarks específicos, métricas de quota attainment, pipeline coverage. Reconoce la presión que tiene. Foco en eficiencia del equipo.",
  cfo:
    "Tono formal pero humano. Foco en ROI, riesgo, control y predictibilidad. Datos concretos: horas ahorradas, errores reducidos, costo del cierre mensual. Menciona auditorías sin asustar.",
  other:
    "Tono profesional cercano. Adapta al contexto del lead.",
};

const SYSTEM_PROMPT = `Eres el copywriter principal de Zolvo. Escribes mensajes outbound que se sienten humanos, no como plantillas.

Reglas inquebrantables:
1. NUNCA empezar con "Espero que estés bien" o variantes.
2. NUNCA usar "Estimado/a".
3. NUNCA prometer "10x", "revolucionar", "transformar".
4. SIEMPRE mencionar algo específico del lead (un post, una empresa, un cargo, una métrica de su industria).
5. SIEMPRE escribir como hablaría un humano LATAM (Colombia/México), no traducido de inglés.
6. SIEMPRE incluir un CTA suave: una pregunta abierta, no "agenda una llamada".
7. El primer mensaje JAMÁS pide la reunión. Solo busca abrir conversación.
8. Mencionar a Zolvo solo si es absolutamente necesario; mejor hablar del DOLOR del lead.

Zolvo en una línea: "El motor de ventas y reconciliación con IA para LATAM. Automatiza outbound y cruza facturas vs transferencias bancarias sin que tu equipo pierda noches."

Si vas a generar voice_script: que suene NATURAL al leerlo. Frases cortas. Sin "y/o", sin guiones largos. Como si grabaras tu propio mensaje de voz al amigo.`;

export async function personalizeMessage(opts: {
  lead: Lead;
  channel: ChannelType;
  sequence_step: number;
  campaign_intent?: string;
  prior_messages?: { direction: string; content: string | null }[];
}): Promise<PersonalizedMessage> {
  const { lead, channel, sequence_step, campaign_intent, prior_messages } = opts;

  const channelRules = CHANNEL_RULES[channel];
  const tone = SEGMENT_TONE[lead.segment];

  const recent = (lead.recent_activity || [])
    .slice(0, 5)
    .map((a) => `- ${a.text.slice(0, 200)}`)
    .join("\n");

  const pains = (lead.pain_points || [])
    .map((p) => `- ${p.text}${p.evidence ? ` (evidencia: ${p.evidence})` : ""}`)
    .join("\n");

  const priorThread = prior_messages
    ? prior_messages
        .slice(-6)
        .map((m) => `${m.direction === "outbound" ? "NOSOTROS" : "LEAD"}: ${(m.content || "").slice(0, 300)}`)
        .join("\n")
    : "";

  const prompt = `Lead a contactar:
Nombre: ${lead.full_name}
Cargo: ${lead.role}
Empresa: ${lead.company_name}
País: ${(lead.enriched_data as Record<string, unknown> | undefined)?.country || "LATAM"}
Segmento: ${lead.segment}
Journey stage: ${lead.journey_stage}
Intent score: ${lead.intent_score}/100

Dolores detectados:
${pains || "Sin dolores específicos aún"}

Actividad reciente:
${recent || "Sin actividad reciente"}

Tono para este segmento: ${tone}

Canal a usar: ${channel}
Reglas del canal: ${channelRules}

Paso de la secuencia: ${sequence_step} (paso 1 = primer contacto, paso 2+ = follow-up)
${campaign_intent ? `Intent de la campaña: ${campaign_intent}` : ""}

${priorThread ? `Conversación previa:\n${priorThread}\n` : "Es el primer contacto."}

Genera el JSON con el mensaje. Si el canal es de voz, llena voice_script con el guion a leer.`;

  return aiJson({
    schema: MessageSchema,
    prompt,
    system: SYSTEM_PROMPT,
  });
}
