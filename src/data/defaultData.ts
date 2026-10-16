import { Booking, StationCheckIn, FeedbackEntry } from '../types/index.ts';

export const defaultStations: StationCheckIn[] = [
  {
    id: 'st-1',
    stationId: 'ECO-ZONE-A1',
    stationName: 'Main Entrance & Foundation Perimeter',
    propertyZone: 'Zone A - Perimeter Defense',
    qrPayload: 'ECO-ONE:ZONE-A1:STATION-01:PROP-9402',
    timestamp: '10:14 AM Today',
    technicianName: 'Budi Santoso',
    technicianId: 'TECH-704',
    coordinates: { lat: -6.2088, lng: 106.8456 },
    status: 'verified',
    notes: 'Sub-soil liquid chemical barrier injected at 30cm depth. Perimeter sealed.'
  },
  {
    id: 'st-2',
    stationId: 'ECO-ZONE-B2',
    stationName: 'Kitchen & Wet Area Plumbing Voids',
    propertyZone: 'Zone B - Kitchen & Food Prep Area',
    qrPayload: 'ECO-ONE:ZONE-B2:STATION-02:PROP-9402',
    timestamp: '10:32 AM Today',
    technicianName: 'Budi Santoso',
    technicianId: 'TECH-704',
    coordinates: { lat: -6.2089, lng: 106.8458 },
    status: 'verified',
    notes: 'Gel bait formulation applied behind dishwasher and under sink kickboard.'
  },
  {
    id: 'st-3',
    stationId: 'ECO-ZONE-C3',
    stationName: 'HVAC Compressor & Air Ducts',
    propertyZone: 'Zone C - Air Quality Sanitation',
    qrPayload: 'ECO-ONE:ZONE-C3:STATION-03:PROP-9402',
    timestamp: '',
    technicianName: 'Budi Santoso',
    technicianId: 'TECH-704',
    coordinates: { lat: -6.2091, lng: 106.8455 },
    status: 'pending',
    notes: 'Scheduled for chemical deep flush and anti-fungal fogging.'
  },
  {
    id: 'st-4',
    stationId: 'ECO-ZONE-D4',
    stationName: 'Attic Crawlspace & Roof Truss Timber',
    propertyZone: 'Zone D - Structural Wood Protection',
    qrPayload: 'ECO-ONE:ZONE-D4:STATION-04:PROP-9402',
    timestamp: '',
    technicianName: 'Budi Santoso',
    technicianId: 'TECH-704',
    coordinates: { lat: -6.2092, lng: 106.8459 },
    status: 'pending',
    notes: 'Borate wood preservative spray and acoustic monitoring.'
  }
];

export const defaultBooking: Booking = {
  id: 'BK-9402',
  customerName: 'Sarah Jenkins',
  customerPhone: '+1 (555) 234-8901',
  customerAddress: 'Green Valley Villas, Block C No. 42',
  location: {
    lat: -6.2088,
    lng: 106.8456,
    address: 'Green Valley Villas, Block C No. 42'
  },
  serviceType: 'Termite Deep Barrier & Interior Eradication',
  serviceCategory: 'Pest Control',
  timeSlot: 'Today, 10:00 AM - 12:30 PM',
  urgency: 'Urgent',
  notes: 'Customer observed sawdust-like frass along baseboards and hollow sound in door frames.',
  status: 'in_progress',
  assignedTechnician: {
    id: 'TECH-704',
    name: 'Budi Santoso',
    badge: 'Certified Master Pest Inspector #921',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 884-0192',
    rating: 4.94,
    completedJobs: 1420,
    currentEta: 'On Site - Service in Progress',
    currentLocation: { lat: -6.2088, lng: 106.8456 }
  },
  stations: defaultStations,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const defaultFeedbacks: FeedbackEntry[] = [
  {
    id: 'FB-101',
    bookingId: 'BK-8930',
    customerName: 'David Lee',
    serviceType: 'Mattress Deep Steam & UV-C Disinfection',
    ratingOverall: 5,
    ratingPunctuality: 5,
    ratingChemicalSafety: 5,
    writtenFeedback: 'The technician was extremely polite and showed before/after UV light tests. No chemical smell at all, completely fresh!',
    isComplaint: false,
    status: 'Received',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'FB-102',
    bookingId: 'BK-8821',
    customerName: 'Elena Rostova',
    serviceType: 'Commercial Kitchen Cockroach Elimination',
    ratingOverall: 3,
    ratingPunctuality: 4,
    ratingChemicalSafety: 4,
    writtenFeedback: 'Treatment was great overall, but we noticed 2 live nymphs near the trash compactor 3 days later. Requesting warranty touch-up.',
    isComplaint: true,
    complaintCategory: 'Pest activity resurfaced',
    status: 'Assigned to Supervisor',
    supervisorNotes: '14-Day Guarantee triggered. Priority follow-up booster scheduled at zero charge.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];
