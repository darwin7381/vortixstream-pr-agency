import StatsSection from '../../components/crypto/StatsSection';
import { aiWhyVortixData } from '../../constants/ai/aiWhyVortixData';

export default function AIAboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* About Hero */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              {/* Content */}
              <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse" />
                  <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                    ABOUT VORTIXPR
                  </span>
                </div>
                <h1
                  className="text-white text-[32px] md:text-[52px] font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  The PR agency that speaks fluent AI
                </h1>
                <p className="text-white text-[14px] md:text-[18px] opacity-90 max-w-[560px]">
                  VortixPR was founded by a team of former ML engineers, science journalists, and startup operators who were frustrated by PR agencies that didn't understand the technology they were pitching. We built the agency we wish had existed when we were launching our own AI products.
                </p>
                <p className="text-white text-[14px] md:text-[16px] opacity-70 max-w-[560px]">
                  Today we serve AI-native companies at every stage — from solo founders preparing their first Product Hunt launch to Series B companies managing complex, multi-market announcement strategies. Our edge is technical depth combined with genuine relationships with the reporters who cover AI for a living.
                </p>
                <a
                  href="#contact-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('contact-section');
                    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-8 py-[20px] rounded-md border border-[#FF7400] text-white text-[14px] md:text-[16px] font-medium cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
                >
                  Work with us
                </a>
              </div>

              {/* Visual */}
              <div className="flex-1">
                <div className="aspect-[600/400] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4 px-8">
                    <div className="text-[48px]">⚡</div>
                    <p className="text-white/40 text-[14px]">Fast, technical, trusted</p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[
                        { n: '500+', l: 'AI Launches' },
                        { n: '200+', l: 'Media Partners' },
                        { n: '4.9★', l: 'Avg Rating' },
                      ].map((s) => (
                        <div key={s.n} className="text-center">
                          <div className="text-white font-bold text-[20px]">{s.n}</div>
                          <div className="text-white/40 text-[11px]">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Differentiators */}
      <section id="about-section">
        <StatsSection dataOverride={aiWhyVortixData} />
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-xl">
            <h2 className="text-white text-[32px] md:text-[40px] font-medium mb-4 font-heading tracking-[-0.32px]">
              Get in touch
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] mb-8">
              Ready to launch? Fill out the form below and we'll respond within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-[20px] rounded-md border border-[#FF7400] text-white text-[14px] md:text-[16px] font-medium cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
