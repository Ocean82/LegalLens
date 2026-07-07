import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { researchNotes } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, content, jurisdiction, category } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const [note] = await db.insert(researchNotes).values({
      userId,
      title,
      content,
      jurisdiction: jurisdiction || null,
      category: category || null,
    }).returning();

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notes = await db.select()
      .from(researchNotes)
      .where(eq(researchNotes.userId, userId))
      .orderBy(desc(researchNotes.pinned), desc(researchNotes.updatedAt));

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
