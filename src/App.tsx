/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { CustomerApp } from './components/customer/CustomerApp.tsx';
import { InternalApp } from './components/internal/InternalApp.tsx';
import { DeviceFrame } from './components/common/DeviceFrame.tsx';
import { Booking, StationCheckIn } from './types/index.ts';
import { defaultBooking, defaultStations } from './data/defaultData.ts';
import { MobileScanSignOff } from './components/internal/MobileScanSignOff.tsx';
import { QrCode, ShieldCheck, HardHat, User, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState<'customer' | 'internal'>('customer');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(() => {
    try {
      const saved = localStorage.getItem('eco_one_booking');
      return saved ? JSON.parse(saved) : defaultBooking;
    } catch {
      return defaultBooking;
    }
  });
  const [stations, setStations] = useState<StationCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem('eco_one_stations');
      return saved ? JSON.parse(saved) : defaultStations;
    } catch {
      return defaultStations;
    }
  });
  const [lastSyncNotice, setLastSyncNotice] = useState<string | null>(null);

  // URL query parameter for phone camera QR scans (?scan=ECO-ZONE-B2)
  const [scannedStationId, setScannedStationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('scan') || params.get('station') || null;
    }
    return null;
  });

  // Fetch initial data from server (graceful fallback on Vercel)
  const loadData = async () => {
    try {
      const [bookingsRes, stationsRes] = await Promise.all([
        fetch('/api/bookings').catch(() => null),
        fetch('/api/stations').catch(() => null)
      ]);

      if (bookingsRes && bookingsRes.ok) {
        const bookingsData = await bookingsRes.json().catch(() => null);
        if (bookingsData?.success && bookingsData.bookings?.length > 0) {
          setActiveBooking(bookingsData.bookings[0]);
        }
      }

      if (stationsRes && stationsRes.ok) {
        const stationsData = await stationsRes.json().catch(() => null);
        if (stationsData?.success && stationsData.stations?.length > 0) {
          setStations(stationsData.stations);
        }
      }
    } catch (err) {
      console.log('Running in local/static mode:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler when a customer completes a booking
  const handleBookingCreated = (newBooking: Booking) => {
    setActiveBooking(newBooking);
    setStations(newBooking.stations);
    setLastSyncNotice(`Booking ${newBooking.id} created! Dispatched to Technician App.`);
    setTimeout(() => setLastSyncNotice(null), 4000);
  };

  // Handler when a technician verifies a property station via QR
  const handleStationVerified = (verifiedStation: StationCheckIn) => {
    setStations((prev) =>
      prev.map((s) => (s.id === verifiedStation.id ? verifiedStation : s))
    );

    // Also update active booking's stations so customer view updates in real time
    if (activeBooking) {
      setActiveBooking((prev) => {
        if (!prev) return prev;
        const updatedStations = prev.stations.map((s) =>
          s.id === verifiedStation.id ? verifiedStation : s
        );
        return {
          ...prev,
          stations: updatedStations,
          updatedAt: new Date().toISOString()
        };
      });
    }

    setLastSyncNotice(
      `Station "${verifiedStation.stationName}" verified! Customer live feed updated.`
    );
    setTimeout(() => setLastSyncNotice(null), 4000);
  };

  const verifiedCount = stations.filter((s) => s.status === 'verified').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <Header
        appMode={appMode}
        onToggleAppMode={setAppMode}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        verifiedStationsCount={verifiedCount}
        totalStationsCount={stations.length}
      />

      {/* Cross-App Real-time Sync Toast Notification */}
      {lastSyncNotice && (
        <div className="fixed top-16 right-4 z-50 max-w-sm bg-slate-900 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium">{lastSyncNotice}</span>
        </div>
      )}

      {/* Floating Demo Mode Switch Banner */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-3">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                appMode === 'customer' ? 'bg-sky-500' : 'bg-amber-500'
              } animate-pulse`}
            />
            <span className="text-slate-600 font-medium">
              Currently viewing:{' '}
              <strong className="text-slate-900">
                {appMode === 'customer'
                  ? 'External Customer App (Map Booking, VLM Triage, Complaints)'
                  : 'Internal Cleaner/Technician App (QA Verification, Pest ID, QR Scanner)'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAppMode(appMode === 'customer' ? 'internal' : 'customer')}
              className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                appMode === 'customer'
                  ? 'bg-slate-900 text-white hover:bg-black'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              {appMode === 'customer' ? (
                <>
                  <HardHat className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Technician App</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Switch to Customer App</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* App Body (Either inside mobile phone frame or fluid responsive container) */}
      <div className="flex-1">
        {scannedStationId ? (
          <MobileScanSignOff
            stationId={scannedStationId}
            stations={stations}
            onSignOffCompleted={(updated) => {
              handleStationVerified(updated);
            }}
            onExit={() => {
              setScannedStationId(null);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('scan');
                url.searchParams.delete('station');
                window.history.replaceState({}, '', url.pathname);
              }
            }}
          />
        ) : (
          <DeviceFrame isFrameEnabled={isMobileFrame} appMode={appMode}>
            {appMode === 'customer' ? (
              <CustomerApp
                activeBooking={activeBooking}
                onBookingCreated={handleBookingCreated}
              />
            ) : (
              <InternalApp
                stations={stations}
                onStationVerified={handleStationVerified}
                bookingId={activeBooking?.id || 'BK-9402'}
                onOpenMobileSignOff={(stId) => setScannedStationId(stId)}
              />
            )}
          </DeviceFrame>
        )}
      </div>
    </div>
  );
}
