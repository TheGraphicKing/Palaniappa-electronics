"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useBasket } from "./basket";
import { ArrowRight, Minus, Plus, X } from "./icons";

export function QtyStepper({ slug, qty, name }: { slug: string; qty: number; name: string }) {
  const { setQty } = useBasket();
  return (
    <div className="inline-flex h-9 items-center rounded border border-line bg-white">
      <button type="button" className="grid h-full w-8 place-items-center text-slate hover:text-graphite disabled:opacity-40" onClick={() => setQty(slug, qty - 1)} disabled={qty <= 1} aria-label={`Decrease quantity of ${name}`}><Minus className="h-3.5 w-3.5" /></button>
      <input type="number" inputMode="numeric" min={1} value={qty} onChange={(e) => setQty(slug, Number(e.target.value))} className="h-full w-14 border-x border-line text-center text-sm font-semibold tabular-nums text-graphite outline-none focus:bg-cobalt-soft [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" aria-label={`Quantity of ${name}`} />
      <button type="button" className="grid h-full w-8 place-items-center text-slate hover:text-graphite" onClick={() => setQty(slug, qty + 1)} aria-label={`Increase quantity of ${name}`}><Plus className="h-3.5 w-3.5" /></button>
    </div>
  );
}

export function BasketDrawer() {
  const { items, open, setOpen, remove, clear, toast } = useBasket();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [pathname, setOpen]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, setOpen]);

  return (
    <>
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4">
        {toast && (
          <div className="pointer-events-auto flex animate-rise items-center gap-4 rounded-lg bg-graphite px-4 py-3 text-sm text-white shadow-panel">
            <span>{toast}</span>
            <button type="button" onClick={() => setOpen(true)} className="shrink-0 font-semibold text-[#AFC0FF] hover:text-white">View list</button>
          </div>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="basket-title">
          <button type="button" className="absolute inset-0 bg-graphite/40 backdrop-blur-[2px]" aria-label="Close requirement list" onClick={() => setOpen(false)} />
          <div ref={panel} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slidein flex-col bg-white shadow-panel outline-none">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 id="basket-title" className="text-lg font-semibold text-graphite">Your requirement</h2>
                <p className="text-[13px] text-slate">{items.length} {items.length === 1 ? "product" : "products"}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded border border-line" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-line p-8 text-center">
                  <p className="font-medium text-graphite">No products added yet</p>
                  <p className="mt-1 text-sm text-slate">Use “Add to Requirement” on any product to build one consolidated enquiry.</p>
                  <Link href="/products" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cobalt">Browse products <ArrowRight className="h-4 w-4" /></Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((it) => (
                    <li key={it.slug} className="flex gap-3 py-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-line bg-white">
                        {it.image ? <Image src={it.image} alt="" fill sizes="64px" className="object-contain p-1" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={it.href} className="line-clamp-2 text-sm font-semibold text-graphite hover:text-cobalt">{it.name}</Link>
                        <p className="truncate text-xs text-slate">{it.category}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QtyStepper slug={it.slug} qty={it.qty} name={it.name} />
                          <button type="button" onClick={() => remove(it.slug)} className="text-xs font-medium text-slate underline-offset-2 hover:text-red-700 hover:underline">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="space-y-2 border-t border-line p-5">
                <Link href="/request-quote" className="flex h-12 items-center justify-center gap-2 rounded bg-cobalt text-sm font-semibold text-white hover:bg-cobalt-dark">Continue to enquiry <ArrowRight className="h-4 w-4" /></Link>
                <button type="button" onClick={clear} className="w-full py-2 text-xs font-medium text-slate hover:text-graphite">Clear all products</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
