"use client";
// Requirement basket: products + quantities + per-item notes, persisted in
// localStorage so it survives page navigation and reloads.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type BasketItem = { slug: string; name: string; category: string; href: string; image?: string | null; qty: number; note?: string };
type AddInput = Omit<BasketItem, "qty" | "note"> & { qty?: number };

type Ctx = {
  items: BasketItem[];
  ready: boolean;
  count: number;
  add: (i: AddInput, opts?: { silent?: boolean }) => void;
  notify: (msg: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  setNote: (slug: string, note: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  open: boolean;
  setOpen: (o: boolean) => void;
  toast: string | null;
};

const KEY = "pe-requirement-v2";
const BasketCtx = createContext<Ctx | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(v)) setItems(v.filter((x) => x && typeof x.slug === "string" && typeof x.name === "string"));
    } catch {}
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) try { setItems(JSON.parse(e.newValue || "[]")); } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const flash = useCallback((m: string) => {
    setToast(m);
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const add = useCallback((i: AddInput, opts?: { silent?: boolean }) => {
    setItems((cur) => {
      const ex = cur.find((x) => x.slug === i.slug);
      if (ex) return cur.map((x) => (x.slug === i.slug ? { ...x, qty: x.qty + (i.qty || 1) } : x));
      return [...cur, { ...i, qty: Math.max(1, i.qty || 1) }];
    });
    if (!opts?.silent) flash(`Added “${i.name}” to your requirement`);
  }, [flash]);

  const remove = useCallback((slug: string) => setItems((cur) => cur.filter((x) => x.slug !== slug)), []);
  const setQty = useCallback((slug: string, qty: number) => setItems((cur) => cur.map((x) => (x.slug === slug ? { ...x, qty: Math.min(99999, Math.max(1, Math.round(qty) || 1)) } : x))), []);
  const setNote = useCallback((slug: string, note: string) => setItems((cur) => cur.map((x) => (x.slug === slug ? { ...x, note: note.slice(0, 500) } : x))), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items]);

  const value = useMemo<Ctx>(() => ({ items, ready, count: items.length, add, notify: flash, remove, setQty, setNote, clear, has, open, setOpen, toast }), [items, ready, add, flash, remove, setQty, setNote, clear, has, open, toast]);
  return <BasketCtx.Provider value={value}>{children}</BasketCtx.Provider>;
}

export function useBasket() {
  const c = useContext(BasketCtx);
  if (!c) throw new Error("useBasket must be used inside BasketProvider");
  return c;
}
