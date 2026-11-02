import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs, Container, btn } from "@/components/ui";
import { Mail } from "@/components/icons";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work with Palaniappa Electronics in Chromepet, Chennai. Send your CV to our team.",
  alternates: { canonical: "/careers" },
};

export default function Careers() {
  const mail = `mailto:${site.contact.enquiry.email}?subject=${encodeURIComponent("Job application — website")}&body=${encodeURIComponent("Name:\nPhone:\nRole / team of interest:\nYears of experience:\n\nPlease attach your CV.")}`;
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[["Home", "/"], ["Careers", "/careers"]]} />
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">Careers</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">Palaniappa Electronics has a team of more than 50 people across distribution, institutional sales, warehousing and projects in Chromepet, Chennai.</p>
        </Container>
      </section>
      <Container className="py-14">
        <div className="max-w-2xl rounded-lg border border-line bg-white p-8">
          <h2 className="text-xl font-semibold">No openings are listed right now</h2>
          <p className="mt-3 leading-relaxed text-slate">We still welcome applications. Email your CV with the kind of role you are looking for, and we will contact you when there is a suitable opening.</p>
          <a href={mail} className={`${btn.primary} mt-6`}><Mail className="h-4 w-4" /> Email your CV</a>
          <p className="mt-3 text-sm text-slate">{site.contact.enquiry.email}</p>
        </div>
      </Container>
    </>
  );
}
