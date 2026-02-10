import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema, type AttendeeFormData } from '@/schemas/formSchemas';
import { registrationService } from '@/services/registrationService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, ArrowLeft, Home, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { SummitLogo } from '@/components/SummitLogo';
import ParticlesBackground from '@/components/ParticlesBackground';

const AttendeeRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<AttendeeFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields, isValidating },
    watch
  } = useForm<AttendeeFormData & { newsletter?: boolean }>({
    resolver: zodResolver(attendeeSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const validationSummary = useMemo(() => {
    const errorCount = Object.keys(errors).length;
    const fieldCount = Object.keys(touchedFields).length;
    const totalFields = Object.keys(attendeeSchema.shape).length;
    
    return {
      errorCount,
      fieldCount,
      totalFields,
      completionPercentage: Math.round((fieldCount / totalFields) * 100),
      hasErrors: errorCount > 0
    };
  }, [errors, touchedFields]);

  const onSubmit = async (data: AttendeeFormData & { newsletter?: boolean }) => {
    setSubmitError(null);
    
    try {
      console.log('Submitting registration to Supabase:', data);
      
      // Submit to Supabase via registrationService
      const result = await registrationService.submitAttendee({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        age: data.age,
        occupation: data.occupation,
        organization: data.organization,
        motivation: data.motivation,
        newsletter: data.newsletter || false,
      });
      
      if (result.success) {
        console.log('Registration submitted successfully to Supabase:', result.data);
        // Clear the form on success
        reset();
        setSubmittedData(data);
        setSubmitted(true);
      } else {
        console.error('Registration failed:', result.error);
        setSubmitError(result.error || 'Failed to submit registration');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Success View - Pending Approval Status
  if (submitted && submittedData) {
    return (
      <div className={`min-h-screen relative transition-colors duration-300 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' 
          : 'bg-[#00040F]'
      }`}>
        {theme === 'dark' && <ParticlesBackground theme={theme} />}
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              theme === 'light'
                ? 'bg-white/80 text-gray-700 hover:bg-white shadow-sm border border-gray-200'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10'
            }`}
          >
            <Home size={16} />
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
          <div className="flex flex-col items-center py-8 space-y-8 max-w-lg w-full">
            {/* Pending Status Card */}
            <div className={`w-full rounded-2xl shadow-2xl overflow-hidden border-2 ${
              theme === 'light' 
                ? 'bg-white border-amber-200' 
                : 'bg-[#0a0a1a] border-amber-500/30'
            }`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-white/20 rounded-full p-3">
                    <Clock size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight">
                  {t.forms.success_title}
                </h3>
              </div>
              
              {/* Body */}
              <div className="p-8 space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    theme === 'light'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    ⏳ {t.forms.pending_status}
                  </span>
                </div>

                {/* Applicant Info */}
                <div className={`text-center border-b border-dashed pb-6 ${
                  theme === 'light' ? 'border-gray-200' : 'border-white/10'
                }`}>
                  <p className={`text-xs uppercase tracking-widest mb-2 ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {lang === 'ar' ? 'اسم المتقدم' : 'Applicant Name'}
                  </p>
                  <p className={`font-bold text-xl tracking-tight ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{submittedData.name}</p>
                  <p className={`text-sm mt-1 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>{submittedData.email}</p>
                </div>
                
                {/* Message */}
                <div className={`text-center space-y-3 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  <p className="text-sm leading-relaxed">
                    {t.forms.success_message}
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {t.forms.check_status_instruction}
                  </p>
                </div>

                {/* Check Status Link */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/my-ticket')}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      theme === 'light'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                    }`}
                  >
                    {t.forms.go_to_ticket} →
                  </button>
                </div>
              </div>
              
              {/* Footer */}
              <div className={`px-6 py-4 text-center border-t ${
                theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-white/10'
              }`}>
                <p className={`text-xs ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {lang === 'ar' ? 'شكراً لاهتمامك بقمة بغداد للذكاء الاصطناعي 2026' : 'Thank you for your interest in Baghdad AI Summit 2026'}
                </p>
              </div>
            </div>
            
            {/* Return Home Button */}
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3.5 rounded-full font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Home size={18} />
              {lang === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' 
        : 'bg-[#00040F]'
    }`}>
      {theme === 'dark' && <ParticlesBackground theme={theme} />}
      
      {/* Decorative blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[100px] ${
          theme === 'light' ? 'bg-blue-200/50' : 'bg-blue-600/20'
        }`}></div>
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[100px] ${
          theme === 'light' ? 'bg-cyan-200/50' : 'bg-cyan-600/20'
        }`}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            theme === 'light'
              ? 'bg-white/80 text-gray-700 hover:bg-white shadow-sm border border-gray-200'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10'
          }`}
        >
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'رجوع' : 'Back'}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-20">
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border transition-colors ${
          theme === 'light'
            ? 'bg-white/90 backdrop-blur-xl border-gray-200'
            : 'bg-[#0a0a1a]/90 backdrop-blur-xl border-white/10'
        }`}>
          {/* Header */}
          <div className={`p-6 md:p-8 border-b ${
            theme === 'light' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-blue-100' : 'bg-blue-600/20'
              }`}>
                <SummitLogo className="w-8 h-8" />
              </div>
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {t.forms.general_title}
                </h1>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {lang === 'ar' ? 'انضم إلى قمة بغداد للذكاء الاصطناعي 2026' : 'Join Baghdad AI Summit 2026'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Validation Summary */}
              {validationSummary.fieldCount > 0 && (
                <div className={`p-4 rounded-lg border ${
                  validationSummary.hasErrors
                    ? theme === 'light'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-red-500/10 border-red-500/30'
                    : theme === 'light'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validationSummary.hasErrors ? (
                      <AlertCircle size={16} className={theme === 'light' ? 'text-red-600' : 'text-red-400'} />
                    ) : (
                      <CheckCircle2 size={16} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
                    )}
                    <span className={`text-sm font-medium ${
                      validationSummary.hasErrors
                        ? theme === 'light' ? 'text-red-800' : 'text-red-300'
                        : theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                    }`}>
                      {validationSummary.hasErrors
                        ? `${validationSummary.errorCount} ${lang === 'ar' ? 'أخطاء' : 'error(s)'} found`
                        : lang === 'ar' ? 'جميع الحقول صحيحة' : 'All fields valid'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-2 rounded-full ${
                      theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          validationSummary.hasErrors ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${validationSummary.completionPercentage}%` }}
                      />
                    </div>
                    <span className={`text-xs ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {validationSummary.completionPercentage}%
                    </span>
                  </div>
                </div>
              )}

              {/* Row 1: Name & Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t.forms.name}
                  type="text"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                  className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.name ? 'animate-pulse' : ''}`}
                />
                <Input
                  label={t.forms.age}
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  error={errors.age?.message}
                  required
                  className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.age ? 'animate-pulse' : ''}`}
                />
              </div>

              {/* Row 2: Occupation & Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {t.forms.occupation}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    {...register('occupation')}
                    className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                      errors.occupation
                        ? theme === 'light'
                          ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                          : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                        : theme === 'light'
                        ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } focus:outline-none ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    <option value="">{t.forms.select_placeholder}</option>
                    <option value="Student">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                    <option value="Employee">{lang === 'ar' ? 'موظف' : 'Employee'}</option>
                    <option value="Self-Employed">{lang === 'ar' ? 'عمل حر' : 'Self-Employed'}</option>
                    <option value="Researcher">{lang === 'ar' ? 'باحث' : 'Researcher'}</option>
                    <option value="Other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-500">{errors.occupation.message}</p>
                  )}
                </div>
                <Input
                  label={t.forms.organization}
                  type="text"
                  {...register('organization')}
                  error={errors.organization?.message}
                  className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Row 3: Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t.forms.email}
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                  className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.email ? 'animate-pulse' : ''}`}
                />
                <Input
                  label={t.forms.phone}
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  required
                  className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${isValidating && watchedFields.phone ? 'animate-pulse' : ''}`}
                />
              </div>

              {/* Row 4: Motivation */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {t.forms.motivation}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  {...register('motivation')}
                  rows={4}
                  className={`w-full px-3 py-2.5 rounded-lg border transition-all ${
                    errors.motivation
                      ? theme === 'light'
                        ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                        : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
                      : theme === 'light'
                      ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'border-white/10 bg-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  } focus:outline-none ${
                    theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
                  } ${isValidating && watchedFields.motivation ? 'animate-pulse' : ''}`}
                  placeholder={lang === 'ar' ? 'أخبرنا عن سبب اهتمامك بالحضور...' : 'Tell us why you are interested in attending...'}
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-500">{errors.motivation.message}</p>
                )}
              </div>

              {/* Newsletter Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  {...register('newsletter')}
                  className={`mt-0.5 w-4 h-4 rounded border transition-colors cursor-pointer focus:ring-2 focus:ring-blue-500/20 ${
                    theme === 'light'
                      ? 'border-gray-300 text-blue-600 focus:ring-blue-500'
                      : 'border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500'
                  }`}
                />
                <label 
                  htmlFor="newsletter" 
                  className={`text-xs cursor-pointer leading-relaxed ${
                    theme === 'light' ? 'text-gray-500' : 'text-white/60'
                  }`}
                >
                  {t.forms.newsletter_label}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-lg font-bold text-white transition-all transform hover:-translate-y-0.5 ${
                  isSubmitting
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : t.forms.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeRegistrationPage;
