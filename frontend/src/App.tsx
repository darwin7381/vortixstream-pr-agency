import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
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
import { GoogleCallback } from './pages/GoogleCallback';
import { ProtectedRoute } from './components/ProtectedRoute';
import NewsletterSuccessPage from './components/NewsletterSuccessPage';
import ConceptPage from './components/ConceptPage';
import ContactPage from './components/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminPricing from './pages/admin/AdminPricing';
import AdminPricingEdit from './pages/admin/AdminPricingEdit';
import AdminPRPackages from './pages/admin/AdminPRPackages';
import AdminPRPackagesEdit from './pages/admin/AdminPRPackagesEdit';
import AdminPRPackagesCategories from './pages/admin/AdminPRPackagesCategories';
import AdminContactList from './pages/admin/AdminContactList';
import AdminNewsletterList from './pages/admin/AdminNewsletterList';
import AdminMedia from './pages/admin/AdminMedia';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInvitations from './pages/admin/AdminInvitations';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContentFAQs from './pages/admin/AdminContentFAQs';
import AdminContentTestimonials from './pages/admin/AdminContentTestimonials';
import AdminContentServices from './pages/admin/AdminContentServices';
import AdminContentSettings from './pages/admin/AdminContentSettings';
import AdminContentWhyVortix from './pages/admin/AdminContentWhyVortix';
import AdminContentClients from './pages/admin/AdminContentClients';
import AdminContentPublisher from './pages/admin/AdminContentPublisher';
import AdminContentHero from './pages/admin/AdminContentHero';
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
  
  // 判斷是否為後台路由
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black">
      {/* 自動滾動到頂部組件 */}
      <ScrollToTop />

      {/* Global Navigation - 只在前台顯示 */}
      {!isAdminRoute && <Navigation user={user} onLogout={logout} onQuickLogin={quickLogin} />}

      {/* Main Content Area - 只在前台添加 padding-top */}
      <div className={isAdminRoute ? '' : 'pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]'}>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/newsletter-success" element={<NewsletterSuccessPage />} />
          <Route path="/material-symbols" element={<MaterialSymbolDemo />} />
          
          {/* 管理後台路由（需要管理員權限） */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute requireAdmin><AdminBlogList /></ProtectedRoute>} />
          <Route path="/admin/blog/new" element={<ProtectedRoute requireAdmin><AdminBlogEdit /></ProtectedRoute>} />
          <Route path="/admin/blog/edit/:id" element={<ProtectedRoute requireAdmin><AdminBlogEdit /></ProtectedRoute>} />
          <Route path="/admin/pricing" element={<ProtectedRoute requireAdmin><AdminPricing /></ProtectedRoute>} />
          <Route path="/admin/pricing/new" element={<ProtectedRoute requireAdmin><AdminPricingEdit /></ProtectedRoute>} />
          <Route path="/admin/pricing/edit/:id" element={<ProtectedRoute requireAdmin><AdminPricingEdit /></ProtectedRoute>} />
          <Route path="/admin/pr-packages" element={<ProtectedRoute requireAdmin><AdminPRPackages /></ProtectedRoute>} />
          <Route path="/admin/pr-packages/new" element={<ProtectedRoute requireAdmin><AdminPRPackagesEdit /></ProtectedRoute>} />
          <Route path="/admin/pr-packages/edit/:id" element={<ProtectedRoute requireAdmin><AdminPRPackagesEdit /></ProtectedRoute>} />
          <Route path="/admin/pr-packages/categories" element={<ProtectedRoute requireAdmin><AdminPRPackagesCategories /></ProtectedRoute>} />
          <Route path="/admin/contact" element={<ProtectedRoute requireAdmin><AdminContactList /></ProtectedRoute>} />
          <Route path="/admin/newsletter" element={<ProtectedRoute requireAdmin><AdminNewsletterList /></ProtectedRoute>} />
          <Route path="/admin/media" element={<ProtectedRoute requireAdmin><AdminMedia /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/invitations" element={<ProtectedRoute requireAdmin><AdminInvitations /></ProtectedRoute>} />
          <Route path="/admin/content/hero" element={<ProtectedRoute requireAdmin><AdminContentHero /></ProtectedRoute>} />
          <Route path="/admin/content/faqs" element={<ProtectedRoute requireAdmin><AdminContentFAQs /></ProtectedRoute>} />
          <Route path="/admin/content/testimonials" element={<ProtectedRoute requireAdmin><AdminContentTestimonials /></ProtectedRoute>} />
          <Route path="/admin/content/services" element={<ProtectedRoute requireAdmin><AdminContentServices /></ProtectedRoute>} />
          <Route path="/admin/content/why-vortix" element={<ProtectedRoute requireAdmin><AdminContentWhyVortix /></ProtectedRoute>} />
          <Route path="/admin/content/clients" element={<ProtectedRoute requireAdmin><AdminContentClients /></ProtectedRoute>} />
          <Route path="/admin/content/publisher" element={<ProtectedRoute requireAdmin><AdminContentPublisher /></ProtectedRoute>} />
          <Route path="/admin/content/settings" element={<ProtectedRoute requireAdmin><AdminContentSettings /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}