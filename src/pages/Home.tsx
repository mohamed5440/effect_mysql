import { Crown, PenTool, MonitorSmartphone, Terminal, Rocket } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ServicesSection } from "../components/ServicesSection";
import { PricingSection } from "../components/PricingSection";
import { translations } from "../lib/i18n";

interface HomeProps {
  lang?: "ar" | "en";
}

export default function Home({ lang = "ar" }: HomeProps) {
  const navigate = useNavigate();
  const [, setActiveSection] = useState('home');
  const t = translations[lang].home;
  const isAr = lang === 'ar';

  const scrollToSection = useCallback((id: string) => {
    if (id === 'contact') {
      navigate(isAr ? '/ar/contact' : '/contact');
      return;
    }
    if (id === 'join') {
      navigate(isAr ? '/ar/join' : '/join');
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [navigate, isAr]);

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'pricing'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) scrollToSection(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      const timer = setTimeout(() => scrollToSection(initialHash), 100);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('hashchange', handleHashChange);
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [scrollToSection]);

  return (
    <Layout lang={lang}>
      <HeroSection 
        id="home"
        title={t.hero.title}
        description={t.hero.description}
        primaryBtnText={t.hero.primaryBtn}
        secondaryBtnText={t.hero.secondaryBtn}
        scrollIndicatorText={t.hero.scrollText}
        onPrimaryClick={() => scrollToSection('services')}
        onSecondaryClick={() => scrollToSection('contact')}
        onScrollClick={() => scrollToSection('about')}
      />

      <AboutSection 
        id="about"
        subtitle={t.about.subtitle}
        title={t.about.title}
        description={t.about.description}
        features={t.about.features}
      />

      <ServicesSection 
        id="services"
        subtitle={t.services.subtitle}
        title={t.services.title}
        description={t.services.description}
        services={t.services.items}
      />

      <PricingSection 
        id="pricing"
        subtitle={t.pricing.subtitle}
        title={t.pricing.title}
        description={t.pricing.description}
        levels={t.pricing.levels}
      />
    </Layout>
  );
}
