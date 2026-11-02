"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check } from "./icons";
import { site } from "@/lib/site";
import type { EnquiryItem } from "@/lib/enquiry";

export function SentSummary() {
  const ref = useSearchParams().get("ref") || "";
  const [data, setData] = useState<{ reference: string; items: EnquiryItem[]; company: string } | null>(null);
  useEffect(() => {
    try { const d = JSON.parse(sessionStorage.getItem("pe-last-enquiry") || "null"); if (d && d.reference === ref) setData(d); } catch {}
  }, [ref]);
  if (!ref) return <div className="mx-auto max-w-xl text-center"><h1 className="text-3xl font-semibold">No enquiry to show</h1><p className="mt-3 text-slate">Start from the <Link href="/request-quote" className="text-cobalt">request a quote</Link> page.</p></div>;
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-line bg-white p-8 md:p-10">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E7F6EC] text-[#1F8F4E]"><Check className="h-6 w-6" /></span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Your enquiry has been sent</h1>
      <p className="mt-3 text-slate">Our B2B sales team has received it and will contact you to discuss specifications, availability and pricing.</p>
      <p className="mt-6 rounded bg-porcelain px-4 py-3 text-sm">Reference: <span className="font-mono font-semibold tabular-nums">{ref}</span></p>
      {data && data.items.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold">Products requested</h2>
          <ul className="mt-3 divide-y divide-line border-y border-line text-sm">
            {data.items.map((i) => <li key={i.slug} className="flex justify-between gap-4 py-2.5"><span>{i.name}<span className="block text-xs text-slate">{i.category}</span></span><span className="tabular-nums text-slate">Qty {i.qty}</span></li>)}
          </ul>
        </div>
      )}
      <p className="mt-8 text-sm text-slate">Need to add something? Call {site.contact.sales.phone} and quote your reference.</p>
      <div className="mt-6 flex gap-3"><Link href="/products" className="rounded bg-cobalt px-5 py-3 text-sm font-semibold text-white">Continue browsing</Link><Link href="/" className="rounded border border-line px-5 py-3 text-sm font-semibold">Home</Link></div>
    </div>
  );
}
