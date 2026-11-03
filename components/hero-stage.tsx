import Link from "next/link";
import Image from "next/image";

// Centre-stage hero: a real installation photo on a lit, tilted stage, with real catalogue
// products (background removed) orbiting it under glass callouts that link to their families.
const pucks = [
  { src: "/images/cutouts/av.webp", w: 281, h: 174, label: "Displays & AV", href: "/solutions/displays-signage-led", pos: "left-[2%] top-[6%]", size: "w-[170px]", delay: "0s" },
  { src: "/images/cutouts/minibar.webp", w: 214, h: 260, label: "Minibars & amenities", href: "/solutions/hotel-hospital-amenities", pos: "left-[6%] bottom-[2%]", size: "w-[120px]", delay: "-2s" },
  { src: "/images/cutouts/cctv.webp", w: 303, h: 174, label: "CCTV & IT", href: "/solutions/it-infrastructure", pos: "right-[2%] top-[4%]", size: "w-[170px]", delay: "-4s" },
  { src: "/images/cutouts/backbar.webp", w: 361, h: 352, label: "Refrigeration", href: "/solutions/commercial-refrigeration", pos: "right-[5%] bottom-[0%]", size: "w-[150px]", delay: "-1s" },
  { src: "/images/cutouts/lock.webp", w: 142, h: 259, label: "RFID door locks", href: "/products/hotel-rfid-card-locks", pos: "left-[24%] -bottom-[4%]", size: "w-[64px]", delay: "-3s" },
  { src: "/images/cutouts/servers.webp", w: 301, h: 173, label: "Servers & laptops", href: "/products/systems-servers-and-hardware", pos: "right-[25%] -bottom-[3%]", size: "w-[140px]", delay: "-5s" },
];

export function HeroStage() {
  return (
    <div className="relative mx-auto mt-16 h-[300px] w-full max-w-[1180px] sm:h-[420px] lg:mt-20 lg:h-[560px]" aria-label="Products and installations from our catalogue">
      {/* watermark */}
      <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 select-none text-center font-display text-[18vw] font-bold leading-none tracking-tightest text-transparent [-webkit-text-stroke:1px_rgba(214,178,122,.14)] lg:-top-24 lg:text-[220px]">PALANIAPPA</p>
      {/* orbit rings */}
      <div aria-hidden="true" className="absolute left-1/2 top-[56%] h-[115%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-brass/15 [transform:translate(-50%,-50%)_rotateX(72deg)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[60%] h-[90%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-signal/20 [transform:translate(-50%,-50%)_rotateX(72deg)]" />
      {/* stage light */}
      <div aria-hidden="true" className="absolute left-1/2 top-[78%] h-40 w-[60%] -translate-x-1/2 rounded-[50%] bg-brass/25 blur-[90px]" />

      {/* centre: real installation photo */}
      <div className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 [perspective:1600px] sm:w-[62%] lg:w-[54%]">
        <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15 shadow-[0_60px_120px_-40px_rgba(0,0,0,.9),0_0_0_1px_rgba(214,178,122,.15)] [transform:rotateX(8deg)]">
          <Image src="/images/led-wall-solutions/control-room-war-room-led-wall.webp" alt="Control room LED video wall installation" fill priority sizes="(min-width:1024px) 640px, 86vw" className="animate-kenburns object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-white/5" />
          <figcaption className="absolute bottom-3 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/60 px-3 py-1.5 text-[11px] font-medium text-fg backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />Indoor LED wall · control room
          </figcaption>
        </figure>
      </div>

      {/* orbiting products (desktop/tablet) */}
      {pucks.map((p) => (
        <Link key={p.label} href={p.href} className={`group absolute hidden sm:block ${p.pos}`} style={{ animationDelay: p.delay }}>
          <span className="block animate-float" style={{ animationDelay: p.delay }}>
            <span className={`relative block ${p.size} max-w-[16vw] drop-shadow-[0_24px_30px_rgba(0,0,0,.6)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105`}>
              <Image src={p.src} alt="" width={p.w} height={p.h} sizes="180px" className="h-auto w-full" />
            </span>
            <span className="mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 text-[11.5px] font-medium text-fg backdrop-blur-md transition-colors group-hover:border-brass/60 group-hover:text-brass">
              <span className="h-px w-4 bg-brass/70" />{p.label}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
