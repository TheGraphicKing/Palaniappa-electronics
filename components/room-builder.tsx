"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBasket } from "./basket";
import { ArrowRight, Check, Minus, Plus } from "./icons";

export type BuilderItem = { slug: string; name: string; category: string; href: string; image: string | null; contain: boolean; per: number };
export type BuilderPreset = { id: string; name: string; unit: string; max: number; start: number; image: string; items: BuilderItem[] };

function useCountUp(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current, d = 450;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / d), e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(a + (target - a) * e));
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function RoomBuilder({ presets }: { presets: BuilderPreset[] }) {
  const { add, notify, setOpen } = useBasket();
  const [pi, setPi] = useState(0);
  const p = presets[pi];
  const [count, setCount] = useState(p.start);
  const [per, setPer] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  useEffect(() => { setCount(p.start); setPer({}); setDone(false); }, [pi, p.start]);
  useEffect(() => setDone(false), [count, per]);

  const rows = useMemo(() => p.items.map((it) => ({ ...it, per: per[it.slug] ?? it.per })).filter((r) => r.per > 0), [p, per]);
  const total = rows.reduce((n, r) => n + r.per * count, 0);
  const shown = useCountUp(total);

  const addAll = () => {
    rows.forEach((r) => add({ slug: r.slug, name: r.name, category: r.category, href: r.href, image: r.image, qty: r.per * count }, { silent: true }));
    notify(`Added ${rows.length} product lines (${total.toLocaleString("en-IN")} items) for ${count} ${p.unit}`);
    setDone(true);
  };
  const bump = (slug: string, base: number, d: number) => setPer((m) => ({ ...m, [slug]: Math.max(0, Math.min(20, (m[slug] ?? base) + d)) }));

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* space picker */}
      <div className="flex gap-2 overflow-x-auto border-b border-line p-3 [scrollbar-width:none]" role="tablist" aria-label="Choose a space">
        {presets.map((x, n) => (
          <button key={x.id} type="button" role="tab" aria-selected={n === pi} onClick={() => setPi(n)}
            className={`flex shrink-0 items-center gap-3 rounded-xl border py-2 pl-2 pr-4 text-left transition-all ${n === pi ? "border-brass bg-brass-tint" : "border-transparent hover:border-line-strong"}`}>
            <span className="force-dark relative h-10 w-12 overflow-hidden rounded-lg"><Image src={x.image} alt="" fill sizes="48px" className="object-cover" /></span>
            <span className={`text-sm font-semibold ${n === pi ? "text-fg" : "text-muted"}`}>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* controls + total */}
        <div className="flex flex-col border-b border-line p-6 md:p-8 lg:border-b-0 lg:border-r">
          <label htmlFor="rb-count" className="text-sm font-medium text-muted">How many {p.unit}?</label>
          <div className="mt-3 flex items-end gap-3">
            <input type="number" inputMode="numeric" min={1} max={p.max} value={count} onChange={(e) => setCount(Math.max(1, Math.min(p.max, Number(e.target.value) || 1)))}
              className="w-36 rounded-xl border border-line-strong bg-canvas px-4 py-2 font-display text-5xl font-semibold tabular-nums tracking-tight text-fg focus:border-brass focus:outline-none" aria-label={`Number of ${p.unit}`} />
            <span className="pb-3 text-lg text-subtle">{p.unit}</span>
          </div>
          <input id="rb-count" type="range" min={1} max={p.max} value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="mt-6 w-full accent-brass" aria-label={`Number of ${p.unit} slider`} />
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-subtle"><span>1</span><span>{p.max}</span></div>

          <div className="mt-8 rounded-2xl border border-line bg-canvas p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Your starter list</p>
            <p className="mt-3 font-display text-6xl font-semibold tabular-nums tracking-tightest text-fg" aria-live="polite">{shown.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-sm text-muted">items across <span className="font-semibold text-fg">{rows.length}</span> product lines for <span className="font-semibold text-fg">{count.toLocaleString("en-IN")}</span> {p.unit}</p>
          </div>

          <button type="button" onClick={addAll} disabled={!rows.length}
            className={`mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all ${done ? "bg-brass-tint text-brass ring-1 ring-inset ring-brass/40" : "bg-brass text-onaccent hover:bg-brass-hi hover:shadow-glow"}`}>
            {done ? (<><Check className="h-4 w-4" /> Added to your requirement</>) : (<><Plus className="h-4 w-4" /> Add all {total.toLocaleString("en-IN")} items to requirement</>)}
          </button>
          {done && (
            <div className="mt-3 flex animate-rise items-center justify-center gap-4 text-sm">
              <button type="button" onClick={() => setOpen(true)} className="font-semibold text-brass hover:underline">Review list</button>
              <span className="text-line-strong">|</span>
              <Link href="/request-quote" className="inline-flex items-center gap-1 font-semibold text-fg hover:text-brass">Get a quotation <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
          <p className="mt-auto pt-6 text-xs leading-relaxed text-subtle">A typical starting point built from our catalogue. Adjust per-room quantities on the right, then refine models and specifications with our team.</p>
        </div>

        {/* items */}
        <ul className="max-h-[640px] divide-y divide-line overflow-y-auto" aria-label="Items per room">
          {p.items.map((it) => {
            const q = per[it.slug] ?? it.per;
            return (
              <li key={it.slug} className={`flex items-center gap-4 px-5 py-3 transition-opacity md:px-6 ${q === 0 ? "opacity-40" : ""}`}>
                <span className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-line ${it.contain ? "bg-plinth" : "bg-ink-800"}`}>
                  {it.image && <Image src={it.image} alt="" fill sizes="64px" className={it.contain ? "object-contain p-1.5 mix-blend-multiply" : "object-cover"} />}
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={it.href} className="block truncate text-sm font-semibold text-fg hover:text-brass">{it.name}</Link>
                  <span className="block truncate text-xs text-subtle">{it.category}</span>
                </span>
                <span className="hidden text-right sm:block">
                  <span key={q * count} className="block animate-rise font-display text-lg font-semibold tabular-nums text-fg">{(q * count).toLocaleString("en-IN")}</span>
                  <span className="block text-[11px] text-subtle">total</span>
                </span>
                <span className="inline-flex h-9 items-center rounded-full border border-line-strong">
                  <button type="button" onClick={() => bump(it.slug, it.per, -1)} className="grid h-9 w-8 place-items-center text-muted hover:text-fg" aria-label={`Fewer ${it.name} per ${p.unit.replace(/s$/, "")}`}><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums text-fg">{q}<span className="text-[10px] font-normal text-subtle">/{p.unit === "outlets" ? "out" : "rm"}</span></span>
                  <button type="button" onClick={() => bump(it.slug, it.per, 1)} className="grid h-9 w-8 place-items-center text-muted hover:text-fg" aria-label={`More ${it.name} per ${p.unit.replace(/s$/, "")}`}><Plus className="h-3.5 w-3.5" /></button>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
