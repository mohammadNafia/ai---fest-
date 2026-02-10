import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { AGENDA_ITEMS } from '@/data/agenda';
import type { Theme } from '@/types';

interface AgendaTimelineProps {
  theme: Theme;
}

const AgendaTimeline: React.FC<AgendaTimelineProps> = ({ theme }) => (
  <div className="max-w-4xl mx-auto space-y-8 relative">
    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-transparent opacity-30 md:-translate-x-1/2"></div>
    
    {AGENDA_ITEMS.map((item, idx) => (
      <RevealOnScroll key={idx} delay={idx * 100}>
        <div className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          
          <div className={`absolute left-0 md:left-1/2 w-10 h-10 rounded-full border-2 border-blue-600 flex items-center justify-center z-10 md:-translate-x-1/2 shrink-0 ${
            theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
          }`}>
             <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>

          <div className={`pl-16 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'}`}>
            <div className={`p-6 rounded-2xl transition-all cursor-default ${
              theme === 'light'
                ? 'bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
                : 'bg-white/5 border border-white/5 hover:bg-white/10'
            }`}>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
                theme === 'light'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-blue-600/20 text-blue-400'
              }`}>
                {item.time}
              </span>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>{item.desc}</p>
              <div className={`flex items-center gap-2 mt-4 text-xs uppercase tracking-widest ${idx % 2 !== 0 && 'md:justify-end'} ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                 <div className={`w-2 h-2 rounded-full ${item.type === 'Keynote' ? 'bg-indigo-500' : item.type === 'Panel' ? 'bg-blue-500' : 'bg-cyan-500'}`}></div>
                 {item.type}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block md:w-1/2"></div>
        </div>
      </RevealOnScroll>
    ))}
  </div>
);

/**
 * AgendaPage Component
 * 
 * Displays the summit agenda in a timeline format with all scheduled events.
 * 
 * @returns {JSX.Element} AgendaPage component
 */
const AgendaPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div id="agenda" className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Summit Agenda" subtitle="Three days of immersive learning and networking." theme={theme} />
        <AgendaTimeline theme={theme} />
      </div>
    </div>
  );
};

export default AgendaPage;

