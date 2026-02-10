import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';

/**
 * AboutPage Component
 * 
 * About page displaying the vision, mission, and history of the Baghdad AI Summit.
 * 
 * @returns {JSX.Element} AboutPage component
 */
const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Our Origins" subtitle="A legacy of wisdom reborn." align="left" theme={theme} />
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className={`space-y-6 text-lg leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <p>
              <span className={`font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>Baghdad.</span> The name itself evokes a history of profound knowledge. 
              During the Golden Age, the House of Wisdom attracted scholars from across the known world to translate, 
              innovate, and debate.
            </p>
            <p>
              The Baghdad AI Summit 2026 is the spiritual successor to that legacy. We are not just hosting a conference; 
              we are building an ecosystem. By connecting local talent with global experts, we aim to position Iraq 
              as a pivotal node in the global AI network.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className={`p-6 rounded-xl border ${
                theme === 'light'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white/5 border-white/10'
              }`}>
                <h4 className={`font-bold text-xl mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Vision</h4>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>To be the catalyst for the digital transformation of Mesopotamia.</p>
              </div>
              <div className={`p-6 rounded-xl border ${
                theme === 'light'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white/5 border-white/10'
              }`}>
                <h4 className={`font-bold text-xl mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Impact</h4>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Empowering 10,000+ youth with AI literacy by 2030.</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-40"></div>
            <img 
              src="public/Ancient.jpg" 
              alt="Ancient Mesopotamia meets Future" 
              className={`relative rounded-2xl shadow-2xl border grayscale hover:grayscale-0 transition-all duration-700 ${
                theme === 'light' ? 'border-gray-200' : 'border-white/10'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

