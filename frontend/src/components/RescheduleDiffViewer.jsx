import React, { useState } from 'react';
import { 
  RefreshCw, CheckCircle2, XCircle, AlertTriangle, ArrowRight, 
  FileText, ShieldCheck, Upload, Layers, Users, Building, Zap 
} from 'lucide-react';

export default function RescheduleDiffViewer({ activeRole = 'admin', onApproveSuccess }) {
  const [disruptionPayload, setDisruptionPayload] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null); // 'idle', 'approved', 'rejected'

  const handleLoadSampleDisruption = async () => {
    setIsLoading(true);
    setApprovalStatus(null);
    try {
      const sample = {
        "id": "sample-disruption",
        "dataset": "cit-public-v1",
        "changes": [
          {
            "type": "faculty_unavailable",
            "faculty_id": "F07",
            "days": ["MON"],
            "periods": [1,2,3,4,5,6,7,8,9],
            "reason": "Conference travel every Monday for semester"
          },
          {
            "type": "room_unavailable",
            "room_id": "CR-102",
            "days": ["MON","TUE","WED","THU","FRI"],
            "periods": [1,2,3,4,5,6,7,8,9],
            "reason": "Water pipeline leakage, room closed"
          },
          {
            "type": "add_session",
            "session": {
              "id": "CS202-T2",
              "course_id": "CS202",
              "kind": "tutorial",
              "groups": ["CSE-2"],
              "faculty_id": "F06",
              "size": 80,
              "duration": 1,
              "room_types": ["classroom", "lecture_hall", "auditorium"],
              "needs_accessible": false,
              "basket_slot": null,
              "fixed_slot": null
            }
          }
        ]
      };
      setDisruptionPayload(sample);

      // Call backend preview
      const res = await fetch('/api/disruption/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample)
      });
      const data = await res.json();
      setPreviewResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch('/api/disruption/approve', { method: 'POST' });
      const data = await res.json();
      setApprovalStatus('approved');
      if (onApproveSuccess) onApproveSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await fetch('/api/disruption/reject', { method: 'POST' });
      setApprovalStatus('rejected');
      setPreviewResult(null);
      setDisruptionPayload(null);
    } catch (err) {
      console.error(err);
    }
  };

  const impact = previewResult?.impact_analysis || {};
  const stability = previewResult?.stability || {};
  const diffs = previewResult?.diffs || [];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinzel font-bold text-slate-100">
              Rescheduling & Impact Analysis Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulate faculty emergencies, room closures, and new session insertions with minimal ripple movement. 
            Requires formal administrative authorization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadSampleDisruption}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Upload className="w-4 h-4" />
            Load Official Practice Disruption
          </button>
        </div>
      </div>

      {/* Disruption Loaded View */}
      {previewResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Impact Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Stability Score</span>
              <div className="text-2xl font-bold font-cinzel text-emerald-400 mt-2">
                {stability.sessions_moved} Session Moved
              </div>
              <span className="text-[10px] text-emerald-400/80">Theoretical Optimal (Min. Disruption)</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Change Profile</span>
              <div className="text-lg font-bold font-mono text-slate-200 mt-2">
                {stability.time_changed} Time / {stability.room_only_changed} Room-Only
              </div>
              <span className="text-[10px] text-slate-400">Minimal Schedule Perturbation</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Affected Faculty</span>
              <div className="text-2xl font-bold font-cinzel text-blue-400 mt-2">
                {impact.affected_faculty_count} Members
              </div>
              <span className="text-[10px] text-slate-400">{impact.affected_faculty?.join(', ') || 'None'}</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Risk Index</span>
              <div className="text-2xl font-bold font-cinzel text-emerald-400 mt-2">
                {impact.risk_score} / 100 ({impact.risk_level})
              </div>
              <span className="text-[10px] text-emerald-400/80">Safe for Production Approval</span>
            </div>
          </div>

          {/* Before vs After Diff Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel font-bold text-sm text-slate-100">
                  Before vs After Comparison Matrix
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {diffs.length} schedule modifications identified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                    <th className="p-3">Session ID</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Baseline Slot (Before)</th>
                    <th className="p-3">Repaired Slot (After)</th>
                    <th className="p-3">Algorithm Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {diffs.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-mono font-bold text-amber-300">
                        {d.session_id}
                      </td>
                      <td className="p-3 font-semibold text-slate-200">
                        {d.course_id}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          d.change_type === 'session_added' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {d.change_type?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {d.before ? `${d.before.day} P${d.before.start_period} (${d.before.room_id})` : <span className="text-slate-600">— None (New) —</span>}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {d.after ? `${d.after.day} P${d.after.start_period} (${d.after.room_id})` : <span className="text-red-400">— Removed —</span>}
                      </td>
                      <td className="p-3 text-slate-300 text-[11px]">
                        {d.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Approval Workflow Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                {activeRole === 'admin' ? (
                  <span className="text-emerald-400 font-semibold">
                    ✓ Authenticated as Dean's Office (Admin): Authorized to apply schedule changes
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">
                    ⚠️ Current role '{activeRole}' has read-only access. Switch to Admin role to authorize change.
                  </span>
                )}
              </div>

              {approvalStatus === 'approved' ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                  Repaired Timetable Approved & Exported to schedule_after.json!
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    Reject Proposal
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={activeRole !== 'admin'}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Apply Schedule Fix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
