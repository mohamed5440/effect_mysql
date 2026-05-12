import React from "react";
import { motion } from "motion/react";

interface ServiceLevel {
  level: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

interface PricingSectionProps {
  id: string;
  subtitle: string;
  title: React.ReactNode;
  description: string;
  levels: ServiceLevel[];
}

export const PricingSection = React.memo(function PricingSection({ id, subtitle, title, description, levels }: PricingSectionProps) {
  return (
    <section id={id} className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12 bg-deep-black text-white overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,127,0.05),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-4 md:mb-6 flex flex-col items-center">
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
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-2">{title}</h2>
          <p className="text-xs sm:text-sm md:text-base text-white/50 max-w-xl mx-auto font-light">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {levels.map((level, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-6 sm:p-8 md:p-12 flex flex-col gap-4 md:gap-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-accent/20"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 transition-all duration-500 group-hover:bg-accent group-hover:text-black group-hover:border-accent">
                  {level.icon}
                </div>
                <span className="text-accent font-bold text-[10px] md:text-sm uppercase bg-accent/10 px-3 py-1 md:px-4 md:py-2 rounded-2xl border border-accent/20 group-hover:bg-accent group-hover:text-black transition-colors">{level.level}</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black relative z-10 text-white">{level.name}</h3>
              <p className="text-white/50 text-xs sm:text-sm md:text-base leading-relaxed font-light relative z-10 group-hover:text-white/70 transition-colors">
                {level.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
