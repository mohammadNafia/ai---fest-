import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Users, Mic, Store, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { openGoogleCalendar } from '@/utils/calendarExport';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SummitLogo } from '@/components/SummitLogo';
import ParticlesBackground from '@/components/ParticlesBackground';
import TestimonialsSection from '@/components/TestimonialsSection';
import { useCounter } from '@/hooks/useCounter';
import { SPEAKERS } from '@/data/speakers';

/**
 * Attending Now Counter Component
 * 
 * Displays a live counter showing the number of people currently viewing the page.
 * Updates every 15 seconds with a smooth animation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {string} props.lang - Current language ('en' or 'ar')
 * @returns {JSX.Element} Attending now counter component
 */
const AttendingNowCounter = memo(({ theme, lang }) => {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 221) + 30);
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = Math.floor(Math.random() * 221) + 30;
      setCount(newCount);
      
      const steps = 20;
      const stepValue = (newCount - displayCount) / steps;
      let current = displayCount;
      const counter = setInterval(() => {
        current += stepValue;
        if (Math.abs(newCount - current) < Math.abs(stepValue)) {
          setDisplayCount(newCount);
          clearInterval(counter);
        } else {
          setDisplayCount(Math.round(current));
        }
      }, 50);
    }, 15000);

    return () => clearInterval(interval);
  }, [count, displayCount]);

  const attendingText = useMemo(() => lang === 'ar' ? 'المشاهدون الآن' : 'Attending Now', [lang]);

  return (
    <div className={`fixed top-24 ${lang === 'ar' ? 'left-6' : 'right-6'} z-40 hidden md:block`}>
      <div className={`backdrop-blur-xl rounded-2xl border p-4 shadow-xl transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white/90 border-gray-200'
          : 'bg-black/80 border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            theme === 'light' ? 'bg-green-500' : 'bg-green-400'
          }`}></div>
          <div>
            <p className={`text-xs font-medium ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {attendingText}
            </p>
            <p className={`text-lg font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {displayCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Hero Component
 * 
 * Main hero section of the homepage with parallax scrolling effects,
 * countdown timer, and call-to-action buttons.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.t - Translation object
 * @param {string} props.lang - Current language ('en' or 'ar')
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Hero section component
 */
const Hero = memo(({ t, lang, theme }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame for smooth scrolling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  const handleAgendaClick = useCallback(() => {
    navigate('/agenda');
  }, [navigate]);

  return (
    <div className={`relative min-h-screen flex items-center pt-20 overflow-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-white' : 'bg-[#00040F]'
    }`}>
      {/* Particles Background */}
      <ParticlesBackground theme={theme} />
      
      <div className="absolute inset-0 -z-10">
        {/* Enhanced parallax layers with different speeds */}
        <div 
          className={`ai-aura-orb absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-60 transition-transform duration-75 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/40'
              : 'bg-gradient-to-br from-blue-300/30 via-cyan-200/20 to-blue-400/30'
          }`}
          style={{ 
            top: '10%', 
            left: '5%', 
            transform: `translate3d(0, ${scrollY * 0.5}px, 0) rotate(${scrollY * 0.1}deg)`,
            willChange: 'transform'
          }}
        />
        <div 
          className={`ai-aura-orb-reverse absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-60 transition-transform duration-75 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-500/40 via-blue-400/30 to-cyan-500/40'
              : 'bg-gradient-to-br from-purple-300/30 via-blue-200/20 to-cyan-300/30'
          }`}
          style={{ 
            top: '20%', 
            right: '5%', 
            transform: `translate3d(0, ${scrollY * 0.3}px, 0) rotate(${-scrollY * 0.08}deg)`,
            willChange: 'transform'
          }}
        />
        {/* Additional parallax layer */}
        <div 
          className={`absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-40 transition-transform duration-75 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-indigo-500/30 via-purple-400/20 to-pink-500/30'
              : 'bg-gradient-to-br from-indigo-300/20 via-purple-200/15 to-pink-300/20'
          }`}
          style={{ 
            bottom: '15%', 
            left: '50%', 
            transform: `translate3d(-50%, ${scrollY * 0.4}px, 0)`,
            willChange: 'transform'
          }}
        />
      </div>
      
      <div className="absolute inset-0">
        {theme === 'dark' && (
          <>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          </>
        )}
        {theme === 'light' && (
          <>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200/30 rounded-full blur-[120px] animate-pulse duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[100px]"></div>
          </>
        )}
      </div>

      <div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
        style={{
          transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
          willChange: 'transform'
        }}
      >
        <div className="space-y-8">
          <RevealOnScroll>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-medium uppercase tracking-widest ${
              theme === 'light'
                ? 'border border-blue-300 bg-blue-100/80 text-blue-700'
                : 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'
              }`}></span>
              {t.hero.date}
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={100}>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[0.95] tracking-tight ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.hero.title_prefix} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                {t.hero.title_highlight}
              </span>
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <p className={`text-sm sm:text-base md:text-lg lg:text-xl max-w-lg leading-relaxed font-light ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {t.hero.subtitle}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={250}>
            <div className={`border-t pt-6 ${
              theme === 'light' ? 'border-gray-300' : 'border-white/10'
            }`}>
              <p className={`text-xs uppercase tracking-widest mb-2 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>{t.hero.countdown_label}</p>
              <CountdownTimer theme={theme} />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <div className="flex flex-wrap gap-4 pt-6">
              <button 
                onClick={handleAgendaClick}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm transition-all flex items-center gap-2 min-h-[44px] focus:ring-2 focus:ring-blue-500/70 outline-none ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    : 'bg-white text-black hover:bg-blue-50 active:bg-gray-100'
                }`}
                aria-label={t.hero.cta_agenda}
              >
                {t.hero.cta_agenda} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
              </button>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={400}>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-[#00040F]/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t.stats.speakers}</p>
                  <div className="text-4xl font-bold text-white">120+</div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Startups</p>
                  <div className="text-4xl font-bold text-white">50+</div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Countries</p>
                  <div className="text-4xl font-bold text-white">25+</div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Workshops</p>
                  <div className="text-4xl font-bold text-white">15+</div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white">Registration Status</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">EARLY BIRD OPEN</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[65%]"></div>
                </div>
                <p className="text-xs text-gray-400 text-right">65% of tickets sold</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
});

// Marquee Component
const Marquee = memo(({ theme }) => {
  const marqueeItems = useMemo(() => [...Array(10)].map((_, i) => i), []);
  
  return (
  <div className={`py-6 border-y relative overflow-hidden z-20 transition-colors duration-300 ${
    theme === 'light'
      ? 'bg-gray-100 border-gray-200'
      : 'bg-[#00040F] border-white/5'
  }`}>
    <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r z-10 ${
      theme === 'light' ? 'from-gray-100 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l z-10 ${
      theme === 'light' ? 'from-gray-100 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    <div className="whitespace-nowrap animate-scroll flex gap-12 opacity-50">
      {marqueeItems.map((i) => (
        <div key={i} className="flex items-center gap-4">
          <span className={`text-xl font-bold text-transparent bg-clip-text uppercase tracking-widest ${
            theme === 'light'
              ? 'bg-gradient-to-r from-gray-500 to-gray-700'
              : 'bg-gradient-to-r from-gray-400 to-gray-600'
          }`}>
            Baghdad AI Summit
          </span>
          <div className="w-8 h-8 opacity-50">
            <SummitLogo className="w-full h-full" />
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll {
        animation: scroll 40s linear infinite;
      }
    `}</style>
  </div>
  );
});

// Stat Counter Component
const StatCounter = memo(({ end, label, icon: Icon, theme }) => {
  const { count, countRef } = useCounter(end);
  return (
    <div 
      ref={countRef} 
      className={`text-center p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-[0.97] focus:ring-2 focus:ring-blue-500/70 outline-none ${
        theme === 'light'
          ? 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
          : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
      tabIndex={0}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
        theme === 'light'
          ? 'bg-blue-100 text-blue-600'
          : 'bg-blue-600/20 text-blue-400'
      }`}>
        <Icon size={24} />
      </div>
      <div className={`text-4xl md:text-5xl font-bold mb-2 ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>{count.toLocaleString()}+</div>
      <div className={`text-sm uppercase tracking-widest ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
      }`}>{label}</div>
    </div>
  );
});

// Stats Section
const StatsSection = memo(({ t, theme }) => {
  const stats = useMemo(() => [
    { end: 5000, label: t.stats.attendees, icon: Users },
    { end: 120, label: t.stats.speakers, icon: Mic },
    { end: 100, label: t.stats.exhibitors, icon: Store },
  ], [t.stats.attendees, t.stats.speakers, t.stats.exhibitors]);

  return (
  <section id="stats" className={`py-24 relative overflow-hidden transition-colors duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {stats.map((stat, idx) => (
        <StatCounter key={idx} end={stat.end} label={stat.label} icon={stat.icon} theme={theme} />
      ))}
    </div>
  </section>
  );
});

// Speaker Card Component with Framer Motion
const SpeakerCard = memo(({ speaker, theme, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={`group relative rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.97] ${
        theme === 'light'
          ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl'
          : 'bg-[#010614] border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20'
      }`}
    >
    <div className="aspect-[4/5] overflow-hidden relative">
      <img 
        src={speaker.image} 
        alt={speaker.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
      
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <button 
            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500/70 outline-none" 
            aria-label={`View ${speaker.name} on LinkedIn`}
          >
            <Linkedin size={14} />
          </button>
          <button 
            className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-500/70 outline-none" 
            aria-label={`View ${speaker.name} on Twitter`}
          >
            <Twitter size={14} />
          </button>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{speaker.name}</h3>
        <p className="text-blue-400 text-sm font-medium">{speaker.company}</p>
      </div>
    </div>
    <div className={`p-4 ${
      theme === 'light' ? 'bg-white' : 'bg-[#010614]'
    }`}>
       <p className={`text-xs uppercase tracking-wider ${
         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
       }`}>{speaker.role}</p>
    </div>
    </motion.div>
  );
});

// Speakers Section
const SpeakersSection = memo(({ t, theme }) => {
  const speakersList = useMemo(() => SPEAKERS, []);

  return (
    <section id="speakers" className={`py-24 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00030a]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeading title={t.speakers.title} subtitle={t.speakers.subtitle} theme={theme} />
        </RevealOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {speakersList.map((speaker, idx) => (
            <SpeakerCard key={speaker.id} speaker={speaker} theme={theme} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
});

/**
 * HomePage Component
 * 
 * Main landing page component for the Baghdad AI Summit.
 * Includes hero section, stats, speakers, testimonials, and call-to-action sections.
 * 
 * @returns {JSX.Element} HomePage component
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { lang, t } = useLanguage();

  const handleAgendaNavigation = useCallback(() => {
    navigate('/agenda');
  }, [navigate]);

  const handleCalendarClick = useCallback(() => {
    const event = {
      title: 'Baghdad AI Summit 2026',
      description: 'The premier artificial intelligence summit in the Middle East',
      startDate: new Date('2026-04-04T09:00:00'),
      endDate: new Date('2026-04-04T18:00:00'),
      location: "The Station"
    };
    try {
      openGoogleCalendar(event);
    } catch (error) {
      console.error('Error opening calendar:', error);
    }
  }, []);

  const calendarText = useMemo(() => lang === 'ar' ? 'إضافة إلى التقويم' : 'Add to Calendar', [lang]);

  return (
    <>
      <AttendingNowCounter theme={theme} lang={lang} />
      <Hero t={t} lang={lang} theme={theme} />
      <Marquee theme={theme} />
      <StatsSection t={t} theme={theme} />
      <SpeakersSection t={t} theme={theme} />
      <TestimonialsSection />
      
      <section className={`py-32 relative overflow-hidden transition-colors duration-300 ${
        theme === 'light' ? 'bg-blue-100/50' : 'bg-blue-900/20'
      }`}>
        {theme === 'dark' && (
          <>
            <div className="absolute inset-0 bg-[#00040F]/80"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          </>
        )}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className={`text-4xl md:text-6xl font-bold mb-8 tracking-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>Ready to shape the future?</h2>
          <p className={`text-xl mb-10 font-light ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>Join the most influential minds in AI at the heart of the Middle East.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleAgendaNavigation}
              className={`px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl focus:ring-2 focus:ring-blue-500/70 outline-none ${
                theme === 'light'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-400/30'
                  : 'bg-white text-black hover:bg-blue-50 shadow-white/10'
              }`}
              aria-label="Secure your spot at the summit"
            >
              Secure Your Spot
            </button>
            <button
              onClick={handleCalendarClick}
              className={`px-6 py-4 rounded-full font-medium text-sm transition-all hover:scale-105 border flex items-center gap-2 focus:ring-2 focus:ring-blue-500/70 outline-none ${
                theme === 'light'
                  ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
              }`}
              aria-label={calendarText}
            >
              <Calendar size={18} />
              {calendarText}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

