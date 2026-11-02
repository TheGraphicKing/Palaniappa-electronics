#!/usr/bin/env node
// Static site generator for palaniappaelectronics.in
//   node build.mjs           -> builds ./dist
//   node build.mjs --serve   -> builds and serves on http://localhost:4173 (clean URLs, like Vercel)
// Zero dependencies: only Node built-ins.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { site } from "./src/data/site.mjs";

const ARTIFACT = process.argv.includes("--artifact");
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, ARTIFACT ? "dist-artifact" : "dist");
const data = JSON.parse(fs.readFileSync(path.join(SRC, "data/catalog.json"), "utf8"));
const CATS = data.categories;
const BRANDS = data.brands;

const SITE_URL = (process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "") ||
  "https://www.palaniappaelectronics.in").replace(/\/$/, "");

// ---------------------------------------------------------------- helpers
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const url = (p) => SITE_URL + p;
const catUrl = (c) => "/solutions/" + c.slug;
const count = (c) => c.sections.reduce((n, s) => n + s.items.length, 0);
const TOTAL = CATS.reduce((n, c) => n + count(c), 0);
const GROUPS = [...new Set(CATS.map((c) => c.group))];
const allBrands = Object.keys(BRANDS);
const containCat = (slug) => ["hotel-hospital-amenities", "in-room-amenities", "bathroom-housekeeping-amenities", "lobby-banquet-restaurant-amenities", "refrigeration-solutions", "it-infrastructure"].includes(slug);
const P = site.phones;

let assetHash = "";
const asset = (p) => p + "?v=" + assetHash;

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowUR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.6-8.4z"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  ware: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V8l9-5 9 5v13"/><path d="M7 21v-8h10v8M7 17h10"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21a7 7 0 0 0-4.5-6.5"/></svg>',
  tv: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="40" height="26" rx="3"/><path d="M18 42h12M24 34v8"/></svg>',
  fridge: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="3"/><path d="M12 18h24M17 10v4M17 23v7"/></svg>',
  washer: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="8" y="4" width="32" height="40" rx="3"/><circle cx="24" cy="27" r="10"/><path d="M8 12h32M14 8h.01M19 8h.01"/></svg>',
  ac: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="10" width="40" height="16" rx="3"/><path d="M10 21h28M14 32c0 3-2 4-2 6M24 32c0 3-2 4-2 6M34 32c0 3-2 4-2 6"/></svg>',
  oven: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="10" width="40" height="28" rx="3"/><rect x="9" y="15" width="22" height="18" rx="2"/><path d="M37 16v.01M37 22v.01M37 28v.01"/></svg>',
  mobile: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="13" y="4" width="22" height="40" rx="4"/><path d="M21 38h6"/></svg>',
};

const LOGO = (id = "lg") => `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4F9DAC"/><stop offset="1" stop-color="#1D4556"/></linearGradient></defs><rect x="2" y="2" width="60" height="60" rx="13" fill="url(#${id})"/><path d="M22.6 21.4a15 15 0 1 0 18.8 0" fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/><path d="M32 13v18" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/></svg>`;

const img = (src, alt, w, h, cls = "", lazy = true, extra = "") =>
  `<img src="${esc(src)}" alt="${esc(alt)}" width="${w || 800}" height="${h || 600}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${cls ? ` class="${cls}"` : ""}${extra}>`;

const imgSize = (p) => {
  // read webp dimensions (VP8/VP8L/VP8X) so every <img> has width/height
  try {
    const b = fs.readFileSync(path.join(SRC, p.replace(/^\/assets\//, "assets/")));
    const f = b.toString("ascii", 12, 16);
    if (f === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (f === "VP8L") { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
    if (f === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  } catch (e) {}
  return [800, 600];
};
const pic = (src, alt, cls, lazy = true) => { const [w, h] = imgSize(src); return img(src, alt, w, h, cls, lazy); };

const brandChip = (b) => BRANDS[b]
  ? `<span class="bl" title="${esc(b)}">${img(BRANDS[b].logo, b + " logo", BRANDS[b].w, BRANDS[b].h)}</span>`
  : `<span class="bt">${esc(b)}</span>`;

const addBtn = (it, c) => `<button type="button" class="add-enq" data-id="${esc(c.slug + "/" + it.slug)}" data-name="${esc(it.name)}" data-cat="${esc(c.name)}" data-img="${esc(it.img)}" aria-pressed="false">${I.plus}<span class="l">Add to enquiry</span></button>`;

const productCard = (it, c, sec, opts = {}) => {
  const contain = containCat(c.slug);
  const search = [it.name, it.desc, sec.title, c.name, c.group, ...(sec.brands || []), ...(sec.applications || c.applications || [])].join(" ").toLowerCase();
  const searchAll = search + " " + search.replace(/[^a-z0-9]/g, "");
  return `<article class="pcard${opts.reveal === false ? "" : " reveal"}" id="${esc(it.slug)}" data-cat="${c.slug}" data-group="${esc(slugify(c.group))}" data-catname="${esc(c.name)}"${opts.href ? ` data-href="${catUrl(c)}#${esc(it.slug)}"` : ""}${opts.search ? ` data-search="${esc(searchAll)}"` : ""}>
  <button type="button" class="ph${contain ? " contain" : ""}" aria-label="Enlarge ${esc(it.name)}">${img(it.img, it.name + (sec.brands && sec.brands.length ? " — " + sec.brands.slice(0, 3).join(", ") : "") + " | Palaniappa Electronics", it.w, it.h)}</button>
  <div class="body">${opts.showCat ? `<span class="cat">${esc(sec.title)}</span>` : ""}<h3>${esc(it.name)}</h3>${it.desc ? `<p>${esc(it.desc)}</p>` : ""}${addBtn(it, c)}</div>
</article>`;
};
const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ---------------------------------------------------------------- layout
const navLinks = [
  ["/catalogue", "Catalogue"],
  ["/samsung", "Samsung"],
  ["/about", "About"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
];

function header(current, dark) {
  const mega = GROUPS.map((g) => `<div><h4>${esc(g)}</h4>${CATS.filter((c) => c.group === g).map((c) => `<a href="${catUrl(c)}">${esc(c.name)}</a>`).join("")}</div>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header${dark ? " header-dark" : ""}">
  <div class="wrap bar">
    <a href="/" class="brand" aria-label="Palaniappa Electronics — home">${LOGO("lgh")}<span>Palaniappa<small>Electronics · Since 2004</small></span></a>
    <nav class="nav" aria-label="Primary">
      <div class="has-mega"><button type="button" aria-expanded="false" aria-haspopup="true">Solutions ▾</button>
        <div class="mega">${mega}<div class="mega-cta"><span><b>${TOTAL}+ products</b> from 25+ brands, in one online catalogue.</span><a class="btn btn-sm" href="/solutions">All solutions ${I.arrow}</a></div></div>
      </div>
      ${navLinks.map(([h, l]) => `<a href="${h}"${current === h ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <div class="header-actions">
      <a class="btn btn-sm btn-ghost" href="tel:${P.b2b.tel}">${I.phone}<span>${P.b2b.display}</span></a>
      <button type="button" class="enq-btn" data-open-enquiry aria-label="Open enquiry list">${I.list}<span class="lbl">Enquiry</span><span class="enq-count">0</span></button>
      <button type="button" class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-menu" aria-label="Mobile">
  <a href="/solutions">Solutions</a>
  ${CATS.map((c) => `<a class="sub" href="${catUrl(c)}">${esc(c.name)}</a>`).join("")}
  ${navLinks.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}
  <a href="tel:${P.b2b.tel}">Call ${P.b2b.display}</a>
</nav>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a href="/" class="brand">${LOGO("lgf")}<span>Palaniappa<small>Electronics · Since 2004</small></span></a>
        <p>Authorised distributors &amp; partners for commercial products of 25+ brands in South India. Samsung consumer electronics distributor for Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur.</p>
      </div>
      <div><h3>Solutions</h3><ul>${CATS.slice(0, 9).map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join("")}</ul></div>
      <div><h3>&nbsp;</h3><ul>${CATS.slice(9).map((c) => `<li><a href="${catUrl(c)}">${esc(c.name)}</a></li>`).join("")}</ul></div>
      <div><h3>Admin office &amp; warehouse</h3>
        <address>${esc(site.address.full)}<br><br>
        <a href="tel:${P.b2b.tel}">${P.b2b.display}</a> · <a href="mailto:${P.b2b.mail}">${P.b2b.mail}</a><br>
        <a href="tel:${P.enquiry.tel}">${P.enquiry.display}</a> · <a href="mailto:${P.enquiry.mail}">${P.enquiry.mail}</a></address>
        <ul style="margin-top:18px"><li><a href="/catalogue">Online catalogue</a></li><li><a href="/samsung">Samsung distribution</a></li><li><a href="/about">About us</a></li><li><a href="/careers">Careers</a></li><li><a href="/contact">Contact &amp; directions</a></li></ul>
      </div>
    </div>
    <div class="huge-word" aria-hidden="true">Palaniappa</div>
    <div class="foot-bottom"><span>© <span id="year">2026</span> Palaniappa Electronics, Chennai. All rights reserved.</span><span>Brand names and logos belong to their respective owners.</span></div>
  </div>
</footer>
<div class="fab"><a class="wa" href="https://wa.me/${P.b2b.wa}?text=${encodeURIComponent("Hello Palaniappa Electronics, I have an enquiry.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.wa}</a><a class="call" href="tel:${P.b2b.tel}" aria-label="Call Palaniappa Electronics">${I.phone}</a></div>
${drawer()}
<div class="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Product preview">
  <div class="lb-card"><div class="lb-img"><img alt=""></div><div class="lb-body"><span class="eyebrow lb-cat"></span><h3></h3><p class="lb-desc"></p>
  <button type="button" class="add-enq" data-id="" data-name="" data-cat="" data-img="">${I.plus}<span class="l">Add to enquiry</span></button>
  <a class="link-arrow lb-link" href="#">View in category ${I.arrow}</a>
  <button type="button" class="btn btn-sm" data-open-enquiry style="margin-top:auto;align-self:flex-start">${I.list} View enquiry list</button></div></div>
  <button type="button" class="lb-close" aria-label="Close preview">${I.close}</button>
</div>
<div class="toast" role="status" aria-live="polite"><span class="msg"></span><button type="button">View list</button></div>`;
}

function enquiryForm({ withList = true, requireList = false, wa = P.b2b.wa, mail = P.b2b.mail, subject = "Quotation request — website", idp = "f", segmentDefault = "" } = {}) {
  const segs = site.segments.concat(["Home / personal", "Retailer / dealer", "Other"]);
  return `<form class="form" data-enq-form${withList ? " data-with-list" : ""}${requireList ? " data-require-list" : ""} data-wa="${wa}" data-mail="${mail}" data-subject="${esc(subject)}" novalidate>
  <div class="field"><label for="${idp}-name">Your name *</label><input id="${idp}-name" name="name" data-label="Name" required autocomplete="name"></div>
  <div class="field"><label for="${idp}-org">Company / institution</label><input id="${idp}-org" name="org" data-label="Company / institution" autocomplete="organization"></div>
  <div class="field"><label for="${idp}-phone">Phone *</label><input id="${idp}-phone" name="phone" data-label="Phone" type="tel" required autocomplete="tel" pattern="[0-9+ ()-]{8,}"></div>
  <div class="field"><label for="${idp}-email">E-mail</label><input id="${idp}-email" name="email" data-label="E-mail" type="email" autocomplete="email"></div>
  <div class="field"><label for="${idp}-city">City</label><input id="${idp}-city" name="city" data-label="City" autocomplete="address-level2"></div>
  <div class="field"><label for="${idp}-seg">Segment</label><select id="${idp}-seg" name="segment" data-label="Segment"><option value="">Select…</option>${segs.map((s) => `<option${s === segmentDefault ? " selected" : ""}>${esc(s)}</option>`).join("")}</select></div>
  <div class="field full"><label for="${idp}-msg">Requirement / message</label><textarea id="${idp}-msg" name="message" data-label="Message" placeholder="Quantities, project timeline, site location…"></textarea></div>
  <input type="text" name="_hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
  <div class="form-actions"><button class="btn btn-wa" type="submit" data-via="wa">${I.wa} Send on WhatsApp</button><button class="btn btn-ghost" type="submit" data-via="mail">${I.mail} Send by e-mail</button></div>
  <p class="form-note">Your enquiry opens in WhatsApp or your e-mail app, pre-filled — nothing is stored on this website.</p>
  <p class="form-status" role="status"></p>
</form>`;
}

function drawer() {
  return `<div class="drawer-bg" data-close-drawer></div>
<aside class="drawer" aria-hidden="true" aria-label="Enquiry list" role="dialog">
  <header><h2>Your enquiry list</h2><button type="button" class="x" data-close-drawer aria-label="Close">${I.close}</button></header>
  <div class="content">
    <div class="enq-empty">Your list is empty. Browse the <a href="/catalogue" style="color:var(--teal-700);font-weight:600">catalogue</a> and tap “Add to enquiry” on anything you need.</div>
    <ul class="enq-list" data-enq-list></ul>
    ${enquiryForm({ idp: "d" })}
  </div>
</aside>`;
}

function ctaBand(title = "Tell us what your property needs.", text = "Send a list, a floor plan or just a call — our B2B team will put together the right products and a quotation.") {
  return `<section class="section" style="padding-top:0"><div class="wrap"><div class="cta-band reveal">
  <div><span class="eyebrow">Raise an enquiry</span><h2>${title}</h2><p class="lead">${text}</p>
    <div class="hero-ctas" style="margin-top:22px"><button type="button" class="btn btn-amber" data-open-enquiry>${I.list} Open enquiry list</button><a class="btn btn-ghost" href="/catalogue">Browse catalogue ${I.arrow}</a></div></div>
  <div class="cta-actions">
    <a class="contact-line" href="tel:${P.b2b.tel}">${I.phone}<span><small>${P.b2b.label}</small>${P.b2b.display}</span></a>
    <a class="contact-line" href="https://wa.me/${P.b2b.wa}" target="_blank" rel="noopener">${I.wa}<span><small>WhatsApp</small>Chat with our B2B team</span></a>
    <a class="contact-line" href="mailto:${P.b2b.mail}">${I.mail}<span><small>E-mail</small>${P.b2b.mail}</span></a>
  </div></div></div></section>`;
}

const orgLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "Store"],
  "@id": SITE_URL + "/#org",
  name: site.name,
  url: SITE_URL + "/",
  logo: url("/assets/img/site/logo-lockup.webp"),
  image: url("/assets/img/site/warehouse-chromepet.webp"),
  description: "Authorised distributors & partners for commercial products of 25+ brands in South India — hospitality TVs, signage, LED walls, interactive displays, IT infrastructure, hotel mattresses, linen and amenities, laundry, dishwashing, refrigeration and HVAC. Samsung distributor for Chennai, Kanchipuram, Chengalpattu & Thiruvallur.",
  foundingDate: String(site.founded),
  telephone: P.b2b.tel,
  email: P.b2b.mail,
  priceRange: "₹₹",
  address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.locality + ", " + site.address.city, addressRegion: site.address.region, postalCode: site.address.postal, addressCountry: site.address.country },
  areaServed: ["Chennai", "Kanchipuram", "Chengalpattu", "Thiruvallur", "Tamil Nadu", "South India"],
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
  contactPoint: [
    { "@type": "ContactPoint", telephone: P.b2b.tel, email: P.b2b.mail, contactType: "sales", areaServed: "IN", availableLanguage: ["English", "Tamil"] },
    { "@type": "ContactPoint", telephone: P.enquiry.tel, email: P.enquiry.mail, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Tamil"] },
  ],
  brand: allBrands.map((b) => ({ "@type": "Brand", name: b })),
  hasMap: site.address.maps,
};

const crumbsLd = (items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: url(p) })),
});
const crumbsHtml = (items) => `<nav class="crumbs fade-in" aria-label="Breadcrumb"><ol>${items.map(([n, p], i) => `<li>${i < items.length - 1 ? `<a href="${p}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join("")}</ol></nav>`;

function page({ path: p, title, description, body, current = "", ld = [], ogImage = "/assets/img/site/og.jpg", dark = true, preload = "" }) {
  const canonical = url(p === "/" ? "/" : p);
  return `<!doctype html>
<html lang="en-IN" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0A1B23">
<meta name="geo.region" content="IN-TN"><meta name="geo.placename" content="Chennai">
<meta property="og:type" content="website"><meta property="og:site_name" content="Palaniappa Electronics">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${url(ogImage)}"><meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${url(ogImage)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/poppins-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload}<link rel="stylesheet" href="${asset("/assets/css/styles.css")}">
<script>window.PE={wa:"${P.b2b.wa}",mail:"${P.b2b.mail}"};</script>
${[orgLd, ...ld].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
${header(current, dark)}
<div class="glow" aria-hidden="true"></div>
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="${asset("/assets/js/main.js")}" defer></script>
</body>
</html>`;
}

const splitTitle = (lines) => lines.map((l) => `<span class="line"><span>${l}</span></span>`).join("");

// ---------------------------------------------------------------- pages
function home() {
  const cust = data.customers;
  const custGroups = Object.keys(cust);
  const body = `
<section class="hero" data-hero3d>
  ${img("/assets/img/site/spiral.webp", "", 2066, 1273, "spiral-fallback", false)}
  <div class="wrap hero-inner">
    <div>
      <div class="hero-badge fade-in"><b>SAMSUNG</b> Distributor for Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur</div>
      <h1>${splitTitle(["One stop", "solution for", '<span class="grad">commercial</span>', "products."])}</h1>
      <p class="lead fade-in">Authorised distributors &amp; partners for commercial products of 25+ brands in South India — TVs &amp; displays, IT infrastructure, mattress &amp; linen, hotel amenities, laundry, cooling &amp; HVAC. Bought in volume from the brands, supplied in the quantity you need.</p>
      <div class="hero-ctas fade-in"><a class="btn btn-amber" href="/catalogue">Explore the catalogue ${I.arrow}</a><button type="button" class="btn btn-ghost" data-open-enquiry>Raise an enquiry</button></div>
    </div>
    <aside class="hero-card fade-in" aria-label="Popular solutions">
      <h2>Popular right now</h2>
      <ul>${["hospitality-tv", "digital-signage-kiosks", "led-wall-solutions", "interactive-displays", "commercial-cooling-hvac", "laundry-solutions"].map((s) => { const c = CATS.find((x) => x.slug === s); return `<li><a href="${catUrl(c)}">${esc(c.name.replace(" Solutions", ""))}<span>${count(c)} items →</span></a></li>`; }).join("")}</ul>
    </aside>
  </div>
  <div class="scroll-cue" aria-hidden="true"></div>
  <div class="hero-bottom"><div class="marquee segments" aria-label="Segments we serve">${[0, 1].map((k) => `<div class="marquee-track"${k ? ' aria-hidden="true"' : ""}>${site.segments.concat(site.segments).map((s) => `<span>${esc(s)}</span>`).join("")}</div>`).join("")}</div></div>
</section>

<div class="wrap stats-wrap">
  <div class="stats reveal">${site.stats.map((s) => `<div class="stat"><strong>${s.prefix || ""}<span data-count="${s.n}">${s.n.toLocaleString("en-IN")}</span>${s.suffix}</strong><span>${esc(s.label)}</span></div>`).join("")}</div>
</div>

<section class="section" id="what-we-do">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Two business verticals</span><h2>Distribution &amp; B2B institutional sales.</h2></div>
      <p class="lead">We buy directly from the brands in volume and supply retailers, institutions and projects — with a solution-oriented selling approach.</p></div>
    <div class="verticals">
      <a class="vcard reveal" href="/samsung" data-tilt="4">
        ${pic("/assets/img/site/warehouse-chromepet.webp", "Palaniappa Electronics warehouse facility, Chromepet, Chennai")}
        <div class="body"><span class="tag">Distribution</span><div class="samsung-word" style="margin-top:14px">SAMSUNG</div>
        <h3>Samsung consumer electronics &amp; durables distributor.</h3>
        <p>For Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur districts — supplying Samsung TVs, fridges, washers, ACs &amp; ovens to 500+ retail outlets.</p>
        <span class="link-arrow" style="color:var(--aqua)">Samsung distribution ${I.arrow}</span></div>
      </a>
      <a class="vcard reveal" href="/solutions" data-tilt="4">
        ${pic("/assets/img/site/our-team.webp", "The Palaniappa Electronics team")}
        <div class="body"><span class="tag">B2B institutional sales</span>
        <h3>Largest supplier to hotels, hospitals &amp; institutions in South India.</h3>
        <p>25+ brands in commercial TVs &amp; displays, IT infrastructure, mattress &amp; linens, hotel amenities, laundry, cooling &amp; HVAC — for hotels, hospitals, educational institutions, retail &amp; manufacturing.</p>
        <span class="link-arrow" style="color:var(--aqua)">All solutions ${I.arrow}</span></div>
      </a>
    </div>
  </div>
</section>

<section class="rail-section on-dark" aria-labelledby="sol-h">
  <div class="rail-pin">
    <div class="rail">
      <div class="rail-intro"><span class="eyebrow">The 2026 catalogue, online</span><h2 id="sol-h">${CATS.length} solution ranges. ${TOTAL}+ products.</h2><p class="lead">Scroll through every range — each one opens into a full catalogue page with brands, applications and one-tap enquiry.</p><a class="btn btn-amber" href="/solutions" style="align-self:flex-start;margin-top:10px">View all ${I.arrow}</a></div>
      ${CATS.map((c, i) => `<a class="scard${containCat(c.slug) ? " contain" : ""}" href="${catUrl(c)}" data-tilt="6">
        ${pic(c.hero, c.name)}
        <span class="num">${String(i + 1).padStart(2, "0")} · ${esc(c.group)}</span><span class="go">${I.arrowUR}</span>
        <div class="body"><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p></div></a>`).join("")}
    </div>
    <div class="wrap"><div class="rail-progress"><i></i></div></div>
  </div>
</section>

<section class="section" id="why">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Why Palaniappa?</span><h2>Built on trust, ethics &amp; method.</h2></div><p class="lead">A 150+ crore company and Pan India's leading Samsung partner — with the stock, people and systems to deliver on time.</p></div>
    <div class="why">
      <div class="why-card reveal" data-tilt="5"><span class="big">21</span><div class="ic">${I.shield}</div><h3>Proven track record</h3><p>21 years of excellence since 2004, driven by trust, ethics and methodical systems.</p></div>
      <div class="why-card reveal" data-tilt="5"><span class="big">20K</span><div class="ic">${I.ware}</div><h3>Strong infrastructure</h3><p>20,000 sq. ft warehouse ensuring stock availability and prompt delivery.</p></div>
      <div class="why-card reveal" data-tilt="5"><span class="big">50+</span><div class="ic">${I.team}</div><h3>Expert team</h3><p>50+ experienced employees committed to quality and service.</p></div>
    </div>
    <div class="process reveal" aria-label="End-to-end execution">
      <div class="step"><div class="dot">01</div><h3>Planning</h3><p>Site survey, requirement mapping and the right product mix across brands.</p></div>
      <div class="step"><div class="dot">02</div><h3>Commissioning</h3><p>Supply from our warehouse, installation and configuration by our team and brand partners.</p></div>
      <div class="step"><div class="dot">03</div><h3>Handover</h3><p>Tested, documented and handed over — with a single point of contact afterwards.</p></div>
    </div>
  </div>
</section>

<section class="section on-dark" id="industries">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Industries</span><h2>Pick your industry. See what we supply.</h2></div></div>
    <div class="ind">
      <div class="ind-tabs" role="tablist" aria-label="Industries">${site.industries.map((d, i) => `<button type="button" class="ind-tab" role="tab" id="t-ind-${i}" aria-controls="p-ind-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(d.name)}${I.arrow}</button>`).join("")}</div>
      <div>${site.industries.map((d, i) => `<div class="ind-panel${i === 0 ? " active" : ""}" role="tabpanel" id="p-ind-${i}" aria-labelledby="t-ind-${i}"${i ? " hidden" : ""}>
        <h3>${esc(d.name)}</h3><p class="lead">${esc(d.blurb)}</p>
        <div class="ind-links">${d.cats.map((s) => { const c = CATS.find((x) => x.slug === s); return `<a href="${catUrl(c)}">${img(c.hero, "", 56, 56)}<span>${esc(c.name)}</span></a>`; }).join("")}</div></div>`).join("")}</div>
    </div>
  </div>
</section>

<section class="section" id="brands" style="padding-bottom:40px">
  <div class="wrap"><div class="section-head"><div><span class="eyebrow">Brand partners</span><h2>25+ brands. One purchase order.</h2></div><p class="lead">Plus exclusive hospitality &amp; healthcare partnership with Ingram Micro (TechVantage Solutions), covering 500+ brands available in India.</p></div></div>
  ${[0, 1].map((row) => { const bs = allBrands.filter((_, i) => i % 2 === row); return `<div class="marquee brands${row ? " reverse" : ""}">${[0, 1].map((k) => `<div class="marquee-track"${k ? ' aria-hidden="true"' : ""}>${bs.map((b) => `<span class="logo-tile">${img(BRANDS[b].logo, k ? "" : b, BRANDS[b].w, BRANDS[b].h)}</span>`).join("")}</div>`).join("")}</div>`; }).join("")}
</section>

<section class="section" id="customers" style="padding-top:60px">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">Our prestigious customers</span><h2>Trusted by the names you check into.</h2></div><a class="link-arrow" href="/about#customers">More about our customers ${I.arrow}</a></div>
    <div class="cust-tabs" role="tablist" aria-label="Customer segments">${custGroups.map((g, i) => `<button type="button" class="cust-tab" role="tab" id="t-c-${i}" aria-controls="p-c-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(g)} <span style="opacity:.6">${cust[g].length}</span></button>`).join("")}</div>
    ${custGroups.map((g, i) => `<div class="cust-grid" role="tabpanel" id="p-c-${i}" aria-labelledby="t-c-${i}"${i ? " hidden" : ""}>${cust[g].map((c) => `<div class="logo-tile" title="${esc(c.name)}">${img(c.logo, c.name, c.w, c.h)}</div>`).join("")}</div>`).join("")}
  </div>
</section>

<section class="section" id="faq" style="padding-top:20px">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow">FAQ</span><h2>Questions buyers ask us.</h2></div></div>
    <div class="faq">${site.faqs.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}<i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join("")}</div>
  </div>
</section>
${ctaBand()}`;
  return page({
    path: "/", current: "/",
    title: "Palaniappa Electronics, Chennai | Samsung Distributor & B2B Commercial Products",
    description: `Palaniappa Electronics, Chennai: Samsung distributor and B2B supplier of hospitality TVs, signage, LED walls, interactive displays, IT, hotel amenities, laundry & HVAC from 25+ brands since 2004.`,
    body,
    preload: `<link rel="modulepreload" href="/assets/js/hero3d.js">`,
    ld: [
      { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_URL + "/#website", url: SITE_URL + "/", name: site.name, publisher: { "@id": SITE_URL + "/#org" },
        potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: SITE_URL + "/catalogue?q={search_term_string}" }, "query-input": "required name=search_term_string" } },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: site.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    ],
  });
}

function solutionsIndex() {
  const body = `
<section class="page-hero"><div class="wrap">
  ${crumbsHtml([["Home", "/"], ["Solutions", "/solutions"]])}
  <span class="eyebrow fade-in">Commercial product solutions</span>
  <h1>${splitTitle(["Every commercial", "product, one partner."])}</h1>
  <p class="lead fade-in">${CATS.length} solution ranges and ${TOTAL}+ products across ${GROUPS.length} families — for hospitality, healthcare, education, retail, restaurants, corporates and builders.</p>
  <div class="meta-row fade-in">${GROUPS.map((g) => `<a class="chip" href="#${slugify(g)}">${esc(g)}</a>`).join("")}</div>
</div></section>
${GROUPS.map((g) => `<section class="section" id="${slugify(g)}" style="padding:70px 0 10px;scroll-margin-top:90px"><div class="wrap">
  <div class="section-head" style="margin-bottom:28px"><h2>${esc(g)}</h2></div>
  <div class="cat-grid">${CATS.filter((c) => c.group === g).map((c) => catCard(c)).join("")}</div>
</div></section>`).join("")}
<div style="height:80px"></div>
${ctaBand()}`;
  return page({
    path: "/solutions", current: "/solutions",
    title: "Commercial Product Solutions for Hotels, Hospitals & Institutions | Palaniappa Electronics",
    description: "Hospitality TVs, signage and kiosks, LED walls, interactive displays, IT infrastructure, hotel mattresses, linen and amenities, dishwashers, laundry, refrigeration and HVAC — supplied across South India.",
    body,
    ld: [crumbsLd([["Home", "/"], ["Solutions", "/solutions"]]),
      { "@context": "https://schema.org", "@type": "ItemList", itemListElement: CATS.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: url(catUrl(c)) })) }],
  });
}

function catCard(c) {
  return `<a class="ccard reveal" href="${catUrl(c)}" data-tilt="5">
  <div class="ph${containCat(c.slug) ? " contain" : ""}">${pic(c.hero, c.name)}</div>
  <div class="body"><span class="group">${esc(c.group)}</span><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p><span class="count">${count(c)} products →</span></div></a>`;
}

function categoryPage(c, idx) {
  const secId = (s) => slugify(s.title);
  const brands = [...new Set(c.sections.flatMap((s) => s.brands || []))];
  const related = CATS.filter((x) => x.group === c.group && x.slug !== c.slug).concat(CATS.filter((x) => x.group !== c.group)).slice(0, 4);
  const crumbs = [["Home", "/"], ["Solutions", "/solutions"], [c.name, catUrl(c)]];
  const body = `
<section class="page-hero"><div class="wrap grid">
  <div>
    ${crumbsHtml(crumbs)}
    <span class="eyebrow fade-in">${esc(c.group)} · ${count(c)} products</span>
    <h1>${splitTitle([esc(c.name)])}</h1>
    <p class="lead fade-in">${esc(c.intro)}</p>
    <div class="meta-row fade-in">${(c.applications || []).map((a) => `<span class="chip">${esc(a)}</span>`).join("")}</div>
    <div class="hero-ctas fade-in" style="margin-top:28px"><a class="btn btn-amber" href="#${secId(c.sections[0])}">See the range ${I.arrow}</a><a class="btn btn-ghost" href="https://wa.me/${P.b2b.wa}?text=${encodeURIComponent("Hello Palaniappa Electronics, I'd like a quotation for " + c.name + ".")}" target="_blank" rel="noopener">${I.wa} Ask on WhatsApp</a></div>
  </div>
  <div class="ph-img fade-in${containCat(c.slug) ? " contain" : ""}" data-tilt="6">${pic(c.hero, c.name + " — Palaniappa Electronics", "", false)}</div>
</div></section>
${c.sections.length > 1 ? `<nav class="subnav" aria-label="Sections"><div class="wrap">${c.sections.map((s) => `<a href="#${secId(s)}">${esc(s.title)}</a>`).join("")}</div></nav>` : ""}
<div class="wrap">
${c.sections.map((s) => `<section class="psec" id="${secId(s)}">
  <div class="psec-head">
    <div><h2>${esc(s.title)}</h2>${s.desc ? `<p>${esc(s.desc)}</p>` : ""}
      ${s.applications ? `<div class="kv"><span><b>Application</b>${esc(s.applications.join(", "))}</span></div>` : ""}</div>
    ${s.brands && s.brands.length ? `<div><div class="kv" style="margin:0 0 8px"><b>${s.brands.length > 1 ? "Brands" : "Brand"}</b></div><div class="brand-row">${s.brands.map(brandChip).join("")}</div></div>` : ""}
  </div>
  ${s.features ? `<div class="features">${s.features.map(([h, p]) => `<div class="feature reveal"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("")}</div>` : ""}
  ${s.points ? `<ol class="points">${s.points.map((p) => `<li class="reveal">${esc(p)}</li>`).join("")}</ol>` : ""}
  ${s.items.length ? `<div class="pgrid${!containCat(c.slug) && s.items.length <= 6 ? " wide" : ""}">${s.items.map((it) => productCard(it, c, s)).join("")}</div>` : ""}
</section>`).join("")}
</div>
<section class="section" style="padding-bottom:40px"><div class="wrap">
  ${brands.length ? `<div class="panel reveal" style="margin-bottom:60px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between"><div><span class="eyebrow">Brands in this range</span><h2 style="font-size:1.5rem;margin:0">${esc(brands.join(", "))}</h2></div><div class="brand-row">${brands.map(brandChip).join("")}</div></div>` : ""}
  <div class="section-head"><div><span class="eyebrow">Keep exploring</span><h2>Related solutions</h2></div><a class="link-arrow" href="/solutions">All ${CATS.length} solution ranges ${I.arrow}</a></div>
  <div class="related">${related.map(catCard).join("")}</div>
</div></section>
${ctaBand("Need " + esc(c.name.replace(/ Solutions?$/, "").toLowerCase()) + " for your project?", "Add products to your enquiry list, set quantities and send it to us in one tap — or just call our B2B team.")}`;
  const items = c.sections.flatMap((s) => s.items);
  return page({
    path: catUrl(c), current: "/solutions",
    title: `${c.name} in Chennai | Palaniappa Electronics`,
    description: c.seo.length > 160 ? c.seo.slice(0, c.seo.lastIndexOf(" ", 155)) + "…" : c.seo,
    ogImage: c.hero,
    body,
    ld: [crumbsLd(crumbs), {
      "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, description: c.seo, url: url(catUrl(c)),
      isPartOf: { "@id": SITE_URL + "/#website" }, about: c.applications,
      mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: url(catUrl(c) + "#" + it.slug), image: url(it.img) })) },
    }],
  });
}

function cataloguePage() {
  const body = `
<section class="page-hero" style="padding-bottom:50px"><div class="wrap">
  ${crumbsHtml([["Home", "/"], ["Catalogue", "/catalogue"]])}
  <span class="eyebrow fade-in">B2B catalogue 2026 · always up to date</span>
  <h1>${splitTitle(["The whole catalogue.", "Searchable."])}</h1>
  <p class="lead fade-in">${TOTAL}+ products across ${CATS.length} ranges. Search, filter, tap a photo to zoom and build your enquiry list as you go — no PDF to download.</p>
  <div class="hero-ctas fade-in" style="margin-top:24px"><button type="button" class="btn btn-amber" data-open-enquiry>${I.list} My enquiry list</button>${ARTIFACT ? "" : `<a class="btn btn-ghost" href="/assets/Palaniappa-Electronics-B2B-Catalogue-2026.pdf" download>Download PDF version</a>`}</div>
</div></section>
<div class="cat-tools"><div class="wrap">
  <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><label class="search" style="flex:1;min-width:240px"><span class="sr-only">Search products</span>${I.search}<input id="cat-search" type="search" placeholder="Search e.g. kiosk, minibar, cassette AC, Samsung…" autocomplete="off"></label><span class="result-count" aria-live="polite"></span></div>
  <div class="filters" role="group" aria-label="Filter by range"><button type="button" class="filter" data-f="all" aria-pressed="true">All</button>${GROUPS.map((g) => `<button type="button" class="filter" data-f="${slugify(g)}" aria-pressed="false">${esc(g)}</button>`).join("")}${CATS.map((c) => `<button type="button" class="filter" data-f="${c.slug}" aria-pressed="false">${esc(c.name)}</button>`).join("")}</div>
</div></div>
<div class="wrap" style="padding-bottom:80px">
  ${CATS.map((c) => `<section class="cat-block" aria-labelledby="cb-${c.slug}"><h2 id="cb-${c.slug}">${esc(c.name)} <a href="${catUrl(c)}">Open range →</a></h2>
  <div class="pgrid">${c.sections.flatMap((s) => s.items.map((it) => productCard(it, c, s, { search: true, showCat: true, href: true, reveal: false }))).join("")}</div></section>`).join("")}
  <p class="empty" hidden>No products match. Try another word — or <a href="/contact" style="color:var(--teal-700);font-weight:600">just ask us</a>, we source 500+ brands.</p>
</div>
${ctaBand("Can't find it in the catalogue?", "Through Ingram Micro and our brand partners we can source from 500+ brands. Send us the requirement.")}`;
  return page({
    path: "/catalogue", current: "/catalogue",
    title: "B2B Product Catalogue 2026 — Hotel, Hospital & Commercial Products | Palaniappa Electronics",
    description: `Search ${TOTAL}+ commercial products: hospitality TVs, kiosks, LED walls, smart boards, hotel amenities, mattresses, linen, dishwashers, laundry, refrigeration & ACs. Build a quote in one tap.`,
    body,
    ld: [crumbsLd([["Home", "/"], ["Catalogue", "/catalogue"]])],
  });
}

function samsungPage() {
  const body = `
<section class="page-hero"><div class="wrap grid">
  <div>
    ${crumbsHtml([["Home", "/"], ["Samsung", "/samsung"]])}
    <div class="hero-badge fade-in"><b>SAMSUNG</b> Authorised distributor</div>
    <h1>${splitTitle(["Samsung, straight", "from the distributor."])}</h1>
    <p class="lead fade-in">Palaniappa Electronics is the Samsung consumer electronics &amp; durables distributor for Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur — the stores that sell Samsung across these districts are supplied by us. Buy direct and get a real price advantage.</p>
    <div class="districts fade-in">${site.samsungDistricts.map((d) => `<span>${d}</span>`).join("")}</div>
    <div class="hero-ctas fade-in"><a class="btn btn-amber" href="https://wa.me/${P.enquiry.wa}?text=${encodeURIComponent("Hello Palaniappa Electronics, I'm looking for a Samsung product: ")}" target="_blank" rel="noopener">${I.wa} WhatsApp ${P.enquiry.display}</a><a class="btn btn-ghost" href="tel:${P.enquiry.tel}">${I.phone} Call now</a></div>
  </div>
  <div class="ph-img fade-in" data-tilt="6">${pic("/assets/img/site/warehouse-chromepet.webp", "Palaniappa Electronics Samsung distribution warehouse, Chromepet", "", false)}</div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">For your home</span><h2>Any Samsung product, at distributor price.</h2></div><p class="lead">TV, fridge, washing machine, AC, mobile or anything else — tell us the model or the need, we'll come back with availability and price.</p></div>
  <div class="sam-grid">${site.samsung.map((s) => `<div class="sam reveal" data-tilt="6"><div class="ic">${I[s.icon]}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></div>`).join("")}</div>
</div></section>
<section class="section on-dark"><div class="wrap split">
  <div><span class="eyebrow">For retailers</span><h2>Supplying 500+ Samsung retail outlets.</h2>
    <p class="lead">Retailers across Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur stock Samsung TVs, fridges, washers, ACs &amp; ovens through us — backed by a 20,000 sq. ft warehouse and prompt delivery.</p>
    <ul class="ticks" style="margin-top:24px"><li>Stock availability from our Chromepet warehouse</li><li>Prompt delivery across the four districts</li><li>A dedicated team that knows the Samsung range</li></ul>
    <a class="btn btn-amber" href="#samsung-enquiry">Become a partner retailer ${I.arrow}</a></div>
  <div class="timeline">${[["500+", "Retail outlets supplied"], ["4", "Districts covered"], ["20K", "Sq. ft warehouse"], ["2004", "Serving since"]].map(([n, l]) => `<div class="tl reveal"><strong>${n}</strong><p>${l}</p></div>`).join("")}</div>
</div></section>
<section class="section" id="samsung-enquiry"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">Samsung enquiry</span><h2>Tell us what you're looking for.</h2><p class="lead">Home buyers and retailers — send the model or requirement and we'll reply with price and availability.</p>
    <div class="contact-cards" style="margin-top:24px">
      <a class="ccard-line" href="tel:${P.enquiry.tel}"><span class="ic">${I.phone}</span><span><h3>Call</h3><p>${P.enquiry.display}</p></span></a>
      <a class="ccard-line" href="mailto:${P.enquiry.mail}"><span class="ic">${I.mail}</span><span><h3>E-mail</h3><p>${P.enquiry.mail}</p></span></a>
    </div></div>
  <div class="panel reveal">${enquiryForm({ withList: false, wa: P.enquiry.wa, mail: P.enquiry.mail, subject: "Samsung enquiry — website", idp: "s", segmentDefault: "Home / personal" })}</div>
</div></section>
${ctaBand("Buying for a hotel, hospital or campus?", "Samsung hospitality TVs, signage, LED walls, interactive displays and commercial ACs — see the B2B range.")}`;
  return page({
    path: "/samsung", current: "/samsung",
    title: "Samsung Distributor in Chennai — TVs, Fridges, Washers, ACs | Palaniappa Electronics",
    description: "Authorised Samsung distributor for Chennai, Kanchipuram, Chengalpattu & Thiruvallur, supplying 500+ retail outlets. Buy Samsung TVs, refrigerators, washing machines, ACs & mobiles at distributor price.",
    body,
    ld: [crumbsLd([["Home", "/"], ["Samsung", "/samsung"]])],
  });
}

function aboutPage() {
  const cust = data.customers;
  const body = `
<section class="page-hero"><div class="wrap grid">
  <div>${crumbsHtml([["Home", "/"], ["About", "/about"]])}
    <span class="eyebrow fade-in">About us · Since 2004</span>
    <h1>${splitTitle(["21 years of trust,", "ethics &amp; method."])}</h1>
    <p class="lead fade-in">A 150+ crore turnover company and Pan India's leading Samsung partner, with a solution-oriented selling approach and two business verticals: distribution and B2B institutional sales.</p></div>
  <div class="ph-img fade-in" data-tilt="6">${pic("/assets/img/site/our-team.webp", "The experienced Palaniappa Electronics team", "", false)}</div>
</div></section>
<div class="wrap stats-wrap"><div class="stats reveal">${site.stats.map((s) => `<div class="stat"><strong>${s.prefix || ""}<span data-count="${s.n}">${s.n.toLocaleString("en-IN")}</span>${s.suffix}</strong><span>${esc(s.label)}</span></div>`).join("")}</div></div>
<section class="section"><div class="wrap split">
  <div class="media reveal">${pic("/assets/img/site/warehouse-chromepet.webp", "Warehouse facility, Chromepet")}</div>
  <div><span class="eyebrow">Distribution</span><h2>Samsung distributor for four districts.</h2><p class="lead">Samsung consumer electronics &amp; durables distributor for Chennai, Kanchipuram, Chengalpattu &amp; Thiruvallur districts — supplying Samsung TVs, fridges, washers, ACs &amp; ovens to 500+ retail outlets from our 20,000 sq. ft warehouse in Chromepet.</p><a class="link-arrow" href="/samsung">Samsung distribution ${I.arrow}</a></div>
</div></section>
<section class="section" style="padding-top:0"><div class="wrap split">
  <div><span class="eyebrow">B2B institutional sales</span><h2>The supplier behind South India's hotels, hospitals &amp; campuses.</h2><p class="lead">Largest supplier to hotels, hospitals, educational institutions, retail &amp; manufacturing sectors in South India — offering 25+ brands in commercial TVs &amp; displays, IT infrastructure, mattress &amp; linens, hotel amenities, laundry, cooling &amp; HVAC solutions.</p>
    <ul class="ticks"><li>Proven track record — 21 years of excellence since 2004</li><li>Strong infrastructure — 20,000 sq. ft warehouse for stock availability and prompt delivery</li><li>Expert team — 50+ experienced employees committed to quality and service</li><li>Exclusive Hospitality &amp; Healthcare Partner of Ingram Micro (TechVantage Solutions)</li></ul>
    <a class="btn" href="/solutions">Explore solutions ${I.arrow}</a></div>
  <div class="media reveal">${pic("/assets/img/site/our-team.webp", "Our experienced team")}</div>
</div></section>
<section class="section on-dark" id="customers"><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">Our prestigious customers</span><h2>Hotels, hospitals &amp; institutions that rely on us.</h2></div></div>
  ${Object.keys(cust).map((g) => `<h3 style="margin:34px 0 16px;color:var(--aqua)">${esc(g)}</h3><div class="cust-grid">${cust[g].map((c) => `<div class="logo-tile reveal" title="${esc(c.name)}">${img(c.logo, c.name, c.w, c.h)}</div>`).join("")}</div>`).join("")}
</div></section>
${ctaBand("Let's work together.", "Whether you're opening a hotel, equipping a hospital or upgrading a campus — talk to the team that has done it for the brands above.")}`;
  return page({
    path: "/about", current: "/about",
    title: "About Palaniappa Electronics — Samsung Distributor & B2B Supplier Since 2004",
    description: "Since 2004: a ₹150+ crore company with a 20,000 sq. ft Chromepet warehouse and 50+ staff, supplying Samsung to 500+ outlets and 25+ commercial brands to hotels, hospitals and campuses.",
    body,
    ld: [crumbsLd([["Home", "/"], ["About", "/about"]]), { "@context": "https://schema.org", "@type": "AboutPage", url: url("/about"), about: { "@id": SITE_URL + "/#org" } }],
  });
}

function contactPage() {
  const body = `
<section class="page-hero" style="padding-bottom:60px"><div class="wrap">
  ${crumbsHtml([["Home", "/"], ["Contact", "/contact"]])}
  <span class="eyebrow fade-in">Contact</span>
  <h1>${splitTitle(["Let's talk about", "your requirement."])}</h1>
  <p class="lead fade-in">Call, WhatsApp, e-mail or visit our admin office &amp; warehouse in Chromepet. For a quotation, add products to your enquiry list and send it with the form below.</p>
</div></section>
<section class="section" style="padding-top:60px"><div class="wrap contact-grid">
  <div class="contact-cards">
    <a class="ccard-line reveal" href="tel:${P.b2b.tel}"><span class="ic">${I.phone}</span><span><h3>B2B &amp; projects</h3><p>${P.b2b.display}<br>${P.b2b.mail}</p></span></a>
    <a class="ccard-line reveal" href="tel:${P.enquiry.tel}"><span class="ic">${I.phone}</span><span><h3>General &amp; Samsung enquiries</h3><p>${P.enquiry.display}<br>${P.enquiry.mail}</p></span></a>
    <a class="ccard-line reveal" href="https://wa.me/${P.b2b.wa}" target="_blank" rel="noopener"><span class="ic">${I.wa}</span><span><h3>WhatsApp</h3><p>Message our B2B team — we reply fast.</p></span></a>
    <a class="ccard-line reveal" href="${site.address.maps}" target="_blank" rel="noopener"><span class="ic">${I.pin}</span><span><h3>Admin office &amp; warehouse</h3><p>${esc(site.address.full)}</p><p style="margin-top:6px"><span style="color:var(--teal-700);font-weight:600">Get directions →</span></p></span></a>
    ${ARTIFACT ? `<a class="map map-card reveal" href="${site.address.maps}" target="_blank" rel="noopener">${I.pin}<b>Nagalkeni, Chromepet, Chennai 600044</b><span>Open in Google Maps →</span></a>` : `<div class="map reveal"><iframe src="${site.address.embed}" title="Map: Palaniappa Electronics, Chromepet, Chennai" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`}
  </div>
  <div class="panel reveal" id="enquiry">
    <span class="eyebrow">Send an enquiry</span><h2 style="font-size:1.7rem">Request a quotation</h2>
    <div class="enq-empty">No products in your list yet — that's fine, just describe the requirement. Or <a href="/catalogue" style="color:var(--teal-700);font-weight:600">pick products from the catalogue</a>.</div>
    <ul class="enq-list" data-enq-list></ul>
    ${enquiryForm({ idp: "c" })}
  </div>
</div></section>`;
  return page({
    path: "/contact", current: "/contact",
    title: "Contact Palaniappa Electronics — Chromepet, Chennai | +91 89399 99718",
    description: "Contact Palaniappa Electronics, Nagalkeni, Chromepet, Chennai 600044. B2B: +91 89399 99718, b2b.palaniappa@gmail.com. Enquiries: +91 89399 99705. Request a quote on WhatsApp.",
    body,
    ld: [crumbsLd([["Home", "/"], ["Contact", "/contact"]]), { "@context": "https://schema.org", "@type": "ContactPage", url: url("/contact"), about: { "@id": SITE_URL + "/#org" } }],
  });
}

function careersPage() {
  const roles = [
    ["Sales & business development", "B2B institutional sales to hotels, hospitals and campuses, and channel sales to Samsung retailers."],
    ["Warehouse & logistics", "Inventory, dispatch and delivery from our 20,000 sq. ft Chromepet warehouse."],
    ["Installation & technical support", "Displays, LED walls, IT networks, set-top boxes and appliance installations on site."],
    ["Accounts & operations", "Billing, purchase, MIS and back-office systems that keep a 150+ crore business running."],
  ];
  const body = `
<section class="page-hero"><div class="wrap grid">
  <div>${crumbsHtml([["Home", "/"], ["Careers", "/careers"]])}
    <span class="eyebrow fade-in">Careers</span>
    <h1>${splitTitle(["Grow with a team", "of 50+ people."])}</h1>
    <p class="lead fade-in">For 21 years Palaniappa Electronics has grown on trust, ethics and methodical systems. If you want to work with leading brands and South India's best-known hotels, hospitals and institutions, we'd like to hear from you.</p>
    <div class="hero-ctas fade-in" style="margin-top:24px"><a class="btn btn-amber" href="#apply">Apply now ${I.arrow}</a></div></div>
  <div class="ph-img fade-in" data-tilt="6">${pic("/assets/img/site/our-team.webp", "Palaniappa Electronics team", "", false)}</div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">Where you could fit</span><h2>Teams we hire for.</h2></div><p class="lead">Openings change through the year — send your CV for any of these teams and we'll get in touch when there's a match.</p></div>
  <div class="jobs">${roles.map(([t, d]) => `<div class="job reveal" data-tilt="5"><span class="chip" style="align-self:flex-start">Chennai · Chromepet</span><h3>${t}</h3><p>${d}</p><a class="link-arrow" href="#apply" data-role="${esc(t)}">Apply ${I.arrow}</a></div>`).join("")}</div>
</div></section>
<section class="section" id="apply" style="padding-top:0"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">Apply</span><h2>Send us your details.</h2><p class="lead">Fill this in and it opens as an e-mail or WhatsApp message to our team — attach your CV before sending.</p>
    <ul class="ticks"><li>21 years in business, since 2004</li><li>Work with Samsung, Sony, LG, IFB and 20+ other brands</li><li>Projects for leading hotels, hospitals and universities</li></ul></div>
  <div class="panel reveal">
  <form class="form" data-enq-form data-wa="${P.enquiry.wa}" data-mail="${P.enquiry.mail}" data-subject="Job application — website" data-greeting="Hello Palaniappa Electronics, I would like to apply for a role." novalidate>
    <div class="field"><label for="j-name">Full name *</label><input id="j-name" name="name" data-label="Name" required autocomplete="name"></div>
    <div class="field"><label for="j-phone">Phone *</label><input id="j-phone" name="phone" data-label="Phone" type="tel" required autocomplete="tel"></div>
    <div class="field"><label for="j-email">E-mail</label><input id="j-email" name="email" data-label="E-mail" type="email" autocomplete="email"></div>
    <div class="field"><label for="j-role">Team</label><select id="j-role" name="role" data-label="Team">${roles.map(([t]) => `<option>${t}</option>`).join("")}<option>Other</option></select></div>
    <div class="field"><label for="j-exp">Experience (years)</label><input id="j-exp" name="exp" data-label="Experience (years)" inputmode="numeric"></div>
    <div class="field"><label for="j-city">Current city</label><input id="j-city" name="city" data-label="City"></div>
    <div class="field full"><label for="j-msg">About you</label><textarea id="j-msg" name="message" data-label="About me" placeholder="Current role, skills, notice period…"></textarea></div>
    <div class="form-actions"><button class="btn" type="submit" data-via="mail">${I.mail} Apply by e-mail</button><button class="btn btn-wa" type="submit" data-via="wa">${I.wa} WhatsApp</button></div>
    <p class="form-status" role="status"></p>
  </form></div>
</div></section>`;
  return page({
    path: "/careers", current: "/careers",
    title: "Careers at Palaniappa Electronics, Chennai — Sales, Logistics, Technical Jobs",
    description: "Join Palaniappa Electronics in Chromepet, Chennai. We hire for B2B sales, warehouse & logistics, installation & technical support, and accounts. Apply online.",
    body,
    ld: [crumbsLd([["Home", "/"], ["Careers", "/careers"]])],
  });
}

function notFound() {
  return page({
    path: "/404", title: "Page not found | Palaniappa Electronics", description: "The page you were looking for doesn't exist.",
    body: `<section class="page-hero" style="min-height:80vh;display:flex;align-items:center"><div class="wrap"><span class="eyebrow">404</span><h1>${splitTitle(["This page", "switched off."])}</h1><p class="lead">The link may be old. Try the catalogue, or go back home.</p><div class="hero-ctas" style="margin-top:24px"><a class="btn btn-amber" href="/catalogue">Search catalogue ${I.arrow}</a><a class="btn btn-ghost" href="/">Home</a></div></div></section>`,
  }).replace('content="index,follow,max-image-preview:large"', 'content="noindex"');
}

// ---------------------------------------------------------------- build
function copyDir(a, b) {
  fs.mkdirSync(b, { recursive: true });
  for (const f of fs.readdirSync(a, { withFileTypes: true })) {
    const s = path.join(a, f.name), d = path.join(b, f.name);
    f.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
// Artifact hosting has no clean URLs or root-relative paths: rewrite every
// internal link to a relative .html path and unwrap the root page.
function relativize(html, rel) {
  const depth = rel.split("/").length - 1;
  const pre = "../".repeat(depth);
  html = html.replace(/(\s(?:href|src|data-img|data-href))="\/([^"]*)"/g, (m, attr, p) => {
    if (p.startsWith("/")) return m; // protocol-relative
    const [pathPart, hash = ""] = p.split("#");
    const clean = pathPart.split("?")[0];
    let out;
    if (clean === "") out = "index.html";
    else if (/\.[a-z0-9]+$/i.test(clean)) out = clean;
    else out = clean.replace(/\/$/, "") + ".html";
    return `${attr}="${pre}${out}${hash ? "#" + hash : ""}"`;
  });
  if (rel === "index.html") {
    html = html.replace(/^<!doctype html>\s*/i, "").replace(/<html[^>]*>\s*<head>\s*/i, "").replace(/<meta charset="utf-8">\s*/i, "")
      .replace(/<meta name="viewport"[^>]*>\s*/i, "").replace(/<\/head>\s*<body>/i, "").replace(/<\/body>\s*<\/html>\s*$/i, "");
  }
  return html;
}
function write(rel, html) {
  if (ARTIFACT && rel.endsWith(".html")) html = relativize(html, rel);
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));
  copyDir(path.join(SRC, "css"), path.join(OUT, "assets/css"));
  copyDir(path.join(SRC, "js"), path.join(OUT, "assets/js"));
  copyDir(path.join(SRC, "public"), OUT);
  if (ARTIFACT) fs.rmSync(path.join(OUT, "assets/Palaniappa-Electronics-B2B-Catalogue-2026.pdf"), { force: true });
  const h = crypto.createHash("md5");
  for (const f of ["css/styles.css", "js/main.js", "js/hero3d.js"]) h.update(fs.readFileSync(path.join(SRC, f)));
  assetHash = h.digest("hex").slice(0, 8);

  const pages = [
    ["index.html", home(), "/", "1.0"],
    ["solutions.html", solutionsIndex(), "/solutions", "0.9"],
    ["catalogue.html", cataloguePage(), "/catalogue", "0.9"],
    ["samsung.html", samsungPage(), "/samsung", "0.9"],
    ["about.html", aboutPage(), "/about", "0.7"],
    ["contact.html", contactPage(), "/contact", "0.8"],
    ["careers.html", careersPage(), "/careers", "0.5"],
    ...CATS.map((c, i) => [`solutions/${c.slug}.html`, categoryPage(c, i), catUrl(c), "0.8"]),
  ];
  for (const [f, html] of pages) write(f, html);
  write("404.html", notFound());

  const today = new Date().toISOString().slice(0, 10);
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(([f, , p, pr]) => {
    const c = CATS.find((x) => catUrl(x) === p);
    const imgs = c ? c.sections.flatMap((s) => s.items).slice(0, 40).map((it) => `<image:image><image:loc>${url(it.img)}</image:loc><image:title>${esc(it.name)}</image:title></image:image>`).join("") : "";
    return `<url><loc>${url(p === "/" ? "/" : p)}</loc><lastmod>${today}</lastmod><priority>${pr}</priority>${imgs}</url>`;
  }).join("\n")}
</urlset>`);
  write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${url("/sitemap.xml")}\n`);
  console.log(`Built ${pages.length + 1} pages, ${TOTAL} products -> dist/  (SITE_URL=${SITE_URL})`);
}

build();

if (process.argv.includes("--serve")) {
  const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json", ".webmanifest": "application/manifest+json", ".pdf": "application/pdf" };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let f = path.join(OUT, p);
    if (p === "/") f = path.join(OUT, "index.html");
    else if (!path.extname(p)) f = path.join(OUT, p.replace(/\/$/, "") + ".html");
    if (!fs.existsSync(f)) { res.writeHead(404, { "content-type": types[".html"] }); return res.end(fs.readFileSync(path.join(OUT, "404.html"))); }
    res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  }).listen(4173, () => console.log("Serving dist on http://localhost:4173"));
}
