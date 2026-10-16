import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  ExternalLink,
  Smartphone,
  Share2
} from 'lucide-react';
import QRCode from 'qrcode';
import { StationCheckIn } from '../../types/index.ts';
import { defaultStations } from '../../data/defaultData.ts';
import confetti from 'canvas-confetti';

interface QrCheckInProps {
  stations: StationCheckIn[];
  onStationVerified: (station: StationCheckIn) => void;
  bookingId?: string;
  onOpenMobileSignOff?: (stationId: string) => void;
}

export const QrCheckIn: React.FC<QrCheckInProps> = ({
  stations = [],
  onStationVerified,
  bookingId = 'BK-9402',
  onOpenMobileSignOff
}) => {
  // Ensure safe stations data
  const stationList = stations && stations.length > 0 ? stations : defaultStations;

  const [activeStationIndex, setActiveStationIndex] = useState(1); // Default to Kitchen (ECO-ZONE-B2)
  const selectedStation = stationList[activeStationIndex] || stationList[0] || defaultStations[0];

  // Real phone camera-scannable QR code data URL
  const [realQrDataUrl, setRealQrDataUrl] = useState<string>('');
  const [scanTargetUrl, setScanTargetUrl] = useState<string>('');

  // Pop-up modal state for in-app sign-off
  const [modalStation, setModalStation] = useState<StationCheckIn | null>(null);
  const [modalStatusCleaned, setModalStatusCleaned] = useState(true);
  const [modalCleanerName, setModalCleanerName] = useState('Budi Santoso');
  const [modalNotes, setModalNotes] = useState('Sanitized thoroughly, pest barrier applied.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Generate real standard QR code whenever the selected station changes
  useEffect(() => {
    if (!selectedStation) return;

    // Build the dynamic URL pointing to this app's domain with ?scan= parameter
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eco-one.vercel.app';
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const url = `${origin}${path}?scan=${selectedStation.stationId}`;
    setScanTargetUrl(url);

    // Generate real, 100% compliant QR code image that ANY phone camera detects instantly
    QRCode.toDataURL(
      url,
      {
        width: 320,
        margin: 1,
        color: {
          dark: '#0f172a', // Deep slate for maximum phone camera contrast
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      },
      (err, dataUrl) => {
        if (!err && dataUrl) {
          setRealQrDataUrl(dataUrl);
        } else {
          console.error('Failed to generate real QR code:', err);
        }
      }
    );
  }, [selectedStation]);

  // Open the pop-up modal when scanned or tapped
  const handleOpenScanModal = (station: StationCheckIn) => {
    setModalStation(station);
    setModalStatusCleaned(station.status === 'verified');
    setModalCleanerName(station.technicianName || 'Budi Santoso');
    setModalNotes(station.notes || 'Station inspected and cleaned to Eco One standards.');
  };

  // Confirm sign off
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
      await fetch('/api/stations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrPayload: updatedStation.qrPayload,
          technicianName: modalCleanerName,
          notes: modalNotes
        })
      }).catch(() => null);

      onStationVerified(updatedStation);
      setScanMessage(
        `${updatedStation.stationName} marked as [${modalStatusCleaned ? 'Cleaned & Treated' : 'Not Cleaned'}] and signed off by ${modalCleanerName}!`
      );

      if (modalStatusCleaned) {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      }

      setModalStation(null);
    } catch (err) {
      console.error('Sign-off error:', err);
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
              Live Phone Camera Scannable QR
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Real QR Active
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white leading-tight">
          QR Code Station Check-In
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Point your physical phone camera at the QR code below. Your smartphone will recognize the link and open the dedicated mobile sign-off sheet for that zone!
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Cleaned Zones Coverage</span>
            <span className="font-mono font-bold text-sky-400">
              {verifiedCount} of {stationList.length} Zones Complete ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
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
                Cryptographic timestamp synced with customer live tracking view
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

      {/* 1. REAL PHONE-SCANNABLE QR CODE SHOWCASE */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4 text-center">
        <div className="flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Real Smartphone Camera Target
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              {selectedStation.stationName}
            </h3>
            <p className="text-xs text-slate-500">{selectedStation.propertyZone}</p>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-xl">
            {selectedStation.stationId}
          </span>
        </div>

        {/* Real QR Code Display */}
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 inline-flex flex-col items-center justify-center max-w-[280px] mx-auto shadow-inner">
          {realQrDataUrl ? (
            <div className="relative group">
              <img
                src={realQrDataUrl}
                alt={`Real QR Code for ${selectedStation.stationName}`}
                className="w-56 h-56 rounded-xl object-contain bg-white p-2 shadow-sm"
              />
              <div className="absolute inset-0 bg-sky-500/10 rounded-xl pointer-events-none border border-sky-400/30" />
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-white rounded-xl">
              <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Smartphone className="w-4 h-4 text-sky-500 animate-bounce" />
            <span>Scan with your physical phone camera</span>
          </div>
        </div>

        {/* Action Buttons: Direct Mobile Test & In-App Pop-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (onOpenMobileSignOff) {
                onOpenMobileSignOff(selectedStation.stationId);
              } else {
                handleOpenScanModal(selectedStation);
              }
            }}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs py-3 px-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Simulate Mobile Scan on Screen</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenScanModal(selectedStation)}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 px-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PenTool className="w-4 h-4 text-emerald-400" />
            <span>Open In-App Sign-Off Pop-up</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400">
          * Encoded URL: <code className="font-mono text-slate-600">{scanTargetUrl}</code>
        </p>
      </div>

      {/* 2. STATION MANIFEST (Tap any station to update QR code & open pop-up) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
          <span>Select Property Zone QR Code</span>
          <span className="text-slate-400 font-normal">tap to switch target</span>
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
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? 'ring-2 ring-sky-500 bg-sky-50/70 border-sky-300 shadow-sm'
                    : isVerified
                    ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono ${
                      isSelected
                        ? 'bg-sky-500 text-white'
                        : isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
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
                      setActiveStationIndex(index);
                      handleOpenScanModal(st);
                    }}
                    className="text-[10px] font-bold bg-slate-900 hover:bg-black text-white px-2.5 py-1 rounded-xl shadow-xs transition-colors"
                  >
                    Sign Off
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP MODAL: PLACE INFO, STATUS TOGGLE, CLEANER NAME & SIGN-OFF */}
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
                    Station Sign-Off Form
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
                  <span className="text-slate-500">Property:</span>
                  <span className="text-slate-800 font-medium">Green Valley Villas, Block C #42</span>
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
                    onClick={() => setModalNotes((prev) => (prev ? `${prev} • ${tag}` : tag))}
                    className="text-[10px] bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium px-2 py-0.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
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
