import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryCount } from "@/lib/catalog";
import { Breadcrumbs, Container, JsonLd, Photo } from "@/components/ui";
import { ArrowUpRight } from "@/components/icons";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products & Solutions for Businesses and Institutions",
  description: "Samsung electronics, commercial displays and LED walls, interactive panels, hospitality TVs, hotel amenities, commercial AC, refrigeration, laundry, dishwashing, IT infrastructure and mobile robots.",
  alternates: { canonical: "/solutions" },
};

export default function Solutions() {
  return (
    <>
      <section className="page-hero border-b border-line">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[["Home", "/"], ["Products & Solutions", "/solutions"]]} />
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Products &amp; solutions</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Ten product families covering what hotels, hospitals, campuses, offices, factories and retailers buy. Open a family to see its ranges, brands and products.</p>
        </Container>
      </section>
      <Container className="py-14">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/solutions/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow hover:shadow-lift">
                <Photo img={c.image} alt={c.name} className="aspect-[16/10] w-full" sizes="(min-width:1024px) 400px, 50vw" label="Range details on request" />
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="flex items-start justify-between gap-3 text-lg font-semibold group-hover:text-brass">{c.name}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-subtle" /></h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.short}</p>
                  <p className="mt-4 text-xs text-subtle">{c.ranges.map((r) => r.name).join(" · ")}</p>
                  <p className="mt-2 text-xs font-medium text-fg">{categoryCount(c.slug) ? `${categoryCount(c.slug)} products & lines` : "Models on request"}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Products & Solutions", item: `${SITE_URL}/solutions` }] },
        { "@context": "https://schema.org", "@type": "ItemList", itemListElement: categories.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `${SITE_URL}/solutions/${c.slug}` })) },
      ]} />
    </>
  );
}
