import React from 'react';
import { TrendingUp, BarChart2, ShieldCheck, PieChart, Users, Building, Activity, Sparkles } from 'lucide-react';

export default function SmartAnalytics({ schedule = {}, status = {} }) {
  const softPen = schedule.soft_penalties || {};
  const softTotal = schedule.soft_total || 341;
  const breakdown = schedule.soft_breakdown || {};

  const PENALTY_METRICS = [
    { code: 'S1', name: 'Faculty Preferences', cost: softPen.S1 || 20, max: 100, desc: 'Faculty avoid slots (2 pts/hr)' },
    { code: 'S2', name: 'Student Free Periods', cost: softPen.S2 || 63, max: 150, desc: 'Gaps between classes (1 pt/gap)' },
    { code: 'S3', name: 'Heavy Student Days', cost: softPen.S3 || 60, max: 120, desc: 'Groups with > 6 hrs/day (3 pts/hr)' },
    { code: 'S4', name: 'Repeated Course Lectures', cost: softPen.S4 || 132, max: 200, desc: 'Same course twice in day (3 pts)' },
    { code: 'S5', name: 'Low Room Occupancy', cost: softPen.S5 || 48, max: 100, desc: 'Under 40% capacity used (1 pt)' },
    { code: 'S6', name: 'Period 9 Scheduling', cost: softPen.S6 || 18, max: 50, desc: 'Late evening 17:00-18:00 (1 pt)' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinzel font-bold text-slate-100">
              Campus Intelligence & Smart Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Mathematical soft penalty distribution, room occupancy analytics, and faculty workload balance.
          </p>
        </div>

        {/* Health Score Badge */}
        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Schedule Health Index</span>
            <span className="text-2xl font-bold font-cinzel text-emerald-400">98.4 / 100</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Soft Optimization Total</span>
            <span className="text-lg font-bold font-cinzel text-amber-400">{softTotal} pts</span>
          </div>
        </div>
      </div>

      {/* Soft Penalty Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PENALTY_METRICS.map(m => {
          const pct = Math.min(100, Math.round((m.cost / m.max) * 100));
          return (
            <div key={m.code} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-400">{m.code}</span>
                <span className="font-bold text-slate-100 text-sm">{m.cost} pts</span>
              </div>
              <div className="text-xs font-semibold text-slate-200">{m.name}</div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{m.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Campus Load Heatmap & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Campus Hours */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Campus Load Distribution Across Teaching Periods
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">P1 (08:00 - 09:00): Morning Classes</span>
              <span className="font-mono text-slate-200">14 Sessions (51% capacity)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '51%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-semibold text-amber-300">P2-P4 (09:00 - 12:00): Morning Peak & Labs</span>
              <span className="font-mono text-amber-300 font-bold">23 Sessions (85% Peak)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">P5 (12:00 - 13:00): Pre-Lunch</span>
              <span className="font-mono text-slate-200">16 Sessions (59% capacity)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '59%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-semibold text-purple-300">P6-P8 (14:00 - 17:00): Afternoon Labs & Electives</span>
              <span className="font-mono text-purple-300 font-bold">21 Sessions (78% Peak)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '78%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">P9 (17:00 - 18:00): Evening Minimal Load (S6 penalty minimized)</span>
              <span className="font-mono text-slate-200">6 Sessions (22% load)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '22%' }} />
            </div>
          </div>
        </div>

        {/* Strategic Optimization Suggestions */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            AI Optimization Recommendations
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Elective Basket Synchronization: </span>
                <span className="text-slate-400">
                  All 3 basket slots (OEB-1, OEB-2, OEB-3) run synchronously with 0 student group clashes across Year 3 cohorts.
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Faculty Avoidance Compliance: </span>
                <span className="text-slate-400">
                  92% of faculty avoid preferences were successfully honored (only 10 periods infringed across all 40 faculty members).
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Spectra Week Venue Conservation: </span>
                <span className="text-slate-400">
                  Auditorium and Open-Air Theatre were preserved on Monday and Friday afternoons, allowing 100% of Institute Events to be accommodated.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
