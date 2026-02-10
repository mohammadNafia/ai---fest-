import React, { useState, useEffect, useRef, Suspense } from 'react';
import { openGoogleCalendar } from '@/utils/calendarExport.js';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Mic, 
  Store, 
  ChevronRight, 
  ArrowRight,
  Brain,
  Rocket,
  Handshake,
  Megaphone,
  Award,
  X,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle2,
  Languages,
  Upload,
  Building2,
  Cpu,
  Radio,
  UserPlus,
  MessageCircle,
  Sun,
  Moon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  LogIn,
  UserPlus as UserPlusIcon,
  ArrowUp
} from 'lucide-react';

// --- TRANSLATIONS ---

// Muammal : change in names ( AI summit -> Ai Dev Fest ) ("Time", "Location", "Watch 2025 Recap") 
const CONTENT = {
  en: {
    nav: { home: 'Home', about: 'About', agenda: 'Agenda', ecosystem: 'Ecosystem', register: 'Register Now', signIn: 'Sign In' },
    hero: {
      date: "January 27, 2026 • The Station",
      title_prefix: "Bridging",
      title_highlight: "Intelligence",
      subtitle: "The premier artificial intelligence Festival in the Middle East. Join our community of Ai innovators in the mission of shaping the future of Mesopotamia.",
      cta_agenda: "View Agenda",
      cta_watch: "Event Page",
      countdown_label: "Time Until Summit"
    },
    stats: { attendees: "Attendees", speakers: "Speakers", exhibitors: "Exhibitors" },
    speakers: { title: "World Class Minds", subtitle: "Learn from the pioneers defining the boundaries of artificial intelligence." },
    ecosystem: { 
      title: "The Ecosystem", 
      subtitle: "Partner with us to build the future.", 
      apply: "Apply Now",
      modal_title: "Partnership Application",
      step1: "Organization Info",
      step2: "Requirements",
      step3: "Review",
      next: "Next Step",
      submit: "Submit Application"
    },
    forms: {
      general_title: "Attendee Registration",
      speaker_title: "Call for Speakers",
      name: "Full Name",
      occupation: "Occupation Status",
      institution: "Institution / Company",
      age: "Age",
      email: "Email Address",
      phone: "Phone Number",
      motivation: "Why are you interested?",
      skills: "Technical Skills",
      experience: "Have you spoken at other events?",
      achievements: "Key Achievements",
      topics: "Proposed Topics",
      submit: "Submit Registration",
      success: "Registration Received!"
    },
    chatbot: {
      title: "AI Assistant",
      welcome: "How can I help you today?",
      faq_event_date: "Event date & time",
      faq_location: "Location",
      faq_register: "How to register",
      faq_speaker: "Speaker application",
      faq_partnership: "Partnership opportunities",
      placeholder: "Type your question...",
      quickQuestions: [
        "Event date & time",
        "Location & venue",
        "How to register",
        "Speaker application",
        "Partnership opportunities"
      ],
      cannedAnswers: {
        event_date: "The Baghdad AI Summit 2026 will take place on April 4, 2026 at The Station. Registration opens at 9:00 AM.",
        location: "The summit will be held at The Station. Detailed directions and parking information will be sent to registered attendees.",
        register: "You can register by clicking the 'Register Now' button in the navigation bar. Fill out the registration form with your details, and you'll receive a confirmation email shortly.",
        speaker: "To apply as a speaker, visit the Ecosystem page and click on the 'Speakers' card. Fill out the speaker application form with your proposed topics and experience.",
        partnership: "For partnership opportunities, visit the Ecosystem page and select the relevant partnership type (Sponsor, Exhibitor, Media, etc.). Our team will review your application and contact you.",
        default: "Thanks! A member of the Baghdad AI Summit team will contact you soon."
      }
    },
    auth: {
      signIn: "Sign In",
      createAccount: "Create Account",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot password?",
      continueWithGoogle: "Continue with Google",
      name: "Full Name",
      submit: "Submit",
      signInTitle: "Welcome back",
      createAccountTitle: "Join the Summit"
    },
    admin: {
      login: "Admin Login",
      dashboard: "Dashboard",
      attendees: "Attendees",
      speakers: "Speakers",
      partners: "Partners",
      logout: "Logout",
      totalRegistrations: "Total Registrations",
      totalSpeakers: "Total Speakers",
      totalPartners: "Total Partnership Requests",
      dailySubmissions: "Daily Submissions",
      search: "Search...",
      name: "Name",
      email: "Email",
      phone: "Phone",
      dateSubmitted: "Date Submitted",
      occupation: "Occupation",
      institution: "Institution",
      topics: "Topics",
      organization: "Organization",
      category: "Category",
      noData: "No data available",
      exportCSV: "Export CSV",
      exportJSON: "Export JSON",
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
      analytics: "Analytics",
      mostCommonOccupation: "Most Common Occupation",
      topPartnershipCategory: "Top Partnership Category"
    }
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'عن المهرجان', agenda: 'الجدول', ecosystem: 'البيئة التقنية', register: 'سجل الآن', signIn: 'تسجيل الدخول' },
    hero: {
      date: "يناير 27 2026 • المحطة",
      title_prefix: "جسر",
      title_highlight: "الذكاء الاصطناعي",
      subtitle: "المهرجان الرائد للذكاء الاصطناعي في الشرق الأوسط. انضم إلى مجتمع مبتكري الذكاء الأصطناعي في تشكيل مستقبل بلاد الرافدين.",
      cta_agenda: "عرض الجدول",
      cta_watch: "حساب الحدث",
      countdown_label: "الوقت المتبقي للمهرجان"
    },
    stats: { attendees: "حضور", speakers: "متحدثين", exhibitors: "عارضين" },
    speakers: { title: "عقول عالمية", subtitle: "تعلم من الرواد الذين يرسمون حدود الذكاء الاصطناعي." },
    ecosystem: { 
      title: "البيئة التقنية", 
      subtitle: "كن شريكاً في بناء المستقبل.", 
      apply: "قدم الآن",
      modal_title: "طلب الشراكة",
      step1: "معلومات المؤسسة",
      step2: "المتطلبات",
      step3: "مراجعة",
      next: "التالي",
      submit: "إرسال الطلب"
    },
    forms: {
      general_title: "تسجيل الحضور",
      speaker_title: "دعوة للمتحدثين",
      name: "الاسم الكامل",
      occupation: "الحالة الوظيفية",
      institution: "المؤسسة / الشركة",
      age: "العمر",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      motivation: "لماذا أنت مهتم بهذا الحدث؟",
      skills: "المهارات التقنية",
      experience: "هل تحدثت في فعاليات أخرى؟",
      achievements: "أهم الإنجازات",
      topics: "المواضيع المقترحة",
      submit: "إرسال التسجيل",
      success: "تم استلام الطلب!"
    },
    chatbot: {
      title: "مساعد الذكاء الاصطناعي",
      welcome: "كيف يمكنني مساعدتك اليوم؟",
      faq_event_date: "تاريخ ووقت الحدث",
      faq_location: "الموقع",
      faq_register: "كيفية التسجيل",
      faq_speaker: "طلب المتحدثين",
      faq_partnership: "فرص الشراكة",
      placeholder: "اكتب سؤالك...",
      quickQuestions: [
        "تاريخ ووقت الحدث",
        "الموقع والقاعة",
        "كيفية التسجيل",
        "طلب المتحدثين",
        "فرص الشراكة"
      ],
      cannedAnswers: {
        event_date: "ستقام قمة بغداد للذكاء الاصطناعي 2026 في الرابع من ابريل 2026 في المحطة. يفتح التسجيل الساعة 9:00 صباحاً.",
        location: "ستقام القمة في المحطة. سيتم إرسال الاتجاهات التفصيلية ومعلومات المواقف للمسجلين.",
        register: "يمكنك التسجيل بالنقر على زر 'سجل الآن' في شريط التنقل. املأ نموذج التسجيل ببياناتك، وستتلقى بريداً إلكترونياً للتأكيد قريباً.",
        speaker: "للتقديم كمتحدث، زر صفحة البيئة التقنية وانقر على بطاقة 'المتحدثين'. املأ نموذج طلب المتحدثين بمواضيعك المقترحة وخبرتك.",
        partnership: "لفرص الشراكة، زر صفحة البيئة التقنية واختر نوع الشراكة المناسب (راعي، عارض، إعلامي، إلخ). سيراجع فريقنا طلبك ويتصل بك.",
        default: "شكراً! سيتصل بك أحد أعضاء فريق قمة بغداد للذكاء الاصطناعي قريباً."
      }
    },
    auth: {
      signIn: "تسجيل الدخول",
      createAccount: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      continueWithGoogle: "المتابعة مع جوجل",
      name: "الاسم الكامل",
      submit: "إرسال",
      signInTitle: "مرحباً بعودتك",
      createAccountTitle: "انضم إلى القمة"
    },
    admin: {
      login: "تسجيل دخول المشرف",
      dashboard: "لوحة التحكم",
      attendees: "المشاركون",
      speakers: "المتحدثون",
      partners: "الشركاء",
      logout: "تسجيل الخروج",
      totalRegistrations: "إجمالي التسجيلات",
      totalSpeakers: "إجمالي المتحدثين",
      totalPartners: "إجمالي طلبات الشراكة",
      dailySubmissions: "التسجيلات اليومية",
      search: "بحث...",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      dateSubmitted: "تاريخ الإرسال",
      occupation: "المهنة",
      institution: "المؤسسة",
      topics: "المواضيع",
      organization: "المنظمة",
      category: "الفئة",
      noData: "لا توجد بيانات",
      exportCSV: "تصدير CSV",
      exportJSON: "تصدير JSON",
      page: "صفحة",
      of: "من",
      previous: "السابق",
      next: "التالي",
      analytics: "التحليلات",
      mostCommonOccupation: "المهنة الأكثر شيوعاً",
      topPartnershipCategory: "فئة الشراكة الأكثر طلباً"
    }
  }
};

// --- HOOKS & UTILS ---

const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, countRef };
};

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- COMPONENTS ---

// Logo Component with Fallback
const SummitLogo = ({ className = "w-12 h-12" }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`${className} flex items-center justify-center`}>
      {!imgError ? (
        <img 
          src="/Summit-Logo.png" 
          alt="Baghdad AI Summit Logo" 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-white/10 rounded flex items-center justify-center border border-white/20">
           {/* Fallback if image missing: A stylized B for Baghdad */}
           <span className="text-white font-bold text-xs">AI</span>
        </div>
      )}
    </div>
  );
};

const CountdownTimer = ({ theme = 'dark' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// Muammal : change in counter time
  useEffect(() => {
    const targetDate = new Date("April 4, 2026 09:00:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3 md:gap-4 mt-8 justify-start">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className={`w-14 h-14 md:w-20 md:h-20 backdrop-blur-md rounded-lg flex items-center justify-center ${
            theme === 'light'
              ? 'bg-blue-100/80 border border-blue-300'
              : 'bg-blue-900/20 border border-blue-500/30'
          }`}>
            <span className={`text-xl md:text-3xl font-bold font-mono ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {value < 10 ? `0${value}` : value}
            </span>
          </div>
          <p className={`text-[10px] uppercase tracking-widest mt-2 ${
            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`}>{unit}</p>
        </div>
      ))}
    </div>
  );
};

// --- CHATBOT COMPONENT ---

const Chatbot = ({ t, lang, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const faqButtons = [
    { key: 'faq_event_date', answerKey: 'event_date', icon: Calendar },
    { key: 'faq_location', answerKey: 'location', icon: MapPin },
    { key: 'faq_register', answerKey: 'register', icon: UserPlus },
    { key: 'faq_speaker', answerKey: 'speaker', icon: Mic },
    { key: 'faq_partnership', answerKey: 'partnership', icon: Handshake }
  ];

  useEffect(() => {
    if (isOpen && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const handleFAQClick = (faq) => {
    const userMessage = t.chatbot[faq.key];
    const assistantMessage = t.chatbot.cannedAnswers[faq.answerKey];
    
    setMessages(prev => [
      ...prev,
      { type: 'user', text: userMessage },
      { type: 'assistant', text: assistantMessage }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'assistant', text: t.chatbot.cannedAnswers.default }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          theme === 'light' ? 'shadow-blue-400/30' : ''
        }`}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className={`fixed ${lang === 'ar' ? 'left-6' : 'right-6'} bottom-24 z-50 w-96 max-w-[calc(100vw-3rem)] ${
          theme === 'light' 
            ? 'bg-white/95 backdrop-blur-xl border border-blue-200/50 shadow-2xl' 
            : 'bg-[#0a0a1a]/95 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
        } rounded-2xl flex flex-col max-h-[500px] transition-all duration-300 animate-slide-up`}>
          {/* Header */}
          <div className={`p-4 border-b ${
            theme === 'light' ? 'border-gray-200 bg-gradient-to-r from-blue-50 to-transparent' : 'border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent'
          } flex justify-between items-center rounded-t-2xl`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center ${
                theme === 'light' ? 'shadow-lg' : ''
              }`}>
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t.chatbot.title}</h3>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{t.chatbot.welcome}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-full transition-colors ${
                theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[200px]">
            {/* Show FAQ buttons only when no messages */}
            {messages.length === 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {faqButtons.map((faq, idx) => {
                  const Icon = faq.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleFAQClick(faq)}
                      className={`p-3 rounded-xl text-left transition-all hover:scale-105 ${
                        theme === 'light'
                          ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100 text-gray-800'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <Icon size={16} className={`mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                      <p className="text-xs font-medium">{t.chatbot[faq.key]}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? (lang === 'ar' ? 'justify-start' : 'justify-end') : (lang === 'ar' ? 'justify-end' : 'justify-start')}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        msg.type === 'user'
                          ? theme === 'light'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : theme === 'light'
                          ? 'bg-gray-100 text-gray-900 border border-gray-200'
                          : 'bg-white/10 text-gray-200 border border-white/20'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${
            theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#0a0a1a]'
          } rounded-b-2xl`}>
            <div className={`flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.chatbot.placeholder}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    : 'bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:border-blue-500'
                }`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'light'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

// --- AUTHENTICATION MODAL ---

const AuthModal = ({ onClose, t, lang, theme }) => {
  const [activeTab, setActiveTab] = useState('signIn');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'createAccount' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (activeTab === 'createAccount') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    }
  };

  const handleGoogleSignIn = () => {
    // UI only - no backend
    console.log('Google Sign In clicked');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto ${
      theme === 'light' ? 'bg-black/60' : ''
    }`}>
      <div className={`w-full max-w-md ${
        theme === 'light'
          ? 'bg-white border border-blue-200/50 shadow-2xl'
          : 'bg-[#0a0a1a] border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
      } rounded-2xl flex flex-col max-h-[90vh] my-auto relative overflow-hidden`}>
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-20 blur-xl -z-10"></div>
        
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'light' ? 'border-gray-200 bg-gradient-to-r from-blue-50 to-transparent' : 'border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent'
        } flex justify-between items-center flex-shrink-0`}>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {activeTab === 'signIn' ? t.auth.signInTitle : t.auth.createAccountTitle}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${
          theme === 'light' ? 'border-gray-200' : 'border-white/10'
        }`}>
          <button
            onClick={() => {
              setActiveTab('signIn');
              setErrors({});
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }}
            className={`flex-1 py-4 px-6 font-medium transition-all relative ${
              activeTab === 'signIn'
                ? theme === 'light'
                  ? 'text-blue-600'
                  : 'text-blue-400'
                : theme === 'light'
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            {t.auth.signIn}
            {activeTab === 'signIn' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === 'light' ? 'bg-blue-600' : 'bg-blue-500'
              }`}></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('createAccount');
              setErrors({});
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }}
            className={`flex-1 py-4 px-6 font-medium transition-all relative ${
              activeTab === 'createAccount'
                ? theme === 'light'
                  ? 'text-blue-600'
                  : 'text-blue-400'
                : theme === 'light'
                ? 'text-gray-600'
                : 'text-gray-400'
            }`}
          >
            {t.auth.createAccount}
            {activeTab === 'createAccount' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                theme === 'light' ? 'bg-blue-600' : 'bg-blue-500'
              }`}></div>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className={`w-full py-3.5 px-4 rounded-lg font-medium text-sm transition-all mb-6 flex items-center justify-center gap-3 ${
              theme === 'light'
                ? 'bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:bg-blue-50'
                : 'bg-white/5 border-2 border-white/10 hover:border-blue-500/50 text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{t.auth.continueWithGoogle}</span>
          </button>

          <div className={`relative mb-6 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-center text-sm`}>
            <div className={`absolute inset-0 flex items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 border-t ${theme === 'light' ? 'border-gray-300' : 'border-white/10'}`}></div>
              <span className="px-4">or</span>
              <div className={`flex-1 border-t ${theme === 'light' ? 'border-gray-300' : 'border-white/10'}`}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'createAccount' && (
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-blue-400'
                }`}>
                  <User size={14} />
                  {t.auth.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg transition-all outline-none ${
                    theme === 'light'
                      ? errors.name
                        ? 'bg-white border-2 border-red-400 text-gray-900'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                      : errors.name
                      ? 'bg-black/50 border-2 border-red-500 text-white'
                      : 'bg-black/50 border border-white/10 text-white focus:border-blue-500'
                  }`}
                  placeholder={t.auth.name}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-blue-400'
              }`}>
                <Mail size={14} />
                {t.auth.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg transition-all outline-none ${
                  theme === 'light'
                    ? errors.email
                      ? 'bg-white border-2 border-red-400 text-gray-900'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                    : errors.email
                    ? 'bg-black/50 border-2 border-red-500 text-white'
                    : 'bg-black/50 border border-white/10 text-white focus:border-blue-500'
                }`}
                placeholder={t.auth.email}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-blue-400'
              }`}>
                <Lock size={14} />
                {t.auth.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-lg transition-all outline-none ${
                    theme === 'light'
                      ? errors.password
                        ? 'bg-white border-2 border-red-400 text-gray-900'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                      : errors.password
                      ? 'bg-black/50 border-2 border-red-500 text-white'
                      : 'bg-black/50 border border-white/10 text-white focus:border-blue-500'
                  }`}
                  placeholder={t.auth.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  } hover:opacity-70 transition-opacity`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {activeTab === 'createAccount' && (
              <div className="space-y-2">
                <label className={`text-sm font-medium flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-blue-400'
                }`}>
                  <Lock size={14} />
                  {t.auth.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 rounded-lg transition-all outline-none ${
                      theme === 'light'
                        ? errors.confirmPassword
                          ? 'bg-white border-2 border-red-400 text-gray-900'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                        : errors.confirmPassword
                        ? 'bg-black/50 border-2 border-red-500 text-white'
                        : 'bg-black/50 border border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder={t.auth.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    } hover:opacity-70 transition-opacity`}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {activeTab === 'signIn' && (
              <div className={`flex ${lang === 'ar' ? 'flex-row-reverse justify-start' : 'justify-end'}`}>
                <button
                  type="button"
                  className={`text-sm transition-colors ${
                    theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-lg font-bold text-white transition-all mt-6 ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.auth.submit}...
                </span>
              ) : (
                t.auth.submit
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- FORMS & MODALS ---

const ModalBase = ({ title, onClose, children, theme = 'dark' }) => (
  <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto ${
    theme === 'light' ? 'bg-black/60' : 'bg-black/80'
  }`}>
    <div className={`w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] my-auto ${
      theme === 'light'
        ? 'bg-white border border-blue-200/50 shadow-2xl'
        : 'bg-[#0a0a1a] border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b flex justify-between items-center flex-shrink-0 rounded-t-2xl ${
        theme === 'light'
          ? 'border-gray-200 bg-gradient-to-r from-blue-50 to-transparent'
          : 'border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent'
      }`}>
        <h3 className={`text-2xl font-bold mb-1 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>{title}</h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors ${
            theme === 'light'
              ? 'hover:bg-gray-100 text-gray-600'
              : 'hover:bg-white/10 text-gray-400 hover:text-white'
          }`}
        >
          <X size={24} />
        </button>
      </div>
      {/* Body */}
      <div className="p-8 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

const GeneralRegistrationForm = ({ onClose, t, theme = 'dark' }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    institution: '',
    age: '',
    email: '',
    phone: '',
    motivation: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('attendees') || '[]');
    const newEntry = {
      ...formData,
      dateSubmitted: new Date().toISOString()
    };
    localStorage.setItem('attendees', JSON.stringify([...existing, newEntry]));
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t.forms.success}</h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>See you in Baghdad!</p>
        </div>
      </ModalBase>
    );
  }

  const inputClass = theme === 'light'
    ? 'w-full bg-gray-50 border border-gray-300 rounded p-3 text-gray-900 focus:border-blue-500 outline-none'
    : 'w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none';
  const labelClass = theme === 'light' ? 'text-sm text-blue-600' : 'text-sm text-blue-400';

  return (
    <ModalBase title={t.forms.general_title} onClose={onClose} theme={theme}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.name}</label>
            <input required type="text" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.age}</label>
            <input required type="number" className={inputClass} value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.occupation}</label>
            <select className={inputClass} value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})}>
              <option value="">Select...</option>
              <option>Student</option>
              <option>Employee</option>
              <option>Self-Employed</option>
              <option>Researcher</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.institution}</label>
            <input required type="text" className={inputClass} placeholder="University / Company" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.email}</label>
            <input required type="email" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.phone}</label>
            <input required type="tel" className={inputClass} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{t.forms.motivation}</label>
          <textarea required className={`${inputClass} h-24`} value={formData.motivation} onChange={(e) => setFormData({...formData, motivation: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all mt-4">
          {t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

const SpeakerRegistrationForm = ({ onClose, t, theme = 'dark' }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    topics: '',
    experience: '',
    achievements: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('speakers') || '[]');
    const newEntry = {
      ...formData,
      dateSubmitted: new Date().toISOString()
    };
    localStorage.setItem('speakers', JSON.stringify([...existing, newEntry]));
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.speaker_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t.forms.success}</h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>We will review your proposal.</p>
        </div>
      </ModalBase>
    );
  }

  const inputClass = theme === 'light'
    ? 'w-full bg-gray-50 border border-gray-300 rounded p-3 text-gray-900 focus:border-purple-500 outline-none'
    : 'w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none';
  const labelClass = theme === 'light' ? 'text-sm text-purple-600' : 'text-sm text-purple-400';

  return (
    <ModalBase title={t.forms.speaker_title} onClose={onClose} theme={theme}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.name}</label>
            <input required type="text" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.age}</label>
            <input required type="number" className={inputClass} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.occupation}</label>
            <select className={inputClass}>
              <option>Student</option>
              <option>Employee</option>
              <option>Self-Employed</option>
              <option>Researcher</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.institution}</label>
            <input required type="text" className={inputClass} placeholder="University / Company" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.email}</label>
            <input required type="email" className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>{t.forms.phone}</label>
            <input required type="tel" className={inputClass} />
          </div>
        </div>

        {/* Professional Info */}
        <div className="space-y-2">
          <label className={labelClass}>{t.forms.skills}</label>
          <input required type="text" className={inputClass} placeholder="e.g. Python, NLP, Robotics" />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{t.forms.experience}</label>
          <select className={inputClass}>
            <option value="no">No, this is my first time</option>
            <option value="yes">Yes, I have spoken before</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{t.forms.achievements}</label>
          <textarea className={`${inputClass} h-20`} placeholder="Awards, research papers, major projects..." />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{t.forms.topics}</label>
          <textarea required className={`${inputClass} h-20`} placeholder="What do you want to talk about?" />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>{t.forms.motivation}</label>
          <textarea required className={`${inputClass} h-20`} />
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-lg transition-all mt-4">
          {t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

// --- ECOSYSTEM MARQUEE ---

const PARTNERS = [
  { name: "Babel AI", category: "Startup", icon: Rocket, color: "text-blue-400" },
  { name: "TechCorp", category: "Sponsor", icon: Award, color: "text-purple-400" },
  { name: "Baghdad Post", category: "Media", icon: Megaphone, color: "text-pink-400" },
  { name: "Tigris VC", category: "Investor", icon: Handshake, color: "text-green-400" },
  { name: "Ur Data", category: "Startup", icon: Brain, color: "text-blue-400" },
  { name: "Future Iraq", category: "Sponsor", icon: Building2, color: "text-purple-400" },
  { name: "Cloud Sys", category: "Exhibitor", icon: Store, color: "text-orange-400" },
  { name: "Sumer Robotics", category: "Startup", icon: Cpu, color: "text-blue-400" },
  { name: "Euphrates Cap", category: "Investor", icon: Handshake, color: "text-green-400" },
  { name: "Tech News ME", category: "Media", icon: Radio, color: "text-pink-400" },
];

const EcosystemMarquee = ({ theme }) => (
  <div className={`w-full border-y overflow-hidden py-10 mb-16 relative transition-colors duration-300 ${
    theme === 'light'
      ? 'bg-gray-100/50 border-gray-200'
      : 'bg-white/5 border-white/10'
  }`}>
    <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r z-10 ${
      theme === 'light' ? 'from-gray-100/50 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l z-10 ${
      theme === 'light' ? 'from-gray-100/50 to-transparent' : 'from-[#00040F] to-transparent'
    }`}></div>
    
    <div className="flex w-full">
      <div className="whitespace-nowrap animate-scroll-slow flex gap-16 items-center min-w-full pl-16">
         {/* Tripled list for infinite scroll effect */}
         {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-pointer group hover:scale-105 tilt-3d shine-overlay">
              <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors ${p.color} ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-[#0a0a1a] border-white/10'
              }`}>
                 <p.icon size={32} />
              </div>
              <div className="text-center">
                <span className={`block font-bold text-sm tracking-wide ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>{p.name}</span>
                <span className={`block text-[10px] uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${
                  theme === 'light'
                    ? 'text-gray-600 bg-gray-200'
                    : 'text-gray-500 bg-white/5'
                }`}>{p.category}</span>
              </div>
            </div>
         ))}
      </div>
    </div>
    <style>{`
      @keyframes scroll-slow {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.33%); }
      }
      .animate-scroll-slow {
        animation: scroll-slow 40s linear infinite;
      }
      .animate-scroll-slow:hover {
        animation-play-state: paused;
      }
    `}</style>
  </div>
);

// --- PARTNERSHIP WIZARD ---

const PartnershipWizard = ({ onClose, t, theme = 'dark' }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    organization: '',
    email: '',
    category: '',
    dateSubmitted: new Date().toISOString()
  });

  const handleFinalSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('partners') || '[]');
    localStorage.setItem('partners', JSON.stringify([...existing, formData]));
    setSubmitted(true);
    setTimeout(onClose, 4000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.modal_title} onClose={onClose} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Application Received</h3>
          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Our sales team will be in contact with you shortly.</p>
        </div>
      </ModalBase>
    );
  }

  const inputClass = theme === 'light'
    ? 'w-full bg-gray-50 border border-gray-300 rounded p-3 text-gray-900 focus:border-blue-500 outline-none'
    : 'w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none';

  return (
    <ModalBase title={t.modal_title} onClose={onClose} theme={theme}>
        {/* Progress Bar */}
        <div className={`w-full h-1 mb-8 ${
          theme === 'light' ? 'bg-gray-200' : 'bg-gray-800'
        }`}>
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Body */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                    }`}>Organization Name</label>
                    <input type="text" className={inputClass} placeholder="e.g. Babel Tech" />
                 </div>
                 <div className="space-y-2">
                    <label className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                    }`}>Website</label>
                    <input type="text" className={inputClass} placeholder="https://..." />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                    }`}>Phone Number</label>
                    <input type="tel" className={inputClass} placeholder="+964..." />
                 </div>
                 <div className="space-y-2">
                    <label className={`text-sm ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                    }`}>Contact Email</label>
                    <input type="email" className={inputClass} placeholder="contact@company.com" />
                 </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}>Partnership Type</label>
                <select className={inputClass}>
                  <option>Sponsorship</option>
                  <option>Exhibitor Booth</option>
                  <option>Startup Fundraiser</option>
                  <option>Media Partner</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in text-center py-8">
              <div className={`border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer group ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  : 'border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5'
              }`}>
                <Upload className={`w-12 h-12 mx-auto mb-4 group-hover:text-blue-400 transition-colors ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <h4 className={`font-medium mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Request Details (PDF file)</h4>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-500'
                }`}>Requirements & Proposal (Max 10MB)</p>
              </div>
              <div className="text-left space-y-2">
                 <label className={`text-sm ${
                   theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                 }`}>Special Conditions</label>
                 <textarea className={`${inputClass} h-24`} placeholder="Any specific booth requirements or conditions?" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center py-4 space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className={`text-2xl font-bold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>Ready to Submit</h4>
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Review your details. Our sales team will be in contact with you.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`pt-6 mt-6 border-t flex justify-between items-center ${
          theme === 'light' ? 'border-gray-200' : 'border-white/10'
        }`}>
           {step > 1 ? (
             <button
               onClick={() => setStep(s => s-1)}
               className={`text-sm transition-colors ${
                 theme === 'light'
                   ? 'text-gray-600 hover:text-blue-600'
                   : 'text-gray-400 hover:text-white'
               }`}
             >
               Back
             </button>
           ) : <div></div>}
           
           <button 
             onClick={() => step < 3 ? setStep(s => s+1) : handleFinalSubmit()}
             className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
           >
             {step === 3 ? t.submit : t.next} <ChevronRight size={16} />
           </button>
        </div>
    </ModalBase>
  );
};

// --- DATA ---

const SPEAKERS = [
  { id: 1, name: "Dr. Amira Al-Baghdadi", role: "Chief AI Scientist", company: "Future Iraq Tech", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Prof. John Neural", role: "Director of Robotics", company: "Global AI Systems", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Layla Hassan", role: "Founder", company: "Tigris Valley Ventures", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Tariq Jameel", role: "Ethical AI Lead", company: "OpenMinds", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Sarah Chen", role: "VP Engineering", company: "DataFlow", image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Omar Farooq", role: "CEO", company: "Baghdad CyberSec", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" }
];

const AGENDA_ITEMS = [
  { time: "09:00 AM", title: "Registration & Networking", desc: "Welcome breakfast at the Grand Hall", type: "Logistics" },
  { time: "10:00 AM", title: "Opening Keynote: The New Era", desc: "How Baghdad is reclaiming its title as a center of wisdom.", type: "Keynote" },
  { time: "11:30 AM", title: "Panel: AI Infrastructure", desc: "Building the backbone of the digital Middle East.", type: "Panel" },
  { time: "02:00 PM", title: "Workshop: Generative AI", desc: "Practical applications for local businesses.", type: "Workshop" },
  { time: "04:00 PM", title: "Startup Pitch Battle", desc: "10 Startups, 1 Winner, $50k Prize.", type: "Competition" },
];

// --- COMPONENTS ---

const SectionHeading = ({ title, subtitle, align = "center", theme = 'dark' }) => (
  <div className={`mb-16 ${align === "left" ? "text-left" : "text-center"} gradient-underline`}>
    <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 ${
      theme === 'light' ? 'text-gray-900' : 'text-white'
    }`}>{title}</h2>
    <div className={`h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6 ${align === "left" ? "" : "mx-auto"} animate-fadeInUp`}></div>
    {subtitle && <p className={`text-lg max-w-2xl leading-relaxed font-light ${
      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
    }`}>{subtitle}</p>}
  </div>
);

const Navbar = ({ setPage, currentPage, lang, setLang, t, onRegister, onSignIn, theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      theme === 'light'
        ? scrolled
          ? 'bg-white/90 backdrop-blur-xl border-gray-200 py-2 md:py-3 lg:py-4 shadow-sm'
          : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
        : scrolled
        ? 'bg-[#00040F]/80 backdrop-blur-xl border-white/10 py-2 md:py-3 lg:py-4'
        : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setPage('Home')}
        >
          <SummitLogo />
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none tracking-wide ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>BAGHDAD</span>
            <span className={`text-[10px] tracking-[0.3em] font-bold uppercase mt-1 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`}>AI Summit 2026</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {Object.entries(t.nav).slice(0, 4).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key.charAt(0).toUpperCase() + key.slice(1))}
              className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
                currentPage.toLowerCase() === key
                  ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                  : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-yellow-600'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs transition-all ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-400'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            <Languages size={14} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* Sign In Button */}
          <button
            onClick={onSignIn}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              theme === 'light'
                ? 'text-gray-700 hover:text-blue-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.nav.signIn}
          </button>

          <button 
            onClick={onRegister}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]'
            }`}
          >
            {t.nav.register}
          </button>
          
          {/* Admin Link (hidden, accessible via keyboard shortcut or direct URL) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setPage('AdminLogin')}
              className={`px-3 py-1 text-xs opacity-50 hover:opacity-100 transition-opacity ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}
              title="Admin (Dev Only)"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ setPage, t, lang, theme }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative min-h-screen flex items-center pt-20 overflow-hidden transition-colors duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-white' : 'bg-[#00040F]'
    }`}>
      <div className="absolute inset-0 -z-10">
        {/* AI Aura Orbs */}
        <div 
          className={`ai-aura-orb absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-60 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/40'
              : 'bg-gradient-to-br from-blue-300/30 via-cyan-200/20 to-blue-400/30'
          }`}
          style={{
            top: '10%',
            left: '5%',
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        <div 
          className={`ai-aura-orb-reverse absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-60 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-500/40 via-blue-400/30 to-cyan-500/40'
              : 'bg-gradient-to-br from-purple-300/30 via-blue-200/20 to-cyan-300/30'
          }`}
          style={{
            top: '20%',
            right: '5%',
            transform: `translateY(${scrollY * 0.2}px)`
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

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
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

        {/* Live Countdown */}
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
            onClick={() => setPage('Agenda')}
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm transition-all flex items-center gap-2 min-h-[44px] ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-white text-black hover:bg-blue-50 active:bg-gray-100'
            }`}
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
};

const Marquee = ({ theme }) => (
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
      {[...Array(10)].map((_, i) => (
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

const StatCounter = ({ end, label, icon: Icon, theme }) => {
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
      onMouseDown={(e) => {
        e.currentTarget.classList.add('animate-press');
        setTimeout(() => e.currentTarget.classList.remove('animate-press'), 120);
      }}
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
};

const StatsSection = ({ t, theme }) => (
  <section id="stats" className={`py-24 relative overflow-hidden transition-colors duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
  }`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      <StatCounter end={5000} label={t.stats.attendees} icon={Users} theme={theme} />
      <StatCounter end={120} label={t.stats.speakers} icon={Mic} theme={theme} />
      <StatCounter end={100} label={t.stats.exhibitors} icon={Store} theme={theme} />
    </div>
  </section>
);

const SpeakerCard = ({ speaker, theme }) => (
  <div 
    className={`group relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] active:scale-[0.97] ${
      theme === 'light'
        ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl'
        : 'bg-[#010614] border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20'
    }`}
    onMouseDown={(e) => {
      e.currentTarget.classList.add('animate-press');
      setTimeout(() => e.currentTarget.classList.remove('animate-press'), 120);
    }}
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
          <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500"><Linkedin size={14} /></button>
          <button className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400"><Twitter size={14} /></button>
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
  </div>
);

const SpeakersSection = ({ t, theme }) => (
  <section id="speakers" className={`py-24 transition-colors duration-300 ${
    theme === 'light' ? 'bg-gray-50' : 'bg-[#00030a]'
  }`}>
    <div className="max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <SectionHeading title={t.speakers.title} subtitle={t.speakers.subtitle} theme={theme} />
      </RevealOnScroll>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {SPEAKERS.map((speaker, idx) => (
          <RevealOnScroll key={speaker.id} delay={idx * 100}>
            <SpeakerCard speaker={speaker} theme={theme} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

const AgendaTimeline = ({ theme }) => (
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

// --- PAGES ---

// --- LIVE ATTENDING NOW COUNTER ---

const AttendingNowCounter = ({ theme, lang }) => {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (250 - 30 + 1)) + 30);
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = Math.floor(Math.random() * (250 - 30 + 1)) + 30;
      setCount(newCount);
      
      // Smooth count animation
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
              {lang === 'ar' ? 'المشاهدون الآن' : 'Attending Now'}
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
};

const HomePage = ({ setPage, t, lang, theme }) => (
  <>
    <AttendingNowCounter theme={theme} lang={lang} />
    <Hero setPage={setPage} t={t} lang={lang} theme={theme} />
    <Marquee theme={theme} />
    <StatsSection t={t} theme={theme} />
    <SpeakersSection t={t} theme={theme} />
    
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
            onClick={() => setPage('Agenda')}
            className={`px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-400/30'
                : 'bg-white text-black hover:bg-blue-50 shadow-white/10'
            }`}
          >
            Secure Your Spot
          </button>
          <button
            onClick={() => {
              const event = {
                title: 'Iraq AI DevFest 2026',
                description: 'The premier artificial intelligence Festival in the Middle East', // Muammal : Name change
                startDate: new Date('2026-10-15T09:00:00'),
                endDate: new Date('2026-10-17T18:00:00'),
                location: "The Station"
              };
              try {
                openGoogleCalendar(event);
              } catch (error) {
                console.error('Error opening calendar:', error);
              }
            }}
            className={`px-6 py-4 rounded-full font-medium text-sm transition-all hover:scale-105 border flex items-center gap-2 ${
              theme === 'light'
                ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <Calendar size={18} />
            {lang === 'ar' ? 'إضافة إلى التقويم' : 'Add to Calendar'}
          </button>
        </div>
      </div>
    </section>
  </>
);

const AboutPage = ({ t, theme }) => (
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

const AgendaPage = ({ theme }) => (
  <div id="agenda" className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
    theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
  }`}>
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading title="Summit Agenda" subtitle="Three days of immersive learning and networking." theme={theme} />
      <AgendaTimeline theme={theme} />
    </div>
  </div>
);

const EcosystemPage = ({ t, lang, setSpeakerModal, theme }) => {
  const [showPartnershipWizard, setShowPartnershipWizard] = useState(false);

  return (
    <div id="ecosystem" className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`}>
      {/* Portal Wizard Modal */}
      {showPartnershipWizard && <PartnershipWizard onClose={() => setShowPartnershipWizard(false)} t={t.ecosystem} lang={lang} theme={theme} />}

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title={t.ecosystem.title} subtitle={t.ecosystem.subtitle} theme={theme} />
        
        <div id="partners">
          <EcosystemMarquee theme={theme} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Rocket, title: "Startups", desc: "Showcase your MVP to global investors.", role: "fundraiser", action: () => setShowPartnershipWizard(true) },
            { icon: Award, title: "Sponsors", desc: "Align your brand with innovation.", role: "sponsor", action: () => setShowPartnershipWizard(true) },
            { icon: Mic, title: "Media", desc: "Get exclusive access to announcements.", role: "partner", action: () => setShowPartnershipWizard(true) },
            { icon: Store, title: "Exhibitors", desc: "Demo your latest tech.", role: "booth", action: () => setShowPartnershipWizard(true) },
            { icon: Users, title: "Community", desc: "Join our ambassador program.", role: "partner", action: () => window.open("https://discord.com", "_blank") },
            // New Speaker Card
            { icon: UserPlus, title: "Speakers", desc: "Share your expertise on stage.", role: "speaker", action: () => setSpeakerModal(true) },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={item.action}
              className={`group p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm'
                  : 'bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{item.title}</h3>
              <p className={`mb-6 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>{item.desc}</p>
              <button className={`text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {t.ecosystem.apply} <ChevronRight size={14} className={`text-blue-500 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = ({ theme }) => (
  <footer className={`border-t pt-20 pb-10 transition-colors duration-300 ${
    theme === 'light'
      ? 'bg-gray-50 border-gray-200'
      : 'bg-[#000208] border-white/5'
  }`}>
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <SummitLogo />
            <span className="font-bold text-2xl text-white">BAGHDAD AI</span>
          </div>
          <p className={`max-w-sm mb-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            The largest gathering of AI professionals, researchers, and enthusiasts in Iraq.
          </p>
          <div className="flex gap-4">
            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                : 'bg-white/5 text-white hover:bg-blue-600'
            }`}><Twitter size={18} /></button>
            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                : 'bg-white/5 text-white hover:bg-blue-600'
            }`}><Linkedin size={18} /></button>
            <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                : 'bg-white/5 text-white hover:bg-blue-600'
            }`}><Globe size={18} /></button>
          </div>
        </div>
        
        <div>
          <h4 className={`font-bold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>Quick Links</h4>
          <ul className={`space-y-4 text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <li className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 cursor-pointer">Speakers</li>
            <li className="hover:text-blue-400 cursor-pointer">Agenda</li>
            <li className="hover:text-blue-400 cursor-pointer">Sponsorship</li>
          </ul>
        </div>
        
        <div>
          <h4 className={`font-bold mb-6 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>Legal</h4>
          <ul className={`space-y-4 text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
            <li className="hover:text-blue-400 cursor-pointer">Code of Conduct</li>
          </ul>
        </div>
      </div>
      
      <div className={`border-t pt-8 text-center text-sm ${
        theme === 'light'
          ? 'border-gray-200 text-gray-500'
          : 'border-white/5 text-gray-600'
      }`}>
        &copy; 2026 Baghdad AI Summit. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- PAGE TRANSITION COMPONENT ---

const PageTransition = ({ children, key }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

// --- LOADING SKELETON COMPONENT ---

const LoadingSkeleton = ({ theme }) => (
  <div className="animate-pulse space-y-4 p-6">
    <div className={`h-6 rounded ${
      theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
    }`}></div>
    <div className={`h-6 rounded w-2/3 ${
      theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
    }`}></div>
    <div className={`h-48 rounded ${
      theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
    }`}></div>
    <div className={`h-32 rounded ${
      theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
    }`}></div>
  </div>
);

// --- SCROLL TO TOP BUTTON ---

const ScrollTopButton = ({ lang, theme }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${lang === 'ar' ? 'left-6' : 'right-6'} bottom-24 z-40 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 ${
        theme === 'light'
          ? 'bg-white text-slate-900 shadow-lg border border-gray-300'
          : 'bg-white/10 text-white border border-white/20'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};

// --- MAIN APP ---

import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import SignIn from '@/pages/SignIn';
import Register from '@/pages/Register';

const App = ({ route }) => {
  const [currentPage, setCurrentPage] = useState(route || 'Home');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handle RTL direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    if (theme === 'light') {
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.style.colorScheme = 'dark';
    }
  }, [theme]);

  const t = CONTENT[lang];

  // Admin routing
  if (currentPage === 'AdminLogin') {
    return (
      <AdminLogin 
        onLogin={() => {
          setAdminLoggedIn(true);
          setCurrentPage('AdminDashboard');
        }}
        t={t}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (currentPage === 'AdminDashboard') {
    if (!adminLoggedIn) {
      setCurrentPage('AdminLogin');
      return null;
    }
    return (
      <AdminDashboard
        onLogout={() => {
          setAdminLoggedIn(false);
          setCurrentPage('Home');
        }}
        t={t}
        theme={theme}
        lang={lang}
      />
    );
  }

  if (currentPage === 'SignIn') {
    return (
      <SignIn
        onSignIn={() => {}}
        onSwitchToRegister={() => setCurrentPage('Register')}
        t={t}
        lang={lang}
        theme={theme}
        setPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'Register') {
    return (
      <Register
        onRegister={() => {}}
        onSwitchToSignIn={() => setCurrentPage('SignIn')}
        t={t}
        lang={lang}
        theme={theme}
        setPage={setCurrentPage}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gray-50 text-gray-900'
        : 'bg-[#00040F] text-white'
    } selection:bg-blue-600 selection:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar 
        setPage={setCurrentPage} 
        currentPage={currentPage} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onRegister={() => setShowRegisterModal(true)}
        onSignIn={() => setCurrentPage('SignIn')}
        theme={theme}
        setTheme={setTheme}
      />
      
      {showRegisterModal && <GeneralRegistrationForm onClose={() => setShowRegisterModal(false)} t={t} theme={theme} />}
      {showSpeakerModal && <SpeakerRegistrationForm onClose={() => setShowSpeakerModal(false)} t={t} theme={theme} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} t={t} lang={lang} theme={theme} />}

      <main className="animate-fade-in">
        <PageTransition key={currentPage}>
          <Suspense fallback={<LoadingSkeleton theme={theme} />}>
            {currentPage === 'Home' && <HomePage setPage={setCurrentPage} t={t} lang={lang} theme={theme} />}
            {currentPage === 'About' && <AboutPage t={t} theme={theme} />}
            {currentPage === 'Agenda' && <AgendaPage theme={theme} />}
            {currentPage === 'Ecosystem' && <EcosystemPage t={t} lang={lang} setSpeakerModal={setShowSpeakerModal} theme={theme} />}
          </Suspense>
        </PageTransition>
      </main>

      <Footer theme={theme} />
      
      <ScrollTopButton lang={lang} theme={theme} />
      <Chatbot t={t} lang={lang} theme={theme} />
    </div>
  );
};

export default App;
