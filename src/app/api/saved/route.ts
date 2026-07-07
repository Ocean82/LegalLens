import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedResults, legalResults } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { resultId, notes, folder } = await req.json();
    if (!resultId) return NextResponse.json({ error: "Result ID required" }, { status: 400 });

    const [saved] = await db.insert(savedResults).values({
      userId,
      resultId,
      notes: notes || null,
      folder: folder || "General",
    }).returning();

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const saved = await db.select({
      id: savedResults.id,
      notes: savedResults.notes,
      folder: savedResults.folder,
      createdAt: savedResults.createdAt,
      resultId: savedResults.resultId,
      resultTitle: legalResults.title,
      resultSummary: legalResults.summary,
      resultSourceUrl: legalResults.sourceUrl,
      resultSourceName: legalResults.sourceName,
      resultJurisdiction: legalResults.jurisdiction,
      resultCategory: legalResults.category,
      resultCourt: legalResults.court,
      resultCaseNumber: legalResults.caseNumber,
    })
      .from(savedResults)
      .innerJoin(legalResults, eq(savedResults.resultId, legalResults.id))
      .where(eq(savedResults.userId, userId))
      .orderBy(desc(savedResults.createdAt));

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("Get saved error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
