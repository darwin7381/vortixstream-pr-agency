export default function BlogHero() {
  return (
    <section className="bg-black py-section-large">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Radial Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7400]/10 via-transparent to-[#1D3557]/5" />
            
            {/* Floating Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${2.5 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 space-y-6 lg:space-y-8">
            {/* Main Title */}
            <div>
              <h1 
                className="text-white text-[32px] md:text-[52px] lg:text-[72px] font-medium leading-[1.2] tracking-[-0.32px] md:tracking-[-0.52px] lg:tracking-[-0.72px]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                PR Strategy Resource Center
              </h1>
            </div>

            {/* Description */}
            <div>
              <p className="text-white/90 text-[12px] md:text-[18px] max-w-4xl mx-auto leading-[1.6]">
                In-depth analysis of PR strategies for crypto and AI industries,<br />
                providing practical PR techniques and marketing insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


