import Link from "next/link";
import Image from "next/image";
import { brands, brandGroups, categories, categoryCount, customers, getProduct, industries, productPages } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Container, Eyebrow, Photo, SectionHead, btn } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, ArrowUpRight } from "@/components/icons";

const FEATURED = ["hotel-guest-room-tv", "t-type-kiosk", "classroom-interactive-panel", "corporate-boardroom-led-wall", "washer-extractor", "360-degree-cassette-ac", "glass-door-mini-bar", "maharaja-suite"];

export default function Home() {
  const featured = FEATURED.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  const stripBrands = ["Samsung", "IFB", "Sony", "LG", "Mitsubishi Electric", "Haier", "King Koil", "Voltas", "Godrej"].map((n) => brands.find((b) => b.name === n)!).filter((b) => b.logo);
  const custLogos = [...customers.Hotels.slice(0, 6), ...customers.Hospitals.slice(0, 3), ...customers.Education.slice(0, 3)];

  return (
    <>
      {/* B — Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-sm border border-line bg-porcelain px-2.5 py-1 text-xs font-medium text-slate">
              <span className="h-1.5 w-1.5 rounded-full bg-cobalt" /> Chennai · Since 2004
            </p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-tightest text-graphite sm:text-6xl lg:text-[4.1rem]">
              Technology &amp; equipment for every business.
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-slate">
              From Samsung electronics and commercial displays to hospitality equipment, commercial cooling and laundry, Palaniappa Electronics supplies hotels, hospitals, campuses, offices and retailers from one Chennai warehouse.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/solutions" className={btn.primary}>Explore Our Solutions <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/request-quote" className={btn.secondary}>Submit a Requirement</Link>
            </div>
            <ul className="mt-10 grid gap-2 text-sm text-slate">
              <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-graphite" />Samsung consumer electronics distributor for Chennai &amp; suburbs</li>
              <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-graphite" />Authorised distributor: Samsung Commercial Displays, Newline, IFB</li>
            </ul>
          </div>

          {/* Product-led composition: real installations from the 2026 catalogue */}
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
            <figure className="absolute inset-y-[6%] left-0 right-[14%] overflow-hidden rounded-lg border border-line bg-graphite shadow-panel">
              <Image src="/images/led-wall-solutions/corporate-boardroom-led-wall.webp" alt="Indoor LED wall in a corporate boardroom" fill priority sizes="(min-width:1024px) 520px, 90vw" className="object-cover" />
              <figcaption className="absolute left-3 top-3 rounded-sm bg-white/90 px-2 py-1 text-[11px] font-semibold text-graphite backdrop-blur">Indoor LED wall</figcaption>
            </figure>
            <figure className="parallax-slow absolute bottom-0 left-[-4%] w-[46%] overflow-hidden rounded-lg border-4 border-white bg-white shadow-panel sm:left-[-6%]">
              <div className="relative aspect-[4/3]"><Image src="/images/hospitality-tv/hotel-guest-room-tv.webp" alt="Hospitality TV in a hotel guest room" fill sizes="300px" className="object-cover" /></div>
              <figcaption className="px-2.5 py-2 text-[11px] font-semibold text-graphite">Hospitality TV</figcaption>
            </figure>
            <figure className="parallax-fast absolute right-0 top-[18%] w-[30%] overflow-hidden rounded-lg border-4 border-white bg-white shadow-panel">
              <div className="relative aspect-[3/5]"><Image src="/images/digital-signage-kiosks/t-type-kiosk.webp" alt="T-type floor-standing kiosk in a hotel lobby" fill sizes="200px" className="object-cover" /></div>
              <figcaption className="px-2.5 py-2 text-[11px] font-semibold text-graphite">T-type kiosk</figcaption>
            </figure>
          </div>
        </Container>
        <div className="border-t border-line">
          <Container className="flex flex-wrap items-center gap-x-10 gap-y-4 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Brands we supply</p>
            <ul className="flex flex-1 flex-wrap items-center gap-x-7 gap-y-3 lg:justify-between">
              {stripBrands.map((b) => (
                <li key={b.slug}><Image src={b.logo!.src} alt={b.name} width={b.logo!.w} height={b.logo!.h} className="h-5 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" /></li>
              ))}
            </ul>
          </Container>
        </div>
      </section>

      {/* C — Credentials */}
      <section aria-labelledby="scale-h" className="py-16 md:py-20">
        <Container>
          <h2 id="scale-h" className="sr-only">Company scale</h2>
          <dl className="grid grid-cols-2 divide-line overflow-hidden rounded-lg border border-line bg-white md:grid-cols-3 lg:grid-cols-6 lg:divide-x">
            {site.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-b border-r border-line p-5 last:border-r-0 md:p-6 lg:border-b-0 lg:border-r-0">
                <dt className="mt-1 text-[13px] leading-snug text-slate">{s.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums tracking-tight text-graphite md:text-[1.75rem]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-steel">Figures as published in the Palaniappa Electronics B2B Catalogue 2026.</p>
          <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-center">
            <p className="max-w-[16rem] text-sm font-medium text-slate">Supplied to hotels, hospitals and institutions across South India, including</p>
            <ul className="grid flex-1 grid-cols-3 items-center gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
              {custLogos.map((c) => (
                <li key={c.name} className="flex h-12 items-center justify-center"><Image src={c.logo} alt={c.name} width={c.w} height={c.h} className="max-h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" /></li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* D — Categories */}
      <section className="border-t border-line bg-white py-20 md:py-24" aria-labelledby="cat-h">
        <Container>
          <SectionHead eyebrow="Products & solutions" title="Ten product families, one supplier." intro="Browse by family, then drill into ranges, brands and individual products. Every product can be added to a single requirement list." action={<Link href="/products" className={btn.secondary}>Browse all {productPages.length} products <ArrowRight className="h-4 w-4" /></Link>} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <li key={c.slug} className={`reveal ${i < 2 ? "lg:col-span-2" : ""}`}>
                <Link href={`/solutions/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
                  <Photo img={c.image} alt={c.name} className={`w-full ${i < 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`} sizes={i < 2 ? "(min-width:1024px) 620px, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw"} priority={false} label="Range details on request" />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="flex items-start justify-between gap-3 text-lg font-semibold leading-snug text-graphite group-hover:text-cobalt">
                      {c.name}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-steel transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt" />
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{c.short}</p>
                    <p className="mt-4 text-xs font-medium text-steel">{categoryCount(c.slug) ? `${categoryCount(c.slug)} products & lines` : "Models on request"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* E — Industries */}
      <section className="py-20 md:py-24" aria-labelledby="ind-h">
        <Container>
          <SectionHead eyebrow="Solutions by industry" title="Start from the kind of space you are equipping." intro="Each industry page lists the products and ranges buyers in that sector usually ask us for, and what we need from you to quote." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <li key={ind.slug} className="reveal">
                <Link href={`/industries/${ind.slug}`} className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg bg-graphite p-6 text-white">
                  <Image src={ind.image} alt="" fill sizes="(min-width:1024px) 400px, 50vw" className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/40 to-transparent" />
                  <span className="relative">
                    <span className="flex items-center justify-between text-xl font-semibold">{ind.name}<ArrowUpRight className="h-5 w-5 opacity-70 transition group-hover:opacity-100" /></span>
                    <span className="mt-2 block text-sm leading-relaxed text-white/80">{ind.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* F — Featured products */}
      <section className="border-t border-line bg-white py-20 md:py-24" aria-labelledby="feat-h">
        <Container>
          <SectionHead eyebrow="From the catalogue" title="Featured products" intro="A selection from the 2026 B2B catalogue. Prices and availability are shared with your quotation." action={<Link href="/products" className={btn.ghost}>View the full catalogue <ArrowRight className="h-4 w-4" /></Link>} />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => <li key={p.slug} className="reveal"><ProductCard p={p} /></li>)}
          </ul>
        </Container>
      </section>

      {/* G — Brands */}
      <section className="py-20 md:py-24" aria-labelledby="brand-h">
        <Container>
          <SectionHead eyebrow="Brand ecosystem" title="Authorised where it matters. Broad where you need it." intro="We are an authorised distributor for Samsung (consumer and commercial), Newline and IFB, and the exclusive hospitality & healthcare partner of Ingram Micro. Other brands are supplied through our partner network." action={<Link href="/brands" className={btn.secondary}>All brands <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brandGroups.slice(0, 6).map((g) => {
              const list = brands.filter((b) => b.group === g);
              return (
                <div key={g} className="reveal rounded-lg border border-line bg-white p-6">
                  <h3 className="text-sm font-semibold text-graphite">{g}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {list.map((b) => (
                      <li key={b.slug} className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[13px] ${b.relation === "supplied" ? "border-line text-slate" : "border-cobalt/30 bg-cobalt-soft font-medium text-cobalt"}`}>
                        {b.name}{b.relation === "authorised" && <span className="text-[10px] font-semibold uppercase tracking-wider">· Authorised</span>}{b.relation === "partner" && <span className="text-[10px] font-semibold uppercase tracking-wider">· Partner</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* H — Procurement */}
      <section className="border-y border-line bg-white py-20 md:py-24" aria-labelledby="proc-h">
        <Container>
          <SectionHead eyebrow="How procurement works" title="From product list to quotation in four steps." />
          <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Explore products", "Browse by category, industry or brand, or search the catalogue."],
              ["Build your requirement", "Add products, set quantities and note sizes, models or questions."],
              ["Submit one enquiry", "Send the whole list with your project details in a single request."],
              ["Talk to our sales team", "We follow up to confirm specifications, availability and pricing."],
            ].map(([t, d], i) => (
              <li key={t} className="bg-white p-6 md:p-8">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-sm font-semibold tabular-nums text-cobalt">{i + 1}</span>
                <h3 className="mt-5 text-base font-semibold text-graphite">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/products" className={btn.primary}>Start a requirement list <ArrowRight className="h-4 w-4" /></Link><Link href="/request-quote" className={btn.secondary}>Describe a project instead</Link></div>
        </Container>
      </section>

      {/* I — About */}
      <section className="py-20 md:py-24" aria-labelledby="about-h">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-white">
            <Image src="/images/site/warehouse-chromepet.webp" alt="Palaniappa Electronics warehouse, Chromepet, Chennai" fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
          </div>
          <div>
            <Eyebrow className="mb-3">About Palaniappa Electronics</Eyebrow>
            <h2 id="about-h" className="text-3xl font-semibold tracking-tight md:text-4xl">Two businesses: distribution and institutional sales.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate">Established in June 2004 as a partnership in Chennai, Palaniappa Electronics distributes Samsung consumer electronics and appliances to more than 500 retail outlets across Chennai, Kanchipuram, Chengalpattu and Thiruvallur.</p>
            <p className="mt-4 leading-relaxed text-slate">Its projects division supplies hotels, hospitals, educational institutions, retail and manufacturing businesses with commercial displays, IT infrastructure, mattresses and linen, hotel amenities, laundry, cooling and HVAC from more than 25 brands — backed by a 20,000 sq. ft warehouse and a team of over 50 people.</p>
            <Link href="/about" className={`${btn.ghost} mt-6`}>More about the company <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>

      {/* J — CTA */}
      <section className="pb-20 md:pb-24">
        <Container>
          <div className="grid gap-10 overflow-hidden rounded-lg bg-graphite p-8 text-white md:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Planning a project or a bulk order?</h2>
              <p className="mt-4 max-w-xl text-white/70">Send your product list, a BOQ or just a description of the space. Our B2B team responds with specifications, availability and a quotation.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/request-quote" className={btn.primary}>Request a Quote <ArrowRight className="h-4 w-4" /></Link><a href={`tel:${site.contact.sales.tel}`} className="inline-flex items-center justify-center rounded border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-white/50">Call {site.contact.sales.phone}</a></div>
            </div>
            <dl className="grid gap-4 border-t border-white/10 pt-8 text-sm lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div><dt className="text-white/50">{site.contact.sales.label}</dt><dd className="mt-1"><a className="hover:underline" href={`mailto:${site.contact.sales.email}`}>{site.contact.sales.email}</a></dd></div>
              <div><dt className="text-white/50">{site.contact.enquiry.label}</dt><dd className="mt-1">{site.contact.enquiry.phone} · <a className="hover:underline" href={`mailto:${site.contact.enquiry.email}`}>{site.contact.enquiry.email}</a></dd></div>
              <div><dt className="text-white/50">{site.addresses.office.label}</dt><dd className="mt-1 text-white/80">{site.addresses.office.lines.join(", ")}</dd></div>
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
