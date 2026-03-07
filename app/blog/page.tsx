import type { Metadata } from "next";
import Image from "next/image";
import { adminDb } from "@/lib/firebase/admin";
import CustomHeader from "@/components/custom/shared/header";
import Footer from "@/components/custom/shared/footer";
import BlogListClient from "@/components/custom/blog/BlogListClient";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Insights & Immigration Updates",
  description:
    "Stay informed with expert articles on Australian visa categories, migration law changes, and immigration strategies from the team at Miller & Co.",
};

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  author: string;
  authorName: string;
  readingTime: number;
  wordCount: number;
  views: number;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const snap = await adminDb
      .collection("posts")
      .where("status", "==", "published")
      .get();

    const posts = snap.docs.map((doc) => {
      const d = doc.data();
      // Firestore Timestamps → ISO strings
      const toISO = (v: unknown): string | null => {
        if (!v) return null;
        if (typeof v === "object" && "toDate" in (v as object))
          return (v as { toDate: () => Date }).toDate().toISOString();
        return String(v);
      };
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
    });

    // Sort newest-first in memory (avoids requiring a composite Firestore index)
    return posts.sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    });
  } catch (err) {
    console.error("[blog] getPublishedPosts error:", err);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <CustomHeader />

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-28">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/1-mobile.png"
            alt=""
            fill
            priority
            className="object-cover object-center md:hidden"
          />
          <Image
            src="/1.png"
            alt=""
            fill
            priority
            className="object-cover object-center hidden md:block"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e08_0%,transparent_65%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerContainer className="flex flex-col items-center gap-5 text-center" stagger={0.12} delayChildren={0.1}>
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                  Miller & Co. Blog
                </span>
                <span className="h-px w-10 bg-[#c8a96e]" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${headlineFont.className} text-[#faf8f5] text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight`}>
                Insights &amp;{" "}
                <span className="italic text-[#c8a96e]">Updates</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={`${bodyFont.className} text-white/40 text-base leading-relaxed max-w-lg`}>
                Expert commentary on Australian migration law, visa pathways,
                and immigration policy — from our team of registered migration lawyers.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className={`${bodyFont.className} flex items-center gap-6 text-[11px] text-white/20 mt-2`}>
                <span>{posts.length} article{posts.length !== 1 ? "s" : ""}</span>
                <span className="w-1 h-1 rounded-full bg-white/15" />
                <span>Updated regularly</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Breadcrumb */}
        <div
          className={`${bodyFont.className} absolute bottom-8 right-6 lg:right-10 text-[#c8a96e] text-[10px] tracking-widest uppercase flex items-center gap-2`}
        >
          <span>Home</span>
          <span className="text-[#c8a96e]">/</span>
          <span className="text-white/60">Blog</span>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* ── Posts ──────────────────────────────────────────────────────────── */}
      <BlogListClient posts={posts} />
    </div>
  );
}
