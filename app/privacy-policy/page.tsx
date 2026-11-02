import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Palaniappa Electronics handles information submitted through this website.", alternates: { canonical: "/privacy-policy" } };

export default function Privacy() {
  return (
    <Legal title="Privacy Policy" path="/privacy-policy" updated="November 2026">
      <p>This policy explains what information {site.name} (“we”) collects through this website and how we use it.</p>
      <h2>Information you give us</h2>
      <p>When you submit an enquiry or request a quote, we receive the details you enter: name, company, email, phone number, industry, location, your message and the products and quantities in your requirement list. We use this information only to respond to your enquiry, prepare quotations and follow up on your requirement.</p>
      <h2>Information stored on your device</h2>
      <p>Your requirement list is stored in your browser’s local storage so it is kept while you browse. It is not sent to us until you submit an enquiry. You can clear it at any time from the requirement list.</p>
      <h2>Sharing</h2>
      <p>We do not sell your information. Enquiries are delivered to our sales team through email or business systems we use for that purpose. We may share relevant details with a brand or installation partner only when needed to fulfil your request.</p>
      <h2>WhatsApp and email</h2>
      <p>If you contact us through WhatsApp or email, those services handle your message under their own privacy terms.</p>
      <h2>Your choices</h2>
      <p>To correct or delete information you have sent us, contact {site.contact.enquiry.email} or call {site.contact.enquiry.phone}.</p>
      <h2>Contact</h2>
      <p>{site.name}, {site.addresses.office.lines.join(", ")}.</p>
    </Legal>
  );
}
