import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MaterialSymbol } from './ui/material-symbol';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { newsletterAPI } from '../api/client';
import Footer from './Footer';
import { blogCategories, blogArticles, newsletterContent, paginationConfig } from '../constants/blogData';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

export default function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');

  // Filter articles based on active category
  const filteredArticles = useMemo(() => {
    return activeCategory === 'All Articles' 
      ? blogArticles 
      : blogArticles.filter(article => article.category === activeCategory);
  }, [activeCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / paginationConfig.articlesPerPage);
  const startIndex = (currentPage - 1) * paginationConfig.articlesPerPage;
  const endIndex = startIndex + paginationConfig.articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    const articlesSection = document.getElementById('articles-section');
    if (articlesSection) {
      const navbarHeight = window.innerWidth >= 1280 ? 72 : 64;
      const targetPosition = articlesSection.offsetTop - navbarHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await newsletterAPI.subscribe(email, 'blog-page');
        console.log('Successfully subscribed:', email);
        
        // 清空表單
        setEmail('');
        
        // 導航到成功頁面
        navigate('/newsletter-success');
        
      } catch (error) {
        console.error('Failed to subscribe:', error);
        alert('訂閱失敗，請稍後再試');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - PR Strategy Resource Center */}
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

      {/* Articles Grid Section */}
      <section id="articles-section" className="bg-black py-section-medium">
        <div className="container-global">
          <div className="max-w-[1280px] mx-auto">
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-8 lg:mb-12">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 lg:px-6 lg:py-3 rounded-full text-[12px] md:text-[14px] lg:text-[16px] font-medium transition-all duration-300 border ${
                    activeCategory === category
                      ? 'bg-[#FF7400] text-white border-[#FF7400] shadow-[0_0_15px_rgba(255,116,0,0.3)]'
                      : 'bg-transparent text-white/80 border-white/20 hover:bg-white/5 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="text-center mb-8">
              <p className="text-white/60 text-[14px] md:text-[16px]">
                {activeCategory === 'All Articles' 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredArticles.length)} of ${filteredArticles.length} articles`
                  : `${filteredArticles.length} articles in "${activeCategory}"`
                }
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12 lg:mb-16">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => navigate(`/blog/${article.id}`)}
                  className="group bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:animate-[subtle-glow_2s_ease-in-out_infinite] hover:shadow-lg hover:shadow-white/5 cursor-pointer"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF7400]/5 via-transparent to-[#1D3557]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    {/* Article Image */}
                    <div className="aspect-[4/3] bg-gray-900 relative overflow-hidden">
                      <ImageWithFallback
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#FF7400]/90 text-white text-[10px] md:text-[12px] px-3 py-1 rounded-full font-medium">
                          {article.category}
                        </span>
                      </div>
                      
                      {/* Read Time Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] md:text-[12px] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <Clock size={12} />
                          {article.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 lg:p-8 space-y-4 lg:space-y-5">
                      {/* Title */}
                      <h3 className="text-white text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-[1.3] tracking-[-0.16px] md:tracking-[-0.18px] lg:tracking-[-0.2px] group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-white/80 text-[12px] md:text-[14px] opacity-90 leading-[1.6] group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Date */}
                      <div className="flex items-center text-white/60 text-[12px] md:text-[14px]">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span>{new Date(article.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 lg:gap-6">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-[14px] md:text-[16px] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/60"
                >
                  <ChevronLeft size={16} />
                  <span>{paginationConfig.previousText}</span>
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-8 h-8 rounded-full text-[14px] font-medium transition-all duration-300 ${
                          pageNumber === currentPage
                            ? 'bg-[#FF7400] text-white shadow-[0_0_10px_rgba(255,116,0,0.3)]'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-[14px] md:text-[16px] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/60"
                >
                  <span>{paginationConfig.nextText}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* No Results Message */}
            {currentArticles.length === 0 && (
              <div className="text-center py-12">
                <MaterialSymbol name="article" size={48} className="mx-auto mb-4 text-white/20" />
                <h3 className="text-white text-[18px] md:text-[20px] font-medium mb-2">
                  No articles found
                </h3>
                <p className="text-white/60 text-[14px] md:text-[16px]">
                  Try selecting a different category or check back later for new content.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="bg-gradient-to-br from-gray-950 via-black to-gray-900 py-section-medium">
        <div className="container-global">
          <div className="max-w-[800px] mx-auto text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Particles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-[#FF7400] rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-6 lg:space-y-8">
              {/* Newsletter Title */}
              <h2 
                className="text-white text-[24px] md:text-[32px] lg:text-[40px] font-medium leading-[1.2] tracking-[-0.24px] md:tracking-[-0.32px] lg:tracking-[-0.4px]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {newsletterContent.title}
              </h2>

              {/* Newsletter Description */}
              <p className="text-white/80 text-[12px] md:text-[16px] lg:text-[18px] leading-[1.6] max-w-2xl mx-auto">
                {newsletterContent.description}
              </p>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletterContent.placeholder}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-[#FF7400] focus:ring-1 focus:ring-[#FF7400] h-12 text-[14px] md:text-[16px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#1D3557] to-[#FF7400] hover:from-[#FF7400] hover:to-[#1D3557] text-white px-8 py-3 h-12 text-[14px] md:text-[16px] font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,0,0.3)]"
                >
                  {newsletterContent.buttonText}
                </Button>
              </form>

              {/* Additional Info */}
              <p className="text-white/50 text-[10px] md:text-[12px]">
                Join 2,500+ PR professionals who trust our insights • No spam, unsubscribe anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}