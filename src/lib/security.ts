import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Sanitizes a string to prevent XSS attacks.
 */
export const sanitize = (text: string): string => {
  return DOMPurify.sanitize(text);
};

/**
 * Schema for job application validation.
 */
export const applicationSchema = z.object({
  full_name: z.string().trim().min(1, "الاسم الكامل مطلوب").max(100, "الاسم طويل جداً"),
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("بريد إلكتروني غير صالح").max(250, "البريد الإلكتروني طويل جداً"),
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب").max(50, "رقم الهاتف طويل جداً"),
  location: z.string().trim().min(1, "الموقع مطلوب").max(200, "الموقع طويل جداً"),
  expertise: z.string().trim().min(1, "التخصص مطلوب").max(100, "التخصص طويل جداً"),
  experience: z.string().trim().min(1, "الخبرة مطلوبة").max(50, "الخبرة طويلة جداً"),
  portfolio: z.string().trim().max(500, "الرابط طويل جداً").optional(),
  skills: z.string().trim().max(2000, "المهارات طويلة جداً").optional(),
  min_rate: z.coerce.number().catch(0).default(0),
  max_rate: z.coerce.number().catch(0).default(0),
  bio: z.string().max(2000, "النبذة الشخصية يجب أن لا تتجاوز ٢٠٠٠ حرف").optional(),
});

/**
 * Schema for job application validation (English).
 */
export const applicationSchemaEn = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100, "Name is too long"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(250, "Email is too long"),
  phone: z.string().trim().min(1, "Phone is required").max(50, "Phone number is too long"),
  location: z.string().trim().min(1, "Location is required").max(200, "Location is too long"),
  expertise: z.string().trim().min(1, "Expertise is required").max(100, "Expertise is too long"),
  experience: z.string().trim().min(1, "Experience is required").max(50, "Experience is too long"),
  portfolio: z.string().trim().max(500, "Portfolio link is too long").optional(),
  skills: z.string().trim().max(2000, "Skills is too long").optional(),
  min_rate: z.coerce.number().catch(0).default(0),
  max_rate: z.coerce.number().catch(0).default(0),
  bio: z.string().max(2000, "Bio must not exceed 2000 characters").optional(),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

/**
 * Schema for contact form validation.
 */
export const contactSchema = z.object({
  full_name: z.string().trim().min(1, "الاسم الكامل مطلوب").max(100, "الاسم طويل جداً"),
  email: z.string().trim().min(1, "البريد الإلكتروني مطلوب").email("بريد إلكتروني غير صالح").max(250, "البريد الإلكتروني طويل جداً"),
  phone: z.string().trim().min(1, "رقم الهاتف مطلوب").max(50, "رقم الهاتف طويل جداً"),
  subject: z.string().trim().min(1, "الموضوع مطلوب").max(200, "الموضوع طويل جداً"),
  message: z.string().trim().min(1, "الرسالة مطلوبة").max(2000, "الرسالة طويلة جداً"),
});

/**
 * Schema for contact form validation (English).
 */
export const contactSchemaEn = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100, "Name is too long"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(250, "Email is too long"),
  phone: z.string().trim().min(1, "Phone is required").max(50, "Phone number is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

export type ContactData = z.infer<typeof contactSchema>;

/**
 * Schema for login validation.
 */
export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح").min(1, "البريد الإلكتروني مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة").max(100, "كلمة المرور طويلة جداً"),
});

export type LoginData = z.infer<typeof loginSchema>;

/**
 * Sanitizes an object (e.g., application or contact form data).
 */
export const sanitizeData = (data: any): any => {
  const sanitized: any = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitize(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};

/**
 * Sanitizes an entire application object.
 */
export const sanitizeApplication = (data: any): any => sanitizeData(data);

/**
 * Sanitizes an entire contact object.
 */
export const sanitizeContact = (data: any): any => sanitizeData(data);
