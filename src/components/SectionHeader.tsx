import { motion } from "motion/react";
import React from "react";

interface SectionHeaderProps {
  subtitle: string;
  title: React.ReactNode;
  description: string;
}

export const SectionHeader = React.memo(function SectionHeader({ subtitle, title, description }: SectionHeaderProps) {
  return (
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
        <span className="section-subtitle mb-0">{subtitle}</span>
        <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
          />
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 text-white leading-tight">{title}</h1>
      <p className="text-white/50 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">{description}</p>
    </motion.div>
  );
});
