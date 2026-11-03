"use client";
import { useRouter } from "next/navigation";
import { useBasket } from "./basket";

// "Request a Quote" on a product: makes sure the product is in the requirement, then opens the enquiry form.
export function QuoteNow(props: { slug: string; name: string; category: string; href: string; image?: string | null }) {
  const { has, add } = useBasket();
  const router = useRouter();
  return (
    <button type="button" onClick={() => { if (!has(props.slug)) add(props); router.push("/request-quote"); }} className="inline-flex items-center justify-center gap-2 rounded bg-fg px-5 py-3 text-sm font-semibold text-canvas transition-opacity hover:opacity-90">
      Request a Quote
    </button>
  );
}
