import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// PATCH — mark as read/unread
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const read = typeof body.read === "boolean" ? body.read : true;

  try {
    await adminDb.collection("contacts").doc(id).update({ read });

    await writeLog({
      action: read ? "submission_marked_read" : "submission_marked_unread",
      category: "contact",
      actor: user.email ?? user.uid,
      target: id,
      details: `Submission ${id} marked as ${read ? "read" : "unread"}.`,
    });

    return NextResponse.json({ success: true, read });
  } catch (err) {
    console.error("[submissions] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update submission." }, { status: 500 });
  }
}

// DELETE — remove a submission
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Fetch sender email before deletion so it can be logged
    const doc = await adminDb.collection("contacts").doc(id).get();
    const senderEmail = doc.data()?.email ?? id;

    await adminDb.collection("contacts").doc(id).delete();

    await writeLog({
      action: "submission_deleted",
      category: "contact",
      actor: user.email ?? user.uid,
      target: senderEmail,
      details: `Contact submission from ${senderEmail} deleted.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submissions] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
