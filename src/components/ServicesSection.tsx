import React from "react";
import { motion } from "motion/react";

interface Service {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ServicesSectionProps {
  id: string;
  subtitle: string;
  title: React.ReactNode;
  description: string;
  services: Service[];
}

export const ServicesSection = React.memo(function ServicesSection({ id, subtitle, title, description, services }: ServicesSectionProps) {
  return (
    <section id={id} className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12 bg-deep-black text-white overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-6 gap-4 md:gap-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-[2px] bg-white/10 rounded-full relative overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" 
                />
              </div>
              <span className="section-subtitle mb-0">{subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white">{title}</h2>
          </div>
          <p className="max-w-sm text-white/50 text-xs sm:text-sm md:text-base font-light leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 sm:p-8 md:p-10 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent mb-4 md:mb-6 group-hover:bg-accent group-hover:text-black transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-white">{service.title}</h3>
              <p className="text-white/50 text-xs sm:text-sm md:text-base leading-relaxed font-light group-hover:text-white/70 transition-colors">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
