import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { ArrowLeft, ArrowUpRight, Instagram, Facebook, Languages } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { MobileMenu } from "./MobileMenu";
import { getNavLinks, getFooterLinks } from "../constants/navigation";

interface LayoutProps {
  children: React.ReactNode;
  lang: "ar" | "en";
}

export const Layout = memo(function Layout({ children, lang }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isAr = useMemo(() => lang === "ar", [lang]);
  const dir = useMemo(() => isAr ? "rtl" : "ltr", [isAr]);
  const fontClass = "font-sans";
  const alignClass = useMemo(() => isAr ? "text-right" : "text-left", [isAr]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
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

  const handleNavClick = React.useCallback((id: string) => {
    setIsMenuOpen(false);
    
    // Smooth scrolling for hash links if on Home page
    const isHomePage = location.pathname === "/" || location.pathname === "/ar";
    
    if (id === "home") {
      navigate(isAr ? "/ar" : "/");
    } else if (id === "about" || id === "services" || id === "pricing") {
      if (!isHomePage) {
        navigate(isAr ? `/ar#${id}` : `/#${id}`);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (id === "contact") {
      navigate(isAr ? "/ar/contact" : "/contact");
    } else if (id === "join") {
      navigate(isAr ? "/ar/join" : "/join");
    }
  }, [isAr, location.pathname, navigate]);

  const footerLinks = useMemo(() => getFooterLinks(lang), [lang]);

  return (
    <div className={`min-h-screen bg-deep-black text-white ${fontClass} selection:bg-accent selection:text-black overflow-x-hidden ${alignClass}`} dir={dir}>
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

        dir="ltr"
      >
        {/* Menu & Language - always on the left */}
        <div className="flex items-center gap-2 md:gap-3 z-10 shrink-0" dir="ltr">
          <button 
            id="nav-menu-btn"
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center gap-2 md:gap-4 text-white hover:text-accent transition-all group bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 md:px-8 md:py-4 rounded-full shrink-0 cursor-pointer"
          >
            <div className="flex flex-col items-start justify-center gap-1 md:gap-2">
              <span className="w-4 md:w-6 h-[1.5px] md:h-[2px] bg-current transition-all group-hover:w-7"></span>
              <span className="w-2.5 md:w-4 h-[1.5px] md:h-[2px] bg-current transition-all group-hover:w-7"></span>
            </div>
            <span className="hidden md:block text-xs md:text-sm font-bold uppercase tracking-widest">
              {isAr ? "القائمة" : "Menu"}
            </span>
          </button>
          <button 
            id="lang-switch"
            onClick={() => {
              const currentPath = location.pathname;
              if (isAr) {
                navigate(currentPath.replace('/ar', '') || '/');
              } else {
                navigate(`/ar${currentPath === '/' ? '' : currentPath}`);
              }
            }}
            className="flex w-7 h-7 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/70 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all font-bold text-[10px] md:text-xs uppercase shrink-0 cursor-pointer"
            title="Change Language"
          >
            {isAr ? "EN" : "AR"}
          </button>
        </div>

        {/* Center - Logo */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div onClick={() => navigate(isAr ? '/ar' : '/')} className="cursor-pointer hover:scale-105 transition-transform flex items-center pointer-events-auto">
            <img 
              src="https://i.imghippo.com/files/XFCZ7651QcQ.png" 
              alt={isAr ? "شعار الموقع" : "Site Logo"} 
              className="h-4 md:h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
        
        {/* Action Button - always on the right */}
        <div className="flex items-center justify-end z-10 shrink-0" dir="ltr">
          {(location.pathname === '/' || location.pathname === '/ar') ? (
            <button 
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')} 
              className="bg-white text-black px-4 py-1.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group shrink-0 shadow-lg cursor-pointer"
            >
              <span className="hidden sm:block">{isAr ? "تواصل معنا" : "Contact Us"}</span>
              <span className="sm:hidden">{isAr ? "تواصل" : "Contact"}</span>
              <ArrowUpRight size={14} className={`md:w-5 md:h-5 transition-transform ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} group-hover:-translate-y-1`} />
            </button>
          ) : (
            <button 
              id="nav-home-btn"
              onClick={() => navigate(isAr ? '/ar' : '/')} 
              className="bg-white text-black px-4 py-1.5 md:px-8 md:py-4 rounded-full font-bold text-[10px] md:text-sm uppercase flex items-center gap-1.5 md:gap-2 hover:bg-accent hover:text-white transition-all group shrink-0 shadow-lg cursor-pointer"
            >
              <span className="hidden sm:block">{isAr ? "الرئيسية" : "Home"}</span>
              <span className="sm:hidden">{isAr ? "الرئيسية" : "Home"}</span>
              <ArrowLeft size={14} className={`md:w-5 md:h-5 transition-transform ${isAr ? 'group-hover:translate-x-1 rotate-180' : 'group-hover:-translate-x-1'}`} />
            </button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Side Drawer */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        lang={lang} 
        onNavClick={handleNavClick} 
      />

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-deep-black text-white pt-10 md:pt-16 pb-[calc(env(safe-area-inset-bottom,2rem)+2rem)] px-4 sm:px-8 md:px-12 lg:px-20 border-t border-white/5 relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.02] z-0 hidden md:block">
          <span className="text-[35vw] font-black uppercase whitespace-nowrap leading-none text-white">
            {isAr ? "إيفيكت" : "EFFECT"}
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-10">
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              <img 
                src="https://i.imghippo.com/files/XFCZ7651QcQ.png" 
                alt={isAr ? "شعار الموقع" : "Site Logo"} 
                className="h-6 md:h-10 w-auto object-contain self-start"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm font-light">
                {isAr 
                  ? "نحن وكالة إبداعية متخصصة في تحويل الأفكار إلى تجارب رقمية ملهمة. نجمع بين الاستراتيجية والتصميم لتحقيق نتائج ملموسة لنمو أعمالك."
                  : "We are a creative agency specialized in transforming ideas into inspiring digital experiences. We combine strategy and design to deliver tangible results for your business growth."}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {[
                  { icon: <Instagram size={18} />, href: "https://www.instagram.com/effect_media_?igsh=OXVyMGg2OTNnMXg3&utm_source=qr" },
                  { icon: <Facebook size={18} />, href: "https://www.facebook.com/share/1DywgUR5gC/?mibextid=wwXIfr" },
                  { icon: <WhatsAppIcon size={18} />, href: "https://wa.me/201027226917" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 transition-all bg-white/5 hover:scale-110 hover:text-accent hover:border-accent/50 hover:bg-accent/10"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
                    />
                  </div>
                  <span className="text-accent font-bold text-xs uppercase">{isAr ? "خريطة الموقع" : "Sitemap"}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {footerLinks.sitemap.map(link => (
                    <button 
                      key={link.name} 
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(link.path);
                      }} 
                      className={`text-sm md:text-base font-medium text-white/60 hover:text-white transition-all w-fit ${isAr ? 'hover:translate-x-[-4px] text-right' : 'hover:translate-x-[4px] text-left'}`}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-white/10 rounded-full relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
                    />
                  </div>
                  <span className="text-accent font-bold text-xs uppercase">{isAr ? "خدماتنا" : "Services"}</span>
                </div>
                <div className="flex flex-col gap-4">
                  {footerLinks.services.map(link => (
                    <button key={link} onClick={() => {
                      if (location.pathname === '/' || location.pathname === '/ar') {
                        handleNavClick('services');
                      } else {
                        navigate(isAr ? '/ar#services' : '/#services');
                      }
                    }} className={`text-sm md:text-base font-medium text-white/60 hover:text-white transition-all w-fit ${isAr ? 'hover:translate-x-[-4px] text-right' : 'hover:translate-x-[4px] text-left'}`}>{link}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-4 text-center sm:text-left text-[10px] md:text-xs text-white/30 uppercase">
            <span>{isAr ? "© ٢٠٢٦ إيفيكت ميديا. جميع الحقوق محفوظة." : "© 2026 Effect Media. All rights reserved."}</span>
          </div>
        </div>
      </footer>
    </div>
  );
});
