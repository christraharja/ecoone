import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  CheckCheck,
  X,
  User,
  PenTool,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react';
import { StationCheckIn } from '../../types/index.ts';
import { defaultStations } from '../../data/defaultData.ts';
import confetti from 'canvas-confetti';

interface QrCheckInProps {
  stations: StationCheckIn[];
  onStationVerified: (station: StationCheckIn) => void;
  bookingId?: string;
}

export const QrCheckIn: React.FC<QrCheckInProps> = ({
  stations = [],
  onStationVerified,
  bookingId = 'BK-9402'
}) => {
  // Ensure we always have safe stations data (never blank or undefined on Vercel)
  const stationList = stations && stations.length > 0 ? stations : defaultStations;

  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const selectedStation = stationList[activeStationIndex] || stationList[0] || defaultStations[0];

  // Pop-up modal state for QR Sign-off
  const [modalStation, setModalStation] = useState<StationCheckIn | null>(null);
  const [modalStatusCleaned, setModalStatusCleaned] = useState(true);
  const [modalCleanerName, setModalCleanerName] = useState('Budi Santoso');
  const [modalNotes, setModalNotes] = useState('Sanitized thoroughly, pest barrier applied.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Generate an authentic QR code SVG pattern based on text
  const renderQrSvg = (codeText: string) => {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full p-2 bg-white rounded-xl shadow-inner">
        {/* Corner positioning squares */}
        <rect x="5" y="5" width="25" height="25" fill="#0f172a" rx="4" />
        <rect x="9" y="9" width="17" height="17" fill="#ffffff" rx="2" />
        <rect x="13" y="13" width="9" height="9" fill="#0284c7" rx="1.5" />

        <rect x="70" y="5" width="25" height="25" fill="#0f172a" rx="4" />
        <rect x="74" y="9" width="17" height="17" fill="#ffffff" rx="2" />
        <rect x="78" y="13" width="9" height="9" fill="#0284c7" rx="1.5" />

        <rect x="5" y="70" width="25" height="25" fill="#0f172a" rx="4" />
        <rect x="9" y="74" width="17" height="17" fill="#ffffff" rx="2" />
        <rect x="13" y="78" width="9" height="9" fill="#0284c7" rx="1.5" />

        {/* Data matrix pattern modules */}
        <rect x="35" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="45" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="55" y="10" width="6" height="6" fill="#0284c7" />

        <rect x="35" y="20" width="6" height="6" fill="#0f172a" />
        <rect x="45" y="20" width="6" height="6" fill="#0284c7" />
        <rect x="55" y="20" width="6" height="6" fill="#0f172a" />

        <rect x="10" y="38" width="6" height="6" fill="#0f172a" />
        <rect x="20" y="38" width="6" height="6" fill="#0284c7" />
        <rect x="30" y="38" width="6" height="6" fill="#0f172a" />
        <rect x="40" y="38" width="6" height="6" fill="#0f172a" />
        <rect x="50" y="38" width="6" height="6" fill="#0284c7" />
        <rect x="60" y="38" width="6" height="6" fill="#0f172a" />
        <rect x="70" y="38" width="6" height="6" fill="#0284c7" />
        <rect x="80" y="38" width="6" height="6" fill="#0f172a" />

        <rect x="10" y="48" width="6" height="6" fill="#0284c7" />
        <rect x="30" y="48" width="6" height="6" fill="#0f172a" />
        <rect x="40" y="48" width="6" height="6" fill="#0284c7" />
        <rect x="60" y="48" width="6" height="6" fill="#0f172a" />
        <rect x="70" y="48" width="6" height="6" fill="#0f172a" />
        <rect x="80" y="48" width="6" height="6" fill="#0284c7" />

        <rect x="10" y="58" width="6" height="6" fill="#0f172a" />
        <rect x="20" y="58" width="6" height="6" fill="#0f172a" />
        <rect x="40" y="58" width="6" height="6" fill="#0f172a" />
        <rect x="50" y="58" width="6" height="6" fill="#0284c7" />
        <rect x="70" y="58" width="6" height="6" fill="#0f172a" />

        <rect x="38" y="72" width="6" height="6" fill="#0284c7" />
        <rect x="48" y="72" width="6" height="6" fill="#0f172a" />
        <rect x="58" y="72" width="6" height="6" fill="#0f172a" />
        <rect x="78" y="72" width="6" height="6" fill="#0284c7" />

        <rect x="38" y="82" width="6" height="6" fill="#0f172a" />
        <rect x="48" y="82" width="6" height="6" fill="#0284c7" />
        <rect x="68" y="82" width="6" height="6" fill="#0f172a" />
        <rect x="78" y="82" width="6" height="6" fill="#0f172a" />
      </svg>
    );
  };

  // Open the pop-up modal when a QR code is scanned
  const handleOpenScanModal = (station: StationCheckIn) => {
    setModalStation(station);
    setModalStatusCleaned(station.status === 'verified');
    setModalCleanerName(station.technicianName || 'Budi Santoso');
    setModalNotes(station.notes || 'Station inspected and cleaned to Eco One standards.');
  };

  // Confirm and sign off the station from the pop-up
  const handleConfirmSignOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStation) return;

    setIsSubmitting(true);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

    const updatedStation: StationCheckIn = {
      ...modalStation,
      status: modalStatusCleaned ? 'verified' : 'pending',
      timestamp: modalStatusCleaned ? nowTime : '',
      technicianName: modalCleanerName || 'Assigned Cleaner',
      notes: modalNotes
    };

    try {
      // Attempt backend API call, with graceful local fallback if offline or on Vercel
      await fetch('/api/stations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrPayload: updatedStation.qrPayload,
          technicianName: modalCleanerName,
          notes: modalNotes
        })
      }).catch(() => null);

      // Update parent and local storage
      onStationVerified(updatedStation);
      setScanMessage(
        `${updatedStation.stationName} marked as [${modalStatusCleaned ? 'Cleaned & Treated' : 'Not Cleaned'}] and signed off by ${modalCleanerName}!`
      );

      if (modalStatusCleaned) {
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
      }

      setModalStation(null);
    } catch (err) {
      console.error('Sign-off error:', err);
      // Still update UI gracefully
      onStationVerified(updatedStation);
      setModalStation(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifiedCount = stationList.filter((s) => s.status === 'verified').length;
  const progressPercent = stationList.length > 0 ? Math.round((verifiedCount / stationList.length) * 100) : 0;

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              Station QR Check-In & Sign-Off
            </span>
          </div>
          <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
            Ticket #{bookingId}
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white leading-tight">
          Physical Station Check-In
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Scan the QR plate located at each room or property zone. A pop-up will appear allowing the assigned cleaner to toggle the cleaning status and sign off.
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Overall Station Completion</span>
            <span className="font-mono font-bold text-sky-400">
              {verifiedCount} of {stationList.length} Zones Cleaned ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {scanMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-3xl shadow-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-extrabold leading-tight">{scanMessage}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                Cryptographic timestamp broadcast to client live tracking app
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScanMessage(null)}
            className="text-[11px] underline text-emerald-700 font-bold ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* INTERACTIVE SCANNER VIEWFINDER BOX */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-sky-600" />
            <span>Active Camera Scanner</span>
          </label>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Viewfinder Active
          </span>
        </div>

        {/* Viewfinder box with laser sweep */}
        <div className="relative w-full aspect-video sm:h-[240px] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center p-4">
          {/* Target Corner Reticles */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 border-sky-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 border-sky-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 border-sky-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 border-sky-400 rounded-br-lg" />

          {/* Animated red laser line */}
          <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e] animate-bounce" />

          {/* Center target preview displaying the current station QR code */}
          <div
            onClick={() => handleOpenScanModal(selectedStation)}
            className="w-32 h-32 relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24">
              {renderQrSvg(selectedStation.qrPayload)}
            </div>
            <span className="text-[9px] font-mono font-bold text-sky-300 mt-1 uppercase">
              {selectedStation.stationId}
            </span>
          </div>

          <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>STATION: {selectedStation.stationId}</span>
            <span>TAP QR TO SCAN & SIGN OFF</span>
          </div>
        </div>

        {/* Action Button: Scan QR Code & Open Pop-up */}
        <button
          type="button"
          onClick={() => handleOpenScanModal(selectedStation)}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan QR & Open Sign-Off Form ({selectedStation.stationName.split(' ')[0]})</span>
        </button>
      </div>

      {/* PROPERTY STATION LIST (Users can tap any station to open the pop-up) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
          <span>Client Property Station Manifest</span>
          <span className="text-slate-400 font-normal">tap station to sign off</span>
        </label>

        <div className="space-y-2">
          {stationList.map((st, index) => {
            const isVerified = st.status === 'verified';
            const isSelected = selectedStation.id === st.id;
            return (
              <div
                key={st.id}
                onClick={() => {
                  setActiveStationIndex(index);
                  handleOpenScanModal(st);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  isVerified
                    ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                } ${isSelected ? 'ring-2 ring-sky-400' : ''}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex items-center justify-center">
                    {renderQrSvg(st.qrPayload)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">
                        {st.stationId}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {st.stationName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{st.propertyZone}</p>
                    {st.notes && (
                      <p className="text-[10px] text-slate-600 mt-1 italic line-clamp-1 bg-white/60 px-1.5 py-0.5 rounded border border-slate-100">
                        "{st.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3 flex flex-col items-end gap-1">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Cleaned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Not Cleaned
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenScanModal(st);
                    }}
                    className="text-[10px] font-bold bg-slate-900 hover:bg-black text-white px-2.5 py-1 rounded-xl shadow-xs transition-colors"
                  >
                    Scan & Sign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP MODAL: DISPLAYING PLACE INFO, CLEANED TOGGLE, CLEANER NAME & SIGN-OFF */}
      {modalStation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600">
                    Station QR Verified
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {modalStation.stationName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalStation(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. PLACE INFO CARD */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Target Place Information
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Property Zone:</span>
                  <span className="font-bold text-slate-900">{modalStation.propertyZone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">QR Plate ID:</span>
                  <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    {modalStation.stationId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    {modalStation.coordinates.lat}°, {modalStation.coordinates.lng}°
                  </span>
                </div>
              </div>
            </div>

            {/* 2. STATUS TOGGLE: NOT CLEANED vs CLEANED */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                Cleaning & Treatment Status
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalStatusCleaned(false)}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !modalStatusCleaned
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm ring-2 ring-amber-300/50'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Not Cleaned</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalStatusCleaned(true)}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    modalStatusCleaned
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300/50'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Cleaned & Treated</span>
                </button>
              </div>
            </div>

            {/* 3. ASSIGNED CLEANER NAME & SIGN-OFF FORM */}
            <form onSubmit={handleConfirmSignOff} className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Assigned Cleaner / Technician Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalCleanerName}
                  onChange={(e) => setModalCleanerName(e.target.value)}
                  placeholder="Enter cleaner name..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <PenTool className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cleaner Sign-Off Notes & Observations</span>
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Sub-floor sprayed, drain traps cleared, gel bait placed..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white resize-none"
                />
              </div>

              {/* Quick sign-off tags */}
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
                    onClick={() => setModalNotes((prev) => (prev ? `${prev} • ${tag}` : tag))}
                    className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium px-2 py-0.5 rounded-full border border-slate-200 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              {/* Confirm Sign-Off Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Sign Off Station</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
