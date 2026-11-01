import React, { useState, useMemo } from 'react';
import { Calendar, Users, Building2, HelpCircle, Download, CheckCircle, AlertTriangle, Filter, Sparkles } from 'lucide-react';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const PERIODS = [
  { id: 1, time: '08:00 - 09:00' },
  { id: 2, time: '09:00 - 10:00' },
  { id: 3, time: '10:00 - 11:00' },
  { id: 4, time: '11:00 - 12:00' },
  { id: 5, time: '12:00 - 13:00' },
  { id: 6, time: '14:00 - 15:00' },
  { id: 7, time: '15:00 - 16:00' },
  { id: 8, time: '16:00 - 17:00' },
  { id: 9, time: '17:00 - 18:00' }
];

export default function TimetableGrid({ 
  schedule = {}, 
  groups = [], 
  faculty = [], 
  rooms = [], 
  onExplainSession,
  initialRoomFilter = null
}) {
  const [filterMode, setFilterMode] = useState('group'); // 'group', 'faculty', 'room'
  const [selectedGroup, setSelectedGroup] = useState('CSE-2');
  const [selectedFaculty, setSelectedFaculty] = useState('F01');
  const [selectedRoom, setSelectedRoom] = useState(initialRoomFilter || 'AUD');

  const sessions = schedule.sessions || [];

  // Filtered sessions based on active filter mode
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (filterMode === 'group') {
        return s.groups && s.groups.includes(selectedGroup);
      }
      if (filterMode === 'faculty') {
        return s.faculty_id === selectedFaculty;
      }
      if (filterMode === 'room') {
        return s.room_id === selectedRoom;
      }
      return true;
    });
  }, [sessions, filterMode, selectedGroup, selectedFaculty, selectedRoom]);

  // Build grid map: (day, period) -> session
  const gridMap = useMemo(() => {
    const map = {};
    filteredSessions.forEach(s => {
      const dur = s.duration || 1;
      for (let p = s.start_period; p < s.start_period + dur; p++) {
        map[`${s.day}-${p}`] = {
          session: s,
          isStart: p === s.start_period,
          duration: dur,
          offset: p - s.start_period
        };
      }
    });
    return map;
  }, [filteredSessions]);

  const getKindColor = (kind) => {
    if (kind === 'lab') return 'bg-purple-950/70 border-purple-500/50 text-purple-200 hover:border-purple-400';
    if (kind === 'tutorial') return 'bg-amber-950/70 border-amber-500/50 text-amber-200 hover:border-amber-400';
    return 'bg-blue-950/70 border-blue-500/50 text-blue-200 hover:border-blue-400';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 shadow-2xl space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-cinzel font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Interactive Timetable Grid
          </h2>
          <p className="text-xs text-slate-400">
            Clash-free schedule viewer with multi-entity filtering and Explainable AI
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterMode('group')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${filterMode === 'group' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Users className="w-3.5 h-3.5" />
              By Group
            </button>
            <button
              onClick={() => setFilterMode('faculty')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${filterMode === 'faculty' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Users className="w-3.5 h-3.5" />
              By Faculty
            </button>
            <button
              onClick={() => setFilterMode('room')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${filterMode === 'room' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              By Room
            </button>
          </div>

          {/* Dynamic Dropdown */}
          {filterMode === 'group' && (
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 transition"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.id}) - {g.size} students
                </option>
              ))}
            </select>
          )}

          {filterMode === 'faculty' && (
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 transition max-w-xs"
            >
              {faculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.id}) - {f.department}
                </option>
              ))}
            </select>
          )}

          {filterMode === 'room' && (
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 transition"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.id}) - Cap: {r.capacity}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Timetable Matrix Grid */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse min-w-[950px] text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-3 text-left font-cinzel font-bold text-amber-400 bg-slate-900/80 rounded-tl-xl w-24">
                Day
              </th>
              {PERIODS.slice(0, 5).map(p => (
                <th key={p.id} className="p-2 text-center font-semibold text-slate-300 bg-slate-900/60 border-l border-slate-800/80">
                  <div>P{p.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.time}</div>
                </th>
              ))}
              {/* Lunch Divider Header */}
              <th className="p-2 text-center font-bold text-amber-500/80 bg-amber-500/10 border-l border-r border-amber-500/20 w-16">
                <div className="text-[10px] uppercase tracking-wider">Lunch</div>
                <div className="text-[9px] text-amber-400/80 font-mono">13:00-14:00</div>
              </th>
              {PERIODS.slice(5).map(p => (
                <th key={p.id} className="p-2 text-center font-semibold text-slate-300 bg-slate-900/60 border-l border-slate-800/80">
                  <div>P{p.id}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day} className="border-b border-slate-800/60 hover:bg-slate-900/30 transition">
                <td className="p-3 font-cinzel font-bold text-slate-200 bg-slate-900/40 border-r border-slate-800">
                  {day}
                </td>

                {/* Periods 1 to 5 */}
                {[1, 2, 3, 4, 5].map(pId => {
                  const cell = gridMap[`${day}-${pId}`];
                  if (!cell) {
                    return (
                      <td key={pId} className="p-1.5 border-r border-slate-800/40 text-center text-slate-600 bg-slate-950/40">
                        <span className="text-[10px] opacity-40">-</span>
                      </td>
                    );
                  }

                  const s = cell.session;
                  return (
                    <td key={pId} className="p-1.5 border-r border-slate-800/40 align-top">
                      <div
                        onClick={() => onExplainSession && onExplainSession(s.session_id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer shadow-md ${getKindColor(s.kind)}`}
                        title="Click to view Explainable AI reasoning"
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>{s.course_id}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-black/30 uppercase font-mono">
                            {s.kind}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-90 mt-1 truncate">
                          {s.room_id} · {s.faculty_id}
                        </div>
                        {s.basket_slot && (
                          <div className="text-[9px] mt-1 px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                            Basket: {s.basket_slot}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}

                {/* Lunch Divider */}
                <td className="p-1 bg-amber-500/5 border-r border-amber-500/20 text-center">
                  <div className="text-[10px] text-amber-500/40 font-mono select-none">
                    |
                  </div>
                </td>

                {/* Periods 6 to 9 */}
                {[6, 7, 8, 9].map(pId => {
                  const cell = gridMap[`${day}-${pId}`];
                  if (!cell) {
                    return (
                      <td key={pId} className="p-1.5 border-r border-slate-800/40 text-center text-slate-600 bg-slate-950/40">
                        <span className="text-[10px] opacity-40">-</span>
                      </td>
                    );
                  }

                  const s = cell.session;
                  return (
                    <td key={pId} className="p-1.5 border-r border-slate-800/40 align-top">
                      <div
                        onClick={() => onExplainSession && onExplainSession(s.session_id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer shadow-md ${getKindColor(s.kind)}`}
                        title="Click to view Explainable AI reasoning"
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>{s.course_id}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-black/30 uppercase font-mono">
                            {s.kind}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-90 mt-1 truncate">
                          {s.room_id} · {s.faculty_id}
                        </div>
                        {s.basket_slot && (
                          <div className="text-[9px] mt-1 px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                            Basket: {s.basket_slot}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid Legend & Help */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/60 border border-blue-400" />
            <span>Lecture (1h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400" />
            <span>Tutorial (1h)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500/60 border border-purple-400" />
            <span>Lab Block (3h - P2 or P6)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Click any scheduled session card to open Explainable AI analysis</span>
        </div>
      </div>
    </div>
  );
}
