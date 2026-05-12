import React from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  id: string;
  subtitle: string;
  title: React.ReactNode;
  description: React.ReactNode;
  features: string[];
}

export const AboutSection = React.memo(function AboutSection({ id, subtitle, title, description, features }: AboutSectionProps) {
  return (
    <section id={id} className="px-4 sm:px-6 md:px-20 py-8 md:py-12 bg-deep-black overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-8 items-center"
          >
            <div className="flex items-center justify-center gap-3">
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
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 text-white leading-[1.2] text-center">
              {title}
            </h2>
            
            <div className="flex flex-col gap-6 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-light text-center">
              {description}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-3 md:gap-6 mt-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="text-accent shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-white/90 font-medium text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
