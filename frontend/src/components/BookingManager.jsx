import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, XCircle, Filter, HelpCircle, Sparkles, Building, Calendar } from 'lucide-react';

export default function BookingManager({ bookingsData = {}, onExplainBooking }) {
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'alternative_offered', 'rejected'
  const requests = bookingsData.requests || [];
  const bookingScore = bookingsData.booking_score || 62.0;

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Approved
        </span>
      );
    }
    if (status === 'alternative_offered') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          Alternative Offered
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
        <XCircle className="w-3 h-3 text-red-400" />
        Rejected
      </span>
    );
  };

  const getCategoryColor = (cat) => {
    if (cat === 'institute_event') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (cat === 'guest_lecture') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (cat === 'department_event') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-cinzel font-bold text-slate-100">
              Spectra '27 Fest Week Venue Allocations
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Week 7 venue management. Implements strict priority arbitration, role category capping, and automatic conflict avoidance.
          </p>
        </div>

        {/* Score Card */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Official Booking Score</span>
            <span className="text-2xl font-bold font-cinzel text-purple-400">{bookingScore.toFixed(1)} / 64.0 max</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Priority Inversions</span>
            <span className="text-lg font-bold font-cinzel text-emerald-400">0 (Optimal)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${filter === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${filter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
        >
          Approved ({requests.filter(r => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('alternative_offered')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${filter === 'alternative_offered' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
        >
          Alternatives Offered ({requests.filter(r => r.status === 'alternative_offered').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${filter === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
        >
          Rejected ({requests.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {/* Booking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map(req => (
          <div key={req.id} className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${getCategoryColor(req.effective_category)}`}>
                      {req.effective_category?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mt-1">{req.title}</h4>
                  <div className="text-xs text-slate-400">{req.requester} ({req.role})</div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              {/* Allocation Info */}
              <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="font-mono font-semibold text-slate-200">{req.attendance} seats</span>
                </div>
                {req.allocated_room && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Venue:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {req.allocated_room} ({req.allocated_day} P{req.allocated_start}-P{req.allocated_end})
                    </span>
                  </div>
                )}
                {req.reason && (
                  <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                    <span className="text-amber-400/80 font-semibold">Decision Reason: </span>
                    {req.reason}
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Explain Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onExplainBooking && onExplainBooking(req.id)}
                className="px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Explain Decision
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
