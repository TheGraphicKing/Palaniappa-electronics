"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBasket } from "./basket";
import { ArrowRight, ArrowUpRight, ChevronDown, List, Menu, X } from "./icons";

type NavCat = { slug: string; name: string; short: string; count: number; image: string | null };
type NavInd = { slug: string; name: string; short: string; image: string };

export function Header({ cats, inds }: { cats: NavCat[]; inds: NavInd[] }) {
  const pathname = usePathname();
  const { count, ready, setOpen } = useBasket();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<null | "products" | "industries">(null);
  const [hoverCat, setHoverCat] = useState(0);
  const [mobile, setMobile] = useState(false);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setMega(null); setMobile(false); }, [pathname]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setMega(null); setMobile(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const enter = (m: "products" | "industries") => { clearTimeout(closeT.current); setMega(m); };
  const leave = () => { closeT.current = setTimeout(() => setMega(null), 140); };
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const link = (on: boolean) => `relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${on ? "text-fg" : "text-muted hover:text-fg"}`;
  const hc = cats[hoverCat];

  return (
    <header className={`sticky top-0 z-40 transition-[background-color,border-color] duration-500 ${scrolled || mega ? "border-b border-line bg-ink-900/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-brass focus:px-3 focus:py-2 focus:text-ink-950">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Palaniappa Electronics — home">
          <Image src="/images/brand/palaniappa-logo-reversed.png" alt="Palaniappa Electronics" width={720} height={237} priority className="h-8 w-auto lg:h-9" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 rounded-full border border-line bg-white/[0.02] p-1 lg:flex">
          <div onMouseEnter={() => enter("products")} onMouseLeave={leave}>
            <button type="button" aria-expanded={mega === "products"} aria-controls="mega-products" onClick={() => setMega(mega === "products" ? null : "products")} className={`${link(active("/solutions") || active("/products") || mega === "products")} inline-flex items-center gap-1`}>
              Products &amp; Solutions <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega === "products" ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div onMouseEnter={() => enter("industries")} onMouseLeave={leave}>
            <button type="button" aria-expanded={mega === "industries"} aria-controls="mega-industries" onClick={() => setMega(mega === "industries" ? null : "industries")} className={`${link(active("/industries") || mega === "industries")} inline-flex items-center gap-1`}>
              Industries <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega === "industries" ? "rotate-180" : ""}`} />
            </button>
          </div>
          {[["/brands", "Brands"], ["/about", "About Us"], ["/contact", "Contact"]].map(([h, l]) => (
            <Link key={h} href={h} className={link(active(h))} aria-current={active(h) ? "page" : undefined}>{l}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className="relative inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-3.5 text-[13px] font-medium text-fg transition-colors hover:border-brass/60" aria-label={`Open requirement list (${ready ? count : 0} items)`}>
            <List className="h-4 w-4 text-muted" />
            <span className="hidden sm:inline">Requirement</span>
            <span key={count} className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold tabular-nums ${ready && count ? "animate-pop bg-brass text-ink-950" : "bg-white/10 text-muted"}`}>{ready ? count : 0}</span>
          </button>
          <Link href="/request-quote" className="hidden h-10 items-center rounded-full bg-brass px-5 text-[13px] font-semibold text-ink-950 transition-all hover:bg-brass-hi hover:shadow-glow md:inline-flex">Request a Quote</Link>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong lg:hidden" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop mega menus */}
      <div onMouseEnter={() => clearTimeout(closeT.current)} onMouseLeave={leave} className={`absolute inset-x-0 top-full hidden border-b border-line bg-ink-900 shadow-panel transition-[opacity,transform] duration-300 lg:block ${mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        {mega === "products" && (
          <div id="mega-products" className="mx-auto grid max-w-site grid-cols-[1fr_360px] gap-10 px-10 py-9">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              {cats.map((c, i) => (
                <li key={c.slug}>
                  <Link href={`/solutions/${c.slug}`} onMouseEnter={() => setHoverCat(i)} onFocus={() => setHoverCat(i)} className={`group flex items-center justify-between gap-3 rounded-lg px-4 py-3 transition-colors ${hoverCat === i ? "bg-white/[0.04]" : ""}`}>
                    <span className="flex items-baseline gap-3">
                      <span className="w-5 text-[11px] tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`text-[14.5px] font-medium transition-colors ${hoverCat === i ? "text-fg" : "text-muted"}`}>{c.name}</span>
                    </span>
                    <ArrowRight className={`h-4 w-4 shrink-0 text-brass transition-all ${hoverCat === i ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
              <div className="relative aspect-[16/10] bg-ink-800">
                {hc?.image && <Image key={hc.slug} src={hc.image} alt="" fill sizes="360px" className="animate-fade object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-semibold text-fg">{hc?.name}</p>
                <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted">{hc?.short}</p>
                <div className="mt-auto flex gap-2 pt-5">
                  <Link href="/products" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brass px-4 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-brass-hi">All products <ArrowRight className="h-3.5 w-3.5" /></Link>
                  <Link href="/solutions" className="inline-flex items-center justify-center rounded-full border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-fg hover:border-brass/50">Categories</Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {mega === "industries" && (
          <div id="mega-industries" className="mx-auto max-w-site px-10 py-8">
            <ul className="grid grid-cols-6 gap-3">
              {inds.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="group block overflow-hidden rounded-xl border border-line bg-surface">
                    <div className="relative aspect-[4/3]"><Image src={i.image} alt="" fill sizes="200px" className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" /></div>
                    <p className="flex items-center justify-between px-3.5 py-3 text-[13px] font-semibold text-fg">{i.name}<ArrowUpRight className="h-3.5 w-3.5 text-brass" /></p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile menu — portal so the header's backdrop-filter can't clip it */}
      {mobile && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex animate-fade flex-col bg-ink-900 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <Image src="/images/brand/palaniappa-logo-reversed.png" alt="Palaniappa Electronics" width={720} height={237} className="h-8 w-auto" />
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong" aria-label="Close menu" onClick={() => setMobile(false)} autoFocus><X className="h-5 w-5" /></button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
            <p className="pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Products &amp; Solutions</p>
            {cats.map((c, i) => <Link key={c.slug} href={`/solutions/${c.slug}`} className="flex items-baseline gap-3 border-b border-line/60 py-3 text-[15px] text-fg"><span className="w-5 text-[11px] tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>{c.name}</Link>)}
            <Link href="/products" className="block py-4 text-[15px] font-semibold text-brass">Browse all products →</Link>
            <p className="pb-3 pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Industries</p>
            {inds.map((i) => <Link key={i.slug} href={`/industries/${i.slug}`} className="block border-b border-line/60 py-3 text-[15px] text-fg">{i.name}</Link>)}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {[["/brands", "Brands"], ["/about", "About Us"], ["/contact", "Contact"], ["/careers", "Careers"]].map(([h, l]) => <Link key={h} href={h} className="rounded-lg border border-line px-4 py-3 text-[15px] font-medium text-fg">{l}</Link>)}
            </div>
          </nav>
          <div className="border-t border-line p-4"><Link href="/request-quote" className="flex h-12 items-center justify-center rounded-full bg-brass text-sm font-semibold text-ink-950">Request a Quote</Link></div>
        </div>,
        document.body,
      )}
    </header>
  );
}
