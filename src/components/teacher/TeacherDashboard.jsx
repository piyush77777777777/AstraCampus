import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { BookOpen, Users, CheckCircle2, AlertTriangle, Clock, Send } from 'lucide-react';

export default function TeacherDashboard() {
  const { currentPersona } = useCampus();
  const [activeTab, setActiveTab] = useState('overview');
  const [leaveForm, setLeaveForm] = useState({ reason: '', date: '', type: 'Sick Leave', substitute: '' });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const classes = currentPersona.classes || [
    { code: 'CST301', name: 'Operating Systems', section: 'CSE-A', totalStudents: 60, avgAttendance: 82 },
    { code: 'CST303', name: 'Design & Analysis of Algorithms', section: 'CSE-B', totalStudents: 58, avgAttendance: 76 },
    { code: 'CST401', name: 'Machine Learning', section: 'CSE-A', totalStudents: 55, avgAttendance: 88 }
  ];

  const lowAtt = [
    { name: 'Rohan Samal', regNo: '2201106098', subject: 'CST303', attendance: 68, room: 'A-112' },
    { name: 'Priya Dash', regNo: '2201106201', subject: 'CST301', attendance: 71, room: 'KC-305' },
    { name: 'Amit Jena', regNo: '2201106312', subject: 'CST303', attendance: 72, room: 'B-108' }
  ];

  const schedule = [
    { time: '9:00 AM', subject: 'Operating Systems', section: 'CSE-A', room: 'Room 401', done: true },
    { time: '11:00 AM', subject: 'Algorithms', section: 'CSE-B', room: 'Room 302', done: true },
    { time: '2:00 PM', subject: 'Machine Learning Lab', section: 'CSE-A', room: 'CS Lab 3', done: false },
    { time: '4:00 PM', subject: 'Office Hours', section: 'All', room: 'Staff Room 2', done: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-500/30 mb-3">
            <BookOpen className="w-3.5 h-3.5" /><span>Faculty Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome, {currentPersona.name} 📚</h2>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-1.5">{currentPersona.title} • {currentPersona.department}</p>
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-purple-200">Classes Today</div>
              <div className="text-xl font-extrabold text-white mt-0.5">{schedule.length}</div>
              <div className="text-[10px] text-emerald-400 font-bold">{schedule.filter(c => c.done).length} Completed</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-purple-200">Total Students</div>
              <div className="text-xl font-extrabold text-white mt-0.5">{classes.reduce((s, c) => s + c.totalStudents, 0)}</div>
              <div className="text-[10px] text-blue-300 font-bold">{classes.length} Sections</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-purple-200">Low Attendance</div>
              <div className="text-xl font-extrabold text-rose-300 mt-0.5">{lowAtt.length}</div>
              <div className="text-[10px] text-rose-300 font-bold">Below 75% cutoff</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {[['overview','Overview'],['schedule','Schedule'],['attendance','Low Attendance'],['leave','Leave Request']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map(cls => (
            <div key={cls.code} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{cls.code}</span>
                  <h4 className="font-bold text-slate-900 mt-1 text-sm">{cls.name}</h4>
                  <p className="text-xs text-slate-500">{cls.section} • {cls.totalStudents} students</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${cls.avgAttendance >= 80 ? 'bg-emerald-100 text-emerald-700' : cls.avgAttendance >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  {cls.avgAttendance}%
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${cls.avgAttendance >= 80 ? 'bg-emerald-500' : cls.avgAttendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${cls.avgAttendance}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900">Today's Class Schedule</h3>
          {schedule.map((cls, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${cls.done ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.done ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                {cls.done ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">{cls.subject}</div>
                <div className="text-[11px] text-slate-500">{cls.section} • {cls.room}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-700">{cls.time}</div>
                <div className={`text-[10px] font-bold ${cls.done ? 'text-emerald-600' : 'text-blue-600'}`}>{cls.done ? 'Done' : 'Upcoming'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900">Students Below 75% Attendance</h3>
            <p className="text-xs text-slate-500 mt-0.5">These students risk exam debarment. Send automated alert.</p>
          </div>
          {lowAtt.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/40 border border-rose-200">
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                <div className="text-[11px] text-slate-500">{s.regNo} • Room {s.room} • {s.subject}</div>
              </div>
              <div className="text-right mr-3">
                <div className="text-base font-black text-rose-700">{s.attendance}%</div>
                <div className="text-[10px] text-rose-600 font-bold">-{75 - s.attendance}% below</div>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all">Alert</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5 max-w-lg">
          {leaveSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900">Leave Request Submitted!</h3>
              <p className="text-xs text-slate-500">Sent to Principal & HOD for approval. Class reassignment notification dispatched.</p>
              <button onClick={() => setLeaveSubmitted(false)} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">Submit Another</button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-slate-900">Faculty Leave Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
                  <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none">
                    <option>Sick Leave</option><option>Casual Leave</option><option>Emergency Leave</option>
                    <option>Conference / Workshop</option><option>Academic Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Absence</label>
                  <input type="date" value={leaveForm.date} onChange={e => setLeaveForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Substitute Arrangement</label>
                  <input type="text" placeholder="e.g. Dr. Rajan Panda will cover OS class" value={leaveForm.substitute}
                    onChange={e => setLeaveForm(p => ({ ...p, substitute: e.target.value }))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason *</label>
                  <textarea rows={3} placeholder="Brief reason..." value={leaveForm.reason}
                    onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
                </div>
                <button onClick={() => leaveForm.reason && leaveForm.date && setLeaveSubmitted(true)}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/20">
                  <Send className="w-4 h-4" /> Submit Leave Request to HOD & Principal
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
