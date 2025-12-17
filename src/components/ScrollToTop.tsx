import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 當路由改變時自動滾動到頁面頂部
 * 解決 SPA 路由跳轉後停留在原位置的問題
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 當路徑改變時，滾動到頂部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 使用 instant 而非 smooth，避免滾動動畫延遲
    });
  }, [pathname]);

  return null;
}
