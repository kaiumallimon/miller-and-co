import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { writeLog } from "@/lib/logger";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ── GET — list all posts ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? ""; // "draft" | "published" | ""

  try {
    const snapshot = await adminDb
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    let posts = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.title ?? "",
        slug: d.slug ?? "",
        excerpt: d.excerpt ?? "",
        status: d.status ?? "draft",
        author: d.author ?? "",
        tags: d.tags ?? [],
        coverImage: d.coverImage ?? null,
        publishedAt: d.publishedAt ?? null,
        createdAt: d.createdAt ?? null,
        updatedAt: d.updatedAt ?? null,
      };
    });

    if (status === "draft" || status === "published") {
      posts = posts.filter((p) => p.status === status);
    }

    return NextResponse.json({ posts, total: posts.length });
  } catch (err) {
    console.error("[blogs GET]", err);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
}

// ── POST — create a new post ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const { title, excerpt, content, status, tags, coverImage } = body as {
      title?: string;
      excerpt?: string;
      content?: string;
      status?: string;
      tags?: string[];
      coverImage?: string;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const postStatus = status === "published" ? "published" : "draft";
    const baseSlug = slugify(title);

    // Ensure slug uniqueness by appending a timestamp suffix if taken
    let slug = baseSlug;
    const existing = await adminDb
      .collection("posts")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!existing.empty) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const docRef = await adminDb.collection("posts").add({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() ?? "",
      content: content.trim(),
      status: postStatus,
      author: user.email ?? user.uid,
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      coverImage: coverImage?.trim() ?? null,
      publishedAt: postStatus === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    await writeLog({
      action: "blog_post_created",
      category: "admin",
      actor: user.email ?? user.uid,
      target: title.trim(),
      details: `Blog post "${title.trim()}" created as ${postStatus}.`,
    });

    return NextResponse.json({ id: docRef.id, slug }, { status: 201 });
  } catch (err) {
    console.error("[blogs POST]", err);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
