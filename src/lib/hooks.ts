import { useState, useEffect } from 'react';
import { z } from 'zod';

interface UseFormSubmissionOptions<T> {
  schema: z.ZodSchema<T>;
  apiEndpoint: string;
  onSuccess?: (data: any) => void;
  sanitizeFn?: (data: T) => any;
  transformData?: (data: T) => any;
  errorMessages?: {
    unexpected?: string;
    invalid?: string;
  };
}

export function useFormSubmission<T>({
  schema,
  apiEndpoint,
  onSuccess,
  sanitizeFn,
  transformData,
  errorMessages = {
    unexpected: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    invalid: 'بيانات غير صالحة'
  }
}: UseFormSubmissionOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  useEffect(() => {
    if (showSuccess || showError) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuccess, showError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get('website')) {
      setIsSubmitting(false);
      setShowSuccess(true);
      form.reset();
      return;
    }

    const rawData: any = {};
    formData.forEach((value, key) => {
      rawData[key] = value;
    });

    try {
      const validatedData = schema.parse(rawData);
      
      let dataToSubmit = transformData ? transformData(validatedData) : validatedData;
      if (sanitizeFn) {
        dataToSubmit = sanitizeFn(dataToSubmit);
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إرسال الطلب');
      }

      setShowSuccess(true);
      form.reset();
      if (onSuccess) onSuccess(await response.json());
    } catch (error: any) {
      console.error("Submission error:", error);
      let message = errorMessages.unexpected || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      
      if (error && (error instanceof z.ZodError || error.name === 'ZodError')) {
        const issues = error.errors || error.issues || [];
        message = issues[0]?.message || errorMessages.invalid || 'بيانات غير صالحة';
      } else if (Array.isArray(error) && error.length > 0 && error[0]?.message) {
        message = error[0].message;
      } else if (error && typeof error === 'object' && error.error) {
        message = error.error;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      if (typeof message === 'string' && (message.startsWith('[') || message.startsWith('{'))) {
        try {
          const parsed = JSON.parse(message);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            message = parsed[0].message;
          } else if (parsed.error) {
            message = parsed.error;
          } else if (parsed.message) {
            message = parsed.message;
          }
        } catch (e) {
          // Fallback if message is not valid JSON
        }
      }
      
      setShowError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showSuccess,
    showError,
    setShowSuccess,
    setShowError,
    handleSubmit
  };
}
