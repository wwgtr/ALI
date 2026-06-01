import React from 'react';
import { motion } from 'motion/react';
import { Saying, WordExplanation, IslamicTheme } from '../types';

interface AnimatedSayingTextProps {
  saying: Saying;
  theme: IslamicTheme;
  fontSizeMultiplier?: number;
  onWordClick: (word: WordExplanation) => void;
}

export const AnimatedSayingText: React.FC<AnimatedSayingTextProps> = ({
  saying,
  theme,
  fontSizeMultiplier = 1,
  onWordClick,
}) => {
  const arabicWords = saying.arabic.split(' ');

  // تنظيف الحركات الزائدة وعلامات الترقيم لاستخلاص الكلمة ومقارنتها بالشرح
  const cleanArabicWord = (word: string): string => {
    return word
      .trim()
      .replace(/[﴿﴾.،,!?؟()]/g, '') // إزالة الأقواس والترقيم
      .replace(/[\u064B-\u0652]/g, ''); // إزالة التشكيل للمطابقة الأساسية إن دعت الحاجة
  };

  const findWordExplanation = (wordStringAr: string): WordExplanation | null => {
    const wordCleaned = cleanArabicWord(wordStringAr);
    if (!wordCleaned) return null;

    for (const we of saying.wordsExplanation) {
      const weCleaned = cleanArabicWord(we.wordAr);
      // التحقق من المطابقة بالاحتواء لتغطية التشكيل أو اللواصق البسيطة
      if (wordCleaned.includes(weCleaned) || weCleaned.includes(wordCleaned)) {
        return we;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full py-4 text-center z-10 relative select-none" id="animated-text-container" dir="rtl">
      <div 
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 font-amiri font-bold text-center leading-relaxed tracking-wide transition-all px-4"
        style={{ fontSize: `${Math.round(26 * fontSizeMultiplier)}px` }}
        id="arabic-animated-words"
      >
        {/* القوس الإسلامي الأيمن البادئ */}
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-4xl select-none"
          style={{ color: theme.ornamentColor }}
          id="islamic-bracket-right"
        >
          ﴿
        </motion.span>

        {arabicWords.map((word, index) => {
          const explanation = findWordExplanation(word);
          return (
            <motion.span
              key={`ar-${index}`}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
                delay: index * 0.04,
              }}
              whileHover={explanation ? { scale: 1.08, y: -2 } : undefined}
              className={`inline-block pb-1 rounded-sm px-1.5 transition-colors duration-200 ${
                explanation
                  ? 'cursor-help font-extrabold border-b-2 border-dotted'
                  : 'font-bold'
              }`}
              style={{
                borderBottomColor: explanation ? theme.ornamentColor : 'transparent',
                color: explanation ? theme.accentTextColor : theme.textColor,
                backgroundColor: explanation ? `${theme.ornamentColor}08` : 'transparent',
              }}
              onClick={explanation ? () => onWordClick(explanation) : undefined}
              id={`ar-word-${index}`}
              title={explanation ? 'اضغط لعرض شرح الكلمة' : undefined}
            >
              {word}
            </motion.span>
          );
        })}

        {/* القوس الإسلامي الأيسر الخاتم */}
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', delay: arabicWords.length * 0.04 }}
          className="text-4xl select-none"
          style={{ color: theme.ornamentColor }}
          id="islamic-bracket-left"
        >
          ﴾
        </motion.span>
      </div>
    </div>
  );
};
