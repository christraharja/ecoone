import React from 'react';
import { Bug, Wind, Bed, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';

interface IllustrationBadgeProps {
  type: 'termite' | 'cockroach' | 'ac_mold' | 'bedbug' | 'qa_clean' | 'qa_dirty' | 'custom';
  title?: string;
  className?: string;
  imageUrl?: string;
}

export const IllustrationBadge: React.FC<IllustrationBadgeProps> = ({
  type,
  title,
  className = 'w-full h-24',
  imageUrl
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const isRealUserPhoto = imageUrl && (imageUrl.startsWith('blob:') || (imageUrl.startsWith('data:image/') && !imageUrl.includes('image/svg')));

  // If we have a real user photo and it hasn't failed, render the img
  if (isRealUserPhoto && !imgFailed) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 rounded-xl flex items-center justify-center ${className}`}>
        <img
          src={imageUrl}
          alt={title || 'Inspection photo'}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Guaranteed vector graphic fallback that ALWAYS displays crisply
  const config = {
    termite: {
      bg: 'from-amber-950 to-stone-900',
      icon: Bug,
      iconColor: 'text-amber-400',
      badge: 'TERMITE SPEC',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      tag: 'Wood Gallery Frass'
    },
    cockroach: {
      bg: 'from-stone-950 to-zinc-900',
      icon: Bug,
      iconColor: 'text-orange-400',
      badge: 'ROACH NEST',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      tag: 'Nymphs & Ootheca'
    },
    ac_mold: {
      bg: 'from-emerald-950 to-slate-900',
      icon: Wind,
      iconColor: 'text-emerald-400',
      badge: 'AC BIO-MOLD',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      tag: 'Coil Spore Biofilm'
    },
    bedbug: {
      bg: 'from-rose-950 to-slate-900',
      icon: Bed,
      iconColor: 'text-rose-400',
      badge: 'BED BUG',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      tag: 'Mattress Seam Stains'
    },
    qa_clean: {
      bg: 'from-sky-950 to-slate-900',
      icon: Sparkles,
      iconColor: 'text-sky-400',
      badge: 'PASSED QA',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      tag: 'Hospital Clean'
    },
    qa_dirty: {
      bg: 'from-red-950 to-neutral-900',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      badge: 'QA REJECTED',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      tag: 'Residual Bio-Grime'
    },
    custom: {
      bg: 'from-slate-900 to-sky-950',
      icon: ShieldCheck,
      iconColor: 'text-sky-400',
      badge: 'CLIENT UPLOAD',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      tag: 'Inspection Specimen'
    }
  }[type] || {
    bg: 'from-slate-900 to-sky-950',
    icon: ShieldCheck,
    iconColor: 'text-sky-400',
    badge: 'SPECIMEN',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    tag: 'Visual Data'
  };

  const Icon = config.icon;

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${config.bg} p-2.5 flex flex-col justify-between border border-white/10 shadow-inner ${className}`}
    >
      {/* Decorative high-tech grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '12px 12px'
        }}
      />

      {/* Top Header Badge */}
      <div className="flex items-center justify-between relative z-10">
        <span
          className={`text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border ${config.badgeColor}`}
        >
          {config.badge}
        </span>
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
      </div>

      {/* Center Visual Art */}
      <div className="my-auto py-1 relative z-10 flex items-center justify-center">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
      </div>

      {/* Bottom Subtitle / Tag */}
      <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-300 font-medium">
        <span className="truncate">{title || config.tag}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse ml-1" />
      </div>
    </div>
  );
};
