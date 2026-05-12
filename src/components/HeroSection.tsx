import React from "react";
import { motion } from "motion/react";

interface HeroSectionProps {
  id: string;
  title: React.ReactNode;
  description: string;
  primaryBtnText: string;
  secondaryBtnText: string;
  scrollIndicatorText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onScrollClick: () => void;
  backgroundImage?: string;
}

export const HeroSection = React.memo(function HeroSection({ 
  id, title, description, primaryBtnText, secondaryBtnText, scrollIndicatorText,
  onPrimaryClick, onSecondaryClick, onScrollClick,
  backgroundImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=60&w=1200"
}: HeroSectionProps) {
  return (
    <section id={id} className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-20 overflow-hidden bg-deep-black pt-[calc(env(safe-area-inset-top,80px)+5rem)] pb-[calc(env(safe-area-inset-bottom,20px)+3rem)]">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-30 grayscale"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black/90 via-deep-black/60 to-deep-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center pt-6 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold text-white leading-[1.2] lg:leading-[1.1] mb-6 max-w-4xl tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-white/80 max-w-2xl mb-8 md:mb-10 leading-relaxed font-light px-2 sm:px-0">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full max-w-xs sm:max-w-none">
            <motion.button 
              id="hero-primary-btn"
              onClick={onPrimaryClick}
              className="btn-primary w-full sm:w-auto text-sm md:text-lg py-3.5 md:py-4"
            >
              {primaryBtnText}
            </motion.button>
            
            <motion.button 
              id="hero-secondary-btn"
              onClick={onSecondaryClick}
              className="btn-secondary w-full sm:w-auto text-sm md:text-lg py-3.5 md:py-4 backdrop-blur-sm"
            >
              {secondaryBtnText}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={onScrollClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 cursor-pointer group"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-accent transition-colors duration-300">
          {scrollIndicatorText}
        </span>
        <div className="w-[1px] md:w-[2px] h-10 md:h-16 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
});
