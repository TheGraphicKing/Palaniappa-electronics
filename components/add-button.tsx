"use client";
import { useBasket } from "./basket";
import { Check, Plus } from "./icons";

type Props = { slug: string; name: string; category: string; href: string; image?: string | null; size?: "sm" | "lg"; className?: string };

export function AddToRequirement({ slug, name, category, href, image, size = "sm", className = "" }: Props) {
  const { add, has, remove, ready } = useBasket();
  const inList = ready && has(slug);
  const base = size === "lg"
    ? "inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2"
    : "inline-flex items-center gap-1.5 rounded px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt";
  const tone = inList
    ? "bg-cobalt-soft text-cobalt hover:bg-[#E2E8FC]"
    : size === "lg" ? "bg-cobalt text-white hover:bg-cobalt-dark" : "border border-line bg-white text-graphite hover:border-cobalt hover:text-cobalt";
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
