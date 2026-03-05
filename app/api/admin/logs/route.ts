import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";

const PAGE_SIZE = 50;

// ── GET — paginated activity logs ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const category = searchParams.get("category") ?? "";

  try {
    let query = adminDb
      .collection("logs")
      .orderBy("createdAt", "desc");

    if (category && ["auth", "admin", "contact"].includes(category)) {
      query = query.where("category", "==", category) as typeof query;
    }

    const snapshot = await query.get();
    const all = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        action: d.action ?? "",
        category: d.category ?? "",
        actor: d.actor ?? "",
        target: d.target ?? null,
        details: d.details ?? null,
        ip: d.ip ?? null,
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const logs = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return NextResponse.json({ logs, total, page: safePage, totalPages });
  } catch (err) {
    console.error("[logs GET]", err);
    return NextResponse.json({ error: "Failed to fetch logs." }, { status: 500 });
  }
}
