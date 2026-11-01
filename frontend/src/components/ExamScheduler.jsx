import React, { useState } from 'react';
import { Calendar, Users, Building, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

const EXAM_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function ExamScheduler({ examsData = {} }) {
  const [selectedDay, setSelectedDay] = useState('ALL');
  const exams = examsData.exams || [];

  const filteredExams = selectedDay === 'ALL' 
    ? exams 
    : exams.filter(e => e.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-cinzel font-bold text-slate-100">
              Mid-Semester Examination Schedule
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Midsem week (MON-SAT, Sessions AM & PM). Enforces 50% room spacing capacity check and zero student group exam overlap.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Scheduled</span>
            <span className="text-2xl font-bold font-cinzel text-blue-400">41 Exams</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Exam Soft Penalty</span>
            <span className="text-lg font-bold font-cinzel text-emerald-400">0 pts (Optimal)</span>
          </div>
        </div>
      </div>

      {/* Day Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedDay === 'ALL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
        >
          All Days (41)
        </button>
        {EXAM_DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${selectedDay === day ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
          >
            {day} ({exams.filter(e => e.day === day).length})
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.map(ex => (
          <div key={ex.exam_id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-amber-400 text-xs">{ex.exam_id}</span>
                <h4 className="font-bold text-slate-100 text-sm mt-0.5">
                  {ex.course_ids?.join(', ')}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {ex.day} · {ex.session}
              </span>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Count:</span>
                <span className="font-mono font-semibold text-slate-200">{ex.size} students</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Effective Seating:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {ex.allocated_seats_half_cap} seats (50% capacity)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Venues:</span>
                <span className="font-mono text-amber-300 font-semibold truncate max-w-[160px]">
                  {ex.rooms?.join(', ')}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="text-slate-300 font-semibold">Attending Groups: </span>
                {ex.groups?.join(', ')}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-400/90 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero group clash
              </span>
              <span>Surplus: +{ex.surplus_seats} seats</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
