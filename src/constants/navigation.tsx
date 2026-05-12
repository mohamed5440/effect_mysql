import { Home as HomeIcon, Info, Layers, Gem, MessageSquare, LayoutGrid } from "lucide-react";

const NAV_LINKS_AR = [
  { name: "الرئيسية", id: "home", icon: <HomeIcon size={18} />, desc: "العودة للبداية" },
  { name: "من نحن", id: "about", icon: <Info size={18} />, desc: "تعرف على قصتنا" },
  { name: "خدماتنا", id: "services", icon: <Layers size={18} />, desc: "ماذا نقدم لك" },
  { name: "مستويات الخدمة", id: "pricing", icon: <Gem size={18} />, desc: "خطط تناسب طموحك" },
  { name: "اتصل بنا", id: "contact", icon: <MessageSquare size={18} />, desc: "نحن هنا لسماعك" },
  { name: "انضم إلينا", id: "join", icon: <LayoutGrid size={18} />, desc: "كن جزءاً من فريقنا" },
];

const NAV_LINKS_EN = [
  { name: "Home", id: "home", icon: <HomeIcon size={18} />, desc: "Back to start" },
  { name: "About", id: "about", icon: <Info size={18} />, desc: "Discover our story" },
  { name: "Services", id: "services", icon: <Layers size={18} />, desc: "What we offer" },
  { name: "Pricing", id: "pricing", icon: <Gem size={18} />, desc: "Plans for your ambition" },
  { name: "Contact", id: "contact", icon: <MessageSquare size={18} />, desc: "We are here to listen" },
  { name: "Join Us", id: "join", icon: <LayoutGrid size={18} />, desc: "Be part of our team" },
];

export const getNavLinks = (lang: "ar" | "en") => {
  return lang === "ar" ? NAV_LINKS_AR : NAV_LINKS_EN;
};

const FOOTER_LINKS_AR = {
  sitemap: [
    { name: "الرئيسية", path: "/ar" },
    { name: "انضم إلينا", path: "/ar/join" },
    { name: "تواصل معنا", path: "/ar/contact" }
  ],
  services: ["بناء العلامات التجارية", "تصميم التجارب الرقمية", "تطوير الويب والتطبيقات"]
};

const FOOTER_LINKS_EN = {
  sitemap: [
    { name: "Home", path: "/" },
    { name: "Join Us", path: "/join" },
    { name: "Contact Us", path: "/contact" }
  ],
  services: ["Brand Building", "Digital Experience Design", "Web & App Development"]
};

export const getFooterLinks = (lang: "ar" | "en") => {
  return lang === "ar" ? FOOTER_LINKS_AR : FOOTER_LINKS_EN;
};
