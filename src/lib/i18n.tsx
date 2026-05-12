import React from "react";
import { Crown, PenTool, MonitorSmartphone, Terminal, Rocket } from "lucide-react";

export const translations = {
  ar: {
    home: {
      hero: {
        title: <>حول أفكارك إلى <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">نجاح رقمي</span> معنا!</>,
        description: "شريكك في بناء العلامات التجارية، والتصميم الرقمي، وتطوير الويب، وتجارب تطبيقات الهواتف",
        primaryBtn: "ابدأ مشروعك",
        secondaryBtn: "تواصل معنا",
        scrollText: "تمرير"
      },
      about: {
        subtitle: "من نحن",
        title: <>نحن لا نواكب المستقبل، <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">نحن نصنعه.</span></>,
        description: (
          <p>
            <strong className="text-white font-bold">إيفيكت ميديا</strong> هي وكالة رقمية متكاملة تهدف إلى تحقيق نمو حقيقي وقابل للقياس. نمزج بين الاستراتيجية، والإبداع، والتكنولوجيا لمساعدة العلامات التجارية على التوسع بشكل أسرع.
          </p>
        ),
        features: [
          "قرارات مبنية على تحليل البيانات",
          "تنفيذ إبداعي يخطف الأنظار",
          "شراكات طويلة المدى"
        ]
      },
      services: {
        subtitle: "خدماتنا",
        title: <>ماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">نقدم؟</span></>,
        description: "حلول رقمية متكاملة مصممة خصيصاً لتنمية أعمالك وتعظيم حضورك الرقمي.",
        items: [
          { id: "01", title: "بناء العلامات التجارية", desc: "نصنع هويات بصرية وعلامات تجارية تعكس رؤية مشروعك وتمنحه حضورًا قويًا ومميزًا في السوق.", icon: <PenTool size={24} /> },
          { id: "02", title: "تصميم التجارب الرقمية", desc: "نصمم واجهات وتجارب استخدام عصرية تجمع بين الجمال، البساطة، وسهولة الاستخدام لتحقيق أفضل تجربة لعملائك.", icon: <MonitorSmartphone size={24} /> },
          { id: "03", title: "تطوير الويب والتطبيقات", desc: "نطور مواقع إلكترونية وتطبيقات عالية الأداء تجمع بين السرعة، الجودة، والتقنيات الحديثة لدعم نمو أعمالك", icon: <Terminal size={24} /> },
        ]
      },
      pricing: {
        subtitle: "الباقات",
        title: <>مستويات <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">الخدمة</span></>,
        description: "نقدم حلولاً مرنة تناسب ميزانيتك ومرحلة مشروعك",
        levels: [
          { 
            level: "المستوى ١", 
            name: "بريميوم", 
            desc: "تنفيذ عالي المستوى للعلامات التجارية التي تبحث عن الأفضل. استراتيجيات متقدمة، فريق ذو خبرة عالية، وتركيز كامل على تحقيق أقصى النتائج.",
            icon: <Crown size={32} />
          },
          { 
            level: "المستوى ٢", 
            name: "أساسي", 
            desc: "حلول ذكية بتكلفة مناسبة دون التضحية بالجودة. مناسبة للشركات الناشئة والمشروعات في مرحلة النمو.",
            icon: <Rocket size={32} />
          }
        ]
      }
    },
    join: {
      subtitle: "فرص العمل",
      title: <>انضم إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">فريقنا</span></>,
      description: "نحن نبحث دائماً عن المواهب الاستثنائية للانضمام إلى فريق إيفيكت ميديا. املأ النموذج أدناه وسنتواصل معك.",
      sections: {
        personal: {
          title: "المعلومات الشخصية",
          desc: "أخبرنا قليلاً عن نفسك وكيف يمكننا التواصل معك.",
          fullName: "الاسم الكامل",
          email: "البريد الإلكتروني",
          phone: "رقم الهاتف",
          location: "البلد / المدينة",
          placeholders: {
            fullName: "أدخل اسمك الكامل",
            email: "أدخل بريدك الإلكتروني",
            phone: "أدخل رقم هاتفك",
            location: "أين تقيم؟"
          }
        },
        professional: {
          title: "الخبرة والتخصص",
          desc: "ساعدنا في فهم مهاراتك ومجالات إبداعك.",
          expertise: "مجال تخصصك الأساسي",
          experience: "سنوات الخبرة",
          portfolio: "معرض الأعمال / أعمال سابقة",
          skills: "الأدوات والمهارات",
          placeholders: {
            expertise: "اختر مجال تخصصك",
            portfolio: "شارك رابطاً لأعمالك (Behance، Drive، موقع شخصي، إلخ)",
            skills: "ما هي الأدوات أو التقنيات التي تستخدمها؟ (مثل Photoshop، Premiere Pro، Figma، WordPress، Google Ads...)"
          },
          options: ["أقل من سنة", "١-٣ سنوات", "أكثر من ٣ سنوات"],
          expertiseOptions: [
            { value: "digital-marketing", label: "التسويق الرقمي (Digital Marketing)" },
            { value: "video-editing", label: "تحرير الفيديو (Video Editing)" },
            { value: "graphic-design", label: "التصميم الجرافيكي (Graphic Design)" },
            { value: "web-design", label: "تصميم المواقع (Web Design)" },
            { value: "web-development", label: "تطوير المواقع (Web Development)" },
            { value: "programming", label: "البرمجة (تطبيقات الويب / الجوال)" },
            { value: "content-creation", label: "صناعة المحتوى (Content Creation)" },
            { value: "media-buying", label: "شراء الوسائط (Media Buying)" },
            { value: "other", label: "أخرى (يرجى التحديد)" }
          ]
        },
        financial: {
          title: "التفاصيل المالية والإضافية",
          desc: "ساعدنا في مطابقتك مع المشاريع المناسبة لميزانيتك.",
          rate: "معدل الأجر بالساعة (جنيه مصري)",
          min: "الحد الأدنى",
          max: "الحد الأقصى",
          bio: "نبذة عنك",
          placeholders: {
            bio: "صف باختصار خبرتك ومهاراتك وما يمكنك تقديمه للفريق..."
          }
        }
      },
      submit: "إرسال طلب الانضمام",
      success: {
        title: "تم الإرسال بنجاح!",
        message: "شكراً لاهتمامك بالانضمام إلى إيفيكت ميديا. لقد استلمنا طلبك وسيقوم فريقنا بمراجعته والتواصل معك في أقرب وقت ممكن.",
        btn: "العودة للرئيسية"
      },
      error: {
        title: "خطأ في الإرسال",
        btn: "إغلاق"
      }
    },
    contact: {
      subtitle: "تواصل معنا",
      title: <>نحن هنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">لسماعك</span></>,
      description: "هل لديك استفسار أو تود بدء مشروع جديد؟ املأ النموذج أدناه وسيقوم فريقنا بالرد عليك في أقرب وقت.",
      sections: {
        info: {
          title: "معلومات التواصل",
          desc: "أدخل بياناتك لنتمكن من الرد على رسالتك.",
          fullName: "الاسم الكامل",
          email: "البريد الإلكتروني",
          phone: "رقم الهاتف",
          subject: "الموضوع",
          placeholders: {
            fullName: "أدخل اسمك الكامل",
            email: "أدخل بريدك الإلكتروني",
            phone: "أدخل رقم هاتفك",
            subject: "ما هو موضوع رسالتك؟"
          }
        },
        message: {
          title: "الرسالة",
          desc: "اكتب تفاصيل استفسارك أو مشروعك هنا.",
          text: "نص الرسالة",
          placeholders: {
            text: "كيف يمكننا مساعدتك؟"
          }
        }
      },
      submit: "إرسال الرسالة",
      success: {
        title: "تم الإرسال بنجاح!",
        message: "شكراً لتواصلك مع إيفيكت ميديا. لقد استلمنا رسالتك وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.",
        btn: "العودة للرئيسية"
      },
      error: {
        title: "خطأ في الإرسال",
        btn: "إغلاق"
      }
    }
  },
  en: {
    home: {
      hero: {
        title: <>Turn your ideas&nbsp;into <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Digital Success</span> with us!</>,
        description: "Your partner in branding, digital design, web development, and mobile app experiences.",
        primaryBtn: "Start Your Project",
        secondaryBtn: "Contact Us",
        scrollText: "Scroll"
      },
      about: {
        subtitle: "About Us",
        title: <>We don't just keep up with the future, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">We create it.</span></>,
        description: (
          <p>
            <strong className="text-white font-bold">Effect Media</strong> is an integrated digital agency aiming to achieve real, measurable growth. We blend strategy, creativity, and technology to help brands scale faster.
          </p>
        ),
        features: [
          "Data-driven decisions",
          "Eye-catching creative execution",
          "Long-term partnerships"
        ]
      },
      services: {
        subtitle: "Our Services",
        title: <>What <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">we offer?</span></>,
        description: "Integrated digital solutions tailored to grow your business and maximize your digital presence.",
        items: [
          { id: "01", title: "Branding", desc: "We create distinctive brand identities that reflect your vision and give your business a strong and memorable presence.", icon: <PenTool size={24} /> },
          { id: "02", title: "Digital Design", desc: "We design modern digital experiences that combine creativity, simplicity, and seamless user experience.", icon: <MonitorSmartphone size={24} /> },
          { id: "03", title: "Web & Mobile Development", desc: "We build high-performance websites and mobile applications using modern technologies to support your business growth.", icon: <Terminal size={24} /> },
        ]
      },
      pricing: {
        subtitle: "Packages",
        title: <>Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Levels</span></>,
        description: "We offer flexible solutions that fit your budget and project stage",
        levels: [
          { 
            level: "Level 1", 
            name: "Premium", 
            desc: "High-level execution for brands seeking the best. Advanced strategies, highly experienced team, and full focus on maximum results.",
            icon: <Crown size={32} />
          },
          { 
            level: "Level 2", 
            name: "Basic", 
            desc: "Smart solutions at an affordable cost without sacrificing quality. Suitable for startups and growing projects.",
            icon: <Rocket size={32} />
          }
        ]
      }
    },
    join: {
      subtitle: "Careers",
      title: <>Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Our Team</span></>,
      description: "We are always looking for exceptional talent to join the Effect Media team. Fill out the form below and we will contact you.",
      sections: {
        personal: {
          title: "Personal Information",
          desc: "Tell us a little about yourself and how we can reach you.",
          fullName: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          location: "Country / City",
          placeholders: {
            fullName: "Enter your full name",
            email: "Enter your email address",
            phone: "Enter your phone number",
            location: "Where do you live?"
          }
        },
        professional: {
          title: "Experience & Expertise",
          desc: "Help us understand your skills and areas of creativity.",
          expertise: "Primary Area of Expertise",
          experience: "Years of Experience",
          portfolio: "Portfolio / Previous Work",
          skills: "Tools & Skills",
          placeholders: {
            expertise: "Select your area of expertise",
            portfolio: "Share a link to your work (Behance, Drive, Personal Website, etc.)",
            skills: "What tools or technologies do you use? (e.g., Photoshop, Premiere Pro, Figma, WordPress, Google Ads...)"
          },
          options: ["Less than 1 year", "1-3 years", "More than 3 years"],
          expertiseOptions: [
            { value: "digital-marketing", label: "Digital Marketing" },
            { value: "video-editing", label: "Video Editing" },
            { value: "graphic-design", label: "Graphic Design" },
            { value: "web-design", label: "Web Design" },
            { value: "web-development", label: "Web Development" },
            { value: "programming", label: "Programming (Web / Mobile Apps)" },
            { value: "content-creation", label: "Content Creation" },
            { value: "media-buying", label: "Media Buying" },
            { value: "other", label: "Other" }
          ]
        },
        financial: {
          title: "Financial & Additional Details",
          desc: "Help us match you with projects that fit your budget.",
          rate: "Hourly Rate (EGP)",
          min: "Minimum",
          max: "Maximum",
          bio: "About You",
          placeholders: {
            bio: "Briefly describe your experience, skills, and what you can bring to the team..."
          }
        }
      },
      submit: "Submit Application",
      success: {
        title: "Submitted Successfully!",
        message: "Thank you for your interest in joining Effect Media. We have received your application and our team will review it and contact you as soon as possible.",
        btn: "Back to Home"
      },
      error: {
        title: "Submission Error",
        btn: "Close"
      }
    },
    contact: {
      subtitle: "Contact Us",
      title: <>We are here <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">to listen</span></>,
      description: "Do you have an inquiry or want to start a new project? Fill out the form below and our team will respond soon.",
      sections: {
        info: {
          title: "Contact Information",
          desc: "Enter your details so we can respond to your message.",
          fullName: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          subject: "Subject",
          placeholders: {
            fullName: "Enter your full name",
            email: "Enter your email address",
            phone: "Enter your phone number",
            subject: "What is the subject of your message?"
          }
        },
        message: {
          title: "Message",
          desc: "Write the details of your inquiry or project here.",
          text: "Message Text",
          placeholders: {
            text: "How can we help you?"
          }
        }
      },
      submit: "Send Message",
      success: {
        title: "Submitted Successfully!",
        message: "Thank you for contacting Effect Media. We have received your message and our team will respond as soon as possible.",
        btn: "Back to Home"
      },
      error: {
        title: "Submission Error",
        btn: "Close"
      }
    }
  }
};
