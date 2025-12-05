import React, { useState, useEffect, useRef } from 'react';
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
  Play,
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
  UserPlus
} from 'lucide-react';

// --- TRANSLATIONS ---

const CONTENT = {
  en: {
    nav: { home: 'Home', about: 'About', agenda: 'Agenda', ecosystem: 'Ecosystem', register: 'Register Now' },
    hero: {
      date: "Oct 15-17, 2026 • Baghdad Int'l Fairground",
      title_prefix: "Bridging",
      title_highlight: "Intelligence",
      subtitle: "The premier artificial intelligence summit in the Middle East. Join 5,000+ innovators shaping the future of Mesopotamia.",
      cta_agenda: "View Agenda",
      cta_watch: "Watch 2025 Recap",
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
    }
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'عن القمة', agenda: 'الجدول', ecosystem: 'البيئة التقنية', register: 'سجل الآن' },
    hero: {
      date: "١٥-١٧ أكتوبر ٢٠٢٦ • معرض بغداد الدولي",
      title_prefix: "جسر",
      title_highlight: "الذكاء الاصطناعي",
      subtitle: "القمة الرائدة للذكاء الاصطناعي في الشرق الأوسط. انضم إلى أكثر من ٥٠٠٠ مبتكر يشكلون مستقبل بلاد الرافدين.",
      cta_agenda: "عرض الجدول",
      cta_watch: "شاهد ملخص ٢٠٢٥",
      countdown_label: "الوقت المتبقي للقمة"
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

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("October 15, 2026 09:00:00").getTime();
    
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
          <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-900/20 backdrop-blur-md border border-blue-500/30 rounded-lg flex items-center justify-center">
            <span className="text-xl md:text-3xl font-bold text-white font-mono">
              {value < 10 ? `0${value}` : value}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-blue-400 mt-2">{unit}</p>
        </div>
      ))}
    </div>
  );
};

// --- FORMS & MODALS ---

const ModalBase = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
    <div className="w-full max-w-2xl bg-[#0a0a1a] border border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col max-h-[90vh] my-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-900/20 to-transparent flex-shrink-0">
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
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

const GeneralRegistrationForm = ({ onClose, t }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.general_title} onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white">{t.forms.success}</h3>
          <p className="text-gray-400">See you in Baghdad!</p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title={t.forms.general_title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.name}</label>
            <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.age}</label>
            <input required type="number" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.occupation}</label>
            <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none">
              <option>Student</option>
              <option>Employee</option>
              <option>Self-Employed</option>
              <option>Researcher</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.institution}</label>
            <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="University / Company" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.email}</label>
            <input required type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-blue-400">{t.forms.phone}</label>
            <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-blue-400">{t.forms.motivation}</label>
          <textarea required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none h-24" />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-all mt-4">
          {t.forms.submit}
        </button>
      </form>
    </ModalBase>
  );
};

const SpeakerRegistrationForm = ({ onClose, t }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.forms.speaker_title} onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white">{t.forms.success}</h3>
          <p className="text-gray-400">We will review your proposal.</p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title={t.forms.speaker_title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.name}</label>
            <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.age}</label>
            <input required type="number" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.occupation}</label>
            <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none">
              <option>Student</option>
              <option>Employee</option>
              <option>Self-Employed</option>
              <option>Researcher</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.institution}</label>
            <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" placeholder="University / Company" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.email}</label>
            <input required type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-purple-400">{t.forms.phone}</label>
            <input required type="tel" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" />
          </div>
        </div>

        {/* Professional Info */}
        <div className="space-y-2">
          <label className="text-sm text-purple-400">{t.forms.skills}</label>
          <input required type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none" placeholder="e.g. Python, NLP, Robotics" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-purple-400">{t.forms.experience}</label>
          <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none">
            <option value="no">No, this is my first time</option>
            <option value="yes">Yes, I have spoken before</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-purple-400">{t.forms.achievements}</label>
          <textarea className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none h-20" placeholder="Awards, research papers, major projects..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-purple-400">{t.forms.topics}</label>
          <textarea required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none h-20" placeholder="What do you want to talk about?" />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-purple-400">{t.forms.motivation}</label>
          <textarea required className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-purple-500 outline-none h-20" />
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

const EcosystemMarquee = () => (
  <div className="w-full bg-white/5 border-y border-white/10 overflow-hidden py-10 mb-16 relative">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#00040F] to-transparent z-10"></div>
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#00040F] to-transparent z-10"></div>
    
    <div className="flex w-full">
      <div className="whitespace-nowrap animate-scroll-slow flex gap-16 items-center min-w-full pl-16">
         {/* Tripled list for infinite scroll effect */}
         {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-all cursor-pointer group hover:scale-105">
              <div className={`w-20 h-20 rounded-2xl bg-[#0a0a1a] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-blue-500/50 transition-colors ${p.color}`}>
                 <p.icon size={32} />
              </div>
              <div className="text-center">
                <span className="block text-white font-bold text-sm tracking-wide">{p.name}</span>
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mt-1 bg-white/5 px-2 py-0.5 rounded-full">{p.category}</span>
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

const PartnershipWizard = ({ onClose, t }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 3;

  const handleFinalSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 4000);
  };

  if (submitted) {
    return (
      <ModalBase title={t.modal_title} onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white">Application Received</h3>
          <p className="text-gray-400">Our sales team will be in contact with you shortly.</p>
        </div>
      </ModalBase>
    );
  }

  return (
    <ModalBase title={t.modal_title} onClose={onClose}>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-800 mb-8">
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
                    <label className="text-sm text-gray-400">Organization Name</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. Babel Tech" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400">Website</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="https://..." />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400">Phone Number</label>
                    <input type="tel" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="+964..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-gray-400">Contact Email</label>
                    <input type="email" className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none" placeholder="contact@company.com" />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Partnership Type</label>
                <select className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none">
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
              <div className="border-2 border-dashed border-white/20 rounded-xl p-10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                <Upload className="w-12 h-12 text-gray-500 group-hover:text-blue-400 mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">Request Details (PDF file)</h4>
                <p className="text-sm text-gray-500">Requirements & Proposal (Max 10MB)</p>
              </div>
              <div className="text-left space-y-2">
                 <label className="text-sm text-gray-400">Special Conditions</label>
                 <textarea className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-blue-500 outline-none h-24" placeholder="Any specific booth requirements or conditions?" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center py-4 space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Ready to Submit</h4>
                <p className="text-gray-400">Review your details. Our sales team will be in contact with you.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
           {step > 1 ? (
             <button onClick={() => setStep(s => s-1)} className="text-gray-400 hover:text-white text-sm">Back</button>
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

const SectionHeading = ({ title, subtitle, align = "center" }) => (
  <div className={`mb-16 ${align === "left" ? "text-left" : "text-center"}`}>
    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">{title}</h2>
    <div className={`h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mb-6 ${align === "left" ? "" : "mx-auto"}`}></div>
    {subtitle && <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light">{subtitle}</p>}
  </div>
);

const Navbar = ({ setPage, currentPage, lang, setLang, t, onRegister }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#00040F]/80 backdrop-blur-xl border-white/10 py-2' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setPage('Home')}
        >
          <SummitLogo />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white leading-none tracking-wide">BAGHDAD</span>
            <span className="text-[10px] text-blue-400 tracking-[0.3em] font-bold uppercase mt-1">AI Summit 2026</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {Object.entries(t.nav).slice(0, 4).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPage(key.charAt(0).toUpperCase() + key.slice(1))}
              className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
                currentPage.toLowerCase() === key ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/30 transition-all"
          >
            <Languages size={14} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          <button 
            onClick={onRegister}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            {t.nav.register}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ setPage, t, lang }) => (
  <div className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#00040F]">
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-300 text-xs font-medium uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {t.hero.date}
          </div>
        </RevealOnScroll>
        
        <RevealOnScroll delay={100}>
          <h1 className="text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
            {t.hero.title_prefix} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-white">
              {t.hero.title_highlight}
            </span>
          </h1>
        </RevealOnScroll>
        
        <RevealOnScroll delay={200}>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
            {t.hero.subtitle}
          </p>
        </RevealOnScroll>

        {/* Live Countdown */}
        <RevealOnScroll delay={250}>
           <div className="border-t border-white/10 pt-6">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{t.hero.countdown_label}</p>
              <CountdownTimer />
           </div>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <div className="flex flex-wrap gap-4 pt-6">
            <button 
              onClick={() => setPage('Agenda')}
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm transition-all hover:bg-blue-50 flex items-center gap-2"
            >
              {t.hero.cta_agenda} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>
            <button className="px-8 py-4 border border-white/10 bg-white/5 backdrop-blur rounded-full text-white font-medium text-sm transition-all hover:bg-white/10 flex items-center gap-2">
              <Play size={16} fill="currentColor" /> {t.hero.cta_watch}
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

const Marquee = () => (
  <div className="bg-[#00040F] py-6 border-y border-white/5 relative overflow-hidden z-20">
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#00040F] to-transparent z-10"></div>
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#00040F] to-transparent z-10"></div>
    <div className="whitespace-nowrap animate-scroll flex gap-12 opacity-50">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 uppercase tracking-widest">
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

const StatCounter = ({ end, label, icon: Icon }) => {
  const { count, countRef } = useCounter(end);
  return (
    <div ref={countRef} className="text-center p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
        <Icon size={24} />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{count.toLocaleString()}+</div>
      <div className="text-sm text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
  );
};

const StatsSection = ({ t }) => (
  <section className="py-24 bg-[#00040F] relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCounter end={5000} label={t.stats.attendees} icon={Users} />
      <StatCounter end={120} label={t.stats.speakers} icon={Mic} />
      <StatCounter end={100} label={t.stats.exhibitors} icon={Store} />
    </div>
  </section>
);

const SpeakerCard = ({ speaker }) => (
  <div className="group relative bg-[#010614] rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20">
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
    <div className="p-4 bg-[#010614]">
       <p className="text-gray-400 text-xs uppercase tracking-wider">{speaker.role}</p>
    </div>
  </div>
);

const SpeakersSection = ({ t }) => (
  <section className="py-24 bg-[#00030a]">
    <div className="max-w-7xl mx-auto px-6">
      <RevealOnScroll>
        <SectionHeading title={t.speakers.title} subtitle={t.speakers.subtitle} />
      </RevealOnScroll>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SPEAKERS.map((speaker, idx) => (
          <RevealOnScroll key={speaker.id} delay={idx * 100}>
            <SpeakerCard speaker={speaker} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

const AgendaTimeline = () => (
  <div className="max-w-4xl mx-auto space-y-8 relative">
    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-500 to-transparent opacity-30 md:-translate-x-1/2"></div>
    
    {AGENDA_ITEMS.map((item, idx) => (
      <RevealOnScroll key={idx} delay={idx * 100}>
        <div className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          
          <div className="absolute left-0 md:left-1/2 w-10 h-10 rounded-full bg-[#00040F] border-2 border-blue-600 flex items-center justify-center z-10 md:-translate-x-1/2 shrink-0">
             <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>

          <div className={`pl-16 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'}`}>
            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all cursor-default">
              <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-full mb-3">
                {item.time}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              <div className={`flex items-center gap-2 mt-4 text-xs text-gray-500 uppercase tracking-widest ${idx % 2 !== 0 && 'md:justify-end'}`}>
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

const HomePage = ({ setPage, t, lang }) => (
  <>
    <Hero setPage={setPage} t={t} lang={lang} />
    <Marquee />
    <StatsSection t={t} />
    <SpeakersSection t={t} />
    
    <section className="py-32 relative overflow-hidden bg-blue-900/20">
      <div className="absolute inset-0 bg-[#00040F]/80"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to shape the future?</h2>
        <p className="text-xl text-gray-300 mb-10 font-light">Join the most influential minds in AI at the heart of the Middle East.</p>
        <button 
          onClick={() => setPage('Agenda')}
          className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-white/10"
        >
          Secure Your Spot
        </button>
      </div>
    </section>
  </>
);

const AboutPage = ({ t }) => (
  <div className="pt-32 pb-20 bg-[#00040F] min-h-screen">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading title="Our Origins" subtitle="A legacy of wisdom reborn." align="left" />
      
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
          <p>
            <span className="text-white font-bold">Baghdad.</span> The name itself evokes a history of profound knowledge. 
            During the Golden Age, the House of Wisdom attracted scholars from across the known world to translate, 
            innovate, and debate.
          </p>
          <p>
            The Baghdad AI Summit 2026 is the spiritual successor to that legacy. We are not just hosting a conference; 
            we are building an ecosystem. By connecting local talent with global experts, we aim to position Iraq 
            as a pivotal node in the global AI network.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-bold text-xl mb-2">Vision</h4>
              <p className="text-sm">To be the catalyst for the digital transformation of Mesopotamia.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-bold text-xl mb-2">Impact</h4>
              <p className="text-sm">Empowering 10,000+ youth with AI literacy by 2030.</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-40"></div>
          <img 
            src="public/Ancient.jpg" 
            alt="Ancient Mesopotamia meets Future" 
            className="relative rounded-2xl shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  </div>
);

const AgendaPage = () => (
  <div className="pt-32 pb-20 bg-[#00040F] min-h-screen">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading title="Summit Agenda" subtitle="Three days of immersive learning and networking." />
      <AgendaTimeline />
    </div>
  </div>
);

const EcosystemPage = ({ t, lang, setSpeakerModal }) => {
  const [showPartnershipWizard, setShowPartnershipWizard] = useState(false);

  return (
    <div className="pt-32 pb-20 bg-[#00040F] min-h-screen">
      {/* Portal Wizard Modal */}
      {showPartnershipWizard && <PartnershipWizard onClose={() => setShowPartnershipWizard(false)} t={t.ecosystem} lang={lang} />}

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title={t.ecosystem.title} subtitle={t.ecosystem.subtitle} />
        
        <EcosystemMarquee />

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
              className="group p-8 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <item.icon className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 mb-6">{item.desc}</p>
              <button className="text-sm font-bold text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                {t.ecosystem.apply} <ChevronRight size={14} className={`text-blue-500 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-[#000208] border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <SummitLogo />
            <span className="font-bold text-2xl text-white">BAGHDAD AI</span>
          </div>
          <p className="text-gray-400 max-w-sm mb-6">
            The largest gathering of AI professionals, researchers, and enthusiasts in Iraq.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"><Twitter size={18} /></button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"><Linkedin size={18} /></button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"><Globe size={18} /></button>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 cursor-pointer">Speakers</li>
            <li className="hover:text-blue-400 cursor-pointer">Agenda</li>
            <li className="hover:text-blue-400 cursor-pointer">Sponsorship</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
            <li className="hover:text-blue-400 cursor-pointer">Code of Conduct</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
        &copy; 2026 Baghdad AI Summit. All rights reserved. Designed with <span className="text-blue-500">♥</span> for the future.
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [lang, setLang] = useState('en');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handle RTL direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = CONTENT[lang];

  return (
    <div className={`bg-[#00040F] min-h-screen text-white font-sans selection:bg-blue-600 selection:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar 
        setPage={setCurrentPage} 
        currentPage={currentPage} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onRegister={() => setShowRegisterModal(true)}
      />
      
      {showRegisterModal && <GeneralRegistrationForm onClose={() => setShowRegisterModal(false)} t={t} />}
      {showSpeakerModal && <SpeakerRegistrationForm onClose={() => setShowSpeakerModal(false)} t={t} />}

      <main className="animate-fade-in">
        {currentPage === 'Home' && <HomePage setPage={setCurrentPage} t={t} lang={lang} />}
        {currentPage === 'About' && <AboutPage t={t} />}
        {currentPage === 'Agenda' && <AgendaPage />}
        {currentPage === 'Ecosystem' && <EcosystemPage t={t} lang={lang} setSpeakerModal={setShowSpeakerModal} />}
      </main>

      <Footer />
    </div>
  );
};

export default App;