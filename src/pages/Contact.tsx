import { User, Mail, Phone, MessageSquare, Send, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { contactSchema, contactSchemaEn, sanitizeContact } from "../lib/security";
import { useFormSubmission } from "../lib/hooks";
import { Layout } from "../components/Layout";
import { SectionHeader } from "../components/SectionHeader";
import { FeedbackModal } from "../components/FeedbackModal";
import { translations } from "../lib/i18n";

interface ContactProps {
  lang?: "ar" | "en";
}

export default function Contact({ lang = "ar" }: ContactProps) {
  const navigate = useNavigate();
  const t = translations[lang].contact;
  const isAr = lang === "ar";

  const {
    isSubmitting,
    showSuccess,
    showError,
    setShowSuccess,
    setShowError,
    handleSubmit
  } = useFormSubmission({
    schema: isAr ? contactSchema : contactSchemaEn,
    apiEndpoint: '/api/contacts',
    sanitizeFn: (data) => sanitizeContact({
      ...data,
      created_at: new Date().toISOString()
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
          {/* Contact Info Section */}
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
                {t.sections.info.title}
              </h2>
              <p className={`text-[10px] sm:text-xs text-white/40 ${isAr ? 'mr-11' : 'ml-11'}`}>{t.sections.info.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact_full_name" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.info.fullName}</label>
                <div className="relative group">
                  <User size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="contact_full_name" type="text" name="full_name" required placeholder={t.sections.info.placeholders.fullName} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact_email" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.info.email}</label>
                <div className="relative group">
                  <Mail size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="contact_email" type="text" name="email" required placeholder={t.sections.info.placeholders.email} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all ${isAr ? 'text-right' : 'text-left'}`} dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact_phone" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.info.phone}</label>
                <div className="relative group">
                  <Phone size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="contact_phone" type="text" name="phone" required placeholder={t.sections.info.placeholders.phone} className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all ${isAr ? 'text-right' : 'text-left'}`} dir="ltr" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact_subject" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.info.subject}</label>
                <div className="relative group">
                  <Info size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors`} />
                  <input id="contact_subject" type="text" name="subject" required placeholder={t.sections.info.placeholders.subject} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <MessageSquare size={18} />
                </span>
                {t.sections.message.title}
              </h2>
              <p className={`text-[10px] sm:text-xs text-white/40 ${isAr ? 'mr-11' : 'ml-11'}`}>{t.sections.message.desc}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact_message" className={`text-xs font-bold text-white/60 uppercase ${isAr ? 'mr-1' : 'ml-1'}`}>{t.sections.message.text}</label>
              <div className="relative group">
                <MessageSquare size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-4 text-white/20 group-focus-within:text-accent transition-colors`} />
                <textarea id="contact_message" name="message" required placeholder={t.sections.message.placeholders.text} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-12 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            id="contact-submit-btn"
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
