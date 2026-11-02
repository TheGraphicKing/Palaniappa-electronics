import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui";
import { SentSummary } from "@/components/sent-summary";

export const metadata: Metadata = { title: "Enquiry received", robots: { index: false, follow: false }, alternates: { canonical: "/request-quote/sent" } };

export default function Sent() {
  return <Container className="py-16 md:py-24"><Suspense><SentSummary /></Suspense></Container>;
}
