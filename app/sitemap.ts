import type { MetadataRoute } from "next";
import { categories, industries, productPages } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority: number, images?: string[]) => ({ url: SITE_URL + path, lastModified: now, priority, ...(images ? { images: images.map((i) => SITE_URL + i) } : {}) });
  return [
    u("/", 1),
    u("/solutions", 0.9),
    u("/products", 0.9),
    u("/industries", 0.7),
    u("/brands", 0.7),
    u("/about", 0.6),
    u("/contact", 0.8),
    u("/request-quote", 0.6),
    u("/careers", 0.3),
    u("/privacy-policy", 0.2),
    u("/terms-conditions", 0.2),
    ...categories.map((c) => u(`/solutions/${c.slug}`, 0.85, c.image ? [c.image.src] : undefined)),
    ...industries.map((i) => u(`/industries/${i.slug}`, 0.75, [i.image])),
    ...productPages.map((p) => u(`/products/${p.slug}`, 0.6, p.image ? [p.image.src] : undefined)),
  ];
}
