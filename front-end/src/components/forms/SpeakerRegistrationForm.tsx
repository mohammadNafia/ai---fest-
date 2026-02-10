import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { speakerSchema, type SpeakerFormData } from '@/schemas/formSchemas';
import { formsAPI } from '@/api/forms';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ModalBase from './ModalBase';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SpeakerRegistrationFormProps {
  onClose: () => void;
  t?: any;
  theme?: string;
}

const SpeakerRegistrationForm: React.FC<SpeakerRegistrationFormProps> = ({ onClose, t: tProp, theme: themeProp }) => {
  const { lang, t: contextT } = useLanguage();
  const { theme: contextTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = tProp || contextT;
  const theme = themeProp || contextTheme;
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Check if user is authenticated
  React.useEffect(() => {
    if (!user) {
      // Redirect to signup if not authenticated
      if (confirm(lang === 'ar' 
        ? 'يجب عليك التسجيل أولاً. هل تريد الانتقال إلى صفحة التسجيل؟'
        : 'You must sign up first. Would you like to go to the signup page?')) {
        navigate('/signup');
        onClose();
      } else {
        onClose();
      }
    }
  }, [user, navigate, onClose, lang]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, isValidating },
    watch
  } = useForm<SpeakerFormData>({
    resolver: zodResolver(speakerSchema),
    mode: 'onChange' // Enable real-time validation
  });

  // Watch all fields for real-time validation
  const watchedFields = watch();

  // Form-level validation summary
  const validationSummary = useMemo(() => {
    const errorCount = Object.keys(errors).length;
    const fieldCount = Object.keys(touchedFields).length;
    const totalFields = Object.keys(speakerSchema.shape).length;
    
    return {
      errorCount,
      fieldCount,
      totalFields,
      completionPercentage: Math.round((fieldCount / totalFields) * 100),
      hasErrors: errorCount > 0
    };
  }, [errors, touchedFields]);

  const onSubmit = async (data: SpeakerFormData) => {
    if (!user) {
      setError(lang === 'ar' ? 'يجب عليك التسجيل أولاً' : 'You must sign up first');
      return;
    }

    setError('');
    try {
      // Use user's email if not provided
      const submitData = {
        ...data,
        email: data.email || user.email,
      };
      
      const result = await formsAPI.submitSpeaker(submitData);
      if (result.success) {
        setSubmitted(true);
        setTimeout(onClose, 2000);
      } else {
        setError(result.error || (lang === 'ar' ? 'فشل إرسال الطلب' : 'Failed to submit application'));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'An error occurred while submitting the request');
    }
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.speaker_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {lang === 'ar' ? 'تم استلام الطلب' : 'Application Received'}
          </h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            {lang === 'ar' 
              ? 'سيتم مراجعة طلبك من قبل المشرف. سيتم إشعارك عند الموافقة.'
              : 'Your application has been submitted and is pending admin approval. You will be notified when approved.'}
          </p>
        </div>
      </ModalBase>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <ModalBase title={t.forms.speaker_title} onClose={onClose} theme={theme}>
      {error && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          theme === 'light' ? 'bg-red-50 text-red-700' : 'bg-red-500/20 text-red-400'
        }`}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form-level validation summary */}
        {validationSummary.fieldCount > 0 && (
          <div className={`p-4 rounded-lg border ${
            validationSummary.hasErrors
              ? theme === 'light'
                ? 'bg-red-50 border-red-200'
                : 'bg-red-500/10 border-red-500/30'
              : theme === 'light'
              ? 'bg-purple-50 border-purple-200'
              : 'bg-purple-500/10 border-purple-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {validationSummary.hasErrors ? (
                <AlertCircle size={16} className={theme === 'light' ? 'text-red-600' : 'text-red-400'} />
              ) : (
                <CheckCircle2 size={16} className={theme === 'light' ? 'text-purple-600' : 'text-purple-400'} />
              )}
              <span className={`text-sm font-medium ${
                validationSummary.hasErrors
                  ? theme === 'light' ? 'text-red-800' : 'text-red-300'
                  : theme === 'light' ? 'text-purple-800' : 'text-purple-300'
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
                    validationSummary.hasErrors
                      ? 'bg-red-500'
                      : 'bg-purple-500'
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

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label={t.forms.name}
            type="text"
            {...register('name')}
            error={errors.name?.message}
            required
            className={isValidating && watchedFields.name ? 'animate-pulse' : ''}
          />
          <Input
            label={t.forms.occupation}
            type="text"
            {...register('occupation')}
            error={errors.occupation?.message}
            required
            className={isValidating && watchedFields.occupation ? 'animate-pulse' : ''}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label={t.forms.institution}
            type="text"
            {...register('institution')}
            error={errors.institution?.message}
            required
            className={isValidating && watchedFields.institution ? 'animate-pulse' : ''}
          />
          <Input
            label={t.forms.email}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            className={isValidating && watchedFields.email ? 'animate-pulse' : ''}
          />
        </div>

        <Input
          label={t.forms.phone}
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          required
          className={isValidating && watchedFields.phone ? 'animate-pulse' : ''}
        />

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-1.5 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.skills}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('skills')}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              errors.skills
                ? theme === 'light'
                  ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500/20'
                : 'border-white/10 bg-white/5 focus:border-purple-500 focus:ring-purple-500/20'
            } focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            } ${isValidating && watchedFields.skills ? 'animate-pulse' : ''}`}
          />
          {errors.skills && (
            <p className="mt-1.5 text-sm text-red-500">{errors.skills.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-1.5 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.experience}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('experience')}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              errors.experience
                ? theme === 'light'
                  ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500/20'
                : 'border-white/10 bg-white/5 focus:border-purple-500 focus:ring-purple-500/20'
            } focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            } ${isValidating && watchedFields.experience ? 'animate-pulse' : ''}`}
          />
          {errors.experience && (
            <p className="mt-1.5 text-sm text-red-500">{errors.experience.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-1.5 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.topics}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('topics')}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              errors.topics
                ? theme === 'light'
                  ? 'border-red-500 bg-red-50 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/20'
                : theme === 'light'
                ? 'border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500/20'
                : 'border-white/10 bg-white/5 focus:border-purple-500 focus:ring-purple-500/20'
            } focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            } ${isValidating && watchedFields.topics ? 'animate-pulse' : ''}`}
          />
          {errors.topics && (
            <p className="mt-1.5 text-sm text-red-500">{errors.topics.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-1.5 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {t.forms.achievements}
          </label>
          <textarea
            {...register('achievements')}
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
              theme === 'light'
                ? 'border-gray-300 bg-white focus:border-purple-500 focus:ring-purple-500/20'
                : 'border-white/10 bg-white/5 focus:border-purple-500 focus:ring-purple-500/20'
            } focus:outline-none focus:ring-2 ${
              theme === 'light' ? 'text-gray-900 placeholder-gray-400' : 'text-white placeholder-gray-500'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-bold text-white transition-all ${
            isSubmitting
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
          }`}
        >
          {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

export default SpeakerRegistrationForm;

