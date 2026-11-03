import { NextResponse } from "next/server";
import { categories, getCategory, industries, products, productHref } from "@/lib/catalog";

export const dynamic = "force-static";

// Compact index for the ⌘K command palette, built once at build time.
export function GET() {
  const items = [
    ...categories.map((c) => ({ t: "family", n: c.name, s: c.short, h: `/solutions/${c.slug}`, i: c.image?.src ?? null, c: !!c.image?.contain, k: [c.name, c.short].join(" ").toLowerCase() })),
    ...industries.map((x) => ({ t: "industry", n: x.name, s: x.short, h: `/industries/${x.slug}`, i: x.image, c: false, k: [x.name, x.short].join(" ").toLowerCase() })),
    ...products.map((p) => {
      const cat = getCategory(p.category)!;
      return { t: "product", n: p.name, s: [p.section, ...p.brands.slice(0, 3)].join(" · "), h: productHref(p), i: p.image?.src ?? null, c: !!p.image?.contain, slug: p.slug, cat: cat.name, k: [p.name, p.section, p.rangeName, cat.name, ...p.brands, ...p.applications].join(" ").toLowerCase() };
    }),
  ];
  return NextResponse.json(items, { headers: { "Cache-Control": "public, max-age=3600" } });
}
