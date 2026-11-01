import React, { useState, useEffect } from 'react';
import { 
  X, Mic, MicOff, Sparkles, Send, CheckCircle2, AlertTriangle, 
  HelpCircle, ArrowRight, Clock, Users, Building, ShieldCheck 
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    label: "Hinglish Booking Request",
    text: "seminar hall kal shaam 6 baje, 2 ghante, 100 log, mic chahiye"
  },
  {
    label: "Wheelchair Accessibility Test",
    text: "I want SH-2 on Friday at 10 am for a wheelchair-accessible poster session, 60 people."
  },
  {
    label: "Vague Timing Test",
    text: "Need somewhere for the quiz finals after lunch on Thursday, maybe 150 people."
  },
  {
    label: "Tech Fest Hackathon Lab",
    text: "Can I get a lab with computers for a 3-hour coding contest on Thursday afternoon? About 60 participants."
  },
  {
    label: "Grand Farewell in Auditorium",
    text: "Book the auditorium for the CSE department farewell, Friday evening, around 400 people, need stage and mic."
  }
];

export default function AICopilotModal({ isOpen, onClose, activeRole = 'club', onSubmitBooking }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedProposal, setParsedProposal] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Web Speech API Voice Recognition
  useEffect(() => {
    let recognition = null;
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Supports Hinglish/Hindi & English recognition

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening && recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  if (!isOpen) return null;

  const handleParse = async (textToParse = inputText) => {
    if (!textToParse.trim()) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse, role: activeRole })
      });
      const data = await res.json();
      setParsedProposal(data);
    } catch (err) {
      setErrorMsg('Failed to process natural language request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySample = (sampleText) => {
    setInputText(sampleText);
    handleParse(sampleText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-slate-100 flex items-center gap-2">
                AstraCampus AI Copilot
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Natural Language & Voice Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                English, Hindi & Hinglish natural language parser with strict constraint pre-validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Sample Prompts */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Try Official Benchmark Requests:
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplySample(p.text)}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 text-slate-300 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Input Box */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type in English or Hinglish: e.g., 'seminar hall kal shaam 6 baje, 2 ghante, 100 log, mic chahiye' or speak using the mic..."
                rows={3}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 pr-24 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none"
              />

              {/* Action Buttons inside Input */}
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={isListening ? "Listening... click to stop" : "Start Voice Input (Hinglish/English)"}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleParse()}
                  disabled={isProcessing || !inputText.trim()}
                  className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition disabled:opacity-50"
                  title="Parse and Validate Request"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Voice Recognition Active: Speak now in English, Hindi, or Hinglish...
              </div>
            )}
          </div>

          {/* Structured Proposal Preview Card */}
          {parsedProposal && (
            <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 space-y-4 bg-slate-900/60">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-cinzel font-bold text-sm text-slate-100">
                    Structured Booking Proposal (Editable)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300 font-mono">
                  Code Pre-Validated
                </span>
              </div>

              {/* Warnings & Conflict Flags */}
              {parsedProposal.warnings && parsedProposal.warnings.length > 0 && (
                <div className="space-y-1.5">
                  {parsedProposal.warnings.map((w, i) => (
                    <div key={i} className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>{w}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up Prompts */}
              {parsedProposal.follow_up && (
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-lg text-xs text-blue-200 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">AI Clarification: </span>
                    {parsedProposal.follow_up}
                  </div>
                </div>
              )}

              {/* Fields Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Attendance</span>
                  <span className="font-bold text-slate-100 text-sm">{parsedProposal.attendance} people</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                  <span className="font-bold text-slate-100 text-sm">{parsedProposal.duration_periods} hours</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Proposed Window</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {parsedProposal.windows[0]?.day} P{parsedProposal.windows[0]?.from_period}-P{parsedProposal.windows[0]?.to_period}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Assigned Venue</span>
                  <span className="font-bold text-emerald-300 text-sm">
                    {parsedProposal.requested_room || parsedProposal.room_types?.join('/')}
                  </span>
                </div>
              </div>

              {/* Amenities */}
              {parsedProposal.needs && parsedProposal.needs.length > 0 && (
                <div className="text-xs flex items-center gap-2">
                  <span className="text-slate-400">Required Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedProposal.needs.map((n, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        ✓ {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (onSubmitBooking) onSubmitBooking(parsedProposal);
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Submit Venue Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
