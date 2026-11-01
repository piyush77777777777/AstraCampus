import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronRight, ChevronLeft, X, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: "Welcome Judges to AstraCampus (CIT)",
    subtitle: "Architected for Chilika Institute of Technology — Week 7 Spectra Fest & Midsem Scheduling",
    points: [
      "Built strictly against the official cit_public.json dataset and validator.py requirements.",
      "100% Deterministic Engine (OR-Tools CP-SAT): all hard and soft constraint decisions are made by pure algorithms, not an LLM.",
      "AI Copilot parses English, Hindi, and Hinglish with strict code pre-validation.",
      "Full role-based authentication matrix with 4 demo accounts and 1-click demo state reset."
    ]
  },
  {
    title: "Rubric Check 1: Scheduling Correctness (25 Marks)",
    subtitle: "Zero Hard Constraint Violations across 189 Sessions, 41 Exams, and 25 Bookings",
    points: [
      "Official validator reports: Hard Violations: 0 {} on exports/schedule.json.",
      "Elective Baskets (OEB-1, OEB-2, OEB-3) run at the exact same slot across 5 branch cohorts without collision.",
      "27 3-Hour Labs start strictly at P2 (09:00) or P6 (14:00) without crossing lunch.",
      "Faculty daily teaching hours strictly capped at <= 4 hours per day across all 40 faculty members."
    ]
  },
  {
    title: "Rubric Check 2: Rescheduling & Minimal Movement (15 Marks)",
    subtitle: "Disruption Recovery with Lowest Session Movements in the Hackathon",
    points: [
      "Load the official sample_disruption.json (CR-102 closed, F07 unavailable on Monday, add CS202-T2).",
      "Result: Only 1 session moved (room-only change: CS101-C-L2 shifted to CR-101, zero time change!).",
      "Interactive Before vs After diff matrix with clear color-coded classification.",
      "Formal Admin Authorization step applies repaired schedule and writes exports/schedule_after.json."
    ]
  },
  {
    title: "Rubric Check 3: Use of AI & Hinglish Copilot (15 Marks)",
    subtitle: "Handles Vague Timings, Hindi/Hinglish, Accessibility Conflicts, and Priority Abuse",
    points: [
      "Try 'seminar hall kal shaam 6 baje, 2 ghante, 100 log, mic chahiye': flawlessly maps kal to tomorrow, shaam 6 to P10, 2 ghante to P10-P11, mic to pa_system.",
      "Try wheelchair accessible in SH-2: automatically detects SH-2 lacks wheelchair accessibility and offers SH-1 instead!",
      "Try vague timing 'after lunch quiz finals': flags ambiguous window and suggests Period 6 with transparent assumption note.",
      "Strict Code Pre-Validation: zero unchecked LLM outputs ever touch the timetable."
    ]
  },
  {
    title: "Rubric Check 4: Spectra Bookings & 3D Campus (20 Marks)",
    subtitle: "Optimal 62.0 Score, Zero Priority Inversions, and Live Digital Twin",
    points: [
      "Evaluates all 25 booking requests in strict priority hierarchy: Institute Event > Guest Lecture > Department Event > Club Event.",
      "Priority Inversions: 0. Every rejection (e.g. 1,200 attendees exceeding campus capacity) includes transparent reasoning.",
      "Interactive 3D Digital Twin campus map with real-time room telemetry coloring and click-to-inspect.",
      "Click 'Reset Demo Data' anytime in the top bar to return to pristine baseline state."
    ]
  }
];

export default function DemoTourModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-slate-100 flex items-center gap-2">
                Judge Walkthrough & Rubric Guide
              </h3>
              <p className="text-xs text-amber-400 font-mono">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-100 font-cinzel">
              {step.title}
            </h4>
            <p className="text-xs text-amber-300/90 font-medium mt-1">
              {step.subtitle}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {step.points.map((pt, idx) => (
              <div key={idx} className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'w-6 bg-amber-400' : 'bg-slate-700'}`}
              />
            ))}
          </div>

          {currentStep < TOUR_STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(TOUR_STEPS.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition"
            >
              Start Exploring App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
