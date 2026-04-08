import TrustedBySection from '../../components/crypto/TrustedBySection';
import { aiTrustedByClients } from '../../constants/ai/aiTrustedByData';

export default function AIClientsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse" />
              <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                OUR CLIENTS
              </span>
            </div>
            <h1 className="text-[40px] md:text-[56px] font-medium text-white font-heading tracking-[-0.4px] md:tracking-[-0.56px] mb-6">
              Trusted by AI-native companies
            </h1>
            <p className="text-[14px] md:text-[18px] text-white/70 max-w-[600px] leading-relaxed">
              From early-stage model labs to publicly traded AI infrastructure companies, VortixPR has managed communications for the companies shaping the future of AI.
            </p>
          </div>
        </div>
      </section>

      {/* Client Logos Grid */}
      <TrustedBySection
        showTitle={false}
        dataOverride={aiTrustedByClients as any[]}
      />

      {/* CTA */}
      <section className="bg-black py-section-large">
        <div className="container-global">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-white text-[32px] md:text-[40px] font-medium mb-4 font-heading tracking-[-0.32px]">
              Ready to join them?
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] mb-8">
              Let's talk about what a VortixPR campaign could do for your AI startup.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-[20px] rounded-md border border-[#FF7400] text-white text-[14px] md:text-[16px] font-medium cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' }}
            >
              Start an AI Launch →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
