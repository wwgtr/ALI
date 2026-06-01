import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Download,
  Copy,
  Check,
  Search,
  RotateCcw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  X,
  Share2,
  Columns
} from 'lucide-react';

import { Quote, ThemeConfig, ThemeId, ExportDimension } from './types';
import { quotesData, ambiguousWordsDictionary } from './data/quotes';
import { themes } from './data/themes';
import { downloadQuoteAsImage } from './utils/canvasExport';
import AnimatedQuoteText from './components/AnimatedQuoteText';
import PhoneMockup from './components/PhoneMockup';

export default function App() {
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>('najaf_gold');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'saying' | 'explanation' | 'both' | null>(null);

  const [explainWord, setExplainWord] = useState<string | null>(null);
  const [wordExplanation, setWordExplanation] = useState<string>('');
  const [isLoadingWord, setIsLoadingWord] = useState<boolean>(false);

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportDimension, setExportDimension] = useState<ExportDimension>('instagram_square');
  const [exportIncludeExplanation, setExportIncludeExplanation] = useState<boolean>(true);
  const [exportBgTexture, setExportBgTexture] = useState<'parchment' | 'solid' | 'marble'>('parchment');

  const currentTheme = useMemo(() => {
    return themes.find(t => t.id === selectedThemeId) || themes[0];
  }, [selectedThemeId]);

  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return quotesData;
    const q = searchQuery.toLowerCase();
    return quotesData.filter(quote =>
      quote.text.includes(q) || (quote.explanation && quote.explanation.includes(q))
    );
  }, [searchQuery]);

  const activeQuote = useMemo<Quote>(() => {
    if (filteredQuotes.length === 0) {
      return { id: 0, text: "لَمْ يَتِمَّ الْعُثُورُ عَلَى حِكْمَةٍ." };
    }
    const idx = Math.min(currentQuoteIndex, filteredQuotes.length - 1);
    return filteredQuotes[idx >= 0 ? idx : 0];
  }, [filteredQuotes, currentQuoteIndex]);

  useEffect(() => {
    setCurrentQuoteIndex(0);
    setAiExplanation(null);
  }, [searchQuery]);

  const handleNextQuote = () => {
    if (filteredQuotes.length <= 1) return;
    setCurrentQuoteIndex((prev) => (prev + 1) % filteredQuotes.length);
    setAiExplanation(null);
    setExplainWord(null);
  };

  const handlePrevQuote = () => {
    if (filteredQuotes.length <= 1) return;
    setCurrentQuoteIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
    setAiExplanation(null);
    setExplainWord(null);
  };

  const handleRandomQuote = () => {
    if (filteredQuotes.length <= 1) return;
    const randomIdx = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuoteIndex(randomIdx);
    setAiExplanation(null);
    setExplainWord(null);
  };

  const normalizeArabic = (text: string): string => {
    return text.replace(/[\u064B-\u0652]/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };

  const handleWordClick = async (clickedWord: string) => {
    const cleanedWord = clickedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    if (!cleanedWord) return;

    setExplainWord(cleanedWord);
    setIsLoadingWord(true);
    setWordExplanation('');

    const normalizedClicked = normalizeArabic(cleanedWord);
    let matchedExplanation = '';

    for (const key of Object.keys(ambiguousWordsDictionary)) {
      if (normalizeArabic(key) === normalizedClicked) {
        matchedExplanation = ambiguousWordsDictionary[key].explanation;
        break;
      }
    }

    if (matchedExplanation) {
      setWordExplanation(matchedExplanation);
      setIsLoadingWord(false);
      return;
    }

    try {
      const response = await fetch('/api/explain-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: cleanedWord, quote: activeQuote.text })
      });
      const data = await response.json();
      if (data.explanation) {
        setWordExplanation(data.explanation);
      } else {
        setWordExplanation(`شرح بلاغي لكلمة "${cleanedWord}" ضمن سياق الأثر الشريف.`);
      }
    } catch {
      setWordExplanation(`شرح بلاغي لكلمة "${cleanedWord}" ضمن سياق الأثر الشريف.`);
    } finally {
      setIsLoadingWord(false);
    }
  };

  const handleFetchAiExplanation = async () => {
    if (!activeQuote.text || activeQuote.id === 0) return;
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/explain-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: activeQuote.text })
      });
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      }
    } catch {
      setAiExplanation("لم نتمكن من الاتصال بخدمة الذكاء الاصطناعي. الرجاء التحقق من وجود مفتاح الذكاء الاصطناعي.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopyText = (type: 'saying' | 'explanation' | 'both') => {
    if (activeQuote.id === 0) return;

    let textToCopy = '';
    if (type === 'saying') {
      textToCopy = activeQuote.text;
    } else if (type === 'explanation') {
      textToCopy = activeQuote.explanation || '';
    } else {
      textToCopy = `${activeQuote.text}\n\nالشرح الإيماني:\n${activeQuote.explanation || ''}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleExportSubmit = () => {
    if (activeQuote.id === 0) return;
    downloadQuoteAsImage(activeQuote, currentTheme, exportDimension, exportIncludeExplanation, exportBgTexture);
    setIsExportOpen(false);
  };

  const currentHijriDay = "١٨ ذو الحجة ١٤٤٧ هـ";

  return (
    <PhoneMockup isfullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen(!isFullscreen)} hijriDayString={currentHijriDay}>
      
      {/* App Body Frame with current selected Arabic classic theme gradient */}
      <div className={`w-full h-full flex flex-col justify-between relative overflow-hidden transition-all duration-700 ${currentTheme.bgClass}`} style={{
        background: `linear-gradient(135deg, ${currentTheme.bgGradientStart} 0%, ${currentTheme.bgGradientEnd} 100%)`
      }}>
        
        {/* Intricate Islamic Header Arc */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
            <path d="M0,0 L400,0 L400,20 C320,80 280,80 200,10 C120,80 80,80 0,20 Z" fill={currentTheme.accentColorHex} />
          </svg>
        </div>

        {/* Scrollable Main UI Area */}
        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 relative z-10 scrollbar-thin">
          
          {/* Header Islamic Title Block */}
          <div className="text-center mb-6 mt-2 flex flex-col items-center justify-center">
            
            {/* Islamic Decoration Header from Artistic Flair */}
            <div className="flex justify-center mb-4 scale-90">
              <div className="w-14 h-14 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center">
                <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center -rotate-45 bg-black/30">
                  <span className="text-[11px] font-serif font-bold text-[#F3E5AB]">عـلي</span>
                </div>
              </div>
            </div>

            <h1 className="font-kufi text-2xl tracking-wide font-bold metallic-gold-text">غُـرَرُ الْحِـكَـمِ</h1>
            <p className="text-[10px] font-sans opacity-75 tracking-wider text-[#E0C9A6]">كَلَامُ أَمِيرِ الْمُؤْمِنِينَ (عَلَيْهِ السَّلَامُ)</p>
          </div>

          {/* Search bar inside the iOS view */}
          <div className="relative mb-6">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث في حكم الإمام علي (ع)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-2xl text-xs bg-stone-900/50 border border-stone-800 focus:border-amber-500/50 outline-none text-stone-200 transition-all font-sans text-right placeholder-stone-500"
              dir="rtl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute left-3 top-3 text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Counter Stats Badge */}
          <div className="flex justify-between items-center px-2 mb-4 text-[10px] font-sans text-stone-400">
            <span>النتائج المتاحة: {filteredQuotes.length}</span>
            {filteredQuotes.length > 0 && (
              <span>الحكمة {currentQuoteIndex + 1} من {filteredQuotes.length}</span>
            )}
          </div>

          {/* Master Sayings Display Card */}
          {filteredQuotes.length > 0 ? (
            <div className={`p-6 rounded-3xl border backdrop-blur-md flex flex-col justify-between transition-all duration-500 ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.glowClass}`}>
              
              {/* Card traditional frame corner anchors */}
              <div className="flex justify-between items-center opacity-60 text-xs mb-3 text-stone-400">
                <span>❖</span>
                <span className="font-kufi text-[9px] text-amber-500/90">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <span>❖</span>
              </div>

              {/* Kinetic animated quote text rendering clickable words */}
              <div className="my-4">
                <AnimatedQuoteText text={activeQuote.text} themeAccentColor={currentTheme.accentColorHex} />
                <p className="text-center font-sans text-[11px] text-amber-500/70 mt-3 animate-pulse">
                  💡 انقر على أي كلمة مراد شرحها لبيان معناها الأدبي
                </p>
              </div>

              {/* Words Splitter for Click triggers backup list */}
              <div className="flex flex-wrap justify-center items-center gap-1.5 py-4 border-t border-b border-stone-700/20 mt-4 h-24 overflow-y-auto" dir="rtl">
                {activeQuote.text.split(' ').map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handleWordClick(word)}
                    className="px-2.5 py-1 text-xs rounded-xl bg-stone-900/60 hover:bg-amber-500/20 active:scale-95 transition-all text-stone-300 font-serif border border-stone-800"
                  >
                    {word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")}
                  </button>
                ))}
              </div>

              {/* Classic Pre-coded theological explanation box */}
              {activeQuote.explanation && (
                <div className="mt-5 p-4 rounded-2xl bg-black/30 border border-stone-800/40" dir="rtl">
                  <div className="flex items-center gap-2 text-stone-300 text-xs font-kufi mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>التبيان والتحليل</span>
                  </div>
                  <p className="font-sans text-xs text-stone-300 leading-relaxed text-right">
                    {activeQuote.explanation}
                  </p>
                </div>
              )}

              {/* Gilded seal overlay graphic decoration */}
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 font-serif bg-amber-500/5 shadow-inner">
                  ع
                </div>
              </div>

            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-neutral-900/50 border border-stone-800 text-stone-400 text-sm">
              <RotateCcw className="w-6 h-6 mx-auto mb-3 text-stone-500 animate-spin" />
              لا توجد نتائج مطابقة لبحثك. جرب كلمة أخرى.
            </div>
          )}

          {/* Dynamic AI Theological Grounding Assistant Box */}
          {activeQuote.id !== 0 && (
            <div className="mt-5 p-4 rounded-3xl bg-neutral-950/40 border border-stone-800/50 flex flex-col gap-3">
              <div className="flex justify-between items-center" dir="rtl">
                <div className="flex items-center gap-2 text-xs font-kufi">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>تفسير بلاغي معزز بالذكاء الاصطناعي</span>
                </div>
                {!aiExplanation && !isLoadingAi && (
                  <button
                    onClick={handleFetchAiExplanation}
                    className="px-3 py-1 text-[10px] rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 active:scale-95 transition-all font-sans"
                  >
                    توليد شرح
                  </button>
                )}
              </div>

              {isLoadingAi && (
                <div className="text-center py-4 font-sans text-xs text-amber-500/70 animate-pulse">
                  🔄 جاري تصفح أثير نهج البلاغة وغرر الكلم...
                </div>
              )}

              {aiExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="font-sans text-xs text-stone-300 leading-relaxed text-right p-3 bg-black/40 rounded-2xl border border-stone-800/60"
                  dir="rtl"
                >
                  {aiExplanation}
                </motion.div>
              )}
            </div>
          )}

          {/* Social Quick Share copy actions */}
          {activeQuote.id !== 0 && (
            <div className="grid grid-cols-3 gap-2 mt-5" dir="rtl">
              <button
                onClick={() => handleCopyText('saying')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800 hover:bg-stone-800/60 active:scale-95 transition-all text-stone-300"
              >
                {copiedType === 'saying' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-[10px] font-sans">نسخ الحكمة</span>
              </button>
              <button
                onClick={() => handleCopyText('explanation')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800 hover:bg-stone-800/60 active:scale-95 transition-all text-stone-300"
              >
                {copiedType === 'explanation' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="text-[10px] font-sans">نسخ الشرح فقط</span>
              </button>
              <button
                onClick={() => handleCopyText('both')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800 hover:bg-stone-800/60 active:scale-95 transition-all text-stone-300"
              >
                {copiedType === 'both' ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="text-[10px] font-sans">نسخ الحكمة والشرح</span>
              </button>
            </div>
          )}

        </div>

        {/* Bottom Drawer & Options Panel */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 backdrop-blur-lg rounded-t-[36px] z-20 flex flex-col gap-4">
          
          {/* Theme Selector (10 preset orbits) */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-kufi text-stone-400 text-right mr-1">⚙ اختر السلوك الروحي والنمط البصري (العشرات):</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x" dir="rtl">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-sans transition-all shrink-0 snap-center border flex items-center gap-1.5 ${
                    selectedThemeId === t.id
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-semibold'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: t.accentColorHex }}></span>
                  {t.nameAr.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Show Navigation carousel and Download trigger */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Download button trigger */}
            {activeQuote.id !== 0 && (
              <button
                onClick={() => setIsExportOpen(true)}
                className="flex-1 py-3 rounded-2xl font-kufi text-xs font-bold text-stone-950 bg-amber-400 border border-amber-500/40 hover:bg-amber-300 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <Download className="w-4 h-4" />
                تحميل كبطاقة مصممة
              </button>
            )}

            {/* Quote navigation step control */}
            {filteredQuotes.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevQuote}
                  className="p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 active:scale-95 transition-all text-stone-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRandomQuote}
                  className="p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 active:scale-95 transition-all text-stone-400 hover:text-amber-400"
                  title="حكمة عشوائية"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextQuote}
                  className="p-3 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 active:scale-95 transition-all text-stone-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Modal: Interactive Ambiguous Word Sheet popup */}
        <AnimatePresence>
          {explainWord && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
              
              {/* Clicking outside closes explain sheet */}
              <div className="absolute inset-0" onClick={() => setExplainWord(null)}></div>

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 180 }}
                className="relative w-full max-h-[70%] bg-stone-900 border-t-2 border-amber-500/40 rounded-t-[32px] p-6 z-10 flex flex-col justify-between"
                dir="rtl"
              >
                {/* Drag handle style indicator */}
                <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto mb-4"></div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-kufi text-base text-stone-100">شرح الكلمة البلاغية</h3>
                  </div>
                  <button
                    onClick={() => setExplainWord(null)}
                    className="p-1 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-6">
                  <h4 className="font-serif text-2xl text-amber-400 mb-3 font-bold">« {explainWord} »</h4>
                  
                  {isLoadingWord ? (
                    <div className="py-8 text-center text-xs font-sans text-stone-400 animate-pulse">
                      🔄 جاري استخراج المعنى البلاغي اللغوي الشيعي...
                    </div>
                  ) : (
                    <p className="font-sans text-xs text-stone-300 leading-relaxed text-right p-4 bg-black/30 rounded-2xl border border-stone-850">
                      {wordExplanation}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setExplainWord(null)}
                  className="w-full py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 transition-all font-kufi text-xs text-stone-300"
                >
                  فهمت المعنى
                </button>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Social Card Canvas Design Exporter Sheet */}
        <AnimatePresence>
          {isExportOpen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0" onClick={() => setIsExportOpen(false)}></div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-[360px] bg-stone-900 border border-stone-800 rounded-3xl p-6 z-10 font-sans"
                dir="rtl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-kufi text-xs font-bold text-stone-100">تخصيص وتصدير الصورة</h3>
                  <button onClick={() => setIsExportOpen(false)} className="p-1.5 rounded-full bg-stone-800 text-stone-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dimension Sizer */}
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[10px] text-stone-400">أبعاد الصورة (أحجام انستغرام):</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'instagram_square', label: 'مربع (1:1)' },
                      { id: 'instagram_portrait', label: 'عمودي (4:5)' },
                      { id: 'instagram_story', label: 'ستوري (9:16)' },
                      { id: 'hd_wallpaper', label: 'شاشة (16:9)' }
                    ].map((dim) => (
                      <button
                        key={dim.id}
                        onClick={() => setExportDimension(dim.id as ExportDimension)}
                        className={`p-2.5 rounded-xl text-center text-[10px] border transition-all ${
                          exportDimension === dim.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-300'
                        }`}
                      >
                        {dim.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Texture Selector */}
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[10px] text-stone-400">خلفية البطاقة وزخرفتها:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'parchment', label: 'ورق عتيق' },
                      { id: 'marble', label: 'مرمر روحي' },
                      { id: 'solid', label: 'نمط معتم' }
                    ].map((txt) => (
                      <button
                        key={txt.id}
                        onClick={() => setExportBgTexture(txt.id as any)}
                        className={`p-2 rounded-xl text-center text-[10px] border transition-all ${
                          exportBgTexture === txt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-stone-950 border-stone-800 text-stone-400'
                        }`}
                      >
                        {txt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content filters (With/Without explanation) */}
                <div className="flex items-center justify-between py-3 border-t border-b border-stone-800 mb-5">
                  <span className="text-[10px] text-stone-300">تضمين الشرح الإيماني بالصورة</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exportIncludeExplanation}
                      onChange={(e) => setExportIncludeExplanation(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-stone-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportSubmit}
                    className="flex-1 py-3 rounded-2xl bg-amber-400 font-kufi text-xs font-bold text-stone-950 hover:bg-amber-300 transition-all text-center"
                  >
                    تصدير وتحميل الآن
                  </button>
                  <button
                    onClick={() => setIsExportOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 font-kufi text-xs text-stone-300 transition-all text-center"
                  >
                    تراجع
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PhoneMockup>
  );
}
