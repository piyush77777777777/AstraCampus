import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X, Zap, RefreshCw } from 'lucide-react';

export default function EmergencyModeModal({ isOpen, onClose, onTriggerRecovery }) {
  const [selectedCrisis, setSelectedCrisis] = useState('leak');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryDone, setRecoveryDone] = useState(false);

  if (!isOpen) return null;

  const handleExecuteRecovery = () => {
    setIsRecovering(true);
    setTimeout(() => {
      setIsRecovering(false);
      setRecoveryDone(true);
      if (onTriggerRecovery) onTriggerRecovery();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-red-500/40 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-red-500/30 bg-red-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-red-200 flex items-center gap-2">
                Emergency Crisis Protocol
              </h3>
              <p className="text-xs text-red-300/80">
                Automated one-click failover & incident response for campus operations
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Select Campus Incident:
            </label>

            <div className="space-y-2">
              <div
                onClick={() => setSelectedCrisis('leak')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedCrisis === 'leak' 
                    ? 'border-red-500 bg-red-950/40 text-red-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>🚨 Room CR-102 Pipeline Burst / Flooding</span>
                  <span className="text-[10px] font-mono uppercase bg-red-500/20 px-2 py-0.5 rounded text-red-300">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Immediate room quarantine required. Re-routes affected class to CR-101 (Room-only change, 0 time displacement).
                </p>
              </div>

              <div
                onClick={() => setSelectedCrisis('weather')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedCrisis === 'weather' 
                    ? 'border-red-500 bg-red-950/40 text-red-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">
                  ⛈ Sudden Thunderstorm — Open-Air Theatre Evacuation
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Relocates outdoor cultural events into Main Auditorium (AUD) with zero clash on regular lectures.
                </p>
              </div>

              <div
                onClick={() => setSelectedCrisis('faculty')}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedCrisis === 'faculty' 
                    ? 'border-red-500 bg-red-950/40 text-red-200' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">
                  🩺 Prof. F07 Medical Leave on Monday
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Shifts teaching commitments to Wednesday without exceeding the 4-hour daily limit.
                </p>
              </div>
            </div>
          </div>

          {recoveryDone && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold">Automated Crisis Recovery Complete! </span>
                All sessions re-routed with 0 hard constraint violations and minimal student movement.
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
            <button
              onClick={handleExecuteRecovery}
              disabled={isRecovering}
              className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/25 transition disabled:opacity-50"
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating Optimal Reroute...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Execute 1-Click Auto Recovery
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
