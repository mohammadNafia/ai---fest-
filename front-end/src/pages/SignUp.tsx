/**
 * Sign Up Page
 * 
 * Clean sign-up form for new users
 * Fields: Name, Age, Occupation, Organization, Email, Password, Phone
 * All users start as "User" role
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, User, Mail, Phone, Briefcase, Building, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { signUp } from '@/api/auth';

// Sign-up schema (without motivation and newsletter)
const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  age: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val.trim(), 10);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }).refine((val) => val > 0 && val <= 120, { message: 'Age must be between 1 and 120' }),
  occupation: z.string().min(2, { message: 'Occupation is required' }),
  organization: z.string().min(2, { message: 'Organization is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      age: '',
      occupation: '',
      organization: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setIsLoading(true);
    
    try {
      const result = await signUp({
        name: data.name,
        age: typeof data.age === 'string' ? parseInt(data.age, 10) : data.age,
        occupation: data.occupation,
        organization: data.organization,
        email: data.email.toLowerCase(),
        password: data.password,
        phone: data.phone,
      });
      
      if (result.success && result.data) {
        const authData = result.data;
        const user = authData.user;
        
        // Auto-login the user
        login({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          avatar: user.avatarUrl,
        }, authData.token, new Date(authData.expiresAt).getTime() - Date.now());
        
        // Navigate to home page
        navigate('/', { replace: true });
      } else {
        setError(result.error || (lang === 'ar' 
          ? 'فشل التسجيل. يرجى المحاولة مرة أخرى' 
          : 'Sign up failed. Please try again'));
        setIsLoading(false);
      }
    } catch (error) {
      setError(lang === 'ar' 
        ? 'حدث خطأ أثناء التسجيل' 
        : 'An error occurred during sign up');
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
              <UserPlus size={32} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' 
                ? 'أنشئ حسابك للانضمام إلى قمة بغداد للذكاء الاصطناعي' 
                : 'Create your account to join Baghdad AI Summit'}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
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
                  placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'العمر' : 'Age'} *
              </label>
              <input
                type="number"
                {...register('age', { valueAsNumber: true })}
                min="1"
                max="120"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  errors.age
                    ? theme === 'light'
                      ? 'bg-red-50 border-red-400 text-gray-900'
                      : 'bg-red-500/10 border-red-500 text-white'
                    : theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                    : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                } outline-none`}
                placeholder={lang === 'ar' ? 'أدخل عمرك' : 'Enter your age'}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'المهنة' : 'Occupation'} *
              </label>
              <div className="relative">
                <Briefcase size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  {...register('occupation')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.occupation
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أدخل مهنتك' : 'Enter your occupation'}
                />
                {errors.occupation && (
                  <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>
                )}
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'المنظمة / الجامعة' : 'Organization / University'} *
              </label>
              <div className="relative">
                <Building size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  {...register('organization')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.organization
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أدخل منظمتك أو جامعتك' : 'Enter your organization or university'}
                />
                {errors.organization && (
                  <p className="text-red-500 text-xs mt-1">{errors.organization.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
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
                  placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                  placeholder={lang === 'ar' ? 'أدخل كلمة المرور (6 أحرف على الأقل)' : 'Enter password (at least 6 characters)'}
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

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <div className="relative">
                <Phone size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors ${
                    errors.phone
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
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
                  {lang === 'ar' ? 'جاري التسجيل...' : 'Signing up...'}
                </>
              ) : (
                <>
                  {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link
              to="/signin"
              className={`font-medium hover:underline ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
