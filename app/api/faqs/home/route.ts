import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// ── GET — public endpoint: return FAQs selected for home page ─────────────────
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("faqs")
      .where("selectedForHome", "==", true)
      .get();

    const faqs = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          q: d.question ?? "",
          a: d.answer ?? "",
          order: d.order ?? 0,
        };
      })
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map(({ q, a }) => ({ q, a }));

    return NextResponse.json({ faqs });
  } catch (err) {
    console.error("[faqs/home GET]", err);
    return NextResponse.json({ faqs: [] });
  }
}
