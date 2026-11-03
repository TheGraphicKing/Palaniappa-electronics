"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBasket } from "./basket";
import { ArrowRight, Box, Plus, Search } from "./icons";

type Item = { t: "family" | "industry" | "product"; n: string; s: string; h: string; i: string | null; c: boolean; k: string; slug?: string; cat?: string };
const LABEL = { family: "Product family", industry: "Industry", product: "Product" } as const;
const SUGGEST = ["minibar", "kiosk", "LED wall", "cassette AC", "interactive", "washer", "door lock", "Samsung"];

function score(it: Item, q: string) {
  const name = it.n.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const compact = it.k.replace(/[^a-z0-9]/g, "");
  if (!words.every((w) => it.k.includes(w) || compact.includes(w.replace(/[^a-z0-9]/g, "")))) return -1;
  let s = 0;
  if (name.startsWith(q)) s += 60; else if (name.includes(q)) s += 35;
  words.forEach((w) => { if (name.includes(w)) s += 10; });
  if (it.t !== "product") s += 8;
  return s;
}

export function CommandPalette() {
  const router = useRouter();
  const { add, has } = useBasket();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [data, setData] = useState<Item[] | null>(null);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const show = useCallback(() => { setOpen(true); setQ(""); setSel(0); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); setQ(""); setSel(0); }
      else if (e.key === "/" && !/input|textarea|select/i.test((e.target as HTMLElement).tagName)) { e.preventDefault(); show(); }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", show);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-command-palette", show); };
  }, [show]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setTimeout(() => input.current?.focus(), 20);
    if (!data) fetch("/search-index.json").then((r) => r.json()).then(setData).catch(() => setData([]));
    return () => { document.body.style.overflow = ""; };
  }, [open, data]);

  const results = useMemo(() => {
    if (!data) return [];
    const query = q.trim().toLowerCase();
    if (!query) return data.filter((d) => d.t === "family");
    return data.map((d) => [d, score(d, query)] as const).filter(([, s]) => s >= 0).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([d]) => d);
  }, [data, q]);
  useEffect(() => setSel(0), [q]);
  useEffect(() => { list.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" }); }, [sel]);

  const go = (it: Item) => { setOpen(false); router.push(it.h); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel]); }
    else if (e.key === "Escape") setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search the catalogue">
      <button type="button" className="absolute inset-0 animate-fade bg-black/50 backdrop-blur-sm" aria-label="Close search" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-2xl animate-rise overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-panel">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search className="h-5 w-5 text-brass" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown} placeholder="Search products, brands, families or industries…"
            className="h-16 flex-1 bg-transparent text-lg text-fg placeholder:text-subtle focus:outline-none" aria-controls="cmdk-list" aria-activedescendant={results[sel] ? `cmdk-${sel}` : undefined} role="combobox" aria-expanded="true" />
          <kbd className="rounded-md border border-line-strong px-2 py-1 text-[11px] text-subtle">Esc</kbd>
        </div>
        {!q && (
          <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
            <span className="mr-1 py-1 text-xs text-subtle">Try</span>
            {SUGGEST.map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-line-strong px-3 py-1 text-xs text-muted transition-colors hover:border-brass hover:text-brass">{s}</button>)}
          </div>
        )}
        <ul id="cmdk-list" ref={list} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {!data && <li className="px-4 py-8 text-center text-sm text-subtle">Loading catalogue…</li>}
          {data && results.length === 0 && <li className="px-4 py-8 text-center text-sm text-subtle">No matches for “{q}”. Try a product type or brand.</li>}
          {results.map((it, n) => {
            const inList = it.slug ? has(it.slug) : false;
            return (
              <li key={it.h + it.n} id={`cmdk-${n}`} data-i={n} role="option" aria-selected={n === sel} onMouseMove={() => setSel(n)}
                className={`group flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 ${n === sel ? "bg-surface-2" : ""}`} onClick={() => go(it)}>
                <span className={`relative h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-line ${it.c ? "bg-plinth" : "bg-ink-800"}`}>
                  {it.i ? <Image src={it.i} alt="" fill sizes="56px" className={it.c ? "object-contain p-1 mix-blend-multiply" : "object-cover"} /> : <Box className="absolute inset-0 m-auto h-5 w-5 text-subtle" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium text-fg">{it.n}</span>
                  <span className="block truncate text-xs text-subtle">{LABEL[it.t]}{it.cat ? ` · ${it.cat}` : ""}{it.s ? ` · ${it.s}` : ""}</span>
                </span>
                {it.t === "product" && it.slug ? (
                  <button type="button" onClick={(e) => { e.stopPropagation(); if (!inList) add({ slug: it.slug!, name: it.n, category: it.cat || "", href: it.h, image: it.i }); }}
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${inList ? "bg-brass-tint text-brass" : "border border-line-strong text-muted hover:border-brass hover:text-brass"}`} aria-label={inList ? `${it.n} is in your requirement` : `Add ${it.n} to requirement`}>
                    {inList ? "Added" : (<><Plus className="h-3.5 w-3.5" />Add</>)}
                  </button>
                ) : <ArrowRight className={`h-4 w-4 shrink-0 text-brass transition-opacity ${n === sel ? "opacity-100" : "opacity-0"}`} />}
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-5 py-2.5 text-[11px] text-subtle">
          <span><kbd className="font-sans">↑↓</kbd> navigate</span><span><kbd className="font-sans">↵</kbd> open</span><span className="ml-auto">{data ? `${data.length} items indexed` : ""}</span>
        </div>
      </div>
    </div>
  );
}
