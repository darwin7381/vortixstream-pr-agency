import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="container-large px-[20px] xl:px-[64px] mx-auto py-section-large">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-white text-[32px] md:text-[48px] font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-white/60 text-[14px] md:text-[16px]">
              Last Updated: January 23, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 md:space-y-12 text-white">
            
            {/* Introduction */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Agreement to Terms
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Welcome to VortixPR. These Terms of Service ("Terms") govern your access to and use of our website, services, and AI-powered PR tools (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                If you do not agree to these Terms, you may not access or use our Services. These Terms apply to all visitors, users, and others who access or use our Services.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Service Description
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                VortixPR is an AI-driven PR agency platform that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Global Press Distribution:</strong> Targeted distribution across top crypto, tech, and AI media outlets</li>
                <li><strong>Asia-Market Localization & Outreach:</strong> Specialized PR services for Chinese, Korean, Japanese, and Southeast Asian markets</li>
                <li><strong>PR & Narrative Strategy:</strong> Professional media angle development and editorial guidance</li>
                <li><strong>Founder & Personal Branding PR:</strong> Building founder authority through articles and interviews</li>
                <li><strong>Lyro AI PR Engine:</strong> AI-powered narrative optimization and media insights (coming soon)</li>
                <li><strong>Vortix Portal:</strong> Comprehensive PR campaign management workspace (coming soon)</li>
                <li><strong>PR Templates and Resources:</strong> Professional templates for press releases and media materials</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Account Registration and Security
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Account Creation
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Account Eligibility
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                You must be at least 18 years old and capable of forming a binding contract to use our Services. By creating an account, you represent and warrant that you meet these requirements.
              </p>
            </section>

            {/* Service Terms */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Use of Services
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Acceptable Use
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                You agree to use our Services only for lawful purposes. You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute spam, malware, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our Services for fraudulent or deceptive purposes</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Distribute false or misleading information through our PR services</li>
                <li>Reverse engineer or attempt to extract source code from our Services</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Content Guidelines
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                When using our PR distribution services, you agree that your content:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Is factually accurate and not misleading</li>
                <li>Does not violate securities laws or regulations</li>
                <li>Does not infringe on intellectual property rights</li>
                <li>Complies with media outlet editorial standards</li>
                <li>Does not contain hate speech, harassment, or discriminatory content</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Payment and Billing
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Pricing
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                Our PR packages and services are offered at the prices displayed on our website. We reserve the right to modify pricing at any time, but changes will not affect orders already placed.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Payment Terms
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Payment is required before service delivery unless otherwise agreed</li>
                <li>All prices are in USD unless otherwise stated</li>
                <li>You authorize us to charge your payment method for all fees incurred</li>
                <li>Failure to pay may result in service suspension or termination</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Refunds and Cancellations
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Due to the nature of PR services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Services are generally non-refundable once work has commenced</li>
                <li>Cancellations must be requested before distribution begins</li>
                <li>Refund decisions are made on a case-by-case basis</li>
                <li>We do not guarantee specific publication outcomes</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Intellectual Property Rights
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Our Content
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                The Services and all content, features, and functionality are owned by VortixPR and are protected by copyright, trademark, and other intellectual property laws. Our AI tools, including Lyro and Vortix Portal, are proprietary technology.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Your Content
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                You retain ownership of content you submit to us. By using our Services, you grant us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>A license to use, edit, and distribute your content as necessary to provide our Services</li>
                <li>The right to make minor editorial adjustments for clarity and compliance</li>
                <li>Permission to feature your company logo and success story in our portfolio (unless you opt out)</li>
              </ul>
            </section>

            {/* Service Guarantees */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Service Guarantees and Limitations
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Publication Guarantees
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                For packages with guaranteed publications, we commit to distributing your content to the specified number of media outlets. However, we cannot guarantee specific editorial placement, article length, or timing beyond our stated service levels.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. AI Features Disclaimer
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                Our AI tools (Lyro, Vortix Portal) provide suggestions and insights based on algorithms and data analysis. These are recommendations only and should not be considered professional advice. Final editorial decisions remain with you and our human PR experts.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Third-Party Media
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                We work with independent media outlets. Editorial decisions, publication timing, and content modifications are ultimately at the discretion of each media outlet. We are not responsible for editorial changes or decisions made by third-party publishers.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Disclaimers and Limitation of Liability
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Service Availability
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                We strive for 99.9% uptime but do not guarantee uninterrupted service. Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Limitation of Liability
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                To the maximum extent permitted by law, VortixPR shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our Services. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Termination
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We reserve the right to suspend or terminate your account and access to Services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>For violation of these Terms</li>
                <li>For fraudulent or illegal activity</li>
                <li>For non-payment of fees</li>
                <li>At our discretion, with or without notice</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                Upon termination, your right to use the Services will immediately cease. Termination does not relieve you of any payment obligations for services already rendered.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Governing Law and Disputes
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                These Terms shall be governed by and construed in accordance with applicable international laws for digital services. Any disputes shall be resolved through:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Good faith negotiation</li>
                <li>Mediation (if negotiation fails)</li>
                <li>Binding arbitration or appropriate legal jurisdiction</li>
              </ol>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Changes to These Terms
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through our website. Your continued use of Services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t border-white/10 pt-8">
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Contact Us
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-[14px] md:text-[16px] text-white/80">
                <p><strong className="text-white">VortixPR</strong></p>
                <p>Email: <a href="mailto:legal@vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">legal@vortixpr.com</a></p>
                <p>General Inquiries: <a href="mailto:hello@vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">hello@vortixpr.com</a></p>
                <p>Website: <a href="https://vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">vortixpr.com</a></p>
              </div>
            </section>

            {/* Back to Home */}
            <div className="pt-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-[#FF7400] hover:text-[#FF7400]/80 transition-colors text-[14px] md:text-[16px] font-semibold"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

