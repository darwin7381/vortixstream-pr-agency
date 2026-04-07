import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import CompareBar from './components/compare/CompareBar';
import { CompareProvider } from './contexts/CompareContext';
import AILayout from './layouts/AILayout';
import CryptoLayout from './layouts/CryptoLayout';
import SharedLayout from './layouts/SharedLayout';
import AIHomePage from './pages/ai/AIHomePage';
import CryptoHomePage from './pages/crypto/CryptoHomePage';
import CryptoPricingPage from './pages/crypto/CryptoPricingPage';
import CryptoPricingPageV2 from './pages/crypto/CryptoPricingPageV2';
import PackageDetailPage from './components/pricing/PackageDetailPage';
import ComparePage from './components/compare/ComparePage';
import CryptoPublisherPage from './pages/crypto/CryptoPublisherPage';
import CryptoClientsPage from './pages/crypto/CryptoClientsPage';
import CryptoAboutPage from './pages/crypto/CryptoAboutPage';
import CryptoServicesPage from './pages/crypto/CryptoServicesPage';
import BlogPage from './components/blog/BlogPage';
import ArticlePage from './components/ArticlePage';
import TemplatePage from './components/template/TemplatePage';
import MaterialSymbolDemo from './components/MaterialSymbolDemo';
import LoginPage from './components/LoginPage';
import { GoogleCallback } from './pages/GoogleCallback';
import { ProtectedRoute } from './components/ProtectedRoute';
import NewsletterSuccessPage from './components/NewsletterSuccessPage';
import ConceptPage from './components/ConceptPage';
import ServiceDeckPage from './components/ServiceDeckPage';
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
import AdminContentVortixPortal from './pages/admin/AdminContentVortixPortal';
import AdminHeroHome from './pages/admin/AdminHeroHome';
import AdminLyro from './pages/admin/AdminLyro';
import AdminContentCarousel from './pages/admin/AdminContentCarousel';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminEmailPreview from './pages/admin/AdminEmailPreview';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

// AppContent - 包含路由邏輯
function AppContent() {
  const { user, logout, quickLogin } = useAuth();
  const location = useLocation();

  // 判斷是否為後台路由
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black">
      {/* 自動滾動到頂部組件 */}
      <ScrollToTop />

      {/* Compare Bar - 只在前台顯示 */}
      {!isAdminRoute && <CompareBar />}

      <Routes>
        {/* AI site */}
        <Route element={<AILayout user={user} onLogout={logout} />}>
          <Route path="/" element={<AIHomePage />} />
          {/* (more AI routes added in Task 23) */}
        </Route>

        {/* Crypto subsite */}
        <Route element={<CryptoLayout user={user} onLogout={logout} onQuickLogin={quickLogin} />}>
          <Route path="/crypto" element={<CryptoHomePage />} />
          <Route path="/crypto/services" element={<CryptoServicesPage />} />
          <Route path="/crypto/pricing" element={<CryptoPricingPage />} />
          <Route path="/crypto/pricing-v2" element={<CryptoPricingPageV2 />} />
          <Route path="/crypto/about" element={<CryptoAboutPage />} />
          <Route path="/crypto/clients" element={<CryptoClientsPage />} />
          <Route path="/crypto/publisher" element={<CryptoPublisherPage />} />
        </Route>

        {/* Shared pages */}
        <Route element={<SharedLayout user={user} onLogout={logout} onQuickLogin={quickLogin} />}>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:articleId" element={<ArticlePage />} />
          <Route path="/packages/:slug" element={<PackageDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/newsletter-success" element={<NewsletterSuccessPage />} />
          <Route path="/material-symbols" element={<MaterialSymbolDemo />} />
          <Route path="/template" element={<TemplatePage />} />
          <Route path="/concept" element={<ConceptPage />} />
          <Route path="/service-deck" element={<ServiceDeckPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Route>

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
        <Route path="/admin/templates" element={<ProtectedRoute requireAdmin><AdminTemplates /></ProtectedRoute>} />
        <Route path="/admin/email-preview" element={<ProtectedRoute requireAdmin><AdminEmailPreview /></ProtectedRoute>} />
        <Route path="/admin/contact" element={<ProtectedRoute requireAdmin><AdminContactList /></ProtectedRoute>} />
        <Route path="/admin/newsletter" element={<ProtectedRoute requireAdmin><AdminNewsletterList /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute requireAdmin><AdminMedia /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/invitations" element={<ProtectedRoute requireAdmin><AdminInvitations /></ProtectedRoute>} />
        <Route path="/admin/content/hero" element={<ProtectedRoute requireAdmin><AdminHeroHome /></ProtectedRoute>} />
        <Route path="/admin/content/lyro" element={<ProtectedRoute requireAdmin><AdminLyro /></ProtectedRoute>} />
        <Route path="/admin/content/carousel" element={<ProtectedRoute requireAdmin><AdminContentCarousel /></ProtectedRoute>} />
        <Route path="/admin/content/faqs" element={<ProtectedRoute requireAdmin><AdminContentFAQs /></ProtectedRoute>} />
        <Route path="/admin/content/testimonials" element={<ProtectedRoute requireAdmin><AdminContentTestimonials /></ProtectedRoute>} />
        <Route path="/admin/content/services" element={<ProtectedRoute requireAdmin><AdminContentServices /></ProtectedRoute>} />
        <Route path="/admin/content/why-vortix" element={<ProtectedRoute requireAdmin><AdminContentWhyVortix /></ProtectedRoute>} />
        <Route path="/admin/content/clients" element={<ProtectedRoute requireAdmin><AdminContentClients /></ProtectedRoute>} />
        <Route path="/admin/content/publisher" element={<ProtectedRoute requireAdmin><AdminContentPublisher /></ProtectedRoute>} />
        <Route path="/admin/content/vortix-portal" element={<ProtectedRoute requireAdmin><AdminContentVortixPortal /></ProtectedRoute>} />
        <Route path="/admin/content/settings" element={<ProtectedRoute requireAdmin><AdminContentSettings /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/site" element={<ProtectedRoute requireAdmin><AdminSiteSettings /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CompareProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CompareProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
