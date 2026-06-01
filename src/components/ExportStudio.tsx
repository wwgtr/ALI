import React, { useState } from 'react';
import { Saying, IslamicTheme, AspectRatioType } from '../types';
import { Download, ToggleLeft, ToggleRight, Square, Image, Smartphone } from 'lucide-react';
import { triggerImageDownload } from '../utils/canvasExporter';

interface ExportStudioProps {
  saying: Saying;
  theme: IslamicTheme;
}

export const ExportStudio: React.FC<ExportStudioProps> = ({ saying, theme }) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [includeExplanation, setIncludeExplanation] = useState(true);

  const handleDownload = () => {
    triggerImageDownload(saying, theme, aspectRatio, includeExplanation);
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 rounded-2xl text-right flex flex-col gap-4 font-sans shadow-lg select-none" id="export-studio-panel" dir="rtl">
      {/* عنوان الاستوديو */}
      <div className="flex items-center gap-2" id="ex-title-container">
        <Image className="w-5 h-5 text-amber-500 animate-pulse" />
        <span className="text-sm font-bold uppercase tracking-wider text-[#FFEFCF]">
          استوديو تصدير اللوحات القرآنية
        </span>
      </div>

      {/* اختيار الأبعاد والأحجام المتناسبة */}
      <div className="flex flex-col gap-2" id="ex-aspect-selector">
        <label className="text-xs font-semibold text-stone-300">أبعاد الصورة المصدّرة:</label>
        <div className="grid grid-cols-3 gap-2" id="ratios-btn-grid">
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 focus:outline-none transition-all duration-300 cursor-pointer ${
              aspectRatio === '1:1'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-extrabold shadow-inner shadow-amber-500/5'
                : 'border-white/5 bg-white/[0.01] text-stone-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            id="ratio-1-1-btn"
          >
            <Square className="w-4 h-4" />
            <span>مربع (1:1)</span>
          </button>

          <button
            onClick={() => setAspectRatio('4:5')}
            className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 focus:outline-none transition-all duration-300 cursor-pointer ${
              aspectRatio === '4:5'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-extrabold shadow-inner shadow-amber-500/5'
                : 'border-white/5 bg-white/[0.01] text-stone-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            id="ratio-4-5-btn"
          >
            <Smartphone className="w-4 h-4" />
            <span>طولي (4:5)</span>
          </button>

          <button
            onClick={() => setAspectRatio('9:16')}
            className={`py-2 px-1 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1.5 focus:outline-none transition-all duration-300 cursor-pointer ${
              aspectRatio === '9:16'
                ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-extrabold shadow-inner shadow-amber-500/5'
                : 'border-white/5 bg-white/[0.01] text-stone-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            id="ratio-9-16-btn"
          >
            <Smartphone className="w-4 h-4" />
            <span>قصة (9:16)</span>
          </button>
        </div>
      </div>

      {/* خيار إدراج الشرح تحت اللوحة */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3" id="ex-explanation-toggle">
        <span className="text-xs font-semibold text-stone-300">إدراج الشرح والبيان:</span>
        <button
          onClick={() => setIncludeExplanation((prev) => !prev)}
          className="text-stone-400 hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
          id="toggle-explanation-btn"
        >
          {includeExplanation ? (
            <ToggleRight className="w-9 h-9 text-amber-500" strokeWidth={1.5} />
          ) : (
            <ToggleLeft className="w-9 h-9 opacity-40 text-stone-500" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* زر التصدير والتحميل الفعلي */}
      <button
        onClick={handleDownload}
        className="w-full mt-1.5 py-3.5 px-4 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:from-[#E9C46A] hover:to-[#D4AF37] hover:scale-101 active:scale-98 transition-all duration-300 shadow-xl shadow-yellow-500/10 cursor-pointer focus:outline-none"
        id="export-trigger-btn"
      >
        <Download className="w-4.5 h-4.5 text-black" strokeWidth={2.4} />
        <span>تصدير لوحة عالية الدقة (PNG)</span>
      </button>
    </div>
  );
};
