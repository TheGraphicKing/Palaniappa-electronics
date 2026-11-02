// Verified business facts. Each value notes its source:
//   [CAT]  = Palaniappa Electronics B2B Catalogue 2026 (supplied PDF)
//   [WEB]  = current website palaniappaelectronics.in (About / Contact / Home, via search index)
//   [MSG]  = introduction message from Muthu, Palaniappa Electronics
// Edit here; every page reads from this file.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://www.palaniappaelectronics.in"
).replace(/\/$/, "");

export const site = {
  name: "Palaniappa Electronics",
  shortName: "Palaniappa",
  founded: "2004-06", // [WEB] "partnership concern established on June 2004"; [CAT] "since 2004"
  description:
    "Chennai-based distributor and B2B supplier of Samsung consumer electronics, commercial displays, interactive panels, hospitality equipment, commercial cooling, laundry, dishwashing and hotel amenities.",

  contact: {
    sales: { label: "B2B sales & projects", phone: "+91 89399 99718", tel: "+918939999718", email: "b2b.palaniappa@gmail.com" }, // [CAT]
    enquiry: { label: "General & Samsung enquiries", phone: "+91 89399 99705", tel: "+918939999705", email: "enquiry.palaniappa@gmail.com" }, // [CAT]
    landlines: ["044 2248 1188", "044 2248 1267", "044 2954 6667"], // [WEB] homepage / contact page
    whatsapp: "918939999718",
  },

  addresses: {
    office: {
      label: "Admin office & warehouse",
      lines: ["No. 185/2, Abdul Kalam Street", "Nagalkeni, Chromepet", "Chennai 600044, Tamil Nadu"], // [CAT]; [WEB] spells it "Abdul Karam Street"
      street: "No. 185/2, Abdul Kalam Street, Nagalkeni",
      locality: "Chromepet",
      city: "Chennai",
      region: "Tamil Nadu",
      postalCode: "600044",
      maps: "https://www.google.com/maps/search/?api=1&query=Palaniappa+Electronics+Abdul+Kalam+Street+Nagalkeni+Chromepet+Chennai+600044",
    },
    registered: {
      label: "Registered office",
      lines: ["14/30, 2nd Main Road, New Colony", "Chromepet, Chennai 600044"], // [WEB]
    },
  },

  // [CAT] p.1–2. Shown exactly as published in the 2026 catalogue.
  stats: [
    { value: "2004", label: "Established in Chennai" },
    { value: "₹150 Cr+", label: "Annual turnover" },
    { value: "500+", label: "Retail outlets supplied with Samsung" },
    { value: "20,000", label: "Sq. ft warehouse in Chromepet" },
    { value: "50+", label: "Experienced employees" },
    { value: "25+", label: "Brands in commercial products" },
  ],

  // [CAT] "Samsung consumer electronics & durables distributor for Chennai, Kanchipuram, Chengelpet & Thiruvallur districts"
  // [WEB] "exclusive distributors for Samsung Consumer Electronics & Appliances for Chennai & Suburbs"
  samsungTerritory: ["Chennai", "Kanchipuram", "Chengalpattu", "Thiruvallur"],

  // [WEB] About page
  authorisations: [
    "Samsung Consumer Electronics & Appliances — distributor for Chennai & suburbs",
    "Samsung Commercial TV & Displays — authorised distributor",
    "Newline Interactive Displays — authorised distributor",
    "IFB Industrial Laundry & Dishwashers — authorised distributor",
  ],
  // [CAT] p.9
  ingram: "Exclusive Hospitality & Healthcare Partner of Ingram Micro (TechVantage Solutions), covering 500+ brands available in India.",

  segments: ["Hospitality", "Healthcare", "Educational Institutions", "Retail", "Restaurants", "Corporates", "Builders"], // [CAT] cover
};

export const nav = [
  { href: "/solutions", label: "Products & Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export const waLink = (text: string, number: string = site.contact.whatsapp) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
