export interface WordExplanation {
  wordAr: string; // الكلمة المراد شرحها
  meaning: string; // المعنى اللغوي الدقيق
  context: string; // الأبعاد الأخلاقية والروحية
  lexicalRoot?: string; // الجذر اللغوي
}

export interface Saying {
  id: number;
  arabic: string; // نص الحكمة بتمام الحركات والضبط
  category: string; // تصنيف الحكمة (أخلاق، علم، صبر، الخ)
  generalExplanation: string; // الشرح والبيان والتعليق الكامل
  source: string; // المصدر الشريف (غرر الحكم، نهج البلاغة)
  wordsExplanation: WordExplanation[]; // التحليل اللغوي للمفردات الأساسية
}

export interface IslamicTheme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  secondaryTextColor: string;
  accentTextColor: string;
  borderColor: string;
  ornamentColor: string;
  glowColor: string;
  isDark: boolean;
}

export type AspectRatioType = '1:1' | '4:5' | '9:16';
