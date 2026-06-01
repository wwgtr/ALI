import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IMAM_ALI_SAYINGS, SHIA_THEMES } from './data';
import { WordExplanation } from './types';
import { PhoneMockup } from './components/PhoneMockup';
import { AnimatedSayingText } from './components/AnimatedSayingText';
import { DetailedExplanationModal } from './components/DetailedExplanationModal';
import { ExportStudio } from './components/ExportStudio';
import {
  IslamicCorner,
  IslamicDivider,
  IslamicPatternBackground,
} from './components/IslamicOrnament';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  Compass,
  Info,
  BookOpen,
  Sliders,
  FileText,
  Menu,
  X,
  Moon,
  Sun,
  Filter,
} from 'lucide-react';

export default function App() {
  const [currentSayingIndex, setCurrentSayingIndex] = useState(0);
  const [currentThemeId, setCurrentThemeId] = useState('emerald');
  const [selectedWord, setSelectedWord] = useState<WordExplanation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyState, setCopyState] = useState<'none' | 'saying' | 'combo' | 'explanation'>('none');
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.04);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('جميع الحكم');

  const currentSaying = IMAM_ALI_SAYINGS[currentSayingIndex];
  const currentTheme = SHIA_THEMES.find((t) => t.id === currentThemeId) || SHIA_THEMES[0];

  // استخلاص التصنيفات المتاحة لتوفير إمكانية الفرز
  const categories = ['جميع الحكم', ...new Set(IMAM_ALI_SAYINGS.map((s) => s.category))];

  // تصفية الحكم حسب التصنيف المختار
  const filteredSayings = selectedCategoryFilter === 'جميع الحكم'
    ? IMAM_ALI_SAYINGS
    : IMAM_ALI_SAYINGS.filter((s) => s.category === selectedCategoryFilter);

  // تحديث المؤشر الفعلي بما يتناسب مع الحكم الُمصفَّاة
  const activeSayingInFilteredIndex = filteredSayings.findIndex((s) => s.id === currentSaying.id);

  const handleNextSaying = () => {
    const nextIdxInFiltered = (activeSayingInFilteredIndex + 1) % filteredSayings.length;
    const realSaying = filteredSayings[nextIdxInFiltered >= 0 ? nextIdxInFiltered : 0];
    const realIdx = IMAM_ALI_SAYINGS.findIndex((s) => s.id === realSaying.id);
    setCurrentSayingIndex(realIdx >= 0 ? realIdx : 0);
    setCopyState('none');
  };

  const handlePrevSaying = () => {
    const prevIdxInFiltered = (activeSayingInFilteredIndex - 1 + filteredSayings.length) % filteredSayings.length;
    const realSaying = filteredSayings[prevIdxInFiltered >= 0 ? prevIdxInFiltered : 0];
    const realIdx = IMAM_ALI_SAYINGS.findIndex((s) => s.id === realSaying.id);
    setCurrentSayingIndex(realIdx >= 0 ? realIdx : 0);
    setCopyState('none');
  };

  const handleWordClick = (word: WordExplanation) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const copyToClipboard = (text: string, type: 'saying' | 'combo' | 'explanation') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyState(type);
      setTimeout(() => setCopyState('none'), 2500);
    });
  };

  // نسخ الحكمة مؤطرة بالقوسين الإسلاميين
  const handleCopySayingOnly = () => {
    const formatted = `﴿ ${currentSaying.arabic} ﴾\n\n— أمير المؤمنين علي بن أبي طالب (عليه السلام)\nالمصدر: ${currentSaying.source}`;
    copyToClipboard(formatted, 'saying');
  };

  // نسخ التحليل والمفردات اللغوية
  const handleCopyExplanationOnly = () => {
    const formatted = `مفردات الحكمة وتحليلها اللغوي:\n${currentSaying.wordsExplanation
      .map((we) => `- ${we.wordAr}: ${we.meaning} (الجذر: ${we.lexicalRoot || 'غير معروف'})`)
      .join('\n')}\n\nالبعد الأخلاقي:\n${currentSaying.generalExplanation}`;
    copyToClipboard(formatted, 'explanation');
  };

  // نسخ الحكمة كاملة مع الشرح الأخلاقي والمصدر
  const handleCopyCombo = () => {
    const formatted = `مِنْ حِكَمِ أَمِيرِ الْمُؤْمِنِينَ (ع):\n﴿ ${currentSaying.arabic} ﴾\n\nالشرح والبيان الأخلاقي:\n${currentSaying.generalExplanation}\n\nالمصدر الشريف: ${currentSaying.source}`;
    copyToClipboard(formatted, 'combo');
  };

  return (
    <div className="min-h-screen bg-[#070809] text-[#e2e4e9] flex flex-col justify-between font-sans overflow-x-hidden relative" id="applet-root" dir="rtl">
      
      {/* هالة جمالية خلفية للأجواء الروحية */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <IslamicPatternBackground color={currentTheme.ornamentColor} opacity={0.015} />

      {/* الهيدر العلوي للموقع */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 z-30 bg-[#070809]/80 backdrop-blur-md relative" id="global-header">
        <div className="flex items-center gap-3" id="header-brand">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.25)] border border-[#FFD700]/10" id="brand-logo-shape">
            <Sparkles className="w-5.5 h-5.5 text-black" />
          </div>
          <div className="text-right" id="brand-text-container">
            <h1 className="font-serif font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-white via-[#FFF9F2] to-amber-300">
              نهج البلاغة ومواعظ الإمام
            </h1>
            <p className="text-[11px] text-stone-400 font-sans tracking-tight">مكتبة رقمية تفاعلية لحكم ومفردات أمير المؤمنين (ع)</p>
          </div>
        </div>

        {/* وضعية سطح المكتب للأيقونات والأدوات */}
        <div className="hidden md:flex items-center gap-4" id="desktop-top-bar">
          <div className="bg-white/5 border border-white/10 py-1.5 px-4 rounded-full flex items-center gap-2 text-xs text-[#D4AF37]" id="shia-badge">
            <Compass className="w-4 h-4 animate-spin-slow text-[#D4AF37]" />
            <span className="font-serif tracking-widest font-extrabold uppercase">تراث البلاغة الإسلامية الأصيل</span>
          </div>
        </div>

        {/* زر الهامبرغر لشاشات الجوال */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[#D4AF37] cursor-pointer"
          id="hamburger-trigger"
          title="قائمة الخيارات"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* قائمة الجوال الهامبرغر المنسدلة (تأثير الزجاج المطفي frosted glass) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end" id="hamburger-menu-drawer">
            {/* الخلفية المفرغة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* الحاوية المنزلقة للقائمة */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 h-full bg-[#0a0b0d]/90 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <div className="space-y-6">
                {/* رأس قائمة الجوال */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="font-serif font-bold text-md text-[#FFEFCF] flex items-center gap-2">
                    <Palette className="w-4.5 h-4.5 text-amber-500" />
                    قائمة التخصيص والمظهر
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full border border-white/10 hover:bg-white/5 text-stone-400 focus:outline-none cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* تصنيف وفرز الحكم بالجوال */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                    فرز الحكم حسب المضمون:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategoryFilter(cat);
                          setCurrentSayingIndex(0);
                        }}
                        className={`w-full text-right py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                          selectedCategoryFilter === cat
                            ? 'border-amber-500 bg-amber-500/10 text-white'
                            : 'border-white/5 bg-transparent text-stone-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* اختيار الثيمات بالجوال */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                    مجموعة التلاوين والفسيفساء:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {SHIA_THEMES.map((theme) => {
                      const isActive = currentThemeId === theme.id;
                      const isDarkCircle = theme.isDark ? 'bg-zinc-950 border-amber-500' : 'bg-amber-100 border-amber-800';
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setCurrentThemeId(theme.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 ${
                            isActive
                              ? 'border-amber-500 bg-amber-500/10 text-white'
                              : 'border-white/5 bg-transparent text-stone-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full border ${isDarkCircle}`} />
                          <span className="truncate">{theme.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* تكبير المقود بالجوال */}
                <div className="space-y-2 pb-4 border-b border-white/5">
                  <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                    مقياس الخط داخل البطاقة:
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-stone-500 font-mono">٧٥%</span>
                    <input
                      type="range"
                      min="0.75"
                      max="1.25"
                      step="0.05"
                      value={fontSizeMultiplier}
                      onChange={(e) => setFontSizeMultiplier(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                    <span className="text-[11px] text-amber-500 font-bold font-mono">
                      {Math.round(fontSizeMultiplier * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* ذيل قائمة الجوال الفيروزية */}
              <div className="text-center text-[10px] text-stone-500 pt-4 border-t border-white/5 space-y-1">
                <p>مواعظ وحكم أمير المؤمنين (ع)</p>
                <div className="flex justify-center items-center gap-1.5 text-amber-500">
                  <Moon className="w-3.5 h-3.5" />
                  <span>النسخة التراثية العربية</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* المكون الرئيسي للمخطوطة والمحرر */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10" id="main-grid-layout">
        
        {/* االعمود الأيمن: الفرز واختيار المحفوظات (تأثير الزجاج المطفي) */}
        <section className="lg:col-span-3 hidden lg:flex flex-col gap-6" id="left-workspace-panel">
          
          {/* صندوق الفرز والتصفية للحكم */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-3 text-right">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-500 uppercase tracking-wider mb-1">
              <Filter className="w-4 h-4" />
              <span>فرز المواعظ المصنّفة</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              اختر لتصفح الحكم المتخصصة بمجالات الأخلاق والآداب:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isActive = selectedCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategoryFilter(cat);
                      setCurrentSayingIndex(0); // تصفير الاختيار عند التغيير
                    }}
                    className={`py-1.5 px-3 rounded-xl border text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-white/5 bg-transparent text-stone-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* محتويات الأرشيف والمخطوطات */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-3 text-right">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-500 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>فهرس الحكم المتاحة ({filteredSayings.length})</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              اختر حكمة بليغة لعرضها وتحليل مواضع بلاغتها:
            </p>
            <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar" id="direct-sayings-scroller">
              {filteredSayings.map((saying, idx) => {
                const isSelected = saying.id === currentSaying.id;
                return (
                  <button
                    key={saying.id}
                    onClick={() => {
                      const realIndex = IMAM_ALI_SAYINGS.findIndex((s) => s.id === saying.id);
                      setCurrentSayingIndex(realIndex >= 0 ? realIndex : 0);
                      setCopyState('none');
                    }}
                    className={`w-full text-right p-3 rounded-xl border text-xs transition-all duration-300 leading-normal focus:outline-none cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-white shadow-inner'
                        : 'border-white/5 bg-transparent text-stone-400 hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 opacity-80 gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500 font-extrabold">
                        الموعظة {saying.id}
                      </span>
                      <span className="text-[9px] truncate max-w-[120px]">{saying.category}</span>
                    </div>
                    <span className="font-amiri text-base block font-bold leading-relaxed tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-white to-amber-200" dir="rtl">
                      ﴿ {saying.arabic} ﴾
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* العمود الوسطي: الهاتف والبطاقة المركزية (تصميم مستوحى من الألعاب والتطبيقات الراقية) */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center w-full" id="mock-mobile-preview-column">
          
          {/* مؤشر ترقيم وتنقل للحكم التفاعلية */}
          <div className="flex items-center justify-between w-full max-w-[430px] px-4 mb-3" id="canvas-stepper" dir="rtl">
            <button
              onClick={handlePrevSaying}
              className="p-2.5 rounded-full border transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer hover:bg-white/5 border-white/10 text-amber-500 focus:outline-none"
              id="prev-saying-control"
              title="الحكمة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="text-center" id="index-stepper-title">
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400`}>
                الفهرس البلاغي
              </span>
              <div className="text-xs font-mono font-bold tracking-widest text-[#FFF9F2] mt-0.5">
                {(filteredSayings.findIndex((s) => s.id === currentSaying.id) + 1) || 1} / {filteredSayings.length}
              </div>
            </div>

            <button
              onClick={handleNextSaying}
              className="p-2.5 rounded-full border transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer hover:bg-white/5 border-white/10 text-amber-500 focus:outline-none"
              id="next-saying-control"
              title="الحكمة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* محاكاة هاتف آبل الحديث لعرض اللائحة الإبداعية */}
          <PhoneMockup themeStyle={currentTheme}>
            <div className="flex-1 flex flex-col justify-between py-2 relative" id="mock-app-framework" dir="rtl">
              
              {/* ترويسة التطبيق الداخلي في جوال المحاكاة */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-2 px-1">
                <span className="text-[11px] font-serif font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  حِكَمُ النَّجَفِ الْأَكْمَلِ
                </span>
                <span className="text-[10px] text-stone-400 tracking-wider">
                  الأدب العرفاني
                </span>
              </div>

              {/* اللوحة التفاعلية المحتوية للحكمة */}
              <div
                className={`relative px-5 py-7 md:py-9 rounded-3xl border flex flex-col items-center justify-center overflow-hidden flex-1 ${currentTheme.textColor}`}
                style={{
                  boxShadow: `inset 0 1px 25px 0 ${currentTheme.glowColor}, 0 10px 25px -5px ${currentTheme.glowColor}`,
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                }}
                id="active-saying-board-card"
              >
                <IslamicPatternBackground color={currentTheme.ornamentColor} opacity={0.06} />

                {/* رسم الزخارف الهندسية في الأركان */}
                <IslamicCorner color={currentTheme.ornamentColor} size={42} className="absolute top-0 right-0" />
                <IslamicCorner color={currentTheme.ornamentColor} size={42} className="absolute top-0 left-0 -scale-x-100" />
                <IslamicCorner color={currentTheme.ornamentColor} size={42} className="absolute bottom-0 right-0 -scale-y-100" />
                <IslamicCorner color={currentTheme.ornamentColor} size={42} className="absolute bottom-0 left-0 -scale-x-100 -scale-y-100" />

                <div className="text-[10px] tracking-widest opacity-80 uppercase mb-4 text-center" style={{ color: currentTheme.ornamentColor }}>
                  * بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ *
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSayingIndex}
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -15 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    className="w-full flex flex-col items-center gap-4 py-2"
                    id="motion-saying-wrapper"
                  >
                    <AnimatedSayingText
                      saying={currentSaying}
                      theme={currentTheme}
                      fontSizeMultiplier={fontSizeMultiplier}
                      onWordClick={handleWordClick}
                    />

                    <IslamicDivider color={currentTheme.ornamentColor} size={90} className="my-2" />

                    <div className="px-2 text-center" id="saying-attribution-source">
                      <span className={`text-[11px] block font-bold mb-0.5 ${currentTheme.secondaryTextColor}`}>
                        أَمِيرُ الْمُؤْمِنِينَ عَلِيُّ بْنُ أَبِي طَالِبٍ (ع)
                      </span>
                      <span className={`text-[9px] opacity-80 font-sans italic block ${currentTheme.textColor}`}>
                        {currentSaying.source}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* إرشادات تفاعلية مذهبة بالخط السفلي */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-sans cursor-pointer bg-white/5 py-2 px-3 rounded-full hover:bg-white/10 transition-colors" id="exegesis-tip">
                <Info className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>المس أي كلمة ملوّنة للحصول على شرحها اللغوي الفوري</span>
              </div>
            </div>
          </PhoneMockup>
        </section>

        {/* العمود الأيسر: الإعدادات وشاشات النسخ والتعديل بالتلاوين */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="right-workspace-panel">
          
          {/* الشرح العام والتعليق البلاغي للحكمة */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl text-right flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                البيان والشرح الأخلاقي للحكمة
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-300">
              {currentSaying.generalExplanation}
            </p>
          </div>

          {/* لوحة التحكم الجمالية بالثيمات في شاشة المكتب */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl text-right hidden lg:flex flex-col gap-3" id="theme-panel-container">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-500 uppercase tracking-wider">
              <Palette className="w-4.5 h-4.5" />
              <span>لوحة الثيمات الفسيفسائية</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              اختر من مجموعة الألوان التراثية العريقة:
            </p>
            <div className="grid grid-cols-2 gap-2" id="desktop-themes-grid">
              {SHIA_THEMES.map((theme) => {
                const isActive = currentThemeId === theme.id;
                const circleColorClass = theme.id === 'parchment' ? 'bg-[#FDFBF7]' :
                  theme.id === 'emerald' ? 'bg-[#043E26]' :
                  theme.id === 'turquoise' ? 'bg-[#074D54]' :
                  theme.id === 'sapphire' ? 'bg-[#1E1B4B]' :
                  theme.id === 'houseofwisdom' ? 'bg-[#351C4D]' :
                  theme.id === 'sage' ? 'bg-[#EFF3EE]' :
                  theme.id === 'obsidian' ? 'bg-[#0D0D11]' : 'bg-[#5C3D2E]';

                return (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentThemeId(theme.id)}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-amber-500/10 text-white font-extrabold'
                        : 'border-white/5 bg-transparent text-stone-400 hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border border-amber-500 shrink-0 ${circleColorClass}`} />
                    <span className="truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* تعديل وتكبير مقياس الحرف لشاشة المكتب */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl text-right hidden lg:flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4.5 h-4.5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                مقياس خط الحكمة
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-stone-500 font-mono">٧٥%</span>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={fontSizeMultiplier}
                onChange={(e) => setFontSizeMultiplier(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-stone-800 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[11px] text-amber-500 font-bold font-mono">
                {Math.round(fontSizeMultiplier * 100)}%
              </span>
            </div>
          </div>

          {/* خيارات نسخ النصوص للأخوة والصداقة والانتشار */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-5 rounded-2xl text-right flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                خيارات نسخ ونشر العبارات
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2" id="copy-options-grid">
              <button
                onClick={handleCopySayingOnly}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none cursor-pointer ${
                  copyState === 'saying'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'border-white/5 bg-white/[0.01] text-stone-300 hover:text-white hover:bg-white/[0.03]'
                }`}
                id="copy-only-saying-btn"
                title="نسخ الحكمة محاطة بالأقواس الإسلامية"
              >
                {copyState === 'saying' ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4 h-4 text-amber-500" />}
                <span>نص الحكمة</span>
              </button>

              <button
                onClick={handleCopyCombo}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none cursor-pointer ${
                  copyState === 'combo'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'border-white/5 bg-white/[0.01] text-stone-300 hover:text-white hover:bg-white/[0.03]'
                }`}
                id="copy-combo-btn"
                title="نسخ الحكمة كاملة مقرونةً بالشرح المفصّل"
              >
                {copyState === 'combo' ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4 h-4 text-amber-500" />}
                <span>الحكمة والمصدر</span>
              </button>

              <button
                onClick={handleCopyExplanationOnly}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 transition-all duration-300 focus:outline-none cursor-pointer ${
                  copyState === 'explanation'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'border-white/5 bg-white/[0.01] text-stone-300 hover:text-white hover:bg-white/[0.03]'
                }`}
                id="copy-only-explanation-btn"
                title="نسخ التحليل اللغوي للمفردات وعلم الكلمة"
              >
                {copyState === 'explanation' ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4 h-4 text-amber-500" />}
                <span>تحليل الكلمات</span>
              </button>
            </div>
          </div>

          {/* استوديو التصدير العبقري للصور العالية الجودة */}
          <ExportStudio saying={currentSaying} theme={currentTheme} />
        </section>
      </main>

      {/* الهامش السفلي الرقيق للتوثيق والذكر الفكري الشريف */}
      <footer className="w-full border-t border-white/5 py-5 mt-6 z-10 bg-[#040405]/80 backdrop-blur-md" id="global-footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-stone-500" id="footer-guts">
          <p id="copyright-terms" className="text-center md:text-right">
            © ٢٠٢٦ كتاب نهج البلاغة والتراث الأصيل — إنتاج رقمي فخم بخامات وتأثيرات زجاجية تفاعلية.
          </p>
          <div className="flex items-center gap-4" id="footer-links">
            <span className="hover:text-stone-300 transition-colors select-none">حقوق النشر والنسخ محفوظة</span>
            <span className="text-stone-800">|</span>
            <span className="hover:text-stone-300 transition-colors select-none">جودة عالية (Vector Export)</span>
          </div>
        </div>
      </footer>

      {/* نافذة تفصيل المعاني والتحليل اللغوي عند الضغط */}
      <DetailedExplanationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        word={selectedWord}
        theme={currentTheme}
      />
    </div>
  );
}
