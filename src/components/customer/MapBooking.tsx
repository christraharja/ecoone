import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Bug,
  Wind,
  Bed,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ChevronRight,
  UserCheck,
  Zap
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap.tsx';
import { Booking, StationCheckIn } from '../../types/index.ts';

interface MapBookingProps {
  activeBooking: Booking | null;
  onBookingCreated: (booking: Booking) => void;
  onNavigateToTriage: () => void;
}

export const MapBooking: React.FC<MapBookingProps> = ({
  activeBooking,
  onBookingCreated,
  onNavigateToTriage
}) => {
  // Booking Form State
  const [selectedLocation, setSelectedLocation] = useState({
    lat: -6.2088,
    lng: 106.8456,
    address: 'Green Valley Villas, Block C No. 42'
  });

  const [searchQuery, setSearchQuery] = useState('Green Valley Villas, Block C No. 42');
  const [selectedCategory, setSelectedCategory] = useState<'pest' | 'ac' | 'mattress' | 'disinfection'>('pest');
  const [selectedService, setSelectedService] = useState('Termite Sub-slab Barrier & Deep Eradication');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Today, 2:00 PM - 4:00 PM');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Immediate Emergency'>('Urgent');
  const [customerNotes, setCustomerNotes] = useState('');
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 234-8901');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address search recommendations
  const addressPresets = [
    'Green Valley Villas, Block C No. 42',
    'Oakwood Highrise Condominium, Suite 14B',
    'Downtown Gourmet Bistro & Bakery, 108 Main St',
    'Palm Heights Residence, Villa #8',
    'Sunset Bay Executive Lofts, Penthouse 4'
  ];

  // Service definitions
  const servicesByCategory = {
    pest: [
      {
        name: 'Termite Sub-slab Barrier & Deep Eradication',
        price: '$189',
        estTime: '90 - 120 mins',
        desc: 'Fipronil non-repellent chemical perimeter + acoustic gallery detection.',
        icon: Bug
      },
      {
        name: 'Cockroach & Ant Deep Gel Bait Matrix',
        price: '$129',
        estTime: '45 - 60 mins',
        desc: 'EPA-registered Indoxacarb micro-droplets in all wet and electrical voids.',
        icon: Sparkles
      },
      {
        name: 'Bed Bug Thermal Steam & Cryo Heat Flush',
        price: '$219',
        estTime: '120 mins',
        desc: '180°C dry saturated steam + micro-pore residual dusting along mattress piping.',
        icon: Bed
      },
      {
        name: 'Rodent Exclusion & Smart Bait Stations',
        price: '$149',
        estTime: '60 mins',
        desc: 'Tamper-resistant perimeter stations + entry point copper mesh capping.',
        icon: ShieldCheck
      }
    ],
    ac: [
      {
        name: 'AC Hydro-Coil Wash & Anti-Bacterial Flush',
        price: '$79',
        estTime: '45 mins / unit',
        desc: 'High-pressure non-acid foam coil flush + drainage mold clearing.',
        icon: Wind
      },
      {
        name: 'Full HVAC Air Duct UV-C Sterilization',
        price: '$169',
        estTime: '90 mins',
        desc: 'Medical-grade spore decontamination to eliminate indoor allergens.',
        icon: Sparkles
      }
    ],
    mattress: [
      {
        name: 'Mattress Deep Extraction & Steam Sterilization',
        price: '$89',
        estTime: '50 mins / bed',
        desc: 'Hydro-vacuum suction, anti-mite sanitization, zero chemical residue.',
        icon: Bed
      },
      {
        name: 'Complete Fabric Sofa & Upholstery Refresh',
        price: '$119',
        estTime: '75 mins',
        desc: 'Deep fiber stain lift + hypoallergenic enzyme deodorizer.',
        icon: Sparkles
      }
    ],
    disinfection: [
      {
        name: 'Whole Facility EPA Hospital-Grade Fogging',
        price: '$159',
        estTime: '60 mins',
        desc: 'Broad spectrum ultra-low volume (ULV) cold mist killing 99.99% pathogens.',
        icon: ShieldCheck
      }
    ]
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress: selectedLocation.address,
          location: selectedLocation,
          serviceType: selectedService,
          serviceCategory: selectedCategory,
          timeSlot: selectedTimeSlot,
          urgency,
          notes: customerNotes
        })
      });

      const data = await res.json();
      if (data.success && data.booking) {
        onBookingCreated(data.booking);
      }
    } catch (err) {
      console.error('Failed to create booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* ACTIVE JOB TRACKING VIEW (When customer has an ongoing appointment) */}
      {activeBooking && activeBooking.status !== 'completed' ? (
        <div className="space-y-4">
          {/* Active Job Card */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Live Dispatch In Progress
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">
                Ticket {activeBooking.id}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
              {activeBooking.serviceType}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              {activeBooking.customerAddress}
            </p>

            {/* Interactive Map with Technician Marker & Station Badges */}
            <div className="mt-4">
              <InteractiveMap
                center={activeBooking.location}
                onLocationSelect={() => {}}
                isTrackingMode={true}
                stationMarkers={activeBooking.stations}
              />
            </div>

            {/* Assigned Technician Profile Bar */}
            <div className="mt-4 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeBooking.assignedTechnician.avatar}
                    alt={activeBooking.assignedTechnician.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-sky-400"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {activeBooking.assignedTechnician.name}
                  </h4>
                  <p className="text-[11px] text-sky-600 font-medium">
                    {activeBooking.assignedTechnician.badge}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="text-amber-500 font-bold">★ {activeBooking.assignedTechnician.rating}</span>
                    <span>•</span>
                    <span>{activeBooking.assignedTechnician.completedJobs} completed jobs</span>
                  </div>
                </div>
              </div>

              {/* Call / Chat Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeBooking.assignedTechnician.phone}`}
                  className="w-9 h-9 rounded-full bg-white text-slate-700 hover:text-sky-600 flex items-center justify-center border border-slate-200 shadow-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => alert(`Opening secure messaging with technician ${activeBooking.assignedTechnician.name}...`)}
                  className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Real-time Property QR Station Check-in Feed */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Systematic Zone Check-Ins (Undeniable Proof)
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {activeBooking.stations.filter(s => s.status === 'verified').length} / {activeBooking.stations.length} Zones Verified
                </span>
              </div>

              <div className="space-y-2">
                {activeBooking.stations.map((station, index) => {
                  const isVerified = station.status === 'verified';
                  return (
                    <div
                      key={station.id}
                      className={`p-3 rounded-2xl border text-xs transition-all ${
                        isVerified
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-[10px] font-bold ${
                              isVerified ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isVerified ? '✓' : index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {station.stationName}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{station.propertyZone}</p>
                            {station.notes && (
                              <p className="text-[11px] text-slate-600 mt-1 italic bg-white/70 p-1.5 rounded-lg border border-slate-100">
                                "{station.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          {isVerified ? (
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {station.timestamp}
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Pending Scan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-2">
                * When technician scans property QR tags via their Internal App, this feed updates instantly.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* NEW BOOKING FORM (Always accessible or when creating a new request) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Gojek / Grab-Style Map Booking
            </span>
            <span className="text-[11px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
              Live Fleet
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Request an Eco One Specialist
          </h2>
          <p className="text-xs text-slate-500">
            Set your exact address on the map, choose your treatment, and an Eco One technician will be dispatched.
          </p>
        </div>

        {/* 1. Map & Location Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
            <span>1. Set Service Location</span>
            <span className="text-sky-600 font-normal lowercase">drag or tap map</span>
          </label>

          {/* Search Location Input with presets */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-sky-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, apartment, or villa..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {addressPresets.map((addr, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(addr);
                  setSelectedLocation(prev => ({ ...prev, address: addr }));
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors ${
                  searchQuery === addr
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {addr.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Map Component */}
          <InteractiveMap
            center={selectedLocation}
            onLocationSelect={(loc) => {
              setSelectedLocation(loc);
              setSearchQuery(loc.address);
            }}
          />
        </div>

        {/* VLM Triage Banner Link */}
        <div
          onClick={onNavigateToTriage}
          className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Not sure which pest or mold it is?</span>
                <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded font-bold">
                  AI VLM
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload a photo to get instant Vision AI diagnosis and team triage.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* 2. Service Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            2. Select Service Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'pest', label: 'Pest Control', icon: Bug, badge: 'Popular' },
              { id: 'ac', label: 'AC Cleaning', icon: Wind, badge: 'Anti-Mold' },
              { id: 'mattress', label: 'Mattress & Bed', icon: Bed, badge: 'UV-C' },
              { id: 'disinfection', label: 'Disinfection', icon: ShieldCheck, badge: 'Hospital' }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setSelectedService(servicesByCategory[cat.id as keyof typeof servicesByCategory][0].name);
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <span className="text-xs font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Specific Treatment Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            3. Treatment Package
          </label>
          <div className="space-y-2">
            {servicesByCategory[selectedCategory].map((svc) => {
              const isSelected = selectedService === svc.name;
              return (
                <div
                  key={svc.name}
                  onClick={() => setSelectedService(svc.name)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {svc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{svc.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">
                        Est. Duration: {svc.estTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-sm font-extrabold text-slate-900">{svc.price}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">14-Day Warranty</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Time Slot & Urgency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
              4. Time Slot
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-sky-500 absolute left-3 top-3" />
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-sky-400 focus:outline-none"
              >
                <option>Immediate Dispatch (Within 30 Mins)</option>
                <option>Today, 2:00 PM - 4:00 PM</option>
                <option>Today, 5:00 PM - 7:00 PM</option>
                <option>Tomorrow Morning, 9:00 AM - 11:30 AM</option>
                <option>Tomorrow Afternoon, 1:00 PM - 3:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
              Priority Urgency
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Standard', 'Urgent', 'Immediate Emergency'] as const).map((urg) => (
                <button
                  key={urg}
                  type="button"
                  onClick={() => setUrgency(urg)}
                  className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border transition-colors ${
                    urgency === urg
                      ? urg === 'Immediate Emergency'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-sky-500 text-white border-sky-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {urg === 'Immediate Emergency' ? 'Emergency' : urg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact details & special instructions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600">Client Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">Phone for SMS Tracking</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600">Entry Code or Specific Infestation Notes</label>
            <textarea
              rows={2}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Buzz code #420, pest frass located underneath laundry basin..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
            />
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          type="button"
          onClick={handleBookingSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Confirm & Dispatch Eco One Technician</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            100% Odorless Eco-Chemicals
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            14-Day Free Re-treatment
          </span>
        </div>
      </div>
    </div>
  );
};
