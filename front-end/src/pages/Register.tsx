import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/schemas/formSchemas';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { RegisterFormData } from '@/schemas/formSchemas';

/**
 * Register Component
 * 
 * User registration page with form validation using react-hook-form and Zod.
 * 
 * @returns {JSX.Element} Register component
 */
const Register: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/signin');
    } catch (error) {
      console.error('Registration error:', error);
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
              <UserPlus size={32} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.auth.createAccountTitle}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' ? 'انضم إلى قمة بغداد للذكاء الاصطناعي' : 'Join the Baghdad AI Summit'}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            className={`w-full py-3 rounded-lg border flex items-center justify-center gap-2 mb-6 transition-colors ${
              theme === 'light'
                ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t.auth.continueWithGoogle}</span>
          </button>

          <div className={`flex items-center gap-4 mb-6 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex-1 h-px bg-gray-300 dark:bg-white/10"></div>
            <span className="text-sm">{lang === 'ar' ? 'أو' : 'or'}</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth.name}
              </label>
              <div className="relative">
                <User size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.name
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={t.auth.name}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder={t.auth.email}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
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
                  placeholder={t.auth.password}
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
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {t.auth.confirmPassword}
              </label>
              <div className="relative">
                <Lock size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 rounded-lg border transition-colors ${
                    errors.confirmPassword
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={t.auth.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

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
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {lang === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                </span>
              ) : (
                <>
                  {t.auth.createAccount}
                  <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          <div className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <button
              onClick={() => navigate('/signin')}
              className={`font-medium transition-colors ${
                theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {t.auth.signIn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

