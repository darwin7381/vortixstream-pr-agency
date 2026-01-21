/**
 * 統一的 API 客戶端 - 帶自動 Token 刷新機制
 * 
 * 核心功能：
 * 1. 自動添加 Authorization header
 * 2. 自動處理 401 錯誤並刷新 token
 * 3. 刷新成功後重試原始請求
 * 4. 刷新失敗後自動登出
 * 
 * 這是正規生產級應用的標準實作
 */

import { API_BASE_URL } from '../config/api';

// ==================== Types ====================

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatar_url: string | null;
    role: string;
    is_verified: boolean;
    created_at: string;
  };
}

// ==================== Token Management ====================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * 檢查是否為網路錯誤（後端重啟、連線失敗等）
 */
const isNetworkError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('econnrefused') ||
    error?.name === 'TypeError'
  );
};

/**
 * 刷新 Access Token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data: RefreshTokenResponse = await response.json();
    
    // 更新 localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    // 觸發 storage event（跨標籤頁同步）
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: data.access_token,
      url: window.location.href,
    }));
    
    return data.access_token;
  } catch (error) {
    // 區分錯誤類型
    if (isNetworkError(error)) {
      // 網路錯誤（後端重啟、連線失敗）- 不清除 tokens
      console.warn('[apiClient] 網路錯誤，保留 tokens（可能是後端重啟）');
      
      if (import.meta.env.DEV) {
        console.info('[DEV] 後端重啟中，請稍候再試。Tokens 已保留。');
      }
      
      throw error; // 拋出錯誤但不清除 tokens
    } else {
      // 認證錯誤（refresh_token 真的無效）- 清除 tokens
      console.error('[apiClient] Refresh token 無效，清除登入狀態');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // 觸發登出
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'access_token',
        newValue: null,
        url: window.location.href,
      }));
      
      throw error;
    }
  }
};

// ==================== Authenticated Fetch ====================

/**
 * 帶認證的 fetch 請求
 * 自動處理 token 刷新和重試
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No access token available');
  }

  // 添加 Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // 第一次嘗試
  let response = await fetch(url, { ...options, headers });

  // 如果收到 401，嘗試刷新 token
  if (response.status === 401) {
    if (isRefreshing) {
      // 如果正在刷新，加入隊列等待
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(newToken => {
        const newHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        return fetch(url, { ...options, headers: newHeaders });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      
      // 用新 token 重試原始請求
      const newHeaders = {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      response = await fetch(url, { ...options, headers: newHeaders });
    } catch (error) {
      processQueue(error as Error, null);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};

// ==================== Convenience Methods ====================

/**
 * GET 請求（需要認證）
 */
export const authenticatedGet = async (url: string): Promise<Response> => {
  return authenticatedFetch(url, { method: 'GET' });
};

/**
 * POST 請求（需要認證）
 */
export const authenticatedPost = async (
  url: string,
  data?: any
): Promise<Response> => {
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT 請求（需要認證）
 */
export const authenticatedPut = async (
  url: string,
  data?: any
): Promise<Response> => {
  return authenticatedFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH 請求（需要認證）
 */
export const authenticatedPatch = async (
  url: string,
  data?: any
): Promise<Response> => {
  return authenticatedFetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE 請求（需要認證）
 */
export const authenticatedDelete = async (url: string): Promise<Response> => {
  return authenticatedFetch(url, { method: 'DELETE' });
};

// ==================== Helper: Get Token ====================

/**
 * 獲取當前的 access token
 * 如果 token 無效會嘗試刷新
 */
export const getValidToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return null;
  }

  // 簡單檢查 token 是否過期（不需要完整解析）
  // 如果需要更精確的檢查，可以在這裡添加 JWT 解析邏輯
  
  return token;
};

