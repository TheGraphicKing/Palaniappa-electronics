"use client";
import { usePathname } from "next/navigation";
import { WhatsApp } from "./icons";
import { waLink } from "@/lib/site";

export function WhatsAppFab() {
  const path = usePathname();
  if (path.startsWith("/request-quote") || path === "/contact") return null;
  return (
    <a href={waLink("Hello Palaniappa Electronics, I have a product enquiry.")} target="_blank" rel="noopener noreferrer" aria-label="Chat with our sales team on WhatsApp"
      className="fixed bottom-6 right-6 z-30 hidden h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#128C4A] text-white shadow-panel transition-transform hover:scale-105 md:grid">
      <WhatsApp className="h-6 w-6" />
    </a>
  );
}
