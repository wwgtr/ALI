import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Moon } from 'lucide-react';

interface PhoneMockupProps {
  children: ReactNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  hijriDayString: string;
}

export default function PhoneMockup({ children, isfullscreen, onToggleFullscreen, hijriDayString }: { children: ReactNode; isfullscreen: boolean; onToggleFullscreen: () => void; hijriDayString: string }) {
  if (isfullscreen) {
    return <div className="w-full h-screen overflow-hidden select-none bg-stone-900">{children}</div>;
  }

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col justify-center items-center bg-[#0A1A12] [background-image:radial-gradient(rgba(212,175,55,0.12)_1px,transparent_1px)] bg-[size:32px_32px]">
      
      {/* Container header for desktop settings overlay info */}
      <div className="mb-6 flex items-center justify-between w-full max-w-[430px] text-xs font-sans text-stone-400">
        <div className="flex items-center gap-2">
          <Moon className="w-3.5 h-3.5 text-amber-500/80 animate-pulse" />
          <span>تطبيق غرر الحكم - مرآة البلاغة</span>
        </div>
        <button
          onClick={onToggleFullscreen}
          className="px-3 py-1 rounded-full border border-stone-700 hover:border-amber-500/50 hover:text-amber-200 transition-all font-serif bg-stone-800"
        >
          ملء الشاشة 🗖
        </button>
      </div>

      {/* iPhone Device Wrapper */}
      <div className="relative w-full max-w-[420px] aspect-[9/19.5] rounded-[52px] border-[12px] border-[#1A3026] bg-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-3 overflow-hidden box-border ring-1 ring-[#D4AF37]/30">
        
        {/* Shiny bezel highlights */}
        <div className="absolute top-0 left-4 right-4 h-px bg-white/20 pointer-events-none z-50"></div>
        <div className="absolute bottom-0 left-4 right-4 h-px bg-white/10 pointer-events-none z-50"></div>
        <div className="absolute left-0 top-6 bottom-6 w-px bg-white/10 pointer-events-none z-50"></div>
        <div className="absolute right-0 top-6 bottom-6 w-px bg-white/10 pointer-events-none z-50"></div>

        {/* Volume/Power Physical buttons lookalikes */}
        <div className="absolute -left-[14px] top-[140px] w-1.5 h-12 bg-neutral-800 rounded-l-md border-y border-stone-600"></div>
        <div className="absolute -left-[14px] top-[204px] w-1.5 h-14 bg-neutral-800 rounded-l-md border-y border-stone-600"></div>
        <div className="absolute -left-[14px] top-[270px] w-1.5 h-14 bg-neutral-800 rounded-l-md border-y border-stone-600"></div>
        <div className="absolute -right-[14px] top-[180px] w-1.5 h-20 bg-neutral-800 rounded-r-md border-y border-stone-600"></div>

        {/* Realistic iOS screen content */}
        <div className="relative w-full h-full rounded-[40px] bg-neutral-950 overflow-hidden flex flex-col z-30">
          
          {/* iOS Top Bar Status & Dynamic Island */}
          <div className="relative h-12 w-full flex items-center justify-between px-6 select-none bg-stone-950/20 backdrop-blur-md z-40 text-stone-300 font-sans text-xs">
            
            {/* Time label */}
            <span className="font-semibold text-stone-200">11:33</span>

            {/* Dynamic Island */}
            <motion.div
              initial={{ width: 110 }}
              animate={{ width: 140 }}
              whileHover={{ width: 170 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="absolute top-2.5 left-1/2 -translate-x-1/2 h-7 bg-black rounded-full flex items-center justify-center gap-1.5 px-3 border border-stone-800 z-50 shadow-inner"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-[9px] font-medium text-stone-300 tracking-wider">يا عـلي عليه السلام</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </motion.div>

            {/* Connection and battery signals */}
            <div className="flex items-center gap-1.5 text-stone-200">
              <span className="text-[9px] opacity-75 font-serif">{hijriDayString}</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4a1 1 0 0 0 1.41 1.41l1.79-1.79C9.07 20.26 11.02 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              </svg>
              <div className="relative w-5 h-2.5 border border-stone-400 rounded-sm p-0.5 flex items-center">
                <div className="h-full w-4 bg-emerald-400 rounded-2xs"></div>
                <div className="absolute -right-1.5 w-1 h-1 bg-stone-400 rounded-r-2xs"></div>
              </div>
            </div>

          </div>

          {/* Actual Application Content */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* iPhone Home Indicator Swipe Bar */}
          <div className="h-7 w-full flex items-center justify-center bg-transparent z-40 select-none">
            <div className="w-32 h-1 bg-neutral-600 rounded-full"></div>
          </div>

        </div>

      </div>

    </div>
  );
}
