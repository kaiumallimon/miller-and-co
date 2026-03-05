import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const PAGE_SIZE = 20;

  try {
    const snapshot = await adminDb
      .collection("contacts")
      .orderBy("createdAt", "desc")
      .get();

    const all = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name ?? "",
        email: d.email ?? "",
        phone: d.phone ?? null,
        subject: d.subject ?? "",
        message: d.message ?? "",
        read: d.read ?? false,
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const submissions = all.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return NextResponse.json({ submissions, total, page: currentPage, totalPages });
  } catch (err) {
    console.error("[submissions] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}
