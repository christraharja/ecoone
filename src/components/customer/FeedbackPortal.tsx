import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  AlertOctagon,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { FeedbackEntry } from '../../types/index.ts';
import confetti from 'canvas-confetti';

interface FeedbackPortalProps {
  bookingId?: string;
}

export const FeedbackPortal: React.FC<FeedbackPortalProps> = ({ bookingId = 'BK-9402' }) => {
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingPunctuality, setRatingPunctuality] = useState(5);
  const [ratingChemicalSafety, setRatingChemicalSafety] = useState(5);
  const [writtenFeedback, setWrittenFeedback] = useState('');
  const [isComplaint, setIsComplaint] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState('Pest activity resurfaced');
  const [complaintPhoto, setComplaintPhoto] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [serviceType, setServiceType] = useState('Termite Sub-slab Barrier & Deep Eradication');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);

  // Load feedbacks on mount
  useEffect(() => {
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.feedback) {
          setFeedbacks(data.feedback);
        }
      })
      .catch((err) => console.error('Failed to fetch feedback:', err));
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setComplaintPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          customerName,
          serviceType,
          ratingOverall,
          ratingPunctuality,
          ratingChemicalSafety,
          writtenFeedback,
          isComplaint,
          complaintCategory: isComplaint ? complaintCategory : undefined,
          complaintPhotoBase64: complaintPhoto || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
        setSubmissionSuccess(true);
        if (!isComplaint && ratingOverall >= 4) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }
        // Reset form
        setWrittenFeedback('');
        setComplaintPhoto(null);
        setIsComplaint(false);
      }
    } catch (err) {
      console.error('Feedback submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Accountability & Trust Guarantee
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          Feedback & Complaints Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Every Eco One service comes with our 14-Day 100% Satisfaction Guarantee. Submit ratings or file a formal complaint with photo evidence for immediate supervisor intervention.
        </p>
      </div>

      {/* Eco One Guarantee Policy Card */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              Eco One Ironclad Policy
            </span>
            <h3 className="text-base font-extrabold leading-tight">
              14-Day Free Re-treatment Warranty
            </h3>
            <p className="text-xs text-sky-100 mt-1 max-w-sm leading-relaxed">
              If pests resurface or cleaning is not up to our medical-grade standard, we send a senior specialist within 24 hours at zero charge to you.
            </p>
          </div>
          <FileCheck2 className="w-10 h-10 text-sky-200 flex-shrink-0" />
        </div>
      </div>

      {/* Feedback Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        {submissionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Thank you! Your submission has been securely recorded.
            </span>
            <button
              type="button"
              onClick={() => setSubmissionSuccess(false)}
              className="text-[11px] underline text-emerald-700"
            >
              Dismiss
            </button>
          </div>
        )}

        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1">
            Service Reference
          </span>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">{serviceType}</p>
              <p className="text-[11px] text-slate-500">Booking Ref: {bookingId} • Tech: Budi Santoso</p>
            </div>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </div>
        </div>

        {/* 3-Dimension Star Ratings */}
        <div className="space-y-3 pt-2">
          {/* 1. Overall Quality */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Overall Treatment Quality</p>
              <p className="text-[10px] text-slate-400">Pest elimination and cleanliness standard</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingOverall(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= ratingOverall ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Punctuality */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Technician Punctuality</p>
              <p className="text-[10px] text-slate-400">Arrived within promised dispatch window</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingPunctuality(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= ratingPunctuality ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chemical Safety & Odor */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Chemical Safety & Odorless Standard</p>
              <p className="text-[10px] text-slate-400">Child/pet safe, zero noxious chemical fumes</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingChemicalSafety(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= ratingChemicalSafety ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Written Review / Experience Notes
          </label>
          <textarea
            rows={3}
            value={writtenFeedback}
            onChange={(e) => setWrittenFeedback(e.target.value)}
            placeholder="Tell us about the results, technician professionalism, and overall satisfaction..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
          />
        </div>

        {/* Formal Complaint Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <label
            onClick={() => setIsComplaint(!isComplaint)}
            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              isComplaint
                ? 'bg-rose-50 border-rose-300 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  isComplaint ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isComplaint && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className={`text-xs font-bold ${isComplaint ? 'text-rose-900' : 'text-slate-800'}`}>
                  File a Formal Complaint / Claim Warranty
                </p>
                <p className="text-[10px] text-slate-500">
                  Activates immediate supervisor review and free re-treatment
                </p>
              </div>
            </div>
            <AlertOctagon className={`w-4 h-4 ${isComplaint ? 'text-rose-600' : 'text-slate-400'}`} />
          </label>
        </div>

        {/* COMPLAINT DETAILS SECTION (Only shown when complaint toggled) */}
        {isComplaint && (
          <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-200 space-y-3 animate-in fade-in duration-200">
            <div>
              <label className="text-[11px] font-bold text-rose-900 block mb-1">
                Nature of Issue
              </label>
              <select
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value)}
                className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
              >
                <option>Pest activity resurfaced</option>
                <option>Missed area under cabinets or baseboard</option>
                <option>AC dripping water post-clean</option>
                <option>Un-wiped chemical residue on surface</option>
                <option>Technician unpunctual / late arrival</option>
                <option>Property concern or scratch</option>
              </select>
            </div>

            {/* Photo Attachment for Complaint */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-rose-900">
                  Attach Photo Evidence (Ensures Full Accountability)
                </label>
                <label className="text-[11px] text-rose-700 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {complaintPhoto ? (
                <div className="relative rounded-xl overflow-hidden border border-rose-200 h-28 bg-black flex items-center justify-center">
                  <img
                    src={complaintPhoto}
                    alt="Complaint Evidence"
                    onError={() => setComplaintPhoto(null)}
                    className="max-h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setComplaintPhoto(null)}
                    className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-rose-200 rounded-xl p-3 text-center bg-white">
                  <Camera className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <p className="text-[11px] text-rose-700 font-medium">
                    Upload photo of resurfaced pest or missed cleaning area
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold text-sm py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isComplaint
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
              : 'bg-sky-500 text-white hover:bg-sky-600 shadow-sky-500/25'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isComplaint ? 'Submit Complaint & Activate 14-Day Warranty' : 'Submit Service Rating'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* FEEDBACK & COMPLAINTS HISTORY LOG */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Recent Community Feedback & Claim Resolutions
        </h3>

        <div className="space-y-2.5">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border bg-white ${
                item.isComplaint ? 'border-amber-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.customerName}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{item.serviceType}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.ratingOverall ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-700 ml-1">
                      {item.ratingOverall}.0
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isComplaint
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {item.writtenFeedback && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{item.writtenFeedback}"
                </p>
              )}

              {item.supervisorNotes && (
                <div className="mt-2 bg-sky-50 border border-sky-200 rounded-xl p-2.5 text-[11px] text-sky-900">
                  <span className="font-bold text-sky-700 block mb-0.5">Eco One Supervisor Action:</span>
                  {item.supervisorNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
