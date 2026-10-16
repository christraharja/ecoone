import React, { useState } from 'react';
import {
  Bug,
  Wind,
  Bed,
  Sparkles,
  AlertTriangle,
  Camera,
  Maximize2,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface InspectionViewportProps {
  customImage?: string | null;
  specimenType: 'termite' | 'cockroach' | 'ac_mold' | 'bedbug' | 'qa_clean' | 'qa_dirty';
  title: string;
  subtitle?: string;
  statusBadge?: string;
  locationTag?: string;
  className?: string;
}

export const InspectionViewport: React.FC<InspectionViewportProps> = ({
  customImage,
  specimenType,
  title,
  subtitle,
  statusBadge = 'VLM Ready',
  locationTag,
  className = 'aspect-[4/3] max-h-[270px]'
}) => {
  const [imageError, setImageError] = useState(false);

  // If user uploaded a custom image and it loaded without error, render the uploaded photo with HUD overlay
  if (customImage && !imageError) {
    return (
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center ${className}`}
      >
        <img
          src={customImage}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />

        {/* Viewfinder Target Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold bg-slate-900/80 backdrop-blur-md text-sky-400 px-2 py-0.5 rounded border border-sky-400/30">
              USER SPECIMEN UPLOAD
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              {statusBadge}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700">
            <span className="flex items-center gap-1.5 truncate max-w-[200px]">
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>{title}</span>
            </span>
            <span className="text-sky-300 font-bold">1080p Optical</span>
          </div>
        </div>
      </div>
    );
  }

  // Pure SVG/Vector Professional Specimen Display (100% Reliable, ZERO broken image icons)
  const renderSpecimenGraphics = () => {
    switch (specimenType) {
      case 'termite':
        return (
          <g transform="translate(250, 140)">
            {/* Timber joist backdrop */}
            <rect x="-180" y="-70" width="360" height="110" rx="10" fill="#78350f" stroke="#92400e" strokeWidth="3" />
            {/* Subterranean mud tunnels */}
            <path d="M -130 40 Q -110 -20 -95 -60 Q -80 -80 -60 -100" stroke="#d97706" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d="M 30 40 Q 50 -10 65 -70 Q 80 -90 100 -110" stroke="#d97706" strokeWidth="20" fill="none" strokeLinecap="round" />
            {/* Wood fissures & hollow tunnels */}
            <path d="M -70 -20 L -30 -10 L 10 -40 L 40 -20" stroke="#1c1917" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M -40 10 L 20 5 L 80 15" stroke="#1c1917" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Fecal frass pellets */}
            <circle cx="-140" cy="15" r="5" fill="#fbbf24" />
            <circle cx="-120" cy="22" r="6" fill="#f59e0b" />
            <circle cx="-100" cy="12" r="5" fill="#d97706" />
            <circle cx="45" cy="22" r="6" fill="#fbbf24" />
            <circle cx="65" cy="28" r="5" fill="#f59e0b" />
            <circle cx="85" cy="18" r="6" fill="#d97706" />
            {/* Diagnostic callout pin 1 */}
            <g transform="translate(-80, -75)">
              <circle cx="0" cy="0" r="14" fill="#0284c7" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <rect x="8" y="-12" width="130" height="22" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="14" y="2" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Earthen Mud Gallery
              </text>
            </g>
            {/* Diagnostic callout pin 2 */}
            <g transform="translate(50, 20)">
              <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-10" width="125" height="20" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="16" y="4" fill="#fef08a" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Frass Pellets (98%)
              </text>
            </g>
          </g>
        );

      case 'cockroach':
        return (
          <g transform="translate(250, 140)">
            <rect x="-190" y="-80" width="380" height="130" fill="#292524" rx="12" stroke="#44403c" strokeWidth="2" />
            {/* Adult German Cockroach */}
            <g transform="translate(-60, -20) rotate(35)">
              <ellipse cx="0" cy="0" rx="20" ry="38" fill="#78350f" stroke="#92400e" strokeWidth="3" />
              <ellipse cx="0" cy="-32" rx="13" ry="13" fill="#b45309" />
              {/* Pronotal dual dark stripes */}
              <line x1="-5" y1="-38" x2="-5" y2="-26" stroke="#000000" strokeWidth="4" />
              <line x1="5" y1="-38" x2="5" y2="-26" stroke="#000000" strokeWidth="4" />
              <path d="M -5 -42 Q -30 -70 -50 -85" stroke="#f59e0b" strokeWidth="3" fill="none" />
              <path d="M 5 -42 Q 30 -70 45 -85" stroke="#f59e0b" strokeWidth="3" fill="none" />
              {/* Legs */}
              <path d="M -18 -12 L -46 -18" stroke="#92400e" strokeWidth="4" />
              <path d="M -19 5 L -52 12" stroke="#92400e" strokeWidth="4" />
              <path d="M -17 22 L -46 38" stroke="#92400e" strokeWidth="4" />
              <path d="M 18 -12 L 46 -18" stroke="#92400e" strokeWidth="4" />
              <path d="M 19 5 L 52 12" stroke="#92400e" strokeWidth="4" />
              <path d="M 17 22 L 46 38" stroke="#92400e" strokeWidth="4" />
            </g>
            {/* Nymph */}
            <g transform="translate(70, 10) rotate(-40) scale(0.7)">
              <ellipse cx="0" cy="0" rx="20" ry="36" fill="#92400e" />
              <ellipse cx="0" cy="-30" rx="11" ry="11" fill="#b45309" />
            </g>
            {/* Fecal speckling */}
            <circle cx="20" cy="-45" r="4.5" fill="#000" />
            <circle cx="32" cy="-38" r="4" fill="#000" />
            <circle cx="42" cy="-50" r="4.5" fill="#000" />
            <circle cx="110" cy="-15" r="4" fill="#000" />
            {/* Callout */}
            <g transform="translate(-10, -50)">
              <circle cx="0" cy="0" r="14" fill="#f43f5e" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-12" width="145" height="22" rx="5" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="16" y="2" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Pronotal Stripes Confirmed
              </text>
            </g>
          </g>
        );

      case 'ac_mold':
        return (
          <g transform="translate(250, 140)">
            <rect x="-190" y="-80" width="380" height="130" fill="#0f172a" rx="10" stroke="#334155" strokeWidth="2" />
            {/* Metal fin grates */}
            <g stroke="#334155" strokeWidth="4">
              <line x1="-160" y1="-70" x2="-160" y2="40" />
              <line x1="-120" y1="-70" x2="-120" y2="40" />
              <line x1="-80" y1="-70" x2="-80" y2="40" />
              <line x1="-40" y1="-70" x2="-40" y2="40" />
              <line x1="0" y1="-70" x2="0" y2="40" />
              <line x1="40" y1="-70" x2="40" y2="40" />
              <line x1="80" y1="-70" x2="80" y2="40" />
              <line x1="120" y1="-70" x2="120" y2="40" />
              <line x1="160" y1="-70" x2="160" y2="40" />
            </g>
            {/* Mold bio-film */}
            <ellipse cx="-80" cy="-15" rx="50" ry="32" fill="#064e3b" opacity="0.95" />
            <ellipse cx="-75" cy="-15" rx="38" ry="22" fill="#022c22" />
            <ellipse cx="40" cy="5" rx="60" ry="35" fill="#064e3b" opacity="0.95" />
            <ellipse cx="45" cy="5" rx="46" ry="24" fill="#022c22" />
            <circle cx="110" cy="-25" r="24" fill="#022c22" />
            <circle cx="-130" cy="15" r="22" fill="#022c22" />
            {/* Callout */}
            <g transform="translate(45, 5)">
              <circle cx="0" cy="0" r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-12" width="140" height="22" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="16" y="2" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Cladosporium Biofilm
              </text>
            </g>
          </g>
        );

      case 'bedbug':
        return (
          <g transform="translate(250, 140)">
            <rect x="-190" y="-80" width="380" height="130" fill="#e2e8f0" rx="10" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M -190 -10 C -100 -30 100 10 190 -10" stroke="#94a3b8" strokeWidth="16" fill="none" />
            <path d="M -190 -10 C -100 -30 100 10 190 -10" stroke="#cbd5e1" strokeWidth="10" fill="none" />
            {/* Bed Bug bodies */}
            <g transform="translate(-40, -15) rotate(20)">
              <ellipse cx="0" cy="0" rx="18" ry="24" fill="#881337" stroke="#9f1239" strokeWidth="2.5" />
              <ellipse cx="0" cy="-20" rx="9" ry="7" fill="#4c0519" />
              <line x1="-15" y1="-8" x2="15" y2="-8" stroke="#4c0519" strokeWidth="3" />
              <line x1="-16" y1="-2" x2="16" y2="-2" stroke="#4c0519" strokeWidth="3" />
              <line x1="-15" y1="5" x2="15" y2="5" stroke="#4c0519" strokeWidth="3" />
            </g>
            <g transform="translate(35, -5) rotate(-15) scale(0.85)">
              <ellipse cx="0" cy="0" rx="18" ry="24" fill="#9f1239" />
              <ellipse cx="0" cy="-20" rx="9" ry="7" fill="#4c0519" />
            </g>
            <circle cx="-85" cy="-25" r="5.5" fill="#4c0519" />
            <circle cx="-70" cy="-30" r="4" fill="#4c0519" />
            <circle cx="80" cy="-15" r="5" fill="#4c0519" />
            {/* Callout */}
            <g transform="translate(-40, -15)">
              <circle cx="0" cy="0" r="14" fill="#f43f5e" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-12" width="135" height="22" rx="5" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="16" y="2" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Cimex lectularius (99%)
              </text>
            </g>
          </g>
        );

      case 'qa_clean':
        return (
          <g transform="translate(250, 140)">
            <rect x="-180" y="-70" width="360" height="110" fill="#f8fafc" rx="8" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="-180" y="20" width="360" height="20" fill="#e2e8f0" />
            <path d="M -120 -20 L -80 0 L -30 -30" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 40 -20 L 80 10 L 130 -15" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <polygon points="-70,-45 -66,-35 -56,-31 -66,-27 -70,-17 -74,-27 -84,-31 -74,-35" fill="#38bdf8" />
            <polygon points="90,-35 93,-28 100,-25 93,-22 90,-15 87,-22 80,-25 87,-28" fill="#38bdf8" />
            <circle cx="0" cy="15" r="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            {/* Callout */}
            <g transform="translate(0, 15)">
              <circle cx="0" cy="0" r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-12" width="145" height="22" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="16" y="2" fill="#6ee7b7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Hospital Grade Sanitized
              </text>
            </g>
          </g>
        );

      case 'qa_dirty':
      default:
        return (
          <g transform="translate(250, 140)">
            <rect x="-180" y="-70" width="360" height="110" fill="#292524" rx="8" stroke="#44403c" strokeWidth="2" />
            <path d="M -140 -20 Q -90 40 -20 10 Q 50 30 140 -30" fill="none" stroke="#1c1917" strokeWidth="32" opacity="0.85" />
            <circle cx="-80" cy="10" r="11" fill="#78350f" />
            <circle cx="-40" cy="-20" r="13" fill="#78350f" />
            <circle cx="60" cy="20" r="10" fill="#78350f" />
            <circle cx="90" cy="-10" r="12" fill="#78350f" />
            <circle cx="-110" cy="-40" r="5" fill="#000" />
            <circle cx="30" cy="-40" r="5" fill="#000" />
            {/* Callout */}
            <g transform="translate(-40, -20)">
              <circle cx="0" cy="0" r="14" fill="#f43f5e" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <rect x="10" y="-12" width="140" height="22" rx="5" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
              <text x="16" y="2" fill="#fda4af" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Organic Contamination
              </text>
            </g>
          </g>
        );
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex flex-col justify-between select-none shadow-xl ${className}`}
    >
      {/* Background Vector HUD Grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 280"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hudBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <pattern id="hudGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="500" height="280" fill="url(#hudBgGrad)" />
        <rect width="500" height="280" fill="url(#hudGrid)" />

        {/* Optical Sensor Vignette */}
        <circle cx="250" cy="140" r="120" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="250" cy="140" r="80" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />

        {/* Dynamic Specimen Graphics */}
        {renderSpecimenGraphics()}

        {/* Corner Reticle Brackets */}
        <path d="M 15 35 L 15 15 L 35 15" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
        <path d="M 485 35 L 485 15 L 465 15" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
        <path d="M 15 245 L 15 265 L 35 265" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
        <path d="M 485 245 L 485 265 L 465 265" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
      </svg>

      {/* Subtle Laser Scan Line Animation */}
      <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce pointer-events-none opacity-75" />

      {/* Top HUD Info Header */}
      <div className="relative z-10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold bg-sky-950/80 backdrop-blur-md text-sky-400 px-2 py-0.5 rounded border border-sky-400/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>OPTICAL SENSOR 4K</span>
          </span>
          {locationTag && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/70 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
              {locationTag}
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
          {statusBadge}
        </span>
      </div>

      {/* Bottom HUD Info Footer */}
      <div className="relative z-10 p-3">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-2 px-3 border border-slate-700/80 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2 min-w-0">
            <Camera className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-white text-[11px] leading-tight truncate">
                {title}
              </p>
              {subtitle && (
                <p className="text-[9px] text-slate-400 font-mono truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <span className="text-[9px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800 ml-2 flex-shrink-0">
            AI Scanned
          </span>
        </div>
      </div>
    </div>
  );
};
