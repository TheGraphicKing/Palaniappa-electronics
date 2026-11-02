import Link from "next/link";
import NextImage from "next/image";
import type { Img } from "@/lib/catalog";
import { Box } from "./icons";

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded bg-cobalt px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cobalt-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 disabled:opacity-60",
  secondary: "inline-flex items-center justify-center gap-2 rounded border border-line bg-white px-5 py-3 text-sm font-semibold text-graphite transition-colors hover:border-graphite/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2",
  dark: "inline-flex items-center justify-center gap-2 rounded bg-graphite px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2",
  ghost: "inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt hover:text-cobalt-dark",
};

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.14em] text-cobalt ${className}`}>{children}</p>;
}

export function SectionHead({ eyebrow, title, intro, action }: { eyebrow?: string; title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-graphite md:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-pretty text-base leading-relaxed text-slate md:text-lg">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Product / category image. Falls back to a labelled placeholder when no verified photo exists. */
export function Photo({ img, alt, className = "", sizes = "(min-width:1024px) 33vw, 100vw", priority = false, label = "Photo shared on request" }: { img: Img | null; alt: string; className?: string; sizes?: string; priority?: boolean; label?: string }) {
  if (!img) {
    return (
      <div className={`relative flex flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,#F1F3F6,#E9EDF3)] text-steel ${className}`} role="img" aria-label={`${alt} — ${label.toLowerCase()}`}>
        <Box className="h-8 w-8" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${img.contain ? "bg-white" : "bg-[#EEF0F3]"} ${className}`}>
      <NextImage src={img.src} alt={alt} fill sizes={sizes} priority={priority} className={img.contain ? "object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]" : "object-cover transition-transform duration-700 group-hover:scale-[1.04]"} />
    </div>
  );
}

export function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium ${active ? "border-cobalt/30 bg-cobalt-soft text-cobalt" : "border-line bg-white text-slate"}`}>{children}</span>;
}

export function Breadcrumbs({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, href], i) => (
          <li key={href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-steel">/</span>}
            {i < items.length - 1 ? <Link href={href} className="hover:text-graphite">{label}</Link> : <span aria-current="page" className="text-graphite">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
