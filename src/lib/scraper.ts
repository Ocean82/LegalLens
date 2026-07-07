import * as cheerio from "cheerio";

export interface ScrapedResult {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  caseNumber?: string;
  dateFiled?: string;
  court?: string;
  status?: string;
}

// Scrape Google Scholar for legal case results
async function scrapeGoogleScholar(query: string, jurisdiction: string): Promise<ScrapedResult[]> {
  const results: ScrapedResult[] = [];
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://scholar.google.com/scholar?q=${encodedQuery}+law+${jurisdiction.replace(/_/g, "+")}+legal&hl=en&as_sdt=6`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return results;
    const html = await response.text();
    const $ = cheerio.load(html);
    $(".gs_ri").each((_i, el) => {
      const title = $(el).find(".gs_rt a").text().trim() || $(el).find(".gs_rt").text().trim();
      const summary = $(el).find(".gs_rs").text().trim();
      const href = $(el).find(".gs_rt a").attr("href") || "";
      const meta = $(el).find(".gs_a").text().trim();
      if (title && summary) {
        results.push({
          title,
          summary: summary.substring(0, 500),
          sourceUrl: href,
          sourceName: "Google Scholar",
          court: meta || undefined,
        });
      }
    });
  } catch (e) {
    console.error("Google Scholar scrape error:", e);
  }
  return results;
}

// Scrape CourtListener for case law
async function scrapeCourtListener(query: string, _jurisdiction: string): Promise<ScrapedResult[]> {
  const results: ScrapedResult[] = [];
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.courtlistener.com/?q=${encodedQuery}&type=o&order_by=score+desc`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return results;
    const html = await response.text();
    const $ = cheerio.load(html);
    $("article.v-offset--below--2, .search-result").each((_i, el) => {
      const title = $(el).find("h3 a, .result-title a").first().text().trim();
      const href = $(el).find("h3 a, .result-title a").first().attr("href") || "";
      const summary = $(el).find(".inline, .result-excerpt").text().trim();
      const court = $(el).find(".court, .meta-data-header").text().trim();
      const dateFiled = $(el).find(".date-filed, time").text().trim();
      if (title) {
        results.push({
          title,
          summary: summary.substring(0, 500) || `Legal opinion regarding ${query}`,
          sourceUrl: href.startsWith("http") ? href : `https://www.courtlistener.com${href}`,
          sourceName: "CourtListener",
          court: court || undefined,
          dateFiled: dateFiled || undefined,
        });
      }
    });
  } catch (e) {
    console.error("CourtListener scrape error:", e);
  }
  return results;
}

// Scrape Cornell Law Institute
async function scrapeCornellLaw(query: string): Promise<ScrapedResult[]> {
  const results: ScrapedResult[] = [];
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.law.cornell.edu/search/site/${encodedQuery}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return results;
    const html = await response.text();
    const $ = cheerio.load(html);
    $(".search-result, .views-row, li.search-result").each((_i, el) => {
      const title = $(el).find("h3 a, .title a, a").first().text().trim();
      const href = $(el).find("h3 a, .title a, a").first().attr("href") || "";
      const snippet = $(el).find(".search-snippet, .snippet, p").text().trim();
      if (title && title.length > 5) {
        results.push({
          title,
          summary: snippet.substring(0, 500) || `Cornell Legal Information Institute: ${title}`,
          sourceUrl: href.startsWith("http") ? href : `https://www.law.cornell.edu${href}`,
          sourceName: "Cornell Law Institute",
        });
      }
    });
  } catch (e) {
    console.error("Cornell Law scrape error:", e);
  }
  return results;
}

// Scrape Justia for state law
async function scrapeJustia(query: string, jurisdiction: string): Promise<ScrapedResult[]> {
  const results: ScrapedResult[] = [];
  try {
    const stateSlug = jurisdiction === "federal" ? "" : jurisdiction.replace(/_/g, "-");
    const encodedQuery = encodeURIComponent(query);
    const url = stateSlug
      ? `https://law.justia.com/${stateSlug}/`
      : `https://www.justia.com/search?q=${encodedQuery}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return results;
    const html = await response.text();
    const $ = cheerio.load(html);
    $(".result, .has-padding-content-block-30, a[href]").slice(0, 10).each((_i, el) => {
      const title = $(el).find("a").first().text().trim() || $(el).text().trim();
      const href = $(el).find("a").first().attr("href") || $(el).attr("href") || "";
      const snippet = $(el).find(".result-snippet, p, .snippet").text().trim();
      if (title && title.length > 5 && href.includes("justia")) {
        results.push({
          title: title.substring(0, 200),
          summary: snippet.substring(0, 500) || `Justia legal resource: ${title}`,
          sourceUrl: href.startsWith("http") ? href : `https://www.justia.com${href}`,
          sourceName: "Justia",
        });
      }
    });
  } catch (e) {
    console.error("Justia scrape error:", e);
  }
  return results;
}

export async function scrapeAllSources(
  query: string,
  jurisdiction: string
): Promise<ScrapedResult[]> {
  // Run all scrapers in parallel
  const [scholarResults, courtListenerResults, cornellResults, justiaResults] =
    await Promise.allSettled([
      scrapeGoogleScholar(query, jurisdiction),
      scrapeCourtListener(query, jurisdiction),
      scrapeCornellLaw(query),
      scrapeJustia(query, jurisdiction),
    ]);

  const allResults: ScrapedResult[] = [];

  if (scholarResults.status === "fulfilled") allResults.push(...scholarResults.value);
  if (courtListenerResults.status === "fulfilled") allResults.push(...courtListenerResults.value);
  if (cornellResults.status === "fulfilled") allResults.push(...cornellResults.value);
  if (justiaResults.status === "fulfilled") allResults.push(...justiaResults.value);

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allResults.filter((r) => {
    const key = r.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, 20);
}
