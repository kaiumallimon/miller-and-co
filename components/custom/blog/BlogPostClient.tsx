"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ArrowLeft, Clock, Calendar, Tag, BookOpen, User, Loader2 } from "lucide-react";
import BlogShareBar from "@/components/custom/blog/BlogShareBar";
import BlogCTASection from "@/components/custom/blog/BlogCTASection";
import RelatedPosts from "@/components/custom/blog/RelatedPosts";

interface PostFull {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  author: string;
  authorName: string;
  readingTime: number;
  wordCount: number;
  featured: boolean;
  publishedAt: string | null;
  seo: { metaTitle: string; metaDescription: string; ogImage: string | null };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
        if (!res.ok || res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!data.post) {
          setNotFound(true);
          return;
        }
        setPost(data.post);

        // Update document title dynamically
        document.title = data.post.seo?.metaTitle || data.post.title || "Blog Post";
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  // Redirect to 404 if post not found
  useEffect(() => {
    if (notFound && !loading) {
      router.replace("/not-found");
    }
  }, [notFound, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-48 text-center">
        <Loader2 className="w-6 h-6 text-[#c8a96e] animate-spin" />
        <p className={`${bodyFont.className} text-white/30 text-xs`}>Loading article…</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {post.coverImage ? (
        <div className="relative w-full h-[60vh] min-h-120 max-h-170 overflow-hidden">
          {/* Cover image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-black/30" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0f0f0f]/40 to-transparent" />

          {/* Content overlay */}
          <div className="relative h-full max-w-5xl mx-auto px-6 lg:px-10 flex flex-col justify-end pb-12">
            <StaggerContainer className="flex flex-col gap-4" stagger={0.1} delayChildren={0.05}>
              {post.category && (
                <StaggerItem>
                  <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                    {post.category}
                  </span>
                </StaggerItem>
              )}
              <StaggerItem>
                <h1 className={`${headlineFont.className} text-[#faf8f5] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight max-w-3xl`}>
                  {post.title}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <div className={`${bodyFont.className} flex flex-wrap items-center gap-4 text-[11px] text-white/40`}>
                  {post.authorName && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      {post.authorName}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    {post.wordCount.toLocaleString()} words
                  </span>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      ) : (
        /* Text-only hero (no cover image) */
        <div className="relative w-full bg-[#0f0f0f] pt-40 pb-12 lg:pt-52 lg:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e08_0%,transparent_65%)] pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
            <StaggerContainer className="flex flex-col gap-4" stagger={0.1} delayChildren={0.05}>
              {post.category && (
                <StaggerItem>
                  <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                    {post.category}
                  </span>
                </StaggerItem>
              )}
              <StaggerItem>
                <h1 className={`${headlineFont.className} text-[#faf8f5] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight`}>
                  {post.title}
                </h1>
              </StaggerItem>
              {post.excerpt && (
                <StaggerItem>
                  <p className={`${bodyFont.className} text-white/40 text-base leading-relaxed max-w-2xl`}>
                    {post.excerpt}
                  </p>
                </StaggerItem>
              )}
              <StaggerItem>
                <div className={`${bodyFont.className} flex flex-wrap items-center gap-4 text-[11px] text-white/30 mt-1`}>
                  {post.authorName && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      {post.authorName}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
        </div>
      )}

      {/* ── Article body ──────────────────────────────────────────────────── */}
      <AnimateIn direction="up" duration={0.7} delay={0.1}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 lg:gap-16 items-start">

            {/* ── Content ──────────────────────────────────────────────── */}
            <article className="min-w-0 overflow-hidden">
              {/* Excerpt lead (only for cover-image hero posts where excerpt isn't shown above) */}
              {post.coverImage && post.excerpt && (
                <p className={`${bodyFont.className} text-white/50 text-base leading-relaxed border-l-2 border-[#c8a96e]/40 pl-5 mb-10 italic`}>
                  {post.excerpt}
                </p>
              )}

              {/* Rendered HTML from Tiptap */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Divider */}
              <div className="mt-12 pt-8 border-t border-white/6 flex flex-col gap-5">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-3 h-3 text-white/20 shrink-0" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`${bodyFont.className} text-[10px] px-2.5 py-1 bg-white/4 border border-white/6 text-white/35 hover:text-[#c8a96e] hover:border-[#c8a96e]/20 transition-colors`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author */}
                {post.authorName && (
                  <div className={`${bodyFont.className} flex items-center gap-3`}>
                    <div className="w-8 h-8 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-[#c8a96e]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">Written by</p>
                      <p className="text-xs text-white/90">{post.authorName}</p>
                    </div>
                  </div>
                )}

                {/* Back link */}
                <Link
                  href="/blog"
                  className={`${bodyFont.className} inline-flex items-center gap-2 text-xs text-white/30 hover:text-[#c8a96e] transition-colors group mt-2`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside className="hidden lg:flex flex-col gap-6 sticky top-28">

              {/* About this article */}
              <div className="flex flex-col gap-4 p-5 bg-[#141414] border border-white/6">
                <p className={`${bodyFont.className} text-[9px] font-semibold uppercase tracking-[0.25em] text-white/60`}>
                  About this article
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Clock, label: "Reading time", value: `${post.readingTime} min` },
                    { icon: BookOpen, label: "Word count", value: post.wordCount.toLocaleString() },
                    ...(post.publishedAt ? [{ icon: Calendar, label: "Published", value: formatDate(post.publishedAt) }] : []),
                    ...(post.category ? [{ icon: Tag, label: "Category", value: post.category }] : []),
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className={`${bodyFont.className} flex items-start gap-2.5`}>
                      <Icon className="w-3 h-3 text-[#c8a96e] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-white/50 uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] text-white/90">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <BlogShareBar title={post.title} slug={post.slug} />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-col gap-3 p-5 bg-[#141414] border border-white/6">
                  <p className={`${bodyFont.className} text-[9px] font-semibold uppercase tracking-[0.25em] text-white/20`}>Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className={`${bodyFont.className} text-[9px] px-2 py-1 bg-white/4 border border-white/6 text-white/30`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </AnimateIn>

      {/* ── Related posts ────────────────────────────────────────────── */}
      <RelatedPosts currentId={post.id} tags={post.tags} />

      {/* ── CTA / Contact form ───────────────────────────────────────── */}
      <BlogCTASection />
    </>
  );
}
