import React, { useEffect, useState } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
  themeStyle: {
    bgGradient: string;
    isDark: boolean;
  };
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, themeStyle }) => {
  const [time, setTime] = useState('10:44');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex items-center justify-center py-4 px-2 font-sans" id="iphone-device-wrapper">
      <div className="absolute -left-1.5 top-[120px] w-1 h-12 bg-slate-700/80 rounded-l" />
      <div className="absolute -left-1.5 top-[180px] w-1 h-16 bg-slate-700/80 rounded-l" />
      <div className="absolute -left-1.5 top-[256px] w-1 h-16 bg-slate-700/80 rounded-l" />
      <div className="absolute -right-1.5 top-[200px] w-1 h-24 bg-slate-700/80 rounded-r" />

      <div
        className="relative w-full max-w-[430px] rounded-[55px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-[#2a2d33] bg-neutral-950 transition-all duration-700 ring-1 ring-white/10"
        id="iphone-body-bezel"
      >
        <div
          className={`relative w-full aspect-[9/19.2] min-h-[720px] md:min-h-[812px] rounded-[42px] overflow-hidden flex flex-col transition-all duration-700 bg-gradient-to-b ${themeStyle.bgGradient}`}
          id="iphone-screen-viewport"
        >
          <div className="absolute top-0 inset-x-0 h-11 flex items-center justify-between px-7 z-30 select-none" id="iphone-status-bar">
            <span className={`text-[13px] font-sans font-semibold tracking-wide ${themeStyle.isDark ? 'text-white' : 'text-slate-900'}`}>
              {time}
            </span>

            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[110px] h-[30px] bg-[#0A0A0B] rounded-full flex items-center justify-center border border-white/5 shadow-inner" id="dynamic-island">
              <div className="w-3 h-3 bg-slate-900 rounded-full ml-auto mr-4 border border-slate-800/60 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 bg-indigo-950 rounded-full" />
              </div>
            </div>

            <div className={`flex items-center gap-1.5 ${themeStyle.isDark ? 'text-white' : 'text-slate-900'}`} id="status-bar-indicators">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">5G</span>
              <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
              <div className="flex items-center gap-0.5" id="battery-status-container">
                <span className="text-[9px] font-sans font-bold">100%</span>
                <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" strokeWidth={1} />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 top-11 bottom-6 overflow-y-auto px-4 py-2 flex flex-col z-20 no-scrollbar" id="iphone-screen-contents">
            {children}
          </div>

          <div className="absolute bottom-1.5 inset-x-0 h-1 flex justify-center items-center z-30" id="iphone-home-indicator-container">
            <div className={`w-[130px] h-1 rounded-full ${themeStyle.isDark ? 'bg-white/40' : 'bg-black/25'}`} id="home-indicator" />
          </div>

          <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent animate-pulse" id="glare-glass-overlay" />
        </div>
      </div>
    </div>
  );
};
