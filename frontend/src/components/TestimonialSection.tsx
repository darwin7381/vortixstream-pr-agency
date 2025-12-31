import { useState, useEffect } from 'react';
import { contentAPI, type Testimonial } from '../api/client';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// 生成頭像圖片 - 使用不同的 Unsplash 圖片
const avatarImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
];

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // 載入 testimonials
  useEffect(() => {
    contentAPI.getTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 桌面版每頁顯示3個卡片，手機版每頁顯示1個
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 3 : 1;
    }
    return 3; // 默認桌面版
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  // 處理響應式調整
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      // 調整當前頁面以避免超出範圍
      const newTotalPages = Math.ceil(testimonials.length / newItemsPerPage);
      if (currentPage >= newTotalPages) {
        setCurrentPage(newTotalPages - 1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage]);

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000); // 6秒自動切換

    return () => clearInterval(interval);
  }, [totalPages]);

  // 導航功能
  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  // 五星評分組件
  const FiveStars = () => (
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className="w-5 h-5 fill-[#FF7400] text-[#FF7400]" 
        />
      ))}
    </div>
  );

  // 渲染單個評價卡片
  const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => (
    <div 
      className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8"
    >
      <FiveStars />
      
      <blockquote className="text-gray-200 text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 min-h-[120px] lg:min-h-[140px]">
        "{testimonial.quote}"
      </blockquote>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-[#FF7400] to-[#E6690A] p-0.5">
            <img
              src={testimonial.author_avatar_url || avatarImages[testimonials.indexOf(testimonial)]}
              alt={testimonial.author_name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        
        <div>
          <div className="font-medium text-white text-sm lg:text-base">
            {testimonial.author_name}
          </div>
          <div className="text-gray-400 text-sm lg:text-base">
            {testimonial.author_title}{testimonial.author_company && ` at ${testimonial.author_company}`}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return null;
  }

  return (
    <section className="bg-black py-16 md:py-24 lg:py-28">
      <div className="container-global">
        <div className="max-w-7xl mx-auto">
          
          {/* 輪播容器 */}
          <div className="relative">
            
            {/* 卡片滑動容器 - 使用 overflow-hidden */}
            <div className="overflow-hidden mb-8">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {/* 根據桌面版/手機版分組渲染 */}
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div 
                    key={pageIndex}
                    className="w-full flex-shrink-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                      {testimonials
                        .slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
                        .map((testimonial, index) => (
                          <TestimonialCard
                            key={testimonials.indexOf(testimonial)}
                            testimonial={testimonial}
                            index={index}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 導航按鈕 - 桌面版 */}
            <div className="hidden md:block">
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 w-12 h-12 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/60 hover:border-[#FF7400]/30 transition-all duration-300 hover:scale-110"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 w-12 h-12 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/60 hover:border-[#FF7400]/30 transition-all duration-300 hover:scale-110"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 輪播指示器 */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-[#FF7400] shadow-[0_0_8px_rgba(255,116,0,0.6)] scale-125' 
                    : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* 手機版導航按鈕 */}
          <div className="md:hidden flex justify-center gap-4 mt-6">
            <button
              onClick={goToPrevious}
              className="w-10 h-10 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/60 hover:border-[#FF7400]/30 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToNext}
              className="w-10 h-10 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/60 hover:border-[#FF7400]/30 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}