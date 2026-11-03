"use client";
import { useEffect, useState } from "react";
import { PALETTES, PALETTE_KEY, DEFAULT_PALETTE } from "@/lib/theme";

// Preview-only palette picker. Appears after visiting any page with ?palettes (or ?palette=id).
export function PalettePicker() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    try { setActive(localStorage.getItem(PALETTE_KEY)); } catch {}
  }, []);
  if (!active) return null;
  const pick = (id: string) => {
    document.documentElement.setAttribute("data-palette", id);
    try { localStorage.setItem(PALETTE_KEY, id); } catch {}
    setActive(id);
  };
  const exit = () => {
    try { localStorage.removeItem(PALETTE_KEY); } catch {}
    document.documentElement.setAttribute("data-palette", DEFAULT_PALETTE);
    setActive(null);
  };
  return (
    <div className="fixed bottom-4 left-4 z-[80] w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface/95 p-4 shadow-panel backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Palette preview</p>
        <button type="button" onClick={() => setOpen(!open)} className="text-xs font-medium text-muted hover:text-fg">{open ? "Hide" : "Show"}</button>
      </div>
      {open && (
        <>
          <ul className="mt-3 space-y-1.5">
            {PALETTES.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => pick(p.id)} aria-pressed={active === p.id}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${active === p.id ? "border-brass bg-brass-tint" : "border-line hover:border-line-strong"}`}>
                  <span className="flex -space-x-1.5">{p.swatch.map((c) => <span key={c} className="h-5 w-5 rounded-full border-2 border-surface" style={{ background: c }} />)}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold text-fg">{p.name}</span><span className="block truncate text-[11px] text-subtle">{p.note}</span></span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-subtle">Light or dark follows your device setting. Switch your phone or laptop to dark mode to see the dark version.</p>
          <button type="button" onClick={exit} className="mt-2 text-xs font-semibold text-brass hover:underline">Exit preview</button>
        </>
      )}
    </div>
  );
}
