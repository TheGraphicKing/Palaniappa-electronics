"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ProductLite } from "@/lib/catalog";
import { Photo } from "./ui";
import { AddToRequirement } from "./add-button";
import { ArrowRight, Filter, Search, X } from "./icons";

type Opt = { value: string; label: string; count: number };
type Props = { products: ProductLite[]; categories: Opt[]; brands: Opt[]; industries: Opt[] };
type Sort = "catalogue" | "az" | "za" | "category";

const href = (p: ProductLite) => (p.hasPage ? `/products/${p.slug}` : `/solutions/${p.category}`);
const PAGE = 36;

export function CatalogueBrowser({ products, categories, brands, industries }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [cat, setCat] = useState<string[]>(sp.getAll("category"));
  const [brand, setBrand] = useState<string[]>(sp.getAll("brand"));
  const [ind, setInd] = useState<string[]>(sp.getAll("industry"));
  const [sort, setSort] = useState<Sort>((sp.get("sort") as Sort) || "catalogue");
  const [limit, setLimit] = useState(PAGE);
  const [panel, setPanel] = useState(false);

  // keep the URL shareable / indexable state in sync
  useEffect(() => {
    const t = setTimeout(() => {
      const u = new URLSearchParams();
      if (q.trim()) u.set("q", q.trim());
      cat.forEach((v) => u.append("category", v));
      brand.forEach((v) => u.append("brand", v));
      ind.forEach((v) => u.append("industry", v));
      if (sort !== "catalogue") u.set("sort", sort);
      const s = u.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [q, cat, brand, ind, sort, pathname, router]);
  useEffect(() => setLimit(PAGE), [q, cat, brand, ind, sort]);

  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = useMemo(() => {
    const r = products.filter(
      (p) =>
        (!cat.length || cat.includes(p.category)) &&
        (!brand.length || p.brands.some((b) => brand.includes(b))) &&
        (!ind.length || p.industries.some((i) => ind.includes(i))) &&
        words.every((w) => p.keywords.includes(w) || p.keywords.replace(/[^a-z0-9]/g, "").includes(w.replace(/[^a-z0-9]/g, ""))),
    );
    const s = [...r];
    if (sort === "az") s.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") s.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "category") s.sort((a, b) => a.categoryName.localeCompare(b.categoryName) || a.order - b.order);
    if (sort === "catalogue") {
      if (words.length) s.sort((a, b) => Number(!a.name.toLowerCase().includes(words[0])) - Number(!b.name.toLowerCase().includes(words[0])) || a.order - b.order);
      else s.sort((a, b) => a.order - b.order);
    }
    return s;
  }, [products, cat, brand, ind, sort, words.join(" ")]); // eslint-disable-line react-hooks/exhaustive-deps

  const active = cat.length + brand.length + ind.length + (q ? 1 : 0);
  const reset = () => { setQ(""); setCat([]); setBrand([]); setInd([]); setSort("catalogue"); };
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const label = (opts: Opt[], v: string) => opts.find((o) => o.value === v)?.label || v;

  const Group = ({ title, opts, list, set, id }: { title: string; opts: Opt[]; list: string[]; set: (v: string[]) => void; id: string }) => (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">{title}</legend>
      <ul className="space-y-1.5">
        {opts.map((o) => (
          <li key={o.value}>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-fg/90 hover:text-fg">
              <input type="checkbox" id={`${id}-${o.value}`} checked={list.includes(o.value)} onChange={() => toggle(list, set, o.value)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brass" />
              <span className="flex-1 leading-snug">{o.label}</span>
              <span className="text-xs tabular-nums text-subtle">{o.count}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );

  const filters = (
    <>
      <Group id="c" title="Category" opts={categories} list={cat} set={setCat} />
      <Group id="i" title="Industry" opts={industries} list={ind} set={setInd} />
      <Group id="b" title="Brand" opts={brands} list={brand} set={setBrand} />
    </>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">{filters}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands or applications — e.g. kiosk, minibar, cassette AC" className="h-11 w-full rounded border border-line bg-surface pl-10 pr-3 text-[15px] placeholder:text-subtle focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20" />
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPanel(true)} className="inline-flex h-11 items-center gap-2 rounded border border-line bg-surface px-4 text-sm font-medium lg:hidden" aria-expanded={panel}>
              <Filter className="h-4 w-4" /> Filters{active ? ` (${cat.length + brand.length + ind.length})` : ""}
            </button>
            <label className="sr-only" htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-11 rounded border border-line bg-surface px-3 text-sm text-fg focus:border-brass focus:outline-none">
              <option value="catalogue">Sort: Catalogue order</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2" aria-live="polite">
          <p className="mr-2 text-sm text-muted"><span className="font-semibold tabular-nums text-fg">{results.length}</span> {results.length === 1 ? "product" : "products"}</p>
          {cat.map((v) => <Pill key={v} onClear={() => toggle(cat, setCat, v)}>{label(categories, v)}</Pill>)}
          {ind.map((v) => <Pill key={v} onClear={() => toggle(ind, setInd, v)}>{label(industries, v)}</Pill>)}
          {brand.map((v) => <Pill key={v} onClear={() => toggle(brand, setBrand, v)}>{v}</Pill>)}
          {active > 0 && <button type="button" onClick={reset} className="text-sm font-semibold text-brass hover:text-brass-hi">Reset all</button>}
        </div>

        {results.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-semibold text-fg">No products match these filters.</p>
            <p className="mt-1 text-sm text-muted">Try fewer filters, or tell us what you need — through Ingram Micro and our brand partners we can source beyond this catalogue.</p>
            <div className="mt-5 flex justify-center gap-3"><button type="button" onClick={reset} className="rounded border border-line px-4 py-2 text-sm font-semibold">Reset filters</button><Link href="/request-quote" className="rounded bg-brass px-4 py-2 text-sm font-semibold text-onaccent">Describe your requirement</Link></div>
          </div>
        ) : (
          <>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.slice(0, limit).map((p) => (
                <li key={p.slug} className="animate-rise">
                  <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-300 hover:shadow-lift">
                    <Link href={href(p)} tabIndex={-1} aria-hidden="true"><Photo img={p.image} alt={p.name} className="aspect-[4/3] w-full" sizes="(min-width:1280px) 240px, (min-width:768px) 30vw, 50vw" /></Link>
                    <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
                      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">{p.section}</p>
                      <h3 className="text-sm font-semibold leading-snug text-fg sm:text-[15px]"><Link href={href(p)} className="hover:text-brass">{p.name}</Link></h3>
                      {p.brands.length > 0 && <p className="line-clamp-1 text-xs text-muted">{p.brands.join(" · ")}</p>}
                      <div className="mt-auto flex flex-col gap-2.5 pt-2">
                        <Link href={href(p)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-fg hover:text-brass">{p.hasPage ? "View details" : "View range"} <ArrowRight className="h-3.5 w-3.5" /></Link>
                        <AddToRequirement slug={p.slug} name={p.name} category={p.categoryName} href={href(p)} image={p.image?.src} className="w-full justify-center" />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            {limit < results.length && (
              <div className="mt-8 flex justify-center"><button type="button" onClick={() => setLimit((l) => l + PAGE)} className="rounded border border-line bg-surface px-6 py-3 text-sm font-semibold text-fg hover:border-fg/30">Show more ({results.length - limit} remaining)</button></div>
            )}
          </>
        )}
      </div>

      {panel && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close filters" onClick={() => setPanel(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-lg bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><p className="font-semibold">Filters</p><button type="button" onClick={() => setPanel(false)} className="grid h-9 w-9 place-items-center rounded border border-line" aria-label="Close" autoFocus><X className="h-4 w-4" /></button></div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
            <div className="flex gap-2 border-t border-line p-4"><button type="button" onClick={reset} className="h-11 flex-1 rounded border border-line text-sm font-semibold">Reset</button><button type="button" onClick={() => setPanel(false)} className="h-11 flex-[2] rounded bg-brass text-sm font-semibold text-onaccent">Show {results.length} products</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-brass/25 bg-brass-tint py-1 pl-2.5 pr-1 text-xs font-medium text-brass">
      {children}
      <button type="button" onClick={onClear} className="grid h-5 w-5 place-items-center rounded-sm hover:bg-surface" aria-label={`Remove filter ${typeof children === "string" ? children : ""}`}><X className="h-3 w-3" /></button>
    </span>
  );
}
