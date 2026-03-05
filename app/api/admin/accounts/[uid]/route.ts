import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";

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
