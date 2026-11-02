import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { industries } from "@/lib/catalog";
import { Breadcrumbs, Container } from "@/components/ui";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Industries We Supply — Hotels, Hospitals, Education, Offices, Manufacturing, Retail",
  description: "Equipment and electronics for hotels, hospitals, schools and colleges, corporate offices, factories and retail spaces, supplied by Palaniappa Electronics, Chennai.",
  alternates: { canonical: "/industries" },
};

export default function Industries() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[["Home", "/"], ["Industries", "/industries"]]} />
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Industries we supply</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">Choose your sector to see the product families buyers in that sector usually need, and what we need from you to prepare a quotation.</p>
        </Container>
      </section>
      <Container className="py-14">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <li key={i.slug}>
              <Link href={`/industries/${i.slug}`} className="group block overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-lift">
                <div className="relative aspect-[16/10] bg-[#EEF0F3]"><Image src={i.image} alt="" fill sizes="(min-width:1024px) 400px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></div>
                <div className="p-5"><h2 className="flex items-center justify-between text-lg font-semibold group-hover:text-cobalt">{i.name}<ArrowUpRight className="h-4 w-4 text-steel" /></h2><p className="mt-2 text-sm leading-relaxed text-slate">{i.short}</p></div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
