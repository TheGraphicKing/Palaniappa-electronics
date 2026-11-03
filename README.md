# Palaniappa Electronics — website & B2B catalogue

This is the production website for Palaniappa Electronics, Chennai. It is built with **Next.js 15 (App Router), TypeScript and Tailwind CSS**, and every page is statically generated. A single server route handles enquiries.

- **Catalogue:** 10 product families, 235 products and lines, and 229 product detail pages (`/products/[slug]`)
- **Requirement basket:** add products, set quantities, add per-item notes, then submit one RFQ and get a confirmation with a reference
- **Discovery:** search, filters (category, industry, brand), sorting and URL-synced state; 6 industry landing pages; a brand directory that labels each relationship
- **SEO:** unique metadata and canonical URLs; JSON-LD for Organization, WebSite+SearchAction, LocalBusiness, BreadcrumbList, CollectionPage, Product (no fabricated offers) and FAQPage; sitemap with images; robots; 308 redirects for legacy URLs

See [`docs/AUDIT.md`](docs/AUDIT.md) for the content inventory, URL map and open discrepancies.

## Design
"Ink & Brass": a dark showroom theme with deep blue-black surfaces, a brass accent for actions and emphasis, and the logo teal as a secondary colour. Headings use Inter Tight, with Instrument Serif italic for emphasis and Inter for body text. The site is **light by default** and switches to **dark automatically when the visitor's device is in dark mode** (`prefers-color-scheme`). There are five accent palettes (Ink & Brass, Cobalt, Signal Teal, Ember, Emerald). Set `DEFAULT_PALETTE` in `lib/theme.ts` to choose one. To preview them on any deployment, add `?palettes` to the address; a small picker appears for you only (`docs/palette-options.jpg` compares them). Every colour is a CSS variable defined twice in `app/globals.css` (light values on `:root`, dark values under the `prefers-color-scheme: dark` media query, accent channels per `[data-palette]`), and `tailwind.config.ts` maps the Tailwind colour names to those variables. Wrap any element in `.force-dark` to keep it dark in both themes (used for text over photos). Tokens are in `tailwind.config.ts`; the reversed logo is `public/images/brand/palaniappa-logo-reversed.png`; product cut-outs used in the hero are in `public/images/cutouts/`.

## Deployment
`vercel.json` pins the Vercel build to Next.js (`npm install` → `npm run build` → `.next`). This overrides project settings left over from the first static version of the site (framework "Other", output folder `dist`).

## Landing-page features
- **Room Builder** (`components/room-builder.tsx`, presets in `lib/room-presets.ts`): pick a space and a quantity, get an instant product list built from the catalogue, then add everything to the requirement in one click.
- **⌘K / Ctrl+K quick search** (`components/command-palette.tsx`): searches every product, family and industry from anywhere. The index is the static `/search-index.json`.

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
