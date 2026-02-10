import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { authService } from '@/services/authService';
import GeneralRegistrationForm from '@/components/forms/GeneralRegistrationForm';

/**
 * AdminLogin Component - Supabase Auth Integration
 * 
 * Uses real Supabase authentication:
 * 1. Authenticates with supabase.auth.signInWithPassword()
 * 2. Fetches profile from 'users' table
 * 3. Verifies role === 'admin'
 * 4. Signs out unauthorized users
 */
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, login: contextLogin } = useAuth();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAdmin || localStorage.getItem('adminSession') === 'true') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

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
      // Use authService for real Supabase authentication
      const result = await authService.adminLogin(email, password);
      
      if (result.success && result.profile) {
        console.log('Admin login successful:', result.profile.email);
        
        // Update AuthContext with admin session
        contextLogin({
          id: result.profile.id,
          email: result.profile.email,
          name: result.profile.name,
          role: 'admin',
          avatar: result.profile.avatar_url,
        });
        
        // Set admin session in localStorage
        localStorage.setItem('adminSession', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('authToken', result.user?.id || 'admin_token');
        localStorage.setItem('sessionExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString());
        
        setAttempts(0);
        
        // Navigate to dashboard
        window.location.href = '/admin/dashboard';
      } else {
        // Failed login
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(60);
          setError(lang === 'ar' 
            ? 'تم حظر الحساب لمدة 60 ثانية بسبب محاولات الدخول الفاشلة المتعددة'
            : 'Account locked for 60 seconds due to multiple failed attempts');
        } else {
          // Show specific error
          let errorMessage = result.error || 'Invalid credentials';
          
          if (result.error === 'Unauthorized: Admin access required') {
            errorMessage = lang === 'ar'
              ? 'غير مصرح: مطلوب صلاحيات المشرف'
              : 'Unauthorized: Admin access required';
          } else if (result.error?.includes('Invalid login credentials')) {
            errorMessage = lang === 'ar'
              ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
              : 'Invalid email or password';
          }
          
          setError(lang === 'ar' 
            ? `${errorMessage}. المحاولات المتبقية: ${5 - newAttempts}`
            : `${errorMessage}. Attempts remaining: ${5 - newAttempts}`);
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
        ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' 
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
              theme === 'light' ? 'bg-blue-100' : 'bg-blue-600/20'
            }`}>
              <LogIn size={32} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.admin.login}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' ? 'تسجيل الدخول كمشرف' : 'Sign in as Administrator'}
            </p>
            {/* Admin Access Notice */}
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/10 text-blue-300'
            }`}>
              <AlertCircle size={16} className="inline mr-2" />
              {lang === 'ar' 
                ? 'المشرفون لديهم وصول كامل إلى جميع الميزات'
                : 'Administrators have full access to all features'}
            </div>
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
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg'
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
                lang === 'ar' ? 'تسجيل الدخول' : 'Sign In as Admin'
              )}
            </button>
          </form>
                    {/* Newsletter Link */}
          <div className={`mt-8 pt-6 border-t text-center ${
            theme === 'light' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {lang === 'ar' ? 'لست مشرفاً؟ هل تريد البقاء على اطلاع؟' : 'Not an admin? Want to stay updated?'}
            </p>
            <button
              type="button"
              onClick={() => setShowRegistrationModal(true)}
              className={`mt-2 text-sm font-medium transition-colors ${
                theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {lang === 'ar' ? 'سجل للنشرة الإخبارية' : 'Sign up for our newsletter'}
            </button>
          </div>
          {showRegistrationModal && (
            <GeneralRegistrationForm onClose={() => setShowRegistrationModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

