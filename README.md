# Palaniappa Electronics — website & online B2B catalogue

This is a fast, SEO-ready static website for **Palaniappa Electronics, Chennai**. It is a Samsung distributor and B2B supplier of commercial products. The site replaces the PDF catalogue with a searchable online catalogue: 17 solution ranges and 228 products, each with an "Add to enquiry" button that sends the quote request on WhatsApp or by e-mail.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTheGraphicKing%2FPalaniappa-electronics&project-name=palaniappa-electronics)

You can also import the repo in Vercel. `vercel.json` already sets everything up: the build command is `node build.mjs`, the output folder is `dist`, and clean URLs are on. There are no npm dependencies.

Optional environment variable:
- `SITE_URL`: the canonical domain, e.g. `https://www.palaniappaelectronics.in`. If you don't set it, the site uses the Vercel production URL.

## Local development

```bash
node build.mjs --serve   # http://localhost:4173
```

## How it's organised

| Path | What it is |
|---|---|
| `src/data/site.mjs` | Business facts: phones, address, stats, FAQs, industries, Samsung range |
| `src/data/catalog.json` | Every category, section, brand, product and image, generated from the PDF |
| `tools/extract.py` | Regenerates `catalog.json` and crops all product photos and logos from the catalogue PDF |
| `build.mjs` | Zero-dependency generator for the HTML pages, JSON-LD, sitemap.xml and robots.txt |
| `src/css/styles.css` | Design system (the "Palaniappa Teal" palette, taken from the logo) |
| `src/js/main.js` | Lenis smooth scroll, GSAP scroll animations, 3D tilt, enquiry list, catalogue search, lightbox |
| `src/js/hero3d.js` | Three.js particle vortex in the hero, based on the catalogue cover art and lazy-loaded |

### Updating the catalogue
1. `pdftoppm -r 250 -png catalogue.pdf /tmp/pages/p`
2. Edit the product lists and crop boxes in `tools/extract.py`
3. `python3 tools/extract.py /tmp/pages && node build.mjs`

## SEO
- One static HTML page per solution range, with a unique title and meta description, a canonical URL, Open Graph and Twitter tags
- JSON-LD on every page: Organization/Store with address and contact points, WebSite with SearchAction, FAQPage, BreadcrumbList, CollectionPage and ItemList
- `sitemap.xml` (it includes an image sitemap) and `robots.txt`
- Semantic HTML, alt text on every image, explicit image sizes (no layout shift), self-hosted fonts, WebP images and lazy loading
