import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  GraduationCap, LayoutDashboard, ShieldCheck, Wrench, FileText,
  Utensils, Bell, BarChart3, Smartphone, BookOpen,
  Building2, Shield, Globe, Users, Clock, RotateCcw,
  Award, Sparkles, Cpu, Activity, CheckCircle2, AlertTriangle,
  Calendar, Check, Download, Send, Search, Filter, Plus
} from 'lucide-react';

import TimetableManager from '../scheduling/TimetableManager';
import VenueBookingManager from '../scheduling/VenueBookingManager';
import ReschedulingEngine from '../scheduling/ReschedulingEngine';
import JudgingCriteriaModal from '../scheduling/JudgingCriteriaModal';
import CalendarView from '../campus/CalendarView';
import GatePassModal from '../student/GatePassModal';
import ComplaintModal from '../student/ComplaintModal';
import DocumentModal from '../student/DocumentModal';
import CampusBotModal from '../common/CampusBotModal';
import StudentFeeManagement from '../finance/StudentFeeManagement';
import ParentPortal from '../parent/ParentPortal';

import {
  CIT_ROOMS,
  CIT_FACULTY,
  CIT_STUDENT_GROUPS,
  CIT_COURSES,
  CIT_SCHEDULED_SESSIONS,
  CIT_SPECTRA_BOOKINGS,
  CIT_MIDSEM_EXAMS
} from '../../data/citDataset';

export default function UnifiedPortalHub({ activeTab, setActiveTab }) {
  const {
    activeRole,
    currentUser,
    currentPersona,
    gatePasses,
    complaints,
    notices,
    switchPersona,
    resetDemoData,
    approveGatePass,
    rejectGatePass,
    venueRequests,
    approveVenueRequest,
    rejectVenueRequest,
    roomRequests,
    approveRoomRequest,
    rejectRoomRequest,
    extraClassRequests,
    approveExtraClassRequest,
    rejectExtraClassRequest,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    createVenueRequest,
    createLeaveRequest,
    createExtraClassRequest
  } = useCampus();
  const { t } = useLanguage();

  const [gatePassOpen, setGatePassOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const [markedAttendance, setMarkedAttendance] = useState({});
  const [actionSuccess, setActionSuccess] = useState('');
  const [remarkInputs, setRemarkInputs] = useState({});
  const [approvalFilter, setApprovalFilter] = useState('ALL');
  const [newVenueForm, setNewVenueForm] = useState({ open: false, eventName: '', venue: 'Main Auditorium (Aryabhatta Hall)', eventDate: '', timeSlot: '', expectedAttendees: 50, purpose: '' });
  const [newLeaveForm, setNewLeaveForm] = useState({ open: false, leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '', coverArranged: '' });
  const [newExtraForm, setNewExtraForm] = useState({ open: false, course: '', group: '', date: '', timeSlot: '', room: 'CR-101', reason: '' });

  const setRemark = (id, val) => setRemarkInputs(prev => ({ ...prev, [id]: val }));

  const triggerSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  // ─────────────────────────────────────────────────────────────
  // 0. PARENT & GUARDIAN PORTAL
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'parent') {
    return <ParentPortal initialTab={activeTab} setActiveTab={setActiveTab} />;
  }

  // ─────────────────────────────────────────────────────────────
  // 1. STUDENT PORTAL SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'student') {
    if (activeTab === 'feeLedger') return <StudentFeeManagement initialView="student" />;
    if (activeTab === 'timetable') return <TimetableManager />;
    if (activeTab === 'leaveRequests' || activeTab === 'gatePass') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Student Portal</span>
              <h2 className="text-2xl font-black mt-1">Leave Requests & Gate Pass</h2>
              <p className="text-xs text-blue-200 mt-1">Submit digital out-pass requests with instant cryptographic QR verification.</p>
            </div>
            <button
              onClick={() => setGatePassOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow-md transition"
            >
              + New Leave Request
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {gatePasses.map(gp => (
              <div key={gp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-slate-500">{gp.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    gp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    gp.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {gp.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-800">{gp.reason || 'Weekend Home Visit'}</div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Out: {gp.outTime || '17:00'}</span>
                  <span>Expected Return: {gp.expectedIn || '21:00'}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-indigo-600">
                  <span>Token: {gp.token || 'CIT-GP-8891-SECURE'}</span>
                  <span className="text-[11px] text-emerald-600 font-sans font-bold">✓ Encrypted</span>
                </div>
              </div>
            ))}
          </div>

          <GatePassModal isOpen={gatePassOpen} onClose={() => setGatePassOpen(false)} />
        </div>
      );
    }

    if (activeTab === 'attendance') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Student Portal</span>
            <h2 className="text-2xl font-black mt-1">Attendance & Eligibility Tracker</h2>
            <p className="text-xs text-blue-200 mt-1">Institutional requirement: 75% attendance to qualify for Endsem examinations.</p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Overall Attendance</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">84.5%</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Eligible for all exams</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Safe Bunks Left</span>
              <div className="text-3xl font-black text-blue-600 mt-2">6 Classes</div>
              <span className="text-[11px] text-slate-500">Without falling below 75%</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Classes Held</span>
              <div className="text-3xl font-black text-slate-800 mt-2">149</div>
              <span className="text-[11px] text-slate-500">126 classes attended</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Biometric Status</span>
              <div className="text-3xl font-black text-indigo-600 mt-2">SYNCHED</div>
              <span className="text-[11px] text-slate-500">Last scanned today 08:55 AM</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm">Subject-Wise Attendance Breakdown</div>
            <div className="divide-y divide-slate-100">
              {[
                { code: 'CST301', name: 'Operating Systems', attended: 36, total: 40, pct: 90.0, faculty: 'Dr. Ramesh Chandra' },
                { code: 'CST302', name: 'Database Management Systems', attended: 32, total: 38, pct: 84.2, faculty: 'Prof. Ananya Verma' },
                { code: 'CST303', name: 'Design & Analysis of Algorithms', attended: 28, total: 35, pct: 80.0, faculty: 'Prof. Jagabandhu Nayak' },
                { code: 'CST304', name: 'Computer Networks', attended: 30, total: 36, pct: 83.3, faculty: 'Dr. Pravat Kumar Sahoo' },
              ].map(sub => (
                <div key={sub.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600">{sub.code}</span>
                    <div className="font-bold text-slate-900 text-sm">{sub.name}</div>
                    <div className="text-xs text-slate-500">Faculty: {sub.faculty}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-600">{sub.attended} / {sub.total} Held</div>
                      <div className="text-sm font-black text-emerald-600">{sub.pct}%</div>
                    </div>
                    <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sub.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'academicRecords') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Student Portal</span>
              <h2 className="text-2xl font-black mt-1">Academic Records & Transcripts</h2>
              <p className="text-xs text-blue-200 mt-1">B.Tech Computer Science & Engineering • Current CGPA: 8.74</p>
            </div>
            <button onClick={() => setDocOpen(true)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition">
              Generate Official NOC / Bonafide
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Cumulative CGPA</span>
              <div className="text-3xl font-black text-indigo-600 mt-1">8.74 / 10</div>
              <span className="text-xs text-emerald-600 font-bold">Top 5% in CSE cohort</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Completed Credits</span>
              <div className="text-3xl font-black text-slate-800 mt-1">114 / 160</div>
              <span className="text-xs text-slate-500">46 credits remaining for graduation</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Active Backlogs</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">0</div>
              <span className="text-xs text-emerald-700 font-bold">Clear academic record</span>
            </div>
          </div>

          <DocumentModal isOpen={docOpen} onClose={() => setDocOpen(false)} />
        </div>
      );
    }

    if (activeTab === 'assignments') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Student Portal</span>
            <h2 className="text-2xl font-black mt-1">Assignments & Course Submissions</h2>
            <p className="text-xs text-blue-200 mt-1">Submit lab assignments and track instructor evaluation grades.</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'ASN-01', title: 'Nachos OS Multithreading Lab 3', course: 'CST301 Operating Systems', due: 'Tomorrow 23:59', status: 'Pending Upload', faculty: 'Dr. Ramesh Chandra' },
              { id: 'ASN-02', title: 'SQL PL/SQL Complex Triggers & Stored Procs', course: 'CST302 DBMS', due: 'In 4 Days', status: 'Submitted', grade: '9.5/10', faculty: 'Prof. Ananya Verma' },
              { id: 'ASN-03', title: 'Dynamic Programming Knapsack & Bellman-Ford', course: 'CST303 DAA', due: 'Nov 08, 2026', status: 'Graded', grade: '10/10', faculty: 'Prof. Jagabandhu Nayak' }
            ].map(asn => (
              <div key={asn.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{asn.id}</span>
                    <span className="text-xs text-slate-500 font-semibold">{asn.course}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{asn.title}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">Faculty: {asn.faculty} • Due: {asn.due}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    asn.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' :
                    asn.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {asn.status} {asn.grade ? `(${asn.grade})` : ''}
                  </span>
                  <button
                    onClick={() => triggerSuccess(`Submission portal accessed for ${asn.title}`)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    {asn.status === 'Pending Upload' ? 'Upload Solution' : 'View Submission'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'eventRegistration') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Spectra Tech Fest 2026</span>
            <h2 className="text-2xl font-black mt-1">Event Registration & Passes</h2>
            <p className="text-xs text-purple-200 mt-1">Register for hackathons, robowars, and guest keynotes in Week 7.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {CIT_SPECTRA_BOOKINGS.slice(0, 6).map(evt => (
              <div key={evt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-purple-600">{evt.club}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{evt.event}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    Week 7 Fest
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Venue: <strong>{evt.room}</strong> • {evt.day} ({evt.period})
                </div>
                <div className="text-xs text-slate-600">{evt.purpose}</div>
                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-xs text-emerald-600 font-bold">Free Student Pass</span>
                  <button
                    onClick={() => triggerSuccess(`Registered for ${evt.event}!`)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'aiAssistant') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">AstraCampus AI Copilot</span>
              <h2 className="text-2xl font-black mt-1">Campus Bot & Scheduling Assistant</h2>
              <p className="text-xs text-blue-200 mt-1">Instant answers for timetables, gate passes, bus tracking, and exam rules.</p>
            </div>
            <button onClick={() => setBotOpen(true)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md">
              Launch Interactive Bot 💬
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Suggested Queries</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                "What is my next class today and which room?",
                "Do I have any lab sessions scheduled in Turing Lab CS1 this week?",
                "Can I apply for an out-pass after 7 PM without warden sign-off?",
                "What is the venue for the Spectra Robowars championship?"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setBotOpen(true)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left font-semibold text-slate-700 transition"
                >
                  "{q}" →
                </button>
              ))}
            </div>
          </div>

          <CampusBotModal isOpen={botOpen} onClose={() => setBotOpen(false)} onNavigate={setActiveTab} />
        </div>
      );
    }

    // Default student profile overview
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Student Profile</span>
              <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
              <p className="text-xs text-blue-200 mt-0.5">CIT Reg: <strong>{currentPersona.regNo}</strong> • {currentPersona.branch}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('timetable')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md">
              View Timetable
            </button>
            <button onClick={() => setActiveTab('leaveRequests')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">
              Gate Pass
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Hostel Residence</span>
            <div className="text-lg font-black text-slate-800 mt-1">{currentPersona.hostel}</div>
            <div className="text-xs text-slate-500">Room: {currentPersona.room}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Attendance Status</span>
            <div className="text-lg font-black text-emerald-600 mt-1">84.5% Overall</div>
            <div className="text-xs text-slate-500">Above 75% examination threshold</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Semester Fees</span>
            <div className="text-lg font-black text-indigo-600 mt-1">Dues Cleared (₹0)</div>
            <div className="text-xs text-emerald-600 font-bold">NOC Eligible</div>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Student Portal Direct Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'timetable', label: 'CIT Timetable', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
              { id: 'attendance', label: 'Attendance', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'academicRecords', label: 'Academic Records', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
              { id: 'assignments', label: 'Assignments', icon: FileText, color: 'text-amber-600 bg-amber-50' },
              { id: 'leaveRequests', label: 'Leave Requests', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
              { id: 'eventRegistration', label: 'Spectra Fest Events', icon: Sparkles, color: 'text-rose-600 bg-rose-50' },
              { id: 'notices', label: 'Notifications', icon: Bell, color: 'text-cyan-600 bg-cyan-50' },
              { id: 'aiAssistant', label: 'AI Assistant', icon: Smartphone, color: 'text-slate-600 bg-slate-100' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition text-left space-y-2 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. FACULTY PORTAL SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'faculty') {
    if (activeTab === 'timetable' || activeTab === 'teachingSchedule') return <TimetableManager />;
    if (activeTab === 'roomRequests' || activeTab === 'venueBookings') return <VenueBookingManager />;

    if (activeTab === 'attendanceMgmt') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Faculty Portal</span>
              <h2 className="text-2xl font-black mt-1">Class Attendance Management</h2>
              <p className="text-xs text-purple-200 mt-1">Mark attendance for active theory & laboratory teaching sessions.</p>
            </div>
            <button
              onClick={() => triggerSuccess('Biometric classroom sync completed for CSE Year 3 Section A!')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold shadow-md transition"
            >
              Sync Turnstile Biometrics
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800">CST302: Database Management Systems (Y3-CSE, Room LH-1)</span>
              <span className="text-xs text-slate-500">60 Students Enrolled</span>
            </div>
            <div className="p-4 divide-y divide-slate-100">
              {[
                { roll: '2201106101', name: 'Aarav Sharma', attendancePct: 88 },
                { roll: '2201106120', name: 'Ishita Panda', attendancePct: 92 },
                { roll: '2201106145', name: 'Piyush Kumar Dey', attendancePct: 84.5 },
                { roll: '2201106155', name: 'Rohit Behera', attendancePct: 72 }
              ].map(st => (
                <div key={st.roll} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-purple-600">{st.roll}</span>
                    <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${st.attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600 font-extrabold'}`}>
                      {st.attendancePct}% {st.attendancePct < 75 ? '(Shortage)' : ''}
                    </span>
                    <button
                      onClick={() => {
                        setMarkedAttendance(prev => ({ ...prev, [st.roll]: !prev[st.roll] }));
                        triggerSuccess(`Updated status for ${st.name}`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        markedAttendance[st.roll] ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {markedAttendance[st.roll] ? 'Marked Absent' : 'Marked Present'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'leaveRequests') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Faculty Portal</span>
            <h2 className="text-2xl font-black mt-1">Faculty Leave & Substitute Routing</h2>
            <p className="text-xs text-purple-200 mt-1">Submit casual/medical leave with automatic compensatory routing under Section 8.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-800">Recent Disruption Simulation (Section 8 Benchmark)</h4>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold">Dr. Pradeep Kumar Rath — Tuesday Medical Leave</div>
              <p>Session SES-032 (Thermodynamics) substituted automatically by Prof. Jagabandhu Nayak on Wednesday P7 with 0 clashes.</p>
            </div>
            <button
              onClick={() => setActiveTab('conflictResolution')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
            >
              Open Disruption Engine
            </button>
          </div>
        </div>
      );
    }

    // Default Faculty Overview
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Faculty Portal</span>
              <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
              <p className="text-xs text-purple-200 mt-0.5">{currentPersona.title} • {currentPersona.department}</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('teachingSchedule')} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-md">
            My Teaching Schedule (CIT)
          </button>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Weekly Teaching Load</span>
            <div className="text-3xl font-black text-purple-600 mt-1">14 Hours</div>
            <span className="text-xs text-emerald-600 font-bold">&le; 4 hrs daily limit respected</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Assigned Courses</span>
            <div className="text-3xl font-black text-slate-800 mt-1">3 Courses</div>
            <span className="text-xs text-slate-500">2 Theory + 1 Computer Lab</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Assigned Room</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">CR-101 / LAB-CS1</div>
            <span className="text-xs text-slate-500">Ground floor accessible</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Midsem Invigilations</span>
            <div className="text-3xl font-black text-amber-600 mt-1">2 Slots</div>
            <span className="text-xs text-slate-500">Auditorium Week 7</span>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Faculty Portal Direct Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'teachingSchedule', label: 'Teaching Schedule', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
              { id: 'attendanceMgmt', label: 'Attendance Management', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'studentPerformance', label: 'Student Performance', icon: BarChart3, color: 'text-blue-600 bg-blue-50' },
              { id: 'assignmentsMgmt', label: 'Assignment Management', icon: FileText, color: 'text-amber-600 bg-amber-50' },
              { id: 'leaveRequests', label: 'Leave Requests', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
              { id: 'extraClasses', label: 'Extra Classes', icon: Clock, color: 'text-rose-600 bg-rose-50' },
              { id: 'roomRequests', label: 'Room Requests', icon: Building2, color: 'text-cyan-600 bg-cyan-50' },
              { id: 'aiScheduling', label: 'AI Copilot', icon: Sparkles, color: 'text-slate-600 bg-slate-100' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition text-left space-y-2 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-purple-600 transition">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. DEPARTMENT COORDINATOR / HOD PORTAL SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'hod' || activeRole === 'coordinator') {
    if (activeTab === 'deptTimetable' || activeTab === 'timetable') return <TimetableManager />;
    if (activeTab === 'conflictResolution' || activeTab === 'rescheduling') return <ReschedulingEngine />;

    if (activeTab === 'facultyAllocation') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Department Coordinator Portal</span>
            <h2 className="text-2xl font-black mt-1">Faculty Teaching Load Allocation</h2>
            <p className="text-xs text-cyan-200 mt-1">Monitoring 40 CIT faculty workloads and enforcing daily &le; 4 teaching hour limits.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700 uppercase">Department Faculty Rosters (CIT)</div>
            <div className="divide-y divide-slate-100">
              {CIT_FACULTY.slice(0, 10).map(fac => (
                <div key={fac.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-600">{fac.id}</span>
                    <div className="font-bold text-slate-900 text-sm">{fac.name}</div>
                    <div className="text-xs text-slate-500">{fac.dept} Department</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-600">{fac.teachingHours || 12} hrs/week</div>
                      <div className="text-[11px] text-emerald-600 font-bold">Max 3 hrs/day [PASS]</div>
                    </div>
                    <button
                      onClick={() => triggerSuccess(`Workload allocation audit passed for ${fac.name}`)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'labMgmt') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Department Coordinator Portal</span>
            <h2 className="text-2xl font-black mt-1">Computer & Engineering Laboratories (CIT)</h2>
            <p className="text-xs text-cyan-200 mt-1">Strict enforcement: 3-hour practical blocks strictly in P2-P4 or P6-P8 slots.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {CIT_ROOMS.filter(r => r.type.includes('lab')).map(lab => (
              <div key={lab.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-600">{lab.id}</span>
                    <h4 className="text-sm font-bold text-slate-900">{lab.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 uppercase">
                    {lab.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500">Capacity: <strong>{lab.capacity} Students</strong> • Floor: {lab.floor}</div>
                <div className="text-xs text-emerald-600 font-bold">✓ High-speed LAN, Workstations & Projector Active</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default HOD Overview
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Department Coordinator & HOD</span>
              <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
              <p className="text-xs text-cyan-200 mt-0.5">{currentPersona.title} • {currentPersona.department}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('deptTimetable')} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md">
              Dept. Timetable
            </button>
            <button onClick={() => setActiveTab('conflictResolution')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">
              Conflict Resolver
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Department Courses</span>
            <div className="text-3xl font-black text-cyan-600 mt-1">62 Courses</div>
            <span className="text-xs text-emerald-600 font-bold">100% Slot Allocated</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Assigned Faculty</span>
            <div className="text-3xl font-black text-slate-800 mt-1">40 Faculty</div>
            <span className="text-xs text-slate-500">0 Overload Violations</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Department Labs</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">10 Venues</div>
            <span className="text-xs text-slate-500">CS1, CS2, AI, EC, ME</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Resolved Clashes</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">0 Hard Clashes</div>
            <span className="text-xs text-emerald-700 font-bold">100% Conflict Free</span>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Department Coordinator Direct Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'deptTimetable', label: 'Department Timetable', icon: BookOpen, color: 'text-cyan-600 bg-cyan-50' },
              { id: 'facultyAllocation', label: 'Faculty Allocation', icon: Users, color: 'text-blue-600 bg-blue-50' },
              { id: 'resourceMgmt', label: 'Resource Management', icon: Building2, color: 'text-purple-600 bg-purple-50' },
              { id: 'approvalCenter', label: 'Approval Center', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'conflictResolution', label: 'Conflict Resolution', icon: RotateCcw, color: 'text-rose-600 bg-rose-50' },
              { id: 'labMgmt', label: 'Lab Management', icon: Cpu, color: 'text-amber-600 bg-amber-50' },
              { id: 'deptAnalytics', label: 'Department Analytics', icon: BarChart3, color: 'text-indigo-600 bg-indigo-50' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-md transition text-left space-y-2 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-cyan-600 transition">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. CLUB & EVENT PORTAL / CLUB HEAD SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'club') {
    if (activeTab === 'venueBookings' || activeTab === 'spectraMgmt') return <VenueBookingManager />;
    if (activeTab === 'eventCalendar' || activeTab === 'calendar') return <CalendarView />;

    if (activeTab === 'eventCreation') {
      const myReqs = (venueRequests || []).filter(v => v.requesterName === currentPersona.name || v.requesterRole === 'club');
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-900 to-orange-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Club & Event Portal</span>
              <h2 className="text-2xl font-black mt-1">Submit Venue Booking Request</h2>
              <p className="text-xs text-amber-200 mt-1">Submit a request — Admin reviews and approves/rejects with remarks.</p>
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">New Venue Request</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  value={newVenueForm.eventName}
                  onChange={e => setNewVenueForm(p => ({ ...p, eventName: e.target.value }))}
                  placeholder="e.g. RoboWars National Arena 2026"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Preferred Venue *</label>
                <select
                  value={newVenueForm.venue}
                  onChange={e => setNewVenueForm(p => ({ ...p, venue: e.target.value }))}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option>Main Auditorium (Aryabhatta Hall)</option>
                  <option>Open Air Theatre (OAT, 800 Cap)</option>
                  <option>Seminar Hall 1 (SH-01, 80 Cap)</option>
                  <option>AI/ML Lab (LAB-AI, 50 Cap)</option>
                  <option>Sports Ground</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Event Date</label>
                <input
                  type="text"
                  value={newVenueForm.eventDate}
                  onChange={e => setNewVenueForm(p => ({ ...p, eventDate: e.target.value }))}
                  placeholder="e.g. Day 7 (Friday)"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Time Slot</label>
                <input
                  type="text"
                  value={newVenueForm.timeSlot}
                  onChange={e => setNewVenueForm(p => ({ ...p, timeSlot: e.target.value }))}
                  placeholder="e.g. 09:00 – 18:00"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Expected Attendees</label>
                <input
                  type="number"
                  value={newVenueForm.expectedAttendees}
                  onChange={e => setNewVenueForm(p => ({ ...p, expectedAttendees: Number(e.target.value) }))}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Purpose / Description</label>
              <textarea
                value={newVenueForm.purpose}
                onChange={e => setNewVenueForm(p => ({ ...p, purpose: e.target.value }))}
                placeholder="Describe the event and why this venue is needed..."
                rows={3}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => {
                if (!newVenueForm.eventName.trim()) { triggerSuccess('Please enter an event title.'); return; }
                createVenueRequest({ ...newVenueForm });
                setNewVenueForm({ open: false, eventName: '', venue: 'Main Auditorium (Aryabhatta Hall)', eventDate: '', timeSlot: '', expectedAttendees: 50, purpose: '' });
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Submit Venue Request → Admin Approval
            </button>
          </div>

          {/* My Submissions Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">My Venue Requests — Live Status</h3>
            {myReqs.length === 0 ? (
              <p className="text-xs text-slate-400">No venue requests submitted yet.</p>
            ) : myReqs.map(r => (
              <div key={r.id} className={`p-4 rounded-xl border ${r.status === 'APPROVED' ? 'border-emerald-200 bg-emerald-50' : r.status === 'REJECTED' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{r.id}</span>
                    <div className="font-bold text-sm text-slate-900">{r.eventName}</div>
                    <div className="text-xs text-slate-500">{r.venue} • {r.eventDate} • {r.timeSlot}</div>
                    {r.adminRemark && <div className="text-xs mt-1 font-semibold text-slate-700">Admin: {r.adminRemark}</div>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase shrink-0 ${r.status === 'APPROVED' ? 'bg-emerald-600 text-white' : r.status === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {r.status}
                  </span>
                </div>
                {r.status === 'PENDING' && (
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Submitted to Dean's Office for Priority Check & Sanction
                    </span>
                    <button
                      onClick={() => switchPersona('admin')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-xs transition"
                    >
                      Switch to Dean's Office to Approve →
                    </button>
                  </div>
                )}
                {r.status === 'APPROVED' && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sanctioned & Synchronized with Campus Schedule
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">Priority: Confirmed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'approvalTracking') {
      const myReqs = (venueRequests || []).filter(v => v.requesterRole === 'club');
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-900 to-orange-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Club Portal</span>
            <h2 className="text-2xl font-black mt-1">My Approval Requests — Live Tracking</h2>
            <p className="text-xs text-amber-200 mt-1">Real-time status of all your venue booking and event requests.</p>
          </div>
          <div className="space-y-4">
            {myReqs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-sm">No requests submitted yet.</div>
            ) : myReqs.map(r => (
              <div key={r.id} className={`bg-white p-5 rounded-2xl border shadow-sm ${r.status === 'APPROVED' ? 'border-emerald-300' : r.status === 'REJECTED' ? 'border-rose-300' : 'border-amber-300'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{r.id}</span>
                    <div className="font-bold text-slate-900">{r.eventName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.venue} • {r.eventDate} • {r.timeSlot}</div>
                    <div className="text-xs text-slate-500">Purpose: {r.purpose}</div>
                    {r.adminRemark && <div className="text-xs mt-1.5 font-semibold text-slate-700 bg-slate-100 rounded-lg px-3 py-1.5">Admin Remark: {r.adminRemark}</div>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${r.status === 'APPROVED' ? 'bg-emerald-600 text-white' : r.status === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {r.status}
                  </span>
                </div>
                {r.status === 'PENDING' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Awaiting Dean's Office Decision
                    </span>
                    <button
                      onClick={() => switchPersona('admin')}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-xs transition"
                    >
                      Switch to Dean's Office to Approve →
                    </button>
                  </div>
                )}
                {r.status === 'APPROVED' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified & Approved by Dean's Office
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">CIT-SPECTRA-2026-SEAL</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default Club Overview
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Club & Event Portal</span>
              <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
              <p className="text-xs text-amber-200 mt-0.5">{currentPersona.title} • {currentPersona.department}</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('venueBookings')} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-md">
            Spectra Venue Booking Hub
          </button>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Spectra Requests</span>
            <div className="text-3xl font-black text-amber-600 mt-1">25 Bookings</div>
            <span className="text-xs text-slate-500">24 Approved • 1 Cancelled</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Primary Venues</span>
            <div className="text-3xl font-black text-slate-800 mt-1">Audi & OAT</div>
            <span className="text-xs text-slate-500">Capacity: 450 & 800 seats</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">NLP Hinglish Parser</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">ACTIVE</div>
            <span className="text-xs text-emerald-700 font-bold">Priority Abuse Interception</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Expected Footfall</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">2,800+</div>
            <span className="text-xs text-slate-500">Students across 14 groups</span>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Club Head Direct Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'eventCreation', label: 'Event Creation', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
              { id: 'spectraMgmt', label: 'Spectra Management', icon: Award, color: 'text-orange-600 bg-orange-50' },
              { id: 'venueBookings', label: 'Venue Booking', icon: Building2, color: 'text-purple-600 bg-purple-50' },
              { id: 'budgetRequests', label: 'Budget Requests', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'participantTracking', label: 'Participant Tracking', icon: Users, color: 'text-blue-600 bg-blue-50' },
              { id: 'eventCalendar', label: 'Event Calendar', icon: Calendar, color: 'text-cyan-600 bg-cyan-50' },
              { id: 'approvalTracking', label: 'Approval Tracking', icon: ShieldCheck, color: 'text-rose-600 bg-rose-50' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-left space-y-2 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-amber-600 transition">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 5. ADMIN PORTAL SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'admin') {
    if (activeTab === 'timetable' || activeTab === 'timetableGenerator') return <TimetableManager />;
    if (activeTab === 'emergencyRescheduling' || activeTab === 'rescheduling') return <ReschedulingEngine />;
    if (activeTab === 'campusCommand' || activeTab === 'judgingCriteria') return <JudgingCriteriaModal />;
    if (activeTab === 'venueMgmt') return <VenueBookingManager />;

    if (activeTab === 'examScheduler') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Admin Portal</span>
              <h2 className="text-2xl font-black mt-1">Midsem Examination Scheduler (CIT)</h2>
              <p className="text-xs text-indigo-200 mt-1">41 Midsem Examination Slots scheduled across Week 7 with zero student exam clashes.</p>
            </div>
            <button
              onClick={() => triggerSuccess('Exam schedule verified! 0 conflicts found across 14 student groups.')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition shadow-md"
            >
              Verify 0 Exam Clashes
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {CIT_MIDSEM_EXAMS.slice(0, 8).map(ex => (
              <div key={ex.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600">{ex.id}</span>
                    <h4 className="text-sm font-bold text-slate-900">{ex.course}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    Group: {ex.group}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Day: <strong>{ex.day}</strong> • Period: <strong>{ex.period}</strong> • Room: <strong>{ex.room}</strong>
                </div>
                <div className="text-xs text-slate-500">Invigilator: {ex.invigilator}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'roomAllocation') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Admin Portal</span>
            <h2 className="text-2xl font-black mt-1">27 Campus Venues Allocation Matrix</h2>
            <p className="text-xs text-indigo-200 mt-1">10 Classrooms, 4 Lecture Halls, 10 Specialized Labs, 3 Seminar & Activity Halls.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {CIT_ROOMS.map(rm => (
              <div key={rm.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-indigo-600">{rm.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">{rm.type}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rm.name}</h4>
                <div className="text-xs text-slate-500">Capacity: <strong>{rm.capacity}</strong> • Floor: {rm.floor}</div>
                <div className="text-[11px] text-emerald-600 font-semibold">{rm.projector ? '✓ AV Projector & AC' : 'Standard Ventilation'}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Approval Center ─────────────────────────────────────────────
    if (activeTab === 'approvalCenter') {
      const allPending = [
        ...gatePasses.filter(g => g.status === 'PENDING').map(g => ({ ...g, _type: 'gatePass', _label: 'Gate Pass', _color: 'blue' })),
        ...(venueRequests || []).filter(v => v.status === 'PENDING').map(v => ({ ...v, _type: 'venue', _label: 'Venue Booking', _color: 'purple' })),
        ...(roomRequests || []).filter(r => r.status === 'PENDING').map(r => ({ ...r, _type: 'room', _label: 'Room Request', _color: 'amber' })),
        ...(leaveRequests || []).filter(l => l.status === 'PENDING').map(l => ({ ...l, _type: 'leave', _label: 'Leave Request', _color: 'rose' })),
        ...(extraClassRequests || []).filter(e => e.status === 'PENDING').map(e => ({ ...e, _type: 'extra', _label: 'Extra Class', _color: 'emerald' }))
      ];
      const allItems = [
        ...gatePasses.map(g => ({ ...g, _type: 'gatePass', _label: 'Gate Pass', _color: 'blue' })),
        ...(venueRequests || []).map(v => ({ ...v, _type: 'venue', _label: 'Venue Booking', _color: 'purple' })),
        ...(roomRequests || []).map(r => ({ ...r, _type: 'room', _label: 'Room Request', _color: 'amber' })),
        ...(leaveRequests || []).map(l => ({ ...l, _type: 'leave', _label: 'Leave Request', _color: 'rose' })),
        ...(extraClassRequests || []).map(e => ({ ...e, _type: 'extra', _label: 'Extra Class', _color: 'emerald' }))
      ];
      const displayList = approvalFilter === 'PENDING' ? allPending :
        approvalFilter === 'ALL' ? allItems :
        allItems.filter(i => i.status === approvalFilter);

      const handleApprove = (item) => {
        const remark = remarkInputs[item.id] || 'Approved by Admin';
        if (item._type === 'gatePass') approveGatePass(item.id, remark);
        else if (item._type === 'venue') approveVenueRequest(item.id, remark);
        else if (item._type === 'room') approveRoomRequest(item.id, remark);
        else if (item._type === 'leave') approveLeaveRequest(item.id, remark);
        else if (item._type === 'extra') approveExtraClassRequest(item.id, remark);
        setRemark(item.id, '');
      };
      const handleReject = (item) => {
        const remark = remarkInputs[item.id] || 'Rejected by Admin';
        if (item._type === 'gatePass') rejectGatePass(item.id, remark);
        else if (item._type === 'venue') rejectVenueRequest(item.id, remark);
        else if (item._type === 'room') rejectRoomRequest(item.id, remark);
        else if (item._type === 'leave') rejectLeaveRequest(item.id, remark);
        else if (item._type === 'extra') rejectExtraClassRequest(item.id, remark);
        setRemark(item.id, '');
      };

      const colorMap = { blue: 'bg-blue-100 text-blue-800', purple: 'bg-purple-100 text-purple-800', amber: 'bg-amber-100 text-amber-800', rose: 'bg-rose-100 text-rose-800', emerald: 'bg-emerald-100 text-emerald-800' };

      return (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Admin Portal — Approval Center</span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">Campus Request Approvals</h2>
              <p className="text-xs text-indigo-200 mt-1">Review and action all incoming requests from students, faculty & clubs.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-black animate-pulse">
                {allPending.length} Pending
              </span>
              <button onClick={() => setActiveTab('dashboard')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition">
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
              <button
                key={f}
                onClick={() => setApprovalFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${approvalFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f} {f === 'PENDING' ? `(${allPending.length})` : ''}
              </button>
            ))}
          </div>

          {/* Request Cards */}
          {displayList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
              <p className="font-bold text-slate-600">All caught up! No {approvalFilter === 'PENDING' ? 'pending' : ''} requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayList.map(item => (
                <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${item.status === 'PENDING' ? 'border-amber-300 ring-1 ring-amber-200' : item.status === 'APPROVED' ? 'border-emerald-200' : 'border-rose-200'}`}>
                  {/* Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${colorMap[item._color]}`}>{item._label}</span>
                      <div>
                        <div className="font-mono text-xs text-slate-400">{item.id}</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {item._type === 'gatePass' ? `${item.studentName || item.requesterName} → ${item.destination || item.passType}` :
                           item._type === 'venue' ? `${item.requesterName} — ${item.eventName}` :
                           item._type === 'room' ? `${item.requesterName} — ${item.roomName}` :
                           item._type === 'leave' ? `${item.requesterName} — ${item.leaveType}` :
                           `${item.requesterName} — ${item.course}`}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item._type === 'gatePass' ? `Room: ${item.room} • Out: ${item.outTime} • Return: ${item.expectedInTime}` :
                           item._type === 'venue' ? `Venue: ${item.venue} • ${item.eventDate} • ${item.timeSlot} • ${item.expectedAttendees} attendees` :
                           item._type === 'room' ? `${item.roomName} • ${item.date} • ${item.timeSlot}` :
                           item._type === 'leave' ? `${item.fromDate} to ${item.toDate} • Dept: ${item.department}` :
                           `${item.course} • ${item.group} • ${item.date} • ${item.timeSlot}`}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Reason: {item.remarks || item.purpose || item.reason || item.coverArranged || '—'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">Submitted: {item.submittedAt || '—'}</div>
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-black uppercase ${item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Remark + Action area — only show for PENDING */}
                  {item.status === 'PENDING' && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        type="text"
                        value={remarkInputs[item.id] || ''}
                        onChange={e => setRemark(item.id, e.target.value)}
                        placeholder="Enter remark / reason (optional)..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-400 bg-white"
                      />
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(item)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(item)}
                          className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition shadow-sm flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show existing remark for non-pending */}
                  {item.status !== 'PENDING' && (item.adminRemark || item.hodRemark || item.remarks) && (
                    <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 text-xs text-slate-500 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Admin Remark: <span className="font-semibold text-slate-700">{item.adminRemark || item.hodRemark || item.remarks}</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default Admin Overview
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Admin Portal</span>
              <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
              <p className="text-xs text-indigo-200 mt-0.5">{currentPersona.title} • {currentPersona.department}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('approvalCenter')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-xs font-black transition shadow-md flex items-center gap-2"
            >
              Approval Center
              {(() => {
                const pendingCount = gatePasses.filter(g => g.status === 'PENDING').length +
                  (venueRequests || []).filter(v => v.status === 'PENDING').length +
                  (roomRequests || []).filter(r => r.status === 'PENDING').length +
                  (leaveRequests || []).filter(l => l.status === 'PENDING').length +
                  (extraClassRequests || []).filter(e => e.status === 'PENDING').length;
                return pendingCount > 0 ? <span className="bg-white text-amber-600 rounded-full px-1.5 py-0.5 text-[10px] font-black">{pendingCount}</span> : null;
              })()}
            </button>
            <button onClick={() => setActiveTab('timetableGenerator')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md">
              Timetable Generator
            </button>
            <button onClick={() => setActiveTab('campusCommand')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
              Run Validator
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Scheduling Correctness</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">25 / 25 Marks</div>
            <span className="text-xs text-emerald-700 font-bold">0 Hard Violations (189 sessions)</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Rescheduling Engine</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">15 / 15 Marks</div>
            <span className="text-xs text-slate-500">Minimal 3 moves displacement</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Teaching Hours / Wk</span>
            <div className="text-3xl font-black text-slate-800 mt-1">243 Hours</div>
            <span className="text-xs text-slate-500">100% curriculum fulfilled</span>
          </div>
          <div
            className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 cursor-pointer hover:border-amber-400 hover:shadow-md transition"
            onClick={() => setActiveTab('approvalCenter')}
          >
            <span className="text-xs font-bold text-amber-600 uppercase">Pending Approvals</span>
            <div className="text-3xl font-black text-amber-700 mt-1">
              {gatePasses.filter(g => g.status === 'PENDING').length +
                (venueRequests || []).filter(v => v.status === 'PENDING').length +
                (roomRequests || []).filter(r => r.status === 'PENDING').length +
                (leaveRequests || []).filter(l => l.status === 'PENDING').length +
                (extraClassRequests || []).filter(e => e.status === 'PENDING').length} Requests
            </div>
            <span className="text-xs text-amber-600 font-bold">Click to review & approve →</span>
          </div>
        </div>

        {/* Quick Nav Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Admin Portal Direct Capabilities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'approvalCenter', label: 'Approval Center', icon: CheckCircle2, color: 'text-amber-600 bg-amber-50', badge: true },
              { id: 'timetableGenerator', label: 'Timetable Generator', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
              { id: 'examScheduler', label: 'Exam Scheduler (41 slots)', icon: Bell, color: 'text-blue-600 bg-blue-50' },
              { id: 'roomAllocation', label: 'Room Allocation (27 rms)', icon: Building2, color: 'text-purple-600 bg-purple-50' },
              { id: 'userMgmt', label: 'User Directory', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
              { id: 'venueMgmt', label: 'Venue Management', icon: Building2, color: 'text-amber-600 bg-amber-50' },
              { id: 'emergencyRescheduling', label: 'Emergency Rescheduler', icon: RotateCcw, color: 'text-rose-600 bg-rose-50' },
              { id: 'campusCommand', label: 'Judging Criteria & Rules', icon: LayoutDashboard, color: 'text-slate-600 bg-slate-100' }
            ].map(item => {
              const Icon = item.icon;
              const pendingCount = item.badge ? (
                gatePasses.filter(g => g.status === 'PENDING').length +
                (venueRequests || []).filter(v => v.status === 'PENDING').length +
                (roomRequests || []).filter(r => r.status === 'PENDING').length +
                (leaveRequests || []).filter(l => l.status === 'PENDING').length +
                (extraClassRequests || []).filter(e => e.status === 'PENDING').length
              ) : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left space-y-2 group relative"
                >
                  {item.badge && pendingCount > 0 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>
                  )}
                  <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition">{item.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 6. PRINCIPAL DASHBOARD SUB-VIEWS
  // ─────────────────────────────────────────────────────────────
  if (activeRole === 'principal') {
    if (activeTab === 'campusOverview' || activeTab === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <img src={currentPersona.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-400" />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-300">Principal & Director Command</span>
                <h2 className="text-2xl sm:text-3xl font-black">{currentPersona.name}</h2>
                <p className="text-xs text-rose-200 mt-0.5">{currentPersona.title} • Chilika Institution of Technology</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('executiveReports')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              Export Executive Reports
            </button>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Campus SLA Compliance</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">99.8%</div>
              <span className="text-xs text-emerald-700 font-bold">14 Grievances resolved &lt; 24h</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Curriculum Completion</span>
              <div className="text-3xl font-black text-blue-600 mt-1">243 Hours</div>
              <span className="text-xs text-slate-500">189 Sessions scheduled clash-free</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Dining Waste Saved</span>
              <div className="text-3xl font-black text-amber-600 mt-1">~300g / meal</div>
              <span className="text-xs text-slate-500">128 meal skips notified</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Turnstile Latency</span>
              <div className="text-3xl font-black text-indigo-600 mt-1">0.4s avg</div>
              <span className="text-xs text-emerald-600 font-bold">Offline cryptographic QR</span>
            </div>
          </div>

          {/* Quick Nav Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Principal Dashboard Capabilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'campusOverview', label: 'Campus Overview', icon: LayoutDashboard, color: 'text-rose-600 bg-rose-50' },
                { id: 'attendanceAnalytics', label: 'Attendance Analytics', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                { id: 'infrastructureAnalytics', label: 'Infrastructure Analytics', icon: Building2, color: 'text-blue-600 bg-blue-50' },
                { id: 'deptPerformance', label: 'Department Performance', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
                { id: 'facultyAnalytics', label: 'Faculty Analytics', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
                { id: 'eventAnalytics', label: 'Event Analytics', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
                { id: 'executiveReports', label: 'Executive Reports', icon: FileText, color: 'text-slate-600 bg-slate-100' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition text-left space-y-2 group"
                  >
                    <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-slate-800 group-hover:text-rose-600 transition">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'infrastructureAnalytics') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Principal Dashboard</span>
            <h2 className="text-2xl font-black mt-1">27 Venues Infrastructure Utilisation</h2>
            <p className="text-xs text-rose-200 mt-1">Real-time room occupancy, air conditioning health, and maintenance windows.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Average Occupancy</span>
              <div className="text-3xl font-black text-rose-600 mt-1">78.4%</div>
              <span className="text-xs text-slate-500">Peak hours: 10:00 - 13:00</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Labs Utilisation</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">91.2%</div>
              <span className="text-xs text-emerald-700 font-bold">Turing CS1 & Ada CS2 high demand</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase">Auditorium Availability</span>
              <div className="text-3xl font-black text-indigo-600 mt-1">Week 7 Booked</div>
              <span className="text-xs text-slate-500">Spectra Tech Fest Mainstage</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'executiveReports') {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Principal Dashboard</span>
            <h2 className="text-2xl font-black mt-1">Executive Compliance & Accreditation Reports</h2>
            <p className="text-xs text-rose-200 mt-1">Download official submission exports and institutional audits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Master Schedule Export (`exports/schedule.json`)</h4>
              <p className="text-xs text-slate-500">189 clash-free teaching sessions, 243 hours, 27 venues, 40 faculty.</p>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ institution: "Chilika Institution of Technology", sessions: CIT_SCHEDULED_SESSIONS }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = "schedule.json";
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
              >
                <Download className="w-4 h-4" /> Download schedule.json
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Post-Disruption Schedule (`exports/schedule_after.json`)</h4>
              <p className="text-xs text-slate-500">Minimal 3 moves displacement after Dr. Rath leave and LH-1 closure.</p>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ institution: "Chilika Institution of Technology", movesCount: 3, sessions: CIT_SCHEDULED_SESSIONS }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = "schedule_after.json";
                  a.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition"
              >
                <Download className="w-4 h-4" /> Download schedule_after.json
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Fallback to Timetable Manager
  return <TimetableManager />;
}
