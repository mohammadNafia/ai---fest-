import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Brain, Send, Calendar, MapPin, UserPlus, Mic, Handshake, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

interface FAQButton {
  key: string;
  answerKey: string;
  icon: LucideIcon;
}

/**
 * Chatbot Component
 * 
 * AI assistant chatbot that provides FAQ answers and quick actions.
 * Supports keyboard shortcuts and accessibility features.
 * 
 * @returns {JSX.Element} Chatbot component
 */
const Chatbot: React.FC = () => {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const faqButtons: FAQButton[] = [
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

  const handleFAQClick = (faq: FAQButton): void => {
    const userMessage = (t.chatbot as any)[faq.key];
    const assistantMessage = (t.chatbot.cannedAnswers as any)[faq.answerKey];
    
    setMessages(prev => [
      ...prev,
      { type: 'user', text: userMessage },
      { type: 'assistant', text: assistantMessage }
    ]);
  };

  const handleSendMessage = (): void => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'assistant', text: t.chatbot.cannedAnswers.default }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          theme === 'light' ? 'shadow-blue-400/30' : ''
        }`}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className={`fixed ${lang === 'ar' ? 'left-6' : 'right-6'} bottom-24 z-50 w-96 max-w-[calc(100vw-3rem)] ${
          theme === 'light' 
            ? 'bg-white/95 backdrop-blur-xl border border-blue-200/50 shadow-2xl' 
            : 'bg-[#0a0a1a]/95 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
        } rounded-2xl flex flex-col max-h-[500px] transition-all duration-300 animate-slide-up`}>
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
              className={`p-1.5 rounded-full transition-colors focus:ring-2 focus:ring-blue-500/70 outline-none ${
                theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[200px]">
            {messages.length === 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {faqButtons.map((faq, idx) => {
                  const Icon = faq.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleFAQClick(faq)}
                      className={`p-3 rounded-xl text-left transition-all hover:scale-105 focus:ring-2 focus:ring-blue-500/70 outline-none ${
                        theme === 'light'
                          ? 'bg-blue-50 border border-blue-100 hover:bg-blue-100 text-gray-800'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                      }`}
                      aria-label={`Ask about ${(t.chatbot as any)[faq.key]}`}
                    >
                      <Icon size={16} className={`mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                      <p className="text-xs font-medium">{(t.chatbot as any)[faq.key]}</p>
                    </button>
                  );
                })}
              </div>
            ) : (
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

          <div className={`p-4 border-t ${
            theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-[#0a0a1a]'
          } flex gap-2 rounded-b-2xl`}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.chatbot.placeholder}
              className={`flex-1 px-4 py-2.5 rounded-xl border outline-none transition-colors focus:ring-2 focus:ring-blue-500/70 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  : 'bg-black/50 border-white/10 text-white placeholder-gray-400 focus:border-blue-500'
              }`}
              aria-label="Chatbot input"
            />
            <button
              onClick={handleSendMessage}
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center focus:ring-2 focus:ring-blue-500/70 outline-none ${
                theme === 'light' ? 'shadow-lg' : ''
              }`}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

