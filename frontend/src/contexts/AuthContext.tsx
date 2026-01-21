import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback
} from 'react';
import { authAPI, type User as APIUser, type UserRole } from '../api/client';

// ==================== Types ====================

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  is_verified?: boolean;
}

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, invitationToken?: string) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  quickLogin: () => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

// ==================== Context Creation ====================

const AuthContext = createContext<AuthContextType | null>(null);

// ==================== Provider Component ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==================== Helper: Convert API User to Local User ====================
  
  const convertUser = useCallback((apiUser: APIUser): User => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    avatar: apiUser.avatar_url || undefined,
    role: apiUser.role,
    is_verified: apiUser.is_verified
  }), []);

  // ==================== Helper: Error Type Detection ====================
  
  const isNetworkError = (error: any): boolean => {
    // 檢查是否為網路錯誤（後端重啟、連線失敗等）
    const errorMessage = error?.message?.toLowerCase() || '';
    return (
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('econnrefused') ||
      error?.name === 'TypeError' // fetch 失敗通常是 TypeError
    );
  };

  // ==================== Initialization: Restore from localStorage ====================
  
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getMe();
        console.log('[AuthContext] 初始化成功，用戶資料:', userData);
        setUser(convertUser(userData));
      } catch (error) {
        console.error('[AuthContext] 初始化失敗:', error);
        
        // 區分錯誤類型
        if (isNetworkError(error)) {
          // 網路錯誤（後端重啟、連線失敗）- 保留 tokens
          console.warn('[AuthContext] 網路錯誤，保留登入狀態（等待後端恢復）');
          setUser(null); // 暫時清除 user，但保留 tokens
          
          // 開發環境：提示用戶
          if (import.meta.env.DEV) {
            console.info('[DEV] 後端可能正在重啟，tokens 已保留，刷新頁面即可恢復');
          }
        } else {
          // 認證錯誤（token 真的無效）- 清除 tokens
          console.error('[AuthContext] Token 無效，清除登入狀態');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // 移除 convertUser 依賴，只在 mount 時執行一次

  // ==================== Cross-Tab Sync: Listen to localStorage changes ====================
  
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      // 只處理 access_token 的變化
      if (e.key !== 'access_token') return;

      console.log('[AuthContext] 偵測到 localStorage 變化:', e.key, e.newValue ? '有值' : '無值');

      if (e.newValue === null) {
        // Token 被移除（登出）
        console.log('[AuthContext] 跨標籤頁登出');
        setUser(null);
      } else {
        // Token 被更新（登入）
        console.log('[AuthContext] 跨標籤頁登入，重新載入用戶資料');
        try {
          const userData = await authAPI.getMe();
          setUser(convertUser(userData));
        } catch (error) {
          console.error('[AuthContext] 跨標籤頁同步失敗:', error);
          // 同步失敗不清除 tokens（可能只是暫時的網路問題）
          setUser(null);
        }
      }
    };

    // 監聽 storage event（跨標籤頁）
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // 移除 convertUser 依賴

  // ==================== BroadcastChannel: For same-tab sync (optional enhancement) ====================
  
  useEffect(() => {
    // 使用 BroadcastChannel 進行同標籤頁內的即時同步
    if (typeof BroadcastChannel === 'undefined') {
      // 舊瀏覽器不支援，跳過
      return;
    }

    const channel = new BroadcastChannel('auth-sync');

    channel.onmessage = async (event) => {
      const { type, user: newUser } = event.data;
      
      console.log('[AuthContext] 收到廣播訊息:', type);

      if (type === 'LOGIN' || type === 'UPDATE') {
        setUser(newUser);
      } else if (type === 'LOGOUT') {
        setUser(null);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // ==================== Broadcast Helper ====================
  
  const broadcastAuthChange = useCallback((type: 'LOGIN' | 'LOGOUT' | 'UPDATE', newUser?: User | null) => {
    if (typeof BroadcastChannel === 'undefined') return;
    
    const channel = new BroadcastChannel('auth-sync');
    channel.postMessage({ type, user: newUser });
    channel.close();
  }, []);

  // ==================== Login ====================
  
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ email, password });
      
      console.log('[AuthContext] 登入成功:', response.user);
      
      // 儲存 tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // 更新狀態
      const newUser = convertUser(response.user);
      setUser(newUser);
      
      // 廣播變化（同標籤頁內的其他組件）
      broadcastAuthChange('LOGIN', newUser);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登入失敗';
      console.error('[AuthContext] 登入失敗:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [convertUser, broadcastAuthChange]);

  // ==================== Register ====================
  
  const register = useCallback(async (
    email: string, 
    password: string, 
    name: string,
    invitationToken?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({ email, password, name }, invitationToken);
      
      console.log('[AuthContext] 註冊成功:', response.user);
      
      // 儲存 tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // 更新狀態
      const newUser = convertUser(response.user);
      setUser(newUser);
      
      // 廣播變化
      broadcastAuthChange('LOGIN', newUser);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '註冊失敗';
      console.error('[AuthContext] 註冊失敗:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [convertUser, broadcastAuthChange]);

  // ==================== Logout ====================
  
  const logout = useCallback(() => {
    console.log('[AuthContext] 執行登出');
    
    // 清除 tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // 清除狀態
    setUser(null);
    setError(null);
    
    // 廣播變化
    broadcastAuthChange('LOGOUT');
  }, [broadcastAuthChange]);

  // ==================== Google Login ====================
  
  const loginWithGoogle = useCallback(async () => {
    try {
      const { url } = await authAPI.getGoogleLoginUrl();
      window.location.href = url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google 登入失敗';
      console.error('[AuthContext] Google 登入失敗:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  // ==================== Quick Login (Demo) ====================
  
  const quickLogin = useCallback(async (): Promise<boolean> => {
    return login('demo@vortixstream.com', 'demo123');
  }, [login]);

  // ==================== Refresh Auth ====================
  
  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.log('[AuthContext] 無 token，清除用戶狀態');
      setUser(null);
      return;
    }

    try {
      console.log('[AuthContext] 刷新認證狀態');
      const userData = await authAPI.getMe();
      const newUser = convertUser(userData);
      setUser(newUser);
      
      // 廣播變化
      broadcastAuthChange('UPDATE', newUser);
    } catch (error) {
      console.error('[AuthContext] 刷新認證失敗:', error);
      
      // 區分錯誤類型
      if (isNetworkError(error)) {
        // 網路錯誤：保留 tokens，只清除 user
        console.warn('[AuthContext] 網路錯誤，保留登入狀態');
        setUser(null);
      } else {
        // 認證錯誤：真的需要登出
        console.error('[AuthContext] Token 無效，執行登出');
        logout();
      }
    }
  }, [convertUser, broadcastAuthChange, logout]);

  // ==================== Clear Error ====================
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==================== Computed Values ====================
  
  const isAuthenticated = !!user;

  // ==================== Context Value ====================
  
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    quickLogin,
    refreshAuth,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ==================== Hook ====================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用');
  }
  
  return context;
}

