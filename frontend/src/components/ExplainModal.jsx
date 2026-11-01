import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export default function ExplainModal({ isOpen, onClose, explainTarget }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !explainTarget) return;

    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: explainTarget.type, // 'session' or 'booking'
            id: explainTarget.id
          })
        });
        const data = await res.json();
        setExplanation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, explainTarget]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-slate-100 flex items-center gap-2">
                Explainable AI Rationale
              </h3>
              <p className="text-xs text-slate-400">
                Transparent deterministic mathematical explanations for automated scheduling decisions
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              Retrieving constraint satisfaction reasoning...
            </div>
          ) : explanation ? (
            <div className="space-y-4">
              {/* Target Header */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    {explanation.session_id || explanation.request_id}
                  </span>
                  <div className="text-slate-300 font-semibold mt-0.5">
                    {explanation.course || explanation.title}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Placement / Status</span>
                  <span className="font-mono text-emerald-400 font-bold text-xs">
                    {explanation.slot || explanation.status}
                  </span>
                </div>
              </div>

              {/* Explanations List */}
              <div className="space-y-2.5">
                <span className="font-semibold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Constraint Satisfaction & Allocation Rationale:
                </span>

                {(explanation.explanations || explanation.factors || []).map((factor, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      {factor.factor}
                    </div>
                    <p className="text-slate-300 pl-5 leading-relaxed">
                      {factor.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              No explanation available for this entity.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
