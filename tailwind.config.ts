import type { Config } from "tailwindcss";

// Design tokens — "Porcelain & Cobalt"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#F7F8FA", // page background
        graphite: "#171B23", // primary text
        cobalt: { DEFAULT: "#3559E0", dark: "#2445C2", soft: "#EEF2FD" }, // primary accent
        steel: "#8A96A8", // tertiary text, large metadata only (3:1)
        slate: "#525C6C", // secondary body text (AA on white and porcelain)
        line: "#E4E7EC", // borders
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
      borderRadius: { sm: "6px", DEFAULT: "8px", lg: "12px" },
      maxWidth: { site: "1280px" },
      letterSpacing: { tightest: "-0.035em" },
      boxShadow: {
        card: "0 1px 2px rgba(23,27,35,.04), 0 1px 1px rgba(23,27,35,.02)",
        lift: "0 12px 32px -12px rgba(23,27,35,.18)",
        panel: "0 24px 64px -24px rgba(23,27,35,.28)",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.25)" }, "100%": { transform: "scale(1)" } },
        slidein: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
      },
      animation: { rise: "rise .6s cubic-bezier(.22,1,.36,1) both", pop: "pop .35s ease", slidein: "slidein .35s cubic-bezier(.22,1,.36,1)" },
    },
  },
  plugins: [],
};
export default config;
