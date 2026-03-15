import type { MetadataRoute } from "next";

const base = "https://www.visa-australia.legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
