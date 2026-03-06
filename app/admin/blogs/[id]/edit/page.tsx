"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import PostEditor from "@/components/admin/PostEditor";

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  tags: string[];
  category: string;
  coverImage: string;
  coverImagePublicId: string;
  featured: boolean;
  allowComments: boolean;
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<Partial<PostData> | undefined>(undefined);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then((r) => r.json())
      .then((data) => setInitialData(data))
      .catch(() => setInitialData({}))
      .finally(() => setFetching(false));
  }, [id]);

  return (
    <PostEditor
      postId={id}
      initialData={initialData}
      fetchingInitial={fetching}
    />
  );
}
