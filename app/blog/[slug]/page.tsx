import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import BlogPostClient from "@/components/custom/blog/BlogPostClient";

export const metadata: Metadata = {
  title: "Blog Post | Miller & Co.",
  description:
    "Read expert insights on Australian migration law, visa pathways, and immigration policy from the team at Miller & Co.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="bg-[#0f0f0f] min-h-screen overflow-x-hidden">
      <CustomHeader />
      <BlogPostClient slug={slug} />
    </div>
  );
}
