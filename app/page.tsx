import Link from "next/link";
import Image from "next/image";
import { brands, categories, categoryCount, customers, getProduct, industries, productHref, productPages } from "@/lib/catalog";
import { Container, Eyebrow, SectionHead, Title, btn } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { Showroom, type ShowroomFamily } from "@/components/showroom";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { HeroStage } from "@/components/hero-stage";

const FEATURED = ["hotel-guest-room-tv", "t-type-kiosk", "classroom-interactive-panel", "glass-door-mini-bar", "washer-extractor", "360-degree-cassette-ac", "maharaja-suite", "hotel-rfid-card-locks"];
const SHOWROOM_PICKS: Record<string, string[]> = {
  "displays-signage-led": ["self-ordering-kiosk", "transparent-led", "video-wall", "outdoor-led-billboard"],
  "hospitality-in-room-solutions": ["hotel-guest-room-tv", "hepi-guest-interface", "maharaja-suite", "bath-robe-and-slippers"],
  "interactive-displays-collaboration": ["classroom-interactive-panel", "video-conferencing-display", "rugged-tab", "medical-monitor"],
};

export default function Home() {
  const featured = FEATURED.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  const families: ShowroomFamily[] = categories.map((c) => {
    const picks = (SHOWROOM_PICKS[c.slug] || []).map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
    const pool = picks.length ? picks : productPages.filter((p) => p.category === c.slug && p.image).slice(0, 4);
    return {
      slug: c.slug, name: c.name, short: c.short, image: c.image?.src ?? null, contain: !!c.image?.contain, count: categoryCount(c.slug), pages: c.pages,
      products: pool.slice(0, 4).map((p) => ({ slug: p.slug, name: p.name, image: p.image?.src ?? null, contain: !!p.image?.contain, href: productHref(p) })),
    };
  });
  const logoBrands = brands.filter((b) => b.logo);
  const keyPartners = [
    { name: "Samsung", line: "Consumer electronics & appliances distributor for Chennai & suburbs. Authorised distributor for commercial TV & displays." },
    { name: "Newline", line: "Authorised distributor for interactive displays." },
    { name: "IFB", line: "Authorised distributor for industrial laundry & dishwashers." },
    { name: "Ingram Micro", line: "Exclusive hospitality & healthcare partner (TechVantage Solutions), covering 500+ brands." },
  ];
  const custLogos = [...customers.Hotels, ...customers.Hospitals, ...customers.Education].filter((c) => !/institution|college$/i.test(c.name)).slice(0, 18);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative -mt-16 overflow-hidden pt-16 lg:-mt-[76px] lg:pt-[76px]">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-48 top-10 h-[620px] w-[620px] rounded-full bg-brass/[0.09] blur-[140px]" aria-hidden="true" />
        <div className="absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-signal/[0.07] blur-[140px]" aria-hidden="true" />
        <Container className="relative pb-16 pt-12 text-center md:pb-20 md:pt-14">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-xs text-muted backdrop-blur">
              <span className="rounded-full bg-brass px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-950">Since 2004</span>
              Samsung distributor &amp; B2B supplier · Chennai
            </p>
            <h1 className="mx-auto mt-8 max-w-5xl font-display text-[2.9rem] font-semibold leading-[0.98] tracking-tightest text-fg sm:text-7xl xl:text-[5.6rem]">
              Technology &amp; equipment <em className="em pr-2">for every</em> business.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              From Samsung electronics and commercial displays to hospitality equipment, commercial cooling and laundry — Palaniappa Electronics supplies hotels, hospitals, campuses, offices and retailers from one Chennai warehouse.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/solutions" className={btn.primary}>Explore Our Solutions <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" /></Link>
              <Link href="/request-quote" className={btn.secondary}>Submit a Requirement</Link>
            </div>
          </div>
          <HeroStage />
          {/* mobile product chips */}
          <ul className="mt-10 grid grid-cols-2 gap-2 sm:hidden">
            {[["Displays & AV", "/solutions/displays-signage-led"], ["Hotel amenities", "/solutions/hotel-hospital-amenities"], ["Refrigeration", "/solutions/commercial-refrigeration"], ["IT & CCTV", "/solutions/it-infrastructure"]].map(([l, h]) => (
              <li key={h}><Link href={h} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-fg">{l}<ArrowUpRight className="h-4 w-4 text-brass" /></Link></li>
            ))}
          </ul>
        </Container>

        {/* family ticker */}
        <div className="relative border-y border-line bg-ink-950/60">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="flex shrink-0 animate-marquee items-center gap-10 py-4 pr-10 hover:[animation-play-state:paused]" aria-label="Product families">
              {[...categories, ...categories].map((c, n) => (
                <li key={c.slug + n} aria-hidden={n >= categories.length}>
                  <Link href={`/solutions/${c.slug}`} tabIndex={n >= categories.length ? -1 : undefined} className="flex items-center gap-10 whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-brass">
                    {c.name}<span className="h-1 w-1 rounded-full bg-brass/70" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Scale (bento) ───────────── */}
      <section aria-labelledby="scale-h" className="py-20 md:py-28">
        <Container>
          <SectionHead eyebrow="Company scale" title="Built over *two decades* in Chennai." intro="Two businesses under one roof: Samsung distribution to retailers, and institutional supply for hotels, hospitals, campuses, retail and manufacturing." />
          <h2 id="scale-h" className="sr-only">Company scale</h2>
          <div className="grid auto-rows-[minmax(180px,auto)] gap-3 md:grid-cols-4">
            <div className="spot group relative overflow-hidden rounded-2xl border border-line md:col-span-2 md:row-span-2">
              <Image src="/images/site/warehouse-chromepet.webp" alt="Palaniappa Electronics warehouse, Chromepet" fill sizes="(min-width:768px) 640px, 100vw" className="object-cover opacity-70 transition duration-1000 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="relative flex h-full min-h-[360px] flex-col justify-end p-7">
                <span className="font-display text-6xl font-semibold tracking-tightest text-fg md:text-7xl">20,000<span className="ml-2 text-2xl font-medium text-muted">sq ft</span></span>
                <span className="mt-2 text-sm text-muted">Warehouse in Chromepet for stock availability and prompt delivery</span>
              </div>
            </div>
            <div className="spot flex flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-brass/[0.14] to-surface p-7">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">Turnover</span>
              <span><span className="block font-display text-5xl font-semibold tracking-tight text-fg">₹150 Cr+</span><span className="mt-1 block text-sm text-muted">Annual turnover</span></span>
            </div>
            <div className="spot flex flex-col justify-between rounded-2xl border border-line bg-surface p-7">
              <span className="inline-flex h-9 w-fit items-center rounded-lg bg-plinth px-3"><Image src="/images/brands/samsung.webp" alt="Samsung" width={90} height={30} className="h-3 w-auto" /></span>
              <span><span className="block font-display text-5xl font-semibold tracking-tight text-fg">500+</span><span className="mt-1 block text-sm text-muted">Retail outlets supplied with Samsung</span></span>
            </div>
            <div className="spot flex flex-col justify-between rounded-2xl border border-line bg-surface p-7">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Since June 2004</span>
              <span><span className="block font-display text-5xl font-semibold tracking-tight text-fg">21<em className="em text-4xl"> yrs</em></span><span className="mt-1 block text-sm text-muted">Built on trust, ethics and methodical systems</span></span>
            </div>
            <div className="spot relative overflow-hidden rounded-2xl border border-line">
              <Image src="/images/site/our-team.webp" alt="The Palaniappa Electronics team" fill sizes="320px" className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-ink-950/20" />
              <span className="relative flex h-full flex-col justify-end p-7"><span className="block font-display text-5xl font-semibold tracking-tight text-fg">50+</span><span className="mt-1 block text-sm text-muted">Experienced employees</span></span>
            </div>
            <div className="spot flex flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-7 md:col-span-4 md:flex-row md:items-center">
              <span className="shrink-0"><span className="block font-display text-5xl font-semibold tracking-tight text-fg">25+</span><span className="mt-1 block text-sm text-muted">Brands in commercial products</span></span>
              <div className="grid flex-1 grid-cols-4 gap-2 md:grid-cols-8">
                {["samsung", "ifb", "sony", "lg", "king-koil", "haier", "mitsubishi-electric", "voltas"].map((b) => (
                  <span key={b} className="flex h-11 items-center justify-center rounded-lg bg-plinth/95 px-2"><Image src={`/images/brands/${b}.webp`} alt="" width={120} height={40} className="max-h-6 w-auto object-contain" /></span>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-subtle">Figures as published in the Palaniappa Electronics B2B Catalogue 2026.</p>
        </Container>
      </section>

      {/* ───────────── Showroom ───────────── */}
      <section className="border-t border-line py-20 md:py-28" aria-label="Product families">
        <Container>
          <SectionHead eyebrow="The showroom" title="Ten product families. *One* purchase order." intro="Move through the index to preview each family. The images are real installations and products from our 2026 catalogue." action={<Link href="/products" className={btn.secondary}>Browse all {productPages.length} products <ArrowRight className="h-4 w-4" /></Link>} />
          <Showroom families={families} />
        </Container>
      </section>

      {/* ───────────── Industries ───────────── */}
      <section className="relative overflow-hidden border-t border-line bg-ink-950 py-20 md:py-28" aria-label="Solutions by industry">
        <Container>
          <SectionHead eyebrow="Solutions by industry" title="Start from the space you are *equipping*." intro="Each industry page lists what buyers in that sector ask us for, and what we need from you to quote." />
        </Container>
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:px-6 lg:px-10 2xl:px-[calc((100vw_-_1320px)/2_+_2.5rem)]">
          {industries.map((ind, n) => (
            <li key={ind.slug} className="w-[80%] shrink-0 snap-start sm:w-[44%] lg:w-[30%] xl:w-[24%]">
              <Link href={`/industries/${ind.slug}`} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-6">
                <Image src={ind.image} alt="" fill sizes="(min-width:1280px) 320px, (min-width:640px) 45vw, 80vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
                <span className="absolute left-6 top-6 text-xs tabular-nums text-fg/70">{String(n + 1).padStart(2, "0")}</span>
                <span className="relative">
                  <span className="flex items-center justify-between font-display text-2xl font-semibold tracking-tight text-fg">{ind.name}<ArrowUpRight className="h-5 w-5 text-brass transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  <span className="mt-3 block text-sm leading-relaxed text-muted">{ind.short}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Featured products ───────────── */}
      <section className="border-t border-line py-20 md:py-28" aria-label="Featured products">
        <Container>
          <SectionHead eyebrow="From the catalogue" title="Featured *products*" intro="Prices and availability are shared with your quotation. Add anything to your requirement list as you browse." action={<Link href="/products" className={btn.ghost}>View the full catalogue <ArrowRight className="h-4 w-4" /></Link>} />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((p) => <li key={p.slug} className="reveal"><ProductCard p={p} /></li>)}
          </ul>
        </Container>
      </section>

      {/* ───────────── Brands ───────────── */}
      <section className="border-t border-line py-20 md:py-28" aria-label="Brand ecosystem">
        <Container>
          <SectionHead eyebrow="Brand ecosystem" title="Authorised where it matters. *Broad* where you need it." action={<Link href="/brands" className={btn.secondary}>All brands <ArrowRight className="h-4 w-4" /></Link>} />
          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {keyPartners.map((k) => {
              const b = brands.find((x) => x.name === k.name);
              return (
                <li key={k.name} className="spot flex flex-col bg-surface p-7">
                  <div className="flex h-14 items-center">
                    {b?.logo ? <span className="inline-flex h-12 items-center rounded-lg bg-plinth px-4"><Image src={b.logo.src} alt={k.name} width={b.logo.w} height={b.logo.h} className="max-h-7 w-auto" /></span> : <span className="font-display text-2xl font-semibold text-fg">{k.name}</span>}
                  </div>
                  <span className="mt-6 inline-flex w-fit rounded-full border border-brass/40 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brass">{k.name === "Ingram Micro" ? "Partner" : "Authorised"}</span>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{k.line}</p>
                </li>
              );
            })}
          </ul>
        </Container>
        <div className="mt-10 flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="flex shrink-0 animate-marquee items-center gap-4 pr-4 [animation-duration:70s]" aria-label="Brands we supply">
            {[...logoBrands, ...logoBrands].map((b, n) => (
              <li key={b.slug + n} aria-hidden={n >= logoBrands.length} className="flex h-16 w-40 shrink-0 items-center justify-center rounded-lg bg-plinth/95 px-5">
                <Image src={b.logo!.src} alt={n >= logoBrands.length ? "" : b.name} width={b.logo!.w} height={b.logo!.h} className="max-h-8 w-auto object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Procurement ───────────── */}
      <section className="border-t border-line bg-ink-950 py-20 md:py-28" aria-label="How procurement works">
        <Container>
          <SectionHead eyebrow="How procurement works" title="From product list to quotation in *four steps*." />
          <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span className="hairline absolute left-0 right-0 top-[34px] hidden lg:block" aria-hidden="true" />
            {[
              ["Explore products", "Browse by category, industry or brand, or search the full catalogue."],
              ["Build your requirement", "Add products, set quantities and note sizes, models or questions."],
              ["Submit one enquiry", "Send the whole list with your project details in a single request."],
              ["Talk to our sales team", "We follow up to confirm specifications, availability and pricing."],
            ].map(([t, d], i) => (
              <li key={t} className="relative">
                <span className="relative grid h-[68px] w-[68px] place-items-center rounded-full border border-line-strong bg-ink-950 font-serif text-3xl italic text-brass">{i + 1}</span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fg">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 flex flex-col gap-3 sm:flex-row"><Link href="/products" className={btn.primary}>Start a requirement list <ArrowRight className="h-4 w-4" /></Link><Link href="/request-quote" className={btn.secondary}>Describe a project instead</Link></div>
        </Container>
      </section>

      {/* ───────────── About + customers ───────────── */}
      <section className="border-t border-line py-20 md:py-28" aria-labelledby="about-h">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <Image src="/images/site/warehouse-chromepet.webp" alt="Palaniappa Electronics warehouse, Chromepet, Chennai" fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-xl border border-white/10 bg-ink-900/90 px-5 py-4 shadow-panel backdrop-blur-xl sm:right-8">
              <span className="block font-display text-3xl font-semibold tracking-tight text-fg">20,000 <span className="text-base font-normal text-muted">sq ft</span></span>
              <span className="text-xs text-subtle">Warehouse, Chromepet</span>
            </div>
          </div>
          <div>
            <Eyebrow>About the company</Eyebrow>
            <h2 id="about-h" className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">A distributor with an <em className="em">institutional</em> sales arm.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">Established in June 2004, Palaniappa Electronics distributes Samsung consumer electronics and appliances to more than 500 retail outlets across Chennai, Kanchipuram, Chengalpattu and Thiruvallur.</p>
            <p className="mt-4 leading-relaxed text-muted">Its projects division supplies hotels, hospitals, educational institutions, retail and manufacturing with commercial displays, IT infrastructure, mattresses and linen, hotel amenities, laundry, cooling and HVAC from more than 25 brands.</p>
            <Link href="/about" className={`${btn.ghost} mt-7`}>More about the company <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
        <Container className="mt-24">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">Supplied to hotels, hospitals and institutions across South India</p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {custLogos.map((c) => (
              <li key={c.name} className="flex h-20 items-center justify-center rounded-lg bg-plinth/[0.97] p-3 opacity-80 transition-opacity hover:opacity-100">
                <Image src={c.logo} alt={c.name} width={c.w} height={c.h} className="max-h-11 w-auto object-contain" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
