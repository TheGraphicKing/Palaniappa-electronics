import Link from "next/link";
import { Container, btn } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold text-cobalt">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-slate">The page may have moved when we rebuilt the website. Search the catalogue or start from the home page.</p>
      <div className="mt-8 flex justify-center gap-3"><Link href="/products" className={btn.primary}>Search products</Link><Link href="/" className={btn.secondary}>Home</Link></div>
    </Container>
  );
}
