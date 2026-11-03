// Starter lists for the Room Builder: typical items per room / outlet, built only
// from products in our catalogue. Visitors adjust quantities before sending.
export type Preset = { id: string; name: string; unit: string; max: number; start: number; image: string; items: [slug: string, perUnit: number][] };

export const PRESETS: Preset[] = [
  {
    id: "hotel-room", name: "Hotel guest room", unit: "rooms", max: 500, start: 40, image: "/images/hospitality-tv/hotel-guest-room-tv.webp",
    items: [["hotel-guest-room-tv", 1], ["hotel-rfid-card-locks", 1], ["power-saver-key-tag", 1], ["dnd-panel", 1], ["glass-door-mini-bar", 1], ["front-open-safe", 1], ["electric-kettle", 1], ["wall-mounted-hair-dryer", 1], ["euro-soft-pro", 1], ["duvet-comforter", 1], ["soft-pillow", 2], ["bath-towel", 2], ["bath-robe-and-slippers", 2], ["luggage-rack", 1], ["split-ac-high-wall", 1]],
  },
  {
    id: "patient-room", name: "Hospital patient room", unit: "rooms", max: 400, start: 30, image: "/images/hospitality-tv/hospital-patient-room-tv.webp",
    items: [["hospital-patient-room-tv", 1], ["mattress-protector", 1], ["telephone", 1], ["bldc-fan", 1], ["split-ac-high-wall", 1], ["wall-mounted-soap-dispensers", 1], ["pedal-bin", 1], ["bath-towel", 2], ["shower-curtains", 1]],
  },
  {
    id: "classroom", name: "Smart classroom", unit: "classrooms", max: 300, start: 24, image: "/images/interactive-displays/classroom-interactive-panel.webp",
    items: [["classroom-interactive-panel", 1], ["laptop", 1], ["four-way-cassette-ac", 1], ["bldc-fan", 2], ["active-and-passive-networking", 1], ["cctv-and-security-systems", 1]],
  },
  {
    id: "boardroom", name: "Boardroom", unit: "rooms", max: 60, start: 4, image: "/images/interactive-displays/boardroom-hybrid-display.webp",
    items: [["boardroom-hybrid-display", 1], ["video-conferencing-display", 1], ["audio-visual-av-solutions", 1], ["four-way-cassette-ac", 1], ["epabx-and-unified-communications", 1]],
  },
  {
    id: "restaurant", name: "Restaurant / QSR outlet", unit: "outlets", max: 100, start: 3, image: "/images/digital-signage-kiosks/restaurant-signage.webp",
    items: [["self-ordering-kiosk", 2], ["restaurant-signage", 2], ["hood-type-dish-washer", 1], ["back-bar-refrigeration", 1], ["visi-cooler", 1], ["upright-chiller-freezer", 1], ["360-degree-cassette-ac", 2], ["porcelain-and-ceramic-crockery", 1], ["ss-cutlery", 1], ["glassware", 1]],
  },
];
