import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WordExplanation, IslamicTheme } from '../types';
import { X, BookOpen, Fingerprint } from 'lucide-react';
import { IslamicCorner } from './IslamicOrnament';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: WordExplanation | null;
  theme: IslamicTheme;
}

export const DetailedExplanationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  word,
  theme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && word && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none" id="explanation-modal-portal" dir="rtl">
          {/* خلفية غامقة مفرغة ومغبشة لإبراز تأثير الزجاج */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            id="modal-backdrop-trigger"
          />

          <motion.div
            className={`relative w-full max-w-lg rounded-2xl p-7 md:p-9 border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${
              theme.isDark ? 'bg-black/40 backdrop-blur-lg border-white/10' : 'bg-white/70 backdrop-blur-lg border-black/10'
            }`}
            style={{ 
              boxShadow: `0 20px 40px -15px ${theme.glowColor}, inset 0 1px 1px 0 rgba(255,255,255,0.15)`
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 150 }}
            id="modal-content-container"
          >
            {/* الزوايا الإسلامية المزخرفة */}
            <IslamicCorner color={theme.ornamentColor} size={50} className="absolute top-0 right-0 scale-x-100" />
            <IslamicCorner color={theme.ornamentColor} size={50} className="absolute top-0 left-0 -scale-x-100" />
            <IslamicCorner color={theme.ornamentColor} size={50} className="absolute bottom-0 right-0 -scale-y-100" />
            <IslamicCorner color={theme.ornamentColor} size={50} className="absolute bottom-0 left-0 -scale-x-100 -scale-y-100" />

            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className={`absolute top-4 left-4 z-10 p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${theme.textColor} ${theme.borderColor} bg-white/5 hover:bg-white/10`}
              id="close-modal-button"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center mt-3" id="modal-body">
              {/* أيقونة كتاب مفتوح علوية */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border bg-white/5"
                style={{ borderColor: theme.ornamentColor, color: theme.ornamentColor }}
                id="modal-icon-header"
              >
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>

              {/* الكلمة المعروضة */}
              <span className={`text-5xl font-amiri font-bold mb-3 tracking-wide filter drop-shadow ${theme.accentTextColor}`} id="arabic-word">
                {word.wordAr}
              </span>

              {/* الجذر اللغوي */}
              {word.lexicalRoot && (
                <div
                  className="px-4 py-1 rounded-full text-xs font-serif font-semibold tracking-wider my-2 flex items-center gap-1.5 border backdrop-blur-sm shadow-sm"
                  style={{ borderColor: `${theme.ornamentColor}30`, backgroundColor: `${theme.ornamentColor}10` }}
                  id="lexical-root-container"
                >
                  <Fingerprint className="w-3.5 h-3.5" style={{ color: theme.ornamentColor }} />
                  <span className={`${theme.textColor} opacity-80 font-medium`}>الجذر اللغوي:</span>
                  <span className="font-extrabold pr-0.5 tracking-[0.2em] text-amber-500">{word.lexicalRoot}</span>
                </div>
              )}

              {/* فاصل إسلامي رقيق */}
              <div className="w-full h-[1px] my-5 opacity-20" style={{ backgroundColor: theme.ornamentColor }} id="modal-divider" />

              {/* تفاصيل المضمون والشرح */}
              <div className="text-right w-full space-y-5 px-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-thin" id="definition-section">
                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${theme.secondaryTextColor}`} id="meaning-label">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.ornamentColor }} />
                    المعنى اللغوي الدقيق
                  </h4>
                  <p className={`text-sm leading-relaxed font-sans font-medium ${theme.textColor}`} id="meaning-content">
                    {word.meaning}
                  </p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${theme.secondaryTextColor}`} id="context-label">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.ornamentColor }} />
                    البعد القيمي والروحي للحكمة
                  </h4>
                  <p className={`text-sm leading-relaxed font-sans opacity-95 ${theme.textColor}`} id="context-content">
                    {word.context}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
