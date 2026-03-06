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

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

// ── GET — list all posts ──────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const category = searchParams.get("category") ?? "";

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
        authorUid: d.authorUid ?? "",
        category: d.category ?? "",
        tags: d.tags ?? [],
        coverImage: d.coverImage ?? null,
        coverImagePublicId: d.coverImagePublicId ?? null,
        readingTime: d.readingTime ?? 1,
        wordCount: d.wordCount ?? 0,
        views: d.views ?? 0,
        featured: d.featured ?? false,
        seo: d.seo ?? { metaTitle: "", metaDescription: "", ogImage: null },
        publishedAt: d.publishedAt ?? null,
        scheduledAt: d.scheduledAt ?? null,
        createdAt: d.createdAt ?? null,
        updatedAt: d.updatedAt ?? null,
        lastEditedBy: d.lastEditedBy ?? null,
      };
    });

    if (status === "draft" || status === "published") {
      posts = posts.filter((p) => p.status === status);
    }
    if (category) {
      posts = posts.filter((p) => p.category === category);
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
    const {
      title, excerpt, content, status, tags, category,
      coverImage, coverImagePublicId, featured,
      seo, scheduledAt,
    } = body as {
      title?: string;
      excerpt?: string;
      content?: string;
      status?: string;
      tags?: string[];
      category?: string;
      coverImage?: string;
      coverImagePublicId?: string;
      featured?: boolean;
      seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string | null };
      scheduledAt?: string | null;
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

    // Look up admin's display name
    let authorName = user.email ?? user.uid;
    try {
      const adminDoc = await adminDb.collection("admins").doc(user.uid).get();
      if (adminDoc.exists && adminDoc.data()?.name) {
        authorName = adminDoc.data()!.name;
      }
    } catch { /* fall back to email */ }

    let slug = baseSlug;
    const existing = await adminDb
      .collection("posts")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!existing.empty) slug = `${baseSlug}-${Date.now()}`;

    const docRef = await adminDb.collection("posts").add({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() ?? "",
      content: content.trim(),
      contentText: stripHtml(content),
      status: postStatus,
      author: user.email ?? user.uid,
      authorName,
      authorUid: user.uid,
      category: category?.trim() ?? "",
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      coverImage: coverImage?.trim() || null,
      coverImagePublicId: coverImagePublicId?.trim() || null,
      readingTime: estimateReadingTime(content),
      wordCount: countWords(content),
      views: 0,
      featured: featured === true,
      allowComments: true,
      seo: {
        metaTitle: seo?.metaTitle?.trim() ?? title.trim(),
        metaDescription: seo?.metaDescription?.trim() ?? excerpt?.trim() ?? "",
        ogImage: seo?.ogImage ?? coverImage?.trim() ?? null,
      },
      publishedAt: postStatus === "published" ? now : null,
      scheduledAt: scheduledAt ?? null,
      createdAt: now,
      updatedAt: now,
      lastEditedBy: user.email ?? user.uid,
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
