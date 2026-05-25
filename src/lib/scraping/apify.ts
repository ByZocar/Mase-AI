import { ApifyClient } from "apify-client";

const token = process.env.APIFY_API_KEY!;
if (!token) console.warn("APIFY_API_KEY not set");

export const apify = new ApifyClient({ token });

export type ApifyLinkedInProfile = {
  url?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  jobTitle?: string;
  companyName?: string;
  companyUrl?: string;
  location?: string;
  country?: string;
  about?: string;
  experiences?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  recent_posts?: Array<{ text: string; url?: string; reactionsCount?: number }>;
  followersCount?: number;
  connectionsCount?: number;
  email?: string;
  raw?: Record<string, unknown>;
};

const LINKEDIN_PROFILE_ACTOR =
  process.env.APIFY_LINKEDIN_PROFILE_ACTOR || "dev_fusion/linkedin-profile-scraper";

const LINKEDIN_SEARCH_ACTOR =
  process.env.APIFY_LINKEDIN_SEARCH_ACTOR ||
  "curious_coder/linkedin-people-search-scraper";

export async function searchLinkedInPeople(opts: {
  search: string;
  country?: string;
  maxResults?: number;
}): Promise<ApifyLinkedInProfile[]> {
  const run = await apify.actor(LINKEDIN_SEARCH_ACTOR).call({
    queries: [opts.search],
    maxResults: opts.maxResults ?? 10,
    proxyConfiguration: { useApifyProxy: true },
  });

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  return (items as ApifyLinkedInProfile[]).map((p) => ({
    ...p,
    raw: p as unknown as Record<string, unknown>,
  }));
}

export async function scrapeLinkedInProfile(
  profileUrl: string
): Promise<ApifyLinkedInProfile | null> {
  const run = await apify.actor(LINKEDIN_PROFILE_ACTOR).call({
    profileUrls: [profileUrl],
    proxyConfiguration: { useApifyProxy: true },
  });

  const { items } = await apify.dataset(run.defaultDatasetId).listItems();
  const first = items[0] as ApifyLinkedInProfile | undefined;
  if (!first) return null;
  return { ...first, raw: first as unknown as Record<string, unknown> };
}

export function buildDemoProfiles(): ApifyLinkedInProfile[] {
  return [
    {
      url: "https://www.linkedin.com/in/maria-fernanda-rojas",
      fullName: "María Fernanda Rojas",
      firstName: "María Fernanda",
      lastName: "Rojas",
      headline: "Co-founder & CEO at Pagomatic | YC W25 | Fintech Colombia",
      jobTitle: "Co-founder & CEO",
      companyName: "Pagomatic",
      location: "Bogotá, Colombia",
      country: "Colombia",
      about:
        "Construyendo Pagomatic, la pasarela de pagos para pymes en LATAM. Antes en Rappi growth. Obsesionada con CAC, retention y el churn invisible.",
      experiences: [
        { title: "Co-founder & CEO", company: "Pagomatic", duration: "2024 - presente" },
        { title: "Growth Lead", company: "Rappi", duration: "2021 - 2024" },
      ],
      recent_posts: [
        {
          text: "Llevamos 8 meses haciendo outbound manual. Tenemos 2 SDRs y honestamente, los dos están agotados. ¿Alguien con experiencia escalando ventas B2B sin contratar 5 personas más?",
          reactionsCount: 89,
        },
        {
          text: "El CAC en LATAM no es un problema técnico, es un problema cultural. Vender por email a alguien que vive en WhatsApp no funciona.",
          reactionsCount: 412,
        },
      ],
      followersCount: 4820,
    },
    {
      url: "https://www.linkedin.com/in/carlos-mendoza-cfo",
      fullName: "Carlos Mendoza",
      firstName: "Carlos",
      lastName: "Mendoza",
      headline: "CFO at Distribuidora del Valle S.A.S.",
      jobTitle: "CFO",
      companyName: "Distribuidora del Valle S.A.S.",
      location: "Cali, Colombia",
      country: "Colombia",
      about:
        "Director Financiero con 18 años en industria de distribución. Procesamos +600 facturas mensuales. Pasé los últimos 6 meses migrando ERP.",
      experiences: [
        { title: "CFO", company: "Distribuidora del Valle", duration: "2019 - presente" },
        { title: "Controller", company: "Grupo Éxito", duration: "2014 - 2019" },
      ],
      recent_posts: [
        {
          text: "Cierre mensual otra vez con 3 días de retraso. Cuando una transferencia consolida 4 facturas y nadie nos avisa, el equipo contable termina haciendo de detective.",
          reactionsCount: 67,
        },
      ],
      followersCount: 1430,
    },
    {
      url: "https://www.linkedin.com/in/andres-velez-ventas",
      fullName: "Andrés Vélez",
      firstName: "Andrés",
      lastName: "Vélez",
      headline: "VP of Sales LATAM at Kueski | Building world-class sales teams",
      jobTitle: "VP of Sales",
      companyName: "Kueski",
      location: "Ciudad de México, México",
      country: "México",
      about:
        "VP Sales liderando equipo de 14 reps en MX, CO y AR. ICP: fintech y empresas con +500 empleados.",
      experiences: [
        { title: "VP of Sales", company: "Kueski", duration: "2022 - presente" },
        { title: "Director of Sales", company: "Konfío", duration: "2019 - 2022" },
      ],
      recent_posts: [
        {
          text: "Hablé con 4 VPs de Sales esta semana. Todos tienen el mismo problema: el SDR pasa el 60% del tiempo en tareas que no son vender.",
          reactionsCount: 247,
        },
        {
          text: "Hiring: estamos buscando 2 SDRs senior en CDMX. Si conoces a alguien con experiencia en B2B fintech, DM abierto.",
          reactionsCount: 89,
        },
      ],
      followersCount: 18430,
    },
    {
      url: "https://www.linkedin.com/in/julian-castro-founder",
      fullName: "Julián Castro",
      firstName: "Julián",
      lastName: "Castro",
      headline: "Building Notar | YC S26 | Ex-Stripe | Notarial automation for LATAM",
      jobTitle: "Founder",
      companyName: "Notar",
      location: "Medellín, Colombia",
      country: "Colombia",
      about:
        "Founder de Notar. Ex-Stripe en San Francisco. Levantamos pre-seed en marzo. 27 años. Construyendo en público.",
      experiences: [
        { title: "Founder & CEO", company: "Notar", duration: "2025 - presente" },
        { title: "Software Engineer", company: "Stripe", duration: "2022 - 2025" },
      ],
      recent_posts: [
        {
          text: "Día 47 construyendo Notar. Hemos contactado a 230 notarías. Solo respondieron 6. El cold email no funciona en LATAM, definitivamente.",
          reactionsCount: 156,
        },
        {
          text: "Cosa que aprendí en YC: tu producto puede ser increíble, pero si no tienes el motor de ventas, no vas a llegar a Series A. Y los motores de ventas en USA no funcionan en LATAM.",
          reactionsCount: 523,
        },
      ],
      followersCount: 8920,
    },
    {
      url: "https://www.linkedin.com/in/laura-gomez-cfo",
      fullName: "Laura Gómez Vargas",
      firstName: "Laura",
      lastName: "Gómez Vargas",
      headline: "Directora Financiera | Conciliación bancaria | Cierre contable LATAM",
      jobTitle: "Directora Financiera",
      companyName: "Inversiones Andinas",
      location: "Lima, Perú",
      country: "Perú",
      about:
        "Lidero el área financiera de Inversiones Andinas. Equipo de 7 personas. +800 facturas/mes. Hace 2 años migramos a un ERP que no resolvió el caos de reconciliación.",
      experiences: [
        { title: "Directora Financiera", company: "Inversiones Andinas", duration: "2021 - presente" },
      ],
      recent_posts: [
        {
          text: "Hoy mi equipo me presentó el reporte: en promedio dedicamos 32 horas al mes solo a investigar transferencias bancarias mal referenciadas. 32 horas. Por mes. De gente que costó conseguir.",
          reactionsCount: 78,
        },
      ],
      followersCount: 2240,
    },
  ];
}
