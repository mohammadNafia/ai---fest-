import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { attendeeSchema, type AttendeeFormData } from '@/schemas/formSchemas';
import { registrationService } from '@/services/registrationService';
import { settingsService } from '@/services/settingsService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ModalBase from './ModalBase';
import { CheckCircle2, AlertCircle, Loader2, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface GeneralRegistrationFormProps {
  onClose: () => void;
}

const GeneralRegistrationForm: React.FC<GeneralRegistrationFormProps> = ({ onClose }) => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registrationsOpen, setRegistrationsOpen] = useState<boolean>(true);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttendeeFormData & { newsletter?: boolean }>({
    resolver: zodResolver(attendeeSchema),
    mode: 'onChange',
  });

  // Check if registrations are open
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      setCheckingStatus(true);
      try {
        const isOpen = await settingsService.isRegistrationOpen();
        setRegistrationsOpen(isOpen);
        if (!isOpen) {
          setSubmitError(lang === 'ar' ? 'التسجيلات مغلقة حالياً' : 'Registrations are currently closed');
        }
      } catch (err) {
        console.error('Error checking registration status:', err);
        // Default to open if check fails
        setRegistrationsOpen(true);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkRegistrationStatus();
  }, [lang]);

  const onSubmit = async (data: AttendeeFormData & { newsletter?: boolean }) => {
    setSubmitError(null);
    
    // Check if registrations are still open before submitting
    const isOpen = await settingsService.isRegistrationOpen();
    if (!isOpen) {
      setSubmitError(lang === 'ar' ? 'التسجيلات مغلقة حالياً' : 'Registrations are currently closed');
      return;
    }
    
    try {
      console.log('[GeneralRegistrationForm] Submitting to backend:', data);
      
      const result = await registrationService.submitAttendee({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        age: data.age,
        occupation: data.occupation,
        organization: data.organization,
        motivation: data.motivation,
        newsletter: data.newsletter || false,
      });
      
      if (result.success) {
        console.log('[GeneralRegistrationForm] SUCCESS:', result.data);
        // Clear the form on success
        reset();
        setSubmitted(true);
      } else {
        console.error('[GeneralRegistrationForm] FAILED:', result.error);
        // Show capacity error or other error
        setSubmitError(result.error || 'Failed to submit registration');
      }
    } catch (error) {
      console.error('[GeneralRegistrationForm] Unexpected error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleGoToTicket = () => {
    onClose();
    navigate('/check-ticket');
  };

  // ========================================
  // SUCCESS VIEW - Application Received Card
  // ========================================
  if (submitted) {
    return (
      <ModalBase 
        title={lang === 'ar' ? 'تم استلام طلبك!' : 'Application Received!'} 
        onClose={onClose} 
        theme={theme}
      >
        <div className="flex flex-col items-center py-10 px-6 space-y-6">
          {/* Success Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            theme === 'light' ? 'bg-green-100' : 'bg-green-500/20'
          }`}>
            <CheckCircle2 size={48} className="text-green-500" />
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3">
            <h2 className={`text-2xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'تم استلام طلبك بنجاح' : 'Application Received'}
            </h2>
            <p className={`text-base leading-relaxed max-w-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {lang === 'ar' 
                ? 'يمكنك التحقق من حالة طلبك في صفحة "تذكرتي" باستخدام بريدك الإلكتروني.'
                : 'Check your status at the "My Ticket" page using your email.'}
            </p>
          </div>

          {/* Go to My Ticket Button */}
          <button
            onClick={handleGoToTicket}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Ticket size={20} />
            {lang === 'ar' ? 'الذهاب إلى تذكرتي' : 'Go to My Ticket'}
          </button>

          {/* Close Link */}
          <button
            onClick={onClose}
            className={`text-sm transition-colors ${
              theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </ModalBase>
    );
  }

  // ========================================
  // FORM VIEW - Clean, Simple Form
  // ========================================
  if (checkingStatus) {
    return (
      <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
        <div className="flex items-center justify-center py-10">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </ModalBase>
    );
  }

  if (!registrationsOpen) {
    return (
      <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
        <div className={`p-6 rounded-lg border text-center ${
          theme === 'light'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'light' ? 'text-amber-900' : 'text-amber-200'
          }`}>
            {lang === 'ar' ? 'التسجيلات مغلقة' : 'Registrations Closed'}
          </h3>
          <p className={theme === 'light' ? 'text-amber-700' : 'text-amber-300'}>
            {lang === 'ar' 
              ? 'نعتذر، التسجيلات مغلقة حالياً. يرجى المحاولة لاحقاً.'
              : 'Sorry, registrations are currently closed. Please try again later.'}
          </p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Error Alert */}
        {submitError && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            theme === 'light'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{lang === 'ar' ? 'فشل في الإرسال' : 'Submission Failed'}</p>
              <p className="text-sm opacity-90">{submitError}</p>
            </div>
          </div>
        )}

        {/* Row 1: Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label={t.forms.name}
            type="text"
            {...register('name')}
            error={errors.name?.message}
            required
          />
          <Input
            label={t.forms.age}
            type="number"
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
            required
          />
        </div>

        {/* Row 2: Occupation & Organization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    ? 'border-red-500 bg-red-50'
                    : 'border-red-500 bg-red-500/10'
                  : theme === 'light'
                  ? 'border-gray-300 bg-white focus:border-blue-500'
                  : 'border-white/10 bg-white/5 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}
            >
              <option value="">{lang === 'ar' ? 'اختر...' : 'Select...'}</option>
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
            label={t.forms.institution}
            type="text"
            {...register('institution')}
            error={errors.institution?.message}
          />
        </div>

        {/* Row 3: Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label={t.forms.email}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          <Input
            label={t.forms.phone}
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            required
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
                  ? 'border-red-500 bg-red-50'
                  : 'border-red-500 bg-red-500/10'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-blue-500'
                : 'border-white/10 bg-white/5 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            }`}
            placeholder={lang === 'ar' ? 'أخبرنا عن سبب اهتمامك بالحضور...' : 'Tell us why you are interested in attending...'}
          />
          {errors.motivation && (
            <p className="mt-1 text-sm text-red-500">{errors.motivation.message}</p>
          )}
        </div>

        {/* Newsletter Checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="newsletter"
            {...register('newsletter')}
            className={`mt-0.5 w-4 h-4 rounded border cursor-pointer ${
              theme === 'light'
                ? 'border-gray-300 text-blue-600'
                : 'border-white/20 bg-white/5 text-blue-500'
            }`}
          />
          <label 
            htmlFor="newsletter" 
            className={`text-xs cursor-pointer leading-relaxed ${
              theme === 'light' ? 'text-gray-500' : 'text-white/60'
            }`}
          >
            {lang === 'ar' 
              ? 'أبقني على اطلاع بأحدث فعاليات الذكاء الاصطناعي (النشرة الإخبارية)' 
              : 'Keep me updated on future AI events (Newsletter)'}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
            </>
          ) : (
            t.forms.submit
          )}
        </button>
      </form>
    </ModalBase>
  );
};

export default GeneralRegistrationForm;
