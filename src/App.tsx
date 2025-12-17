import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import HeroNewSection from './components/HeroNewSection';
import StatsSection from './components/StatsSection';
import LogoCarousel from './components/LogoCarousel';
import ServicesSection from './components/ServicesSection';
import TrustedBySection from './components/TrustedBySection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialSection from './components/TestimonialSection';
import EverythingYouNeedSection from './components/EverythingYouNeedSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import PricingPage from './components/PricingPage';
import OurClientsPage from './components/OurClientsPage';
import PublisherPage from './components/PublisherPage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import BlogPage from './components/BlogPage';
import ArticlePage from './components/ArticlePage';
import MaterialSymbolDemo from './components/MaterialSymbolDemo';
import LoginPage from './components/LoginPage';
import NewsletterSuccessPage from './components/NewsletterSuccessPage';
import ConceptPage from './components/ConceptPage';
import { faqs } from './constants/faqData';

// Home Page Component
function HomePage() {
  return (
    <>
      <HeroNewSection />
      <LogoCarousel />
      <StatsSection />
      <ServicesSection />
      
      {/* Packages Preview Section - 添加 id 用於桌面版 scroll */}
      <section id="packages-section">
        <PricingPage showFooter={false} />
      </section>
      
      {/* Our Clients Section - 使用原本的 TrustedBySection，添加 id 用於桌面版 scroll */}
      <section id="clients-section">
        <TrustedBySection showTitle={true} />
      </section>
      
      {/* Publisher Preview Section - 添加 id 用於桌面版 scroll */}
      <section id="publisher-section">
        <PublisherPage showFooter={false} />
      </section>
      <FeaturesSection />
      <TestimonialSection />
      <EverythingYouNeedSection reverse={true} />
      <FAQSection 
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={true}
      />
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
          <Route path="/clients" element={<OurClientsPage />} />
          <Route path="/publisher" element={<PublisherPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:articleId" element={<ArticlePage />} />
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="/newsletter-success" element={<NewsletterSuccessPage />} />
          <Route path="/concept" element={<ConceptPage />} />
          <Route path="/material-symbols" element={<MaterialSymbolDemo />} />
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