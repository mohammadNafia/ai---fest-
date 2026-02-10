/**
 * Unified Sign-In Page
 * 
 * Attendee registration form that:
 * - Collects attendee information (name, age, occupation, organization, email, phone, motivation, newsletter)
 * - Creates User + AttendeeRegistration automatically
 * - Auto-logs in as User role
 * - Shows in Admin Dashboard attendees table
 * - Admin can change user roles
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema } from '@/schemas/formSchemas';
import { LogIn, User, Mail, Phone, Briefcase, Building, MessageSquare, CheckSquare, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { attendeeSignIn } from '@/api/auth';
import type { AttendeeFormData } from '@/schemas/formSchemas';

const UnifiedSignIn: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(attendeeSchema),
    mode: 'onChange', // Validate on change to catch errors early
    defaultValues: {
      name: '',
      age: '',
      occupation: '',
      organization: '',
      email: '',
      password: '',
      phone: '',
      motivation: '',
      newsletter: false,
    },
  });

  /**
   * Handle attendee sign-in/registration
   * Creates User with role=User (which equals Attendee), auto-logs in
   */
  const onSubmit = async (data: any) => {
    setError('');
    setIsLoading(true);
    
    // Debug: Log the form data
    console.log('Form data received:', data);
    
    try {
      // Ensure all required fields are present
      const requestData = {
        name: data.name || '',
        age: typeof data.age === 'string' ? parseInt(data.age, 10) : (data.age || 0),
        occupation: data.occupation || '',
        organization: data.organization || '',
        email: (data.email || '').toLowerCase(),
        password: data.password || '',
        phone: data.phone || '',
        motivation: data.motivation || '',
        newsletter: data.newsletter || false,
      };
      
      console.log('Sending request data:', requestData);
      
      // Call backend to create User with role=User (which equals Attendee)
      const result = await attendeeSignIn(requestData);
      
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
        // Show specific error messages
        const errorMessage = result.error || result.message || 'Registration failed';
        console.error('Registration error:', result);
        
        if (errorMessage?.toLowerCase().includes('email already')) {
          setError(lang === 'ar' 
            ? 'البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد إلكتروني آخر' 
            : 'Email already registered. Please use a different email address.');
        } else if (errorMessage?.toLowerCase().includes('password')) {
          setError(errorMessage);
        } else if (errorMessage?.toLowerCase().includes('required')) {
          setError(lang === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة' 
            : 'Please fill in all required fields');
        } else {
          setError(errorMessage);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setError(lang === 'ar' 
        ? 'حدث خطأ أثناء التسجيل' 
        : 'An error occurred during registration');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' 
        : 'bg-[#00040F]'
    }`}>
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border transition-colors duration-300 ${
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
              {lang === 'ar' ? 'تسجيل الدخول كحضور' : 'Sign In as Attendee'}
            </h1>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {lang === 'ar' 
                ? 'املأ النموذج أدناه للتسجيل في قمة بغداد للذكاء الاصطناعي' 
                : 'Fill out the form below to register for Baghdad AI Summit'}
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

            {/* Motivation */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' ? 'الدافع' : 'Motivation'} *
              </label>
              <div className="relative">
                <MessageSquare size={18} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <textarea
                  {...register('motivation')}
                  rows={4}
                  className={`w-full ${lang === 'ar' ? 'pr-10' : 'pl-10'} py-3 rounded-lg border transition-colors resize-none ${
                    errors.motivation
                      ? theme === 'light'
                        ? 'bg-red-50 border-red-400 text-gray-900'
                        : 'bg-red-500/10 border-red-500 text-white'
                      : theme === 'light'
                      ? 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                      : 'bg-black/50 border-white/10 text-white focus:border-blue-500'
                  } outline-none`}
                  placeholder={lang === 'ar' ? 'أخبرنا بدافعك لحضور القمة' : 'Tell us your motivation for attending the summit'}
                />
                {errors.motivation && (
                  <p className="text-red-500 text-xs mt-1">{errors.motivation.message}</p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="newsletter"
                {...register('newsletter')}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="newsletter" className={`text-sm ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {lang === 'ar' 
                  ? 'أريد الاشتراك في النشرة الإخبارية' 
                  : 'I want to subscribe to the newsletter'}
              </label>
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
                  {lang === 'ar' ? 'جاري التسجيل...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                </>
              )}
            </button>
          </form>

          {/* Info Text */}
          <div className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {lang === 'ar' 
              ? 'سيتم إنشاء حساب تلقائياً كـ مستخدم عادي. يمكن للمشرف تغيير دورك لاحقاً.' 
              : 'An account will be automatically created as a regular user. Admin can change your role later.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignIn;
