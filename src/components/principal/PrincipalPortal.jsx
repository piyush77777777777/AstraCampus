import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { Building2, AlertTriangle, Sparkles } from 'lucide-react';

export default function PrincipalPortal() {
  const { complaints } = useCampus();

  const deptStats = [
    { dept: 'Computer Science & Engg.', students: 240, avgAttendance: 83, complaints: 12, resolved: 10 },
    { dept: 'Electrical Engineering', students: 180, avgAttendance: 79, complaints: 8, resolved: 7 },
    { dept: 'Mechanical Engineering', students: 200, avgAttendance: 76, complaints: 15, resolved: 11 },
    { dept: 'Civil Engineering', students: 160, avgAttendance: 81, complaints: 5, resolved: 5 }
  ];

  const escalated = complaints.filter(c => c.status === 'ESCALATED');
  const resolved = complaints.filter(c => c.status === 'RESOLVED');
  const totalStudents = deptStats.reduce((s, d) => s + d.students, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-500/30 mb-3">
            <Building2 className="w-3.5 h-3.5" /><span>Principal & Director's Command View</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Welcome, Prof. D. K. Mishra 🎓</h2>
          <p className="text-sm text-rose-100/80 mt-1">Principal & Director • Office of the Principal</p>
          <div className="grid grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-center">
            {[
              { label: 'Total Students', value: totalStudents, color: 'text-white' },
              { label: 'Avg Attendance', value: '80%', color: 'text-emerald-300' },
              { label: 'Escalated Issues', value: escalated.length, color: 'text-rose-300' },
              { label: 'Resolved Tickets', value: resolved.length, color: 'text-blue-300' }
            ].map((kpi, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="text-[10px] text-rose-200">{kpi.label}</div>
                <div className={`text-xl font-black ${kpi.color} mt-0.5`}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900">Department-wise Performance Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Attendance compliance and complaint resolution rates per department</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Students</th>
                <th className="py-2.5 px-3">Avg Attendance</th>
                <th className="py-2.5 px-3">Complaints</th>
                <th className="py-2.5 px-3">Resolution Rate</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptStats.map((d, i) => {
                const resRate = Math.round((d.resolved / d.complaints) * 100);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{d.dept}</td>
                    <td className="py-3 px-3 text-slate-700">{d.students}</td>
                    <td className="py-3 px-3">
                      <span className={`font-extrabold ${d.avgAttendance >= 80 ? 'text-emerald-700' : d.avgAttendance >= 75 ? 'text-amber-700' : 'text-rose-700'}`}>{d.avgAttendance}%</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{d.complaints} filed</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full">
                          <div className={`h-1.5 rounded-full ${resRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${resRate}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{resRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.avgAttendance >= 80 ? 'bg-emerald-100 text-emerald-700' : d.avgAttendance >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {d.avgAttendance >= 80 ? 'Excellent' : d.avgAttendance >= 75 ? 'Satisfactory' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {escalated.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-rose-200 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900">Escalated Issues Requiring Principal Intervention</h3>
          </div>
          {escalated.map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-600">{c.id}</span>
                  <div className="font-bold text-slate-900">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.location} • {c.reportedDaysAgo} days old</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">{c.status}</span>
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all">
                Issue Principal Directive
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-xs text-blue-900">
          <strong>Campus Intelligence Summary:</strong> Overall campus attendance stands at 80%, above the mandatory 75% cutoff. Mechanical Engineering requires attention. 92% of filed complaints resolved within SLA this month — highest performance record.
        </div>
      </div>
    </div>
  );
}
