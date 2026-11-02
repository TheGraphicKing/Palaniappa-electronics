// Typed product catalogue. Source of truth: data/catalog.json (extracted from the
// 2026 B2B catalogue by tools/extract.py) plus the few ranges listed on the current
// website that are not in the catalogue (marked source: "website").
// Everything a page needs is derived here; pages never hardcode product cards.
import raw from "@/data/catalog.json";

/* ------------------------------------------------------------------ types */
export type IndustrySlug =
  | "hotels-hospitality"
  | "hospitals-healthcare"
  | "education"
  | "corporate-offices"
  | "manufacturing"
  | "retail-commercial";

export type Img = { src: string; w: number; h: number; contain?: boolean };
export type Source = "catalogue" | "website" | "message";

export type Product = {
  slug: string;
  name: string;
  category: string; // top-level category slug
  range: string; // range slug (catalogue chapter)
  rangeName: string;
  section: string;
  brands: string[];
  imported: boolean; // catalogue lists an "Imported" range option
  industries: IndustrySlug[];
  applications: string[];
  description: string;
  image: Img | null;
  hasPage: boolean;
  source: Source;
  order: number;
};

export type Section = {
  title: string;
  description?: string;
  applications?: string[];
  brands: string[];
  features?: [string, string][];
  points?: string[];
  products: Product[];
  note?: string;
};

export type Range = { slug: string; name: string; intro: string; applications: string[]; image: Img | null; sections: Section[]; source: Source };

export type Category = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  image: Img | null;
  ranges: Range[];
  questions: [string, string][];
};

type RawItem = { name: string; slug: string; img: string; w: number; h: number; desc?: string };
type RawSection = { title: string; applications?: string[]; brands?: string[]; desc?: string; features?: [string, string][]; points?: string[]; items: RawItem[] };
type RawCat = { slug: string; group: string; name: string; short: string; seo: string; intro: string; applications: string[]; hero: string; sections: RawSection[] };
type RawData = { brands: Record<string, { logo: string; w: number; h: number }>; customers: Record<string, { name: string; logo: string; w: number; h: number }[]>; categories: RawCat[] };
const data = raw as unknown as RawData;

/* ------------------------------------------------------------ industries */
export const industries: {
  slug: IndustrySlug;
  name: string;
  short: string;
  intro: string;
  needs: string[];
  categories: string[];
  customers?: "Hotels" | "Hospitals" | "Education";
  image: string;
}[] = [
  {
    slug: "hotels-hospitality",
    name: "Hotels & Hospitality",
    short: "Guest-room TVs, door locks, mattresses, linen, amenities, laundry and cooling for hotels and resorts.",
    intro:
      "Opening or refurbishing a property means buying from dozens of suppliers. We supply the room, the back of house and the banquet hall from one purchase order: hospitality TVs with set-top boxes and branded boot-up screens, RFID locks and energy savers, King Koil mattresses, linen, minibars, in-room appliances, housekeeping equipment, commercial laundry, dishwashers and HVAC.",
    needs: ["Room count and room types", "Opening or handover date", "Brand standards (if any) for TVs, locks and amenities", "Laundry volume in kg per day"],
    categories: ["hospitality-in-room-solutions", "hotel-hospital-amenities", "laundry-dishwashing", "commercial-air-conditioning", "commercial-refrigeration", "displays-signage-led"],
    customers: "Hotels",
    image: "/images/hospitality-tv/hotel-guest-room-tv.webp",
  },
  {
    slug: "hospitals-healthcare",
    name: "Hospitals & Healthcare",
    short: "Patient-room TVs, medical monitors, pharma and blood-bank refrigeration, laundry, HVAC and IT networks.",
    intro:
      "Hospitals need equipment that runs around the clock and is easy to clean and service. We supply patient-room TVs, medical monitors, ice-lined, pharmaceutical, vaccine and blood-bank refrigerators, on-premise laundry, dishwashing for kitchens, HVAC, networking and CCTV, and the amenities for private rooms.",
    needs: ["Bed count and ward types", "Cold-chain requirements (temperatures, volumes)", "Laundry volume in kg per day", "IT and CCTV scope"],
    categories: ["hospitality-in-room-solutions", "commercial-refrigeration", "laundry-dishwashing", "interactive-displays-collaboration", "it-infrastructure", "commercial-air-conditioning", "hotel-hospital-amenities"],
    customers: "Hospitals",
    image: "/images/hospitality-tv/hospital-patient-room-tv.webp",
  },
  {
    slug: "education",
    name: "Education",
    short: "Interactive panels for classrooms, campus networks, signage, hostel laundry, kitchens and cooling.",
    intro:
      "Schools, colleges and universities buy in batches tied to academic calendars. We supply interactive touch displays for classrooms, hybrid displays for meeting rooms, laptops and tablets, campus networking and CCTV, signage and LED walls for auditoriums, and laundry, dishwashing and cooling for hostels.",
    needs: ["Number of classrooms and screen sizes", "Delivery window before the term starts", "Network and Wi-Fi coverage needed", "Hostel capacity"],
    categories: ["interactive-displays-collaboration", "it-infrastructure", "displays-signage-led", "laundry-dishwashing", "commercial-air-conditioning"],
    customers: "Education",
    image: "/images/interactive-displays/classroom-interactive-panel.webp",
  },
  {
    slug: "corporate-offices",
    name: "Corporate Offices",
    short: "Boardroom displays, video walls, hybrid meeting rooms, networks, devices and HVAC for offices.",
    intro:
      "We equip offices from reception to the boardroom: lobby displays and signage, indoor LED walls, hybrid video-conferencing displays, interactive panels, laptops and monitors, structured cabling, Wi-Fi, firewalls, EPABX and cassette or VRV/VRF air-conditioning.",
    needs: ["Number of meeting rooms and their sizes", "Headcount for devices", "Floor plan for cabling and AC", "Move-in date"],
    categories: ["interactive-displays-collaboration", "displays-signage-led", "it-infrastructure", "commercial-air-conditioning"],
    image: "/images/led-wall-solutions/corporate-boardroom-led-wall.webp",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Shop-floor dashboards, control-room video walls, rugged devices, networks, canteens and mobile robots.",
    intro:
      "Factories need equipment built for long shifts. We supply manufacturing dashboards and control-room LED walls, rugged mobiles and tablets, industrial networking and CCTV, canteen dishwashing, uniform laundry, cooling and Hikrobot mobile robots for material handling.",
    needs: ["Plant layout and shift pattern", "Number of display points", "Canteen covers per shift", "Material-handling loads (for mobile robots)"],
    categories: ["displays-signage-led", "it-infrastructure", "interactive-displays-collaboration", "laundry-dishwashing", "industrial-automation"],
    image: "/images/led-wall-solutions/control-room-war-room-led-wall.webp",
  },
  {
    slug: "retail-commercial",
    name: "Retail & Commercial Spaces",
    short: "Signage, kiosks, creative LED, refrigeration and cooling for stores, malls, restaurants and showrooms.",
    intro:
      "For stores, malls, restaurants and showrooms we supply digital signage and menu boards, self-ordering and wayfinding kiosks, transparent and curtain LED facades, visi coolers and chest freezers, back-bar and confectionery refrigeration, service ware and commercial air-conditioning.",
    needs: ["Store count and format", "Display locations and viewing distance", "Refrigeration volumes", "Launch date"],
    categories: ["displays-signage-led", "commercial-refrigeration", "commercial-air-conditioning", "hotel-hospital-amenities", "samsung-consumer-electronics"],
    image: "/images/digital-signage-kiosks/retail-showroom-signage.webp",
  },
];

// Range -> industries (from the "Application" lines of each catalogue chapter)
const rangeIndustries: Record<string, IndustrySlug[]> = {
  "hospitality-tv": ["hotels-hospitality", "hospitals-healthcare"],
  "digital-signage-kiosks": ["retail-commercial", "corporate-offices", "manufacturing", "hotels-hospitality", "hospitals-healthcare"],
  "led-wall-solutions": ["corporate-offices", "manufacturing", "hospitals-healthcare", "hotels-hospitality", "education", "retail-commercial"],
  "interactive-displays": ["education", "corporate-offices", "hotels-hospitality", "hospitals-healthcare", "manufacturing"],
  "unique-display-solutions": ["retail-commercial", "hotels-hospitality", "corporate-offices"],
  "unique-led-displays": ["retail-commercial", "hotels-hospitality", "corporate-offices"],
  "it-infrastructure": ["corporate-offices", "hotels-hospitality", "hospitals-healthcare", "education", "retail-commercial", "manufacturing"],
  "hospitality-mattress": ["hotels-hospitality"],
  "hospitality-linen": ["hotels-hospitality", "hospitals-healthcare"],
  "hotel-hospital-amenities": ["hotels-hospitality", "hospitals-healthcare"],
  "in-room-amenities": ["hotels-hospitality"],
  "bathroom-housekeeping-amenities": ["hotels-hospitality", "hospitals-healthcare", "corporate-offices"],
  "lobby-banquet-restaurant-amenities": ["hotels-hospitality", "retail-commercial"],
  "dishwashing-solutions": ["hotels-hospitality", "hospitals-healthcare", "manufacturing", "education", "retail-commercial"],
  "laundry-solutions": ["hotels-hospitality", "hospitals-healthcare", "manufacturing", "education"],
  "refrigeration-solutions": ["retail-commercial", "hotels-hospitality", "hospitals-healthcare"],
  "commercial-cooling-hvac": ["hotels-hospitality", "hospitals-healthcare", "education", "retail-commercial"],
};
const sectionIndustries: Record<string, IndustrySlug[]> = {
  "refrigeration-solutions/Health Care Range": ["hospitals-healthcare"],
  "refrigeration-solutions/Hospitality Range": ["hotels-hospitality", "retail-commercial"],
  "interactive-displays/Monitor Display Solutions": ["hotels-hospitality", "hospitals-healthcare", "corporate-offices"],
  "lobby-banquet-restaurant-amenities/Restaurant Amenities": ["retail-commercial", "hotels-hospitality"],
};

const CONTAIN = new Set(["hotel-hospital-amenities", "in-room-amenities", "bathroom-housekeeping-amenities", "lobby-banquet-restaurant-amenities", "refrigeration-solutions", "it-infrastructure"]);

/* --------------------------------------------------------- categories */
type CatDef = Omit<Category, "ranges" | "image"> & { ranges: string[]; image: string | null; extra?: Range[] };

const catDefs: CatDef[] = [
  {
    slug: "samsung-consumer-electronics",
    name: "Samsung Consumer Electronics & Home Appliances",
    short: "Samsung TVs, refrigerators, washing machines, ACs, microwave ovens and mobiles, direct from the distributor.",
    intro:
      "Palaniappa Electronics is the Samsung consumer electronics and durables distributor for Chennai and its suburbs, covering Chennai, Kanchipuram, Chengalpattu and Thiruvallur districts, and supplies more than 500 retail outlets. Retailers, institutions and home buyers can source Samsung products from us at distributor pricing.",
    seoTitle: "Samsung Distributor in Chennai — TVs, Refrigerators, Washing Machines, ACs",
    seoDescription:
      "Samsung consumer electronics and appliances distributor for Chennai, Kanchipuram, Chengalpattu and Thiruvallur, supplying 500+ retail outlets. Enquire for TVs, refrigerators, washers, ACs, ovens and mobiles.",
    image: "/images/site/warehouse-chromepet.webp",
    ranges: [],
    questions: [
      ["Do you sell to retailers?", "Yes. Samsung retailers in Chennai, Kanchipuram, Chengalpattu and Thiruvallur are supplied from our Chromepet warehouse. Contact the enquiry line to become a partner outlet."],
      ["Can I buy Samsung products for my home?", "Yes. Call or WhatsApp +91 89399 99705 with the product or model you need and we will share price and availability."],
      ["Do you supply Samsung for institutions?", "Yes. Hotels, hospitals, schools and offices can combine Samsung consumer products with commercial displays and hospitality TVs in one order."],
    ],
  },
  {
    slug: "displays-signage-led",
    name: "Visual Display, Signage & LED Walls",
    short: "Digital signage, kiosks, indoor and outdoor LED walls, video walls and creative LED formats.",
    intro:
      "Commercial displays rated for long operating hours: menu boards and lobby screens, A-type, T-type, K-type and self-ordering kiosks, content-management software, indoor, outdoor and home-cinema LED, and specialist formats such as transparent, curtain, flexible and floor LED.",
    seoTitle: "Digital Signage, Kiosks & LED Walls in Chennai — Samsung, Sony, ASPA LED",
    seoDescription:
      "Commercial signage displays, kiosks, indoor and outdoor LED walls, video walls, transparent and curtain LED from Samsung, Sony, Vzy, Yara and ASPA LED, supplied across Tamil Nadu.",
    image: "/images/led-wall-solutions/corporate-boardroom-led-wall.webp",
    ranges: ["digital-signage-kiosks", "led-wall-solutions", "unique-display-solutions", "unique-led-displays"],
    questions: [
      ["What do you need to quote an LED wall?", "The wall size or viewing distance, indoor or outdoor use, the site location and whether you need content software. We recommend the pixel pitch from that."],
      ["Do signage displays come with content software?", "Yes. Zeetaminds content-management software lets you schedule content, split screens into zones and design with Canva integration."],
    ],
  },
  {
    slug: "interactive-displays-collaboration",
    name: "Interactive Displays & Collaboration",
    short: "Interactive touch panels, hybrid VC displays, projectors, writing pads, laptops, tablets and monitors.",
    intro:
      "Smart classrooms and hybrid meeting rooms, and the devices people carry. We are an authorised distributor for Newline interactive displays and supply Samsung, Teachmint and Raptor panels, enterprise mobiles, rugged devices, laptops and monitors in volume.",
    seoTitle: "Interactive Displays & Smart Boards for Schools and Offices in Chennai",
    seoDescription:
      "Interactive touch displays and hybrid video-conferencing panels from Samsung, Newline, Teachmint and Raptor, plus projectors, writing pads, laptops, tablets and monitors for institutions.",
    image: "/images/interactive-displays/classroom-interactive-panel.webp",
    ranges: ["interactive-displays"],
    extra: [
      {
        slug: "projectors-writing-pads",
        name: "Projectors & Digital Writing Pads",
        intro: "Projectors and digital writing pads for classrooms and training rooms are listed on our website. Ask the B2B team for current models and specifications.",
        applications: ["Schools", "Colleges", "Training rooms"],
        image: null,
        source: "website",
        sections: [
          { title: "Projectors", brands: [], products: [], note: "Current models shared on request." },
          { title: "Digital Writing Pads", brands: [], products: [], note: "Current models shared on request." },
        ],
      },
    ],
    questions: [
      ["Which interactive display sizes are available?", "Sizes depend on the brand and model. Share the room size and seating and we will recommend the right size and mounting."],
      ["Are you an authorised Newline distributor?", "Yes. Our website lists Palaniappa Electronics as an authorised distributor for Newline interactive displays."],
    ],
  },
  {
    slug: "hospitality-in-room-solutions",
    name: "Hospitality & In-Room Solutions",
    short: "Hospitality TVs, boot-up branding, guest-TV software, hotel set-top boxes, King Koil mattresses and linen.",
    intro:
      "Everything that makes a guest or patient room: hospitality TVs with hotel-branded boot-up screens, Hepi and LYNK Cloud TV management software, Dish TV hotel set-top boxes, King Koil hospitality mattresses, bed bases and rollaways, and bed, bath and curtain linen.",
    seoTitle: "Hospitality TV, Hotel Set-top Boxes, Mattresses & Linen in Chennai",
    seoDescription:
      "Samsung hospitality TVs with boot-up logo, Hepi and LYNK Cloud guest-TV software, Dish TV hotel set-top boxes, King Koil hospitality mattresses and hotel linen for hotels and hospitals.",
    image: "/images/hospitality-tv/hotel-guest-room-tv.webp",
    ranges: ["hospitality-tv", "hospitality-mattress", "hospitality-linen"],
    questions: [
      ["What is a boot-up logo solution?", "When the TV is switched on, the hotel logo and video play first; only after that can the guest watch channels."],
      ["Do you install set-top boxes for hotels?", "Yes. Dish TV hotel set-top boxes come with free MDU backbone installation and free vertical wiring, one remote for TV and set-top box, and customised hotel packs."],
    ],
  },
  {
    slug: "hotel-hospital-amenities",
    name: "Hotel & Hospital Amenities",
    short: "RFID locks, minibars, safes, in-room appliances and accessories, bathroom, housekeeping, lobby and banquet equipment.",
    intro:
      "Room, bathroom, housekeeping, lobby, banquet and restaurant equipment in one place — from Hafele and Ozone door locks and JVD, Walhter and imported ranges to banquet furniture, crockery, cutlery and glassware.",
    seoTitle: "Hotel Amenities Supplier in Chennai — Door Locks, Minibars, Housekeeping",
    seoDescription:
      "Hotel and hospital amenities: RFID door locks, energy savers, minibars, in-room safes, kettles, hair dryers, bathroom accessories, housekeeping trolleys, lobby trolleys, banquet furniture and F&B service ware.",
    image: "/images/hotel-hospital-amenities/hotel-rfid-card-locks.webp",
    ranges: ["hotel-hospital-amenities", "in-room-amenities", "bathroom-housekeeping-amenities", "lobby-banquet-restaurant-amenities"],
    questions: [
      ["Can you supply amenities for a full property?", "Yes. Send the room count and the list of rooms, bathrooms and public areas, and we will prepare one consolidated quotation."],
    ],
  },
  {
    slug: "commercial-air-conditioning",
    name: "Commercial Air Conditioning",
    short: "Cassette, tower, ductable and split ACs and VRV / VRF systems from Mitsubishi Electric, Samsung, Voltas and Haier.",
    intro:
      "Air-conditioning chosen for the space: 360° and four-way cassettes for restaurants and showrooms, one-way cassettes for rooms, tower ACs for halls, ductable units for lobbies, high-wall splits, and VRV / VRF systems that run many indoor units from one outdoor unit.",
    seoTitle: "Commercial AC & VRV / VRF Systems in Chennai — Mitsubishi, Samsung, Voltas, Haier",
    seoDescription:
      "Commercial air-conditioning for hotels, hospitals, schools, showrooms, villas, restaurants and marriage halls: cassette, tower, ductable, split and VRV / VRF systems.",
    image: "/images/commercial-cooling-hvac/360-degree-cassette-ac.webp",
    ranges: ["commercial-cooling-hvac"],
    questions: [["What do you need to size an AC system?", "A floor plan or room dimensions, ceiling type, occupancy and usage hours. For VRV / VRF we also need the number of indoor units and the outdoor-unit location."]],
  },
  {
    slug: "commercial-refrigeration",
    name: "Commercial Cooling & Refrigeration",
    short: "Commercial, hospitality and healthcare refrigeration from Western, Hoshizaki, Haier and Godrej.",
    intro:
      "Cold chain for retail, kitchens and healthcare — back-bar coolers, wine chillers, visi coolers and freezers, chest freezers, confectionery showcases, upright and under-counter chillers, ice machines, and ILR, pharmaceutical, vaccine and blood-bank refrigerators.",
    seoTitle: "Commercial Refrigeration in Chennai — Visi Coolers, Ice Machines, Medical Refrigerators",
    seoDescription:
      "Western, Hoshizaki, Haier and Godrej commercial refrigeration: visi coolers, chest freezers, wine chillers, ice machines, under-counter chillers, ILR, pharmaceutical, vaccine and blood-bank refrigerators.",
    image: "/images/refrigeration-solutions/visi-cooler.webp",
    ranges: ["refrigeration-solutions"],
    questions: [["Do you supply healthcare refrigeration?", "Yes. The healthcare range covers ice-lined refrigerators, pharmaceutical refrigerators, vaccine freezers (-20°C / -40°C / -60°C) and blood-bank refrigerators."]],
  },
  {
    slug: "laundry-dishwashing",
    name: "Industrial Laundry & Dishwashing",
    short: "IFB washer extractors, dryers, flatwork ironers and sheet folders, LG laundromats and IFB commercial dishwashers.",
    intro:
      "We are an authorised distributor for IFB industrial laundry and dishwashers. On-premise laundry plants — washer extractors, tumble dryers, flatwork ironers, automatic sheet folders and vacuum ironing tables — and rack-conveyor, hood-type and under-counter dishwashers.",
    seoTitle: "Industrial Laundry Equipment & Commercial Dishwashers in Chennai — IFB",
    seoDescription:
      "Authorised IFB distributor: washer extractors, tumble dryers, flatwork ironers, sheet folders, vacuum ironing tables, LG laundromats and IFB rack-conveyor, hood-type and under-counter dishwashers.",
    image: "/images/laundry-solutions/washer-extractor.webp",
    ranges: ["laundry-solutions", "dishwashing-solutions"],
    questions: [
      ["How do you size a laundry plant?", "From the daily linen load in kilograms, the number of shifts and available space and utilities. Share these and we will propose machine capacities."],
      ["Which dishwasher suits my kitchen?", "Under-counter units suit bars and small kitchens, hood-type suits restaurants and hotel kitchens, and rack-conveyor suits canteens and large hotels."],
    ],
  },
  {
    slug: "it-infrastructure",
    name: "IT Infrastructure",
    short: "Networking, EPABX, firewalls, CCTV, AV and servers — planned, commissioned and handed over.",
    intro:
      "Exclusive Hospitality & Healthcare Partner of Ingram Micro (TechVantage Solutions), covering 500+ brands available in India. We deliver networking, communications, security and AV projects end to end: planning, commissioning and handover.",
    seoTitle: "IT Infrastructure for Hotels & Hospitals in Chennai — Networking, CCTV, AV",
    seoDescription:
      "Structured cabling, LAN/WAN, Wi-Fi, IP PBX, firewalls, CCTV, access control, AV and servers for hotels, hospitals, offices and campuses. Exclusive hospitality & healthcare partner of Ingram Micro.",
    image: "/images/it-infrastructure/switches-routers-and-network-security.webp",
    ranges: ["it-infrastructure"],
    questions: [["Do you handle installation?", "Yes. IT projects are executed end to end — planning, commissioning and handover."]],
  },
  {
    slug: "industrial-automation",
    name: "Industrial Automation & Mobile Robots",
    short: "Hikrobot heavy-duty mobile robots for material handling in factories and warehouses.",
    intro:
      "Our website lists Hikrobot's heavy-duty mobile robot for moving heavy loads in factories and warehouses. Contact the B2B team for models, payloads and site assessment.",
    seoTitle: "Hikrobot Heavy-Duty Mobile Robots in Chennai — Industrial Automation",
    seoDescription:
      "Hikrobot heavy-duty mobile robots (HMR) for factory and warehouse material handling, supplied by Palaniappa Electronics, Chennai. Request models and a site assessment.",
    image: null,
    ranges: [],
    questions: [["What information do you need for a mobile-robot enquiry?", "The load weight and size, the route and floor conditions, the number of moves per hour and the site location."]],
  },
];

/* ----------------------------------------------------------- build */
const SKIP_BRANDS = new Set(["Imported"]);
let order = 0;

function makeProduct(it: RawItem, rc: RawCat, sec: RawSection, category: string): Product {
  const brands = (sec.brands || []).filter((b) => !SKIP_BRANDS.has(b));
  const apps = sec.applications || rc.applications || [];
  const desc =
    it.desc ||
    sec.desc ||
    `${it.name} from our ${sec.title.toLowerCase()} range${brands.length ? `, available from ${listJoin(brands)}` : ""}${(sec.brands || []).includes("Imported") ? " and imported ranges" : ""}. Supplied for ${listJoin(apps.slice(0, 5)).toLowerCase()}.`;
  return {
    slug: it.slug,
    name: it.name,
    category,
    range: rc.slug,
    rangeName: rc.name,
    section: sec.title,
    brands,
    imported: (sec.brands || []).includes("Imported"),
    industries: sectionIndustries[`${rc.slug}/${sec.title}`] || rangeIndustries[rc.slug] || [],
    applications: apps,
    description: desc,
    image: { src: it.img, w: it.w, h: it.h, contain: CONTAIN.has(rc.slug) },
    hasPage: true,
    source: "catalogue",
    order: order++,
  };
}

export function listJoin(a: string[]) {
  if (a.length <= 1) return a.join("");
  return a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
}

const rawBySlug = new Map(data.categories.map((c) => [c.slug, c]));

export const categories: Category[] = catDefs.map((d) => {
  const ranges: Range[] = d.ranges.map((rs) => {
    const rc = rawBySlug.get(rs)!;
    return {
      slug: rc.slug,
      name: rc.name,
      intro: rc.intro,
      applications: rc.applications,
      image: { src: rc.hero, w: 1200, h: 800, contain: CONTAIN.has(rc.slug) },
      source: "catalogue",
      sections: rc.sections.map((s) => ({
        title: s.title,
        description: s.desc,
        applications: s.applications,
        brands: (s.brands || []).filter((b) => !SKIP_BRANDS.has(b)),
        features: s.features,
        points: s.points,
        products: s.items.map((it) => makeProduct(it, rc, s, d.slug)),
      })),
    };
  });
  const { extra, image, ...rest } = d;
  return { ...rest, image: image ? { src: image, w: 1200, h: 800, contain: CONTAIN.has(d.ranges[0] || "") } : null, ranges: [...ranges, ...(extra || [])] };
});

// Samsung consumer product lines [CAT p.2 + MSG] and the Hikrobot HMR [WEB].
const samsungLines: [string, string][] = [
  ["Samsung Televisions", "Samsung TVs for homes, retailers and institutions."],
  ["Samsung Refrigerators", "Samsung refrigerators for homes, retailers and institutions."],
  ["Samsung Washing Machines", "Samsung washing machines for homes, retailers and hostels."],
  ["Samsung Air Conditioners", "Samsung room air-conditioners for homes and offices."],
  ["Samsung Microwave Ovens", "Samsung microwave ovens for homes, pantries and offices."],
  ["Samsung Mobiles", "Samsung Galaxy mobiles for individuals and enterprise deployments."],
];
const samsungCat = categories.find((c) => c.slug === "samsung-consumer-electronics")!;
samsungCat.ranges.push({
  slug: "samsung-range",
  name: "Samsung consumer range",
  intro: "Samsung TVs, fridges, washers, ACs and ovens supplied to 500+ retail outlets across Chennai, Kanchipuram, Chengalpattu and Thiruvallur.",
  applications: ["Retailers", "Homes", "Institutions"],
  image: null,
  source: "catalogue",
  sections: [
    {
      title: "Product lines",
      brands: ["Samsung"],
      products: samsungLines.map(([name, description]) => ({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        category: samsungCat.slug,
        range: "samsung-range",
        rangeName: "Samsung consumer range",
        section: "Product lines",
        brands: ["Samsung"],
        imported: false,
        industries: ["retail-commercial"],
        applications: ["Retailers", "Homes", "Institutions"],
        description,
        image: null,
        hasPage: false,
        source: name === "Samsung Mobiles" ? "message" : "catalogue",
        order: order++,
      })),
    },
  ],
});
const autoCat = categories.find((c) => c.slug === "industrial-automation")!;
autoCat.ranges.push({
  slug: "mobile-robots",
  name: "Mobile robots",
  intro: autoCat.intro,
  applications: ["Factories", "Warehouses"],
  image: null,
  source: "website",
  sections: [
    {
      title: "Mobile robots",
      brands: ["Hikrobot"],
      products: [
        {
          slug: "heavy-duty-mobile-robot", // preserves the existing URL /products/heavy-duty-mobile-robot
          name: "Heavy Duty Mobile Robot",
          category: autoCat.slug,
          range: "mobile-robots",
          rangeName: "Mobile robots",
          section: "Mobile robots",
          brands: ["Hikrobot"],
          imported: false,
          industries: ["manufacturing"],
          applications: ["Factories", "Warehouses"],
          description: "Hikrobot heavy-duty mobile robot (HMR) for moving heavy loads in factories and warehouses. Models, payloads and navigation options are confirmed after a site assessment.",
          image: null,
          hasPage: true,
          source: "website",
          order: order++,
        },
      ],
    },
  ],
});

export const products: Product[] = categories.flatMap((c) => c.ranges.flatMap((r) => r.sections.flatMap((s) => s.products)));
export const productPages = products.filter((p) => p.hasPage);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
export const categoryProducts = (slug: string) => products.filter((p) => p.category === slug);
export const categoryCount = (slug: string) => categoryProducts(slug).length;

export function relatedProducts(p: Product, n = 4) {
  const same = products.filter((x) => x.slug !== p.slug && x.hasPage && x.range === p.range && x.section === p.section);
  const range = products.filter((x) => x.slug !== p.slug && x.hasPage && x.range === p.range && x.section !== p.section);
  const cat = products.filter((x) => x.slug !== p.slug && x.hasPage && x.category === p.category && x.range !== p.range);
  return [...same, ...range, ...cat].slice(0, n);
}

/* --------------------------------------------------------------- brands */
export type BrandRelation = "authorised" | "partner" | "supplied";
export type Brand = { name: string; slug: string; logo: Img | null; group: string; relation: BrandRelation; note?: string; source: Source };

const brandMeta: Record<string, { group: string; relation?: BrandRelation; note?: string; source?: Source }> = {
  Samsung: { group: "Displays & consumer electronics", relation: "authorised", note: "Consumer electronics & appliances distributor for Chennai & suburbs; authorised distributor for commercial TV & displays." },
  Newline: { group: "Displays & consumer electronics", relation: "authorised", note: "Authorised distributor for interactive displays.", source: "website" },
  Sony: { group: "Displays & consumer electronics" },
  LG: { group: "Displays & consumer electronics" },
  "Vzy by Dish TV": { group: "Displays & consumer electronics" },
  "Yara Electronics": { group: "Displays & consumer electronics" },
  "ASPA LED": { group: "Displays & consumer electronics" },
  Teachmint: { group: "Displays & consumer electronics" },
  Raptor: { group: "Displays & consumer electronics" },
  Hepi: { group: "Hospitality technology" },
  "LYNK Cloud": { group: "Hospitality technology" },
  "Dish TV d2h": { group: "Hospitality technology" },
  Zeetaminds: { group: "Hospitality technology" },
  "King Koil": { group: "Hospitality furnishing & amenities" },
  Hafele: { group: "Hospitality furnishing & amenities" },
  Ozone: { group: "Hospitality furnishing & amenities" },
  JVD: { group: "Hospitality furnishing & amenities" },
  Walhter: { group: "Hospitality furnishing & amenities" },
  Dyson: { group: "Hospitality furnishing & amenities" },
  Racold: { group: "Hospitality furnishing & amenities" },
  "TVS Green": { group: "Hospitality furnishing & amenities" },
  IFB: { group: "Laundry, kitchen & cooling", relation: "authorised", note: "Authorised distributor for industrial laundry & dishwashers." },
  "Mitsubishi Electric": { group: "Laundry, kitchen & cooling" },
  Voltas: { group: "Laundry, kitchen & cooling" },
  Haier: { group: "Laundry, kitchen & cooling" },
  Bluestar: { group: "Laundry, kitchen & cooling" },
  Western: { group: "Laundry, kitchen & cooling" },
  Hoshizaki: { group: "Laundry, kitchen & cooling" },
  Godrej: { group: "Laundry, kitchen & cooling" },
  "Ingram Micro": { group: "IT, computing & automation", relation: "partner", note: "Exclusive hospitality & healthcare partner (TechVantage Solutions), covering 500+ brands." },
  Lenovo: { group: "IT, computing & automation" },
  Acer: { group: "IT, computing & automation" },
  Hikrobot: { group: "IT, computing & automation", source: "website" },
};

export const brandGroups = ["Displays & consumer electronics", "Hospitality technology", "Hospitality furnishing & amenities", "Laundry, kitchen & cooling", "IT, computing & automation"];

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const brands: Brand[] = Object.entries(brandMeta).map(([name, m]) => {
  const l = data.brands[name];
  return {
    name,
    slug: slugify(name),
    logo: l ? { src: l.logo, w: l.w, h: l.h } : null,
    group: m.group,
    relation: m.relation || "supplied",
    note: m.note,
    source: m.source || "catalogue",
  };
});
export const getBrand = (name: string) => brands.find((b) => b.name === name);
export const brandProductCount = (name: string) => products.filter((p) => p.brands.includes(name)).length;

/* ------------------------------------------------------------ customers */
export const customers = data.customers;

/* ----------------------------------------------------- client payload */
export type ProductLite = Pick<Product, "slug" | "name" | "category" | "rangeName" | "section" | "brands" | "industries" | "image" | "hasPage" | "order"> & { categoryName: string; keywords: string };
export const toLite = (p: Product): ProductLite => {
  const c = getCategory(p.category)!;
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryName: c.name,
    rangeName: p.rangeName,
    section: p.section,
    brands: p.brands,
    industries: p.industries,
    image: p.image,
    hasPage: p.hasPage,
    order: p.order,
    keywords: [p.name, p.section, p.rangeName, c.name, ...p.brands, ...p.applications, p.description].join(" ").toLowerCase(),
  };
};

export const productHref = (p: { slug: string; hasPage: boolean; category: string }) => (p.hasPage ? `/products/${p.slug}` : `/solutions/${p.category}`);
