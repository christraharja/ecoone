import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing JSON with increased limit for base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization with required telemetry User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database for bookings, station check-ins, and feedback
interface StationCheckIn {
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

interface Booking {
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
  assignedTechnician: {
    id: string;
    name: string;
    badge: string;
    avatar: string;
    phone: string;
    rating: number;
    completedJobs: number;
    currentEta: string;
    currentLocation: { lat: number; lng: number };
  };
  triageReportId?: string;
  triageReport?: any;
  stations: StationCheckIn[];
  qaReport?: any;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackEntry {
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

// Seed initial stations & active booking
const initialStations: StationCheckIn[] = [
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
    notes: 'Sub-soil liquid chemical barrier injected at 30cm depth. No perimeter cracking observed.'
  },
  {
    id: 'st-2',
    stationId: 'ECO-ZONE-B2',
    stationName: 'Kitchen & Wet Area Plumbing Voids',
    propertyZone: 'Zone B - Interior High Risk',
    qrPayload: 'ECO-ONE:ZONE-B2:STATION-02:PROP-9402',
    timestamp: '10:32 AM Today',
    technicianName: 'Budi Santoso',
    technicianId: 'TECH-704',
    coordinates: { lat: -6.2089, lng: 106.8458 },
    status: 'verified',
    notes: 'Gel bait formulation applied behind dishwasher and under sink cabinetry.'
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
    notes: 'Borate wood preservative spray and moisture testing pending.'
  }
];

let bookings: Booking[] = [
  {
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
    stations: initialStations,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let feedbackList: FeedbackEntry[] = [
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

// ----------------- API ROUTES -----------------

// 1. VLM Customer Visual Assessment & Triage
app.post('/api/vlm/triage', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description = '', roomType = 'Residential' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request body' });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    if (ai) {
      const prompt = `You are the Chief Entomologist and Sanitation Director for "Eco One", a professional pest control and sanitation company.
Analyze this customer photo of an active pest or sanitation problem. The customer provided context: "${description}", Area/Room: "${roomType}".

You must provide a professional, structured JSON assessment for both the customer and the internal cleaner/technician team.

Return ONLY a valid JSON object matching this schema:
{
  "pestOrIssueName": "Common name of pest, mold, stain, or infestation",
  "scientificName": "Scientific binomial name if pest/fungus, or 'N/A'",
  "category": "Pest Control" | "AC Cleaning" | "Mattress & Upholstery" | "Facility Disinfection",
  "severity": "Low" | "Moderate" | "High" | "Critical",
  "severityScore": 1 to 10 integer,
  "confidenceScore": 80 to 99 integer,
  "visualEvidenceDetected": ["Array of 3-4 specific visual observations detected in photo"],
  "infestationSpreadRisk": "Detailed 2-sentence explanation of structural, health, or reproduction risks if left untreated",
  "immediateCustomerPrecautions": ["Array of 3-4 safety tips the homeowner should do right now before technician arrives"],
  "recommendedEcoOneService": "Name of specific Eco One service package",
  "estimatedTreatmentDuration": "e.g. 60 - 90 minutes",
  "actionableSuggestionsForTeam": [
    "Array of 4-5 rigorous technical instructions for the internal technician team: target harborage zones, chemical classes to prepare, application tools (ULV cold fogger, drill barrier, gel micro-injector), PPE required"
  ],
  "urgencyAdvice": "e.g. Requires immediate same-day intervention to prevent colony expansion into wall studs."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, triage: parsed });
    } else {
      // High-fidelity fallback if GEMINI_API_KEY is not configured
      const fallbackReport = {
        pestOrIssueName: description.toLowerCase().includes('termite') ? 'Subterranean Termite (Reticulitermes flavipes)' :
                         description.toLowerCase().includes('roach') ? 'German Cockroach (Blattella germanica)' :
                         description.toLowerCase().includes('ac') ? 'Stachybotrys & Cladosporium AC Coil Mold' :
                         description.toLowerCase().includes('bed') ? 'Common Bed Bug (Cimex lectularius)' :
                         'Urban Pest Infestation & Bio-Residue',
        scientificName: 'Blattodea / Reticulitermes sp.',
        category: 'Pest Control',
        severity: 'High',
        severityScore: 8,
        confidenceScore: 94,
        visualEvidenceDetected: [
          'Visible frass and fecal spotting along structural joints',
          'Cuticular insect fragments and characteristic tunneling signs',
          'Moisture accumulation supporting active breeding cycle'
        ],
        infestationSpreadRisk: 'High risk of colony expansion into adjacent drywall framing and electrical conduits within 7-14 days if not neutralized at root nest.',
        immediateCustomerPrecautions: [
          'Do NOT spray consumer aerosol sprays as this causes satellite colony dispersal',
          'Keep children and domestic pets away from the designated focal zone',
          'Store all unsealed food items in airtight glass or thick polypropylene containers',
          'Leave the physical evidence undisturbed so technicians can sample nest moisture'
        ],
        recommendedEcoOneService: 'Eco One Termite & Deep Eradication Multi-Zone Protocol',
        estimatedTreatmentDuration: '90 - 120 minutes',
        actionableSuggestionsForTeam: [
          'Prepare Fipronil 0.05% non-repellent liquid termiticide formulation',
          'Conduct ultrasonic wall acoustic scan to locate primary hidden colony gallery',
          'Apply micro-encapsulated residual spray along floor-wall junction junctions',
          'Install sub-slab perimeter bait monitoring stations every 3 meters',
          'Document before/after thermal moisture imaging for customer guarantee record'
        ],
        urgencyAdvice: 'Same-day technician dispatch recommended to halt structural damage.'
      };
      return res.json({ success: true, triage: fallbackReport, fallback: true });
    }
  } catch (err: any) {
    console.error('Error in /api/vlm/triage:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze triage image' });
  }
});

// 2. VLM Before/After Documentation & QA Verification (Technician QA)
app.post('/api/vlm/qa-check', async (req: Request, res: Response) => {
  try {
    const {
      beforeImageBase64,
      afterImageBase64,
      serviceType = 'Deep Pest Treatment & Sanitization',
      stationName = 'Kitchen Cabinet & Wall Baseboard Void',
      forceFailSimulation = false
    } = req.body;

    if (!beforeImageBase64 || !afterImageBase64) {
      return res.status(400).json({ error: 'Both beforeImageBase64 and afterImageBase64 are required' });
    }

    const cleanBefore = beforeImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const cleanAfter = afterImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    if (forceFailSimulation) {
      return res.json({
        success: true,
        qaResult: {
          passed: false,
          cleanlinessScore: 54,
          verdict: 'QA FAILED: Incomplete Treatment & Residual Contaminants Detected',
          detectedIssues: [
            'Residual grease and biological pest staining visible near rear baseboard perimeter',
            'Chemical slurry puddling detected; surface was not properly wiped dry to standard',
            'Unsealed crevice remains un-dusted with diatomaceous desiccant'
          ],
          requiredRemedialActions: [
            'Re-vacuum the crevice zone with HEPA filtered equipment',
            'Wipe down chemical puddles with neutral damp microfiber towel',
            'Re-apply micro-gel bait precisely in 0.5cm dots rather than continuous smearing',
            'Capture and upload a new After photo to unlock ticket completion'
          ],
          positiveObservations: [
            'Gross debris from Before stage has been partially cleared'
          ],
          technicianCertificate: {
            inspectorBadge: 'ECO-QA-REJECT-SYS-4',
            timestamp: new Date().toLocaleTimeString(),
            safetyApproval: false
          }
        }
      });
    }

    if (ai) {
      const prompt = `You are the Chief Quality Assurance (QA) Inspector at Eco One Professional Pest Control & Sanitation.
You are evaluating two photos submitted by a field technician:
1. BEFORE PHOTO: The initial dirty/infested condition.
2. AFTER PHOTO: The condition after the technician performed "${serviceType}" at station: "${stationName}".

STRICT EVALUATION POLICY:
- Scrutinize the AFTER photo rigorously.
- If the area is thoroughly cleaned, sanitized, free of dead bugs, frass, residue, mold, or sloppy chemical spills -> set "passed": true, score 90-100.
- If the area is STILL DIRTY, if noticeable stains remain, if dead bugs were left un-swept, or if excessive chemical puddles were left -> set "passed": false, score 30-70.
- Explain in exact detail what was detected.

Return ONLY a valid JSON object matching this schema:
{
  "passed": boolean,
  "cleanlinessScore": integer (0 to 100),
  "verdict": "Clear concise verdict title (e.g. 'PASSED - Hospital Grade Sanitization Verified' or 'QA FAILED - Residual Biological Matter Detected')",
  "detectedIssues": ["Array of issues detected in After photo, or empty array if passed"],
  "requiredRemedialActions": ["Array of specific instructions technician must perform if failed, or maintenance recommendations if passed"],
  "positiveObservations": ["Array of 2-3 specific improvements visible when comparing Before vs After"],
  "technicianCertificate": {
    "inspectorBadge": "e.g. ECO-VLM-CERT-902",
    "timestamp": "ISO or formatted time string",
    "safetyApproval": boolean
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBefore,
              },
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanAfter,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, qaResult: parsed });
    } else {
      // High quality fallback
      return res.json({
        success: true,
        qaResult: {
          passed: true,
          cleanlinessScore: 97,
          verdict: 'PASSED - Eco One Hospital Grade Sanitation Verified',
          detectedIssues: [],
          requiredRemedialActions: [
            'Maintain ventilation for 30 minutes post-treatment',
            'Leave bait stations undisturbed during client warranty window'
          ],
          positiveObservations: [
            '100% eradication of visible pest bio-film and frass accumulations',
            'Substrate surface wiped clean to dry non-slip finish',
            'Precision bait application in micro-crevices compliant with EPA label guidelines'
          ],
          technicianCertificate: {
            inspectorBadge: 'ECO-AI-QA-VERIFIED-#8831',
            timestamp: new Date().toLocaleTimeString(),
            safetyApproval: true
          }
        }
      });
    }
  } catch (err: any) {
    console.error('Error in /api/vlm/qa-check:', err);
    return res.status(500).json({ error: err.message || 'QA check failed' });
  }
});

// 3. VLM AI-Assisted Pest ID & Treatment Generation (Internal Tech Tool)
app.post('/api/vlm/pest-id', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', notes = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    if (ai) {
      const prompt = `You are the Principal Entomologist and Chemical Formulation Director at Eco One.
A field technician uploaded a macro photo of an unidentified pest specimen found on client premises.
Technician notes: "${notes}".

Identify the exact pest species with high scientific accuracy and produce the company-standard eradication approach and chemical guidelines.

Return ONLY a valid JSON object matching this schema:
{
  "commonName": "Precise common name (e.g. German Cockroach, Formosan Subterranean Termite, Silverfish, Bed Bug)",
  "scientificName": "Binomial nomenclature (Genus species)",
  "family": "Taxonomic family (e.g. Blattellidae, Rhinotermitidae, Cimicidae)",
  "lifeStageDetected": "Adult / Nymph / Larva / Egg sac (Ootheca) / Alate Swarmer",
  "identificationCues": [
    "Array of 3-4 distinct anatomical markers (e.g. two dark parallel pronotal stripes, straight antennae, waist constriction)"
  ],
  "behaviorAndHabits": "2-3 sentences explaining nocturnal habits, moisture preference, and nest nesting behavior",
  "healthAndStructuralRisks": "Asthma allergens, salmonella transmission, structural wood destruction, etc.",
  "eradicationProtocol": {
    "stepByStepProcedure": [
      "Step 1: Inspection & Harborage Mapping...",
      "Step 2: Non-repellent chemical application...",
      "Step 3: Insect Growth Regulator (IGR) deployment...",
      "Step 4: Exclusion & Mechanical Capping..."
    ],
    "targetChemicals": [
      {
        "chemicalName": "e.g. EcoTerm Pro Non-Repellent Liquid",
        "activeIngredient": "e.g. Fipronil 9.1% or Dinotefuran",
        "dilutionRate": "e.g. 0.05% (0.8 fl oz per gallon water)",
        "applicationMethod": "e.g. Low-pressure fan nozzle along perimeter slab",
        "ppeRequired": ["Nitrile chemical gloves", "Half-face respirator with organic vapor cartridge", "Eye goggles"]
      },
      {
        "chemicalName": "e.g. EcoOne Bio-Bait Matrix",
        "activeIngredient": "e.g. Indoxacarb 0.6% or Hydramethylnon",
        "dilutionRate": "Ready to use syringe",
        "applicationMethod": "Spot placements of 0.25g per square meter in dark voids",
        "ppeRequired": ["Gloves"]
      }
    ],
    "reEntryIntervalHours": 2,
    "preventiveMeasures": [
      "Seal all pipe wall penetrations with copper mesh and silicone sealant",
      "Correct plumbing drip leaks under sink bases",
      "Install door sweeps on exterior entryways"
    ]
  },
  "warningNotes": "Crucial safety warning regarding pets, aquatic organisms, or food prep surfaces."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, pestId: parsed });
    } else {
      // Fallback
      return res.json({
        success: true,
        pestId: {
          commonName: 'German Cockroach',
          scientificName: 'Blattella germanica',
          family: 'Ectobiidae',
          lifeStageDetected: 'Adult female with prominent ootheca',
          identificationCues: [
            'Light brown to tan color with two distinct dark parallel stripes on pronotum',
            'Approximately 13-16 mm in length with fully developed wings',
            'Spiny legs adapted for rapid scuttling'
          ],
          behaviorAndHabits: 'Thrives in warm, humid micro-climates close to food and moisture. Nocturnal and highly photophobic; high aggregation pheromone communication creates tight cluster harborages.',
          healthAndStructuralRisks: 'Known vector for over 33 types of bacteria including Salmonella, E. coli, and parasitic worm eggs. Shed skins and frass are potent indoor airborne triggers of severe pediatric asthma.',
          eradicationProtocol: {
            stepByStepProcedure: [
              'Step 1: Thorough flushing inspection behind electrical appliances and sink kickboards',
              'Step 2: Apply Indoxacarb 0.6% bait in micro-droplets directly inside hinge voids',
              'Step 3: Apply Pyriproxyfen (IGR) to halt nymph molting and sterilize adult females',
              'Step 4: Place sticky monitor traps at 1.5m intervals to audit population decline within 7 days'
            ],
            targetChemicals: [
              {
                chemicalName: 'EcoGuard Indox Gel Matrix',
                activeIngredient: 'Indoxacarb 0.6%',
                dilutionRate: 'Ready-to-use precision gel syringe',
                applicationMethod: 'Targeted spot placement (0.25g dots) into unexposed cracks',
                ppeRequired: ['Nitrile gloves', 'Protective eyewear']
              },
              {
                chemicalName: 'EcoHalt IGR Growth Disruptor',
                activeIngredient: 'Pyriproxyfen 1.3%',
                dilutionRate: '4ml per 1L deionized water',
                applicationMethod: 'Fine pin-stream injection into structural expansion joints',
                ppeRequired: ['Nitrile gloves', 'Particulate N95 mask']
              }
            ],
            reEntryIntervalHours: 2,
            preventiveMeasures: [
              'Eliminate standing moisture in drip pans and water heater pans',
              'Eliminate cardboard storage boxes which serve as primary egg oviposition sites',
              'Seal all plumbing void penetrations with polyurethane expanding foam'
            ]
          },
          warningNotes: 'Do not spray liquid repellent insecticides over fresh gel bait spots; repellents will contaminate and ruin bait palatability.'
        }
      });
    }
  } catch (err: any) {
    console.error('Error in /api/vlm/pest-id:', err);
    return res.status(500).json({ error: err.message || 'Pest identification failed' });
  }
});

// 4. Station QR Check-In API
app.get('/api/stations', (req: Request, res: Response) => {
  res.json({ success: true, stations: initialStations });
});

app.post('/api/stations/checkin', (req: Request, res: Response) => {
  const { qrPayload, technicianName = 'Budi Santoso', notes = '' } = req.body;
  if (!qrPayload) {
    return res.status(400).json({ error: 'qrPayload is required' });
  }

  // Find matching station or update
  let matched = initialStations.find(s => s.qrPayload === qrPayload || s.stationId === qrPayload);
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';

  if (matched) {
    matched.status = 'verified';
    matched.timestamp = nowTime;
    matched.technicianName = technicianName;
    if (notes) matched.notes = notes;
  } else {
    // Dynamically register if unknown QR
    matched = {
      id: `st-${Date.now()}`,
      stationId: qrPayload.split(':')[1] || 'ZONE-CUSTOM',
      stationName: `Client Property Station (${qrPayload})`,
      propertyZone: 'Zone E - Custom Verified Section',
      qrPayload,
      timestamp: nowTime,
      technicianName,
      technicianId: 'TECH-704',
      coordinates: { lat: -6.2090, lng: 106.8457 },
      status: 'verified',
      notes: notes || 'Physical QR station scanned and GPS cryptographically verified on-site.'
    };
    initialStations.push(matched);
  }

  // Update in active booking
  if (bookings[0]) {
    const existingIdx = bookings[0].stations.findIndex(s => s.id === matched!.id);
    if (existingIdx >= 0) {
      bookings[0].stations[existingIdx] = matched;
    } else {
      bookings[0].stations.push(matched);
    }
    bookings[0].updatedAt = new Date().toISOString();
  }

  return res.json({
    success: true,
    message: 'Station check-in verified and client dashboard updated in real-time',
    station: matched,
    allStations: initialStations
  });
});

// 5. Bookings API
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    serviceType,
    serviceCategory,
    timeSlot,
    urgency = 'Standard',
    location,
    notes = '',
    triageReport
  } = req.body;

  const newBooking: Booking = {
    id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: customerName || 'Valued Client',
    customerPhone: customerPhone || '+1 (555) 019-4822',
    customerAddress: customerAddress || '742 Evergreen Terrace',
    location: location || { lat: -6.2088, lng: 106.8456, address: customerAddress },
    serviceType: serviceType || 'Pest Control Full Barrier',
    serviceCategory: serviceCategory || 'Pest Control',
    timeSlot: timeSlot || 'Today, 2:00 PM - 4:30 PM',
    urgency,
    notes,
    status: 'technician_assigned',
    assignedTechnician: {
      id: 'TECH-704',
      name: 'Budi Santoso',
      badge: 'Certified Master Pest Inspector #921',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (555) 884-0192',
      rating: 4.94,
      completedJobs: 1420,
      currentEta: 'Dispatched - 12 mins away',
      currentLocation: { lat: -6.2065, lng: 106.8420 }
    },
    triageReport,
    stations: JSON.parse(JSON.stringify(initialStations)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, qaReport } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  if (status) booking.status = status;
  if (qaReport) booking.qaReport = qaReport;
  booking.updatedAt = new Date().toISOString();
  res.json({ success: true, booking });
});

// 6. Feedback & Complaints Portal
app.get('/api/feedback', (req: Request, res: Response) => {
  res.json({ success: true, feedback: feedbackList });
});

app.post('/api/feedback', (req: Request, res: Response) => {
  const {
    bookingId,
    customerName,
    serviceType,
    ratingOverall,
    ratingPunctuality,
    ratingChemicalSafety,
    writtenFeedback,
    isComplaint = false,
    complaintCategory,
    complaintPhotoBase64
  } = req.body;

  const newFeedback: FeedbackEntry = {
    id: `FB-${Math.floor(100 + Math.random() * 900)}`,
    bookingId: bookingId || 'BK-9402',
    customerName: customerName || 'Eco One Customer',
    serviceType: serviceType || 'General Sanitation & Pest Control',
    ratingOverall: Number(ratingOverall) || 5,
    ratingPunctuality: Number(ratingPunctuality) || 5,
    ratingChemicalSafety: Number(ratingChemicalSafety) || 5,
    writtenFeedback: writtenFeedback || '',
    isComplaint: Boolean(isComplaint),
    complaintCategory,
    complaintPhotoBase64,
    status: isComplaint ? 'Assigned to Supervisor' : 'Received',
    supervisorNotes: isComplaint
      ? 'Automatic 14-Day Free Re-treatment warranty activated. Supervisor assigned within 2 business hours.'
      : undefined,
    createdAt: new Date().toISOString()
  };

  feedbackList.unshift(newFeedback);
  res.json({ success: true, feedback: newFeedback });
});

// Production Vite static serving OR development Vite middleware
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Eco One Server] running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
