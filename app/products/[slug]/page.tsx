import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBrand, getCategory, getIndustry, getProduct, listJoin, productPages, relatedProducts } from "@/lib/catalog";
import { SITE_URL, site, waLink } from "@/lib/site";
import { Breadcrumbs, Container, JsonLd, Photo, btn } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { AddToRequirement } from "@/components/add-button";
import { QuoteNow } from "@/components/quote-now";
import { Download, WhatsApp } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() { return productPages.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const brandTxt = p.brands.length ? ` — ${p.brands.slice(0, 3).join(", ")}` : "";
  const title = `${p.name}${brandTxt}`;
  const description = `${p.description} Request a quotation from Palaniappa Electronics, Chennai.`.slice(0, 158);
  return { title, description, alternates: { canonical: `/products/${p.slug}` }, openGraph: { title, description, images: p.image ? [p.image.src] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p || !p.hasPage) notFound();
  const c = getCategory(p.category)!;
  const related = relatedProducts(p, 4);
  const href = `/products/${p.slug}`;
  const crumbs: [string, string][] = [["Home", "/"], ["Products & Solutions", "/solutions"], [c.name, `/solutions/${c.slug}`], [p.name, href]];
  const brandObjs = p.brands.map(getBrand).filter(Boolean) as NonNullable<ReturnType<typeof getBrand>>[];
  const inds = p.industries.map(getIndustry).filter(Boolean) as NonNullable<ReturnType<typeof getIndustry>>[];
  const fromCatalogue = p.source === "catalogue";

  return (
    <>
      <div className="page-hero border-b border-line">
        <Container className="py-4"><Breadcrumbs items={crumbs} /></Container>
      </div>
      <section className="bg-surface">
        <Container className="grid gap-10 pb-14 pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Photo img={p.image} alt={`${p.name}${p.brands.length ? " — " + p.brands.join(", ") : ""}`} priority className="aspect-[4/3] w-full rounded-lg border border-line" sizes="(min-width:1024px) 640px, 100vw" />
            {p.image && !p.image.contain && <p className="mt-2 text-xs text-subtle">Application photo from the 2026 catalogue. Final model and finish are confirmed in the quotation.</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass"><Link href={`/solutions/${c.slug}#${p.range}`} className="hover:underline">{p.rangeName}</Link> · {p.section}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.1]">{p.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{p.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AddToRequirement slug={p.slug} name={p.name} category={c.name} href={href} image={p.image?.src} size="lg" />
              <QuoteNow slug={p.slug} name={p.name} category={c.name} href={href} image={p.image?.src} />
              <a href={waLink(`Hello Palaniappa Electronics, I'd like a quotation for: ${p.name} (${c.name}). Quantity: `)} target="_blank" rel="noopener noreferrer" className={btn.secondary}><WhatsApp className="h-4 w-4 text-[#1F8F4E]" /> WhatsApp</a>
            </div>

            <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
              <Row label="Category"><Link href={`/solutions/${c.slug}`} className="text-brass hover:underline">{c.name}</Link></Row>
              <Row label="Range">{p.rangeName} — {p.section}</Row>
              {p.brands.length > 0 && <Row label={p.brands.length > 1 ? "Brands" : "Brand"}>{listJoin(p.brands)}{p.imported ? "; imported ranges also available" : ""}</Row>}
              {p.applications.length > 0 && <Row label="Application">{p.applications.join(", ")}</Row>}
              {inds.length > 0 && <Row label="Industries">{inds.map((i, n) => <span key={i.slug}>{n > 0 && ", "}<Link href={`/industries/${i.slug}`} className="hover:text-brass hover:underline">{i.name}</Link></span>)}</Row>}
              <Row label="Specifications">Model, size, capacity and finish depend on the brand and your project. Our team shares current specifications and datasheets with the quotation.</Row>
              <Row label="Source">{fromCatalogue ? <>Palaniappa Electronics B2B Catalogue 2026 · <a href="/downloads/palaniappa-electronics-b2b-catalogue-2026.pdf" className="inline-flex items-center gap-1 text-brass hover:underline" download><Download className="h-3.5 w-3.5" />PDF</a></> : "Palaniappa Electronics website"}</Row>
            </dl>

            {brandObjs.some((b) => b.logo) && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {brandObjs.filter((b) => b.logo).map((b) => (
                  <li key={b.slug} className="flex h-14 items-center rounded border border-line bg-surface px-4"><Image src={b.logo!.src} alt={b.name} width={b.logo!.w} height={b.logo!.h} className="max-h-8 w-auto" /></li>
                ))}
              </ul>
            )}

            <div className="mt-10 rounded-lg bg-canvas p-6">
              <h2 className="text-sm font-semibold">To quote quickly, tell us</h2>
              <ul className="mt-3 grid gap-1.5 text-sm text-muted">
                <li>• Quantity and delivery location</li><li>• Preferred brand, size or model (if any)</li><li>• Timeline, and whether installation is needed</li>
              </ul>
              <p className="mt-4 text-sm text-muted">Or call our B2B team on <a href={`tel:${site.contact.sales.tel}`} className="font-semibold text-fg">{site.contact.sales.phone}</a>.</p>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line py-14">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4"><h2 className="text-2xl font-semibold tracking-tight">Related products</h2><Link href={`/solutions/${c.slug}`} className={btn.ghost}>All {c.name}</Link></div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{related.map((r) => <li key={r.slug}><ProductCard p={r} /></li>)}</ul>
          </Container>
        </section>
      )}

      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, h], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE_URL + h })) },
        {
          "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, url: SITE_URL + href, category: `${c.name} > ${p.rangeName}`,
          ...(p.image ? { image: SITE_URL + p.image.src } : {}),
          ...(p.brands.length === 1 ? { brand: { "@type": "Brand", name: p.brands[0] } } : {}),
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      ]} />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid grid-cols-[120px_1fr] gap-4 py-3.5"><dt className="text-muted">{label}</dt><dd className="text-fg">{children}</dd></div>;
}
