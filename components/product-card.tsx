import Link from "next/link";
import { getCategory, productHref, type Product, type ProductLite } from "@/lib/catalog";
import { Photo } from "./ui";
import { AddToRequirement } from "./add-button";
import { ArrowRight } from "./icons";

type CardProduct = Pick<Product, "slug" | "name" | "category" | "brands" | "image" | "hasPage" | "section"> & { categoryName?: string };

export function ProductCard({ p, showCategory = true, priority = false }: { p: CardProduct | ProductLite; showCategory?: boolean; priority?: boolean }) {
  const href = productHref(p);
  const catName = ("categoryName" in p && p.categoryName) || getCategory(p.category)?.name || "";
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cobalt" tabIndex={-1} aria-hidden="true">
        <Photo img={p.image} alt={p.name} className="aspect-[4/3] w-full" sizes="(min-width:1280px) 300px, (min-width:768px) 33vw, 50vw" priority={priority} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {showCategory && <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">{p.section}</p>}
        <h3 className="text-[15px] font-semibold leading-snug text-graphite">
          <Link href={href} className="hover:text-cobalt">{p.name}</Link>
        </h3>
        {p.brands.length > 0 && <p className="text-[13px] text-slate">{p.brands.slice(0, 4).join(" · ")}{p.brands.length > 4 ? " +" + (p.brands.length - 4) : ""}</p>}
        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-graphite hover:text-cobalt">
            {p.hasPage ? "View details" : "View range"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <AddToRequirement slug={p.slug} name={p.name} category={catName} href={href} image={p.image?.src} className="w-full justify-center" />
        </div>
      </div>
    </article>
  );
}
