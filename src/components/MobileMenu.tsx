import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, Instagram, Facebook, Languages } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { getNavLinks } from "../constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
  onNavClick: (id: string) => void;
}

export const MobileMenu = React.memo(function MobileMenu({ isOpen, onClose, lang, onNavClick }: MobileMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const navLinks = getNavLinks(lang);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 bottom-0 right-0 w-[85vw] sm:w-[400px] z-[70] bg-[#050505]/90 backdrop-blur-3xl border-l border-white/10 text-white overflow-hidden flex flex-col"
            dir={dir}
          >
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-accent/20 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[30%] bg-accent/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-6 pt-[calc(env(safe-area-inset-top,0px)+24px)] border-b border-white/5 relative z-10">
              <div className="flex items-center">
                <img src="https://i.imghippo.com/files/XFCZ7651QcQ.png" alt="Logo" className="h-6 w-auto object-contain" referrerPolicy="no-referrer" />
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-90 transition-all duration-500 group"
              >
                <X size={20} className="text-white/70 group-hover:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-[calc(env(safe-area-inset-bottom,2rem)+2rem)] relative z-10 custom-scrollbar flex flex-col">
              <div className="flex-1">
                <span className={`text-white/30 font-bold text-[10px] uppercase block mb-6 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? "التنقل السريع" : "Quick Navigation"}
                </span>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                  className="space-y-2"
                >
                  {navLinks.map((item) => (
                    <motion.button
                      key={item.name}
                      variants={{
                        hidden: { x: isAr ? 20 : -20, opacity: 0 },
                        visible: { x: 0, opacity: 1 }
                      }}
                      onClick={() => onNavClick(item.id)}
                      className="flex items-center gap-4 p-3 w-full rounded-2xl transition-all duration-300 group relative hover:bg-white/5 border border-transparent"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all duration-500 bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white">
                        {item.icon}
                      </div>
                      <div className={isAr ? "text-right" : "text-left"}>
                        <div className="font-bold text-base transition-colors text-white/70 group-hover:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-white/40 font-medium mt-0.5">{item.desc}</div>
                      </div>
                      <ArrowUpRight size={16} className={`${isAr ? 'mr-auto' : 'ml-auto'} transition-all duration-500 text-white/20 opacity-0 group-hover:opacity-100 ${isAr ? 'group-hover:translate-x-[-4px]' : 'group-hover:translate-x-[4px]'}`} />
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <span className="text-white/30 font-bold text-[10px] uppercase block mb-4 text-center">
                  {isAr ? "تابعنا على" : "Follow Us"}
                </span>
                <div className="flex justify-center gap-4">
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
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-all duration-300 bg-white/5 hover:bg-accent/20 hover:text-accent hover:border-accent/50"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-20 flex flex-col gap-5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                  <Languages size={14} />
                  <span>{isAr ? "لغة الموقع:" : "Language:"}</span>
                </div>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                  <button 
                    onClick={() => !isAr && navigate('/ar' + (location.pathname === '/' ? '' : location.pathname))}
                    className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center justify-center transition-all ${isAr ? 'bg-accent text-white' : 'bg-transparent text-white/40 hover:text-white'}`}
                  >
                    العربية
                  </button>
                  <button 
                    onClick={() => isAr && navigate(location.pathname.replace('/ar', '') || '/')}
                    className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center justify-center transition-all ${!isAr ? 'bg-accent text-white' : 'bg-transparent text-white/40 hover:text-white'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
