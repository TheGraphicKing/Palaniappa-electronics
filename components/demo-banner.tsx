import { DEMO_MODE, STUDIO, YEAR } from "@/lib/demo";

export function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div role="note" aria-label="Concept demo notice" className="force-dark relative z-50 border-b border-brass/30 bg-ink-950 text-[12px] leading-snug text-fg">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center sm:px-6 lg:px-10">
        <span className="rounded-full bg-brass px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-onaccent">Concept demo</span>
        <span>
          Designed &amp; built by <strong className="font-semibold">{STUDIO}</strong>. This is <strong className="font-semibold">not</strong> the official Palaniappa Electronics website.
          <span className="text-muted"> Design &amp; code © {YEAR} {STUDIO} — not licensed for use, hosting or reuse.</span>
        </span>
      </div>
    </div>
  );
}
