import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// ── GET — list all FAQs ───────────────────────────────────────────────────────
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const snap = await adminDb.collection("faqs").get();
    const faqs = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          question: d.question ?? "",
          answer: d.answer ?? "",
          order: d.order ?? 0,
          selectedForHome: d.selectedForHome ?? false,
          createdAt: d.createdAt ?? null,
          updatedAt: d.updatedAt ?? null,
        };
      })
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ faqs });
  } catch (err) {
    console.error("[faqs GET]", err);
    return NextResponse.json({ error: "Failed to fetch FAQs." }, { status: 500 });
  }
}

// ── POST — create new FAQ ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { question, answer } = (await req.json()) as {
      question?: string;
      answer?: string;
    };

    if (!question?.trim()) return NextResponse.json({ error: "Question is required." }, { status: 400 });
    if (!answer?.trim()) return NextResponse.json({ error: "Answer is required." }, { status: 400 });

    // Determine next order
    const snap = await adminDb.collection("faqs").get();
    const maxOrder = snap.docs.reduce((max, d) => Math.max(max, d.data().order ?? 0), 0);

    const now = new Date().toISOString();
    const docRef = await adminDb.collection("faqs").add({
      question: question.trim(),
      answer: answer.trim(),
      order: maxOrder + 1,
      selectedForHome: false,
      createdAt: now,
      updatedAt: now,
    });

    await writeLog({
      action: "faq_created",
      category: "admin",
      actor: user.email ?? user.uid,
      target: question.trim().slice(0, 60),
      details: `FAQ created: "${question.trim().slice(0, 60)}"`,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("[faqs POST]", err);
    return NextResponse.json({ error: "Failed to create FAQ." }, { status: 500 });
  }
}
