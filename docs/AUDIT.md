# Palaniappa Electronics — content audit & inventory (Nov 2026)

## Sources
| Code | Source | Access |
|---|---|---|
| CAT | *Palaniappa Electronics B2B Catalogue 2026* (20-page PDF supplied by the client) | Full |
| WEB | Current website palaniappaelectronics.in | **Not directly reachable from the build environment** (network policy). Content was taken from search-engine snapshots of its pages: Home, About Us, Contact, Privacy Policy, Terms & Conditions, `/products/heavy-duty-mobile-robot`. |
| MSG | Introduction message from Muthu (Palaniappa Electronics) | Full |

> Action for the client: once the old site can be crawled, run a full crawl and compare it against the "Existing URLs" table below. Add any product pages it has that this inventory is missing.

## Existing URLs → new destinations
| Existing URL (WEB) | New URL | How |
|---|---|---|
| `/` , `/public/` | `/` | 308 redirect for `/public` |
| `/about-us/` | `/about` | 308 |
| `/contact` | `/contact` | kept |
| `/public/privacy-policy` | `/privacy-policy` | 308 |
| `/public/terms-conditions` | `/terms-conditions` | 308 |
| `/products/heavy-duty-mobile-robot` | `/products/heavy-duty-mobile-robot` | kept (same slug) |
| `/contact-us` | `/contact` | 308 (defensive) |
| Earlier static build: `/catalogue`, `/samsung`, `/solutions/<17 old slugs>` | `/products`, `/solutions/samsung-consumer-electronics`, new family pages + anchors | 308 (see `next.config.ts`) |

## Content inventory
| Content | Source | Destination |
|---|---|---|
| 228 products in 17 catalogue chapters (names, photos, brands, applications, descriptions) | CAT p.3–19 | `data/catalog.json` → 10 families at `/solutions/*`, 229 product pages at `/products/*`, `/products` catalogue |
| Samsung consumer lines (TV, fridge, washer, AC, oven) | CAT p.2 | `/solutions/samsung-consumer-electronics` (lines, no product pages because there is no model data) |
| Samsung mobiles | MSG | same page |
| Projectors, digital writing pads | WEB home categories | listed in *Interactive Displays & Collaboration* as "models on request" (no product data available) |
| Hikrobot heavy-duty mobile robot | WEB product page | `/products/heavy-duty-mobile-robot` (no photo or specs captured, so a labelled placeholder is shown) |
| Brand logos (23) | CAT | `/public/images/brands`, `/brands` |
| Brands without logos: Newline, Hikrobot, Hafele, Ozone, JVD, Walhter, Bluestar, Dyson, Racold, TVS Green | CAT/WEB | `/brands`, shown as text |
| Customer logos: 18 hotels, 13 hospitals, 11 education | CAT p.20 | home, `/about`, industry pages |
| Company logo | CAT p.1 (600 dpi crop) | `/public/images/brand/` |
| Warehouse and team photos | CAT p.2 | home, about |
| Stats: since 2004, ₹150 Cr+, 20,000 sq ft, 50+ staff, 25+ brands, 500+ outlets | CAT p.1–2 | home, about |
| Authorisations: Samsung CE (Chennai & suburbs), Samsung Commercial TV & Displays, Newline, IFB | WEB About | home, brands, about |
| Ingram Micro exclusive hospitality & healthcare partnership | CAT p.9 | IT family, brands, about |
| Addresses (admin office & warehouse; registered office), phones, landlines, emails | CAT p.20, WEB | `lib/site.ts` → footer, contact, JSON-LD |
| PDF catalogue | CAT | `/downloads/palaniappa-electronics-b2b-catalogue-2026.pdf` |

## Discrepancies to confirm with the client
1. **Turnover:** CAT says ₹150 Cr+. WEB quotes ₹105 Cr for FY 2018–19. The site shows ₹150 Cr+ and notes the older figure on /about.
2. **Samsung territory:** WEB says "exclusive distributors … for Chennai & Suburbs". CAT names Chennai, Kanchipuram, Chengalpattu and Thiruvallur districts. MSG says "exclusive distributors of Samsung products in Chennai". The site does **not** use the word "exclusive"; it shows the district list.
3. **Street name:** CAT says "Abdul Kalam St"; WEB says "Abdul Karam Street". The site uses Kalam.
4. **Phone numbers:** WEB lists landlines (044 2248 1188 / 2248 1267 / 2954 6667) and other 89399 mobiles. The site uses the CAT mobiles plus the landlines. Some third-party directories list different numbers (not used).
5. **Legal pages:** WEB terms reference `palaniappaelectronics.com`. The new privacy policy and terms were rewritten for this site and should be reviewed by the client.
6. **Industrial automation / machine vision:** only the Hikrobot heavy-duty mobile robot is evidenced. No machine-vision products were found, so no machine-vision category was created.
7. **Careers:** no openings are evidenced. The page invites CVs and does not list vacancies.
8. **Product specifications:** neither source has model-level specifications, so product pages say specifications are shared with the quotation rather than inventing them.
9. **Brand authorisation:** apart from the authorisations above, brand relationships are labelled "Supplied".
