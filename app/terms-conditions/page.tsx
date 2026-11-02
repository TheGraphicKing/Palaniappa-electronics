import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms of use for the Palaniappa Electronics website.", alternates: { canonical: "/terms-conditions" } };

export default function Terms() {
  return (
    <Legal title="Terms & Conditions" path="/terms-conditions" updated="November 2026">
      <p>By using this website you agree to these terms.</p>
      <h2>Product information</h2>
      <p>Product descriptions and photos are provided for reference and are based on our B2B catalogue. Photos may show products in example installations. Models, specifications, availability and prices are confirmed only in a written quotation from {site.name}.</p>
      <h2>Enquiries and quotations</h2>
      <p>Submitting an enquiry does not create an order or a contract. Orders are subject to a quotation and its terms of supply.</p>
      <h2>Trademarks</h2>
      <p>Brand names and logos shown on this website belong to their respective owners and are used to identify the products we supply. Our relationship with each brand is described on the Brands page.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: {site.contact.enquiry.email}.</p>
    </Legal>
  );
}
