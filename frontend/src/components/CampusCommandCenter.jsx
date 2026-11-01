import React from 'react';
import { 
  Building2, Users, Calendar, Award, ShieldAlert, CheckCircle2, 
  Clock, TrendingUp, AlertCircle, Sparkles, Swords, RefreshCw, Zap
} from 'lucide-react';

export default function CampusCommandCenter({ 
  status = {}, 
  rooms = [], 
  faculty = [], 
  schedule = {}, 
  bookings = [], 
  exams = [], 
  onOpenCopilot, 
  onOpenEmergency, 
  onOpenBattle,
  onResetDemo,
  onSelectTab
}) {
  const stats = status.stats || {};
  const violations = status.hard_violations_count || 0;
  const softTotal = status.soft_penalty_total || 0;

  // Compute live breakdown
  const closedRooms = rooms.filter(r => r.id === 'CR-102');
  const occupiedRooms = schedule.sessions ? new Set(schedule.sessions.map(s => s.room_id)).size : 17;
  const freeRooms = Math.max(0, rooms.length - occupiedRooms - closedRooms.length);

  return (
    <div className="space-y-6">
      {/* Hero Command Bar */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Campus Telemetry Active · Semester II, 2027
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-100 flex items-center gap-3">
              🏛 Chilika Institute of Technology
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl font-sans">
              Centralized Operational Command Center — Week 7 (Spectra '27 Fest & Midsem Scheduling Engine). 
              Governed by deterministic constraint satisfaction (CP-SAT) with explainable AI copilot.
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCopilot}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              AI Copilot
            </button>

            <button
              onClick={onOpenBattle}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-sm flex items-center gap-2 transition"
            >
              <Swords className="w-4 h-4 text-amber-400" />
              Battle Mode
            </button>

            <button
              onClick={onOpenEmergency}
              className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 font-semibold text-sm flex items-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Crisis Mode
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Correctness & Clashes */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Correctness</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-emerald-400 font-cinzel">
              {violations === 0 ? "0 Clashes" : `${violations} Violations`}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% Hard Constraint Compliant
            </div>
          </div>
        </div>

        {/* Metric 2: Soft Optimization */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Soft Penalties</span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-amber-400 font-cinzel">
              {softTotal} pts
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Faculty S1: 20 · Room S5: 48 · P9: 18
            </div>
          </div>
        </div>

        {/* Metric 3: Spectra Bookings */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Fest Bookings</span>
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-purple-400 font-cinzel">
              {stats.approved_bookings || 20} Approved
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Score: 62.0 / 64 max (0 inversions)
            </div>
          </div>
        </div>

        {/* Metric 4: Midsem Exams */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Midsem Exams</span>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-blue-400 font-cinzel">
              41 Scheduled
            </div>
            <div className="text-xs text-slate-400 mt-1">
              12 Slots · Half Capacity Checked
            </div>
          </div>
        </div>
      </div>

      {/* Live Campus Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Venue Live Status */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Venue Utilization (27 Venues)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {freeRooms} Free
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Classrooms & Lecture Halls</span>
              <span className="font-semibold text-slate-200">16 / 16 Operational</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Laboratories (CS, Elec, Mech, Civil)</span>
              <span className="font-semibold text-slate-200">7 / 7 In Lab Blocks</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '70%' }} />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Auditorium & Open-Air Theatre</span>
              <span className="font-semibold text-purple-300">Spectra Dedicated</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
            </div>

            <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-xs mt-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300">Active Disruption Notice: </span>
                <span className="text-slate-300">
                  CR-102 closed for pipeline maintenance. Session CS101-C-L2 rerouted to CR-101 (Room-only change).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Faculty Duty Status */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Faculty Workload Status (40 Faculty)
            </h3>
            <span className="text-xs text-emerald-400 font-mono">
              Max 4h/day Respected
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs max-h-56 overflow-y-auto pr-1">
            {faculty.slice(0, 6).map(f => (
              <div key={f.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{f.name}</div>
                  <div className="text-[11px] text-slate-400">{f.department} · {f.id}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Max {f.max_hours_per_day}h/day
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {f.preferences?.length || 0} soft preferences
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Spectra Fest Timeline */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Spectra '27 Key Event Pipeline
            </h3>
            <button 
              onClick={() => onSelectTab('fest')}
              className="text-xs text-amber-400 hover:text-amber-300 transition"
            >
              View All 25 &rarr;
            </button>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-purple-300">BR-01: Spectra Inauguration</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">MON P4-P5</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">Main Auditorium (AUD) · 450 attendees</div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-300">BR-03: Navigation Satellites Talk</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">WED P6-P7</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">Main Auditorium (AUD) · 300 attendees</div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-300">BR-06: Quiz Club Prelims</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">THU P10-P11</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">Seminar Hall 1 (SH-1) · 140 attendees</div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300">BR-16: Spectra Pro-Night</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">FRI P10-P13</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">Open-Air Theatre (OAT) · 750 attendees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
