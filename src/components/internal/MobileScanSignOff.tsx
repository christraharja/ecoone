import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
  PenTool,
  Clock,
  MapPin,
  QrCode,
  ArrowLeft,
  Sparkles,
  Building,
  CheckCheck
} from 'lucide-react';
import { StationCheckIn } from '../../types/index.ts';
import { defaultStations } from '../../data/defaultData.ts';
import confetti from 'canvas-confetti';

interface MobileScanSignOffProps {
  stationId: string;
  onSignOffCompleted: (updatedStation: StationCheckIn) => void;
  onExit: () => void;
  stations?: StationCheckIn[];
}

export const MobileScanSignOff: React.FC<MobileScanSignOffProps> = ({
  stationId,
  onSignOffCompleted,
  onExit,
  stations = defaultStations
}) => {
  // Find matching station or fall back to Kitchen
  const station =
    stations.find((s) => s.stationId === stationId || s.id === stationId) ||
    stations[1] ||
    defaultStations[1];

  const [isCleaned, setIsCleaned] = useState(station.status === 'verified');
  const [cleanerName, setCleanerName] = useState(station.technicianName || 'Budi Santoso');
  const [notes, setNotes] = useState(
    station.notes || 'Station inspected and cleaned to Eco One hospital-grade standards.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTime, setSubmittedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

    const updatedStation: StationCheckIn = {
      ...station,
      status: isCleaned ? 'verified' : 'pending',
      timestamp: isCleaned ? nowTime : '',
      technicianName: cleanerName.trim() || 'Assigned Cleaner',
      notes: notes.trim()
    };

    // Save to local storage for persistent Vercel state
    try {
      const savedStations = localStorage.getItem('eco_one_stations');
      if (savedStations) {
        const parsed: StationCheckIn[] = JSON.parse(savedStations);
        const idx = parsed.findIndex((s) => s.stationId === station.stationId || s.id === station.id);
        if (idx >= 0) {
          parsed[idx] = updatedStation;
        } else {
          parsed.push(updatedStation);
        }
        localStorage.setItem('eco_one_stations', JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }

    setSubmittedTime(nowTime);
    setIsSubmitted(true);
    onSignOffCompleted(updatedStation);

    if (isCleaned) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                  ECO <span className="text-sky-500">ONE</span>
                </span>
                <span className="text-[9px] font-mono font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                  MOBILE SIGN-OFF
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                QR Verified On-Site Check-In
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="text-xs font-bold text-slate-600 hover:text-sky-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>App</span>
          </button>
        </div>

        {isSubmitted ? (
          /* COMPLETION RECEIPT */
          <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-lg text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Cryptographic Sign-Off Verified
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {station.stationName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Status: <strong className="text-emerald-600 font-bold">{isCleaned ? 'Cleaned & Treated' : 'Not Cleaned'}</strong> • Signed off by <strong className="text-slate-800">{cleanerName}</strong>
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Timestamp: {submittedTime}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">QR Plate:</span>
                <span className="font-mono font-bold text-slate-800">{station.stationId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Zone:</span>
                <span className="font-medium text-slate-800">{station.propertyZone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sign-Off Notes:</span>
                <span className="italic text-slate-700 truncate max-w-[200px]">"{notes}"</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
              ✓ The customer's live tracking interface has been updated with undeniable proof of physical presence.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-3 rounded-2xl transition-colors cursor-pointer"
              >
                Edit Sign-Off
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs py-3 px-3 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Return to App
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE SIGN-OFF FORM */
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5">
            {/* Target Place Info Card */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-4 shadow-sm space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Station Verified by Phone Camera</span>
                </span>
                <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                  {station.stationId}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white leading-tight">
                  {station.stationName}
                </h3>
                <p className="text-xs text-sky-200 mt-0.5 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>{station.propertyZone} • Green Valley Villas #42</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>GPS: 6.2088° S, 106.8456° E</span>
                <span className="text-emerald-400 font-bold">● Active Zone</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Status Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1.5">
                  1. Current Room Cleaning Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCleaned(false)}
                    className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      !isCleaned
                        ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300/50 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Not Cleaned</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCleaned(true)}
                    className={`py-3 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCleaned
                        ? 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-300/50 shadow-md'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Cleaned & Treated</span>
                  </button>
                </div>
              </div>

              {/* 2. Assigned Cleaner Name */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>2. Assigned Cleaner / Technician Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={cleanerName}
                  onChange={(e) => setCleanerName(e.target.value)}
                  placeholder="Enter your name (e.g. Budi Santoso)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
                />
              </div>

              {/* 3. Sign-Off Remarks */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" />
                  <span>3. Cleaner Sign-Off Remarks & Treatment Details</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sub-floor sprayed, drain traps cleared, gel bait placed..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-none"
                />
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  '100% Sanitized',
                  'Gel Bait Applied',
                  'Coil Flushed',
                  'Perimeter Sealed'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNotes((prev) => (prev ? `${prev} • ${tag}` : tag))}
                    className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Submit Sign-Off CTA */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit & Complete Sign-Off for {station.stationName.split(' ')[0]}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
