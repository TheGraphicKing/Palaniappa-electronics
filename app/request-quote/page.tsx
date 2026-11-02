import type { Metadata } from "next";
import { Breadcrumbs, Container } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Quote — Submit Your Requirement",
  description: "Send one consolidated request for quotation for multiple products, with quantities and project details, to Palaniappa Electronics' B2B sales team.",
  alternates: { canonical: "/request-quote" },
};

export default function RequestQuote() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[["Home", "/"], ["Request a Quote", "/request-quote"]]} />
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Request a quote</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate">Review your products and quantities, add your details, and send it as one enquiry. Our B2B team follows up to confirm specifications, availability and pricing.</p>
        </Container>
      </section>
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-line bg-white p-6 md:p-8"><EnquiryForm /></div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-sm font-semibold">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate">
              <li><span className="font-semibold text-graphite">1.</span> You receive a reference number on screen.</li>
              <li><span className="font-semibold text-graphite">2.</span> Our sales team reviews the products and quantities.</li>
              <li><span className="font-semibold text-graphite">3.</span> We contact you to confirm specifications, availability and pricing.</li>
            </ol>
          </div>
          <div className="rounded-lg border border-line bg-white p-6 text-sm">
            <h2 className="font-semibold">Prefer to talk?</h2>
            <p className="mt-2 text-slate">{site.contact.sales.label}: <a href={`tel:${site.contact.sales.tel}`} className="font-semibold text-graphite">{site.contact.sales.phone}</a></p>
            <p className="mt-1 text-slate"><a href={`mailto:${site.contact.sales.email}`} className="text-graphite hover:text-cobalt">{site.contact.sales.email}</a></p>
          </div>
        </aside>
      </Container>
    </>
  );
}
