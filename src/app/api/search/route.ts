import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searches, legalResults } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { scrapeAllSources } from "@/lib/scraper";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { query, jurisdiction, category } = await req.json();
    if (!query || !jurisdiction) {
      return NextResponse.json({ error: "Query and jurisdiction required" }, { status: 400 });
    }

    // Create search record
    const [search] = await db.insert(searches).values({
      userId,
      query,
      jurisdiction,
      category: category || null,
    }).returning();

    // Scrape from multiple sources
    const scraped = await scrapeAllSources(query, jurisdiction);

    // Store results
    const storedResults = [];
    for (const result of scraped) {
      const [stored] = await db.insert(legalResults).values({
        searchId: search.id,
        userId,
        title: result.title,
        summary: result.summary,
        sourceUrl: result.sourceUrl,
        sourceName: result.sourceName,
        jurisdiction,
        category: category || null,
        caseNumber: result.caseNumber || null,
        dateFiled: result.dateFiled || null,
        court: result.court || null,
        status: result.status || null,
      }).returning();
      storedResults.push(stored);
    }

    // Update search with results count
    await db.update(searches)
      .set({ resultsCount: storedResults.length })
      .where(eq(searches.id, search.id));

    return NextResponse.json({
      search: { ...search, resultsCount: storedResults.length },
      results: storedResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const history = await db.select()
      .from(searches)
      .where(eq(searches.userId, userId))
      .orderBy(desc(searches.createdAt))
      .limit(50);
    return NextResponse.json({ searches: history });
  } catch (error) {
    console.error("Get searches error:", error);
    return NextResponse.json({ error: "Failed to get searches" }, { status: 500 });
  }
}
