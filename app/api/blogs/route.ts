import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

// ── GET — public: return all published blog posts ─────────────────────────────
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("posts")
      .where("status", "==", "published")
      .get();

    const toISO = (v: unknown): string | null => {
      if (!v) return null;
      if (typeof v === "object" && "toDate" in (v as object))
        return (v as { toDate: () => Date }).toDate().toISOString();
      return String(v);
    };

    const posts = snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: d.title ?? "",
          slug: d.slug ?? doc.id,
          excerpt: d.excerpt ?? "",
          category: d.category ?? "",
          tags: d.tags ?? [],
          coverImage: d.coverImage ?? null,
          author: d.author ?? "",
          authorName: d.authorName ?? d.author ?? "",
          readingTime: d.readingTime ?? 1,
          wordCount: d.wordCount ?? 0,
          views: d.views ?? 0,
          featured: d.featured ?? false,
          publishedAt: toISO(d.publishedAt) ?? toISO(d.createdAt),
          createdAt: toISO(d.createdAt) ?? "",
        };
      })
      .sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return tb - ta;
      });

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[blogs public GET]", err);
    return NextResponse.json({ posts: [] });
  }
}
