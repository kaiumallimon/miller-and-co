import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getSessionUser } from "@/lib/auth/session";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    // Fetch usage stats and recent resources in parallel
    const [usage, resources] = await Promise.all([
      cloudinary.api.usage(),
      cloudinary.api.resources({
        type: "upload",
        prefix: "miller-and-co",
        max_results: 20,
        direction: "desc",
      }),
    ]);

    return NextResponse.json({
      usage: {
        plan: usage.plan ?? "Free",
        // Storage
        storage: {
          used: usage.storage?.usage ?? 0,
          limit: usage.storage?.limit ?? 0,
          usedPercent: usage.storage?.usage_percent ?? 0,
        },
        // Bandwidth
        bandwidth: {
          used: usage.bandwidth?.usage ?? 0,
          limit: usage.bandwidth?.limit ?? 0,
          usedPercent: usage.bandwidth?.usage_percent ?? 0,
        },
        // Transformations
        transformations: {
          used: usage.transformations?.usage ?? 0,
          limit: usage.transformations?.limit ?? 0,
          usedPercent: usage.transformations?.usage_percent ?? 0,
        },
        // Objects
        objects: {
          used: usage.objects?.usage ?? 0,
          limit: usage.objects?.limit ?? 0,
          usedPercent: usage.objects?.usage_percent ?? 0,
        },
        // Credits
        credits: {
          used: usage.credits?.usage ?? 0,
          limit: usage.credits?.limit ?? 0,
          usedPercent: usage.credits?.usage_percent ?? 0,
        },
        mediaCount: usage.media_limits?.image_max_size_bytes != null
          ? { imageLimit: usage.media_limits.image_max_size_bytes }
          : null,
        lastUpdated: usage.last_updated ?? null,
      },
      resources: resources.resources.map((r: Record<string, unknown>) => ({
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
        createdAt: r.created_at,
        folder: r.folder,
      })),
    });
  } catch (err) {
    console.error("[cdn/stats]", err);
    return NextResponse.json({ error: "Failed to fetch CDN stats." }, { status: 500 });
  }
}
