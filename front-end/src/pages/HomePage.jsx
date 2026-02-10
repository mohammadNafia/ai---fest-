import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Mic, Store, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SummitLogo } from '@/components/SummitLogo';
import ParticlesBackground from '@/components/ParticlesBackground';
import TestimonialsSection from '@/components/TestimonialsSection';
import { useCounter } from '@/hooks/useCounter';
import { useSpeakers } from '@/hooks/useSpeakers';
import { useSiteContent } from '@/hooks/useSiteContent';
import { settingsService } from '@/services/settingsService';

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
 */
const Hero = memo(({ t, lang, theme, siteContent, getLocalizedSetting }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
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
      
      {theme === 'dark' && (
        <>
          <div 
            className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>
        </>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-16 md:py-20 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
              {getLocalizedSetting('hero_title_prefix', t.hero.title_prefix)} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                {getLocalizedSetting('hero_title_highlight', t.hero.title_highlight)}
              </span>
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <p className={`text-base sm:text-lg md:text-xl max-w-xl leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {getLocalizedSetting('hero_subtitle', t.hero.subtitle)}
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/register-attendee')}
                className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 flex items-center gap-2 focus:ring-2 focus:ring-blue-500/70 outline-none"
                aria-label={lang === 'ar' ? 'سجل الآن' : 'Register Now'}
              >
                {lang === 'ar' ? 'سجل الآن' : 'Register Now'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all hover:scale-105 flex items-center gap-2 border focus:ring-2 focus:ring-blue-500/70 outline-none ${
                  theme === 'light'
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-400'
                    : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                }`}
                aria-label={lang === 'ar' ? 'جدول الأعمال' : 'View Agenda'}
              >
                {lang === 'ar' ? 'جدول الأعمال' : 'View Agenda'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <div className="pt-4">
              <p className={`text-xs uppercase tracking-widest mb-3 ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>{t.hero.countdown_label}</p>
              <CountdownTimer targetDate="2026-01-27T09:00:00" theme={theme} />
            </div>
          </RevealOnScroll>
        </div>
        
        <RevealOnScroll delay={200} className="hidden lg:block">
          <div className="relative">
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
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t.stats.attendees}</p>
                  <div className="text-4xl font-bold text-white">5K+</div>
                </div>
              </div>
              <div className={`h-px w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`}></div>
              <div className="mt-8 flex items-center gap-4">
                <SummitLogo className="w-16 h-16" />
                <div>
                  <p className="text-white font-bold">Baghdad AI Summit</p>
                  <p className="text-gray-400 text-sm">The Station, Baghdad</p>
                </div>
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
const StatsSection = memo(({ t, theme, siteContent, getSetting }) => {
  const stats = useMemo(() => [
    { end: getSetting('stats_attendees', 5000), label: t.stats.attendees, icon: Users },
    { end: getSetting('stats_speakers', 120), label: t.stats.speakers, icon: Mic },
    { end: getSetting('stats_exhibitors', 100), label: t.stats.exhibitors, icon: Store },
  ], [t.stats.attendees, t.stats.speakers, t.stats.exhibitors, getSetting, siteContent]);

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
const SpeakerCard = memo(({ speaker, theme, index = 0, lang = 'en', getLocalizedSpeaker }) => {
  // Get localized speaker data if function is provided
  const localizedSpeaker = getLocalizedSpeaker 
    ? getLocalizedSpeaker(speaker, lang) 
    : { name: speaker.name, role: speaker.role, company: speaker.company };
  
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
        alt={localizedSpeaker.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
      
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <button 
            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500/70 outline-none" 
            aria-label={`View ${localizedSpeaker.name} on LinkedIn`}
          >
            <Linkedin size={14} />
          </button>
          <button 
            className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 focus:ring-2 focus:ring-cyan-500/70 outline-none" 
            aria-label={`View ${localizedSpeaker.name} on Twitter`}
          >
            <Twitter size={14} />
          </button>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{localizedSpeaker.name}</h3>
        <p className="text-blue-400 text-sm font-medium">{localizedSpeaker.company}</p>
      </div>
    </div>
    <div className={`p-4 ${
      theme === 'light' ? 'bg-white' : 'bg-[#010614]'
    }`}>
       <p className={`text-xs uppercase tracking-wider ${
         theme === 'light' ? 'text-gray-600' : 'text-gray-400'
       }`}>{localizedSpeaker.role}</p>
    </div>
    </motion.div>
  );
});

// Speakers Section - Updated to receive speakers as prop
const SpeakersSection = memo(({ t, theme, speakers, loading, lang, getLocalizedSpeaker }) => {
  return (
    <section id="speakers" className={`py-24 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00030a]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeading title={t.speakers.title} subtitle={t.speakers.subtitle} theme={theme} />
        </RevealOnScroll>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx}
                className={`rounded-xl overflow-hidden border animate-pulse ${
                  theme === 'light'
                    ? 'bg-gray-200 border-gray-200'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="aspect-[4/5]"></div>
                <div className="p-4">
                  <div className={`h-4 rounded ${theme === 'light' ? 'bg-gray-300' : 'bg-white/10'}`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {speakers.map((speaker, idx) => (
              <SpeakerCard 
                key={speaker.id} 
                speaker={speaker} 
                theme={theme} 
                index={idx} 
                lang={lang}
                getLocalizedSpeaker={getLocalizedSpeaker}
              />
            ))}
          </div>
        )}
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
  const [showSpeakers, setShowSpeakers] = useState(true);
  const [checkingSpeakers, setCheckingSpeakers] = useState(true);
  
  // Fetch speakers from Supabase (with fallback to static data)
  const { speakers, loading: speakersLoading, getLocalizedSpeaker } = useSpeakers();
  
  // Fetch site content from Supabase CMS
  const { settings: siteContent, loading: contentLoading, getSetting, getLocalizedSetting } = useSiteContent();

  // Check if speakers should be shown
  useEffect(() => {
    const checkShowSpeakers = async () => {
      setCheckingSpeakers(true);
      try {
        const shouldShow = await settingsService.isShowSpeakers();
        setShowSpeakers(shouldShow);
      } catch (err) {
        console.error('Error checking show_speakers setting:', err);
        // Default to showing if check fails
        setShowSpeakers(true);
      } finally {
        setCheckingSpeakers(false);
      }
    };
    checkShowSpeakers();
  }, []);

  const registerText = useMemo(() => lang === 'ar' ? 'سجل الآن مجاناً' : 'Register Now — It\'s Free', [lang]);

  return (
    <>
      <AttendingNowCounter theme={theme} lang={lang} />
      <Hero t={t} lang={lang} theme={theme} siteContent={siteContent} getLocalizedSetting={(key, fallback) => getLocalizedSetting(key, lang, fallback)} />
      <Marquee theme={theme} />
      <StatsSection t={t} theme={theme} siteContent={siteContent} getSetting={getSetting} />
      {!checkingSpeakers && showSpeakers && (
        <SpeakersSection t={t} theme={theme} speakers={speakers} loading={speakersLoading} lang={lang} getLocalizedSpeaker={getLocalizedSpeaker} />
      )}
      <TestimonialsSection />
      
      {/* CTA Section */}
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
          <p className={`text-xl mb-12 max-w-2xl mx-auto ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Join thousands of innovators, researchers, and industry leaders at the most anticipated AI event in the Middle East.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register-attendee')}
              className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 flex items-center justify-center gap-3 focus:ring-2 focus:ring-blue-500/70 outline-none"
              aria-label={registerText}
            >
              {registerText}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

