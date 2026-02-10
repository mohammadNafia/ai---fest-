/**
 * Unified Sign-In Page
 * Auto-detects role from email and routes to appropriate dashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/schemas/formSchemas';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleRoute } from '@/utils/roleRoutes';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const { login, adminLogin, staffLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      // Auto-detect role from email
      // 1. Check if admin email
      const ADMIN_EMAIL = 'admin@gmail.com';
      if (data.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        const adminResult = await adminLogin(data.email, data.password);
        
        if (adminResult.success) {
          const adminSession = localStorage.getItem('adminSession');
          if (adminSession === 'true') {
            navigate(getRoleRoute('admin'), { replace: true });
            return;
          } else {
            setFormError('root', { 
              message: lang === 'ar' 
                ? 'فشل في إنشاء الجلسة. يرجى المحاولة مرة أخرى' 
                : 'Failed to create session. Please try again' 
            });
            return;
          }
        } else {
          setFormError('root', { 
            message: adminResult.error || (lang === 'ar' 
              ? 'بيانات الاعتماد غير صحيحة' 
              : 'Invalid credentials')
          });
          return;
        }
      }

      // 2. Check if staff email - try staff login
      const staffLoginResult = await staffLogin(data.email, data.password);
      if (staffLoginResult.success) {
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
          navigate(getRoleRoute('staff'), { replace: true });
          return;
        } else {
          setFormError('root', { 
            message: lang === 'ar' 
              ? 'فشل في إنشاء الجلسة. يرجى المحاولة مرة أخرى' 
              : 'Failed to create session. Please try again' 
          });
          return;
        }
      }

      // 3. Default to regular user
      login({
        email: data.email,
        name: data.email.split('@')[0],
        role: 'user',
      });

      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        navigate(getRoleRoute('user'), { replace: true });
      } else {
        setFormError('root', { 
          message: lang === 'ar' 
            ? 'فشل في إنشاء الجلسة. يرجى المحاولة مرة أخرى' 
            : 'Failed to create session. Please try again' 
        });
      }
    } catch (error) {
      setFormError('root', { 
        message: lang === 'ar' 
          ? 'حدث خطأ أثناء تسجيل الدخول' 
          : 'An error occurred during sign in' 
      });
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
              {t.auth?.signInTitle || (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' 
                ? 'مرحباً بعودتك إلى قمة بغداد للذكاء الاصطناعي' 
                : 'Welcome back to Baghdad AI Summit'}
            </p>
          </div>

          {errors.root && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'
            }`}>
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth?.email || (lang === 'ar' ? 'البريد الإلكتروني' : 'Email')}
              </label>
              <div className="relative">
                <Mail size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.email
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={t.auth?.email || 'email@example.com'}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth?.password || (lang === 'ar' ? 'كلمة المرور' : 'Password')}
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
                  placeholder={t.auth?.password || '••••••••'}
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
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : theme === 'light'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {lang === 'ar' ? 'جاري التحقق...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {t.auth?.signIn || (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                  <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          <div className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <button
              onClick={() => navigate('/register')}
              className={`font-medium transition-colors ${
                theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {t.auth?.createAccount || (lang === 'ar' ? 'إنشاء حساب' : 'Create Account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

