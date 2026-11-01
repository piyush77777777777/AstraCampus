import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Wrench,
  FileText,
  Utensils,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Calendar,
  Siren
} from 'lucide-react';
import GatePassModal from './GatePassModal';
import ComplaintModal from './ComplaintModal';
import DocumentModal from './DocumentModal';
import StudentSOSModal from './StudentSOSModal';

export default function StudentDashboard({ onNavigateTab }) {
  const { currentPersona, gatePasses, complaints, notices, acknowledgeNotice, messData, toggleMealDecision } = useCampus();
  const { t } = useLanguage();

  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [viewingPass, setViewingPass] = useState(null);
  const [sosOpen, setSosOpen] = useState(false);

  // Student's latest active pass
  const activePass = gatePasses.find(gp => gp.studentId === currentPersona?.id && gp.status !== 'COMPLETED') || gatePasses[0];

  // Student's active tickets with null guards
  const myComplaints = complaints.filter(c => c.studentId === currentPersona?.id || (currentPersona?.room && c.reportedBy && c.reportedBy.includes(currentPersona.room)));

  // Fallback safe attendance
  const studentAttendance = currentPersona?.attendance || {
    overall: 84.5,
    required: 75,
    safeBunksRemaining: 6,
    subjects: [
      { code: "CST301", name: "Operating Systems", attended: 36, total: 40, percentage: 90 },
      { code: "CST302", name: "Database Management Systems", attended: 32, total: 38, percentage: 84.2 },
      { code: "CST303", name: "Design & Analysis of Algorithms", attended: 28, total: 35, percentage: 80.0 },
      { code: "CST304", name: "Computer Networks", attended: 29, total: 36, percentage: 80.5 }
    ]
  };

  // Targeted notices
  const studentNotices = notices.slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ══════════════ EMERGENCY SOS BUTTON ══════════════ */}
      <button
        onClick={() => setSosOpen(true)}
        className="w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-xl shadow-rose-600/40 border border-rose-500/50 transition-all hover:scale-[1.01] active:scale-[0.99] group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all">
            <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div className="text-left">
            <div className="font-black text-base sm:text-lg tracking-tight">STUDENT EMERGENCY SOS</div>
            <div className="text-xs text-rose-100 mt-0.5">
              Instantly alerts Teacher • Security Guard • Dean's Office with your location
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] font-black bg-white text-rose-700 px-3 py-1 rounded-full animate-pulse">
            EMERGENCY
          </span>
          <span className="text-[10px] text-rose-200">📍 GPS + Broadcast</span>
        </div>
      </button>
      {/* ═══════════════════════════════════════════════════ */}

      {/* Student Welcome Banner & Attendance Intelligence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Chilika Institution of Technology (CIT) | 2026 Academic Session</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('student.welcome')} {currentPersona.name} 👋
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed max-w-xl">
              Reg No: <strong>{currentPersona.regNo}</strong> | {currentPersona.branch} ({currentPersona.year})
              <br />
              Residence: <strong>{currentPersona.hostel}</strong>, Room <strong>{currentPersona.room}</strong>
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-blue-200">Total Attendance</div>
              <div className="text-xl font-extrabold text-white mt-0.5">{studentAttendance.overall}%</div>
              <div className="text-[10px] text-emerald-400 font-bold">Above 75% CIT Cutoff</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-blue-200">Exam Eligibility</div>
              <div className="text-xl font-extrabold text-emerald-300 mt-0.5">Approved</div>
              <div className="text-[10px] text-emerald-300">Minimum 75% Met</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-blue-200">Pending Dues</div>
              <div className="text-xl font-extrabold text-emerald-300 mt-0.5">₹0</div>
              <div className="text-[10px] text-emerald-400">All Clear</div>
            </div>
          </div>
        </div>

        {/* Attendance Safe Margin Widget */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Subject Attendance Buffer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                HEALTHY
              </span>
            </div>

            <div className="space-y-3.5 my-4">
              {studentAttendance.subjects.map((sub) => (
                <div key={sub.code}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{sub.name}</span>
                    <span className={`font-bold ${sub.percentage >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {sub.percentage}% ({sub.attended}/{sub.total})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sub.percentage >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${sub.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Attendance Status: All enrolled courses meet the mandatory 75% examination threshold.</span>
          </div>
        </div>
      </div>

      {/* 4 Everyday Campus Friction Reducers (Direct Quick Action Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">
            {t('student.quickActions')}
          </h2>
          <span className="text-xs text-slate-500">
            Zero paper forms, zero lines, instant resolution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick Action 1: Gate Pass */}
          <button
            onClick={() => {
              setViewingPass(null);
              setGatePassModalOpen(true);
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>{t('student.requestGatePass')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Outing pass with dynamic QR & parent SMS
            </p>
          </button>

          {/* Quick Action 2: Hostel Complaint */}
          <button
            onClick={() => setComplaintModalOpen(true)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>{t('student.reportComplaint')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Auto-routed maintenance ticket with SLA clock
            </p>
          </button>

          {/* Quick Action 3: Bonafide / Documents */}
          <button
            onClick={() => setDocModalOpen(true)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>{t('student.getCertificate')}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Instant verifiable PDF with university seal
            </p>
          </button>

          {/* Quick Action 4: Mess Poll */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Cutoff 16:00
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900">
                {t('student.messPoll')}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {messData?.annapurnaMess?.userMealDecision === 'OPT_IN' ? 'Dinner: Reserved ✓' : 'Dinner: Skipped (Food Saved) 🌱'}
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleMealDecision('OPT_IN')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  messData?.annapurnaMess?.userMealDecision === 'OPT_IN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Eat
              </button>
              <button
                onClick={() => toggleMealDecision('OPT_OUT')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  messData?.annapurnaMess?.userMealDecision === 'OPT_OUT'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Active Gate Pass & Grievance SLA Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Gate Pass Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {t('student.activePass')}
              </h3>
            </div>
            {activePass && (
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                activePass.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : activePass.status === 'CHECKED_OUT'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-blue-50 text-blue-700 border-blue-300'
              }`}>
                {activePass.status}
              </span>
            )}
          </div>

          {activePass ? (
            <div className="pt-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                    {activePass.passType}
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activePass.destination}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Out: {activePass.outTime} → Expected In: {activePass.expectedInTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setViewingPass(activePass);
                    setGatePassModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show QR</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved By:</span>
                  <span className="font-semibold text-slate-800">{activePass.approvedBy || 'Pending Warden Review'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parent Alert:</span>
                  <span className="text-emerald-700 font-medium">✓ SMS Dispatched to {activePass.emergencyPhone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No active gate pass. You are currently safely inside campus.
            </div>
          )}
        </div>

        {/* Active Grievances / SLA Ageing Alert */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                {t('student.pendingTickets')}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="pt-4 space-y-3">
            {myComplaints.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  ticket.status === 'ESCALATED'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {ticket.title}
                      </span>
                      {ticket.status === 'ESCALATED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">
                          SLA BREACHED ({ticket.reportedDaysAgo}d)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs flex-shrink-0">
                    {ticket.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Assigned: <strong>{ticket.assignedTo}</strong></span>
                  <span>{ticket.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Targeted Campus Announcements (Replaces WhatsApp Chaos) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {t('student.recentAnnouncements')}
              </h3>
              <p className="text-[11px] text-slate-500">
                Official broadcasts filtered for 3rd Year CSE & Aryabhatta Hall (Zero WhatsApp noise)
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            View Notice Board
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {studentNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                    notice.priority === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notice.category} • {notice.priority}
                  </span>
                  <span className="text-[11px] text-slate-400">{notice.publishedDate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Read by {notice.readCount}/{notice.totalTargetAudience} residents
                </span>

                {notice.actionRequired && (
                  notice.hasUserAcknowledged ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeNotice(notice.id)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      Acknowledge
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <GatePassModal
        isOpen={gatePassModalOpen}
        onClose={() => {
          setGatePassModalOpen(false);
          setViewingPass(null);
        }}
        existingPass={viewingPass}
      />
      <ComplaintModal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
      />
      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />
      <StudentSOSModal
        isOpen={sosOpen}
        onClose={() => setSosOpen(false)}
      />
    </div>
  );
}
