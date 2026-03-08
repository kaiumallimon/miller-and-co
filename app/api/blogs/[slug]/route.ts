import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// ── GET — public: return a single published blog post by slug ─────────────────
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const snap = await adminDb
      .collection("posts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json({ post: null }, { status: 404 });
    }

    const doc = snap.docs[0];
    const d = doc.data();

    const toISO = (v: unknown): string | null => {
      if (!v) return null;
      if (typeof v === "object" && "toDate" in (v as object))
        return (v as { toDate: () => Date }).toDate().toISOString();
      return String(v);
    };

    const post = {
      id: doc.id,
      title: d.title ?? "",
      slug: d.slug ?? slug,
      excerpt: d.excerpt ?? "",
      content: d.content ?? "",
      category: d.category ?? "",
      tags: d.tags ?? [],
      coverImage: d.coverImage ?? null,
      author: d.author ?? "",
      authorName: d.authorName ?? d.author ?? "",
      readingTime: d.readingTime ?? 1,
      wordCount: d.wordCount ?? 0,
      featured: d.featured ?? false,
      publishedAt: toISO(d.publishedAt) ?? toISO(d.createdAt),
      seo: {
        metaTitle: d.seo?.metaTitle ?? d.title ?? "",
        metaDescription: d.seo?.metaDescription ?? d.excerpt ?? "",
        ogImage: d.seo?.ogImage ?? d.coverImage ?? null,
      },
    };

    return NextResponse.json({ post });
  } catch (err) {
    console.error("[blogs/slug public GET]", err);
    return NextResponse.json({ post: null }, { status: 500 });
  }
}
