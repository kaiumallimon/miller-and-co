import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";

// ── PATCH — toggle active / inactive ─────────────────────────────────────────
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const requester = await getSessionUser();
  if (!requester) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { uid } = await params;

  if (uid === requester.uid) {
    return NextResponse.json(
      { error: "You cannot deactivate your own account." },
      { status: 403 }
    );
  }

  try {
    const docRef = adminDb.collection("admins").doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }
    const current = doc.data()?.active !== false; // treat missing as true
    const newActive = !current;

    // Sync disabled state in Firebase Auth
    await adminAuth.updateUser(uid, { disabled: !newActive });
    await docRef.update({ active: newActive });

    return NextResponse.json({ active: newActive });
  } catch (err) {
    console.error("[Accounts PATCH]", err);
    return NextResponse.json({ error: "Failed to update account." }, { status: 500 });
  }
}

// ── DELETE — remove an admin ──────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const requester = await getSessionUser();
  if (!requester) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { uid } = await params;

  // Prevent self-deletion
  if (uid === requester.uid) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 403 }
    );
  }

  try {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("admins").doc(uid).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Accounts DELETE]", err);
    return NextResponse.json({ error: "Failed to delete account." }, { status: 500 });
  }
}
