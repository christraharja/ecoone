import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Zap } from 'lucide-react';

interface InteractiveMapProps {
  center: { lat: number; lng: number; address: string };
  onLocationSelect: (loc: { lat: number; lng: number; address: string }) => void;
  technicianLocation?: { lat: number; lng: number; name: string; eta: string };
  isTrackingMode?: boolean;
  stationMarkers?: Array<{
    id: string;
    stationName: string;
    propertyZone: string;
    status: 'verified' | 'pending';
    coordinates: { lat: number; lng: number };
  }>;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center,
  onLocationSelect,
  technicianLocation,
  isTrackingMode = false,
  stationMarkers = []
}) => {
  const [zoom, setZoom] = useState(1);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite'>('street');

  // Simulated preset neighborhood landmarks
  const nearbyUnits = [
    { id: 'u1', name: 'Eco One #04 (Rapid Eco-Van)', eta: '4 min away', x: 260, y: 130 },
    { id: 'u2', name: 'Eco One #09 (ULV Fogger Unit)', eta: '9 min away', x: 120, y: 280 },
    { id: 'u3', name: 'Eco One #14 (Termite Specialist)', eta: '12 min away', x: 380, y: 260 },
  ];

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isTrackingMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert relative click into simulated lat/lng offset
    const latOffset = (y - 200) * -0.0001;
    const lngOffset = (x - 250) * 0.0001;
    const newLat = Number((-6.2088 + latOffset).toFixed(4));
    const newLng = Number((106.8456 + lngOffset).toFixed(4));
    
    // Pick realistic address based on coordinates
    const streetNames = ['Green Valley Way', 'Cedar Crest Boulevard', 'Oakwood Avenue', 'Palm Grove Lane', 'Pinewood Crescent'];
    const randomStreet = streetNames[Math.floor(Math.random() * streetNames.length)];
    const randomNum = Math.floor(10 + Math.random() * 88);
    const newAddress = `${randomNum} ${randomStreet}, Eco District`;

    onLocationSelect({
      lat: newLat,
      lng: newLng,
      address: newAddress
    });
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-900 rounded-3xl overflow-hidden shadow-inner border border-slate-200/80 group">
      {/* Map SVG Canvas */}
      <svg
        onClick={handleMapClick}
        className="w-full h-full cursor-crosshair select-none transition-transform duration-300"
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mapLayer === 'street' ? '#f8fafc' : '#0f172a'} />
            <stop offset="100%" stopColor={mapLayer === 'street' ? '#f1f5f9' : '#020617'} />
          </linearGradient>

          <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mapLayer === 'street' ? '#dcfce7' : '#064e3b'} />
            <stop offset="100%" stopColor={mapLayer === 'street' ? '#bbf7d0' : '#022c22'} />
          </linearGradient>

          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mapLayer === 'street' ? '#e0f2fe' : '#0c4a6e'} />
            <stop offset="100%" stopColor={mapLayer === 'street' ? '#bae6fd' : '#082f49'} />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Background */}
        <rect width="500" height="400" fill="url(#bgGrad)" />

        {/* Parks & Green zones */}
        <path
          d="M 30 20 Q 80 50 120 30 Q 150 90 90 120 Q 40 100 30 20 Z"
          fill="url(#parkGrad)"
          opacity="0.8"
        />
        <path
          d="M 360 270 Q 420 250 480 300 Q 440 370 380 350 Z"
          fill="url(#parkGrad)"
          opacity="0.8"
        />

        {/* Water canal / river */}
        <path
          d="M 0 160 C 120 180 200 140 320 190 C 420 230 460 210 500 240 L 500 270 C 460 240 420 260 320 220 C 200 170 120 210 0 190 Z"
          fill="url(#waterGrad)"
          opacity="0.75"
        />

        {/* Urban Blocks / Buildings grid */}
        <g fill={mapLayer === 'street' ? '#ffffff' : '#1e293b'} stroke={mapLayer === 'street' ? '#e2e8f0' : '#334155'} strokeWidth="1">
          <rect x="50" y="140" width="60" height="40" rx="4" />
          <rect x="130" y="70" width="70" height="50" rx="4" />
          <rect x="220" y="60" width="80" height="45" rx="4" />
          <rect x="320" y="80" width="60" height="60" rx="4" />
          <rect x="400" y="50" width="70" height="40" rx="4" />

          <rect x="60" y="240" width="75" height="55" rx="4" />
          <rect x="160" y="250" width="65" height="50" rx="4" />
          <rect x="250" y="240" width="80" height="65" rx="4" />
          <rect x="350" y="220" width="60" height="50" rx="4" />
        </g>

        {/* Street Network */}
        <g stroke={mapLayer === 'street' ? '#cbd5e1' : '#475569'} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main Avenues */}
          <path d="M 0 200 L 500 200" stroke={mapLayer === 'street' ? '#fef08a' : '#eab308'} strokeWidth="14" />
          <path d="M 250 0 L 250 400" stroke={mapLayer === 'street' ? '#fef08a' : '#eab308'} strokeWidth="14" />

          {/* Secondary streets */}
          <path d="M 40 50 L 460 50" strokeWidth="8" />
          <path d="M 40 330 L 460 330" strokeWidth="8" />
          <path d="M 120 30 L 120 370" strokeWidth="7" />
          <path d="M 380 30 L 380 370" strokeWidth="7" />

          {/* Diagonal shortcut */}
          <path d="M 120 50 L 380 330" strokeWidth="6" strokeDasharray="3 3" />
        </g>

        {/* Road centerlines */}
        <path d="M 0 200 L 500 200" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 6" fill="none" />
        <path d="M 250 0 L 250 400" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="8 6" fill="none" />

        {/* Technician Live Route Line (when in tracking mode) */}
        {isTrackingMode && (
          <g>
            <path
              d="M 160 130 L 250 130 L 250 200"
              stroke="#0284c7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              fill="none"
              className="animate-pulse"
            />
          </g>
        )}

        {/* Nearby Available Eco One Service Vans (when booking) */}
        {!isTrackingMode &&
          nearbyUnits.map((u) => (
            <g key={u.id} transform={`translate(${u.x}, ${u.y})`} className="cursor-pointer">
              {/* Radar pulse beacon */}
              <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.3" className="animate-ping" />
              <circle cx="0" cy="0" r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              {/* Van icon shape */}
              <path d="M -5 -3 L 2 -3 L 5 0 L 5 3 L -5 3 Z" fill="#ffffff" />
              {/* Floating ETA badge */}
              <rect x="-35" y="-24" width="70" height="15" rx="4" fill="#0f172a" opacity="0.9" />
              <text x="0" y="-13" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                {u.eta}
              </text>
            </g>
          ))}

        {/* Active Technician Marker in Tracking Mode */}
        {isTrackingMode && (
          <g transform="translate(170, 130)">
            <circle cx="0" cy="0" r="22" fill="#0284c7" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="16" fill="#0284c7" stroke="#ffffff" strokeWidth="3" filter="url(#glow)" />
            <path d="M -5 -4 L 3 -4 L 6 0 L 6 4 L -5 4 Z" fill="#ffffff" />
            {/* Tech Name Label */}
            <rect x="-45" y="-32" width="90" height="18" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
            <text x="0" y="-19" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              Tech: Budi S. (En Route)
            </text>
          </g>
        )}

        {/* Verified Station Markers (Zones on customer property) */}
        {stationMarkers.map((st, idx) => {
          const posX = 210 + (idx % 2 === 0 ? -40 : 40);
          const posY = 170 + Math.floor(idx / 2) * 45;
          const isVerified = st.status === 'verified';
          return (
            <g key={st.id} transform={`translate(${posX}, ${posY})`}>
              <circle
                cx="0"
                cy="0"
                r="9"
                fill={isVerified ? '#10b981' : '#f59e0b'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                {isVerified ? '✓' : '!'}
              </text>
            </g>
          );
        })}

        {/* Client Pin (Center Destination) */}
        <g transform="translate(250, 200)">
          {/* Target ground shadow */}
          <ellipse cx="0" cy="8" rx="12" ry="4" fill="rgba(0,0,0,0.3)" />
          {/* Pulse ring */}
          <circle cx="0" cy="-14" r="24" fill="#38bdf8" opacity="0.3" className="animate-ping" />
          {/* Pin body */}
          <path
            d="M 0 0 C -12 -12 -14 -24 0 -34 C 14 -24 12 -12 0 0 Z"
            fill="#0284c7"
            stroke="#ffffff"
            strokeWidth="2.5"
            filter="url(#glow)"
          />
          <circle cx="0" cy="-18" r="5" fill="#ffffff" />
          {/* Pin Callout */}
          <rect x="-65" y="-62" width="130" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="0" y="-46" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            {isTrackingMode ? 'Your Premises (Active Job)' : 'Set Service Location'}
          </text>
        </g>
      </svg>

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>3 Eco One Units Active in Your Area</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {/* Toggle Layer */}
        <button
          onClick={() => setMapLayer(mapLayer === 'street' ? 'satellite' : 'street')}
          title="Toggle Satellite/Street View"
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-sky-600 flex items-center justify-center shadow-md border border-slate-200 transition-colors"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Locate me */}
        <button
          onClick={() =>
            onLocationSelect({
              lat: -6.2088,
              lng: 106.8456,
              address: '742 Evergreen Terrace, Eco District'
            })
          }
          title="Recenter to My Location"
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-sky-600 flex items-center justify-center shadow-md border border-slate-200 transition-colors"
        >
          <Navigation className="w-4 h-4 text-sky-500" />
        </button>
      </div>

      {/* Bottom helper prompt */}
      {!isTrackingMode && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/85 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>Tap anywhere on the map to place the service pin</span>
        </div>
      )}
    </div>
  );
};
