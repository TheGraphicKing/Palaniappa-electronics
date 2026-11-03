import type { Config } from "tailwindcss";

// Design tokens — "Ink & Brass"
// A dark showroom: deep blue-black surfaces, warm brass for action and emphasis,
// the logo's teal as a quiet secondary signal, and light "plinths" for product photos.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Every colour is a CSS variable (see app/globals.css) so the site can switch
      // between the dark "Ink & Brass" theme and its light counterpart.
      colors: {
        ink: { 950: v("ink-950"), 900: v("ink-900"), 850: v("ink-850"), 800: v("ink-800"), 700: v("ink-700"), 600: v("ink-600") },
        canvas: v("canvas"), // page background
        surface: { DEFAULT: v("surface"), 2: v("surface-2") }, // cards, panels
        plinth: v("plinth"), // light stage behind product cut-outs and logos
        fg: v("fg"), // primary text
        muted: v("muted"), // secondary text
        subtle: v("subtle"), // tertiary text / metadata
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        brass: { DEFAULT: v("brass"), hi: v("brass-hi"), deep: v("brass-deep"), tint: v("brass-tint") }, // primary accent
        onaccent: v("onaccent"), // text on brass
        signal: v("signal"), // logo teal, secondary accent
        veil: v("veil"), // white in dark theme, ink in light theme — for hairlines and glass tints
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: { sm: "6px", DEFAULT: "10px", lg: "16px", xl: "22px" },
      maxWidth: { site: "1320px" },
      letterSpacing: { tightest: "-0.045em" },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,.04) inset",
        lift: "0 30px 60px -30px rgb(var(--shadow) / .55), 0 0 0 1px rgb(var(--c-brass) / .3)",
        panel: "0 40px 80px -30px rgb(var(--shadow) / .6)",
        glow: "0 0 0 1px rgb(var(--c-brass) / .35), 0 12px 40px -12px rgb(var(--c-brass) / .45)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.3)" }, "100%": { transform: "scale(1)" } },
        slidein: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        kenburns: { from: { transform: "scale(1.08)" }, to: { transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        spin: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        rise: "rise .7s cubic-bezier(.22,1,.36,1) both",
        pop: "pop .35s ease",
        slidein: "slidein .4s cubic-bezier(.22,1,.36,1)",
        marquee: "marquee 50s linear infinite",
        fade: "fade .6s ease both",
        kenburns: "kenburns 9s cubic-bezier(.22,1,.36,1) both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
