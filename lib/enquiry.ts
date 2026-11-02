// Shared enquiry types + validation (used by the form and the API route).
export const INDUSTRY_OPTIONS = [
  "Hotels & Hospitality",
  "Hospitals & Healthcare",
  "Education",
  "Corporate Offices",
  "Manufacturing",
  "Retail & Commercial Spaces",
  "Restaurants",
  "Builders & Real Estate",
  "Retailer / Dealer",
  "Home / Personal",
  "Other",
] as const;

export type EnquiryItem = { slug: string; name: string; category: string; qty: number; note?: string };
export type EnquiryPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  message: string;
  items: EnquiryItem[];
  page?: string;
  website?: string; // honeypot — must be empty
};

export type FieldErrors = Partial<Record<"name" | "company" | "email" | "phone" | "location" | "message" | "items", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{8,20}$/;

export function validateEnquiry(p: Partial<EnquiryPayload>, opts: { requireItemsOrMessage?: boolean } = {}): FieldErrors {
  const e: FieldErrors = {};
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  if (s(p.name).length < 2) e.name = "Enter your name.";
  if (s(p.company).length < 2) e.company = "Enter your company or institution name.";
  if (!EMAIL.test(s(p.email))) e.email = "Enter a valid email address, for example name@company.com.";
  if (!PHONE.test(s(p.phone)) || s(p.phone).replace(/\D/g, "").length < 8) e.phone = "Enter a phone number with at least 8 digits.";
  if (s(p.location).length < 2) e.location = "Enter the city or project location.";
  if (s(p.message).length > 4000) e.message = "Keep the message under 4,000 characters.";
  const items = Array.isArray(p.items) ? p.items : [];
  if (items.length > 300) e.items = "Too many products in one enquiry.";
  if (opts.requireItemsOrMessage && items.length === 0 && s(p.message).length < 5) e.message = "Add products to your requirement or describe what you need.";
  return e;
}

export function enquiryText(p: EnquiryPayload, reference?: string) {
  const lines = [
    reference ? `Enquiry reference: ${reference}` : "New enquiry",
    "",
    `Name: ${p.name}`,
    `Company: ${p.company}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `Industry: ${p.industry || "—"}`,
    `Location: ${p.location}`,
  ];
  if (p.items.length) {
    lines.push("", "Requested products:");
    p.items.forEach((it, i) => lines.push(`${i + 1}. ${it.name} (${it.category}) — Qty ${it.qty}${it.note ? ` — Note: ${it.note}` : ""}`));
  }
  if (p.message) lines.push("", "Message:", p.message);
  if (p.page) lines.push("", `Sent from: ${p.page}`);
  return lines.join("\n");
}
