"use client";

import { useState } from "react";
import { bodyFont } from "@/lib/typographies";
import { Link2, Check, Twitter, Linkedin } from "lucide-react";

export default function BlogShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `/blog/${slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        typeof window !== "undefined" ? window.location.href : url
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col gap-3 p-5 bg-[#141414] border border-white/6">
      <p className={`${bodyFont.className} text-[9px] font-semibold uppercase tracking-[0.25em] text-white/20`}>
        Share this article
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={copy}
          className={`${bodyFont.className} flex items-center gap-2 text-[11px] text-white/40 hover:text-[#c8a96e] transition-colors cursor-pointer`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bodyFont.className} flex items-center gap-2 text-[11px] text-white/40 hover:text-[#c8a96e] transition-colors`}
        >
          <Twitter className="w-3.5 h-3.5" />
          Share on X
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bodyFont.className} flex items-center gap-2 text-[11px] text-white/40 hover:text-[#c8a96e] transition-colors`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          Share on LinkedIn
        </a>
      </div>
    </div>
  );
}
