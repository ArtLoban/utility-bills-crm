import type { MetadataRoute } from "next";
import { getPublicLinks } from "@/features/landing-cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getPublicLinks();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const entries: MetadataRoute.Sitemap = [{ url: base }];

  if (links?.aboutUrlAccessible !== false) {
    entries.push({ url: `${base}/about` });
  }
  if (links?.projectUrlAccessible !== false) {
    entries.push({ url: `${base}/project` });
  }

  return entries;
}
