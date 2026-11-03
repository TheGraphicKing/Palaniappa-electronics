import Link from "next/link";
import { Logo } from "./logo";
import { categories, industries } from "@/lib/catalog";
import { site } from "@/lib/site";
import { ArrowRight } from "./icons";
import { DEMO_MODE, STUDIO, YEAR } from "@/lib/demo";

export function Footer() {
  const c = site.contact;
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brass/[0.07] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-site px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-line py-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-fg md:text-4xl">Tell us what the space needs. <em className="em">We&rsquo;ll source the rest.</em></p>
          <Link href="/request-quote" className="inline-flex items-center gap-2 self-start rounded-full bg-brass px-6 py-3.5 text-sm font-semibold text-onaccent transition-all hover:bg-brass-hi hover:shadow-glow md:self-auto">Request a Quote <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="h-9 w-auto" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">Distributor and B2B supplier of electronics, commercial displays, hospitality equipment and commercial appliances. Chennai, since 2004.</p>
          </div>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">Products &amp; Solutions</h2>
            <ul className="mt-5 space-y-2.5 text-sm">{categories.map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`} className="text-muted transition-colors hover:text-brass">{x.name}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">Industries</h2>
            <ul className="mt-5 space-y-2.5 text-sm">{industries.map((x) => <li key={x.slug}><Link href={`/industries/${x.slug}`} className="text-muted transition-colors hover:text-brass">{x.name}</Link></li>)}</ul>
            <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">Company</h2>
            <ul className="mt-5 space-y-2.5 text-sm">{[["/about", "About Us"], ["/brands", "Brands"], ["/products", "Product catalogue"], ["/careers", "Careers"], ["/contact", "Contact"]].map(([h, l]) => <li key={h}><Link href={h} className="text-muted transition-colors hover:text-brass">{l}</Link></li>)}</ul>
          </div>
          <div className="text-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">{site.addresses.office.label}</h2>
            <address className="mt-5 not-italic leading-relaxed text-muted">{site.addresses.office.lines.map((l) => <span key={l} className="block">{l}</span>)}</address>
            <dl className="mt-6 space-y-4">
              <div><dt className="text-xs text-subtle">{c.sales.label}</dt><dd className="mt-0.5"><a href={`tel:${c.sales.tel}`} className="font-medium text-fg hover:text-brass">{c.sales.phone}</a><br /><a href={`mailto:${c.sales.email}`} className="text-muted hover:text-brass">{c.sales.email}</a></dd></div>
              <div><dt className="text-xs text-subtle">{c.enquiry.label}</dt><dd className="mt-0.5"><a href={`tel:${c.enquiry.tel}`} className="font-medium text-fg hover:text-brass">{c.enquiry.phone}</a><br /><a href={`mailto:${c.enquiry.email}`} className="text-muted hover:text-brass">{c.enquiry.email}</a></dd></div>
              <div><dt className="text-xs text-subtle">Office</dt><dd className="mt-0.5 text-muted">{c.landlines.join(" · ")}</dd></div>
            </dl>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          {DEMO_MODE ? (
            <p className="max-w-3xl leading-relaxed">
              <strong className="font-semibold text-muted">Concept demo.</strong> Website design, code and interactive features © {YEAR} {STUDIO}. All rights reserved. Shown to Palaniappa Electronics for evaluation only; no licence to use, copy, host or adapt is granted without a written agreement with {STUDIO}. The Palaniappa Electronics name, logo, product information and photos belong to Palaniappa Electronics; other brand names and logos belong to their respective owners.
            </p>
          ) : (
            <p>© {new Date().getFullYear()} Palaniappa Electronics, Chennai. Brand names and logos belong to their respective owners. Website by {STUDIO}.</p>
          )}
          <p className="flex gap-5"><Link href="/privacy-policy" className="hover:text-fg">Privacy Policy</Link><Link href="/terms-conditions" className="hover:text-fg">Terms &amp; Conditions</Link><Link href="/sitemap.xml" className="hover:text-fg">Sitemap</Link></p>
        </div>
      </div>
    </footer>
  );
}
