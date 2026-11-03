# Palaniappa Electronics — website & B2B catalogue

This is the production website for Palaniappa Electronics, Chennai. It is built with **Next.js 15 (App Router), TypeScript and Tailwind CSS**, and every page is statically generated. A single server route handles enquiries.

- **Catalogue:** 10 product families, 235 products and lines, and 229 product detail pages (`/products/[slug]`)
- **Requirement basket:** add products, set quantities, add per-item notes, then submit one RFQ and get a confirmation with a reference
- **Discovery:** search, filters (category, industry, brand), sorting and URL-synced state; 6 industry landing pages; a brand directory that labels each relationship
- **SEO:** unique metadata and canonical URLs; JSON-LD for Organization, WebSite+SearchAction, LocalBusiness, BreadcrumbList, CollectionPage, Product (no fabricated offers) and FAQPage; sitemap with images; robots; 308 redirects for legacy URLs

See [`docs/AUDIT.md`](docs/AUDIT.md) for the content inventory, URL map and open discrepancies.

## Design
"Ink & Brass": a dark showroom theme with deep blue-black surfaces, a brass accent for actions and emphasis, and the logo teal as a secondary colour. Headings use Inter Tight, with Instrument Serif italic for emphasis and Inter for body text. The site has **dark (default) and light themes**. Visitors switch with the sun/moon button in the header, and the choice is saved in their browser. Every colour is a CSS variable defined twice in `app/globals.css` (`:root` for dark, `[data-theme="light"]` for light), and `tailwind.config.ts` maps the Tailwind colour names to those variables. Wrap any element in `.force-dark` to keep it dark in both themes (used for text over photos). Tokens are in `tailwind.config.ts`; the reversed logo is `public/images/brand/palaniappa-logo-reversed.png`; product cut-outs used in the hero are in `public/images/cutouts/`.

## Deployment
`vercel.json` pins the Vercel build to Next.js (`npm install` → `npm run build` → `.next`). This overrides project settings left over from the first static version of the site (framework "Other", output folder `dist`).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Enquiry delivery (required for online RFQs)
`POST /api/enquiry` validates the request on the server and delivers it through whichever channels are configured. Set these in **Vercel → Project → Settings → Environment Variables** (see `.env.example`):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` | Email every enquiry through [Resend](https://resend.com) (verify the sending domain first) |
| `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET` | POST each enquiry as JSON to a CRM, Zapier, Make or a Google Apps Script |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain (defaults to the Vercel production URL, then palaniappaelectronics.in) |

If no channel is configured, the API returns 503. The form then tells the visitor plainly that the enquiry **was not sent**, and offers the same pre-filled enquiry on WhatsApp or by email. It never shows a false success message. `GET /api/enquiry` reports `{ configured: true|false }`.

## Updating products
- Business facts: `lib/site.ts`
- Product families, industries and brand relationships: `lib/catalog.ts`
- Product records and images: `data/catalog.json` and `public/images/`, regenerated from the PDF with:
  ```bash
  pdftoppm -r 250 -png catalogue.pdf /tmp/pages/p
  python3 tools/extract.py /tmp/pages
  ```
The data model is plain typed JSON, so it can later move to a CMS or a product database without changing the page templates.
