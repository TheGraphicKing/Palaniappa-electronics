"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Box } from "./icons";

export type ShowroomFamily = {
  slug: string; name: string; short: string; image: string | null; contain: boolean; count: number; pages: number[];
  products: { slug: string; name: string; image: string | null; contain: boolean; href: string }[];
};

const pagesLabel = (p: number[]) => (p.length ? `Catalogue p.${p.length > 1 ? `${String(Math.min(...p)).padStart(2, "0")}–${String(Math.max(...p)).padStart(2, "0")}` : String(p[0]).padStart(2, "0")}` : "Website listing");

export function Showroom({ families }: { families: ShowroomFamily[] }) {
  const [i, setI] = useState(0);
  const f = families[i];
  return (
    <>
      {/* Desktop: index + stage */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <ol className="border-t border-line" role="tablist" aria-label="Product families" aria-orientation="vertical">
          {families.map((x, n) => (
            <li key={x.slug} className="border-b border-line">
              <button
                type="button" role="tab" aria-selected={n === i} aria-controls="showroom-stage"
                onMouseEnter={() => setI(n)} onFocus={() => setI(n)} onClick={() => setI(n)}
                className="group flex w-full items-center gap-5 py-4 text-left"
              >
                <span className={`w-6 text-xs tabular-nums transition-colors ${n === i ? "text-brass" : "text-subtle"}`}>{String(n + 1).padStart(2, "0")}</span>
                <span className={`flex-1 font-display text-lg font-medium tracking-tight transition-all duration-300 ${n === i ? "translate-x-1 text-fg" : "text-muted group-hover:text-fg"}`}>{x.name}</span>
                <span className={`text-xs tabular-nums transition-colors ${n === i ? "text-brass" : "text-subtle"}`}>{x.count || "—"}</span>
              </button>
            </li>
          ))}
        </ol>

        <div id="showroom-stage" role="tabpanel" aria-live="polite" className="spot relative flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-line bg-surface">
          <div className={`relative flex-1 ${f.contain ? "bg-plinth" : "bg-ink-800"}`}>
            {f.image ? (
              <Image key={f.slug} src={f.image} alt={f.name} fill sizes="720px" className={`animate-fade ${f.contain ? "object-contain p-14 mix-blend-multiply" : "animate-kenburns object-cover"}`} />
            ) : (
              <div className="absolute inset-0 grid place-items-center"><div className="blueprint absolute inset-0" /><Box className="relative h-12 w-12 text-brass/60" /></div>
            )}
            {!f.contain && <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />}
            <div className="force-dark absolute left-5 top-5 flex gap-2">
              <span className="rounded-full border border-veil/15 bg-ink-950/70 px-3 py-1 text-[11px] font-medium tracking-wide text-fg backdrop-blur">{pagesLabel(f.pages)}</span>
              <span className="rounded-full border border-veil/15 bg-ink-950/70 px-3 py-1 text-[11px] font-medium tracking-wide text-fg backdrop-blur">{f.count ? `${f.count} products & lines` : "Models on request"}</span>
            </div>
          </div>
          <div className="relative border-t border-line p-7">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-md">
                <h3 key={f.slug} className="animate-rise font-display text-2xl font-semibold tracking-tight text-fg">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.short}</p>
              </div>
              <Link href={`/solutions/${f.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-onaccent transition-all hover:bg-brass-hi hover:shadow-glow">Open range <ArrowRight className="h-4 w-4" /></Link>
            </div>
            {f.products.length > 0 && (
              <ul className="mt-6 grid grid-cols-4 gap-3">
                {f.products.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.href} className="group block">
                      <div className={`relative aspect-[4/3] overflow-hidden rounded-lg border border-line ${p.contain ? "bg-plinth" : "bg-ink-800"}`}>
                        {p.image && <Image src={p.image} alt="" fill sizes="160px" className={`${p.contain ? "object-contain p-3 mix-blend-multiply" : "object-cover"} transition-transform duration-700 group-hover:scale-105`} />}
                      </div>
                      <p className="mt-2 line-clamp-1 text-xs font-medium text-muted transition-colors group-hover:text-fg">{p.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/tablet: snap carousel */}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden">
        {families.map((x, n) => (
          <li key={x.slug} className="w-[78%] shrink-0 snap-start sm:w-[45%]">
            <Link href={`/solutions/${x.slug}`} className="block overflow-hidden rounded-xl border border-line bg-surface">
              <div className={`relative aspect-[4/3] ${x.contain ? "bg-plinth" : "bg-ink-800"}`}>
                {x.image ? <Image src={x.image} alt="" fill sizes="80vw" className={x.contain ? "object-contain p-8 mix-blend-multiply" : "object-cover"} /> : <div className="absolute inset-0 grid place-items-center"><Box className="h-8 w-8 text-brass/60" /></div>}
                <span className="force-dark absolute left-3 top-3 rounded-full bg-ink-950/75 px-2.5 py-1 text-[11px] text-fg backdrop-blur">{String(n + 1).padStart(2, "0")} · {pagesLabel(x.pages)}</span>
              </div>
              <div className="p-4">
                <p className="flex items-start justify-between gap-2 font-display font-semibold text-fg">{x.name}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-brass" /></p>
                <p className="mt-1.5 line-clamp-2 text-[13px] text-muted">{x.short}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
