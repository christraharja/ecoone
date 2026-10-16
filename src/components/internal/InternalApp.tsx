import React, { useState } from 'react';
import { ShieldCheck, Bug, QrCode, HardHat, Sparkles } from 'lucide-react';
import { VlmQaCheck } from './VlmQaCheck.tsx';
import { PestIdentification } from './PestIdentification.tsx';
import { QrCheckIn } from './QrCheckIn.tsx';
import { StationCheckIn, VlmQaResult } from '../../types/index.ts';

interface InternalAppProps {
  stations: StationCheckIn[];
  onStationVerified: (station: StationCheckIn) => void;
  bookingId?: string;
}

export const InternalApp: React.FC<InternalAppProps> = ({
  stations,
  onStationVerified,
  bookingId = 'BK-9402'
}) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'pestId' | 'qr'>('qa');

  const handleQaFinished = (result: VlmQaResult) => {
    // Handled
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* Sub-header Navigation Tabs for Technician */}
      <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
        <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qa'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Before/After QA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pestId')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pestId'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Pest ID & SOP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Check-In</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 bg-slate-900">
        {activeTab === 'qa' && (
          <VlmQaCheck onQaFinished={handleQaFinished} bookingId={bookingId} />
        )}

        {activeTab === 'pestId' && <PestIdentification />}

        {activeTab === 'qr' && (
          <QrCheckIn
            stations={stations}
            onStationVerified={onStationVerified}
            bookingId={bookingId}
          />
        )}
      </main>
    </div>
  );
};
