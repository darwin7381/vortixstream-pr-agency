import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
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
import BlogPage from './components/BlogPage';
import ArticlePage from './components/ArticlePage';
import MaterialSymbolDemo from './components/MaterialSymbolDemo';
import LoginPage from './components/LoginPage';
import NewsletterSuccessPage from './components/NewsletterSuccessPage';
import ConceptPage from './components/ConceptPage';
import { faqs } from './constants/faqData';
import { Route } from './hooks/useRouter';

// Home Page Component
function HomePage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LogoCarousel />
      <ServicesSection />
      <TrustedBySection showTitle={true} />
      <FeaturesSection />
      <TestimonialSection />
      <EverythingYouNeedSection reverse={true} />
      <FAQSection 
        faqs={faqs}
        variant="default"
        maxWidth="default"
        showCTA={true}
      />
      <Footer onNavigate={onNavigate} />
    </>
  );
}

// Main App Component with Global Navigation
export default function App() {
  const { currentRoute, navigate, getArticleId } = useRouter();
  const { user, login, logout, quickLogin } = useAuth();

  // 檢查是否是文章頁面
  const articleId = getArticleId(currentRoute);
  const isArticlePage = articleId !== null;

  return (
    <div className="min-h-screen bg-black">
      {/* Global Navigation - 固定在頂部，所有頁面共用 */}
      <Navigation currentRoute={currentRoute} onNavigate={navigate} user={user} onLogout={logout} onQuickLogin={quickLogin} />
      
      {/* Main Content Area - 為固定 navbar 添加 padding-top */}
      <div className="pt-14 sm:pt-16 md:pt-[72px] lg:pt-[72px]">
        {/* Route-based Page Rendering */}
        {currentRoute === 'home' && <HomePage onNavigate={navigate} />}
        {currentRoute === 'pricing' && <PricingPage />}
        {currentRoute === 'ourclients' && <OurClientsPage />}
        {currentRoute === 'publisher' && <PublisherPage />}
        {currentRoute === 'about' && <AboutPage />}
        {currentRoute === 'blog' && <BlogPage onNavigate={navigate} />}
        {currentRoute === 'login' && <LoginPage onNavigate={navigate} onLogin={login} />}
        {currentRoute === 'newsletter-success' && <NewsletterSuccessPage onNavigate={navigate} />}
        {currentRoute === 'concept' && <ConceptPage onNavigate={navigate} />}
        {currentRoute === 'material-symbols' && <MaterialSymbolDemo />}
        
        {/* 文章頁面路由 */}
        {isArticlePage && articleId && (
          <ArticlePage articleId={articleId} onNavigate={navigate} />
        )}
        
        {/* 未來可以在這裡添加更多頁面路由 */}
        {/* {currentRoute === 'services' && <ServicesPage />} */}
      </div>
    </div>
  );
}