import Hero from "@/components/sections/Hero";
import LogoStrip from "@/components/sections/LogoStrip";
import WhyVortix from "@/components/sections/WhyVortix";
import Services from "@/components/sections/Services";
import Packages from "@/components/sections/Packages";
import VortixPortal from "@/components/sections/VortixPortal";
import Lyro from "@/components/sections/Lyro";
import Trusted from "@/components/sections/Trusted";
import Publisher from "@/components/sections/Publisher";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import WorldStrip from "@/components/sections/WorldStrip";

export default function Home() {
  return (
    <>
      <main className="relative z-10">
        <Hero />
        <LogoStrip />

        {/* WorldStrip 1 — Why + Services share ONE shared painterly bg (colonnade interior) */}
        <WorldStrip src="/img/world-why-new.jpeg" alt="" overlay={0.45} priority={true}>
          <WhyVortix />
          <Services />
        </WorldStrip>

        {/* WorldStrip 2 — Packages + Platform share ONE tall painterly (arch portal) */}
        <WorldStrip src="/img/world-04-tall.jpeg" alt="" overlay={0.4} priority={true}>
          <Packages />
          <VortixPortal />
        </WorldStrip>

        <Lyro />

        {/* WorldStrip 3 — Trusted + Publisher + FAQ share ONE painterly (sunset field/monoliths) */}
        <WorldStrip src="/img/world-05-trusted.jpeg" alt="" overlay={0.55}>
          <Trusted />
          <Publisher />
          <FAQ />
        </WorldStrip>

        {/* WorldStrip 4 — Contact + FinalCTA share ONE tall painterly (monolith vista) */}
        <WorldStrip src="/img/world-07-tall.jpeg" alt="" overlay={0.5}>
          <Contact />
          <FinalCTA />
        </WorldStrip>
      </main>
      <Footer />
    </>
  );
}
