import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * StaffLogin Component
 * 
 * Staff login page with security features including:
 * - Account lockout after failed attempts
 * - Rate limiting
 * - Session management
 * 
 * @returns {JSX.Element} StaffLogin component
 */
const StaffLogin: React.FC = () => {
  const navigate = useNavigate();
  const { staffLogin } = useAuth();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(lang === 'ar' 
        ? `تم حظر المحاولة. يرجى المحاولة مرة أخرى بعد ${lockoutTime} ثانية`
        : `Account locked. Please try again in ${lockoutTime} seconds`);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await staffLogin(email, password);
      
      if (result.success) {
        setAttempts(0);
        // Navigate to staff dashboard
        navigate('/staff/dashboard', { replace: true });
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(60); // 60 seconds lockout
          setError(lang === 'ar' 
            ? 'تم حظر الحساب لمدة 60 ثانية بسبب محاولات الدخول الفاشلة المتعددة'
            : 'Account locked for 60 seconds due to multiple failed login attempts');
        } else {
          setError(lang === 'ar' 
            ? `بيانات الدخول غير صحيحة. المحاولات المتبقية: ${3 - newAttempts}`
            : `Invalid credentials. Attempts remaining: ${3 - newAttempts}`);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(lang === 'ar' 
        ? 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى'
        : 'An error occurred during login. Please try again');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50' 
        : 'bg-[#00040F]'
    }`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-[#0a0a1a] border-white/10'
      }`}>
        <div className={`p-8 md:p-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-600/20'
            }`}>
              <LogIn size={32} className={theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'} />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'دخول الموظفين' : 'Staff Login'}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' ? 'تسجيل الدخول إلى لوحة الموظفين' : 'Sign in to access staff dashboard'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={t.auth.email}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={t.auth.password}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isLocked || isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                </>
              ) : isLocked ? (
                lang === 'ar' ? `محظور (${lockoutTime}ث)` : `Locked (${lockoutTime}s)`
              ) : (
                lang === 'ar' ? 'تسجيل الدخول' : 'Sign In as Staff'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
