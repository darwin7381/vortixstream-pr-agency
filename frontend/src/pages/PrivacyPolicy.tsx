import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
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
              Privacy Policy
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
                Introduction
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                VortixPR ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">vortixpr.com</a> and use our services.
              </p>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Information We Collect
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Personal Information
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Register for an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Submit a contact form or PR inquiry</li>
                <li>Download PR templates or resources</li>
                <li>Use our AI-powered PR tools (Lyro, Vortix Portal)</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                This information may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company name and industry</li>
                <li>Job title and professional information</li>
                <li>Payment and billing information (processed securely through third-party payment providers)</li>
                <li>Communications and correspondence with us</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Authentication Information
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Email address and encrypted password (for email/password authentication)</li>
                <li>Google account information (name, email, profile picture) if you use Google OAuth login</li>
                <li>Authentication tokens and session data</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Automatically Collected Information
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies (see our <Link to="/cookie-policy" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Cookie Policy</Link>)</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                How We Use Your Information
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our PR services, including global press distribution, Asia-market outreach, and founder branding</li>
                <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and provide customer support</li>
                <li><strong>Communication:</strong> To send you newsletters, updates, promotional materials, and respond to your inquiries</li>
                <li><strong>AI Features:</strong> To power our Lyro AI PR Engine and Vortix Portal features (when available)</li>
                <li><strong>Analytics:</strong> To understand how users interact with our website and improve user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
                <li><strong>Marketing:</strong> To send targeted marketing communications (with your consent)</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Third-Party Services
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We use the following third-party services that may collect and process your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Google OAuth:</strong> For authentication and login services</li>
                <li><strong>Resend:</strong> For email delivery and communications</li>
                <li><strong>Cloudflare R2:</strong> For media storage and content delivery</li>
                <li><strong>Railway/Hosting Providers:</strong> For infrastructure and data storage</li>
                <li><strong>Payment Processors:</strong> For processing subscription and service payments</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                These third parties have their own privacy policies and terms of service. We encourage you to review them.
              </p>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Data Sharing and Disclosure
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our business</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Data Security
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>JWT token-based authentication</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Your Rights
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a structured format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                To exercise these rights, please contact us at <a href="mailto:privacy@vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">privacy@vortixpr.com</a>
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                International Data Transfers
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                As a global PR agency, your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Children's Privacy
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Changes to This Privacy Policy
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Us */}
            <section className="border-t border-white/10 pt-8">
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Contact Us
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-[14px] md:text-[16px] text-white/80">
                <p><strong className="text-white">VortixPR</strong></p>
                <p>Email: <a href="mailto:privacy@vortixpr.com" className="text-[#FF7400] underline hover:text-[#FF7400]/80">privacy@vortixpr.com</a></p>
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

