import type { NextConfig } from "next";

// Old URLs (live site + the 2025 static build) -> new routes. All permanent (308).
const legacy: [string, string][] = [
  ["/about-us", "/about"],
  ["/about-us/", "/about"],
  ["/contact-us", "/contact"],
  ["/public", "/"],
  ["/public/", "/"],
  ["/public/privacy-policy", "/privacy-policy"],
  ["/public/terms-conditions", "/terms-conditions"],
  ["/catalogue", "/products"],
  ["/catalog", "/products"],
  ["/samsung", "/solutions/samsung-consumer-electronics"],
  ["/solutions/hospitality-tv", "/solutions/hospitality-in-room-solutions#hospitality-tv"],
  ["/solutions/hospitality-mattress", "/solutions/hospitality-in-room-solutions#hospitality-mattress"],
  ["/solutions/hospitality-linen", "/solutions/hospitality-in-room-solutions#hospitality-linen"],
  ["/solutions/digital-signage-kiosks", "/solutions/displays-signage-led#digital-signage-kiosks"],
  ["/solutions/led-wall-solutions", "/solutions/displays-signage-led#led-wall-solutions"],
  ["/solutions/unique-display-solutions", "/solutions/displays-signage-led#unique-display-solutions"],
  ["/solutions/unique-led-displays", "/solutions/displays-signage-led#unique-led-displays"],
  ["/solutions/interactive-displays", "/solutions/interactive-displays-collaboration"],
  ["/solutions/in-room-amenities", "/solutions/hotel-hospital-amenities#in-room-amenities"],
  ["/solutions/bathroom-housekeeping-amenities", "/solutions/hotel-hospital-amenities#bathroom-housekeeping-amenities"],
  ["/solutions/lobby-banquet-restaurant-amenities", "/solutions/hotel-hospital-amenities#lobby-banquet-restaurant-amenities"],
  ["/solutions/commercial-cooling-hvac", "/solutions/commercial-air-conditioning"],
  ["/solutions/refrigeration-solutions", "/solutions/commercial-refrigeration"],
  ["/solutions/laundry-solutions", "/solutions/laundry-dishwashing#laundry-solutions"],
  ["/solutions/dishwashing-solutions", "/solutions/laundry-dishwashing#dishwashing-solutions"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;
