import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, ArrowLeft, Lock, Mail } from 'lucide-react';
import VortixLogoWhite from '../assets/VortixLogo White_Horizontal.png';

interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (onLogin) {
        const success = await onLogin(formData.email, formData.password);
        if (success) {
          // 登入成功，導航到首頁
          navigate('/');
        } else {
          // 登入失敗，顯示錯誤信息
          console.error('Login failed');
        }
      } else {
        // 沒有登入函數，模擬登入處理
        setTimeout(() => {
          setIsLoading(false);
          console.log('Login attempt:', formData);
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <div className="relative z-10 container-global min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-[480px] mx-auto">
          
          {/* 返回按鈕 */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-white/70 hover:text-white mb-8 transition-all duration-300 hover:gap-4 group"
          >
            <ArrowLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[16px]">Back to Home</span>
          </button>

          {/* 登入表單卡片 */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 lg:p-10 shadow-2xl">
            
            {/* VortixPR Logo */}
            <div className="text-center mb-8">
              <img
                src={VortixLogoWhite}
                alt="VortixPR"
                className="h-12 mx-auto mb-6 opacity-90"
              />
              <h1 
                className="text-white text-[32px] font-medium leading-[1.2] tracking-[-0.32px] mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Welcome Back
              </h1>
              <p className="text-white/70 text-[16px]">
                Sign in to your VortixPR account
              </p>
            </div>

            {/* 登入表單 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email 輸入框 */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white text-[16px] font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail 
                    size={20} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" 
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF7400]/50 focus:bg-gray-900/70 transition-all duration-300 text-[16px]"
                    required
                  />
                </div>
              </div>

              {/* Password 輸入框 */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-white text-[16px] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock 
                    size={20} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" 
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF7400]/50 focus:bg-gray-900/70 transition-all duration-300 text-[16px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 忘記密碼 */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[#FF7400] text-[14px] hover:text-[#FF7400]/80 transition-colors duration-300"
                >
                  Forgot your password?
                </button>
              </div>

              {/* 登入按鈕 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full relative flex justify-center items-center gap-3 px-6 py-4 rounded-xl border border-[#FF7400] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(255,116,0,0.3)] text-[16px] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ 
                  background: isLoading ? '#666' : 'linear-gradient(102deg, #FF7400 0%, #1D3557 100%)' 
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* 分隔線 */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-600/30"></div>
              <span className="px-4 text-white/50 text-[14px]">or</span>
              <div className="flex-1 border-t border-gray-600/30"></div>
            </div>

            {/* 社群登入按鈕 */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-gray-600/50 text-white bg-transparent hover:bg-gray-800/30 hover:border-gray-500/50 py-4 text-[16px] font-medium rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* 註冊連結 */}
            <div className="text-center mt-8 pt-6 border-t border-gray-600/30">
              <p className="text-white/70 text-[16px]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={async () => {
                    // 模擬快速註冊並登入
                    if (onLogin) {
                      setIsLoading(true);
                      const success = await onLogin('demo@vortixstream.com', 'demo123');
                      if (success) {
                        navigate('/');
                      }
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors duration-300 font-medium disabled:opacity-50"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>

          {/* 法律聲明 */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-[14px] leading-relaxed">
              By signing in, you agree to our{' '}
              <button className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors duration-300">
                Terms of Service
              </button>
              {' '}and{' '}
              <button className="text-[#FF7400] hover:text-[#FF7400]/80 transition-colors duration-300">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}