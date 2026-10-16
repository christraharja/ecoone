import React, { useState, useEffect } from 'react';
import { Terminal, Brain, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface AiThoughtInspectorProps {
  thoughts: string[];
  isStreaming?: boolean;
  concludingSummary?: string;
  modelBadge?: string;
}

export const AiThoughtInspector: React.FC<AiThoughtInspectorProps> = ({
  thoughts,
  isStreaming = false,
  concludingSummary,
  modelBadge = 'Gemini 3.8 Flash Vision'
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(isStreaming ? 1 : thoughts.length);

  useEffect(() => {
    if (isStreaming) {
      setVisibleCount(1);
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev < thoughts.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 400);
      return () => clearInterval(interval);
    } else {
      setVisibleCount(thoughts.length);
    }
  }, [isStreaming, thoughts]);

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-sky-500/30 overflow-hidden shadow-lg">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                Simulated AI Thought Stream
              </span>
              <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                {modelBadge}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Reasoning...
            </span>
          )}
          <button type="button" className="text-slate-400 hover:text-white">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Reasoning Log */}
      {isOpen && (
        <div className="p-3.5 space-y-2 text-xs font-mono">
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {thoughts.slice(0, visibleCount).map((thought, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                <span className="text-sky-500 flex-shrink-0 select-none">›</span>
                <span className={idx === visibleCount - 1 && isStreaming ? 'text-sky-300 font-bold' : ''}>
                  {thought}
                </span>
              </div>
            ))}
            {isStreaming && visibleCount < thoughts.length && (
              <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold pl-3 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Simulating neural reasoning chain...</span>
              </div>
            )}
          </div>

          {/* Concluding Insight Callout */}
          {concludingSummary && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 bg-sky-950/40 -mx-3.5 -mb-3.5 p-3 flex items-start gap-2 border-l-2 border-l-sky-400">
              <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">
                  AI Core Insight
                </span>
                <p className="text-[11px] text-slate-200 font-sans leading-snug">
                  {concludingSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
