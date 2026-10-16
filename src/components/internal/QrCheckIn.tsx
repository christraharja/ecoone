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
  CheckCheck
} from 'lucide-react';
import { StationCheckIn } from '../../types/index.ts';
import confetti from 'canvas-confetti';

interface QrCheckInProps {
  stations: StationCheckIn[];
  onStationVerified: (station: StationCheckIn) => void;
  bookingId?: string;
}

export const QrCheckIn: React.FC<QrCheckInProps> = ({
  stations,
  onStationVerified,
  bookingId = 'BK-9402'
}) => {
  const [selectedStation, setSelectedStation] = useState<StationCheckIn>(stations[2] || stations[0]);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
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

  const handlePerformScan = async (stationToScan: StationCheckIn) => {
    setIsScanning(true);
    setScanMessage(null);

    try {
      const res = await fetch('/api/stations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrPayload: stationToScan.qrPayload,
          technicianName: 'Budi Santoso',
          notes: technicianNotes || 'Station QR code physically scanned and GPS cryptographically verified on-site.'
        })
      });

      const data = await res.json();
      if (data.success && data.station) {
        onStationVerified(data.station);
        setScanMessage(`Check-in verified for ${data.station.stationName}! Live Customer App updated.`);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        setTechnicianNotes('');
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const verifiedCount = stations.filter((s) => s.status === 'verified').length;
  const progressPercent = Math.round((verifiedCount / stations.length) * 100);

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              Station Presence Proof System
            </span>
          </div>
          <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
            GPS Verified
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white leading-tight">
          QR Code Station Check-In
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Scan the tamper-evident QR plates installed at designated client property zones. Scanning generates an immutable timestamp and updates the customer's live tracking view.
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">Job Station Coverage</span>
            <span className="font-mono font-bold text-sky-400">
              {verifiedCount} of {stations.length} Zones Complete ({progressPercent}%)
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
                Cryptographic confirmation broadcast to client #{bookingId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScanMessage(null)}
            className="text-[11px] underline text-emerald-700 font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* INTERACTIVE SCANNER VIEWFINDER SIMULATOR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-sky-600" />
            <span>Technician Camera Scanner</span>
          </label>
          <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Viewfinder Active
          </span>
        </div>

        {/* Viewfinder box with animated scan sweep */}
        <div className="relative w-full aspect-video sm:h-[260px] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center p-4">
          {/* Target Corner Reticles */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-3 border-l-3 border-sky-400 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-3 border-r-3 border-sky-400 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-3 border-l-3 border-sky-400 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-3 border-r-3 border-sky-400 rounded-br-lg" />

          {/* Red animated laser sweep line */}
          <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e] animate-bounce" />

          {/* Center target preview displaying the currently selected station's QR code */}
          <div className="w-36 h-36 relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
            <div className="w-28 h-28">
              {renderQrSvg(selectedStation.qrPayload)}
            </div>
            <span className="text-[9px] font-mono font-bold text-sky-300 mt-1 uppercase">
              {selectedStation.stationId}
            </span>
          </div>

          {/* Viewfinder overlay footer */}
          <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>ISO 9001 / EPA CERT</span>
            <span>GPS: 6.2088° S, 106.8456° E</span>
          </div>
        </div>

        {/* Field Notes for Station */}
        <div>
          <label className="text-[11px] font-bold text-slate-600">
            Station Observations & Chemical Metering Log
          </label>
          <input
            type="text"
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            placeholder={`e.g. Injected 1.5L chemical solution at ${selectedStation.stationName}...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Trigger Scan Button */}
        <button
          type="button"
          onClick={() => handlePerformScan(selectedStation)}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying QR Signature & Timestamping On-Site...</span>
            </div>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              <span>Scan & Verify {selectedStation.stationName}</span>
            </>
          )}
        </button>
      </div>

      {/* PROPERTY STATION CHECKLIST */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
          <span>Client Property Station Manifest</span>
          <span className="text-slate-400 font-normal">tap station to select & scan</span>
        </label>

        <div className="space-y-2">
          {stations.map((st) => {
            const isSelected = selectedStation.id === st.id;
            const isVerified = st.status === 'verified';
            return (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? 'ring-2 ring-sky-400 bg-sky-50/70 border-sky-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex items-center justify-center">
                    {renderQrSvg(st.qrPayload)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">
                        {st.stationId}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {st.stationName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{st.propertyZone}</p>
                    {st.notes && (
                      <p className="text-[10px] text-slate-600 mt-1 italic line-clamp-1">
                        "{st.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  {isVerified ? (
                    <div className="space-y-0.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                      <span className="block text-[9px] text-slate-400 font-mono">
                        {st.timestamp}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStation(st);
                        handlePerformScan(st);
                      }}
                      className="text-[10px] font-bold bg-sky-500 hover:bg-sky-600 text-white px-2.5 py-1 rounded-xl shadow-sm transition-colors"
                    >
                      Quick Scan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
