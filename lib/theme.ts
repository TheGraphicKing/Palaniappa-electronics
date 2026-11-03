// Palettes. Change DEFAULT_PALETTE to switch the whole site.
export const PALETTES = [
  { id: "brass", name: "Ink & Brass", note: "Warm gold on ink — premium, hospitality-led", swatch: ["#8E6830", "#D6B27A", "#0E121A"] },
  { id: "cobalt", name: "Cobalt", note: "Confident tech blue — closest to the original brief", swatch: ["#3559E0", "#7A98FF", "#0E121A"] },
  { id: "teal", name: "Signal Teal", note: "Taken from the logo — most on-brand", swatch: ["#136E7E", "#58C4D2", "#0E121A"] },
  { id: "ember", name: "Ember", note: "Industrial orange — energetic, retail-style", swatch: ["#CE4A24", "#FF8052", "#0E121A"] },
  { id: "emerald", name: "Emerald", note: "Calm green — trustworthy, institutional", swatch: ["#0C7A58", "#48D2A0", "#0E121A"] },
] as const;
export type PaletteId = (typeof PALETTES)[number]["id"];
export const DEFAULT_PALETTE: PaletteId = "brass";
export const PALETTE_KEY = "pe-palette-preview";

// Inlined in <head>: applies a previewed palette (from ?palette=… or an earlier preview) before first paint.
export const paletteInitScript = `(function(){try{var q=new URLSearchParams(location.search),ids=${JSON.stringify(["brass", "cobalt", "teal", "ember", "emerald"])};var p=q.get("palette");if(p&&ids.indexOf(p)>-1){localStorage.setItem("${PALETTE_KEY}",p);}if(q.has("palettes")&&!localStorage.getItem("${PALETTE_KEY}"))localStorage.setItem("${PALETTE_KEY}","${DEFAULT_PALETTE}");var s=localStorage.getItem("${PALETTE_KEY}");if(s&&ids.indexOf(s)>-1)document.documentElement.setAttribute("data-palette",s);}catch(e){}})();`;
