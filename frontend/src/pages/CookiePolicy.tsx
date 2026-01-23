import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function CookiePolicy() {
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
              Cookie Policy
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
                What Are Cookies?
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and improving our services.
              </p>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                This Cookie Policy explains what cookies are, how we use them, and how you can manage your cookie preferences.
              </p>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Types of Cookies We Use
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Essential Cookies (Strictly Necessary)
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Authentication:</strong> Keeping you logged in to your account</li>
                <li><strong>Security:</strong> Protecting against unauthorized access and fraud</li>
                <li><strong>Session Management:</strong> Maintaining your session as you navigate the site</li>
                <li><strong>JWT Tokens:</strong> Storing authentication tokens for secure access</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6 italic text-white/60">
                Note: Essential cookies cannot be disabled as they are critical for site functionality.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Functional Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                These cookies enable personalized features and remember your preferences:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Language preferences</li>
                <li>User interface customizations</li>
                <li>Form data to improve user experience</li>
                <li>Newsletter subscription preferences</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Analytics Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We use analytics cookies to understand how visitors interact with our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Pages visited and time spent on each page</li>
                <li>User journey and navigation patterns</li>
                <li>Device and browser information</li>
                <li>Traffic sources and referral data</li>
                <li>Performance metrics and error tracking</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6 italic text-white/60">
                This data is anonymized and helps us improve our Services.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                4. Marketing Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                These cookies track your online activity to help us deliver more relevant advertising:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Retargeting and remarketing campaigns</li>
                <li>Ad performance measurement</li>
                <li>Interest-based advertising</li>
                <li>Social media integration</li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Third-Party Cookies
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We work with trusted third-party service providers who may also set cookies on your device:
              </p>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Google Services
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Google OAuth:</strong> For secure authentication and login</li>
                <li><strong>Google Analytics:</strong> For website analytics and performance tracking</li>
                <li><strong>Google Ads:</strong> For advertising and remarketing campaigns</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Social Media Platforms
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                We integrate with social media platforms that may set their own cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter (X)</li>
                <li>LinkedIn</li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Other Third-Party Services
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Cloudflare:</strong> For CDN services and security</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Email Service Providers:</strong> For newsletter and marketing communications</li>
              </ul>
            </section>

            {/* Cookie Duration */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                How Long Do Cookies Last?
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                Session Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                These are temporary cookies that expire when you close your browser. They help maintain your session as you navigate between pages.
              </p>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                Persistent Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                These cookies remain on your device for a set period or until you delete them. Common durations include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li><strong>Authentication tokens:</strong> 7-30 days (or until logout)</li>
                <li><strong>Preference cookies:</strong> 1 year</li>
                <li><strong>Analytics cookies:</strong> 2 years</li>
                <li><strong>Marketing cookies:</strong> 90 days to 2 years</li>
              </ul>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                How to Manage Cookies
              </h2>
              
              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                1. Browser Settings
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Delete cookies after each browsing session</li>
                <li>Set exceptions for specific websites</li>
              </ul>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-6">
                Here are links to cookie management for popular browsers:
              </p>
              <ul className="list-none space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Google Chrome</a></li>
                <li>• <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Mozilla Firefox</a></li>
                <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Safari</a></li>
                <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                2. Opt-Out Tools
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                You can opt out of targeted advertising through:
              </p>
              <ul className="list-none space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>• <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Network Advertising Initiative</a></li>
                <li>• <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Digital Advertising Alliance</a></li>
                <li>• <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Google Analytics Opt-out Browser Add-on</a></li>
              </ul>

              <h3 className="text-[18px] md:text-[20px] font-semibold mb-3 text-white">
                3. Impact of Blocking Cookies
              </h3>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                Please note that blocking cookies may impact your experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[14px] md:text-[16px] text-white/80 mb-6 ml-4">
                <li>You may not be able to log in or access certain features</li>
                <li>Your preferences won't be saved</li>
                <li>Some interactive features may not work properly</li>
                <li>You may see less relevant advertising</li>
              </ul>
            </section>

            {/* Do Not Track */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Do Not Track Signals
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how to respond to these signals. We will update this policy as standards develop.
              </p>
            </section>

            {/* Updates to Policy */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Updates to This Cookie Policy
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. Please check this page periodically for updates.
              </p>
            </section>

            {/* More Information */}
            <section>
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                More Information
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                For more information about how we process your personal data, please see our <Link to="/privacy-policy" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Privacy Policy</Link>.
              </p>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80">
                For information about our services and user agreements, please see our <Link to="/terms-of-service" className="text-[#FF7400] underline hover:text-[#FF7400]/80">Terms of Service</Link>.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-white/10 pt-8">
              <h2 className="text-[24px] md:text-[32px] font-semibold mb-4 text-[#FF7400]">
                Contact Us
              </h2>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/80 mb-4">
                If you have questions about our use of cookies, please contact us:
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

