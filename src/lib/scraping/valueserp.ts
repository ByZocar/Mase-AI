const API_KEY = process.env.VALUESERP_API_KEY!;
const BASE = "https://api.valueserp.com/search";

export type SerpResult = {
  position: number;
  title: string;
  link: string;
  domain?: string;
  snippet: string;
  date?: string;
};

export async function valueserpSearch(opts: {
  query: string;
  location?: string;
  num?: number;
  searchType?: "web" | "news";
}): Promise<SerpResult[]> {
  if (!API_KEY) throw new Error("VALUESERP_API_KEY missing");

  const url = new URL(BASE);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("q", opts.query);
  url.searchParams.set("num", String(opts.num ?? 10));
  if (opts.location) url.searchParams.set("location", opts.location);
  if (opts.searchType === "news") {
    url.searchParams.set("search_type", "news");
  }

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error(`ValueSerp failed: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();

  const items: SerpResult[] =
    opts.searchType === "news"
      ? ((data.news_results || []) as SerpResult[])
      : ((data.organic_results || []) as SerpResult[]);

  return items.map((it, idx) => ({
    position: it.position ?? idx + 1,
    title: it.title ?? "",
    link: it.link ?? "",
    domain: it.domain,
    snippet: it.snippet ?? "",
    date: it.date,
  }));
}

export async function researchCompany(companyName: string, country?: string) {
  const [web, news] = await Promise.all([
    valueserpSearch({
      query: `${companyName} ${country ?? ""} sitio oficial`,
      num: 5,
    }),
    valueserpSearch({
      query: `${companyName} ${country ?? ""}`,
      num: 5,
      searchType: "news",
    }),
  ]);
  return { web, news };
}

export async function findHiringSignals(companyName: string) {
  return valueserpSearch({
    query: `"${companyName}" hiring SDR OR "sales development" OR "ventas" site:linkedin.com`,
    num: 5,
  });
}
