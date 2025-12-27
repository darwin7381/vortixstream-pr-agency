import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User } from 'lucide-react';
import VortixLogoWhite from '../assets/VortixLogo White_Horizontal.png';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<{
    email: string;
    role: string;
    inviter: string;
  } | null>(null);

  // 檢查 URL 是否有邀請 token 並取得邀請資訊
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invitation');
    if (token) {
      setInvitationToken(token);
      setMode('register');
      
      // 從後端取得邀請資訊
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      fetch(`${API_BASE_URL}/auth/invitation/${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            setInvitationInfo({
              email: data.email,
              role: data.role,
              inviter: data.inviter_email || '團隊成員'
            });
            // 預先填入 email
            setFormData(prev => ({ ...prev, email: data.email }));
          }
        })
        .catch(err => console.error('Failed to load invitation:', err));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
    
    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('/');
        } else {
          setFormError(error || '登入失敗，請檢查您的 Email 和密碼');
        }
      } else {
        if (!formData.name.trim()) {
          setFormError('請輸入您的姓名');
          setIsLoading(false);
          return;
        }
        const success = await register(formData.email, formData.password, formData.name, invitationToken || undefined);
        if (success) {
          navigate('/');
        } else {
          setFormError(error || '註冊失敗，請稍後再試');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setFormError('發生錯誤，請稍後再試');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0">
        {/* 徑向漸層背景 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(255,116,0,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(29,53,87,0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(255,116,0,0.08) 0%, transparent 50%)
            `
          }}
        />
        
        {/* 浮動粒子 */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${8 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 container-global min-h-screen flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-[440px] mx-auto">
          
          {/* 邀請資訊提示（僅在有邀請時顯示） */}
          {invitationInfo && (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <p className="text-orange-400 text-sm">
                🎉 <strong>{invitationInfo.inviter}</strong> 邀請您以 
                <strong className="text-orange-300"> {
                  invitationInfo.role === 'user' ? '一般用戶' :
                  invitationInfo.role === 'publisher' ? '出版商' :
                  invitationInfo.role === 'admin' ? '管理員' : '用戶'
                } </strong>
                身份加入 VortixPR
              </p>
            </div>
          )}

          {/* 登入表單卡片 */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            
            {/* VortixPR Logo */}
            <div className="text-center mb-8">
              <img
                src={VortixLogoWhite}
                alt="VortixPR"
                className="h-10 mx-auto mb-5 opacity-90"
              />
              <h1 
                className="text-white text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {mode === 'login' ? 'Welcome Back' : 'Join VortixPR'}
              </h1>
              <p className="text-white/60 text-[15px]">
                {mode === 'login' ? 'Sign in to your VortixPR account' : 'Create your account and get started'}
              </p>
            </div>

            {/* 錯誤訊息 */}
            {formError && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-[14px]">{formError}</p>
              </div>
            )}

            {/* 登入/註冊表單 */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 姓名輸入框（僅註冊時顯示） */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90 text-[14px] font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User 
                      size={18} 
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" 
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full h-11 pl-11 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white text-[15px] placeholder:text-white/30 focus:border-[#FF7400]/50 focus:bg-gray-900/70 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email 輸入框 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 text-[14px] font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail 
                    size={18} 
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" 
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full h-11 pl-11 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white text-[15px] placeholder:text-white/30 focus:border-[#FF7400]/50 focus:bg-gray-900/70 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password 輸入框 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-[14px] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock 
                    size={18} 
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" 
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full h-11 pl-11 pr-11 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white text-[15px] placeholder:text-white/30 focus:border-[#FF7400]/50 focus:bg-gray-900/70 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {mode === 'register' && (
                  <p className="text-white/40 text-[13px] mt-1.5">At least 6 characters</p>
                )}
              </div>

              {/* 忘記密碼（僅登入時顯示） */}
              {mode === 'login' && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    className="text-[#FF7400] text-[13px] hover:text-[#FF7400]/80 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* 登入/註冊按鈕 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full relative flex justify-center items-center gap-2.5 h-11 rounded-lg border border-[#FF7400] text-white transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(255,116,0,0.25)] text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                style={{ 
                  background: isLoading ? '#666' : 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* 分隔線 */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-600/30"></div>
              <span className="px-3 text-white/40 text-[13px]">or</span>
              <div className="flex-1 border-t border-gray-600/30"></div>
            </div>

            {/* Google 登入按鈕 */}
            <Button
              type="button"
              variant="outline"
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="w-full h-11 border border-gray-600/50 text-white bg-transparent hover:bg-gray-800/30 hover:border-gray-500/50 text-[15px] font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-[18px] h-[18px] mr-2.5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            {/* 切換登入/註冊 */}
            <div className="text-center mt-6 pt-5 border-t border-gray-600/30">
              <p className="text-white/60 text-[14px]">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setFormError('');
                  }}
                  disabled={isLoading}
                  className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors duration-200 font-semibold disabled:opacity-50"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* 法律聲明 */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-[13px] leading-relaxed">
              By {mode === 'login' ? 'signing in' : 'creating an account'}, you agree to our{' '}
              <button className="text-[#FF7400]/80 hover:text-[#FF7400] transition-colors duration-200 underline">
                Terms
              </button>
              {' '}and{' '}
              <button className="text-[#FF7400]/80 hover:text-[#FF7400] transition-colors duration-200 underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}