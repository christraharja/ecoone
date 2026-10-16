import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Lock,
  Unlock,
  RotateCcw,
  FileBadge,
  Brain
} from 'lucide-react';
import { VlmQaResult } from '../../types/index.ts';
import { sampleQaPairs, SampleQaPair } from '../../data/sampleImages.ts';
import { IllustrationBadge } from '../common/IllustrationBadge.tsx';
import { AiThoughtInspector } from '../common/AiThoughtInspector.tsx';
import confetti from 'canvas-confetti';

interface VlmQaCheckProps {
  onQaFinished?: (result: VlmQaResult) => void;
  bookingId?: string;
}

export const VlmQaCheck: React.FC<VlmQaCheckProps> = ({
  onQaFinished,
  bookingId = 'BK-9402'
}) => {
  const [selectedPair, setSelectedPair] = useState<SampleQaPair>(sampleQaPairs[0]);
  const [beforeImage, setBeforeImage] = useState<string>(sampleQaPairs[0].beforeUrl);
  const [afterImage, setAfterImage] = useState<string>(sampleQaPairs[0].afterUrl);
  const [serviceType, setServiceType] = useState('Pest Elimination & Anti-Bacterial Sanitization');
  const [stationName, setStationName] = useState('Station B2 - Kitchen Perimeter Void');
  const [isVerifying, setIsVerifying] = useState(false);
  const [qaResult, setQaResult] = useState<VlmQaResult | null>(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [ticketClosed, setTicketClosed] = useState(false);
  const [activeThoughts, setActiveThoughts] = useState<string[]>(sampleQaPairs[0].simulatedThoughts);
  const [isStreamingThoughts, setIsStreamingThoughts] = useState(false);

  // File upload handlers for technician custom camera / photos
  const handleUploadBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setBeforeImage(res);
        setQaResult(null);
        setShowFailureModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setAfterImage(res);
        setQaResult(null);
        setShowFailureModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (pair: SampleQaPair) => {
    setSelectedPair(pair);
    setBeforeImage(pair.beforeUrl);
    setAfterImage(pair.afterUrl);
    setServiceType(pair.serviceType);
    setStationName(pair.stationName);
    setQaResult(null);
    setShowFailureModal(false);
    setTicketClosed(false);
    setActiveThoughts(pair.simulatedThoughts);
  };

  // Run Simulated VLM QA Verification
  const handleRunQaVerification = async () => {
    setIsVerifying(true);
    setIsStreamingThoughts(true);
    setQaResult(null);
    setShowFailureModal(false);

    // Simulated multi-step AI verification delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    try {
      const isSimulatedFail = selectedPair.expectedOutcome === 'fail';

      let result: VlmQaResult;
      if (isSimulatedFail) {
        result = {
          passed: false,
          cleanlinessScore: 54,
          verdict: 'QA FAILED: Incomplete Treatment & Residual Contaminants Detected',
          detectedIssues: [
            'Residual biological frass and grease staining visible along rear baseboard perimeter',
            'Alkaline chemical slurry puddling detected; surface was not properly wiped dry to standard',
            'Unsealed expansion crevice remains un-dusted with micro-pore silica desiccant'
          ],
          requiredRemedialActions: [
            'Re-vacuum the crevice zone using HEPA-filtered vacuum equipment',
            'Neutralize and wipe down chemical puddles with a clean damp microfiber towel',
            'Re-apply micro-gel bait precisely in 0.25g dots rather than continuous smearing',
            'Capture and upload a new compliant After photo to unlock ticket completion'
          ],
          positiveObservations: [
            'Gross debris from Before stage has been partially cleared'
          ],
          technicianCertificate: {
            inspectorBadge: 'ECO-QA-REJECT-SYS-4',
            timestamp: new Date().toLocaleTimeString(),
            safetyApproval: false
          }
        };
      } else {
        result = {
          passed: true,
          cleanlinessScore: 98,
          verdict: 'PASSED - Eco One Hospital Grade Sanitation Verified',
          detectedIssues: [],
          requiredRemedialActions: [
            'Maintain room ventilation for 30 minutes post-treatment',
            'Leave tamper-evident bait placements undisturbed during warranty window'
          ],
          positiveObservations: [
            '100% eradication of visible pest bio-film and organic frass deposits',
            'Substrate surface degreased and dried to non-slip clinical standard',
            'Precision gel bait placements compliant with EPA master label guidelines'
          ],
          technicianCertificate: {
            inspectorBadge: `ECO-VLM-CERT-#${Math.floor(8000 + Math.random() * 1000)}`,
            timestamp: new Date().toLocaleTimeString(),
            safetyApproval: true
          }
        };
      }

      setQaResult(result);
      if (result.passed) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (onQaFinished) onQaFinished(result);
      } else {
        setShowFailureModal(true);
      }
    } catch (err) {
      console.error('QA Verification failed:', err);
    } finally {
      setIsVerifying(false);
      setIsStreamingThoughts(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              VLM Automated QA Engine
            </span>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            Ticket: {bookingId}
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white leading-tight">
          Before / After Documentation & QA
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Capture or upload Before and After photos. Our Vision AI scrutinizes the After photo for residual pests, biological stains, or chemical puddles. Incomplete treatments lock ticket closure.
        </p>
      </div>

      {/* Preset Test Scenarios for Quick Evaluation */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
          <span>Test Scenarios (Pass vs Incomplete Treatment)</span>
          <span className="text-sky-600 font-normal lowercase">1-tap demo</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sampleQaPairs.map((pair) => {
            const isCurrent = selectedPair.id === pair.id;
            const isExpectedPass = pair.expectedOutcome === 'pass';
            return (
              <div
                key={pair.id}
                onClick={() => handleSelectSample(pair)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300/40 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isExpectedPass
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isExpectedPass ? '✓ Compliant Clean (Will Pass)' : '⚠ Deficient Treatment (Will Fail)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Preset #{pair.id.slice(3, 7)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <IllustrationBadge
                    type="qa_dirty"
                    title="Before"
                    className="h-16"
                    imageUrl={pair.beforeUrl}
                  />
                  <IllustrationBadge
                    type={isExpectedPass ? 'qa_clean' : 'qa_dirty'}
                    title="After"
                    className="h-16"
                    imageUrl={pair.afterUrl}
                  />
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">{pair.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {pair.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Before / After Photo Upload Grid */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. BEFORE PHOTO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                1. Before Treatment
              </span>
              <label className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-md">
                <Camera className="w-3 h-3" />
                <span>Upload Before</span>
                <input type="file" accept="image/*" onChange={handleUploadBefore} className="hidden" />
              </label>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] flex items-center justify-center relative">
              <img src={beforeImage} alt="Before Treatment" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                Before Photo
              </div>
            </div>
          </div>

          {/* 2. AFTER PHOTO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                2. After Treatment
              </span>
              <label className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-md">
                <Camera className="w-3 h-3" />
                <span>Upload After</span>
                <input type="file" accept="image/*" onChange={handleUploadAfter} className="hidden" />
              </label>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] flex items-center justify-center relative">
              <img src={afterImage} alt="After Treatment" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-2 left-2 bg-sky-600 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                After Photo (For QA)
              </div>
            </div>
          </div>
        </div>

        {/* Station and Treatment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-600">Property Inspection Station</label>
            <input
              type="text"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600">Standard Service Applied</label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* Simulated AI Thought Stream Inspector */}
        <div className="pt-1">
          <AiThoughtInspector
            thoughts={activeThoughts}
            isStreaming={isStreamingThoughts}
            concludingSummary={
              qaResult
                ? qaResult.passed
                  ? `QA Verified: Cleanliness score ${qaResult.cleanlinessScore}% exceeds hospital-grade standard (90%). Approval granted.`
                  : `QA Warning: Incomplete clean detected (${qaResult.cleanlinessScore}%). Must rectify before closing ticket.`
                : undefined
            }
          />
        </div>

        {/* Run QA Check CTA */}
        <button
          type="button"
          onClick={handleRunQaVerification}
          disabled={isVerifying}
          className="w-full bg-gradient-to-r from-slate-900 to-sky-950 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg hover:from-black hover:to-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>Simulating AI QA Surface Inspection...</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span>Simulate VLM Quality Assurance Inspection</span>
            </>
          )}
        </button>
      </div>

      {/* STRICT ON-SCREEN ALERT MODAL (TRIGGERED WHEN QA FAILS) */}
      {showFailureModal && qaResult && !qaResult.passed && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-rose-500 animate-in zoom-in-95 duration-200 space-y-4">
            {/* Warning Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  MANDATORY QA RE-CLEAN ENFORCED
                </span>
                <h3 className="text-lg font-black text-rose-950 leading-tight">
                  QA FAILED: Incomplete Treatment Detected!
                </h3>
                <p className="text-xs text-rose-700 mt-1 font-semibold">
                  Ticket #{bookingId} is LOCKED. You cannot close this work order until all deficiencies are rectified.
                </p>
              </div>
            </div>

            {/* Cleanliness Score */}
            <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">VLM Cleanliness Index</span>
              <span className="text-base font-black text-rose-600">{qaResult.cleanlinessScore}% / 100%</span>
            </div>

            {/* Detected Deficiencies */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Detected Deficiencies & Residual Matter</span>
              </h4>
              <div className="space-y-1">
                {qaResult.detectedIssues.map((issue, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-800 border border-slate-200 flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Actions Checklist */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <RotateCcw className="w-4 h-4 text-sky-600" />
                <span>Required Remedial Actions</span>
              </h4>
              <div className="space-y-1 text-xs text-slate-700">
                {qaResult.requiredRemedialActions.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                    <span className="font-bold text-sky-700">{idx + 1}.</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Acknowledge & Re-Clean */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowFailureModal(false);
                  handleSelectSample(sampleQaPairs[0]);
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs py-3 px-3 rounded-2xl shadow-md hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Re-Clean (Fix & Pass)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFailureModal(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QA RESULT REPORT (When Passed or Inspected) */}
      {qaResult && (
        <div
          className={`rounded-3xl p-5 border shadow-md space-y-4 ${
            qaResult.passed
              ? 'bg-white border-emerald-300'
              : 'bg-white border-rose-300'
          }`}
        >
          {/* Header Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {qaResult.passed ? (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  VLM Inspection Result
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {qaResult.verdict}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block">Score</span>
              <span
                className={`text-lg font-black ${
                  qaResult.passed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {qaResult.cleanlinessScore}%
              </span>
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Positive Cleanliness Observations
            </h4>
            <div className="space-y-1">
              {qaResult.positiveObservations.map((obs, idx) => (
                <div key={idx} className="bg-emerald-50/70 p-2 rounded-xl text-xs text-emerald-900 flex items-start gap-2 border border-emerald-100">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* If Passed: Digital Certificate & Ticket Closure Unlock */}
          {qaResult.passed ? (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileBadge className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">
                      Eco One Certified Hospital-Grade QA Passed
                    </h5>
                    <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                      Badge: {qaResult.technicianCertificate.inspectorBadge} • Verified {qaResult.technicianCertificate.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                  <Unlock className="w-4 h-4" />
                  <span>Unlocked</span>
                </div>
              </div>

              {!ticketClosed ? (
                <button
                  type="button"
                  onClick={() => {
                    setTicketClosed(true);
                    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Sign & Close Ticket #{bookingId}</span>
                </button>
              ) : (
                <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-400">
                    ✓ Ticket #{bookingId} Successfully Completed & Archived
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Client has been notified and digital warranty certificate issued.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center justify-between text-xs text-rose-800">
              <span className="flex items-center gap-2 font-bold">
                <Lock className="w-4 h-4 text-rose-600" />
                Ticket Closure Locked Until Re-Cleaning
              </span>
              <button
                type="button"
                onClick={() => setShowFailureModal(true)}
                className="text-[11px] underline font-bold text-rose-700"
              >
                View Requirements
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
