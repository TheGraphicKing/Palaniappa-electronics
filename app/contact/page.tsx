import type { Metadata } from "next";
import { site, waLink, SITE_URL } from "@/lib/site";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { Mail, Phone, Pin, WhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact — Chromepet, Chennai | B2B Sales +91 89399 99718",
  description: "Contact Palaniappa Electronics, No. 185/2 Abdul Kalam Street, Nagalkeni, Chromepet, Chennai 600044. B2B sales +91 89399 99718, enquiries +91 89399 99705. Serving Chennai, Kanchipuram, Chengalpattu, Thiruvallur and South India.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const c = site.contact;
  const o = site.addresses.office;
  const local = {
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${SITE_URL}/#localbusiness`, name: site.name, url: SITE_URL, image: `${SITE_URL}/images/site/warehouse-chromepet.webp`,
    telephone: c.sales.tel, email: c.sales.email, parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: { "@type": "PostalAddress", streetAddress: o.street, addressLocality: `${o.locality}, ${o.city}`, addressRegion: o.region, postalCode: o.postalCode, addressCountry: "IN" },
    areaServed: ["Chennai", "Kanchipuram", "Chengalpattu", "Thiruvallur", "Tamil Nadu"], hasMap: o.maps,
  };
  const cards = [
    { icon: <Phone className="h-5 w-5" />, title: c.sales.label, lines: [<a key="t" href={`tel:${c.sales.tel}`} className="font-semibold hover:text-brass">{c.sales.phone}</a>, <a key="m" href={`mailto:${c.sales.email}`} className="hover:text-brass">{c.sales.email}</a>] },
    { icon: <Mail className="h-5 w-5" />, title: c.enquiry.label, lines: [<a key="t" href={`tel:${c.enquiry.tel}`} className="font-semibold hover:text-brass">{c.enquiry.phone}</a>, <a key="m" href={`mailto:${c.enquiry.email}`} className="hover:text-brass">{c.enquiry.email}</a>] },
    { icon: <WhatsApp className="h-5 w-5" />, title: "WhatsApp", lines: [<a key="w" href={waLink("Hello Palaniappa Electronics, I have an enquiry.")} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brass">Chat with B2B sales</a>, <span key="n">{c.sales.phone}</span>] },
    { icon: <Phone className="h-5 w-5" />, title: "Office landlines", lines: c.landlines.map((l) => <a key={l} href={`tel:+91${l.replace(/\D/g, "").replace(/^0/, "")}`} className="hover:text-brass">{l}</a>) },
  ];
  return (
    <>
      <section className="page-hero border-b border-line">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[["Home", "/"], ["Contact", "/contact"]]} />
          <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tightest md:text-6xl">Contact us</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">We serve Chennai, Kanchipuram, Chengalpattu and Thiruvallur for Samsung distribution, and institutions across South India for commercial projects.</p>
        </Container>
      </section>
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {cards.map((k) => (
              <li key={k.title} className="rounded-lg border border-line bg-surface p-5">
                <span className="grid h-9 w-9 place-items-center rounded bg-brass-tint text-brass">{k.icon}</span>
                <h2 className="mt-4 text-sm font-semibold">{k.title}</h2>
                <div className="mt-1 flex flex-col text-sm text-muted">{k.lines}</div>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-line bg-surface p-5">
            <span className="grid h-9 w-9 place-items-center rounded bg-brass-tint text-brass"><Pin className="h-5 w-5" /></span>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div><h2 className="text-sm font-semibold">{o.label}</h2><address className="mt-1 text-sm not-italic text-muted">{o.lines.map((l) => <span key={l} className="block">{l}</span>)}</address><a href={o.maps} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-brass hover:underline">Get directions →</a></div>
              <div><h2 className="text-sm font-semibold">{site.addresses.registered.label}</h2><address className="mt-1 text-sm not-italic text-muted">{site.addresses.registered.lines.map((l) => <span key={l} className="block">{l}</span>)}</address></div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Send an enquiry</h2>
          <p className="mt-1 text-sm text-muted">Products in your requirement list are included automatically.</p>
          <div className="mt-8"><EnquiryForm /></div>
        </div>
      </Container>
      <JsonLd data={local} />
    </>
  );
}
