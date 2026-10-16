import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Zap,
  ArrowRight,
  Info,
  FileText,
  Sparkles,
  HelpCircle,
  Brain
} from 'lucide-react';
import { VlmTriageReport } from '../../types/index.ts';
import { sampleTriageCases, SampleImage } from '../../data/sampleImages.ts';
import { IllustrationBadge } from '../common/IllustrationBadge.tsx';
import { AiThoughtInspector } from '../common/AiThoughtInspector.tsx';
import { InspectionViewport } from '../common/InspectionViewport.tsx';

interface VlmTriageProps {
  onTriageCompleted: (report: VlmTriageReport, imageDataUrl: string) => void;
  onBookWithReport: (report: VlmTriageReport) => void;
}

export const VlmTriage: React.FC<VlmTriageProps> = ({
  onTriageCompleted,
  onBookWithReport
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleImage | null>(sampleTriageCases[0]);
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState('Living Room Baseboard');
  const [description, setDescription] = useState(
    'Noticed fine sawdust frass piles accumulating underneath oak door frame and hollow tapping sounds.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageReport, setTriageReport] = useState<VlmTriageReport | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [activeThoughts, setActiveThoughts] = useState<string[]>(sampleTriageCases[0].simulatedThoughts);
  const [isSimulatingThoughts, setIsSimulatingThoughts] = useState(false);

  // Active display image
  const displayImage = customUploadedImage || selectedSample?.dataUrl || sampleTriageCases[0].dataUrl;

  // File upload handler for customer custom image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomUploadedImage(result);
        setSelectedSample(null);
        setTriageReport(null);
        setDispatchStatus(null);
        
        // Generate simulated thoughts dynamically for user-uploaded image
        const customThoughts = [
          `Visual stream initialized: Ingested customer photo "${file.name}" (${(file.size / 1024).toFixed(1)} KB).`,
          `Segmenting image textures: Scanning for structural anomalies, insect bio-cuticles, and mold spores.`,
          `Contextual correlation: Evaluating reported area "${roomType || 'Residential premises'}" and notes.`,
          `Pattern recognition: Analyzing color variance, organic frass deposits, and harborage depth.`,
          `Entomological cross-check: Matching biological characteristics with Eco One eradication standard.`,
          `Formulating technical dispatch brief and customer emergency precautions.`
        ];
        setActiveThoughts(customThoughts);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSample(sample);
    setCustomUploadedImage(null);
    setRoomType(sample.roomType);
    setDescription(sample.notes);
    setTriageReport(null);
    setDispatchStatus(null);
    setActiveThoughts(sample.simulatedThoughts);
  };

  // Run AI Visual Assessment (Simulates AI thinking & produces report)
  const handleRunVlmTriage = async () => {
    setIsAnalyzing(true);
    setIsSimulatingThoughts(true);
    setTriageReport(null);
    setDispatchStatus(null);

    // Simulated multi-step AI reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    try {
      // Determine report data based on sample or custom upload
      let finalReport: VlmTriageReport;

      if (selectedSample) {
        if (selectedSample.id === 'triage-termite') {
          finalReport = {
            pestOrIssueName: 'Subterranean Termite (Reticulitermes flavipes)',
            scientificName: 'Reticulitermes flavipes (Isoptera)',
            category: 'Pest Control',
            severity: 'High',
            severityScore: 8,
            confidenceScore: 96,
            visualEvidenceDetected: [
              'Characteristic earthen mud tubes constructed across foundation timber',
              'Wood excavated along grain with packed fecal frass particles',
              'Sub-floor moisture penetration creating optimal nest gallery humidity'
            ],
            infestationSpreadRisk:
              'Severe risk of structural timber hollow-out. Colony queens produce up to 2,000 eggs/day if not intercepted with non-repellent barrier.',
            immediateCustomerPrecautions: [
              'Do not spray aerosol insect repellents (causes satellite budding of colony)',
              'Keep children and pets away from compromised structural frame',
              'Avoid disturbing mud tunnels so technicians can sample active workers',
              'Relocate loose cardboard or untreated firewood away from exterior perimeter'
            ],
            recommendedEcoOneService: 'Termite Sub-slab Chemical Barrier & Nest Neutralization',
            estimatedTreatmentDuration: '90 - 120 minutes',
            actionableSuggestionsForTeam: [
              'Conduct acoustic stethoscope scan along wall studs',
              'Apply Fipronil 0.05% non-repellent liquid trench formulation at 5L/meter',
              'Inject borate foaming desiccant into hollowed door jamb void',
              'Install tamper-evident monitoring stations around external perimeter'
            ],
            urgencyAdvice: 'Immediate same-day dispatch recommended to prevent structural beam compromise.'
          };
        } else if (selectedSample.id === 'triage-roach') {
          finalReport = {
            pestOrIssueName: 'German Cockroach (Blattella germanica)',
            scientificName: 'Blattella germanica (Blattodea)',
            category: 'Pest Control',
            severity: 'High',
            severityScore: 8.5,
            confidenceScore: 97,
            visualEvidenceDetected: [
              'Two prominent dark longitudinal pronotal stripes on adult specimens',
              'Clustered fecal speckling (resembling ground black pepper) in hinge crevices',
              'Active nymphs indicating thriving indoor multi-generational breeding colony'
            ],
            infestationSpreadRisk:
              'Fast population explosion: single female carries 30-40 eggs per ootheca with 60-day generational cycle. Vector for Salmonella and asthma triggers.',
            immediateCustomerPrecautions: [
              'Wipe down all food residue and keep kitchen sink completely dry overnight',
              'Store all pantry grains and cereal in airtight glass or thick plastic bins',
              'Do not use repellent foggers which drive roaches deeper into wall cavities',
              'Empty kitchen trash bins every evening before sunset'
            ],
            recommendedEcoOneService: 'Cockroach Deep Gel Bait Matrix & IGR Disruption Protocol',
            estimatedTreatmentDuration: '45 - 60 minutes',
            actionableSuggestionsForTeam: [
              'Inspect refrigerator compressor motor and under-sink plumbing penetrations',
              'Apply Indoxacarb 0.6% precision gel bait in 0.25g micro-dots inside dark hinges',
              'Deploy Pyriproxyfen 1.3% Insect Growth Regulator (IGR) to halt nymph molting',
              'Place glue monitor boards at 1.5m intervals to track post-treatment decline'
            ],
            urgencyAdvice: 'Treatment needed within 24-48 hours to halt food contact contamination.'
          };
        } else if (selectedSample.id === 'triage-ac-mold') {
          finalReport = {
            pestOrIssueName: 'Stachybotrys & Cladosporium AC Coil Biofilm',
            scientificName: 'Cladosporium / Stachybotrys chartarum',
            category: 'AC Cleaning',
            severity: 'High',
            severityScore: 7.8,
            confidenceScore: 94,
            visualEvidenceDetected: [
              'Dense dark fungal biofilm clogging cooling fin micro-gaps',
              'Musty spore odor emanating during blower fan activation',
              'Condensate drainage pan stagnant water with gelatinous bacterial slime'
            ],
            infestationSpreadRisk:
              'Airborne distribution of mycotoxins into bedroom air every time AC runs, triggering chronic allergies, coughing, and eye irritation.',
            immediateCustomerPrecautions: [
              'Turn off AC fan mode and switch to dry/dehumidify mode temporarily',
              'Clean accessible front mesh filters with warm water and dry thoroughly',
              'Ensure bedroom door has ventilation until deep coil flush is performed',
              'Keep infants and elderly members in rooms with clean air filtration'
            ],
            recommendedEcoOneService: 'AC Hydro-Coil Wash & Anti-Bacterial Sanitization Flush',
            estimatedTreatmentDuration: '45 - 60 minutes / unit',
            actionableSuggestionsForTeam: [
              'Use non-acidic alkaline coil cleaner with high-volume low-pressure rinse',
              'Flush condensate drain line with pneumatic suction to clear bio-sludge',
              'Apply medical-grade quaternary ammonium fogging to blower wheel',
              'Verify air delivery temperature differential post-clean (>10°C delta)'
            ],
            urgencyAdvice: 'Recommended clean within 48 hours for indoor air health safety.'
          };
        } else {
          finalReport = {
            pestOrIssueName: 'Common Bed Bug (Cimex lectularius)',
            scientificName: 'Cimex lectularius (Hemiptera)',
            category: 'Mattress & Upholstery',
            severity: 'Critical',
            severityScore: 9,
            confidenceScore: 98,
            visualEvidenceDetected: [
              'Oval flattened reddish-brown insects nestled along mattress piping seam',
              'Dark digested blood stains and shed exuviae cast skins on tufting',
              'Linear clustered bite pattern reported by client'
            ],
            infestationSpreadRisk:
              'Rapid cross-room migration via baseboards and electrical conduits. Bugs feed exclusively on sleeping hosts, disrupting sleep and causing acute dermatological distress.',
            immediateCustomerPrecautions: [
              'Do not relocate mattress or bedding to other rooms (spreads infestation)',
              'Wash bed linens at high temperature (>60°C) and tumble dry on high heat',
              'Pull bed frame 30cm away from wall and remove bed skirts',
              'Leave infested area undisturbed for technician thermal inspection'
            ],
            recommendedEcoOneService: 'Bed Bug Thermal Steam & Cryo Heat Flush Protocol',
            estimatedTreatmentDuration: '90 - 120 minutes',
            actionableSuggestionsForTeam: [
              'Perform high-temperature dry saturated steam (180°C) along all seams and tufts',
              'Apply amorphous silica desiccant dust into headboard joints and electrical wall plates',
              'Install active mattress encasement covers with certified bed bug proof zipper',
              'Audit adjacent rooms with UV visual inspection'
            ],
            urgencyAdvice: 'Critical priority: Requires immediate same-day intervention.'
          };
        }
      } else {
        // Dynamic report for user-uploaded custom photo
        finalReport = {
          pestOrIssueName: description.toLowerCase().includes('termite')
            ? 'Subterranean Termite Activity'
            : description.toLowerCase().includes('roach')
            ? 'Cockroach Harborage'
            : description.toLowerCase().includes('ac') || description.toLowerCase().includes('mold')
            ? 'Microbial Mold & Mildew Colonization'
            : description.toLowerCase().includes('bed')
            ? 'Bed Bug Infestation'
            : 'Urban Pest / Sanitation Contaminant',
          scientificName: 'Biological Specimen (Diagnosed via VLM)',
          category: 'Pest Control',
          severity: 'High',
          severityScore: 8,
          confidenceScore: 92,
          visualEvidenceDetected: [
            `Visual anomaly detected in ${roomType || 'target area'}`,
            'Organic bio-residue and surface degradation consistent with pest harborages',
            'Moisture or micro-climate facilitating insect/spore proliferation'
          ],
          infestationSpreadRisk:
            'Elevated risk of cross-contamination and colony nesting without professional systematic eradication.',
          immediateCustomerPrecautions: [
            'Avoid disturbing the area to prevent dispersal into deeper wall cavities',
            'Keep food prep zones sanitized and food sealed in airtight containers',
            'Keep domestic pets and children away from the inspection site',
            'Do not apply chemical aerosol bug sprays that leave repellent residues'
          ],
          recommendedEcoOneService: 'Eco One Multi-Zone Deep Eradication & Sanitization Protocol',
          estimatedTreatmentDuration: '60 - 90 minutes',
          actionableSuggestionsForTeam: [
            `Inspect focal zone: ${roomType || 'Property interior'}`,
            'Conduct acoustic and thermal moisture audit to confirm nest boundary',
            'Apply targeted non-repellent formulation compliant with EPA indoor labels',
            'Document before/after photographic proof for customer guarantee record'
          ],
          urgencyAdvice: 'Technician dispatch recommended within 24 hours.'
        };
      }

      setTriageReport(finalReport);
      setDispatchStatus(`DISPATCH-VLM-${Math.floor(1000 + Math.random() * 9000)}`);
      onTriageCompleted(finalReport, displayImage);
    } catch (err) {
      console.error('Triage failed:', err);
    } finally {
      setIsAnalyzing(false);
      setIsSimulatingThoughts(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Vision Language Model (VLM)
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          AI Visual Assessment & Field Triage
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload a clear photo of any pest, frass, mold, or sanitation issue. You can also pick from the sample cards below to test the AI's real-time reasoning and automated technician dispatch briefing.
        </p>
      </div>

      {/* Preset Test Scenarios (Reliable Visual Cards) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Select a Preset Sample or Upload Your Own
          </label>
          <span className="text-[11px] font-bold text-sky-600">1-Tap Demo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {sampleTriageCases.map((sample) => {
            const isCurrent = selectedSample?.id === sample.id && !customUploadedImage;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-sky-50/90 border-sky-400 shadow-sm ring-2 ring-sky-300/50 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Guaranteed Visual Illustration Badge */}
                <div className="mb-2">
                  <IllustrationBadge
                    type={sample.svgIconType}
                    title={sample.title}
                    className="w-full h-20"
                    imageUrl={sample.dataUrl}
                  />
                </div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-1">
                  {sample.title}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{sample.category}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Inspection Photo Container */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Active Inspection Specimen
          </label>
          <label className="text-xs text-sky-600 font-bold hover:text-sky-700 cursor-pointer flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload My Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Professional Inspection Viewport (Guaranteed Rendering, NO broken image icon) */}
        <InspectionViewport
          customImage={customUploadedImage}
          specimenType={selectedSample?.svgIconType || 'termite'}
          title={customUploadedImage ? 'Custom User Photo Specimen' : selectedSample?.title || 'Specimen'}
          subtitle={selectedSample?.subtitle || 'Live Optical Sensor Feed'}
          statusBadge="VLM Ready"
          locationTag={roomType}
        />

        {/* Room / Context inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600">Location in Property</label>
            <input
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="e.g. Living Room Baseboard, Kitchen Sink..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600">Observation Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Saw sawdust piles and insects at night..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* SIMULATED AI THOUGHT STREAM INSPECTOR */}
        <div className="pt-1">
          <AiThoughtInspector
            thoughts={activeThoughts}
            isStreaming={isSimulatingThoughts}
            concludingSummary={
              triageReport
                ? `VLM Identified: ${triageReport.pestOrIssueName} (Severity: ${triageReport.severity}). Recommended: ${triageReport.recommendedEcoOneService}.`
                : undefined
            }
          />
        </div>

        {/* Run Assessment CTA Button */}
        <button
          type="button"
          onClick={handleRunVlmTriage}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-sky-500/25 hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating AI Neural Inspection & Diagnosis...</span>
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Simulate AI Visual Assessment & Dispatch Triage</span>
            </>
          )}
        </button>
      </div>

      {/* GENERATED VLM TRIAGE REPORT DOSSIER */}
      {triageReport && (
        <div className="bg-white rounded-3xl p-5 border border-sky-200 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Dispatch Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900 leading-tight">
                  Triage Report Generated & Auto-Dispatched
                </p>
                <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                  Ref: {dispatchStatus} • Routed to Eco One Lead Technician Queue
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
              Live Synced
            </span>
          </div>

          {/* Species Identification & Severity Score Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                AI Vision Identification
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                {triageReport.pestOrIssueName}
              </h3>
              {triageReport.scientificName && (
                <p className="text-xs text-slate-500 italic font-mono mt-0.5">
                  Taxonomy: {triageReport.scientificName}
                </p>
              )}
            </div>

            {/* Severity Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Severity Index</span>
                <span className="text-xs font-bold text-slate-700">
                  {triageReport.severityScore} / 10
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs flex items-center gap-1.5 ${
                  triageReport.severity === 'Critical'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : triageReport.severity === 'High'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{triageReport.severity} Severity</span>
              </div>
            </div>
          </div>

          {/* Visual Evidence Detected */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-sky-500" />
              <span>Visual Bio-Markers Detected in Image</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {triageReport.visualEvidenceDetected.map((cue, idx) => (
                <div key={idx} className="bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-700 flex items-start gap-2 border border-slate-100">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spread Risk & Urgency */}
          <div className="bg-rose-50/70 border border-rose-150 rounded-2xl p-3.5 space-y-1.5">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Infestation Spread & Structural Risk</span>
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              {triageReport.infestationSpreadRisk}
            </p>
            {triageReport.urgencyAdvice && (
              <p className="text-[11px] font-semibold text-rose-700 italic pt-1 border-t border-rose-200">
                Notice: {triageReport.urgencyAdvice}
              </p>
            )}
          </div>

          {/* Immediate Homeowner Precautions */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span>Immediate Precautions (Before Technician Arrives)</span>
            </h4>
            <div className="space-y-1">
              {triageReport.immediateCustomerPrecautions.map((prec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span>{prec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Suggestions Sent to Internal Team */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Internal Cleaner Team Technical Briefing
              </span>
              <span className="text-[9px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-mono">
                Auto-Dispatched
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {triageReport.actionableSuggestionsForTeam.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-sky-400 font-mono">▸</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action: 1-Click Book With This Report */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onBookWithReport(triageReport)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Recommended Service ({triageReport.recommendedEcoOneService})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
