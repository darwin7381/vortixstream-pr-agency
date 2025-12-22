export default function ContactInfo() {
  return (
    <section className="bg-black py-section-medium">
      <div className="container-global">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Global Reach */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Global Reach
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Serving clients worldwide with a focus on blockchain and AI innovation hubs across Asia, North America, and Europe.
                </p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  24/7 Support
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Our team operates around the clock to ensure your message reaches the right audience at the perfect time.
                </p>
              </div>
            </div>

            {/* Fast Response */}
            <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7400]/20 to-[#1D3557]/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Fast Response
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Get expert consultation within 24 hours and a customized proposal within 48 hours of your inquiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



