import Image from "next/image";
// Original artwork on light backgrounds, reversed artwork on dark (CSS decides which shows).
export function Logo({ className = "h-9 w-auto", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image src="/images/brand/palaniappa-logo-reversed.png" alt="Palaniappa Electronics" width={720} height={237} priority={priority} className={`logo-dark ${className}`} />
      <Image src="/images/brand/palaniappa-logo.png" alt="Palaniappa Electronics" width={720} height={236} priority={priority} className={`logo-light ${className}`} />
    </>
  );
}
