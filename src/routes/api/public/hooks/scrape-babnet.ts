import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { TUNISIAN_GOVERNORATES } from "@/data/tunisia-divisions";

// Scrapes Babnet RSS every ~12h (via pg_cron), asks Gemini to extract water-related
// outages, and inserts them into the outages table with source='babnet_ai'.
// Dedupes on source_url so re-runs never re-insert or re-charge Gemini for the same item.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization",
};

// Keyword prefilter — items must contain one of these to reach Gemini. Saves quota.
const WATER_KEYWORDS = [
  "eau", "coupure", "pression", "sonede", "distribution", "potable",
  "ماء", "مياه", "انقطاع", "الصوناد", "التزود", "الشرب",
];

type RssItem = { title: string; link: string; description: string; pubDate: string };

type ExtractedOutage = {
  source_url: string;
  governorate_id: string;
  delegation_id: string;
  problem_type: "water_cut" | "low_pressure" | "contamination" | "leak";
  description: string;
  description_ar: string;
  start_time?: string;
};

export const Route = createFileRoute("/api/public/hooks/scrape-babnet")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async () => {
        try {
          const result = await run();
          return json(200, result);
        } catch (e) {
          console.error("[scrape-babnet] fatal", e);
          return json(500, { error: (e as Error).message });
        }
      },
    },
  },
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

async function run() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!apiKey) throw new Error("GOOGLE_API_KEY not configured");



  // 1. Fetch RSS
  const rssRes = await fetch("https://www.babnet.net/feed.php", {
    headers: { "User-Agent": "FammaMa/1.0 (+https://famma-ma.lovable.app)" },
  });
  if (!rssRes.ok) throw new Error(`Babnet RSS ${rssRes.status}`);
  const xml = await rssRes.text();
  const items = parseRss(xml);

  // 2. Prefilter by keywords (cheap, no AI)
  const candidates = items.filter((it) => {
    const hay = (it.title + " " + it.description).toLowerCase();
    return WATER_KEYWORDS.some((k) => hay.includes(k));
  });

  if (candidates.length === 0) {
    return { scanned: items.length, candidates: 0, new: 0, inserted: 0 };
  }

  // 3. Dedupe against DB
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const links = candidates.map((c) => c.link);
  const { data: existing } = await supabase
    .from("outages")
    .select("source_url")
    .in("source_url", links);
  const seen = new Set((existing ?? []).map((r) => r.source_url));
  const fresh = candidates.filter((c) => !seen.has(c.link));

  if (fresh.length === 0) {
    return { scanned: items.length, candidates: candidates.length, new: 0, inserted: 0 };
  }

  // 4. Ask Gemini to extract structured outages (batched — 1 request for all items)
  const extracted = await extractWithGemini(apiKey, fresh);

  if (extracted.length === 0) {
    return {
      scanned: items.length,
      candidates: candidates.length,
      new: fresh.length,
      inserted: 0,
    };
  }

  // 5. Insert
  const rows = extracted.map((e) => ({
    governorate_id: e.governorate_id,
    delegation_id: e.delegation_id,
    problem_type: e.problem_type,
    description: e.description.slice(0, 500),
    description_ar: (e.description_ar || e.description).slice(0, 500),
    reporter_device: "babnet_ai",
    source: "babnet_ai",
    source_url: e.source_url,
    start_time: e.start_time ?? new Date().toISOString(),
  }));

  const { error, count } = await supabase
    .from("outages")
    .insert(rows, { count: "exact" });

  if (error) {
    console.error("[scrape-babnet] insert error", error);
    throw new Error(`insert failed: ${error.message}`);
  }

  return {
    scanned: items.length,
    candidates: candidates.length,
    new: fresh.length,
    inserted: count ?? rows.length,
  };
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRe = /<item[\s\S]*?<\/item>/g;
  const chunks = xml.match(itemRe) ?? [];
  for (const c of chunks) {
    items.push({
      title: pick(c, "title"),
      link: pick(c, "link"),
      description: stripHtml(pick(c, "description")),
      pubDate: pick(c, "pubDate"),
    });
  }
  return items;
}

function pick(chunk: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = chunk.match(re);
  if (!m) return "";
  return m[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .trim();
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function extractWithGemini(apiKey: string, items: RssItem[]): Promise<ExtractedOutage[]> {
  // Build a compact governorate list for the model
  const govList = TUNISIAN_GOVERNORATES.map((g) => {
    const dels = g.delegations.map((d) => `${d.id}(${d.name.fr})`).join(", ");
    return `- ${g.id} (${g.name.fr} / ${g.name.ar}): ${dels}`;
  }).join("\n");

  const articles = items
    .map((it, i) => `[${i}] URL=${it.link}\nTITRE: ${it.title}\nRESUME: ${it.description}`)
    .join("\n\n");

  const prompt = `Tu analyses des articles de presse tunisiens pour détecter les incidents liés à l'eau potable (coupures, basse pression, contamination, fuites) causés par SONEDE ou infrastructure.

Gouvernorats et délégations disponibles (utilise EXACTEMENT ces IDs):
${govList}

Types de problèmes autorisés:
- water_cut (coupure d'eau)
- low_pressure (basse pression)
- contamination (eau contaminée / non potable)
- leak (fuite)

Articles:
${articles}

Retourne UNIQUEMENT un JSON valide (aucun texte autour, aucun markdown) de cette forme:
{"outages":[{"source_url":"...","governorate_id":"...","delegation_id":"...","problem_type":"water_cut","description":"résumé en français 1 phrase","description_ar":"ملخّص بالعربية في جملة واحدة"}]}

Règles strictes:
- N'inclus QUE les articles qui parlent réellement d'un problème d'eau en cours ou récent en Tunisie.
- Ignore les articles politiques, sportifs, ou sans lien avec l'eau potable.
- governorate_id et delegation_id doivent EXACTEMENT correspondre à la liste ci-dessus.
- Si tu ne peux pas identifier la délégation, choisis la première délégation du gouvernorat.
- "description" DOIT être en français et "description_ar" DOIT être en arabe (traduction fidèle du même résumé). Les deux sont obligatoires.
- Si aucun article n'est pertinent, retourne {"outages":[]}.`;

  // Google Generative Language API — direct call with GOOGLE_API_KEY
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{ text: "You extract structured JSON. Return only valid JSON, no markdown, no prose." }],
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("[scrape-babnet] gemini error", res.status, t);
    if (res.status === 429) throw new Error("Rate limit reached — try again later");
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";



  let parsed: { outages?: ExtractedOutage[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[scrape-babnet] gemini returned non-json:", raw.slice(0, 300));
    return [];
  }

  const govIds = new Set(TUNISIAN_GOVERNORATES.map((g) => g.id));
  const delMap = new Map<string, Set<string>>();
  for (const g of TUNISIAN_GOVERNORATES) {
    delMap.set(g.id, new Set(g.delegations.map((d) => d.id)));
  }
  const validTypes = new Set(["water_cut", "low_pressure", "contamination", "leak"]);
  const validUrls = new Set(items.map((i) => i.link));

  const out: ExtractedOutage[] = [];
  for (const o of parsed.outages ?? []) {
    if (!o?.source_url || !validUrls.has(o.source_url)) continue;
    if (!govIds.has(o.governorate_id)) continue;
    const dels = delMap.get(o.governorate_id);
    let delId = o.delegation_id;
    if (!dels?.has(delId)) {
      // fallback: pick first delegation of that gov
      const gov = TUNISIAN_GOVERNORATES.find((g) => g.id === o.governorate_id);
      delId = gov?.delegations[0]?.id ?? delId;
    }
    if (!validTypes.has(o.problem_type)) continue;
    out.push({
      source_url: o.source_url,
      governorate_id: o.governorate_id,
      delegation_id: delId,
      problem_type: o.problem_type,
      description: (o.description ?? "").trim() || "Signalement extrait d'un article de presse",
      description_ar: (o.description_ar ?? "").trim() || "بلاغ مستخرج من مقال صحفي",
    });
  }
  return out;
}
