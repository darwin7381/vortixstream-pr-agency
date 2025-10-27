import { useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'publisher' | 'admin';
}

/**
 * 用戶認證狀態管理 Hook
 * 提供登入/登出功能和用戶資料管理
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 模擬登入API調用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模擬登入成功，創建用戶資料
      const mockUser: User = {
        id: 'user_12345',
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'user'
      };
      
      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const quickLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 模擬快速登入，創建演示用戶
      const mockUser: User = {
        id: 'demo_user_12345',
        name: 'Alex Chen',
        email: 'demo@vortixstream.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo@vortixstream.com`,
        role: 'user'
      };
      
      setUser(mockUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    quickLogin
  };
};