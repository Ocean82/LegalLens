import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { researchNotes } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.jurisdiction !== undefined) updateData.jurisdiction = body.jurisdiction || null;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.pinned !== undefined) updateData.pinned = body.pinned;

    const [updated] = await db.update(researchNotes)
      .set(updateData)
      .where(and(eq(researchNotes.id, id), eq(researchNotes.userId, userId)))
      .returning();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ note: updated });
  } catch (error) {
    console.error("Update note error:", error);
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
    await db.delete(researchNotes)
      .where(and(eq(researchNotes.id, id), eq(researchNotes.userId, userId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
