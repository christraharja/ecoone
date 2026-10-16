import React, { useState } from 'react';
import { MapPin, Zap, MessageSquareQuote, ShieldCheck, Sparkles } from 'lucide-react';
import { MapBooking } from './MapBooking.tsx';
import { VlmTriage } from './VlmTriage.tsx';
import { FeedbackPortal } from './FeedbackPortal.tsx';
import { Booking, VlmTriageReport } from '../../types/index.ts';

interface CustomerAppProps {
  activeBooking: Booking | null;
  onBookingCreated: (booking: Booking) => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  activeBooking,
  onBookingCreated
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'triage' | 'feedback'>('map');

  const handleTriageCompleted = (report: VlmTriageReport) => {
    // Keep report state available
  };

  const handleBookWithReport = (report: VlmTriageReport) => {
    // Switch to Map Booking tab
    setActiveTab('map');
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-screen bg-slate-100">
      {/* Sub-header Navigation Tabs */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5">
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map Booking</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('triage')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'triage'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>VLM Triage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'feedback'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        {activeTab === 'map' && (
          <MapBooking
            activeBooking={activeBooking}
            onBookingCreated={onBookingCreated}
            onNavigateToTriage={() => setActiveTab('triage')}
          />
        )}

        {activeTab === 'triage' && (
          <VlmTriage
            onTriageCompleted={handleTriageCompleted}
            onBookWithReport={handleBookWithReport}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackPortal bookingId={activeBooking?.id || 'BK-9402'} />
        )}
      </main>
    </div>
  );
};
