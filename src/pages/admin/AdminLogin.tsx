import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { 
  ArrowRight, LogIn, User, Mail, Lock, X, CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { MobileMenu } from "../../components/MobileMenu";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (showSuccess || showError) {
      document.body.style.overflow = 'hidden';
    } else if (!isMenuOpen) {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuccess, showError, isMenuOpen]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        const response = await fetch('/api/auth/me', { 
          credentials: 'include',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ["rgba(5, 5, 5, 0)", "rgba(15, 15, 15, 0.8)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]);
  const navBlurValue = useTransform(scrollY, [0, 50], [0, 16]);
  const navBackdropFilter = useMotionTemplate`blur(${navBlurValue}px)`;
  const navShadow = useTransform(scrollY, [0, 50], ["none", "0 10px 30px -10px rgba(0,0,0,0.5)"]);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'contact') {
      navigate('/ar/contact');
    } else if (id === 'join') {
      navigate('/ar/join');
    } else if (id === 'home') {
      navigate('/ar');
    } else {
      navigate(`/ar#${id}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setShowError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }
    
    setIsSubmitting(true);
    setShowError(null);
    try {
      const endpoint = '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('بيانات الدخول غير صحيحة.');
      }

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      console.warn("Auth error silent:", err);
      setShowError('فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white font-sans selection:bg-accent selection:text-black overflow-x-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ 
          top: 'env(safe-area-inset-top, 0px)',
          backgroundColor: navBg,
          borderColor: navBorder,
          backdropFilter: navBackdropFilter,
          boxShadow: navShadow
        }}
        className="fixed mt-2 sm:mt-4 md:mt-6 left-2 right-2 sm:left-4 sm:right-4 md:left-12 md:right-12 z-50 flex justify-between items-center px-4 py-3 md:px-10 md:py-6 rounded-full border transition-all duration-300" 
        dir="rtl"
      >
        {/* Right (Start in RTL) - Action Button */}
        <div className="flex items-center z-10">
          <button 
            id="admin-login-nav-home-btn"
            onClick={() => navigate('/ar')} 
            className="bg-white text-black px-4 py-1.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group shrink-0"
          >
            <span>الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
          <div onClick={() => navigate('/ar')} className="cursor-pointer hover:scale-105 transition-transform flex items-center">
            <img 
              src="https://i.imghippo.com/files/XFCZ7651QcQ.png" 
              alt="شعار الموقع" 
              className="h-4 md:h-7 w-auto object-contain"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        {/* Left (End in RTL) - Menu & Language */}
        <div className="flex items-center gap-2 md:gap-3 z-10">
          <button 
            id="admin-login-nav-lang-btn"
            onClick={() => navigate('/')}
            className="flex w-7 h-7 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-[10px] md:text-xs"
            title="تغيير اللغة"
          >
            EN
          </button>

          <button 
            id="admin-login-nav-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 md:gap-4 text-white hover:text-accent transition-all group bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 md:px-8 md:py-4 rounded-full"
          >
            <span className="hidden md:block text-xs md:text-sm font-bold uppercase">القائمة</span>
            <div className="flex flex-col items-start justify-center gap-1 md:gap-2">
              <span className="w-4 md:w-6 h-[1.5px] md:h-[2px] bg-current transition-all group-hover:w-7"></span>
              <span className="w-2.5 md:w-4 h-[1.5px] md:h-[2px] bg-current transition-all group-hover:w-7"></span>
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Side Drawer */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        lang="ar" 
        onNavClick={handleNavClick} 
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,6rem)+4rem)] pb-[calc(env(safe-area-inset-bottom,1rem)+1rem)] md:pt-36 md:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
              />
            </div>
            <span className="section-subtitle mb-0">لوحة التحكم</span>
            <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">تسجيل دخول <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">الإدارة</span></h1>
          <p className="text-white/50 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            أدخل البريد الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم وإدارة محتوى الموقع.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-5 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 hover:bg-white/5 hover:border-white/10 max-w-2xl mx-auto"
        >
          {/* Contact Info Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
                </span>
                بيانات الدخول
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 mr-11">
                أدخل بيانات الاعتماد الخاصة بك للمتابعة.
              </p>
            </div>
            

            <div className="flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="admin_email" className="text-xs font-bold text-white/60 uppercase mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px] absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors shrink-0" />
                  <input 
                    id="admin_email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="admin@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-sm md:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all disabled:opacity-50 text-right" 
                    dir="ltr" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="admin_password" className="text-xs font-bold text-white/60 uppercase mr-1">كلمة المرور</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 sm:w-[18px] sm:h-[18px] absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors shrink-0" />
                  <input 
                    id="admin_password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-sm md:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all disabled:opacity-50 text-right" 
                    dir="ltr" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
            <button 
              id="admin-login-submit-btn"
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-accent-light transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 sm:mt-4 group"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0 rtl:rotate-180" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 md:p-12 rounded-3xl max-w-xl w-full text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6 shrink-0">
                <CheckCircle className="w-10 h-10 shrink-0" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">تم بنجاح</h2>
              <p className="text-white/50 mb-8 leading-relaxed whitespace-pre-wrap">{showSuccess}</p>
              <button 
                id="admin-login-success-close-btn"
                onClick={() => setShowSuccess(null)}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowError(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 md:p-12 rounded-3xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shrink-0">
                <X className="w-10 h-10 shrink-0" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">عذراً، حدث خطأ</h2>
              <p className="text-white/50 mb-8 leading-relaxed">{showError}</p>
              <button 
                id="admin-login-error-close-btn"
                onClick={() => setShowError(null)}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

