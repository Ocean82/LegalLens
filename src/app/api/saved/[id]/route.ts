import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedResults } from "@/db/schema";
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
    const { notes, folder } = await req.json();
    const [updated] = await db.update(savedResults)
      .set({ notes, folder })
      .where(and(eq(savedResults.id, id), eq(savedResults.userId, userId)))
      .returning();

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ saved: updated });
  } catch (error) {
    console.error("Update saved error:", error);
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
    await db.delete(savedResults)
      .where(and(eq(savedResults.id, id), eq(savedResults.userId, userId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete saved error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
