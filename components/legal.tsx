import { Breadcrumbs, Container } from "./ui";
export function Legal({ title, path, updated, children }: { title: string; path: string; updated: string; children: React.ReactNode }) {
  return (
    <Container className="py-12 md:py-16">
      <Breadcrumbs items={[["Home", "/"], [title, path]]} />
      <article className="mt-6 max-w-3xl rounded-lg border border-line bg-surface p-6 md:p-10 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="!mt-2 text-sm">Last updated {updated}</p>
        {children}
      </article>
    </Container>
  );
}
