"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBasket } from "./basket";
import { QtyStepper } from "./basket-drawer";
import { ArrowRight, Mail, WhatsApp } from "./icons";
import { INDUSTRY_OPTIONS, enquiryText, validateEnquiry, type EnquiryPayload, type FieldErrors } from "@/lib/enquiry";
import { site, waLink } from "@/lib/site";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "fallback"; reason: string } | { kind: "error"; message: string };

const input = "block w-full rounded border border-line bg-surface px-3.5 py-2.5 text-[15px] text-fg placeholder:text-subtle transition-colors focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20 aria-[invalid=true]:border-red-400";

function Field({ id, label, error, required, children, hint }: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">{label}{required && <span className="text-red-400" aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}

export function EnquiryForm({ withBasket = true, defaultMessage = "", heading }: { withBasket?: boolean; defaultMessage?: string; heading?: string }) {
  const router = useRouter();
  const { items, ready, remove, setNote, clear } = useBasket();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [draft, setDraft] = useState<EnquiryPayload | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload: EnquiryPayload = {
      name: String(f.get("name") || ""),
      company: String(f.get("company") || ""),
      email: String(f.get("email") || ""),
      phone: String(f.get("phone") || ""),
      industry: String(f.get("industry") || ""),
      location: String(f.get("location") || ""),
      message: String(f.get("message") || ""),
      website: String(f.get("website") || ""),
      page: typeof window !== "undefined" ? window.location.href : "",
      items: withBasket ? items.map(({ slug, name, category, qty, note }) => ({ slug, name, category, qty, note })) : [],
    };
    const v = validateEnquiry(payload, { requireItemsOrMessage: true });
    setErrors(v);
    setDraft(payload);
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const r = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        try { sessionStorage.setItem("pe-last-enquiry", JSON.stringify({ reference: j.reference, items: payload.items, company: payload.company, at: new Date().toISOString() })); } catch {}
        if (withBasket) clear();
        router.push(`/request-quote/sent?ref=${encodeURIComponent(j.reference)}`);
        return;
      }
      if (r.status === 400 && j.errors) { setErrors(j.errors); setStatus({ kind: "idle" }); return; }
      if (r.status === 503) { setStatus({ kind: "fallback", reason: "Online submission is not switched on for this website yet, so your enquiry has not been sent." }); return; }
      if (r.status === 429) { setStatus({ kind: "error", message: j.message || "Too many attempts. Wait a minute and try again." }); return; }
      setStatus({ kind: "fallback", reason: "We could not deliver your enquiry right now, so it has not been sent." });
    } catch {
      setStatus({ kind: "fallback", reason: "Your connection dropped before the enquiry reached us, so it has not been sent." });
    }
  }

  const text = draft ? enquiryText(draft) : "";
  const showItems = withBasket;

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {heading && <h2 className="text-xl font-semibold text-fg">{heading}</h2>}
      {showItems && (
        <fieldset>
          <legend className="mb-3 flex w-full items-baseline justify-between text-sm font-semibold text-fg">
            <span>Products in this enquiry</span>
            {ready && items.length > 0 && <span className="text-xs font-normal text-muted">{items.length} selected</span>}
          </legend>
          {!ready ? (
            <div className="h-24 animate-pulse rounded-lg bg-canvas" />
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-canvas/60 p-5 text-sm text-muted">
              No products selected. You can describe your requirement in the message below, or{" "}
              <Link href="/products" className="font-semibold text-brass">add products from the catalogue</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line">
              {items.map((it) => (
                <li key={it.slug} className="grid gap-3 bg-surface p-4 sm:grid-cols-[56px_1fr_auto] sm:items-start">
                  <div className="relative hidden h-14 w-14 overflow-hidden rounded border border-line bg-surface sm:block">{it.image ? <Image src={it.image} alt="" fill sizes="56px" className="object-contain p-1" /> : null}</div>
                  <div className="min-w-0">
                    <Link href={it.href} className="text-sm font-semibold text-fg hover:text-brass">{it.name}</Link>
                    <p className="text-xs text-muted">{it.category}</p>
                    <label className="sr-only" htmlFor={`note-${it.slug}`}>Note for {it.name}</label>
                    <input id={`note-${it.slug}`} value={it.note || ""} onChange={(e) => setNote(it.slug, e.target.value)} placeholder="Optional: size, model, specification or question" className="mt-2 w-full rounded border border-line px-3 py-1.5 text-[13px] placeholder:text-subtle focus:border-brass focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <QtyStepper slug={it.slug} qty={it.qty} name={it.name} />
                    <button type="button" onClick={() => remove(it.slug)} className="text-xs font-medium text-muted hover:text-red-300">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      )}

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-fg">Your details</legend>
        <Field id="f-name" label="Full name" required error={errors.name}><input id="f-name" name="name" autoComplete="name" className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? "f-name-err" : undefined} /></Field>
        <Field id="f-company" label="Company / institution" required error={errors.company}><input id="f-company" name="company" autoComplete="organization" className={input} aria-invalid={!!errors.company} aria-describedby={errors.company ? "f-company-err" : undefined} /></Field>
        <Field id="f-email" label="Business email" required error={errors.email}><input id="f-email" name="email" type="email" autoComplete="email" className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? "f-email-err" : undefined} /></Field>
        <Field id="f-phone" label="Phone" required error={errors.phone}><input id="f-phone" name="phone" type="tel" autoComplete="tel" className={input} placeholder="+91" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "f-phone-err" : undefined} /></Field>
        <Field id="f-industry" label="Industry">
          <select id="f-industry" name="industry" className={input} defaultValue=""><option value="">Select…</option>{INDUSTRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select>
        </Field>
        <Field id="f-location" label="City / project location" required error={errors.location}><input id="f-location" name="location" autoComplete="address-level2" className={input} aria-invalid={!!errors.location} aria-describedby={errors.location ? "f-location-err" : undefined} /></Field>
        <div className="sm:col-span-2">
          <Field id="f-message" label="Project requirement or message" error={errors.message} hint="Quantities, timelines, site details or technical questions.">
            <textarea id="f-message" name="message" rows={5} defaultValue={defaultMessage} className={input} aria-invalid={!!errors.message} aria-describedby={errors.message ? "f-message-err" : undefined} />
          </Field>
        </div>
        <div aria-hidden="true" className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      </fieldset>

      {status.kind === "error" && <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{status.message}</p>}
      {status.kind === "fallback" && (
        <div role="alert" className="rounded-lg border border-brass/30 bg-brass-tint p-5 text-sm text-fg">
          <p className="font-semibold">{status.reason}</p>
          <p className="mt-1">Send the same enquiry directly to our sales team instead — your details and product list are already filled in:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded bg-[#1F8F4E] px-4 py-2.5 font-semibold text-white hover:bg-[#187540]"><WhatsApp /> Send on WhatsApp</a>
            <a href={`mailto:${site.contact.sales.email}?subject=${encodeURIComponent("Requirement from " + (draft?.company || "website"))}&body=${encodeURIComponent(text)}`} className="inline-flex items-center gap-2 rounded border border-line-strong bg-surface-2 px-4 py-2.5 font-semibold text-fg"><Mail /> Send by email</a>
          </div>
          <p className="mt-3 text-xs">Or call {site.contact.sales.phone}.</p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted">We use these details only to respond to your enquiry. See our <Link href="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>.</p>
        <button type="submit" disabled={status.kind === "sending"} className="inline-flex h-12 items-center justify-center gap-2 rounded bg-brass px-6 text-sm font-semibold text-onaccent transition-colors hover:bg-brass-hi disabled:cursor-wait disabled:opacity-70">
          {status.kind === "sending" ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-onaccent/40 border-t-onaccent" /> Sending…</>) : (<>Submit enquiry <ArrowRight className="h-4 w-4" /></>)}
        </button>
      </div>
    </form>
  );
}
