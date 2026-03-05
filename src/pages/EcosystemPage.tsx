import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle, Loader2, ExternalLink, Zap, Users, Cpu, Handshake } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';
import { PARTNERS } from '@/data/partners';

// ─── EmailJS Config ──────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_uz44oys';
const EMAILJS_TEMPLATE_ID = 'template_ewfnz1e';
// ⚠️  Paste your Public Key below (EmailJS Dashboard → Account → API Keys)
const EMAILJS_PUBLIC_KEY  = 'NSSY9dVV8mBQ0IZr6';
// ─────────────────────────────────────────────────────────────────────────────



const APPLY_LINK = 'https://forms.gle/62zB4DukHodznX9K8';

const PARTNER_CARDS = [
  { icon: Zap,       titleEn: 'Sponsor',        titleAr: 'رعاية',          descEn: 'Amplify your brand in front of 1,000+ AI professionals.',     descAr: 'عزز علامتك التجارية أمام أكثر من ١٠٠٠ محترف في الذكاء الاصطناعي.' },
  { icon: Users,     titleEn: 'Speaker',         titleAr: 'متحدث',          descEn: 'Share your expertise on the biggest AI stage in Iraq.',        descAr: 'شارك خبرتك على أكبر منصة للذكاء الاصطناعي في العراق.' },
  { icon: Cpu,       titleEn: 'Exhibitor',        titleAr: 'عارض',           descEn: 'Showcase your AI product or startup to a targeted audience.', descAr: 'اعرض منتجك أو شركتك الناشئة أمام جمهور متخصص.' },
  { icon: Handshake, titleEn: 'Media Partner',   titleAr: 'شريك إعلامي',   descEn: 'Collaborate on coverage and expand your media reach.',         descAr: 'تعاون في التغطية ووسع انتشارك الإعلامي.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

// ─── ApplySection ─────────────────────────────────────────────────────────────
const ApplySection: React.FC<{ theme: string; lang: string }> = ({ theme, lang }) => (
  <section className={`py-28 relative overflow-hidden transition-colors duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
  }`}>
    {theme === 'dark' && (
      <>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      </>
    )}

    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <SectionHeading
          title={lang === 'ar' ? 'البيئة التقنية' : 'The Ecosystem'}
          subtitle={lang === 'ar' ? 'كن شريكاً في بناء مستقبل الذكاء الاصطناعي في العراق.' : 'Be part of building the future of AI in Iraq.'}
          theme={theme as any}
        />
      </RevealOnScroll>

      {/* Partner cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {PARTNER_CARDS.map(({ icon: Icon, titleEn, titleAr, descEn, descAr }) => (
          <motion.div
            key={titleEn}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group p-8 rounded-2xl border cursor-default transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl shadow-sm'
                : 'bg-white/5 border-white/10 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
              theme === 'light'
                ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                : 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
            }`}>
              <Icon size={22} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${ theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {lang === 'ar' ? titleAr : titleEn}
            </h3>
            <p className={`text-sm leading-relaxed ${ theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {lang === 'ar' ? descAr : descEn}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Apply Here CTA */}
      <RevealOnScroll>
        <div className={`relative rounded-3xl p-12 md:p-16 text-center overflow-hidden border ${
          theme === 'light'
            ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
            : 'bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/20'
        }`}>
          {theme === 'dark' && (
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
          )}
          <div className="relative z-10">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${
              theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-600/20 text-blue-300'
            }`}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {lang === 'ar' ? 'التقديم مفتوح' : 'Applications Open'}
            </span>

            <h2 className={`text-4xl md:text-5xl font-bold mb-5 tracking-tight ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {lang === 'ar' ? 'تقدم هنا' : 'Apply Here'}
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {lang === 'ar'
                ? 'سواء كنت راعياً أو متحدثاً أو عارضاً، دعنا نبني هذا المستقبل معاً.'
                : "Whether you're a sponsor, speaker, or exhibitor — let's build this future together."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={APPLY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.55)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              >
                {lang === 'ar' ? 'ابدأ التقديم' : 'Start Your Application'}
                <ExternalLink size={20} />
              </a>
              <button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-10 py-4 rounded-full font-bold text-lg border transition-all hover:scale-105 flex items-center gap-3 focus:ring-2 focus:ring-blue-500/70 outline-none ${
                    theme === 'light'
                      ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                  }`}
              >
                {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
);

const SponsorsSection: React.FC<{ theme: string; lang: string }> = ({ theme, lang }) => (
  <section className={`py-24 transition-colors duration-300 ${
    theme === 'light' ? 'bg-gray-50' : 'bg-[#00030a]'
  }`}>
    <div className="max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <SectionHeading
          title={lang === 'ar' ? 'الرعاة والشركاء' : 'Sponsors & Partners'}
          subtitle={lang === 'ar' ? 'المؤسسات التي تدعم الابتكار في العراق.' : 'The organizations supporting innovation in Iraq.'}
          theme={theme as any}
        />
      </RevealOnScroll>

      <div className="space-y-12">
        {PARTNERS.map((partner, idx) => (
          <RevealOnScroll key={partner.id} delay={idx * 100}>
            <div className={`p-8 md:p-12 rounded-3xl border transition-all hover:shadow-xl ${
              theme === 'light'
                ? 'bg-white border-gray-200 hover:border-blue-300'
                : 'bg-white/5 border-white/10 hover:border-blue-500/30'
            }`}>
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className={`w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-white p-4 flex items-center justify-center ${
                    theme === 'light' ? 'border border-gray-100' : ''
                }`}>
                  <img src={partner.image} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
                    theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    {partner.category}
                  </span>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {partner.name}
                  </h3>
                  <p className={`text-lg leading-relaxed ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {partner.description}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

// ─── Contact Form ─────────────────────────────────────────────────────────────
type FormState = 'idle' | 'sending' | 'success' | 'error';

const ContactSection: React.FC<{ theme: string; lang: string }> = ({ theme, lang }) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    try {
      // ── Live EmailJS send ─────────────────────────────────────────────────
      const emailjs = await import('@emailjs/browser');
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      // ─────────────────────────────────────────────────────────────────────

      setFormState('success');
      setForm({ from_name: '', from_email: '', message: '' });
    } catch {
      setFormState('error');
    }
  };

  const inputBase = `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/50 ${
    theme === 'light'
      ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
      : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/60'
  }`;

  return (
    <section className={`py-24 transition-colors duration-300 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#00030a]'
    }`}>
      <div id="contact-form" className="max-w-3xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeading
            title={lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            subtitle={lang === 'ar'
              ? 'لديك سؤال أو استفسار؟ نحن هنا للمساعدة.'
              : 'Have a question or inquiry? We\'re here to help.'}
            theme={theme as any}
          />
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className={`rounded-3xl border p-8 md:p-12 shadow-xl transition-colors ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#010614] border-white/10'
          }`}>
            {formState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${ theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {lang === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}
                </h3>
                <p className={`${ theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {lang === 'ar' ? 'سنتواصل معك في أقرب وقت ممكن.' : "We'll get back to you as soon as possible."}
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-8 px-6 py-2.5 rounded-full border border-blue-500/40 text-blue-400 text-sm hover:bg-blue-500/10 transition-all"
                >
                  {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <User size={12} className="inline mr-1" />
                      {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={form.from_name}
                      onChange={handleChange}
                      placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                      required
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <Mail size={12} className="inline mr-1" />
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      value={form.from_email}
                      onChange={handleChange}
                      placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'}
                      required
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <MessageSquare size={12} className="inline mr-1" />
                    {lang === 'ar' ? 'رسالتك' : 'Your Message'}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    required
                    className={`${inputBase} resize-none`}
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-red-400 text-sm text-center">
                    {lang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                >
                  {formState === 'sending' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                    </>
                  )}
                </button>

                <p className={`text-center text-xs ${ theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lang === 'ar'
                    ? 'أو تواصل معنا مباشرةً عبر البريد الإلكتروني'
                    : 'Or reach us directly at'}{' '}
                  <a
                    href="mailto:aidevfest.iraq@gmail.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    aidevfest.iraq@gmail.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

// ─── Main EcosystemPage ───────────────────────────────────────────────────────
const EcosystemPage: React.FC = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`}>
      <ApplySection theme={theme} lang={lang} />
      <SponsorsSection theme={theme} lang={lang} />
      <ContactSection theme={theme} lang={lang} />
    </div>
  );
};

export default EcosystemPage;
