import { motion } from 'motion/react';

interface AnimatedQuoteTextProps {
  text: string;
  themeAccentColor: string;
}

export default function AnimatedQuoteText({ text, themeAccentColor }: AnimatedQuoteTextProps) {
  const words = text.split(' ');

  // Deterministically get styling colors for words
  const getWordStyle = (word: string, index: number) => {
    const isIslamicTerm = ["سُوءُ", "الْخُلُقِ", "سِيرَةُ", "الْمَرْءِ", "السَّعِيدُ", "شَرْطُ", "الصَّبْرُ", "الْعِلْمُ", "رَأْسُ", "الْحِكْمَةِ", "اللَّهِ", "مَنْ", "طَلَبَ", "الْحِلْمُ", "سَادَةُ", "الصِّدْقُ", "آفَةُ", "الْأَمَانَةِ", "الْإِيمَانِ", "الْعِبَادَةِ", "آلَةُ", "الرِّيَاسَةِ", "آمِنْ", "الْبَلَاغَةِ", "تَقْوَى"].some(
      term => word.includes(term) || word.startsWith(term)
    );

    if (isIslamicTerm) {
      return {
        color: '#fcd34d', // Bright Golden Yellow
        fontWeight: 'bold',
        textShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
      };
    }

    if (index === 0) {
      return {
        color: themeAccentColor, // Theme principal color (Turquoise, Crimson or Gold)
        fontWeight: 'bold'
      };
    }

    if (index % 3 === 0) {
      return {
        color: '#93c5fd', // Warm pastel sky blue
        fontWeight: 'normal'
      };
    }

    // Default pristine bright white
    return {
      color: '#ffffff',
      fontWeight: 'normal'
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 14
      }
    }
  };

  return (
    <motion.div
      key={text} // Force re-animation on quote switch
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-center items-center gap-x-2 gap-y-3 font-serif text-3xl md:text-4xl text-center leading-relaxed py-6 select-text"
      dir="rtl"
    >
      {words.map((word, index) => {
        const style = getWordStyle(word, index);
        return (
          <motion.span
            key={index}
            variants={childVariants}
            style={style}
            className="inline-block transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer origin-center"
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
