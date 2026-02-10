import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Languages, Sun, Moon, Search, Menu, X, LayoutDashboard, LogOut, User as UserIcon, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SummitLogo } from '@/components/SummitLogo';
import SpotlightSearch from './SpotlightSearch';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, userRole, adminLoggedIn, logout, adminLogout } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      setScrollDirection(currentScrollY > lastScrollY && currentScrollY > 100 ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    if (adminLoggedIn) {
      adminLogout();
      navigate('/');
    } else {
      await logout();
      navigate('/');
    }
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (adminLoggedIn) return '/admin/dashboard';
    if (userRole === 'staff') return '/staff/dashboard';
    return '/';
  };

  const getDashboardLabel = () => {
    if (adminLoggedIn) return lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard';
    if (userRole === 'staff') return lang === 'ar' ? 'لوحة الموظف' : 'Staff Dashboard';
    return lang === 'ar' ? 'لوحة التحكم' : 'Dashboard';
  };

  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 }
  };

  const mobileMenuVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: 'auto', opacity: 1 }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/agenda', label: t.nav.agenda },
    { path: '/ecosystem', label: t.nav.ecosystem },
  ];

  return (
    <>
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          theme === 'light'
            ? scrolled
              ? 'bg-white/90 backdrop-blur-xl border-gray-200 py-2 md:py-3 lg:py-4 shadow-sm'
              : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
            : scrolled
            ? 'bg-[#00040F]/80 backdrop-blur-xl border-white/10 py-2 md:py-3 lg:py-4'
            : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
        }`}
        variants={navVariants}
        animate={scrollDirection === 'down' && scrolled ? 'hidden' : 'visible'}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 flex justify-between items-center">
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer"
          >
            <SummitLogo />
            <div className="flex flex-col">
              <span className={`text-lg md:text-xl font-bold tracking-tight ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                BAGHDAD
              </span>
              <span className={`text-xs tracking-[0.2em] ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}>
                AI SUMMIT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
                  isActive(link.path)
                    ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      theme === 'light' ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                theme === 'light'
                  ? 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <Search size={14} />
              <span className="hidden lg:inline text-xs">Search</span>
              <kbd className={`hidden lg:inline px-1.5 py-0.5 rounded text-[10px] ${
                theme === 'light' ? 'bg-gray-200 text-gray-500' : 'bg-white/10 text-gray-500'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                theme === 'light'
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-white/10'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
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

            {/* Sign In / Sign Up Buttons - Only show when not logged in */}
            {(!user && !adminLoggedIn) ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/signin')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'text-gray-700 hover:text-blue-600 border border-gray-300 hover:border-blue-500 bg-transparent hover:bg-blue-50'
                      : 'text-gray-300 hover:text-white border border-white/20 hover:border-white/40 bg-transparent hover:bg-white/10'
                  }`}
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]'
                  }`}
                >
                  {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                </button>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                    theme === 'light'
                      ? 'border-gray-200 bg-white hover:border-blue-400'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    <UserIcon size={14} />
                  </div>
                  <span className={`text-sm font-medium max-w-[100px] truncate ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    {user?.name || (adminLoggedIn ? 'Admin' : 'User')}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute end-0 top-full mt-2 w-48 rounded-xl shadow-lg border overflow-hidden ${
                        theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
                      }`}
                    >
                      <div className="p-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === 'light' 
                              ? 'text-gray-700 hover:bg-gray-100' 
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {userRole === 'staff' ? <Briefcase size={16} /> : <LayoutDashboard size={16} />}
                          {getDashboardLabel()}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            theme === 'light' 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          <LogOut size={16} />
                          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? (
              <X size={24} className={theme === 'light' ? 'text-gray-900' : 'text-white'} />
            ) : (
              <Menu size={24} className={theme === 'light' ? 'text-gray-900' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`md:hidden overflow-hidden border-t ${
                theme === 'light' ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#00040F]'
              }`}
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link, index) => (
                  <motion.div key={link.path} variants={menuItemVariants} custom={index}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 text-sm font-medium ${
                        isActive(link.path)
                          ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                          : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div variants={menuItemVariants} className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleTheme}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm ${
                        theme === 'light'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                      {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                    <button
                      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm ${
                        theme === 'light'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      <Languages size={16} />
                      {lang === 'en' ? 'العربية' : 'English'}
                    </button>
                  </div>
                </motion.div>

                {/* Mobile Auth Section */}
                <motion.div variants={menuItemVariants} className="pt-4">
                  {(!user && !adminLoggedIn) ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate('/signin');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full py-3 rounded-xl font-medium text-center transition-all ${
                          theme === 'light'
                            ? 'text-gray-700 hover:text-blue-600 border border-gray-300 hover:border-blue-500 bg-transparent hover:bg-blue-50'
                            : 'text-gray-300 hover:text-white border border-white/20 hover:border-white/40 bg-transparent hover:bg-white/10'
                        }`}
                      >
                        {lang === 'ar' ? 'تسجيل الدخول' : 'Log In'}
                      </button>
                      <button
                        onClick={() => {
                          navigate('/signup');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full py-3 rounded-xl font-medium text-center transition-all ${
                          theme === 'light'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        }`}
                      >
                        {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
                          theme === 'light'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {getDashboardLabel()}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full py-3 rounded-xl font-medium text-center transition-all ${
                          theme === 'light'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;