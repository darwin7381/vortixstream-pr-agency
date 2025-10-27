const commitmentFeatures = [
  {
    title: '30-Day Guarantee',
    description: 'Not satisfied? Get a full refund within 30 days of your first purchase.',
  },
  {
    title: 'Quality Assurance',
    description: 'Every release is reviewed by our editorial team before distribution.',
  },
  {
    title: 'Transparent Pricing',
    description: 'No hidden fees. What you see is what you pay, with clear billing.',
  }
];

export default function PricingCommitment() {
  return (
    <div className="bg-black py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-5 md:px-16">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 'medium', letterSpacing: '-0.02em' }}>
            Our Commitment to You
          </h2>
        </div>

        {/* Commitment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 md:mb-16">
          {commitmentFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Card Background */}
              <div className="relative bg-gradient-to-br from-white/5 via-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-6 md:p-8 h-full transition-all duration-500 ease-out hover:border-white/25 hover:bg-gradient-to-br hover:from-white/8 hover:via-white/12 hover:to-white/5 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:scale-[1.02] group-hover:backdrop-blur-md">
                
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative flex flex-col h-full">
                  <h4 className="text-white text-xl md:text-2xl mb-4 font-semibold tracking-[-0.02em] group-hover:text-white transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {feature.title}
                  </h4>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed flex-1 group-hover:text-white/85 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-1 h-1 bg-white/30 rounded-full group-hover:bg-[#FF7400] group-hover:shadow-[0_0_6px_rgba(255,116,0,0.6)] transition-all duration-300" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full group-hover:bg-[#1D3557] group-hover:shadow-[0_0_6px_rgba(29,53,87,0.6)] transition-all duration-300 delay-100" />
              </div>
              
              {/* Enhanced Border Left Accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-gradient-to-b from-[#FF7400] via-white to-[#1D3557] rounded-r-full opacity-60 group-hover:opacity-100 group-hover:w-1 group-hover:shadow-[0_0_12px_rgba(255,116,0,0.6)] transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Terms & Conditions Section - Match cards grid width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="md:col-span-3">
            <div className="relative bg-gradient-to-br from-white/3 via-white/5 to-white/2 backdrop-blur-sm border border-white/8 rounded-xl sm:rounded-2xl p-6 md:p-8">
              
              {/* Terms Content */}
              <div className="text-center">
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  <span className="font-semibold text-white/90">Terms & Conditions:</span> All plans are billed monthly. You can cancel anytime with 30 days notice. Unused releases don't roll over to the next month. Custom packages have different terms as agreed upon in the contract.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}