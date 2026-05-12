import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X } from "lucide-react";
import React from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function FeedbackModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  buttonText, 
  onButtonClick 
}: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-deep-black border border-white/10 p-6 sm:p-8 md:p-12 rounded-3xl max-w-md w-full text-center"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              type === 'success' ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'
            }`}>
              {type === 'success' ? <CheckCircle2 size={40} /> : <X size={40} />}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-4">{title}</h2>
            <p className="text-white/50 mb-8 leading-relaxed">{message}</p>
            <button 
              onClick={onButtonClick || onClose}
              className={`w-full py-4 rounded-xl font-bold transition-all border ${
                type === 'success' 
                  ? 'bg-white text-black hover:bg-accent hover:text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/10'
              }`}
            >
              {buttonText}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
