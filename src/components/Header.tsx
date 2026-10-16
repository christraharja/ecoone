import React from 'react';
import {
  ShieldCheck,
  HardHat,
  Smartphone,
  Maximize2,
  Minimize2,
  Sparkles,
  User,
  Activity,
  Layers
} from 'lucide-react';

interface HeaderProps {
  appMode: 'customer' | 'internal';
  onToggleAppMode: (mode: 'customer' | 'internal') => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  verifiedStationsCount: number;
  totalStationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  onToggleAppMode,
  isMobileFrame,
  onToggleMobileFrame,
  verifiedStationsCount,
  totalStationsCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Company Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 tracking-tight text-base">
                ECO <span className="text-sky-500">ONE</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Pest Control & Sanitation
            </p>
          </div>
        </div>

        {/* Dual Interface Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Selector Pill */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => onToggleAppMode('customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                appMode === 'customer'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer App</span>
              <span className="sm:hidden">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleAppMode('internal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                appMode === 'internal'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Technician App</span>
              <span className="sm:hidden">Technician</span>
              {verifiedStationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Toggle Phone Mockup / Expanded view */}
          <button
            type="button"
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Expand to Full Viewport' : 'Switch to Phone Mockup Frame'}
            className="hidden md:flex w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:text-sky-600 hover:bg-sky-50 items-center justify-center border border-slate-200 transition-colors"
          >
            {isMobileFrame ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
