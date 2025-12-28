/**
 * API 配置 - 統一管理所有 API URL
 * 
 * 環境變數設定：frontend/.env.local
 * 
 * ⚠️ 核心改進：移除 fallback，強制要求環境變數
 * 如果沒設定 VITE_API_URL → 報錯（避免使用錯誤的 URL）
 */

// 強制要求環境變數（不提供 fallback）
if (!import.meta.env.VITE_API_URL) {
  throw new Error('❌ VITE_API_URL 環境變數未設定！請在 .env.local 中設定');
}

export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const PUBLIC_API = `${API_BASE_URL}/public`;
export const WRITE_API = `${API_BASE_URL}/write`;
export const ADMIN_API = `${API_BASE_URL}/admin`;

// 開發環境：顯示當前 API 配置
if (import.meta.env.DEV) {
  console.log('🔧 API URL:', API_BASE_URL, 
    API_BASE_URL.startsWith('https') ? '(HTTPS ✅)' : '(HTTP ⚠️)');
}

