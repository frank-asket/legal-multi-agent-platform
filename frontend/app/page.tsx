import { ContactCard } from "@/components/ContactCard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { InquiryConsole } from "@/components/InquiryConsole";
import { Navbar } from "@/components/Navbar";
import { ProcessSection } from "@/components/ProcessSection";
import { QuickStartStrip } from "@/components/QuickStartStrip";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProcessSection />
      <section
        className="relative bg-white py-14 sm:py-16 md:py-24"
        id="consultation"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/80 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6">
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-slate-600">
            Designed for lawyers, jurists, and international affairs officers who need readable, source-linked answers
            across contracts, MOUs, treaties, and policy drafts — without digging through menus built for engineers.
          </p>
          <QuickStartStrip />
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 lg:items-start">
            <div className="order-2 lg:order-none">
              <ContactCard />
            </div>
            <div className="order-1 lg:order-none">
              <InquiryConsole />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
