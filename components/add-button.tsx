"use client";
import { useBasket } from "./basket";
import { Check, Plus } from "./icons";

type Props = { slug: string; name: string; category: string; href: string; image?: string | null; size?: "sm" | "lg"; className?: string };

export function AddToRequirement({ slug, name, category, href, image, size = "sm", className = "" }: Props) {
  const { add, has, remove, ready } = useBasket();
  const inList = ready && has(slug);
  const base = size === "lg"
    ? "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    : "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
  const tone = inList
    ? "bg-brass-tint text-brass ring-1 ring-inset ring-brass/40 hover:bg-[#2C2619]"
    : size === "lg" ? "bg-brass text-ink-950 hover:bg-brass-hi hover:shadow-glow" : "border border-line-strong text-fg hover:border-brass hover:bg-brass hover:text-ink-950";
  return (
    <button
      type="button"
      aria-pressed={inList}
      onClick={() => (inList ? remove(slug) : add({ slug, name, category, href, image }))}
      className={`${base} ${tone} ${className}`}
    >
      {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {inList ? (size === "lg" ? "Added to requirement" : "Added") : "Add to Requirement"}
    </button>
  );
}
