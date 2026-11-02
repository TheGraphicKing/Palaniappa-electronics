import type { Metadata } from "next";
import { Suspense } from "react";
import { brands, categories, industries, products, toLite } from "@/lib/catalog";
import { Breadcrumbs, Container, btn } from "@/components/ui";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { Download } from "@/components/icons";

export const metadata: Metadata = {
  title: "B2B Product Catalogue — Displays, Hospitality, Cooling, Laundry & Amenities",
  description: `Search ${products.length} commercial products: hospitality TVs, signage, kiosks, LED walls, interactive panels, hotel amenities, mattresses, linen, refrigeration, ACs, laundry and dishwashers. Filter by brand and industry.`,
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const lite = products.map(toLite);
  const count = (f: (p: (typeof lite)[number]) => boolean) => lite.filter(f).length;
  const catOpts = categories.map((c) => ({ value: c.slug, label: c.name, count: count((p) => p.category === c.slug) })).filter((o) => o.count);
  const indOpts = industries.map((i) => ({ value: i.slug, label: i.name, count: count((p) => p.industries.includes(i.slug)) }));
  const brandOpts = brands.map((b) => ({ value: b.name, label: b.name, count: count((p) => p.brands.includes(b.name)) })).filter((o) => o.count).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div>
            <Breadcrumbs items={[["Home", "/"], ["Product catalogue", "/products"]]} />
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">Product catalogue</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate">Every product from our 2026 B2B catalogue. Search and filter, then add what you need to one requirement list.</p>
          </div>
          <a href="/downloads/palaniappa-electronics-b2b-catalogue-2026.pdf" className={btn.secondary} download><Download className="h-4 w-4" /> PDF catalogue (7.5 MB)</a>
        </Container>
      </section>
      <Container className="py-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
          <CatalogueBrowser products={lite} categories={catOpts} brands={brandOpts} industries={indOpts} />
        </Suspense>
      </Container>
    </>
  );
}
