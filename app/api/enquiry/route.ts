// POST /api/enquiry — server-side enquiry delivery.
// Configure at least one channel in Vercel → Project → Settings → Environment Variables:
//   RESEND_API_KEY + ENQUIRY_TO_EMAIL (+ ENQUIRY_FROM_EMAIL)   → email via Resend
//   ENQUIRY_WEBHOOK_URL (+ ENQUIRY_WEBHOOK_SECRET)               → JSON POST to a CRM / Zapier / Apps Script
// With no channel configured the route answers 503 and the site tells the visitor
// to use WhatsApp or email instead. It never reports success it did not achieve.
import { NextResponse } from "next/server";
import { enquiryText, validateEnquiry, type EnquiryPayload } from "@/lib/enquiry";

export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const clean = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited", message: "Too many enquiries in a short time. Please wait a minute and try again." }, { status: 429 });

  let body: Partial<EnquiryPayload>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true, reference: "PE-RECEIVED" }); // honeypot: silently drop bots

  const p: EnquiryPayload = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 160),
    phone: clean(body.phone, 30),
    industry: clean(body.industry, 80),
    location: clean(body.location, 160),
    message: clean(body.message, 4000),
    page: clean(body.page, 300),
    items: (Array.isArray(body.items) ? body.items : []).slice(0, 300).map((it) => ({
      slug: clean(it?.slug, 120),
      name: clean(it?.name, 200),
      category: clean(it?.category, 200),
      qty: Math.min(99999, Math.max(1, Math.round(Number(it?.qty) || 1))),
      note: clean(it?.note, 500),
    })).filter((it) => it.name),
  };
  const errors = validateEnquiry(p, { requireItemsOrMessage: true });
  if (Object.keys(errors).length) return NextResponse.json({ error: "invalid", errors }, { status: 400 });

  const d = new Date();
  const reference = `PE-${d.toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const text = enquiryText(p, reference);

  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL, ENQUIRY_WEBHOOK_URL, ENQUIRY_WEBHOOK_SECRET } = process.env;
  const channels: Promise<string>[] = [];

  if (RESEND_API_KEY && ENQUIRY_TO_EMAIL) {
    const rows = p.items.map((it) => `<tr><td style="padding:6px 10px;border:1px solid #E4E7EC">${esc(it.name)}</td><td style="padding:6px 10px;border:1px solid #E4E7EC">${esc(it.category)}</td><td style="padding:6px 10px;border:1px solid #E4E7EC;text-align:right">${it.qty}</td><td style="padding:6px 10px;border:1px solid #E4E7EC">${esc(it.note || "")}</td></tr>`).join("");
    const html = `<div style="font-family:Arial,sans-serif;color:#171B23"><h2 style="margin:0 0 4px">New website enquiry</h2><p style="color:#525C6C;margin:0 0 16px">Reference ${reference}</p>
      <table style="border-collapse:collapse;margin-bottom:16px">${[["Name", p.name], ["Company", p.company], ["Email", p.email], ["Phone", p.phone], ["Industry", p.industry || "—"], ["Location", p.location]].map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#525C6C">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join("")}</table>
      ${rows ? `<table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="background:#F7F8FA"><th align="left" style="padding:6px 10px;border:1px solid #E4E7EC">Product</th><th align="left" style="padding:6px 10px;border:1px solid #E4E7EC">Category</th><th style="padding:6px 10px;border:1px solid #E4E7EC">Qty</th><th align="left" style="padding:6px 10px;border:1px solid #E4E7EC">Note</th></tr>${rows}</table>` : ""}
      ${p.message ? `<p style="white-space:pre-wrap;margin-top:16px">${esc(p.message)}</p>` : ""}<p style="color:#8A96A8;font-size:12px">Sent from ${esc(p.page || "website")}</p></div>`;
    channels.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: ENQUIRY_FROM_EMAIL || "Palaniappa Website <onboarding@resend.dev>",
          to: ENQUIRY_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
          reply_to: p.email,
          subject: `Enquiry ${reference} — ${p.company} (${p.items.length} product${p.items.length === 1 ? "" : "s"})`,
          text,
          html,
        }),
      }).then(async (r) => { if (!r.ok) throw new Error(`resend ${r.status} ${await r.text()}`); return "email"; }),
    );
  }
  if (ENQUIRY_WEBHOOK_URL) {
    channels.push(
      fetch(ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(ENQUIRY_WEBHOOK_SECRET ? { "X-Webhook-Secret": ENQUIRY_WEBHOOK_SECRET } : {}) },
        body: JSON.stringify({ reference, receivedAt: d.toISOString(), ...p, text }),
      }).then((r) => { if (!r.ok) throw new Error(`webhook ${r.status}`); return "webhook"; }),
    );
  }

  if (!channels.length) {
    return NextResponse.json({ error: "not_configured", message: "Online enquiry delivery is not configured yet." }, { status: 503 });
  }
  const results = await Promise.allSettled(channels);
  const delivered = results.filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled").map((r) => r.value);
  results.forEach((r) => r.status === "rejected" && console.error("[enquiry] delivery failed:", r.reason));
  if (!delivered.length) return NextResponse.json({ error: "delivery_failed", message: "We could not deliver your enquiry right now." }, { status: 502 });
  return NextResponse.json({ ok: true, reference, delivered });
}

export function GET() {
  const configured = Boolean((process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL);
  return NextResponse.json({ configured });
}
