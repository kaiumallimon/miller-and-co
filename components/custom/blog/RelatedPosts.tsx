"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ArrowRight, Calendar, Clock } from "lucide-react";

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  readingTime: number;
  publishedAt: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RelatedPosts({
  currentId,
  tags,
}: {
  currentId: string;
  tags: string[];
}) {
  const [related, setRelated] = useState<PostSummary[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tags.length) {
      setReady(true);
      return;
    }
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        const all: PostSummary[] = data.posts ?? [];
        const filtered = all
          .filter(
            (p) =>
              p.id !== currentId &&
              p.tags.some((t) => tags.includes(t))
          )
          // sort by most tag overlap
          .sort(
            (a, b) =>
              b.tags.filter((t) => tags.includes(t)).length -
              a.tags.filter((t) => tags.includes(t)).length
          )
          .slice(0, 3);
        setRelated(filtered);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [currentId, tags]);

  if (!ready || related.length === 0) return null;

  return (
    <section className="w-full border-t border-white/6 bg-[#0f0f0f] px-6 lg:px-10 py-16 lg:py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">

        {/* Heading */}
        <AnimateIn direction="up" duration={0.6}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  More to Read
                </span>
              </div>
              <h2
                className={`${headlineFont.className} text-white text-2xl sm:text-3xl font-semibold leading-tight`}
              >
                Related Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className={`${bodyFont.className} hidden sm:flex items-center gap-1.5 text-[11px] text-white/30 hover:text-[#c8a96e] transition-colors group shrink-0`}
            >
              All articles
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </AnimateIn>

        {/* Cards */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.1}
          delayChildren={0.1}
        >
          {related.map((post) => (
            <StaggerItem key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-[#141414] border border-white/6 hover:border-[#c8a96e]/25 transition-all duration-300 overflow-hidden"
              >
                {/* Cover thumbnail */}
                {post.coverImage ? (
                  <div className="relative w-full h-40 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#141414]/80 to-transparent" />
                  </div>
                ) : (
                  /* Placeholder when no cover */
                  <div className="w-full h-40 bg-[#1a1a1a] flex items-center justify-center shrink-0">
                    <span className="h-px w-10 bg-[#c8a96e]/30" />
                  </div>
                )}

                {/* Body */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  {post.category && (
                    <span
                      className={`${bodyFont.className} text-[#c8a96e] text-[9px] font-semibold tracking-[0.25em] uppercase`}
                    >
                      {post.category}
                    </span>
                  )}

                  <h3
                    className={`${headlineFont.className} text-white/90 text-base font-semibold leading-snug group-hover:text-[#c8a96e] transition-colors duration-300 line-clamp-2`}
                  >
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p
                      className={`${bodyFont.className} text-white/35 text-xs leading-relaxed line-clamp-2`}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer meta */}
                  <div
                    className={`${bodyFont.className} mt-auto pt-3 border-t border-white/5 flex items-center gap-3 text-[10px] text-white/25`}
                  >
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {post.readingTime} min
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
