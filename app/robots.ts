import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEMO_MODE } from "@/lib/demo";

export default function robots(): MetadataRoute.Robots {
  if (DEMO_MODE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/request-quote/sent"] }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
