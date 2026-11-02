import Link from "next/link";
import Image from "next/image";
import { categories, industries } from "@/lib/catalog";
import { site } from "@/lib/site";

export function Footer() {
  const c = site.contact;
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Image src="/images/brand/palaniappa-logo.png" alt="Palaniappa Electronics" width={720} height={236} className="h-10 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate">Distributor and B2B supplier of electronics, commercial displays, hospitality equipment and commercial appliances. Chennai, since 2004.</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Products &amp; Solutions</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((x) => <li key={x.slug}><Link href={`/solutions/${x.slug}`} className="text-graphite/80 hover:text-cobalt">{x.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Industries</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {industries.map((x) => <li key={x.slug}><Link href={`/industries/${x.slug}`} className="text-graphite/80 hover:text-cobalt">{x.name}</Link></li>)}
          </ul>
          <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-steel">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[["/about", "About Us"], ["/brands", "Brands"], ["/products", "Product catalogue"], ["/careers", "Careers"], ["/contact", "Contact"]].map(([h, l]) => <li key={h}><Link href={h} className="text-graphite/80 hover:text-cobalt">{l}</Link></li>)}
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">{site.addresses.office.label}</h2>
          <address className="mt-4 not-italic leading-relaxed text-graphite/80">{site.addresses.office.lines.map((l) => <span key={l} className="block">{l}</span>)}</address>
          <dl className="mt-5 space-y-3">
            <div><dt className="text-xs text-steel">{c.sales.label}</dt><dd><a href={`tel:${c.sales.tel}`} className="font-medium text-graphite hover:text-cobalt">{c.sales.phone}</a> · <a href={`mailto:${c.sales.email}`} className="text-graphite/80 hover:text-cobalt">{c.sales.email}</a></dd></div>
            <div><dt className="text-xs text-steel">{c.enquiry.label}</dt><dd><a href={`tel:${c.enquiry.tel}`} className="font-medium text-graphite hover:text-cobalt">{c.enquiry.phone}</a> · <a href={`mailto:${c.enquiry.email}`} className="text-graphite/80 hover:text-cobalt">{c.enquiry.email}</a></dd></div>
            <div><dt className="text-xs text-steel">Office</dt><dd className="text-graphite/80">{c.landlines.join(" · ")}</dd></div>
          </dl>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-site flex-col gap-3 px-4 py-5 text-xs text-slate sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Palaniappa Electronics, Chennai. Brand names and logos belong to their respective owners.</p>
          <p className="flex gap-5"><Link href="/privacy-policy" className="hover:text-graphite">Privacy Policy</Link><Link href="/terms-conditions" className="hover:text-graphite">Terms &amp; Conditions</Link><Link href="/sitemap.xml" className="hover:text-graphite">Sitemap</Link></p>
        </div>
      </div>
    </footer>
  );
}
