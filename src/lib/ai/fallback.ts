import type { ChannelType, LeadSegment, PainPoint } from "../types";

type LeadCtx = {
  full_name?: string | null;
  role?: string | null;
  company_name?: string | null;
  raw_data?: Record<string, unknown> | null;
  enriched_data?: Record<string, unknown> | null;
  recent_activity?: Array<{ text: string; type?: string }>;
  segment?: LeadSegment;
  pain_points?: PainPoint[];
};

const FIRST_NAME_RE = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/;

function firstName(name: string | null | undefined): string {
  if (!name) return "amigo";
  const m = name.match(FIRST_NAME_RE);
  return m?.[1] ?? name.split(" ")[0] ?? "amigo";
}

function inferSegment(lead: LeadCtx): LeadSegment {
  const role = (lead.role || "").toLowerCase();
  const headline = String(
    (lead.raw_data as Record<string, unknown> | undefined)?.headline || ""
  ).toLowerCase();
  const blob = `${role} ${headline}`;

  if (/cfo|finance|controller|director financ/.test(blob)) return "cfo";
  if (/vp.*sales|vp.*ventas|head of sales|director.*venta/.test(blob))
    return "vp_sales";
  if (/founder|ceo|co-founder|cofundador/.test(blob)) {
    const yc = /yc |y combinator|w25|s25|s26|w26|pre-seed/i.test(
      (lead.raw_data as Record<string, unknown> | undefined)?.about as string ||
        ""
    );
    return yc ? "founder_young" : "founder_scaleup";
  }
  return "other";
}

type ClassifierStage = "latent_pain" | "active_frustration" | "searching" | "evaluating" | "closing";

function inferJourneyStage(lead: LeadCtx): ClassifierStage {
  const posts = (lead.recent_activity || [])
    .map((a) => a.text.toLowerCase())
    .join(" ");
  if (
    /buscando|evaluando|cotiza|comparando|probando|trial/.test(posts) ||
    /escalar.*ventas|outbound.*manual|cierre.*mes/i.test(posts)
  )
    return "active_frustration";
  if (/quiero|necesito|estamos.*evaluando/.test(posts)) return "searching";
  if (/cac|churn|growth|hiring sdr|crecer/.test(posts))
    return "active_frustration";
  return "latent_pain";
}

function detectPains(lead: LeadCtx): PainPoint[] {
  const blob = (lead.recent_activity || [])
    .map((a) => a.text)
    .join(" \n ");
  const found: PainPoint[] = [];

  const PATTERNS: Array<{ regex: RegExp; pain: string; severity: PainPoint["severity"] }> = [
    {
      regex: /outbound.*manual|2 sdr|cold email no funciona|cold email.*latam/i,
      pain: "Outbound manual no escala: pierden leads por falta de seguimiento",
      severity: "high",
    },
    {
      regex: /cierre.*mes|conciliac|factura.*transferencia|3 dias.*retraso/i,
      pain: "Cierre mensual se atrasa por conciliación bancaria manual",
      severity: "critical",
    },
    {
      regex: /sdr.*60%|tareas manuales|sdr.*agotado|equipo.*agotado/i,
      pain: "SDRs pasan 60% del tiempo en tareas no productivas",
      severity: "high",
    },
    {
      regex: /hiring|contratando|buscamos.*sdr|2 sdrs senior/i,
      pain: "Necesita escalar equipo de ventas pero contratar es lento y caro",
      severity: "high",
    },
    {
      regex: /cac.*sub|cac.*alto|churn|retention/i,
      pain: "CAC en aumento sin que LTV crezca proporcionalmente",
      severity: "high",
    },
    {
      regex: /escalar|crec(er|imiento)|growth/i,
      pain: "Presión de crecimiento sin recursos para escalar el motor comercial",
      severity: "medium",
    },
    {
      regex: /whatsapp|email no/i,
      pain: "Canal de comunicación desalineado con preferencias del cliente",
      severity: "medium",
    },
  ];

  for (const { regex, pain, severity } of PATTERNS) {
    if (regex.test(blob) && !found.some((f) => f.text === pain)) {
      const m = blob.match(regex);
      found.push({
        text: pain,
        severity,
        evidence: m ? `"${blob.slice(Math.max(0, blob.indexOf(m[0]) - 30), blob.indexOf(m[0]) + 120).trim()}..."` : undefined,
      });
    }
  }

  if (found.length === 0) {
    found.push({
      text: "Quiere escalar ventas en LATAM sin contratar un equipo enorme",
      severity: "medium",
    });
  }

  return found.slice(0, 5);
}

function inferTrigger(segment: LeadSegment, pains: PainPoint[]): string {
  const top = pains[0]?.text || "";
  const triggers: Record<LeadSegment, string> = {
    founder_young: `Está calculando el costo real de contratar 2 SDRs (~$5k/mes) vs su runway. Cuando ve que con Zolvo puede empezar a generar pipeline en 48h sin esa quema, es donde se activa. ${top}`,
    founder_scaleup: `Salir de una junta de board sin métricas de crecimiento predecibles. Su VP comercial le dice "necesito 3 SDRs más". La presión por convertir el plan en pipeline real es lo que abre la conversación. ${top}`,
    vp_sales: `Llega a fin de trimestre con miss de quota y un SDR entrega su renuncia diciendo "las tareas son repetitivas". En ese momento, ver una alternativa que multiplica la productividad sin contratar es irresistible.`,
    cfo: `Una auditoría externa encuentra discrepancias en conciliación. O su equipo contable hace 32 horas/mes manual investigando transferencias mal referenciadas. Ese dolor es el detonador.`,
    other: `Reconoce que el motor comercial actual no es escalable. ${top}`,
  };
  return triggers[segment];
}

function preferredChannels(segment: LeadSegment): ChannelType[] {
  const map: Record<LeadSegment, ChannelType[]> = {
    founder_young: ["twitter_engage", "linkedin_dm", "whatsapp_voice", "linkedin_voice"],
    founder_scaleup: ["linkedin_dm", "whatsapp_text", "email", "linkedin_voice"],
    vp_sales: ["linkedin_voice", "email", "linkedin_dm", "whatsapp_text"],
    cfo: ["email", "linkedin_dm", "whatsapp_text", "linkedin_voice"],
    other: ["linkedin_dm", "email", "whatsapp_text"],
  };
  return map[segment];
}

function recommendedOpening(segment: LeadSegment, lead: LeadCtx): string {
  const fn = firstName(lead.full_name);
  const post = lead.recent_activity?.[0]?.text?.slice(0, 100) || "";

  const openings: Record<LeadSegment, string[]> = {
    founder_young: [
      `${fn}, te leí esto: "${post}". Eso del cold email en LATAM lo vivimos. Tenemos algo que justo ataca eso.`,
      `${fn}, tu post sobre escalar sin contratar 5 más me lo guardé. Construimos un motor para ese problema exacto.`,
    ],
    founder_scaleup: [
      `${fn}, vi tu post sobre el CAC. Tengo un dato puntual del benchmark LATAM 2026 que creo te suma. ¿Te lo paso?`,
      `${fn}, leí lo que escribiste sobre crecimiento predecible. Quiero mostrarte 2 minutos cómo lo están resolviendo founders de tu mismo stage.`,
    ],
    vp_sales: [
      `${fn}, el dato que mencionas en tu post (SDR 60% en tareas manuales) lo cruzamos con 47 equipos en LATAM. La cifra real es 71%. Te dejo el breakdown.`,
      `${fn}, hablo con VPs de Sales todas las semanas. Tu post sobre la queja del SDR me lo encontré literal en 4 equipos. Tenemos algo para esa fuga.`,
    ],
    cfo: [
      `${fn}, su post sobre las 32 horas/mes en investigar transferencias me llamó. Tenemos un caso de un cliente con un volumen similar que pasó de 32 a 3 horas en 6 semanas. ¿Le envío el caso?`,
      `${fn}, lo que describe del cierre con 3 días de retraso es exactamente el caso que resolvemos en Zolvo. ¿Tendría 10 minutos esta semana para mostrarle números reales?`,
    ],
    other: [
      `${fn}, quería contactarte por algo específico que vi en tu perfil. ¿Tienes 2 minutos?`,
    ],
  };

  const list = openings[segment];
  return list[Math.abs(fn.charCodeAt(0)) % list.length];
}

export function classifyLeadFallback(lead: LeadCtx) {
  const segment = inferSegment(lead);
  const journey_stage = inferJourneyStage(lead);
  const pain_points = detectPains(lead);
  const baseScore =
    journey_stage === "active_frustration"
      ? 78
      : journey_stage === "searching"
      ? 65
      : journey_stage === "evaluating"
      ? 80
      : 45;
  const intent_score = Math.min(
    100,
    baseScore + (pain_points.some((p) => p.severity === "critical") ? 12 : 0)
  );
  return {
    segment,
    segment_confidence: 0.85,
    journey_stage,
    intent_score,
    pain_points,
    preferred_channels: preferredChannels(segment),
    emotional_trigger: inferTrigger(segment, pain_points),
    recommended_opening: recommendedOpening(segment, lead),
    reasoning: `Inferencia determinística basada en patrones detectados en perfil + actividad reciente. Segment=${segment}, stage=${journey_stage}. Pain points: ${pain_points
      .map((p) => p.text)
      .join("; ")}.`,
  };
}

const VOICE_TEMPLATES: Record<LeadSegment, (lead: LeadCtx, fn: string) => string> = {
  founder_young: (lead, fn) =>
    `Hola ${fn}, soy del equipo de Zolvo. Te escribí porque vi tu post sobre lo difícil que es hacer outbound manual en LATAM. Y la verdad, te entiendo. Construimos algo que ataca exactamente ese dolor. ¿Te paso un mensaje rápido para que veas si te suma?`,
  founder_scaleup: (lead, fn) =>
    `Hola ${fn}, te escribo por tu post de esta semana. Como founder de scale-up, ese tema del CAC subiendo me sonó muy familiar. Tenemos un sistema que ya está corriendo en 14 empresas como ${
      lead.company_name || "la tuya"
    }. ¿Te interesa que te muestre los números?`,
  vp_sales: (lead, fn) =>
    `Hola ${fn}, hablo con muchos VPs de Sales en LATAM. Tu observación de que el SDR pasa 60% del tiempo en tareas manuales — la cifra real es 71%. Te dejo un caso de un equipo de 14 SDRs en México que multiplicó pipeline sin contratar.`,
  cfo: (lead, fn) =>
    `Hola ${fn}, leí su post sobre las 32 horas mensuales en conciliación. Tenemos un cliente con volumen similar al de ${
      lead.company_name || "ustedes"
    } que pasó de 32 a 3 horas en 6 semanas. ¿Le envío el caso por email para que lo revise tranquilo?`,
  other: (lead, fn) =>
    `Hola ${fn}, le escribo desde Zolvo. Vi su perfil y creo que algo que estamos haciendo le puede sumar. ¿Tiene 30 segundos para revisar?`,
};

const TEXT_TEMPLATES: Record<LeadSegment, (lead: LeadCtx, fn: string) => string> = {
  founder_young: (lead, fn) =>
    `${fn}, te leí esto:\n\n"${(lead.recent_activity?.[0]?.text || "").slice(0, 140)}"\n\nLo del cold email en LATAM lo vemos en todos los founders YC con los que hablamos. Te muestro en 2 minutos cómo founders en tu mismo stage están armando pipeline sin contratar SDRs.\n\n¿Te paso un loom?`,
  founder_scaleup: (lead, fn) =>
    `${fn}, tu post sobre crecimiento predecible me lo guardé. Tengo el benchmark CAC 2026 LATAM por industria, creo te suma. ¿Te lo paso por aquí o por mail?`,
  vp_sales: (lead, fn) =>
    `${fn}, viste el dato de 60% tareas manuales. En el último benchmark de Zolvo con 47 equipos B2B en LATAM, la cifra real es 71%. Te dejo el breakdown por industria y un caso de ${
      lead.company_name || "una empresa similar"
    } que recuperó esas horas.\n\n¿Lo revisamos 15 min esta semana?`,
  cfo: (lead, fn) =>
    `${fn}, su post sobre las 32 horas/mes en conciliación bancaria me hizo escribirle directamente. Atendemos a una distribuidora con volumen similar a ${
      lead.company_name || "Distribuidora del Valle"
    } que redujo eso a 3 horas usando reconciliación automática IA.\n\n¿Le envío el caso por email?`,
  other: (lead, fn) =>
    `${fn}, vi su perfil y quería compartirle algo concreto que creo le suma. ¿Tiene un minuto?`,
};

const EMAIL_TEMPLATES: Record<
  LeadSegment,
  (lead: LeadCtx, fn: string) => { subject: string; body: string }
> = {
  founder_young: (lead, fn) => ({
    subject: `${fn}, el motor de outbound que NO se siente outbound`,
    body: `${fn},\n\nVi tu post de esta semana: "${(lead.recent_activity?.[0]?.text || "").slice(0, 120)}".\n\nLa lección que sacamos hablando con +30 founders de YC LATAM: el cold email no funciona porque el comprador LATAM vive en WhatsApp, no en email. Y los SDRs queman runway.\n\nConstruimos Zolvo para resolver eso: identifica leads, los califica, y los aborda por el canal que ellos sí abren (incluyendo voice notes con IA). Founders en tu mismo stage están armando pipeline en 48h sin contratar.\n\n¿Te muestro en 5 min cómo se ve en tu mercado?\n\n— Andrés`,
  }),
  founder_scaleup: (lead, fn) => ({
    subject: `${fn}, benchmark CAC LATAM 2026 para ${lead.company_name || "tu vertical"}`,
    body: `${fn},\n\nTe leo seguido. Tu post sobre crecimiento predecible coincide con lo que estamos viendo: el CAC en LATAM subió 38% en 18 meses, pero el LTV creció solo 12%.\n\nTenemos un sistema que ataca esa brecha automatizando el 80% del motor comercial. Empresas como ${
      lead.company_name || "la tuya"
    } están viendo reducciones de 40-65% en costo por lead calificado.\n\nTe paso el breakdown si quieres, o lo vemos en 15 minutos. Tu llamada.\n\n— Andrés`,
  }),
  vp_sales: (lead, fn) => ({
    subject: `${fn}: 71% del tiempo de tus SDRs está en tareas que no convierten`,
    body: `${fn},\n\nDirecto al grano: medimos productividad real en 47 equipos B2B en LATAM. El SDR promedio dedica 71% del tiempo a tareas no productivas (data entry, prospecting manual, seguimiento).\n\nTu post mencionaba 60% — la realidad es peor. Y el costo de oportunidad ronda los $4.2k/mes por SDR.\n\nLa propuesta: que tus SDRs pasen el 80% del tiempo en cierre y discovery. Lo demás lo automatiza Zolvo (con IA indistinguible de humano).\n\n¿15 min esta semana para revisar tu pipeline actual y el potencial?\n\n— Andrés`,
  }),
  cfo: (lead, fn) => ({
    subject: `Cierre mensual en 3 horas en lugar de 32`,
    body: `Estimado ${fn},\n\nVi su post sobre las 32 horas/mes en conciliación bancaria. Es un dato que escuchamos en muchos CFOs en LATAM, especialmente cuando un alto volumen de facturas se consolida en transferencias o llega con referencias erradas.\n\nEn Zolvo construimos un motor de reconciliación que cruza facturas vs transferencias automáticamente, incluso cuando son pagos parciales o consolidados. Una distribuidora con volumen similar al de ${
      lead.company_name || "Distribuidora del Valle"
    } pasó de 32 a 3 horas en 6 semanas.\n\nLe adjunto el caso de estudio (1 página). Si le hace sentido, podemos hacer un POC de 2 semanas con datos reales suyos.\n\nQuedo atento,\n— Andrés`,
  }),
  other: (lead, fn) => ({
    subject: `${fn}, una idea concreta para ${lead.company_name || "ti"}`,
    body: `${fn},\n\nVi tu perfil y quería compartirte una idea concreta que creo te suma.\n\n¿Te paso más contexto?\n\n— Andrés`,
  }),
};

export function personalizeMessageFallback(opts: {
  lead: LeadCtx & { segment: LeadSegment };
  channel: ChannelType;
  sequence_step: number;
}) {
  const lead = opts.lead;
  const seg = lead.segment;
  const fn = firstName(lead.full_name);

  const isVoice =
    opts.channel === "whatsapp_voice" || opts.channel === "linkedin_voice";

  if (opts.channel === "email") {
    const e = EMAIL_TEMPLATES[seg](lead, fn);
    return {
      channel: opts.channel,
      subject: e.subject,
      body: e.body,
      voice_script: undefined,
      cta: "Responder al email para revisar el caso o agendar una llamada de 15 minutos.",
      reasoning: `Email personalizado para segmento ${seg}: subject con dato puntual, cuerpo 100 palabras, PD opcional. Tono LATAM cercano y profesional.`,
      emotional_hook:
        seg === "cfo"
          ? "control y predictibilidad"
          : seg === "vp_sales"
          ? "presión por quota"
          : "fatiga del crecimiento",
    };
  }

  const text = TEXT_TEMPLATES[seg](lead, fn);

  if (isVoice) {
    const voice = VOICE_TEMPLATES[seg](lead, fn);
    return {
      channel: opts.channel,
      body: text,
      voice_script: voice,
      cta:
        seg === "cfo"
          ? "Acceder a caso de estudio detallado por email"
          : "Aceptar Loom de 2 minutos con demo",
      reasoning: `Voice script para ${opts.channel}: 30-45s, tono conversacional LATAM, menciona nombre y dolor específico del lead. Optimizado para ElevenLabs eleven_multilingual_v2.`,
      emotional_hook:
        seg === "founder_young"
          ? "comunión peer-to-peer"
          : seg === "vp_sales"
          ? "reconocimiento de su problema"
          : "calidez sin presión",
    };
  }

  return {
    channel: opts.channel,
    body: text,
    voice_script: undefined,
    cta:
      opts.channel === "whatsapp_text"
        ? "Aceptar que le pasemos un loom o un caso de éxito"
        : "Conectar para una conversación corta",
    reasoning: `Mensaje texto para canal ${opts.channel}, segmento ${seg}: cita post real del lead, contextualiza con dato puntual, CTA suave.`,
    emotional_hook:
      seg === "founder_young"
        ? "comunión peer-to-peer"
        : seg === "founder_scaleup"
        ? "presión de crecimiento"
        : seg === "vp_sales"
        ? "alivio de carga operativa"
        : "control y precisión",
  };
}

export async function tryWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => T
): Promise<{ value: T; usedFallback: boolean; error?: string }> {
  try {
    const value = await primary();
    return { value, usedFallback: false };
  } catch (err) {
    console.warn("LLM call failed, using fallback:", (err as Error).message);
    return {
      value: fallback(),
      usedFallback: true,
      error: (err as Error).message,
    };
  }
}
