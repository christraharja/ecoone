import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isFrameEnabled: boolean;
  appMode: 'customer' | 'internal';
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  isFrameEnabled,
  appMode
}) => {
  if (!isFrameEnabled) {
    return <div className="w-full flex justify-center">{children}</div>;
  }

  return (
    <div className="py-6 px-4 flex justify-center items-start min-h-[calc(100vh-65px)]">
      {/* Outer Phone Shell */}
      <div className="relative w-full max-w-[420px] rounded-[52px] p-3.5 bg-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-4 border-slate-700/60 ring-1 ring-white/10">
        {/* Side physical buttons styling */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-600 rounded-l-md" />
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-600 rounded-l-md" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-600 rounded-r-md" />

        {/* Inner Screen Bezel */}
        <div className="relative rounded-[42px] overflow-hidden bg-white shadow-inner flex flex-col max-h-[840px] overflow-y-auto">
          {/* iOS Status Bar */}
          <div
            className={`sticky top-0 z-50 px-7 pt-3 pb-2 flex items-center justify-between text-xs select-none backdrop-blur-md ${
              appMode === 'customer'
                ? 'bg-white/90 text-slate-900'
                : 'bg-slate-900/90 text-white'
            }`}
          >
            <span className="font-semibold text-[13px] tracking-tight">9:41</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Actual App View Content */}
          <div className="flex-1 overflow-x-hidden">{children}</div>

          {/* iOS Home Indicator Bar */}
          <div
            className={`sticky bottom-0 z-50 py-2 flex justify-center backdrop-blur-md ${
              appMode === 'customer' ? 'bg-white/80' : 'bg-slate-900/80'
            }`}
          >
            <div
              className={`w-32 h-1 rounded-full ${
                appMode === 'customer' ? 'bg-slate-300' : 'bg-slate-700'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
