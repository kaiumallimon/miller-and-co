import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

// ── GET — fetch single post ───────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const doc = await adminDb.collection("posts").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    const d = doc.data()!;
    return NextResponse.json({
      id: doc.id,
      title: d.title ?? "",
      slug: d.slug ?? "",
      excerpt: d.excerpt ?? "",
      content: d.content ?? "",
      status: d.status ?? "draft",
      author: d.author ?? "",
      tags: d.tags ?? [],
      coverImage: d.coverImage ?? null,
      publishedAt: d.publishedAt ?? null,
      createdAt: d.createdAt ?? null,
      updatedAt: d.updatedAt ?? null,
    });
  } catch (err) {
    console.error("[blogs/:id GET]", err);
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}

// ── PATCH — update a post ─────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const doc = await adminDb.collection("posts").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const body = await req.json();
    const { title, excerpt, content, status, tags, coverImage } = body as {
      title?: string;
      excerpt?: string;
      content?: string;
      status?: string;
      tags?: string[];
      coverImage?: string;
    };

    if (title !== undefined && !title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const existing = doc.data()!;

    const updates: Record<string, unknown> = { updatedAt: now };
    if (title !== undefined) updates.title = title.trim();
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content !== undefined) updates.content = content.trim();
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags.filter(Boolean) : [];
    if (coverImage !== undefined) updates.coverImage = coverImage?.trim() ?? null;

    if (status !== undefined && (status === "draft" || status === "published")) {
      updates.status = status;
      if (status === "published" && existing.status !== "published") {
        updates.publishedAt = now;
      } else if (status === "draft") {
        updates.publishedAt = null;
      }
    }

    await adminDb.collection("posts").doc(id).update(updates);

    const newTitle = (updates.title as string | undefined) ?? existing.title;
    await writeLog({
      action: "blog_post_updated",
      category: "admin",
      actor: user.email ?? user.uid,
      target: String(newTitle),
      details: `Blog post "${newTitle}" updated.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[blogs/:id PATCH]", err);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

// ── DELETE — remove a post ────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  try {
    const doc = await adminDb.collection("posts").doc(id).get();
    const title = doc.data()?.title ?? id;

    await adminDb.collection("posts").doc(id).delete();

    await writeLog({
      action: "blog_post_deleted",
      category: "admin",
      actor: user.email ?? user.uid,
      target: String(title),
      details: `Blog post "${title}" deleted.`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[blogs/:id DELETE]", err);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
