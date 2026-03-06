import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// ── PATCH — update FAQ (question/answer/selectedForHome/order) ────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const docRef = adminDb.collection("faqs").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });

    const body = (await req.json()) as {
      question?: string;
      answer?: string;
      selectedForHome?: boolean;
      order?: number;
    };

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (body.question !== undefined) {
      if (!body.question.trim()) return NextResponse.json({ error: "Question cannot be empty." }, { status: 400 });
      updates.question = body.question.trim();
    }
    if (body.answer !== undefined) {
      if (!body.answer.trim()) return NextResponse.json({ error: "Answer cannot be empty." }, { status: 400 });
      updates.answer = body.answer.trim();
    }
    if (body.order !== undefined) {
      updates.order = body.order;
    }

    // Enforce max 5 selectedForHome
    if (body.selectedForHome !== undefined) {
      if (body.selectedForHome === true) {
        const currentlySelected = await adminDb
          .collection("faqs")
          .where("selectedForHome", "==", true)
          .get();
        const alreadySelected = currentlySelected.docs.some((d) => d.id === id);
        if (!alreadySelected && currentlySelected.size >= 5) {
          return NextResponse.json(
            { error: "Maximum 5 FAQs can be selected for the home page. Deselect one first." },
            { status: 400 }
          );
        }
      }
      updates.selectedForHome = body.selectedForHome;
    }

    await docRef.update(updates);

    await writeLog({
      action: "faq_updated",
      category: "admin",
      actor: user.email ?? user.uid,
      target: id,
      details: `FAQ ${id} updated.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[faqs PATCH]", err);
    return NextResponse.json({ error: "Failed to update FAQ." }, { status: 500 });
  }
}

// ── DELETE — remove FAQ ───────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const doc = await adminDb.collection("faqs").doc(id).get();
    if (!doc.exists) return NextResponse.json({ error: "FAQ not found." }, { status: 404 });

    await adminDb.collection("faqs").doc(id).delete();

    await writeLog({
      action: "faq_deleted",
      category: "admin",
      actor: user.email ?? user.uid,
      target: id,
      details: `FAQ "${doc.data()?.question?.slice(0, 60)}" deleted.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[faqs DELETE]", err);
    return NextResponse.json({ error: "Failed to delete FAQ." }, { status: 500 });
  }
}
