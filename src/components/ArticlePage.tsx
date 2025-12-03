import { useState } from 'react';
import { blogCategories, blogArticles } from '../constants/blogData';
import { articlesContent, getArticleContent } from '../constants/articleContent';
import { MaterialSymbol } from './ui/material-symbol';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import { ArrowLeft, Calendar, Clock, User, Search, Tag } from 'lucide-react';

interface ArticlePageProps {
  articleId: number;
  onNavigate: (route: string) => void;
}

export default function ArticlePage({ articleId, onNavigate }: ArticlePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 獲取當前文章數據
  const article = blogArticles.find(a => a.id === articleId);
  const articleContent = getArticleContent(articleId);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Article Not Found</h1>
          <button 
            onClick={() => onNavigate('blog')}
            className="text-[#FF7400] hover:text-white transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // 獲取熱門文章（前3篇，排除當前文章）
  const popularArticles = blogArticles
    .filter(a => a.id !== articleId)
    .slice(0, 3);

  // 獲取相關文章
  const relatedArticles = articleContent.relatedArticles
    ? blogArticles.filter(a => articleContent.relatedArticles.includes(a.id))
    : blogArticles.filter(a => a.category === article.category && a.id !== articleId).slice(0, 3);

  // 渲染文章內容
  const renderContent = (contentItem: any, index: number) => {
    switch (contentItem.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-white/80 text-[16px] leading-relaxed mb-6">
            {contentItem.text}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${contentItem.level}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-[32px] lg:text-[40px] font-medium text-white mb-8 mt-12',
          2: 'text-[24px] lg:text-[28px] font-medium text-white mb-6 mt-10',
          3: 'text-[20px] lg:text-[22px] font-medium text-white mb-4 mt-8'
        };
        return (
          <HeadingTag key={index} className={headingClasses[contentItem.level as keyof typeof headingClasses]}>
            {contentItem.text}
          </HeadingTag>
        );
      
      case 'image':
        return (
          <div key={index} className="my-8 lg:my-12">
            <div className="aspect-[16/9] bg-gray-900 rounded-xl overflow-hidden mb-4">
              <ImageWithFallback
                src={contentItem.src}
                alt={contentItem.alt}
                className="w-full h-full object-cover"
              />
            </div>
            {contentItem.caption && (
              <p className="text-white/60 text-[14px] italic text-center">
                {contentItem.caption}
              </p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 主要內容區域 */}
      <div className="container-global py-section-medium">
        <div className="max-w-[1280px] mx-auto">
          
          {/* Back to Blog 按鈕 */}
          <div className="mb-8">
            <button 
              onClick={() => onNavigate('blog')}
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
                      onClick={() => onNavigate('blog')}
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
                      onClick={() => onNavigate(`article-${popularArticle.id}`)}
                      className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300 text-left"
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={popularArticle.image}
                          alt={popularArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[14px] font-medium line-clamp-2 mb-1">
                          {popularArticle.title}
                        </h4>
                        <p className="text-white/40 text-[12px]">
                          {popularArticle.date}
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
                    <span>{articleContent.author || 'VortixPR Team'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* 封面圖片 */}
              <div className="aspect-[16/9] bg-gray-900 rounded-xl overflow-hidden mb-8 lg:mb-12">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 文章內容 */}
              <div className="prose prose-invert max-w-none">
                <div className="text-white/80 text-[16px] lg:text-[18px] leading-relaxed">
                  {articleContent.content?.map((item, index) => renderContent(item, index))}
                </div>
              </div>

              {/* 文章標籤 */}
              {articleContent.tags && articleContent.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={16} className="text-white/60" />
                    <span className="text-white/60 text-[14px]">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {articleContent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 border border-white/20 text-white/70 text-[12px] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                        onClick={() => onNavigate(`article-${relatedArticle.id}`)}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left"
                      >
                        <div className="aspect-[16/9] bg-gray-900">
                          <ImageWithFallback
                            src={relatedArticle.image}
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
                            <span>{relatedArticle.date}</span>
                            <span>{relatedArticle.readTime}</span>
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