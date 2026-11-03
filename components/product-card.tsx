import Link from "next/link";
import { getCategory, productHref, type Product, type ProductLite } from "@/lib/catalog";
import { Photo } from "./ui";
import { AddToRequirement } from "./add-button";
import { ArrowUpRight } from "./icons";

type CardProduct = Pick<Product, "slug" | "name" | "category" | "brands" | "image" | "hasPage" | "section"> & { categoryName?: string };

export function ProductCard({ p, showCategory = true, priority = false }: { p: CardProduct | ProductLite; showCategory?: boolean; priority?: boolean }) {
  const href = productHref(p);
  const catName = ("categoryName" in p && p.categoryName) || getCategory(p.category)?.name || "";
  return (
    <article className="spot group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-brass/30 hover:shadow-lift">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden="true">
        <Photo img={p.image} alt={p.name} className="aspect-[4/3] w-full" sizes="(min-width:1280px) 300px, (min-width:768px) 33vw, 50vw" priority={priority} />
        <span className="absolute right-3 top-3 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-ink-950/80 text-brass opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        {showCategory && <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.16em] text-subtle">{p.section}</p>}
        <h3 className="font-display text-[15px] font-semibold leading-snug text-fg sm:text-base">
          <Link href={href} className="transition-colors hover:text-brass">{p.name}</Link>
        </h3>
        {p.brands.length > 0 && <p className="line-clamp-1 text-[13px] text-muted">{p.brands.slice(0, 4).join(" · ")}{p.brands.length > 4 ? " +" + (p.brands.length - 4) : ""}</p>}
        <div className="mt-auto flex flex-col gap-2.5 pt-3">
          <Link href={href} className="text-[13px] font-semibold text-muted transition-colors hover:text-brass">{p.hasPage ? "View details →" : "View range →"}</Link>
          <AddToRequirement slug={p.slug} name={p.name} category={catName} href={href} image={p.image?.src} className="w-full justify-center" />
        </div>
      </div>
    </article>
  );
}
