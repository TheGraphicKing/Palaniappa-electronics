import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BasketProvider } from "@/components/basket";
import { BasketDrawer } from "@/components/basket-drawer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/ui";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { categories, categoryCount, industries } from "@/lib/catalog";
import { SITE_URL, site } from "@/lib/site";

const inter = localFont({ src: "./fonts/inter-var.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Palaniappa Electronics, Chennai — Samsung Distributor & B2B Commercial Products", template: "%s | Palaniappa Electronics" },
  description: "Samsung consumer electronics distributor and B2B supplier of commercial displays, interactive panels, hospitality TVs, hotel amenities, commercial AC, refrigeration, laundry and dishwashing in Chennai since 2004.",
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_IN", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Palaniappa Electronics" }] },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#FFFFFF", width: "device-width", initialScale: 1 };

const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: site.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/palaniappa-logo.png`,
  foundingDate: "2004-06",
  description: site.description,
  email: site.contact.sales.email,
  telephone: site.contact.sales.tel,
  address: { "@type": "PostalAddress", streetAddress: site.addresses.office.street, addressLocality: `${site.addresses.office.locality}, ${site.addresses.office.city}`, addressRegion: site.addresses.office.region, postalCode: site.addresses.office.postalCode, addressCountry: "IN" },
  contactPoint: [
    { "@type": "ContactPoint", contactType: "sales", telephone: site.contact.sales.tel, email: site.contact.sales.email, areaServed: "IN", availableLanguage: ["en", "ta"] },
    { "@type": "ContactPoint", contactType: "customer service", telephone: site.contact.enquiry.tel, email: site.contact.enquiry.email, areaServed: "IN", availableLanguage: ["en", "ta"] },
  ],
};
const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: site.name, publisher: { "@id": `${SITE_URL}/#organization` }, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/products?q={search_term_string}` }, "query-input": "required name=search_term_string" } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name, short: c.short, count: categoryCount(c.slug) }));
  const inds = industries.map((i) => ({ slug: i.slug, name: i.name }));
  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="font-sans">
        <JsonLd data={[org, website]} />
        <BasketProvider>
          <Header cats={cats} inds={inds} />
          <main id="main">{children}</main>
          <Footer />
          <BasketDrawer />
          <WhatsAppFab />
        </BasketProvider>
      </body>
    </html>
  );
}
