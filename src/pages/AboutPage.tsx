import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { RevealOnScroll } from '@/components/shared/RevealOnScroll';

const CONTENT = {
  en: {
    title: 'Our Origins',
    subtitle: 'A legacy of wisdom reborn.',
    intro1_bold: 'AI DevFest',
    intro1_rest: ' is a developer-focused event dedicated to exploring the rapidly evolving world of artificial intelligence, robotics, and modern computing technologies. The event brings together students, developers, researchers, and technology enthusiasts to learn, collaborate, and share ideas about the future of intelligent systems.',
    intro2: 'Through talks, workshops, and interactive sessions, AI DevFest highlights practical applications of AI across fields such as machine learning, computer vision, robotics, and intelligent infrastructure. The goal is to create a space where participants can engage with cutting-edge technologies while gaining hands-on experience with tools used in modern AI development. AI DevFest encourages innovation, curiosity, and collaboration, providing a platform for developers to exchange knowledge, experiment with new ideas, and build meaningful connections within the technology community.',
    vision_title: 'Vision',
    vision_desc: 'To be the catalyst for the digital transformation of Mesopotamia.',
    impact_title: 'Impact',
    impact_desc: 'Empowering 10,000+ youth with AI literacy by 2030.',
    mission_heading: 'Our Mission',
    mission_text: 'To unite the brightest minds from Iraq and the world, creating an environment where knowledge is exchanged, partnerships are forged, and the future of AI in the Arab world is written — right here in Baghdad.',
    values_heading: 'Our Core Values',
    values: [
      { title: 'Openness',      desc: 'Knowledge that is shared grows exponentially. We believe in radical transparency and open collaboration.' },
      { title: 'Excellence',   desc: 'We hold ourselves to the highest standard in every speaker, session, and experience we deliver.' },
      { title: 'Inclusivity',  desc: 'AI must benefit everyone. We actively work to bring diverse voices and backgrounds to the table.' },
      { title: 'Innovation',   desc: 'Questioning assumptions and building what does not yet exist is at the heart of everything we do.' },
    ],
  },
  ar: {
    title: 'جذورنا',
    subtitle: 'إرث من الحكمة يولد من جديد.',
    intro1_bold: 'مهرجان مطوري الذكاء الاصطناعي (AI DevFest)',
    intro1_rest: ' هو حدث مخصص للمطورين يهدف لاستكشاف العالم المتسارع للذكاء الاصطناعي، الروبوتات، وتقنيات الحوسبة الحديثة. يجمع الحدث الطلاب، المطورين، الباحثين، وهواة التكنولوجيا للتعلم، التعاون، وتبادل الأفكار حول مستقبل الأنظمة الذكية.',
    intro2: 'من خلال المحاضرات، ورش العمل، والجلسات التفاعلية، يسلط AI DevFest الضوء على التطبيقات العملية للذكاء الاصطناعي في مجالات مثل التعلم الآلي، الرؤية الحاسوبية، الروبوتات، والبنية التحتية الذكية. الهدف هو خلق مساحة يمكن للمشاركين فيها التفاعل مع التقنيات المتطورة واكتساب خبرة عملية بالأدوات المستخدمة في تطوير الذكاء الاصطناعي الحديث. يشجع المهرجان الابتكار، والفضول، والتعاون، مما يوفر منصة للمطورين لتبادل المعرفة، وتجربة أفكار جديدة، وبناء علاقات هادفة داخل المجتمع التكنولوجي.',
    vision_title: 'الرؤية',
    vision_desc: 'أن نكون المحرك الرئيسي للتحول الرقمي في بلاد الرافدين.',
    impact_title: 'الأثر',
    impact_desc: 'تمكين أكثر من ١٠٠٠٠ شاب من الثقافة الرقمية والذكاء الاصطناعي بحلول عام ٢٠٣٠.',
    mission_heading: 'رسالتنا',
    mission_text: 'توحيد أبرز العقول من العراق والعالم في بيئة يُتبادل فيها المعرفة وتُبنى الشراكات ويُكتب مستقبل الذكاء الاصطناعي في العالم العربي — من هنا، من بغداد.',
    values_heading: 'قيمنا الأساسية',
    values: [
      { title: 'الانفتاح',      desc: 'المعرفة المشتركة ت��رع بشكل متسارع. نؤمن بالشفافية الكاملة والتعاون المفتوح.' },
      { title: 'التميز',        desc: 'نلتزم بأعلى المعايير في كل متحدث وكل جلسة وكل تجربة نقدمها.' },
      { title: 'الشمولية',     desc: 'يجب أن يعود الذكاء الاصطناعي بالنفع على الجميع. نسعى لإشراك أصوات وخلفيات متنوعة.' },
      { title: 'الابتكار',     desc: 'التشكيك في المسلّمات وبناء ما لا يوجد بعد — هذا جوهر كل ما نفعله.' },
    ],
  },
};

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const c = CONTENT[lang as 'en' | 'ar'];

  return (
    <div className={`pt-32 pb-20 min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-[#00040F]'
    }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Hero section ── */}
        <SectionHeading title={c.title} subtitle={c.subtitle} align="left" theme={theme} />

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          <div className={`space-y-6 text-lg leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <p>
              <span className={`font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{c.intro1_bold}</span>
              {c.intro1_rest}
            </p>
            <p>{c.intro2}</p>

            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { title: c.vision_title, desc: c.vision_desc },
                { title: c.impact_title, desc: c.impact_desc },
              ].map(({ title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-xl border transition-all ${
                    theme === 'light'
                      ? 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
                      : 'bg-white/5 border-white/10 hover:border-blue-500/40'
                  }`}
                >
                  <h4 className={`font-bold text-xl mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>{title}</h4>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <RevealOnScroll delay={150}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-lg opacity-40" />
              <img
                src="/Ancient.jpg"
                alt={lang === 'ar' ? 'بلاد الرافدين القديمة نحو المستقبل' : 'Ancient Mesopotamia meets Future'}
                className={`relative rounded-2xl shadow-2xl border grayscale hover:grayscale-0 transition-all duration-700 ${
                  theme === 'light' ? 'border-gray-200' : 'border-white/10'
                }`}
              />
            </div>
          </RevealOnScroll>
        </div>

        {/* ── Mission ── */}
        <RevealOnScroll>
          <div className={`relative rounded-3xl p-10 md:p-16 mb-20 overflow-hidden border ${
            theme === 'light'
              ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100'
              : 'bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border-blue-500/20'
          }`}>
            {theme === 'dark' && (
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            )}
            <div className="relative z-10 max-w-3xl">
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}>{c.mission_heading}</p>
              <blockquote className={`text-2xl md:text-3xl font-bold leading-snug ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                "{c.mission_text}"
              </blockquote>
            </div>
          </div>
        </RevealOnScroll>

        {/* ── Values ── */}
        <RevealOnScroll>
          <h2 className={`text-3xl font-bold mb-10 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>{c.values_heading}</h2>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.values.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-7 rounded-2xl border transition-all ${
                theme === 'light'
                  ? 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg shadow-sm'
                  : 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg mb-4 flex items-center justify-center text-sm font-black ${
                theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-600/20 text-blue-400'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
