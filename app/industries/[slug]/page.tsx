import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, customers, getIndustry, industries, products } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, Container, JsonLd, Photo, btn } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, ArrowUpRight } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() { return industries.map((i) => ({ slug: i.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = getIndustry((await params).slug);
  if (!i) return {};
  const title = `${i.name} — Equipment & Electronics Supplier in Chennai`;
  return { title, description: i.short, alternates: { canonical: `/industries/${i.slug}` }, openGraph: { title, description: i.short, images: [i.image] } };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const i = getIndustry((await params).slug);
  if (!i) notFound();
  const cats = i.categories.map((s) => categories.find((c) => c.slug === s)!).filter(Boolean);
  const picks = cats.flatMap((c) => products.filter((p) => p.category === c.slug && p.hasPage && p.industries.includes(i.slug)).slice(0, 2)).slice(0, 8);
  const logos = i.customers ? customers[i.customers] : [];
  const crumbs: [string, string][] = [["Home", "/"], ["Industries", "/industries"], [i.name, `/industries/${i.slug}`]];

  return (
    <>
      <section className="relative overflow-hidden bg-graphite text-white">
        <Image src={i.image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/30" />
        <Container className="relative py-16 md:py-24">
          <div className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"><Breadcrumbs items={crumbs} /></div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">{i.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{i.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/request-quote" className={btn.primary}>Submit a requirement <ArrowRight className="h-4 w-4" /></Link><Link href={`/products?industry=${i.slug}`} className="inline-flex items-center justify-center rounded border border-white/25 px-5 py-3 text-sm font-semibold hover:border-white/60">Browse products for this sector</Link></div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Product families for {i.name.toLowerCase()}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/solutions/${c.slug}`} className="group flex h-full gap-4 rounded-lg border border-line bg-white p-4 transition-shadow hover:shadow-lift">
                <Photo img={c.image} alt="" className="h-20 w-24 shrink-0 rounded" sizes="96px" label="" />
                <span className="min-w-0"><span className="flex items-start justify-between gap-2 font-semibold group-hover:text-cobalt">{c.name}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-steel" /></span><span className="mt-1 line-clamp-2 block text-sm text-slate">{c.short}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {picks.length > 0 && (
        <section className="border-y border-line bg-white py-14">
          <Container>
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Products buyers in this sector ask for</h2><Link href={`/products?industry=${i.slug}`} className={btn.ghost}>See all <ArrowRight className="h-4 w-4" /></Link></div>
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{picks.map((p) => <li key={p.slug}><ProductCard p={p} /></li>)}</ul>
          </Container>
        </section>
      )}

      <Container className="grid gap-12 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">What we need to quote</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">{i.needs.map((n) => <li key={n} className="py-3.5 text-graphite/90">{n}</li>)}</ul>
          <Link href="/request-quote" className={`${btn.primary} mt-8`}>Send your requirement <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {logos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{i.customers === "Education" ? "Institutions" : i.customers} we have supplied</h2>
            <p className="mt-2 text-sm text-slate">From the customer list in our 2026 catalogue.</p>
            <ul className="mt-6 grid grid-cols-3 gap-3">
              {logos.map((l) => <li key={l.name} className="flex h-20 items-center justify-center rounded-lg border border-line bg-white p-3"><Image src={l.logo} alt={l.name} width={l.w} height={l.h} className="max-h-12 w-auto object-contain" /></li>)}
            </ul>
          </div>
        )}
      </Container>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map(([n, h], k) => ({ "@type": "ListItem", position: k + 1, name: n, item: SITE_URL + h })) }} />
    </>
  );
}
