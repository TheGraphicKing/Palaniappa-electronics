"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";
import { THEME_KEY } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => { setTheme((document.documentElement.getAttribute("data-theme") as Theme) || "dark"); }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const html = document.documentElement;
    html.classList.add("theme-anim");
    html.setAttribute("data-theme", next);
    window.setTimeout(() => html.classList.remove("theme-anim"), 400);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#F4F5F8" : "#080B11");
    setTheme(next);
  };

  const light = theme === "light";
  return (
    <button type="button" onClick={toggle} aria-label={light ? "Switch to dark theme" : "Switch to light theme"} title={light ? "Dark theme" : "Light theme"}
      className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line-strong text-muted transition-colors hover:border-brass/60 hover:text-brass ${className}`}>
      {/* sun */}
      <svg viewBox="0 0 24 24" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${light ? "-translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* moon */}
      <svg viewBox="0 0 24 24" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${light ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 -rotate-90 opacity-0"}`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
