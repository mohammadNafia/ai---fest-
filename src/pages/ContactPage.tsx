import React, { useState } from 'react';
import { Mail, Send, Globe, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const ContactPage = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Future integration with EmailJS
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Us',
      value: 'hello@aidevfest.com',
      link: 'mailto:hello@aidevfest.com',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: lang === 'ar' ? 'الموقع' : 'Location',
      value: lang === 'ar' ? 'المحطة، بغداد، العراق' : 'The Station, Baghdad, Iraq',
      link: 'https://maps.google.com',
      color: 'bg-cyan-500/10 text-cyan-500'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: lang === 'ar' ? 'الموقع الإلكتروني' : 'Website',
      value: 'www.aidevfest.com',
      link: 'https://www.aidevfest.com',
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {t.contact.title}
        </h1>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Contact Form & Application */}
        <div className="space-y-12">
          {/* Application Card */}
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] shadow-2xl relative overflow-hidden group ${
            theme === 'light' 
              ? 'bg-white border-blue-100 shadow-blue-100' 
              : 'bg-[#0a0a1a] border-white/10 shadow-blue-900/10'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
            
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-3 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Send className="text-blue-500" />
              {t.contact.apply_title}
            </h2>
            <p className={`mb-8 leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {t.contact.apply_desc}
            </p>
            <a 
              href="https://forms.google.com" // Google Form Link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/40 group/btn"
            >
              {t.contact.apply_button}
              <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-3xl border ${
            theme === 'light' ? 'bg-gray-50/50 border-gray-200' : 'bg-white/5 border-white/10'
          }`}>
            <h2 className={`text-2xl font-bold mb-8 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.contact.email_us}
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-bounceIn">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <Send size={30} />
                </div>
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {t.contact.success}
                </h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-blue-400'}`}>
                      {t.contact.form.name}
                    </label>
                    <input 
                      required
                      type="text" 
                      className={`w-full p-4 rounded-xl outline-none border transition-all ${
                        theme === 'light' 
                          ? 'bg-white border-gray-300 focus:border-blue-500' 
                          : 'bg-black/50 border-white/10 focus:border-blue-500 text-white'
                      }`}
                      placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Your full name'}
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-blue-400'}`}>
                      {t.contact.form.email}
                    </label>
                    <input 
                      required
                      type="email" 
                      className={`w-full p-4 rounded-xl outline-none border transition-all ${
                        theme === 'light' 
                          ? 'bg-white border-gray-300 focus:border-blue-500' 
                          : 'bg-black/50 border-white/10 focus:border-blue-500 text-white'
                      }`}
                      placeholder="email@example.com"
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-blue-400'}`}>
                    {t.contact.form.subject}
                  </label>
                  <input 
                    required
                    type="text" 
                    className={`w-full p-4 rounded-xl outline-none border transition-all ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 focus:border-blue-500' 
                        : 'bg-black/50 border-white/10 focus:border-blue-500 text-white'
                    }`}
                    placeholder={lang === 'ar' ? 'موضوع الرسالة' : 'What is this about?'}
                    value={formState.subject}
                    onChange={e => setFormState({...formState, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-blue-400'}`}>
                    {t.contact.form.message}
                  </label>
                  <textarea 
                    required
                    rows={5}
                    className={`w-full p-4 rounded-xl outline-none border transition-all resize-none ${
                      theme === 'light' 
                        ? 'bg-white border-gray-300 focus:border-blue-500' 
                        : 'bg-black/50 border-white/10 focus:border-blue-500 text-white'
                    }`}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
                    isSubmitting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t.contact.form.submit}
                      <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Contact Info & Socials */}
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${
            theme === 'light' ? 'bg-white border-gray-200 shadow-xl shadow-gray-100' : 'bg-white/5 border-white/10 shadow-2xl shadow-black/20'
          }`}>
            <h2 className={`text-2xl font-bold mb-8 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {t.contact.contact_title}
            </h2>
            <p className={`mb-10 text-lg ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {t.contact.contact_desc}
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, idx) => (
                <a 
                  key={idx}
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all hover:translate-x-2 ${
                    theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase tracking-widest font-bold opacity-60 mb-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-white'
                    }`}>
                      {info.title}
                    </h4>
                    <p className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-gray-200'
                    }`}>
                      {info.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <h4 className={`text-sm font-bold mb-6 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {lang === 'ar' ? 'تابعنا على مواقع التواصل' : 'Follow our journey'}
              </h4>
              <div className="flex gap-4">
                {[
                  {
                    label: 'LinkedIn',
                    link: 'https://www.linkedin.com/company/aidevfest/',
                    color: 'bg-[#0077B5]',
                    icon: (
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )
                  },
                  {
                    label: 'Telegram',
                    link: 'https://t.me/AiDevFest',
                    color: 'bg-[#229ED9]',
                    icon: (
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 1 0 24 12 12.014 12.014 0 0 0 11.944 0zm4.962 7.224-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.24-.213-.054-.333-.373-.12l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.829.941z"/>
                      </svg>
                    )
                  },
                  {
                    label: 'Instagram',
                    link: 'https://instagram.com/aidevfest',
                    color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
                    icon: (
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                    )
                  }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Map Preview Placeholder */}
          <div className={`h-64 rounded-3xl border overflow-hidden relative group cursor-pointer ${
            theme === 'light' ? 'border-gray-200' : 'border-white/10'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
              alt="Map"
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 text-white py-2 px-4 rounded-full font-bold shadow-lg flex items-center gap-2 transform group-hover:scale-110 transition-all">
                <MapPin size={16} />
                {lang === 'ar' ? 'عرض على الخريطة' : 'Open in Maps'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
