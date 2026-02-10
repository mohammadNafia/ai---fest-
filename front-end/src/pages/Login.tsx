/**
 * Login Page
 * 
 * Clean login form
 * Login with email OR phone + password
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { login as apiLogin } from '@/api/auth';
import { normalizeRole } from '@/utils/roleUtils';

// Login schema
const loginSchema = z.object({
  emailOrPhone: z.string().min(1, { message: 'Email or phone number is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
    },
  });

  const emailOrPhoneValue = watch('emailOrPhone');

  // Auto-detect if input is email or phone
  React.useEffect(() => {
    if (emailOrPhoneValue) {
      const isEmailFormat = emailOrPhoneValue.includes('@') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhoneValue);
      setIsEmail(isEmailFormat);
    } else {
      setIsEmail(null);
    }
  }, [emailOrPhoneValue]);

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await apiLogin(data.emailOrPhone, data.password);
      
      if (result.success && result.data) {
        const authData = result.data;
        const user = authData.user;
        
        // Normalize role (backend might return "Admin" but frontend expects "admin")
        const normalizedRole = normalizeRole(user.role, 'user');
        
        // Login the user
        login({
          id: user.id,
          email: user.email,
          name: user.name,
          role: normalizedRole,
          avatar: user.avatarUrl,
        }, authData.token, new Date(authData.expiresAt).getTime() - Date.now());
        
        // Navigate based on role
        if (normalizedRole === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (normalizedRole === 'staff') {
          navigate('/staff/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(result.error || (lang === 'ar' 
          ? 'بيانات الاعتماد غير صحيحة' 
          : 'Invalid credentials'));
        setIsLoading(false);
      }
    } catch (error) {
      setError(lang === 'ar' 
        ? 'حدث خطأ أثناء تسجيل الدخول' 
        : 'An error occurred during login');
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
              {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' 
                ? 'مرحباً بعودتك إلى قمة بغداد للذكاء الاصطناعي' 
                : 'Welcome back to Baghdad AI Summit'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email or Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email or Phone Number'} *
              </label>
              <div className="relative">
                {isEmail === true ? (
                  <Mail size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                ) : isEmail === false ? (
                  <Phone size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                ) : (
                  <Mail size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                )}
                <input
                  type="text"
                  {...register('emailOrPhone')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.emailOrPhone
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني أو رقم هاتفك' : 'Enter your email or phone number'}
                />
                {errors.emailOrPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.emailOrPhone.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'كلمة المرور' : 'Password'} *
              </label>
              <div className="relative">
                <Lock size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 rounded-lg border transition-colors ${
                    errors.password
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isSubmitting || isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : theme === 'light'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg'
              }`}
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'}
                </>
              ) : (
                <>
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
                  <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          {/* Link to Sign Up */}
          <div className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link
              to="/signup"
              className={`font-medium hover:underline ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}
            >
              {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
