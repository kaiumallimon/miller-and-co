import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";

// ── GET — list all admins from Firestore ─────────────────────────────────────
export async function GET() {
  const requester = await getSessionUser();
  if (!requester) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("admins").get();
    const admins = snapshot.docs
      .map((doc) => {
        const d = doc.data();
        // Backfill missing fields from legacy docs
        return {
          uid: d.uid ?? doc.id,
          email: d.email ?? "",
          createdAt: d.createdAt ?? null,
          lastLogin: d.lastLogin ?? null,
          active: d.active !== undefined ? d.active : true,
        };
      })
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.localeCompare(a.createdAt);
      });
    return NextResponse.json({ admins });
  } catch (err) {
    console.error("[Accounts GET]", err);
    return NextResponse.json({ error: "Failed to fetch accounts." }, { status: 500 });
  }
}

// ── POST — create a new admin ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const requester = await getSessionUser();
  if (!requester) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Create the Firebase Auth user
    const user = await adminAuth.createUser({ email, password });

    // Persist in Firestore admins collection
    const now = new Date().toISOString();
    await adminDb.collection("admins").doc(user.uid).set({
      uid: user.uid,
      email: user.email ?? email,
      createdAt: now,
      lastLogin: null,
      active: true,
    });

    return NextResponse.json({ uid: user.uid, email: user.email }, { status: 201 });
  } catch (err: unknown) {
    console.error("[Accounts POST]", err);
    const code = (err as { code?: string })?.code ?? "";
    const message =
      code === "auth/email-already-exists"
        ? "An account with this email already exists."
        : code === "auth/invalid-email"
        ? "Invalid email address."
        : "Failed to create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
