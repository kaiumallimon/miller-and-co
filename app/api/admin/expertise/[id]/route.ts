import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// ── PATCH — update expertise item ─────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const docRef = adminDb.collection("expertise").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "Item not found." }, { status: 404 });

    const body = (await req.json()) as {
      label?: string;
      sub?: string | null;
      isWide?: boolean;
      order?: number;
    };

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (body.label !== undefined) {
      if (!body.label.trim()) return NextResponse.json({ error: "Label cannot be empty." }, { status: 400 });
      updates.label = body.label.trim();
    }
    if (body.sub !== undefined) {
      updates.sub = body.sub?.trim() || null;
    }
    if (body.order !== undefined) {
      updates.order = body.order;
    }

    // Enforce max 1 isWide — clear the previous wide item first
    if (body.isWide === true) {
      const currentWide = await adminDb
        .collection("expertise")
        .where("isWide", "==", true)
        .get();
      const batch = adminDb.batch();
      currentWide.docs.forEach((d) => {
        if (d.id !== id) batch.update(d.ref, { isWide: false });
      });
      await batch.commit();
      updates.isWide = true;
    } else if (body.isWide === false) {
      updates.isWide = false;
    }

    await docRef.update(updates);

    await writeLog({
      action: "expertise_updated",
      category: "admin",
      actor: user.email ?? user.uid,
      target: id,
      details: `Expertise item ${id} updated.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[expertise PATCH]", err);
    return NextResponse.json({ error: "Failed to update expertise item." }, { status: 500 });
  }
}

// ── DELETE — remove expertise item ────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const doc = await adminDb.collection("expertise").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "Item not found." }, { status: 404 });

    await adminDb.collection("expertise").doc(id).delete();

    await writeLog({
      action: "expertise_deleted",
      category: "admin",
      actor: user.email ?? user.uid,
      target: id,
      details: `Expertise item "${doc.data()?.label?.slice(0, 60)}" deleted.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[expertise DELETE]", err);
    return NextResponse.json({ error: "Failed to delete expertise item." }, { status: 500 });
  }
}
