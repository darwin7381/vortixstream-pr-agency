import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogCategories } from '../constants/blogData';
import { MaterialSymbol } from './ui/material-symbol';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import { ArrowLeft, Calendar, Clock, User, Search, Tag } from 'lucide-react';
import { blogAPI, type BlogPost } from '../api/client';

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 從 API 獲取文章
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      setLoading(true);
      setError(false);
      
      try {
        // 取得當前文章
        const articleData = await blogAPI.getPost(articleId);
        setArticle(articleData);
        
        // 取得相關文章（同分類）
        const relatedResponse = await blogAPI.getPosts({
          category: articleData.category,
          page_size: 4
        });
        // 排除當前文章
        const related = relatedResponse.posts.filter(p => p.slug !== articleId).slice(0, 3);
        setRelatedArticles(related);
        
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7400] mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Article Not Found</h1>
          <button 
            onClick={() => navigate('/blog')}
            className="text-[#FF7400] hover:text-white transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // 獲取熱門文章（目前使用相關文章）
  const popularArticles = relatedArticles;

  // 渲染 Markdown 格式的內容（簡單版）
  const renderMarkdownContent = () => {
    if (!article.content) return null;
    
    return (
      <div className="prose prose-invert max-w-none">
        <div 
          className="text-white/80 text-[16px] lg:text-[18px] leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 主要內容區域 */}
      <div className="container-global py-section-medium">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Back to Blog 按鈕 */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-[14px] lg:text-[16px]">Back to Blog</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* 左側邊欄 */}
            <div className="lg:w-80 order-2 lg:order-1">
              
              {/* Search Articles */}
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-white text-[18px] font-medium mb-4">Search Articles</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF7400] transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-white text-[18px] font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {blogCategories.filter(cat => cat !== 'All Articles').map((category) => (
                    <button
                      key={category}
                      onClick={() => navigate('/blog')}
                      className={`block w-full text-left px-3 py-2 text-[14px] rounded-lg transition-colors duration-300 ${
                        category === article.category
                          ? 'bg-[#FF7400] text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Articles */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white text-[18px] font-medium mb-4">Popular Articles</h3>
                <div className="space-y-4">
                  {popularArticles.map((popularArticle) => (
                    <button
                      key={popularArticle.id}
                      onClick={() => navigate(`/blog/${popularArticle.slug}`)}
                      className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300 text-left"
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={popularArticle.image_url || ''}
                          alt={popularArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[14px] font-medium line-clamp-2 mb-1">
                          {popularArticle.title}
                        </h4>
                        <p className="text-white/40 text-[12px]">
                          {new Date(popularArticle.published_at || popularArticle.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 主要內容區 */}
            <div className="flex-1 order-1 lg:order-2">
              
              {/* 文章標題區域 */}
              <div className="mb-8 lg:mb-12">
                
                {/* 分類標籤 */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-[#FF7400] text-white text-[12px] lg:text-[14px] font-medium rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* 文章標題 */}
                <h1 className="text-white text-[32px] lg:text-[48px] xl:text-[56px] font-medium leading-tight mb-6">
                  {article.title}
                </h1>

                {/* 文章描述 */}
                <p className="text-white/70 text-[16px] lg:text-[18px] leading-relaxed mb-8">
                  {article.excerpt}
                </p>

                {/* 文章元信息 */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-white/60 text-[14px] lg:text-[16px]">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{article.read_time} min read</span>
                  </div>
                </div>
              </div>

              {/* 封面圖片 */}
              {article.image_url && (
                <div className="aspect-[16/9] bg-gray-900 rounded-xl overflow-hidden mb-8 lg:mb-12">
                  <ImageWithFallback
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 文章內容 */}
              <div className="prose prose-invert max-w-none">
                {renderMarkdownContent()}
              </div>

              {/* 相關文章 */}
              {relatedArticles.length > 0 && (
                <div className="mt-16 pt-8 border-t border-white/10">
                  <h3 className="text-white text-[24px] lg:text-[28px] font-medium mb-8">
                    Related Articles
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {relatedArticles.map((relatedArticle) => (
                      <button
                        key={relatedArticle.id}
                        onClick={() => navigate(`/blog/${relatedArticle.slug}`)}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left"
                      >
                        <div className="aspect-[16/9] bg-gray-900">
                          <ImageWithFallback
                            src={relatedArticle.image_url || ''}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <span className="text-[#FF7400] text-[12px] font-medium">
                              {relatedArticle.category}
                            </span>
                          </div>
                          <h4 className="text-white text-[16px] font-medium line-clamp-2 mb-2">
                            {relatedArticle.title}
                          </h4>
                          <div className="flex items-center gap-3 text-white/60 text-[12px]">
                            <span>{new Date(relatedArticle.published_at || relatedArticle.created_at).toLocaleDateString()}</span>
                            <span>{relatedArticle.read_time} min read</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}