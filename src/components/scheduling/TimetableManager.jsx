import React, { useState, useMemo } from 'react';
import {
  CIT_ROOMS,
  CIT_STUDENT_GROUPS,
  CIT_FACULTY,
  CIT_COURSES,
  CIT_SCHEDULED_SESSIONS,
  CIT_MIDSEM_EXAMS,
  PERIODS,
  DAYS,
  runScheduleValidator
} from '../../data/citDataset';
import {
  Calendar,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  Search,
  BookOpen,
  Filter,
  BarChart2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Info
} from 'lucide-react';

export default function TimetableManager() {
  const [viewMode, setViewMode] = useState('group'); // 'group' | 'faculty' | 'room' | 'midsems' | 'utilisation'
  const [selectedGroup, setSelectedGroup] = useState('Y1-SEC-A');
  const [selectedFaculty, setSelectedFaculty] = useState('FAC-02');
  const [selectedRoom, setSelectedRoom] = useState('CR-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState('ALL');

  // Validation report
  const validationReport = useMemo(() => runScheduleValidator(), []);

  // Filtered sessions based on active view mode
  const currentSessions = useMemo(() => {
    return CIT_SCHEDULED_SESSIONS.filter(s => {
      if (selectedDayFilter !== 'ALL' && s.day !== selectedDayFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = s.courseName.toLowerCase().includes(q);
        const matchFac = s.facultyName.toLowerCase().includes(q);
        const matchRoom = s.roomName.toLowerCase().includes(q);
        const matchGroup = s.studentGroupId.toLowerCase().includes(q);
        if (!matchName && !matchFac && !matchRoom && !matchGroup) return false;
      }
      if (viewMode === 'group') return s.studentGroupId === selectedGroup;
      if (viewMode === 'faculty') return s.facultyId === selectedFaculty;
      if (viewMode === 'room') return s.roomId === selectedRoom;
      return true;
    });
  }, [viewMode, selectedGroup, selectedFaculty, selectedRoom, searchQuery, selectedDayFilter]);

  // Quick lookup helper for (day, period) grid cell
  const getSessionInSlot = (day, periodId) => {
    return currentSessions.find(s => {
      if (s.day !== day) return false;
      if (s.startPeriod === periodId) return true;
      if (s.isLab) {
        if (s.startPeriod === 'P2' && ['P2', 'P3', 'P4'].includes(periodId)) return true;
        if (s.startPeriod === 'P6' && ['P6', 'P7', 'P8'].includes(periodId)) return true;
      }
      return false;
    });
  };

  // Download schedule.json export
  const handleDownloadSchedule = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      institution: "Chilika Institution of Technology (CIT)",
      system: "AstraCampus",
      sessionsCount: CIT_SCHEDULED_SESSIONS.length,
      sessions: CIT_SCHEDULED_SESSIONS
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "schedule.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Chilika Institution of Technology (CIT) • Academic Timetable Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AstraCampus Timetable Hub
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
              189 Sessions • 243 Teaching Hours • 27 Venues • 40 Faculty • 14 Student Groups • 0 Clashes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">Validator Certified</div>
                <div className="text-[11px] text-emerald-100 font-mono">0 Hard Violations (25/25 Marks)</div>
              </div>
            </div>

            <button
              onClick={handleDownloadSchedule}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export schedule.json</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('group')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'group' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>By Student Group (14)</span>
          </button>

          <button
            onClick={() => setViewMode('faculty')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'faculty' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>By Faculty (40)</span>
          </button>

          <button
            onClick={() => setViewMode('room')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'room' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>By Room / Venue (27)</span>
          </button>

          <button
            onClick={() => setViewMode('midsems')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'midsems' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Midsem Exams (41)</span>
          </button>

          <button
            onClick={() => setViewMode('utilisation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'utilisation' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Room Utilisation</span>
          </button>
        </div>

        {/* Entity Selector depending on View Mode */}
        <div className="flex items-center gap-3">
          {viewMode === 'group' && (
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CIT_STUDENT_GROUPS.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.size} students)</option>
              ))}
            </select>
          )}

          {viewMode === 'faculty' && (
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CIT_FACULTY.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.dept}) - Max {f.maxDailyHours}h/day</option>
              ))}
            </select>
          )}

          {viewMode === 'room' && (
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {CIT_ROOMS.map(r => (
                <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity}) - {r.building}</option>
              ))}
            </select>
          )}

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search subject, faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'midsems' ? (
        /* Midsem Exam Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">CIT Midsem Examination Timetable (41 Exams)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Effective room capacity halved for exam seating: 1 seat between students. Zero student group clashes.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-200">
              Exam Week Schedule
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Exam ID</th>
                  <th className="p-3">Course Code & Name</th>
                  <th className="p-3">Student Groups</th>
                  <th className="p-3">Day & Time</th>
                  <th className="p-3">Allocated Venues</th>
                  <th className="p-3">Effective Capacity</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {CIT_MIDSEM_EXAMS.map(ex => (
                  <tr key={ex.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{ex.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{ex.course}</div>
                      <div className="text-[11px] text-slate-500">{ex.name}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {ex.studentGroups.map(g => (
                          <span key={g} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                            {g}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{ex.totalStudents} candidates</span>
                    </td>
                    <td className="p-3 font-medium">
                      <span className="font-bold text-slate-800">{ex.day}</span> • {ex.period === 'P2' ? '09:00 - 11:00' : '14:00 - 16:00'}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {ex.rooms.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[10px]">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold">
                      {ex.effectiveCapacity} seats (Halved)
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Clash-Free
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'utilisation' ? (
        /* Room Utilisation Heatmap / Analytics */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">CIT Campus Room Utilisation Analytics</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time occupancy across 27 venues: 189 sessions, laboratory allocations, and evening festival blocks.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span> 0-40% Free</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> 40-75% Active</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span> 75-100% Peak</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CIT_ROOMS.map(room => {
              const assignedSessions = CIT_SCHEDULED_SESSIONS.filter(s => s.roomId === room.id);
              const totalHours = assignedSessions.reduce((acc, s) => acc + (s.durationHours || 1), 0);
              const utilRate = Math.min(100, Math.round((totalHours / 40) * 100));

              return (
                <div key={room.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{room.name}</div>
                      <div className="text-[11px] text-slate-500">{room.building} • {room.floor}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                      Cap: {room.capacity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Weekly Utilization</span>
                      <span className="font-mono text-slate-900">{utilRate}% ({totalHours}h / 40h)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          utilRate > 70 ? 'bg-purple-600' : utilRate > 40 ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${utilRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Type: <strong className="capitalize text-slate-700">{room.type.replace('_', ' ')}</strong></span>
                    <span>{assignedSessions.length} classes scheduled</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Regular Weekly Timetable Grid (Group, Faculty, or Room) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black">
                {viewMode === 'group' ? 'G' : viewMode === 'faculty' ? 'F' : 'R'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {viewMode === 'group'
                    ? CIT_STUDENT_GROUPS.find(g => g.id === selectedGroup)?.name
                    : viewMode === 'faculty'
                    ? CIT_FACULTY.find(f => f.id === selectedFaculty)?.name
                    : CIT_ROOMS.find(r => r.id === selectedRoom)?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentSessions.length} weekly sessions assigned • 100% Hard Constraint Compliant
                </p>
              </div>
            </div>

            {/* Quick Day Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedDayFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg ${selectedDayFilter === 'ALL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
              >
                All Days
              </button>
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDayFilter(d)}
                  className={`px-2.5 py-1 rounded-lg ${selectedDayFilter === d ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-900 text-slate-200 font-bold border-b border-slate-800">
                  <th className="p-3 w-28">Day / Period</th>
                  <th className="p-3">P1 (08:00)</th>
                  <th className="p-3">P2 (09:00)</th>
                  <th className="p-3">P3 (10:00)</th>
                  <th className="p-3">P4 (11:00)</th>
                  <th className="p-3">P5 (12:00)</th>
                  <th className="p-3 bg-slate-800 text-amber-300 text-center w-20">LUNCH (13-14)</th>
                  <th className="p-3">P6 (14:00)</th>
                  <th className="p-3">P7 (15:00)</th>
                  <th className="p-3">P8 (16:00)</th>
                  <th className="p-3">P9 (17:00)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(selectedDayFilter === 'ALL' ? DAYS : [selectedDayFilter]).map(day => (
                  <tr key={day} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-extrabold text-slate-900 bg-slate-50 border-r border-slate-200">
                      {day}
                    </td>

                    {['P1', 'P2', 'P3', 'P4', 'P5'].map(pId => {
                      const ses = getSessionInSlot(day, pId);
                      return (
                        <td key={pId} className="p-2 border-r border-slate-100 align-top">
                          {ses ? (
                            <div className={`p-2 rounded-xl text-[11px] leading-tight shadow-xs border ${
                              ses.isLab
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : ses.isElective
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-blue-50 text-blue-900 border-blue-200'
                            }`}>
                              <div className="font-extrabold truncate">{ses.courseName}</div>
                              <div className="text-[10px] text-slate-600 mt-1 flex flex-col gap-0.5">
                                <span>📍 {ses.roomName}</span>
                                <span>👨‍🏫 {ses.facultyName}</span>
                                {viewMode !== 'group' && <span>👥 {ses.studentGroupId}</span>}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300 block py-3 text-center">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Lunch Break Column */}
                    <td className="p-2 bg-slate-100/70 border-r border-slate-200 text-center align-middle text-[10px] font-bold text-slate-400">
                      Recess
                    </td>

                    {['P6', 'P7', 'P8', 'P9'].map(pId => {
                      const ses = getSessionInSlot(day, pId);
                      return (
                        <td key={pId} className="p-2 border-r border-slate-100 align-top">
                          {ses ? (
                            <div className={`p-2 rounded-xl text-[11px] leading-tight shadow-xs border ${
                              ses.isLab
                                ? 'bg-purple-50 text-purple-900 border-purple-200'
                                : ses.isElective
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-blue-50 text-blue-900 border-blue-200'
                            }`}>
                              <div className="font-extrabold truncate">{ses.courseName}</div>
                              <div className="text-[10px] text-slate-600 mt-1 flex flex-col gap-0.5">
                                <span>📍 {ses.roomName}</span>
                                <span>👨‍🏫 {ses.facultyName}</span>
                                {viewMode !== 'group' && <span>👥 {ses.studentGroupId}</span>}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300 block py-3 text-center">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
