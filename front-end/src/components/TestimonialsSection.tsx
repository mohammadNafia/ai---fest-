import React from 'react';
import { Quote } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { TESTIMONIALS } from '@/data/testimonials';

/**
 * TestimonialsSection Component
 * 
 * Displays testimonials from industry leaders and experts.
 * 
 * @returns {JSX.Element} TestimonialsSection component
 */
const TestimonialsSection: React.FC = () => {
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  return (
    <section 
      id="testimonials" 
      className={`py-24 transition-colors duration-300 ${
        theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
      }`}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeading
            title={t.testimonials?.title || 'What Leaders Are Saying'}
            subtitle={t.testimonials?.subtitle || 'Hear from industry experts and thought leaders about the impact of Baghdad AI Summit.'}
            theme={theme}
          />
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <RevealOnScroll key={testimonial.id} delay={idx * 100}>
              <div
                className={`group relative rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] ${
                  theme === 'light'
                    ? 'bg-white border-gray-200 shadow-md hover:shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Quote Icon */}
                <div className={`absolute ${lang === 'ar' ? 'left-4 top-4' : 'right-4 top-4'} ${
                  theme === 'light' ? 'text-blue-200' : 'text-blue-500/20'
                }`}>
                  <Quote size={32} />
                </div>

                <div className={`p-6 md:p-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {/* Quote Text */}
                  <p className={`text-base md:text-lg leading-relaxed mb-6 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    "{testimonial.quote}"
                  </p>

                  {/* Author Info */}
                  <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {testimonial.avatar && (
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg mb-1 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {testimonial.role}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {testimonial.organization}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

