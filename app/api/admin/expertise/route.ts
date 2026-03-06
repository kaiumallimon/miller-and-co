import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// ── GET — list all expertise items ───────────────────────────────────────────
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const snap = await adminDb.collection("expertise").get();
    const items = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          label: d.label ?? "",
          sub: d.sub ?? null,
          order: d.order ?? 0,
          isWide: d.isWide ?? false,
          createdAt: d.createdAt ?? null,
          updatedAt: d.updatedAt ?? null,
        };
      })
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[expertise GET]", err);
    return NextResponse.json({ error: "Failed to fetch expertise items." }, { status: 500 });
  }
}

// ── POST — create new expertise item ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const { label, sub } = (await req.json()) as {
      label?: string;
      sub?: string | null;
    };

    if (!label?.trim()) {
      return NextResponse.json({ error: "Label is required." }, { status: 400 });
    }

    const snap = await adminDb.collection("expertise").get();
    const maxOrder = snap.docs.reduce((max, d) => Math.max(max, d.data().order ?? 0), 0);

    const now = new Date().toISOString();
    const docRef = await adminDb.collection("expertise").add({
      label: label.trim(),
      sub: sub?.trim() || null,
      order: maxOrder + 1,
      isWide: false,
      createdAt: now,
      updatedAt: now,
    });

    await writeLog({
      action: "expertise_created",
      category: "admin",
      actor: user.email ?? user.uid,
      target: label.trim().slice(0, 60),
      details: `Expertise item created: "${label.trim().slice(0, 60)}"`,
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("[expertise POST]", err);
    return NextResponse.json({ error: "Failed to create expertise item." }, { status: 500 });
  }
}
