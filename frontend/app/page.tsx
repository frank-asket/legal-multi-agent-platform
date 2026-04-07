import { ContactCard } from "@/components/ContactCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { FinalCta } from "@/components/marketing/FinalCta";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { PricingSection } from "@/components/marketing/PricingSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { ValueProps } from "@/components/marketing/ValueProps";
import { WhitepaperSection } from "@/components/marketing/WhitepaperSection";
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
      <LogoCloud />
      <FeatureShowcase />
      <ValueProps />
      <ProcessSection />
      <PricingSection />
      <FaqAccordion />
      <Testimonials />
      <section
        className="relative border-t border-slate-200 bg-white py-14 sm:py-16 md:py-24"
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
      <WhitepaperSection />
      <FinalCta />
      <Footer />
    </>
  );
}
