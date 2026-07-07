import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { searches, legalResults } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const [search] = await db.select()
      .from(searches)
      .where(and(eq(searches.id, id), eq(searches.userId, userId)))
      .limit(1);

    if (!search) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const results = await db.select()
      .from(legalResults)
      .where(eq(legalResults.searchId, id));

    return NextResponse.json({ search, results });
  } catch (error) {
    console.error("Get search error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await db.delete(searches)
      .where(and(eq(searches.id, id), eq(searches.userId, userId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete search error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
