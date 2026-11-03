import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { customers } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Breadcrumbs, Container, btn } from "@/components/ui";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us — Samsung Distributor & B2B Supplier, Chennai, Since 2004",
  description: "Palaniappa Electronics, established June 2004 in Chennai: Samsung consumer electronics distributor for Chennai & suburbs and B2B supplier to hotels, hospitals, institutions, retail and manufacturing.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <section className="page-hero border-b border-line">
        <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <Breadcrumbs items={[["Home", "/"], ["About Us", "/about"]]} />
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tightest md:text-6xl">A Chennai distributor with an institutional sales arm.</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">Palaniappa Electronics is a partnership concern established in June 2004. It works through two divisions: distribution, and projects and institutional supplies.</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line"><Image src="/images/site/our-team.webp" alt="The Palaniappa Electronics team" fill priority sizes="(min-width:1024px) 600px, 100vw" className="object-cover" /></div>
        </Container>
      </section>

      <Container className="py-14">
        <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-surface md:grid-cols-3 lg:grid-cols-6">
          {site.stats.map((s) => <div key={s.label} className="flex flex-col-reverse border-b border-r border-line p-5"><dt className="mt-1 text-[13px] text-muted">{s.label}</dt><dd className="text-2xl font-semibold tabular-nums tracking-tight">{s.value}</dd></div>)}
        </dl>
        <p className="mt-3 text-xs text-subtle">Figures as published in the 2026 B2B catalogue. The current website quotes a turnover of ₹105 crore for FY 2018–19.</p>
      </Container>

      <Container className="grid gap-12 pb-14 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">Distribution</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Samsung consumer electronics &amp; durables</h2>
          <p className="mt-4 leading-relaxed text-muted">Distributor for Samsung consumer electronics and appliances for Chennai and its suburbs — Chennai, Kanchipuram, Chengalpattu and Thiruvallur districts — supplying Samsung TVs, refrigerators, washers, ACs and ovens to more than 500 retail outlets.</p>
          <Link href="/solutions/samsung-consumer-electronics" className={`${btn.ghost} mt-5`}>Samsung distribution <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-lg border border-line bg-surface p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">B2B institutional sales</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Commercial products for institutions</h2>
          <p className="mt-4 leading-relaxed text-muted">Supplier to hotels, hospitals, educational institutions, retail and manufacturing in South India, with 25+ brands across commercial TVs and displays, IT infrastructure, mattresses and linen, hotel amenities, laundry, cooling and HVAC.</p>
          <Link href="/solutions" className={`${btn.ghost} mt-5`}>Products &amp; solutions <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Container>

      <section className="border-y border-line bg-surface py-14">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Why buyers work with us</h2>
            <dl className="mt-8 space-y-6">
              {[["Track record", "21 years since 2004, built on trust, ethics and methodical systems."], ["Infrastructure", "A 20,000 sq. ft warehouse in Chromepet for stock availability and prompt delivery."], ["Team", "More than 50 experienced employees committed to quality and service."], ["Approach", "Solution-oriented selling: we start from the space and the requirement, not from a price list."]].map(([t, d]) => <div key={t}><dt className="font-semibold">{t}</dt><dd className="mt-1 text-muted">{d}</dd></div>)}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Authorisations &amp; partnerships</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {[...site.authorisations, site.ingram].map((a) => <li key={a} className="py-4 text-fg/90">{a}</li>)}
            </ul>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-line"><Image src="/images/site/warehouse-chromepet.webp" alt="Warehouse facility, Chromepet" fill sizes="(min-width:1024px) 640px, 100vw" className="object-cover" /></div>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Customers</h2>
        <p className="mt-2 text-muted">Hotels, hospitals and educational institutions listed in our 2026 catalogue.</p>
        {Object.entries(customers).map(([g, list]) => (
          <div key={g} className="mt-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">{g}</h3>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {list.map((c) => <li key={c.name} className="flex h-20 items-center justify-center rounded-lg border border-line bg-surface p-3"><Image src={c.logo} alt={c.name} width={c.w} height={c.h} className="max-h-12 w-auto object-contain" /></li>)}
            </ul>
          </div>
        ))}
      </Container>
    </>
  );
}
