import type { Config } from "tailwindcss";

// Design tokens — "Ink & Brass"
// A dark showroom: deep blue-black surfaces, warm brass for action and emphasis,
// the logo's teal as a quiet secondary signal, and light "plinths" for product photos.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#05070B", 900: "#080B11", 850: "#0C1017", 800: "#10151E", 700: "#171E2A", 600: "#212A39" },
        canvas: "#080B11", // page background
        surface: { DEFAULT: "#0E131B", 2: "#141A25" }, // cards, panels
        plinth: "#F2F3F5", // light stage behind product cut-outs and logos
        fg: "#EEF1F6", // primary text
        muted: "#A5AEBF", // secondary text (AA on surfaces)
        subtle: "#737E93", // tertiary text / metadata
        line: { DEFAULT: "#1D2533", strong: "#2B3546" },
        brass: { DEFAULT: "#D6B27A", hi: "#E8CC9A", deep: "#A9874F", tint: "#221E16" }, // primary accent
        signal: "#5FB6C4", // logo teal, secondary accent
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
        lift: "0 30px 60px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(214,178,122,.25)",
        panel: "0 40px 80px -30px rgba(0,0,0,.85)",
        glow: "0 0 0 1px rgba(214,178,122,.35), 0 12px 40px -12px rgba(214,178,122,.45)",
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
