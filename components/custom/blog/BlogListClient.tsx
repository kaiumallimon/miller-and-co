"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, Calendar, Search, ArrowRight, BookOpen, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { BlogPost } from "@/app/blog/page";

const EASE = [0.22, 1, 0.36, 1] as const;
const PAGE_SIZE = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Featured card ────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#141414] border border-white/6 overflow-hidden"
      >
        {/* Cover */}
        <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-100 overflow-hidden bg-[#111]">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#c8a96e08_0%,transparent_70%)]">
              <BookOpen className="w-12 h-12 text-white/8" />
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          {/* Featured badge */}
          <span className={`${bodyFont.className} absolute top-4 left-4 text-[9px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 bg-[#c8a96e] text-[#0f0f0f]`}>
            Featured
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 relative">
          {/* Gold left accent */}
          <span className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-transparent via-[#c8a96e]/40 to-transparent hidden lg:block" />

          {post.category && (
            <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.25em] uppercase`}>
              {post.category}
            </span>
          )}

          <h2 className={`${headlineFont.className} text-[#faf8f5] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight group-hover:text-[#c8a96e] transition-colors duration-300`}>
            {post.title}
          </h2>

          {post.excerpt && (
            <p className={`${bodyFont.className} text-white/45 text-sm leading-relaxed line-clamp-3`}>
              {post.excerpt}
            </p>
          )}

          <div className={`${bodyFont.className} flex flex-wrap items-center gap-4 text-[11px] text-white/25`}>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {post.readingTime} min read
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className={`${bodyFont.className} text-[11px] font-semibold text-[#c8a96e] group-hover:gap-3 transition-all`}>
              Read Article
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c8a96e] transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Regular post card ────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: EASE, delay: index * 0.05 }}
      layout
    >
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-[#141414] border border-white/6 hover:border-[#c8a96e]/20 transition-colors duration-300 overflow-hidden">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden bg-[#111]">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#c8a96e06_0%,transparent_70%)]">
              <BookOpen className="w-8 h-8 text-white/8" />
            </div>
          )}
          {post.category && (
            <span className={`${bodyFont.className} absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.2em] px-2 py-1 bg-[#0f0f0f]/80 backdrop-blur-sm text-[#c8a96e] border border-[#c8a96e]/20`}>
              {post.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 gap-3 p-5">
          <div className={`${bodyFont.className} flex items-center gap-3 text-[10px] text-white/20`}>
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{post.readingTime} min</span>
            {post.publishedAt && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
          </div>

          <h3 className={`${headlineFont.className} text-[#faf8f5] text-lg sm:text-xl leading-snug group-hover:text-[#c8a96e] transition-colors duration-300 line-clamp-2`}>
            {post.title}
          </h3>

          {post.excerpt && (
            <p className={`${bodyFont.className} text-white/35 text-xs leading-relaxed line-clamp-2 flex-1`}>
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-white/5">
            <span className={`${bodyFont.className} text-[10px] font-semibold text-[#c8a96e]`}>Read More</span>
            <ArrowRight className="w-3 h-3 text-[#c8a96e] transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Pagination bar ───────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page number list: always show first, last, current ±1, with ellipsis
  const pages: (number | "…")[] = [];
  const range = new Set<number>();
  range.add(1);
  range.add(totalPages);
  for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) range.add(i);
  const sorted = Array.from(range).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) pages.push("…");
    pages.push(sorted[i]);
  }

  return (
    <div className={`${bodyFont.className} flex items-center justify-center gap-1 mt-10`}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center justify-center w-8 h-8 border border-white/8 text-white/30 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-white/20 text-xs">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 flex items-center justify-center text-xs border transition-colors ${
              p === page
                ? "bg-[#c8a96e] text-[#0f0f0f] border-[#c8a96e] font-semibold"
                : "border-white/8 text-white/30 hover:text-white hover:border-white/20"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center justify-center w-8 h-8 border border-white/8 text-white/30 hover:text-white hover:border-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── BlogListClient ───────────────────────────────────────────────────────────
export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, activeCategory, search]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  // Split: first featured post (if any) only shown on page 1
  const featuredPost = page === 1 ? filtered.find((p) => p.featured) : undefined;
  const gridPosts = featuredPost
    ? filtered.filter((p) => p.id !== featuredPost.id)
    : filtered;

  const totalPages = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageGridPosts = gridPosts.slice(pageStart, pageStart + PAGE_SIZE);

  // Counts for the status line
  const shownCount = (featuredPost ? 1 : 0) + pageGridPosts.length;
  const fromItem = featuredPost
    ? 1
    : pageStart + 1;
  const toItem = featuredPost
    ? Math.min(pageStart + PAGE_SIZE + 1, gridPosts.length + 1)
    : Math.min(pageStart + PAGE_SIZE, gridPosts.length);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageChange(p: number) {
    setPage(p);
    scrollToTop();
  }

  return (
    <section className="relative w-full bg-[#0f0f0f] pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Filter & search bar ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between py-8 border-b border-white/6">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${bodyFont.className} text-[10px] font-semibold uppercase tracking-[0.15em] px-3.5 py-1.5 border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#c8a96e] text-[#0f0f0f] border-[#c8a96e]"
                    : "bg-transparent text-white/30 border-white/8 hover:text-white/60 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className={`${bodyFont.className} w-full bg-[#141414] border border-white/8 text-white/70 text-xs pl-9 pr-4 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 transition-colors`}
            />
          </div>
        </div>

        {/* ── No results ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <BookOpen className="w-8 h-8 text-white/10" />
            <p className={`${headlineFont.className} text-white/20 text-xl`}>No articles found</p>
            <p className={`${bodyFont.className} text-white/15 text-xs`}>
              Try a different category or search term
            </p>
            <button
              onClick={() => { setActiveCategory("All"); setSearch(""); }}
              className={`${bodyFont.className} text-xs text-[#c8a96e] hover:text-[#d4b87a] transition-colors mt-2 cursor-pointer`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="pt-10 flex flex-col gap-10">
            {/* Featured — page 1 only */}
            {featuredPost && <FeaturedCard post={featuredPost} />}

            {/* Grid */}
            {pageGridPosts.length > 0 && (
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {pageGridPosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => handlePageChange(page - 1)}
              onNext={() => handlePageChange(page + 1)}
              onPage={handlePageChange}
            />

            {/* Count */}
            <p className={`${bodyFont.className} text-center text-[10px] text-white/15 mt-2`}>
              Showing {fromItem}–{toItem} of {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && ` in "${activeCategory}"`}
              {search && ` matching "${search}"`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
