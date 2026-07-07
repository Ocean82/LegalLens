import { NextResponse } from "next/server";
import { db } from "@/db";
import { searches, legalResults, savedResults, researchNotes } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [searchCount] = await db.select({ count: count() })
      .from(searches)
      .where(eq(searches.userId, userId));

    const [resultCount] = await db.select({ count: count() })
      .from(legalResults)
      .where(eq(legalResults.userId, userId));

    const [savedCount] = await db.select({ count: count() })
      .from(savedResults)
      .where(eq(savedResults.userId, userId));

    const [noteCount] = await db.select({ count: count() })
      .from(researchNotes)
      .where(eq(researchNotes.userId, userId));

    const recentSearches = await db.select()
      .from(searches)
      .where(eq(searches.userId, userId))
      .orderBy(desc(searches.createdAt))
      .limit(5);

    return NextResponse.json({
      stats: {
        searches: searchCount.count,
        results: resultCount.count,
        saved: savedCount.count,
        notes: noteCount.count,
      },
      recentSearches,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
