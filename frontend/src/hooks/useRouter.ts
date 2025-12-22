import { useState } from 'react';

// 定義支援的路由類型 - 擴展新頁面時在此添加
export type Route = 'home' | 'pricing' | 'services' | 'client' | 'publisher' | 'ourclients' | 'about' | 'blog' | 'login' | 'newsletter-success' | 'concept' | string;

/**
 * 簡單的客戶端路由 Hook
 * 為多頁面應用提供狀態管理
 * 支援文章路由 (article-{id})
 * 使用方式：const { currentRoute, navigate } = useRouter();
 */
export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    
    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 可選：添加瀏覽器歷史記錄支援
    // window.history.pushState(null, '', `/${route === 'home' ? '' : route}`);
  };

  // 解析文章 ID (如果是文章路由)
  const getArticleId = (route: Route): number | null => {
    if (typeof route === 'string' && route.startsWith('article-')) {
      const id = parseInt(route.replace('article-', ''));
      return isNaN(id) ? null : id;
    }
    return null;
  };

  return {
    currentRoute,
    navigate,
    getArticleId
  };
};