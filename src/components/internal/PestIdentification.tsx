import React, { useState } from 'react';
import {
  Bug,
  Camera,
  Upload,
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Brain
} from 'lucide-react';
import { PestIdResult } from '../../types/index.ts';
import { samplePestSpecimens, SampleImage } from '../../data/sampleImages.ts';
import { IllustrationBadge } from '../common/IllustrationBadge.tsx';
import { AiThoughtInspector } from '../common/AiThoughtInspector.tsx';

export const PestIdentification: React.FC = () => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<SampleImage | null>(samplePestSpecimens[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [technicianNotes, setTechnicianNotes] = useState(
    'Specimen collected from warm motor housing behind commercial upright refrigerator. Multiple nymphs observed.'
  );
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [pestResult, setPestResult] = useState<PestIdResult | null>(null);
  const [activeThoughts, setActiveThoughts] = useState<string[]>(samplePestSpecimens[0].simulatedThoughts);
  const [isStreamingThoughts, setIsStreamingThoughts] = useState(false);

  const displayImage = customImage || selectedSpecimen?.dataUrl || samplePestSpecimens[0].dataUrl;

  // File upload for field camera capture
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setCustomImage(res);
        setSelectedSpecimen(null);
        setPestResult(null);

        const customThoughts = [
          `Entomology VLM Macro Scan active on file "${file.name}".`,
          `Ingesting macro image buffer at full sensor resolution.`,
          `Analyzing chitinous exoskeleton, antennal segments, and tarsal claws.`,
          `Correlating specimen morphology with urban pest taxonomic database.`,
          `Calculating chemical resistance profile and EPA-approved active ingredients.`,
          `Compiling Eco One Standard Operating Procedure and PPE requirements.`
        ];
        setActiveThoughts(customThoughts);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    setSelectedSpecimen(sample);
    setCustomImage(null);
    setTechnicianNotes(sample.notes);
    setPestResult(null);
    setActiveThoughts(sample.simulatedThoughts);
  };

  const handleIdentifyPest = async () => {
    setIsIdentifying(true);
    setIsStreamingThoughts(true);
    setPestResult(null);

    // Simulate multi-step AI reasoning delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    try {
      let finalResult: PestIdResult;

      if (selectedSpecimen?.id === 'pest-termite-swarmer') {
        finalResult = {
          commonName: 'Subterranean Termite (Reticulitermes flavipes)',
          scientificName: 'Reticulitermes flavipes',
          family: 'Rhinotermitidae',
          lifeStageDetected: 'Alate Swarmer & Soldier Caste',
          identificationCues: [
            'Broad waist without constriction; moniliform beaded straight antennae',
            'Two pairs of equal-length wings with translucent reticulated venation',
            'Soldier specimens exhibit rectangular head capsules with toothless sickle mandibles'
          ],
          behaviorAndHabits:
            'Nests subterranean in soil and structural voids. Highly dependent on continuous moisture source; builds earthen shelter tubes to bridge exposed masonry to edible wood joists.',
          healthAndStructuralRisks:
            'Catastrophic structural damage to softwood framing, drywall paper, and furniture. Undetected colonies consume up to 5 grams of timber daily per 60,000 workers.',
          eradicationProtocol: {
            stepByStepProcedure: [
              'Step 1: Perform acoustic and thermal moisture audit to trace primary subterranean entry point',
              'Step 2: Sub-slab injection of Fipronil non-repellent liquid at 5 Liters per linear meter',
              'Step 3: Drill and foam hollow doorframes and baseboards using Borate foaming agent',
              'Step 4: Install tamper-resistant exterior soil bait monitoring stations every 3 meters'
            ],
            targetChemicals: [
              {
                chemicalName: 'EcoTerm Pro Non-Repellent Liquid',
                activeIngredient: 'Fipronil 9.1%',
                dilutionRate: '0.05% active (0.8 fl oz per gallon water)',
                applicationMethod: 'Continuous trench and rodding into soil along perimeter foundation slab',
                ppeRequired: ['Nitrile chemical gloves', 'Eye splash goggles', 'Rubber boots']
              },
              {
                chemicalName: 'EcoFoam Borate Timber Preservative',
                activeIngredient: 'Disodium Octaborate Tetrahydrate (DOT) 98%',
                dilutionRate: '15% aqueous solution with foaming additive',
                applicationMethod: 'Wall void high-expansion foam generator (20:1 expansion)',
                ppeRequired: ['Nitrile gloves', 'Particulate N95 mask', 'Eye protection']
              }
            ],
            reEntryIntervalHours: 2,
            preventiveMeasures: [
              'Eliminate all wood-to-ground contact around perimeter landscaping',
              'Divert air conditioning condensate drains at least 1 meter away from foundation',
              'Maintain 15cm exposed inspection gap between soil and exterior siding'
            ]
          },
          warningNotes:
            'Do not spray repellent pyrethroids in termite zones; repellents fracture the colony and induce satellite nesting deeper inside inaccessible structural elements.'
        };
      } else if (selectedSpecimen?.id === 'pest-bed-bug') {
        finalResult = {
          commonName: 'Common Bed Bug (Cimex lectularius)',
          scientificName: 'Cimex lectularius',
          family: 'Cimicidae',
          lifeStageDetected: 'Engorged Adult Female with visible abdominal segments',
          identificationCues: [
            'Dorsoventrally flattened oval body, approximately 5-6mm in length',
            'Mahogany brown coloration turning darker reddish-purple post blood-meal',
            'Reduced vestigial hemelytra (wing pads); emit sweet cilantro-like alarm pheromone'
          ],
          behaviorAndHabits:
            'Obligate hematophagous ectoparasites. Strictly nocturnal, hiding during daylight in mattress seams, bed frames, electrical outlets, and baseboards within 2 meters of sleeping host.',
          healthAndStructuralRisks:
            'Painful pruritic erythematous papules and secondary bacterial skin infections from scratching. Severe psychological sleep disruption and anxiety.',
          eradicationProtocol: {
            stepByStepProcedure: [
              'Step 1: Thermal high-temperature dry steam (180°C) applied at 2.5cm/second along all piping seams',
              'Step 2: Precision injection of amorphous silica desiccant into hollow headboard frame joints',
              'Step 3: Encase mattresses and box springs with certified bed bug proof microporous encasements',
              'Step 4: Deploy Bed Bug interceptor pitfall traps under all bed frame posts'
            ],
            targetChemicals: [
              {
                chemicalName: 'EcoPure Amorphous Silica Desiccant',
                activeIngredient: 'Amorphous Synthetic Silica 100%',
                dilutionRate: 'Ready-to-use precision hand duster powder',
                applicationMethod: 'Light dusting inside wall receptacles, switch boxes, and frame voids',
                ppeRequired: ['N95 particulate respirator', 'Eye goggles', 'Gloves']
              },
              {
                chemicalName: 'EcoSteam Micro-Disruption Fluid',
                activeIngredient: 'Non-toxic heat-synergized essential botanical extract',
                dilutionRate: 'Ready-to-use steam tank additive',
                applicationMethod: 'High-temperature steam blast across upholstery seams',
                ppeRequired: ['Thermal heat-resistant gloves', 'Eye goggles']
              }
            ],
            reEntryIntervalHours: 1,
            preventiveMeasures: [
              'Launder all bedding in hot water (>60°C) and tumble dry on high heat for 40 minutes',
              'Inspect luggage wheels and seams immediately after traveling',
              'Keep beds pulled at least 30cm away from bedroom walls'
            ]
          },
          warningNotes:
            'Never use consumer aerosol fogger "bug bombs"; foggers do not penetrate seam crevices and scatter bed bugs into adjacent rooms.'
        };
      } else {
        // German Cockroach or custom upload default
        finalResult = {
          commonName: 'German Cockroach (Blattella germanica)',
          scientificName: 'Blattella germanica',
          family: 'Ectobiidae',
          lifeStageDetected: 'Adult female with prominent egg capsule (ootheca)',
          identificationCues: [
            'Light brown to tan coloration with two distinct dark parallel stripes on pronotum',
            'Approximately 13-16 mm in length with fully developed wings spanning body',
            'Spiny cursorial legs specialized for rapid movement in tight 2mm gaps'
          ],
          behaviorAndHabits:
            'Thrives in warm, humid micro-climates close to food and moisture. Nocturnal and photophobic; aggregation pheromone communication creates tight cluster harborages in kitchen cabinetry.',
          healthAndStructuralRisks:
            'Known vector for over 33 types of bacteria including Salmonella, E. coli, and parasitic worm eggs. Shed skins and frass are potent indoor airborne triggers of pediatric asthma.',
          eradicationProtocol: {
            stepByStepProcedure: [
              'Step 1: Flushing inspection behind refrigerator motor, microwave housing, and sink kickboards',
              'Step 2: Apply Indoxacarb 0.6% bait in micro-droplets directly inside hinge voids and dark corners',
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
              'Eliminate standing moisture in drip pans and plumbing leaks under sinks',
              'Remove corrugated cardboard storage boxes which serve as primary egg oviposition sites',
              'Seal all plumbing void penetrations with copper mesh and elastomeric sealant'
            ]
          },
          warningNotes:
            'Do not spray liquid repellent insecticides over fresh gel bait spots; repellents will contaminate and ruin bait palatability.'
        };
      }

      setPestResult(finalResult);
    } catch (err) {
      console.error('Pest identification error:', err);
    } finally {
      setIsIdentifying(false);
      setIsStreamingThoughts(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Bug className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Field Entomology Scanner
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white leading-tight">
          AI Pest ID & Chemical Guidelines
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload a macro photo of an unidentified insect or specimen. Our Gemini Vision Model diagnoses the exact species taxonomy and generates the Eco One Standard Operating Procedure with chemical dilutions and PPE.
        </p>
      </div>

      {/* Preset Test Specimens (Reliable Visual Cards) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Select Specimen or Upload Photo
          </label>
          <span className="text-[11px] font-bold text-sky-600">1-Tap Demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {samplePestSpecimens.map((specimen) => {
            const isCurrent = selectedSpecimen?.id === specimen.id && !customImage;
            return (
              <div
                key={specimen.id}
                onClick={() => handleSelectSample(specimen)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300/40 shadow-sm scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mb-2">
                  <IllustrationBadge
                    type={specimen.svgIconType}
                    title={specimen.title}
                    className="w-full h-16"
                    imageUrl={specimen.dataUrl}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-sky-700 uppercase block mb-0.5">
                  {specimen.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {specimen.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {specimen.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Specimen Image Container */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Active Specimen Photo
          </label>
          <label className="text-xs text-sky-600 font-bold hover:underline cursor-pointer flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] max-h-[260px] flex items-center justify-center">
          <img src={displayImage} alt="Pest Specimen" className="max-w-full max-h-full object-contain" />
          <div className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
            Taxonomy Scan Ready
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600">Field Harborage Notes</label>
          <textarea
            rows={2}
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            placeholder="Harborage location, substrate material, aggregation density..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
          />
        </div>

        {/* Simulated AI Thought Stream Inspector */}
        <div className="pt-1">
          <AiThoughtInspector
            thoughts={activeThoughts}
            isStreaming={isStreamingThoughts}
            concludingSummary={
              pestResult
                ? `Diagnosis: ${pestResult.commonName} (${pestResult.scientificName}). Protocol generated.`
                : undefined
            }
          />
        </div>

        <button
          type="button"
          onClick={handleIdentifyPest}
          disabled={isIdentifying}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isIdentifying ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Simulating AI Cuticular Morphology Scan & Chemical Formulation...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Simulate AI Pest Identification & Chemical SOP</span>
            </>
          )}
        </button>
      </div>

      {/* GENERATED PEST DOSSIER & CHEMICAL SOP */}
      {pestResult && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-300 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Identification */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                Taxonomic Verification Complete
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                {pestResult.commonName}
              </h3>
              <p className="text-xs text-slate-500 italic font-mono mt-0.5">
                {pestResult.scientificName} • Family: {pestResult.family}
              </p>
            </div>

            <div className="text-right bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Life Stage</span>
              <span className="text-xs font-extrabold text-slate-800">{pestResult.lifeStageDetected}</span>
            </div>
          </div>

          {/* Morphological Diagnostic Cues */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Morphological Markers</span>
            </h4>
            <div className="space-y-1">
              {pestResult.identificationCues.map((cue, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 flex items-start gap-2 border border-slate-100">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior & Public Health Risk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Behavior & Nesting Habits
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {pestResult.behaviorAndHabits}
              </p>
            </div>
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Health & Structural Destruction
              </span>
              <p className="text-xs text-amber-900 leading-relaxed">
                {pestResult.healthAndStructuralRisks}
              </p>
            </div>
          </div>

          {/* COMPANY RECOMMENDED CHEMICAL GUIDELINES */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-sky-600" />
                <span>Eco One Prescribed Chemical Formulations</span>
              </h4>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                EPA Registered Only
              </span>
            </div>

            <div className="space-y-2.5">
              {pestResult.eradicationProtocol.targetChemicals.map((chem, idx) => (
                <div key={idx} className="bg-sky-50/60 rounded-2xl p-3.5 border border-sky-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-extrabold text-sky-950">{chem.chemicalName}</h5>
                      <p className="text-[11px] font-mono text-sky-700">
                        Active Ingredient: {chem.activeIngredient}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-white text-sky-800 px-2 py-0.5 rounded-md border border-sky-200">
                      Dilution: {chem.dilutionRate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-800">Application Method: </span>
                    {chem.applicationMethod}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500">Mandatory PPE:</span>
                    {chem.ppeRequired.map((ppe, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {ppe}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Field Procedure SOP */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Step-by-Step Eradication Protocol (Field SOP)</span>
            </h4>
            <div className="space-y-1.5">
              {pestResult.eradicationProtocol.stepByStepProcedure.map((step, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-800 flex items-start gap-2 border border-slate-100">
                  <span className="font-bold text-emerald-600 font-mono">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Re-entry Interval & Warning Notice */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Field Cautionary Directive</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Re-entry Window: {pestResult.eradicationProtocol.reEntryIntervalHours} Hours
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {pestResult.warningNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
