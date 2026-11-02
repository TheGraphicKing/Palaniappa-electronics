"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBasket } from "./basket";
import { ArrowRight, ChevronDown, List, Menu, X } from "./icons";

type NavCat = { slug: string; name: string; short: string; count: number };
type NavInd = { slug: string; name: string };

export function Header({ cats, inds }: { cats: NavCat[]; inds: NavInd[] }) {
  const pathname = usePathname();
  const { count, ready, setOpen } = useBasket();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<null | "products" | "industries">(null);
  const [mobile, setMobile] = useState(false);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
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
  const leave = () => { closeT.current = setTimeout(() => setMega(null), 120); };
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const link = "rounded px-3 py-2 text-sm font-medium text-graphite/80 transition-colors hover:text-graphite";

  return (
    <header className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/80 ${scrolled ? "border-line shadow-[0_1px_12px_rgba(23,27,35,.06)]" : "border-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-cobalt focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Palaniappa Electronics — home">
          <Image src="/images/brand/palaniappa-logo.png" alt="Palaniappa Electronics" width={720} height={236} priority className="h-9 w-auto lg:h-10" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <div className="relative" onMouseEnter={() => enter("products")} onMouseLeave={leave}>
            <button type="button" aria-expanded={mega === "products"} aria-controls="mega-products" onClick={() => setMega(mega === "products" ? null : "products")} className={`${link} inline-flex items-center gap-1 ${active("/solutions") || active("/products") ? "text-graphite" : ""}`}>
              Products &amp; Solutions <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega === "products" ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="relative" onMouseEnter={() => enter("industries")} onMouseLeave={leave}>
            <button type="button" aria-expanded={mega === "industries"} aria-controls="mega-industries" onClick={() => setMega(mega === "industries" ? null : "industries")} className={`${link} inline-flex items-center gap-1`}>
              Industries <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega === "industries" ? "rotate-180" : ""}`} />
            </button>
          </div>
          <Link href="/brands" className={`${link} ${active("/brands") ? "text-graphite" : ""}`} aria-current={active("/brands") ? "page" : undefined}>Brands</Link>
          <Link href="/about" className={link} aria-current={active("/about") ? "page" : undefined}>About Us</Link>
          <Link href="/contact" className={link} aria-current={active("/contact") ? "page" : undefined}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className="relative inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3 text-sm font-medium text-graphite hover:border-graphite/30" aria-label={`Open requirement list (${ready ? count : 0} items)`}>
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Requirement</span>
            <span key={count} className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold ${ready && count ? "animate-pop bg-cobalt text-white" : "bg-porcelain text-slate"}`}>{ready ? count : 0}</span>
          </button>
          <Link href="/request-quote" className="hidden h-10 items-center rounded bg-cobalt px-4 text-sm font-semibold text-white hover:bg-cobalt-dark md:inline-flex">Request a Quote</Link>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded border border-line lg:hidden" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop mega menus */}
      <div onMouseEnter={() => clearTimeout(closeT.current)} onMouseLeave={leave} className={`absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-panel transition-[opacity,transform] duration-200 lg:block ${mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        {mega === "products" && (
          <div id="mega-products" className="mx-auto grid max-w-site grid-cols-[1fr_280px] gap-10 px-8 py-8">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1 xl:grid-cols-3">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link href={`/solutions/${c.slug}`} className="group block rounded p-3 hover:bg-porcelain">
                    <span className="flex items-baseline justify-between gap-2 text-sm font-semibold text-graphite group-hover:text-cobalt">{c.name}<span className="text-xs font-normal text-steel">{c.count || ""}</span></span>
                    <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-slate">{c.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col justify-between rounded-lg bg-porcelain p-6">
              <div>
                <p className="text-sm font-semibold text-graphite">Browse the full catalogue</p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate">Search every product, filter by brand or industry, and build one requirement list.</p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/products" className="inline-flex items-center justify-between rounded bg-graphite px-4 py-2.5 text-sm font-semibold text-white hover:bg-black">All products <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/solutions" className="inline-flex items-center justify-between rounded border border-line bg-white px-4 py-2.5 text-sm font-semibold text-graphite">All categories <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        )}
        {mega === "industries" && (
          <div id="mega-industries" className="mx-auto max-w-site px-8 py-6">
            <ul className="grid grid-cols-3 gap-2">
              {inds.map((i) => (
                <li key={i.slug}><Link href={`/industries/${i.slug}`} className="flex items-center justify-between rounded p-3 text-sm font-semibold text-graphite hover:bg-porcelain hover:text-cobalt">{i.name}<ArrowRight className="h-4 w-4 text-steel" /></Link></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile menu (portal: the header's backdrop-filter would otherwise clip fixed children) */}
      {mobile && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <Image src="/images/brand/palaniappa-logo.png" alt="Palaniappa Electronics" width={720} height={236} className="h-8 w-auto" />
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded border border-line" aria-label="Close menu" onClick={() => setMobile(false)} autoFocus><X className="h-5 w-5" /></button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
            <p className="px-2 pb-2 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-steel">Products &amp; Solutions</p>
            {cats.map((c) => <Link key={c.slug} href={`/solutions/${c.slug}`} className="block rounded px-2 py-2.5 text-[15px] text-graphite active:bg-porcelain">{c.name}</Link>)}
            <Link href="/products" className="block rounded px-2 py-2.5 text-[15px] font-semibold text-cobalt">Browse all products →</Link>
            <p className="px-2 pb-2 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-steel">Industries</p>
            {inds.map((i) => <Link key={i.slug} href={`/industries/${i.slug}`} className="block rounded px-2 py-2.5 text-[15px] text-graphite">{i.name}</Link>)}
            <div className="mt-6 border-t border-line pt-4">
              {[["/brands", "Brands"], ["/about", "About Us"], ["/contact", "Contact"], ["/careers", "Careers"]].map(([h, l]) => <Link key={h} href={h} className="block rounded px-2 py-2.5 text-[15px] font-medium text-graphite">{l}</Link>)}
            </div>
          </nav>
          <div className="border-t border-line p-4"><Link href="/request-quote" className="flex h-12 items-center justify-center rounded bg-cobalt text-sm font-semibold text-white">Request a Quote</Link></div>
        </div>,
        document.body,
      )}
    </header>
  );
}
