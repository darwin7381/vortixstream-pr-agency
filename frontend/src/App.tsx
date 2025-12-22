import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import { handleContactClick } from './utils/navigationHelpers';
import ScrollToTop from './components/ScrollToTop';
import HeroNewSection from './components/HeroNewSection';
import LogoCarousel from './components/LogoCarousel';
import StatsSection from './components/StatsSection';
import ServicesSection from './components/ServicesSection';
import LyroSection from './components/LyroSection';
import TrustedBySection from './components/TrustedBySection';
import TestimonialSection from './components/TestimonialSection';
import EverythingYouNeedSection from './components/EverythingYouNeedSection';
import FAQSection from './components/FAQSection';
import PricingContactForm from './components/PricingContactForm';
import Footer from './components/Footer';
import PricingCards from './components/pricing/PricingCards';
import PricingCardsV2 from './components/pricing/PricingCardsV2';
import PricingPage from './components/pricing/PricingPage';
import PricingPageV2 from './components/pricing/PricingPageV2';
import PublisherFeatures from './components/publisher/PublisherFeatures';
import PublisherPage from './components/publisher/PublisherPage';
import OurClientsPage from './components/clients/OurClientsPage';
import AboutPage from './components/about/AboutPage';
import ServicesPage from './components/ServicesPage';
import BlogPage from './components/blog/BlogPage';
import ArticlePage from './components/ArticlePage';
import TemplatePage from './components/template/TemplatePage';
import MaterialSymbolDemo from './components/MaterialSymbolDemo';
import LoginPage from './components/LoginPage';
import NewsletterSuccessPage from './components/NewsletterSuccessPage';
import ConceptPage from './components/ConceptPage';
import ContactPage from './components/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminPricing from './pages/admin/AdminPricing';
import AdminPRPackages from './pages/admin/AdminPRPackages';
import { faqs } from './constants/faqData';

// Home Page Component
function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCTAClick = () => {
    handleContactClick(navigate, location.pathname);
  };

  return (
    <>
      <HeroNewSection />
      <LogoCarousel />
      <section id="about-section">
        <StatsSection />
      </section>
      <ServicesSection onContactClick={handleCTAClick} />

      {/* Lyro AI Section */}
      <section id="lyro-section">
        <LyroSection />
      </section>

      {/* Packages Preview Section - V2 版本 */}
      <section id="packages-section">
        <PricingCardsV2 />
      </section>

      <EverythingYouNeedSection reverse={true} />

      {/* Our Clients Section */}
      <section id="clients-section">
        <TrustedBySection showTitle={true} />
      </section>

      {/* Publisher Features Preview - 只顯示特點區域 */}
      <section id="publisher-section">
        <PublisherFeatures />
      </section>

      <TestimonialSection />
      <FAQSection
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={true}
        onPrimaryAction={handleCTAClick}
        onSecondaryAction={handleCTAClick}
      />

      {/* Contact Us Section */}
      <section id="contact-section">
        <PricingContactForm />
      </section>

      <Footer />
    </>
  );
}

// AppContent - 包含路由邏輯
function AppContent() {
  const { user, login, logout, quickLogin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black">
      {/* 自動滾動到頂部組件 */}
      <ScrollToTop />

      {/* Global Navigation - 固定在頂部，所有頁面共用 */}
      <Navigation user={user} onLogout={logout} onQuickLogin={quickLogin} />

      {/* Main Content Area - 為固定 navbar 添加 padding-top */}
      <div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/pricing-v2" element={<PricingPageV2 />} />
          <Route path="/clients" element={<OurClientsPage />} />
          <Route path="/publisher" element={<PublisherPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:articleId" element={<ArticlePage />} />
          <Route path="/template" element={<TemplatePage />} />
          <Route path="/concept" element={<ConceptPage />} />
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="/newsletter-success" element={<NewsletterSuccessPage />} />
          <Route path="/material-symbols" element={<MaterialSymbolDemo />} />
          
          {/* 管理後台路由 */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blog" element={<AdminBlogList />} />
          <Route path="/admin/blog/new" element={<AdminBlogEdit />} />
          <Route path="/admin/blog/edit/:id" element={<AdminBlogEdit />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
          <Route path="/admin/pr-packages" element={<AdminPRPackages />} />
        </Routes>
      </div>
    </div>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}