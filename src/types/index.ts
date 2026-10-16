export interface StationCheckIn {
  id: string;
  stationId: string;
  stationName: string;
  propertyZone: string;
  qrPayload: string;
  timestamp: string;
  technicianName: string;
  technicianId: string;
  coordinates: { lat: number; lng: number };
  status: 'verified' | 'pending';
  notes?: string;
}

export interface AssignedTechnician {
  id: string;
  name: string;
  badge: string;
  avatar: string;
  phone: string;
  rating: number;
  completedJobs: number;
  currentEta: string;
  currentLocation: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  location: { lat: number; lng: number; address: string };
  serviceType: string;
  serviceCategory: string;
  timeSlot: string;
  urgency: 'Standard' | 'Urgent' | 'Immediate Emergency';
  notes: string;
  status: 'requested' | 'technician_assigned' | 'in_progress' | 'qa_in_review' | 'completed';
  assignedTechnician: AssignedTechnician;
  triageReport?: VlmTriageReport;
  stations: StationCheckIn[];
  qaReport?: VlmQaResult;
  createdAt: string;
  updatedAt: string;
}

export interface VlmTriageReport {
  pestOrIssueName: string;
  scientificName: string;
  category: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  severityScore: number;
  confidenceScore: number;
  visualEvidenceDetected: string[];
  infestationSpreadRisk: string;
  immediateCustomerPrecautions: string[];
  recommendedEcoOneService: string;
  estimatedTreatmentDuration: string;
  actionableSuggestionsForTeam: string[];
  urgencyAdvice: string;
}

export interface VlmQaResult {
  passed: boolean;
  cleanlinessScore: number;
  verdict: string;
  detectedIssues: string[];
  requiredRemedialActions: string[];
  positiveObservations: string[];
  technicianCertificate: {
    inspectorBadge: string;
    timestamp: string;
    safetyApproval: boolean;
  };
}

export interface TargetChemical {
  chemicalName: string;
  activeIngredient: string;
  dilutionRate: string;
  applicationMethod: string;
  ppeRequired: string[];
}

export interface PestIdResult {
  commonName: string;
  scientificName: string;
  family: string;
  lifeStageDetected: string;
  identificationCues: string[];
  behaviorAndHabits: string;
  healthAndStructuralRisks: string;
  eradicationProtocol: {
    stepByStepProcedure: string[];
    targetChemicals: TargetChemical[];
    reEntryIntervalHours: number;
    preventiveMeasures: string[];
  };
  warningNotes: string;
}

export interface FeedbackEntry {
  id: string;
  bookingId: string;
  customerName: string;
  serviceType: string;
  ratingOverall: number;
  ratingPunctuality: number;
  ratingChemicalSafety: number;
  writtenFeedback: string;
  isComplaint: boolean;
  complaintCategory?: string;
  complaintPhotoBase64?: string;
  status: 'Received' | 'Assigned to Supervisor' | 'Resolution In Progress' | 'Resolved - Warranty Guarantee';
  supervisorNotes?: string;
  createdAt: string;
}
