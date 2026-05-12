import { 
  User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, 
  PenTool, DollarSign, MessageSquare, Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { applicationSchema, applicationSchemaEn, sanitizeApplication } from "../lib/security";
import { useFormSubmission } from "../lib/hooks";
import { Layout } from "../components/Layout";
import { SectionHeader } from "../components/SectionHeader";
import { FeedbackModal } from "../components/FeedbackModal";
import { translations } from "../lib/i18n";

interface JoinUsProps {
  lang?: "ar" | "en";
}

export default function JoinUs({ lang = "ar" }: JoinUsProps) {
  const navigate = useNavigate();
  const t = translations[lang].join;
  const isAr = lang === "ar";

  const {
    isSubmitting,
    showSuccess,
    showError,
    setShowSuccess,
    setShowError,
    handleSubmit
  } = useFormSubmission({
    schema: isAr ? applicationSchema : applicationSchemaEn,
    apiEndpoint: '/api/applications',
    sanitizeFn: (data) => sanitizeApplication({
      ...data,
      status: 'pending'
    }),
    ...(lang === 'en' ? {
      errorMessages: {
        unexpected: 'An unexpected error occurred. Please try again.',
        invalid: 'Invalid data'
      }
    } : {})
  });

  return (
    <Layout lang={lang}>
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,7rem)+4rem)] pb-[calc(env(safe-area-inset-bottom,1rem)+1rem)] md:pt-36 md:pb-8">
        <SectionHeader 
          subtitle={t.subtitle}
          title={t.title}
          description={t.description}
        />

        <form 
          onSubmit={handleSubmit}
          className="glass-card p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 hover:bg-white/5 hover:border-white/10"
        >
          {/* Personal Info Section */}
          <div className="flex flex-col gap-6">
            {/* Honeypot field - hidden from users */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <User size={18} />
                </span>
                {t.sections.personal.title}
              </h2>
              <p className={`text-[10px] sm:text-xs text-white/40 ${isAr ? 'mr-11' : 'ml-11'}`}>{t.sections.personal.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="join_full_name" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.personal.fullName}</label>
                <div className="relative group">
                  <User size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="join_full_name" type="text" name="full_name" required placeholder={t.sections.personal.placeholders.fullName} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 ${isAr ? 'px-12' : 'px-12'} text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all`} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join_email" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.personal.email}</label>
                <div className="relative group">
                  <Mail size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="join_email" type="text" name="email" required placeholder={t.sections.personal.placeholders.email} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all ${isAr ? 'text-right' : 'text-left'}`} dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join_phone" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.personal.phone}</label>
                <div className="relative group">
                  <Phone size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="join_phone" type="text" name="phone" required placeholder={t.sections.personal.placeholders.phone} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all ${isAr ? 'text-right' : 'text-left'}`} dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join_location" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.personal.location}</label>
                <div className="relative group">
                  <MapPin size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="join_location" type="text" name="location" required placeholder={t.sections.personal.placeholders.location} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all`} />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Info Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Briefcase size={18} />
                </span>
                {t.sections.professional.title}
              </h2>
              <p className={`text-[10px] sm:text-xs text-white/40 ${isAr ? 'mr-11' : 'ml-11'}`}>{t.sections.professional.desc}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="join_expertise" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.professional.expertise}</label>
              <div className="relative group">
                <Briefcase size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                <select id="join_expertise" name="expertise" required defaultValue="" className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all appearance-none cursor-pointer ${isAr ? 'text-right' : 'text-left'}`}>
                  <option value="" disabled>{t.sections.professional.placeholders.expertise}</option>
                  {t.sections.professional.expertiseOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.professional.experience}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {t.sections.professional.options.map((exp) => (
                  <label key={exp} className="flex items-center gap-3 p-3.5 md:p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all has-[:checked]:border-accent has-[:checked]:bg-accent/10 group">
                    <input type="radio" name="experience" value={exp} required className="w-4 h-4 accent-accent" />
                    <span className="text-xs md:text-sm font-medium text-white/60 group-hover:text-white transition-colors">{exp}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="join_portfolio" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.professional.portfolio}</label>
              <div className="relative group">
                <LinkIcon size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                <input id="join_portfolio" type="text" name="portfolio" required placeholder={t.sections.professional.placeholders.portfolio} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all ${isAr ? 'text-right' : 'text-left'}`} dir="ltr" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="join_skills" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.professional.skills}</label>
              <div className="relative group">
                <PenTool size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-4 text-white/20 group-focus-within:text-accent transition-colors`} />
                <textarea id="join_skills" name="skills" required placeholder={t.sections.professional.placeholders.skills} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Financial & Additional Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <DollarSign size={18} />
                </span>
                {t.sections.financial.title}
              </h2>
              <p className={`text-[10px] sm:text-xs text-white/40 ${isAr ? 'mr-11' : 'ml-11'}`}>{t.sections.financial.desc}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.financial.rate}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative flex items-center group">
                  <label htmlFor="join_min_rate" className={`absolute ${isAr ? 'right-4' : 'left-4'} text-white/30 text-[10px] md:text-xs font-bold group-focus-within:text-accent transition-colors`}>{t.sections.financial.min}</label>
                  <input id="join_min_rate" type="number" name="min_rate" min="0" required placeholder="0" className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 ${isAr ? 'pr-20 md:pr-24 pl-14 md:pl-16 text-right' : 'pl-20 md:pl-24 pr-14 md:pr-16 text-left'} text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-sm md:text-base`} dir="ltr" />
                  <span className={`absolute ${isAr ? 'left-4' : 'right-4'} text-white/30 text-[8px] md:text-[10px] font-bold`}>EGP/H</span>
                </div>
                <div className="relative flex items-center group">
                  <label htmlFor="join_max_rate" className={`absolute ${isAr ? 'right-4' : 'left-4'} text-white/30 text-[10px] md:text-xs font-bold group-focus-within:text-accent transition-colors`}>{t.sections.financial.max}</label>
                  <input id="join_max_rate" type="number" name="max_rate" min="0" required placeholder="0" className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 ${isAr ? 'pr-20 md:pr-24 pl-14 md:pl-16 text-right' : 'pl-20 md:pl-24 pr-14 md:pr-16 text-left'} text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all text-sm md:text-base`} dir="ltr" />
                  <span className={`absolute ${isAr ? 'left-4' : 'right-4'} text-white/30 text-[8px] md:text-[10px] font-bold`}>EGP/H</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="join_bio" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.financial.bio}</label>
              <div className="relative group">
                <MessageSquare size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-4 text-white/20 group-focus-within:text-accent transition-colors`} />
                <textarea id="join_bio" name="bio" required placeholder={t.sections.financial.placeholders.bio} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            id="join-submit-btn"
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-accent-light transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 sm:mt-4 group"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send size={20} className={`${isAr ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'} group-hover:-translate-y-1 transition-transform`} />
                <span>{t.submit}</span>
              </>
            )}
          </button>
        </form>
      </main>

      <FeedbackModal 
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          window.scrollTo(0, 0);
          navigate(isAr ? "/ar" : "/");
        }}
        type="success"
        title={t.success.title}
        message={t.success.message}
        buttonText={t.success.btn}
      />

      <FeedbackModal 
        isOpen={!!showError}
        onClose={() => setShowError(null)}
        type="error"
        title={t.error.title}
        message={showError || ""}
        buttonText={t.error.btn}
      />
    </Layout>
  );
}
