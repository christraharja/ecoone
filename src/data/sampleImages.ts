// Sample dataset with bulletproof encoded SVG illustrations for reliable rendering across all browsers

export interface SampleImage {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  dataUrl: string;
  notes: string;
  roomType: string;
  svgIconType: 'termite' | 'cockroach' | 'ac_mold' | 'bedbug';
  simulatedThoughts: string[];
}

export interface SampleQaPair {
  id: string;
  title: string;
  serviceType: string;
  stationName: string;
  beforeUrl: string;
  afterUrl: string;
  expectedOutcome: 'pass' | 'fail';
  description: string;
  simulatedThoughts: string[];
}

// Generate reliable SVG Data URL using standard encodeURIComponent
function createSvgDataUrl(bg: string, title: string, subtitle: string, iconDetails: string, badgeText = 'ECO ONE SPEC'): string {
  const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
  <defs>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="600" height="420" fill="url(#cardGrad)"/>
  <rect width="600" height="420" fill="url(#grid)" />
  <g transform="translate(300, 180)">
    ${iconDetails}
  </g>
  <rect x="20" y="330" width="560" height="72" rx="14" fill="rgba(15,23,42,0.92)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
  <text x="40" y="362" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="800">${title}</text>
  <text x="40" y="386" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500">${subtitle}</text>
  <rect x="450" y="348" width="115" height="32" rx="8" fill="#0284C7"/>
  <text x="507" y="369" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${badgeText}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
}

// 1. Customer VLM Triage Samples
export const sampleTriageCases: SampleImage[] = [
  {
    id: 'triage-termite',
    title: 'Termite Wood Damage & Mud Tubes',
    subtitle: 'Frass & hollowed timber along baseboard',
    category: 'Pest Control',
    roomType: 'Living Room Baseboard',
    svgIconType: 'termite',
    notes: 'Noticed fine sawdust frass piles accumulating underneath oak door frame and hollow tapping sounds.',
    simulatedThoughts: [
      'Visual stream initiated: Analyzing 600x420 macro resolution image.',
      'Detected dark brown linear subterranean mud tunnels traversing pine baseboard.',
      'Identified micro-fecal pellet accumulation (hexagonal frass typical of wood-destroying Isoptera).',
      'Structural integrity scan indicates 28% hollow interior cavity within door jamb.',
      'Primary Classification: Subterranean Termite (Reticulitermes flavipes).',
      'Calculating Threat Index: High (8/10) — Satellite colony expansion imminent.',
      'Synthesizing actionable briefing for field technician team: Non-repellent liquid barrier required.'
    ],
    dataUrl: createSvgDataUrl(
      '#451a03',
      'Termite Wood Frass & Mud Gallery',
      'Location: Baseboard & Sub-slab Joist',
      `<g>
        <rect x="-180" y="-70" width="360" height="110" rx="10" fill="#78350f" stroke="#92400e" stroke-width="3"/>
        <path d="M -130 40 Q -110 -20 -95 -60 Q -80 -80 -60 -100" stroke="#d97706" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M 30 40 Q 50 -10 65 -70 Q 80 -90 100 -110" stroke="#d97706" stroke-width="18" fill="none" stroke-linecap="round"/>
        <circle cx="-140" cy="15" r="5" fill="#fbbf24"/>
        <circle cx="-120" cy="22" r="6" fill="#f59e0b"/>
        <circle cx="-100" cy="12" r="5" fill="#d97706"/>
        <circle cx="45" cy="22" r="6" fill="#fbbf24"/>
        <circle cx="65" cy="28" r="5" fill="#f59e0b"/>
        <circle cx="85" cy="18" r="6" fill="#d97706"/>
        <circle cx="105" cy="30" r="5" fill="#b45309"/>
        <path d="M -70 -20 L -30 -10 L 10 -40 L 40 -20" stroke="#1c1917" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M -40 10 L 20 5 L 80 15" stroke="#1c1917" stroke-width="5" fill="none" stroke-linecap="round"/>
      </g>`,
      'TERMITE DETECTED'
    )
  },
  {
    id: 'triage-roach',
    title: 'German Cockroach Kitchen Cluster',
    subtitle: 'Nymphs & fecal spotting behind microwave',
    category: 'Pest Control',
    roomType: 'Kitchen Cabinetry Void',
    svgIconType: 'cockroach',
    notes: 'Multiple rapid scuttling insects observed when turning on kitchen light at night near sink drain.',
    simulatedThoughts: [
      'Visual stream initiated: Analyzing contrast boundaries in warm appliance shadow.',
      'Detected dark pronotal dual parallel stripes on adult dorsal shield (14mm length).',
      'Identified multiple second-instar nymphs and protruding dark brown egg case (ootheca).',
      'Surface aggregation pattern confirms localized breeding harborage in moisture perimeter.',
      'Primary Classification: German Cockroach (Blattella germanica).',
      'Calculating Threat Index: High (8.5/10) — Vector for enteric pathogens and allergens.',
      'Synthesizing actionable briefing: Indoxacarb micro-gel baiting + Pyriproxyfen IGR formulation.'
    ],
    dataUrl: createSvgDataUrl(
      '#1c1917',
      'Cockroach Nest & Bio-Spotting',
      'Location: Kitchen Countertop Voids',
      `<g>
        <rect x="-190" y="-80" width="380" height="130" fill="#292524" rx="12" stroke="#44403c" stroke-width="2"/>
        <g transform="translate(-70, -20) rotate(35)">
          <ellipse cx="0" cy="0" rx="18" ry="34" fill="#78350f" stroke="#92400e" stroke-width="3"/>
          <ellipse cx="0" cy="-30" rx="11" ry="11" fill="#b45309"/>
          <line x1="-5" y1="-34" x2="-5" y2="-24" stroke="#000000" stroke-width="3.5"/>
          <line x1="5" y1="-34" x2="5" y2="-24" stroke="#000000" stroke-width="3.5"/>
          <path d="M -5 -38 Q -30 -65 -45 -80" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
          <path d="M 5 -38 Q 30 -65 45 -80" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
          <path d="M -16 -10 L -42 -15" stroke="#92400e" stroke-width="3.5"/>
          <path d="M -17 5 L -48 10" stroke="#92400e" stroke-width="3.5"/>
          <path d="M -15 20 L -42 35" stroke="#92400e" stroke-width="3.5"/>
          <path d="M 16 -10 L 42 -15" stroke="#92400e" stroke-width="3.5"/>
          <path d="M 17 5 L 48 10" stroke="#92400e" stroke-width="3.5"/>
          <path d="M 15 20 L 42 35" stroke="#92400e" stroke-width="3.5"/>
        </g>
        <g transform="translate(60, 10) rotate(-40) scale(0.65)">
          <ellipse cx="0" cy="0" rx="18" ry="32" fill="#92400e"/>
          <ellipse cx="0" cy="-28" rx="10" ry="10" fill="#b45309"/>
        </g>
        <circle cx="20" cy="-40" r="4" fill="#000"/>
        <circle cx="30" cy="-35" r="3" fill="#000"/>
        <circle cx="38" cy="-45" r="4" fill="#000"/>
        <circle cx="100" cy="-10" r="4" fill="#000"/>
      </g>`,
      'COCKROACH NEST'
    )
  },
  {
    id: 'triage-ac-mold',
    title: 'Severe AC Evaporator Coil Mold',
    subtitle: 'Black mold growth & musty spore odor',
    category: 'AC Cleaning',
    roomType: 'Master Bedroom Split AC',
    svgIconType: 'ac_mold',
    notes: 'Air conditioner blowing damp musty air; family members experiencing morning sneezing and eye irritation.',
    simulatedThoughts: [
      'Visual stream initiated: Inspecting heat exchanger aluminum fins.',
      'Detected dense hydrophobic fungal biofilm spanning 70% of cooling fin surface.',
      'Spore colony morphology matches Cladosporium & Stachybotrys micro-growth.',
      'Condensate drainage channel blocked with biological gelatinous slime.',
      'Primary Classification: Severe Microbial AC Contamination.',
      'Calculating Threat Index: High (7.8/10) — Airborne allergen dispersal during blower operation.',
      'Synthesizing actionable briefing: Alkaline coil hydro-flush + Quaternary ammonium anti-microbial fogging.'
    ],
    dataUrl: createSvgDataUrl(
      '#064e3b',
      'AC Coil Bio-Slime & Mold Colonies',
      'Location: Blower Fan & Cooling Fins',
      `<g>
        <rect x="-190" y="-80" width="380" height="130" fill="#0f172a" rx="10" stroke="#334155" stroke-width="2"/>
        <g stroke="#475569" stroke-width="4">
          <line x1="-160" y1="-70" x2="-160" y2="40"/>
          <line x1="-120" y1="-70" x2="-120" y2="40"/>
          <line x1="-80" y1="-70" x2="-80" y2="40"/>
          <line x1="-40" y1="-70" x2="-40" y2="40"/>
          <line x1="0" y1="-70" x2="0" y2="40"/>
          <line x1="40" y1="-70" x2="40" y2="40"/>
          <line x1="80" y1="-70" x2="80" y2="40"/>
          <line x1="120" y1="-70" x2="120" y2="40"/>
          <line x1="160" y1="-70" x2="160" y2="40"/>
        </g>
        <ellipse cx="-80" cy="-15" rx="42" ry="30" fill="#064e3b" opacity="0.95"/>
        <ellipse cx="-75" cy="-15" rx="32" ry="20" fill="#022c22"/>
        <ellipse cx="40" cy="5" rx="55" ry="32" fill="#064e3b" opacity="0.95"/>
        <ellipse cx="45" cy="5" rx="42" ry="22" fill="#022c22"/>
        <circle cx="110" cy="-25" r="22" fill="#022c22"/>
        <circle cx="-130" cy="15" r="20" fill="#022c22"/>
      </g>`,
      'AC BIO-MOLD'
    )
  },
  {
    id: 'triage-bedbug',
    title: 'Bed Bug Seam Cluster & Stains',
    subtitle: 'Mattress piping fecal stains and shed skins',
    category: 'Mattress & Upholstery',
    roomType: 'Guest Room Bedding',
    svgIconType: 'bedbug',
    notes: 'Waking up with clustered itchy red welts in linear rows along arms; black spots found along mattress piping.',
    simulatedThoughts: [
      'Visual stream initiated: Examining woven fabric seam piping.',
      'Detected oval-shield apterous insects (5.5mm, reddish-brown, dorsoventrally flattened).',
      'Identified digested blood spot staining (iron oxide black speckling along stitching).',
      'Exuviae (shed nymphal cast skins) confirmed in seam crevices.',
      'Primary Classification: Common Bed Bug (Cimex lectularius).',
      'Calculating Threat Index: Critical (9/10) — High reproductive rate in bedding mattress.',
      'Synthesizing actionable briefing: 180°C Dry steam thermal kill + micro-pore desiccant dusting.'
    ],
    dataUrl: createSvgDataUrl(
      '#4c0519',
      'Bed Bug Mattress Seam Infestation',
      'Location: Mattress Piping & Tufting',
      `<g>
        <rect x="-190" y="-80" width="380" height="130" fill="#e2e8f0" rx="10" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M -190 -10 C -100 -30 100 10 190 -10" stroke="#94a3b8" stroke-width="16" fill="none"/>
        <path d="M -190 -10 C -100 -30 100 10 190 -10" stroke="#cbd5e1" stroke-width="10" fill="none"/>
        <g transform="translate(-40, -15) rotate(20)">
          <ellipse cx="0" cy="0" rx="16" ry="22" fill="#881337" stroke="#9f1239" stroke-width="2"/>
          <ellipse cx="0" cy="-18" rx="8" ry="6" fill="#4c0519"/>
          <line x1="-14" y1="-8" x2="14" y2="-8" stroke="#4c0519" stroke-width="2.5"/>
          <line x1="-15" y1="-2" x2="15" y2="-2" stroke="#4c0519" stroke-width="2.5"/>
          <line x1="-14" y1="5" x2="14" y2="5" stroke="#4c0519" stroke-width="2.5"/>
        </g>
        <g transform="translate(30, -5) rotate(-15) scale(0.85)">
          <ellipse cx="0" cy="0" rx="16" ry="22" fill="#9f1239"/>
          <ellipse cx="0" cy="-18" rx="8" ry="6" fill="#4c0519"/>
        </g>
        <circle cx="-85" cy="-25" r="5" fill="#4c0519"/>
        <circle cx="-70" cy="-30" r="3.5" fill="#4c0519"/>
        <circle cx="80" cy="-15" r="4.5" fill="#4c0519"/>
        <circle cx="100" cy="-20" r="5.5" fill="#4c0519"/>
        <circle cx="65" cy="10" r="3.5" fill="#881337"/>
      </g>`,
      'BED BUG DETECTED'
    )
  }
];

// 2. Technician QA Inspection Pairs
export const sampleQaPairs: SampleQaPair[] = [
  {
    id: 'qa-passed-case',
    title: 'Kitchen Cabinet & Baseboard Void Treatment',
    serviceType: 'Pest Elimination & Anti-Bacterial Sanitization',
    stationName: 'Station B2 - Kitchen Perimeter Void',
    expectedOutcome: 'pass',
    description: 'Immaculately sanitized: biological residues removed, micro-gel applied in non-exposed hinges, surface dry and wiped.',
    simulatedThoughts: [
      'QA Inspector VLM Comparison initialized: Before vs After paired analysis.',
      'Scanning Before image: High density organic matter and pest frass identified in sub-floor junction.',
      'Scanning After image: Substrate reflectivity indicates thorough degreasing and micro-fiber wipe down.',
      'Verifying chemical placement: Indoxacarb gel bait verified in 0.25g micro-dots inside non-exposed hinges (EPA Compliant).',
      'Checking for residual dead insects: Zero carcasses detected on surface.',
      'Final Cleanliness Index: 98% (Hospital Grade Standard Met).',
      'Verdict: PASSED. Digital safety certificate issued.'
    ],
    beforeUrl: createSvgDataUrl(
      '#292524',
      'BEFORE: Heavy Infestation & Bio-Grime',
      'Cabinet Baseboard: Pre-Treatment State',
      `<g>
        <rect x="-180" y="-70" width="360" height="110" fill="#44403c" rx="8"/>
        <path d="M -140 -20 Q -90 40 -20 10 Q 50 30 140 -30" fill="none" stroke="#1c1917" stroke-width="32" opacity="0.85"/>
        <circle cx="-80" cy="10" r="11" fill="#78350f"/>
        <circle cx="-40" cy="-20" r="13" fill="#78350f"/>
        <circle cx="60" cy="20" r="10" fill="#78350f"/>
        <circle cx="90" cy="-10" r="12" fill="#78350f"/>
        <circle cx="-110" cy="-40" r="5" fill="#000"/>
        <circle cx="30" cy="-40" r="5" fill="#000"/>
      </g>`,
      'BEFORE: CONTAMINATED'
    ),
    afterUrl: createSvgDataUrl(
      '#0f172a',
      'AFTER: Hospital Grade Clean & Sanitized',
      'Cabinet Baseboard: Eco One Passed Standard',
      `<g>
        <rect x="-180" y="-70" width="360" height="110" fill="#f8fafc" rx="8"/>
        <rect x="-180" y="20" width="360" height="20" fill="#e2e8f0"/>
        <path d="M -120 -20 L -80 0 L -30 -30" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M 40 -20 L 80 10 L 130 -15" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <polygon points="-70,-45 -66,-35 -56,-31 -66,-27 -70,-17 -74,-27 -84,-31 -74,-35" fill="#38bdf8"/>
        <polygon points="90,-35 93,-28 100,-25 93,-22 90,-15 87,-22 80,-25 87,-28" fill="#38bdf8"/>
        <circle cx="0" cy="15" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="0" y="32" fill="#0369a1" font-size="11" font-weight="700" text-anchor="middle">PRECISION GEL DOT (0.25g)</text>
      </g>`,
      'AFTER: 100% CLEAN'
    )
  },
  {
    id: 'qa-failed-case',
    title: 'AC Blower Wheel & Coil Clean (Deficient)',
    serviceType: 'AC Deep Hydro-Wash & Anti-Fungal Treatment',
    stationName: 'Station C3 - HVAC Blower Unit',
    expectedOutcome: 'fail',
    description: 'Residual chemical slurry left un-rinsed, black mold residue remaining on interior coil fins. Fails QA.',
    simulatedThoughts: [
      'QA Inspector VLM Comparison initialized: Before vs After paired analysis.',
      'Scanning After photo for surface cleanliness and chemical neutralization.',
      'ANOMALY DETECTED: Yellowish alkaline chemical puddling observed pooling in drip tray.',
      'ANOMALY DETECTED: Persistent dark fungal patches remain visible between coil ribs 4 through 8.',
      'Surface was not thoroughly flushed with de-ionized water; potential corrosive risk to client copper coils.',
      'Final Cleanliness Index: 54% (Fails Minimum Threshold of 90%).',
      'Verdict: QA FAILED. Locking ticket closure and triggering mandatory re-clean directive.'
    ],
    beforeUrl: createSvgDataUrl(
      '#1e293b',
      'BEFORE: AC Blower Heavy Dust & Bio-Film',
      'HVAC Station: Pre-Treatment State',
      `<g>
        <rect x="-170" y="-70" width="340" height="110" fill="#0f172a" rx="8"/>
        <path d="M -150 -50 L 150 30" stroke="#334155" stroke-width="28"/>
        <ellipse cx="-40" cy="-10" rx="60" ry="30" fill="#064e3b" opacity="0.9"/>
        <ellipse cx="50" cy="10" rx="50" ry="25" fill="#064e3b" opacity="0.9"/>
      </g>`,
      'BEFORE: UNCLEAN'
    ),
    afterUrl: createSvgDataUrl(
      '#7f1d1d',
      'AFTER (DEFICIENT): Sloppy Chemical Puddle & Residual Mold',
      'HVAC Station: QA Failed State',
      `<g>
        <rect x="-170" y="-70" width="340" height="110" fill="#1c1917" rx="8"/>
        <ellipse cx="-40" cy="-10" rx="35" ry="20" fill="#064e3b" opacity="0.85"/>
        <path d="M -100 15 Q -50 40 20 20 Q 70 45 120 25" stroke="#eab308" stroke-width="16" fill="none" opacity="0.9"/>
        <text x="0" y="48" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">UNWIPED CHEMICAL SLURRY DETECTED</text>
        <circle cx="70" cy="-20" r="14" fill="#022c22"/>
      </g>`,
      'AFTER: QA REJECTED'
    )
  }
];

// 3. Technician Pest ID Specimens
export const samplePestSpecimens: SampleImage[] = [
  {
    id: 'pest-german-cockroach',
    title: 'German Cockroach (Blattella germanica)',
    subtitle: 'Adult female with egg capsule (ootheca)',
    category: 'Blattodea / Ectobiidae',
    roomType: 'Commercial Kitchen Sump',
    svgIconType: 'cockroach',
    notes: 'Found in warm motor housing behind commercial upright refrigerator.',
    simulatedThoughts: [
      'Entomology VLM Macro Scan active.',
      'Morphology: Dual longitudinal stripes on light brown pronotal plate confirmed.',
      'Antennae: Filiform, exceeding body length (15mm).',
      'Egg capsule (ootheca) visible at posterior abdominal segments containing ~36 embryos.',
      'Taxonomy: Blattella germanica (German Cockroach).',
      'Generating SOP: Indoxacarb 0.6% precision syringe application + Pyriproxyfen 1.3% IGR.'
    ],
    dataUrl: sampleTriageCases[1].dataUrl
  },
  {
    id: 'pest-termite-swarmer',
    title: 'Subterranean Termite (Reticulitermes sp.)',
    subtitle: 'Alate swarmer & soldier with elongated mandibles',
    category: 'Isoptera / Rhinotermitidae',
    roomType: 'Sub-floor Timber Joist',
    svgIconType: 'termite',
    notes: 'Collected from crawlspace soil near foundation wall slab.',
    simulatedThoughts: [
      'Entomology VLM Macro Scan active.',
      'Morphology: Broad waist (no ant constriction), moniliform beaded antennae.',
      'Wings: Equal length front and hind pairs with milky veins.',
      'Soldier caste head capsule: Rectangular, large saber mandibles without teeth.',
      'Taxonomy: Reticulitermes flavipes (Subterranean Termite).',
      'Generating SOP: Fipronil 0.05% sub-slab continuous chemical trenching + acoustic audit.'
    ],
    dataUrl: sampleTriageCases[0].dataUrl
  },
  {
    id: 'pest-bed-bug',
    title: 'Common Bed Bug (Cimex lectularius)',
    subtitle: 'Engorged adult female on mattress piping',
    category: 'Hemiptera / Cimicidae',
    roomType: 'Hotel Bed Headboard',
    svgIconType: 'bedbug',
    notes: 'Collected during inspection of guest complaint regarding morning skin bites.',
    simulatedThoughts: [
      'Entomology VLM Macro Scan active.',
      'Morphology: Vestigial wing pads (hemelytra), segmented rust-brown body.',
      'Abdominal expansion indicates blood meal within past 48 hours.',
      'Bite pattern: Linear clustering ("breakfast, lunch, dinner" sign).',
      'Taxonomy: Cimex lectularius (Bed Bug).',
      'Generating SOP: High-temp saturated steam (180°C) + Amorphous silica dust into electrical conduits.'
    ],
    dataUrl: sampleTriageCases[3].dataUrl
  }
];
