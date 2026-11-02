import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brandGroups, brandProductCount, brands } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Breadcrumbs, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Brands — Samsung, Newline, IFB, Sony, LG, King Koil and more",
  description: "Brands supplied by Palaniappa Electronics: authorised distributor for Samsung, Newline and IFB, exclusive hospitality & healthcare partner of Ingram Micro, plus 25+ commercial brands.",
  alternates: { canonical: "/brands" },
};

const label = { authorised: "Authorised distributor", partner: "Partner", supplied: "Supplied" } as const;

export default function Brands() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[["Home", "/"], ["Brands", "/brands"]]} />
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Brands</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate">Our relationship with each brand is not the same. We are an authorised distributor for some, a partner for one, and supply the rest through our partner network. Each brand below is labelled accordingly.</p>
          <ul className="mt-8 grid gap-2 text-sm text-graphite/90 md:grid-cols-2">
            {site.authorisations.map((a) => <li key={a} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />{a}</li>)}
            <li className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />{site.ingram}</li>
          </ul>
        </Container>
      </section>
      <Container className="space-y-14 py-14">
        {brandGroups.map((g) => (
          <section key={g} aria-label={g}>
            <h2 className="text-xl font-semibold tracking-tight">{g}</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {brands.filter((b) => b.group === g).map((b) => {
                const n = brandProductCount(b.name);
                return (
                  <li key={b.slug} className="flex flex-col rounded-lg border border-line bg-white p-4">
                    <div className="flex h-16 items-center justify-center">
                      {b.logo ? <Image src={b.logo.src} alt={`${b.name} logo`} width={b.logo.w} height={b.logo.h} className="max-h-12 w-auto object-contain" /> : <span className="text-lg font-semibold tracking-tight text-graphite">{b.name}</span>}
                    </div>
                    <div className="mt-4 border-t border-line pt-3">
                      <p className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">{b.name}<span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${b.relation === "supplied" ? "bg-porcelain text-slate" : "bg-cobalt-soft text-cobalt"}`}>{label[b.relation]}</span></p>
                      {b.note && <p className="mt-1 text-xs leading-relaxed text-slate">{b.note}</p>}
                      {n > 0 && <Link href={`/products?brand=${encodeURIComponent(b.name)}`} className="mt-2 inline-block text-xs font-semibold text-cobalt hover:underline">{n} product{n === 1 ? "" : "s"} →</Link>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <p className="text-xs text-steel">Brand names and logos are trademarks of their respective owners and identify products we supply. Logos are reproduced from our 2026 B2B catalogue; brands without a logo are shown by name.</p>
      </Container>
    </>
  );
}
