import { useState, useEffect } from 'react';
import { authAPI, type User as APIUser, type UserRole } from '../api/client';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  is_verified?: boolean;
}

/**
 * 用戶認證狀態管理 Hook
 * 提供登入/登出/註冊功能和用戶資料管理
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化：從 localStorage 恢復登入狀態
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authAPI.getMe(token);
          console.log('=== useAuth 取得的用戶資料 ===', userData);
          console.log('avatar_url:', userData.avatar_url);
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar_url || undefined,
            role: userData.role,
            is_verified: userData.is_verified
          });
          console.log('=== 設定的 user.avatar ===', userData.avatar_url || undefined);
        } catch (error) {
          // Token 無效，清除
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * 登入
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      
      // 儲存 tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // 設定用戶狀態
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar_url || undefined,
        role: response.user.role,
        is_verified: response.user.is_verified
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '登入失敗');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * 註冊
   */
  const register = async (email: string, password: string, name: string, invitationToken?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register({ email, password, name }, invitationToken);
      
      // 儲存 tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // 設定用戶狀態
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar_url || undefined,
        role: response.user.role,
        is_verified: response.user.is_verified
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : '註冊失敗');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * 登出
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  /**
   * Google 登入
   */
  const loginWithGoogle = async () => {
    try {
      const { url } = await authAPI.getGoogleLoginUrl();
      window.location.href = url;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google 登入失敗');
    }
  };

  /**
   * 快速登入（保留用於開發/演示）
   */
  const quickLogin = async (): Promise<boolean> => {
    // 使用測試帳號登入
    return login('demo@vortixstream.com', 'demo123');
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    quickLogin
  };
};