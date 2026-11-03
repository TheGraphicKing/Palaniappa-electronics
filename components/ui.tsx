import Link from "next/link";
import NextImage from "next/image";
import type { Img } from "@/lib/catalog";
import { Box } from "./icons";

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
export const btn = {
  primary: `group/btn inline-flex items-center justify-center gap-2 rounded-full bg-brass px-6 py-3.5 text-sm font-semibold text-ink-950 transition-all duration-300 hover:bg-brass-hi hover:shadow-glow disabled:opacity-60 ${ring}`,
  secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-fg backdrop-blur transition-colors hover:border-brass/50 hover:bg-white/[0.06] ${ring}`,
  dark: `inline-flex items-center justify-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-white ${ring}`,
  ghost: "inline-flex items-center gap-1.5 text-sm font-semibold text-brass transition-colors hover:text-brass-hi",
};

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass ${className}`}>
      <span className="h-px w-6 bg-brass/70" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Title accepts *word* to render that word in serif italic brass. */
export function Title({ text, as: Tag = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return <Tag className={className}>{parts.map((p, i) => (p.startsWith("*") ? <em key={i} className="em">{p.slice(1, -1)}</em> : p))}</Tag>;
}

export function SectionHead({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <Title text={title} className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-5xl" />
        {intro && <p className="mt-5 text-pretty text-base leading-relaxed text-muted md:text-lg">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Product / category image. Cut-out products sit on a light plinth; scenes fill the frame.
 *  Falls back to a labelled placeholder when no verified photo exists. */
export function Photo({ img, alt, className = "", sizes = "(min-width:1024px) 33vw, 100vw", priority = false, label = "Photo shared on request" }: { img: Img | null; alt: string; className?: string; sizes?: string; priority?: boolean; label?: string }) {
  if (!img) {
    return (
      <div className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-ink-800 text-subtle ${className}`} role="img" aria-label={`${alt}${label ? " — " + label.toLowerCase() : ""}`}>
        <div className="blueprint absolute inset-0 opacity-60" aria-hidden="true" />
        <Box className="relative h-8 w-8 text-brass/70" />
        {label && <span className="relative text-xs font-medium">{label}</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${img.contain ? "bg-plinth" : "bg-ink-800"} ${className}`}>
      <NextImage src={img.src} alt={alt} fill sizes={sizes} priority={priority} className={img.contain ? "object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06]" : "object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"} />
      {img.contain && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/[0.06] to-transparent" aria-hidden="true" />}
    </div>
  );
}

export function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${active ? "border-brass/40 bg-brass-tint text-brass" : "border-line-strong text-muted"}`}>{children}</span>;
}

export function Breadcrumbs({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-subtle">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, href], i) => (
          <li key={href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-line-strong">/</span>}
            {i < items.length - 1 ? <Link href={href} className="transition-colors hover:text-fg">{label}</Link> : <span aria-current="page" className="text-muted">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Standard inner-page header band. */
export function PageHero({ crumbs, eyebrow, title, intro, children, aside }: { crumbs: [string, string][]; eyebrow?: string; title: string; intro?: string; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="blueprint absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brass/10 blur-[120px]" aria-hidden="true" />
      <Container className={`relative py-14 md:py-20 ${aside ? "grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center" : ""}`}>
        <div className="animate-rise">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <Eyebrow className="mt-8">{eyebrow}</Eyebrow>}
          <Title as="h1" text={title} className="mt-5 max-w-3xl text-[2.6rem] font-semibold leading-[1.02] tracking-tightest text-fg md:text-6xl" />
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
          {children}
        </div>
        {aside}
      </Container>
    </section>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
