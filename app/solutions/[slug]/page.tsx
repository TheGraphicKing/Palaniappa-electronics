import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brands as allBrands, categories, getCategory, industries, listJoin } from "@/lib/catalog";
import { SITE_URL, waLink } from "@/lib/site";
import { Breadcrumbs, Container, JsonLd, Photo, btn } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, WhatsApp } from "@/components/icons";
import Image from "next/image";

export const dynamicParams = false;
export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return { title: c.seoTitle, description: c.seoDescription, alternates: { canonical: `/solutions/${c.slug}` }, openGraph: { title: c.seoTitle, description: c.seoDescription, images: c.image ? [c.image.src] : undefined } };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const sectionBrands = [...new Set(c.ranges.flatMap((r) => r.sections.flatMap((s) => s.brands)))];
  const brandObjs = sectionBrands.map((n) => allBrands.find((b) => b.name === n)).filter(Boolean) as typeof allBrands;
  const inds = industries.filter((i) => i.categories.includes(c.slug));
  const products = c.ranges.flatMap((r) => r.sections.flatMap((s) => s.products));
  const crumbs: [string, string][] = [["Home", "/"], ["Products & Solutions", "/solutions"], [c.name, `/solutions/${c.slug}`]];

  return (
    <>
      <section className="page-hero border-b border-line">
        <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tightest md:text-6xl">{c.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{c.intro}</p>
            {inds.length > 0 && <p className="mt-5 text-sm text-muted">Used in: {inds.map((i, n) => <span key={i.slug}>{n > 0 && ", "}<Link href={`/industries/${i.slug}`} className="font-medium text-fg underline decoration-line underline-offset-4 hover:text-brass">{i.name}</Link></span>)}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#range" className={btn.primary}>See the range <ArrowRight className="h-4 w-4" /></a>
              <a href={waLink(`Hello Palaniappa Electronics, I'd like a quotation for ${c.name}.`)} target="_blank" rel="noopener noreferrer" className={btn.secondary}><WhatsApp /> Ask on WhatsApp</a>
            </div>
          </div>
          <Photo img={c.image} alt={c.name} priority className="aspect-[4/3] w-full rounded-lg border border-line" sizes="(min-width:1024px) 560px, 100vw" label="Range details on request" />
        </Container>
        {c.ranges.length > 1 && (
          <nav aria-label="Ranges" className="border-t border-line">
            <Container className="flex gap-1 overflow-x-auto py-2">
              {c.ranges.map((r) => <a key={r.slug} href={`#${r.slug}`} className="shrink-0 rounded px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg">{r.name}</a>)}
            </Container>
          </nav>
        )}
      </section>

      <Container className="py-12" >
        <div id="range" className="space-y-16">
          {c.ranges.map((r) => (
            <section key={r.slug} id={r.slug} className="scroll-mt-24" aria-labelledby={`h-${r.slug}`}>
              <div className="mb-8 border-b border-line pb-5">
                <h2 id={`h-${r.slug}`} className="text-2xl font-semibold tracking-tight md:text-3xl">{r.name}</h2>
                {c.ranges.length > 1 && <p className="mt-2 max-w-3xl text-muted">{r.intro}</p>}
                {r.source === "website" && <p className="mt-2 text-xs text-subtle">Listed on our website; not part of the 2026 printed catalogue.</p>}
              </div>
              <div className="space-y-12">
                {r.sections.map((s) => (
                  <div key={s.title}>
                    {(r.sections.length > 1 || s.description || s.brands.length) && (
                      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                          {r.sections.length > 1 && <h3 className="text-lg font-semibold">{s.title}</h3>}
                          {s.description && <p className="mt-1 text-sm leading-relaxed text-muted">{s.description}</p>}
                          {s.applications && <p className="mt-2 text-sm text-muted"><span className="font-medium text-fg">Application:</span> {s.applications.join(", ")}</p>}
                        </div>
                        {s.brands.length > 0 && <p className="text-sm text-muted"><span className="font-medium text-fg">{s.brands.length > 1 ? "Brands" : "Brand"}:</span> {s.brands.join(", ")}</p>}
                      </div>
                    )}
                    {s.features && (
                      <ul className="mb-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                        {s.features.map(([h, d]) => <li key={h} className="bg-surface p-5"><p className="text-sm font-semibold">{h}</p><p className="mt-1 text-sm text-muted">{d}</p></li>)}
                      </ul>
                    )}
                    {s.points && (
                      <ol className="mb-6 grid gap-x-8 gap-y-2 rounded-lg border border-line bg-surface p-6 sm:grid-cols-2">
                        {s.points.map((pt, i) => <li key={pt} className="flex gap-3 text-sm text-fg/90"><span className="w-5 shrink-0 text-right font-semibold tabular-nums text-brass">{i + 1}</span>{pt}</li>)}
                      </ol>
                    )}
                    {s.products.length > 0 ? (
                      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                        {s.products.map((p) => <li key={p.slug} className="reveal"><ProductCard p={p} /></li>)}
                      </ul>
                    ) : (
                      <div className="rounded-lg border border-dashed border-line bg-surface p-6 text-sm text-muted">{s.note || "Models shared on request."} <Link href={`/request-quote`} className="font-semibold text-brass">Ask for the current range →</Link></div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>

      {(brandObjs.length > 0 || c.questions.length > 0) && (
        <section className="border-t border-line bg-surface py-14">
          <Container className="grid gap-12 lg:grid-cols-2">
            {c.questions.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Common questions</h2>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {c.questions.map(([q, a]) => <div key={q} className="py-5"><dt className="font-semibold">{q}</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{a}</dd></div>)}
                </dl>
              </div>
            )}
            {brandObjs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Brands in this family</h2>
                <p className="mt-2 text-sm text-muted">{listJoin(brandObjs.map((b) => b.name))}.</p>
                <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {brandObjs.map((b) => (
                    <li key={b.slug} className="flex h-20 items-center justify-center rounded-lg border border-line bg-surface p-3">
                      {b.logo ? <Image src={b.logo.src} alt={b.name} width={b.logo.w} height={b.logo.h} className="max-h-10 w-auto object-contain" /> : <span className="text-sm font-semibold text-fg">{b.name}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </section>
      )}

      <section className="py-14">
        <Container>
          <div className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between">
            <div><h2 className="text-xl font-semibold">Need {c.name.toLowerCase()} for a project?</h2><p className="mt-1 text-sm text-muted">Add products to your requirement, or describe the project and we will propose the right models.</p></div>
            <Link href="/request-quote" className={btn.primary}>Request a Quote <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>

      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, h], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE_URL + h })) },
        { "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, description: c.seoDescription, url: `${SITE_URL}/solutions/${c.slug}`,
          mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: p.hasPage ? `${SITE_URL}/products/${p.slug}` : `${SITE_URL}/solutions/${c.slug}` })) } },
        ...(c.questions.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: c.questions.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] : []),
      ]} />
    </>
  );
}
