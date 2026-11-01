import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import {
  GraduationCap, LayoutDashboard, ShieldCheck, Wrench, FileText,
  Utensils, Bell, BarChart3, Smartphone, BookOpen,
  Building2, Shield, Globe, X, Users, LogOut, RotateCcw, Award, Sparkles,
  CheckCircle2, Clock, Cpu, Activity, Calendar, CreditCard, Receipt, Wallet, DollarSign, MapPin
} from 'lucide-react';
import UnifyLogo from './UnifyLogo';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { activeRole, currentPersona, notices, logout, switchPersona } = useCampus();
  const { currentLang, setCurrentLang } = useLanguage();
  const { networkMode, setNetworkMode } = useNetwork();

  const unreadCount = notices.filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  // ── Role-specific navigation items ──────────────────────
  const getNavSections = () => {
    if (activeRole === 'student') {
      return [{
        category: 'STUDENT PORTAL',
        items: [
          { id: 'studentProfile',   label: 'Student Profile',       icon: Users },
          { id: 'feeLedger',        label: 'Fee Ledger & Invoices', icon: Receipt },
          { id: 'attendance',       label: 'Attendance',            icon: CheckCircle2 },
          { id: 'academicRecords',  label: 'Academic Records',      icon: GraduationCap },
          { id: 'assignments',      label: 'Assignments',           icon: FileText },
          { id: 'timetable',        label: 'Timetable',             icon: BookOpen },
          { id: 'leaveRequests',    label: 'Leave Requests',        icon: ShieldCheck },
          { id: 'eventRegistration',label: 'Event Registration',    icon: Sparkles },
          { id: 'notices',          label: 'Notifications',         icon: Bell, badge: unreadCount },
          { id: 'aiAssistant',      label: 'AI Assistant',          icon: Smartphone },
        ]
      }];
    }

    if (activeRole === 'faculty' || activeRole === 'teacher') {
      return [{
        category: 'FACULTY PORTAL',
        items: [
          { id: 'teachingSchedule',  label: 'Teaching Schedule',          icon: BookOpen },
          { id: 'attendanceMgmt',    label: 'Attendance Management',      icon: CheckCircle2 },
          { id: 'studentPerformance',label: 'Student Performance',        icon: BarChart3 },
          { id: 'assignmentsMgmt',   label: 'Assignment Management',      icon: FileText },
          { id: 'leaveRequests',     label: 'Leave Requests',             icon: ShieldCheck },
          { id: 'extraClasses',      label: 'Extra Classes',              icon: Clock },
          { id: 'roomRequests',      label: 'Room Requests',              icon: Building2 },
          { id: 'aiScheduling',      label: 'AI Scheduling Assistant',    icon: Sparkles },
        ]
      }];
    }

    if (activeRole === 'hod' || activeRole === 'coordinator') {
      return [{
        category: 'DEPT. COORDINATOR / HOD',
        items: [
          { id: 'deptTimetable',     label: 'Department Timetable', icon: BookOpen },
          { id: 'facultyAllocation', label: 'Faculty Allocation',   icon: Users },
          { id: 'resourceMgmt',      label: 'Resource Management',  icon: Building2 },
          { id: 'approvalCenter',    label: 'Approval Center',      icon: ShieldCheck },
          { id: 'conflictResolution',label: 'Conflict Resolution',  icon: RotateCcw },
          { id: 'labMgmt',           label: 'Lab Management',       icon: Cpu },
          { id: 'deptAnalytics',     label: 'Department Analytics', icon: BarChart3 },
        ]
      }];
    }

    if (activeRole === 'club') {
      return [{
        category: 'CLUB & EVENT PORTAL',
        items: [
          { id: 'eventCreation',      label: 'Event Creation',       icon: Sparkles },
          { id: 'spectraMgmt',        label: 'Spectra Management',   icon: Award },
          { id: 'venueBookings',      label: 'Venue Booking',        icon: Building2 },
          { id: 'budgetRequests',     label: 'Budget Requests',      icon: FileText },
          { id: 'participantTracking',label: 'Participant Tracking', icon: Users },
          { id: 'eventCalendar',      label: 'Event Calendar',       icon: Calendar },
          { id: 'approvalTracking',   label: 'Approval Tracking',    icon: ShieldCheck },
        ]
      }];
    }

    if (activeRole === 'admin') {
      return [{
        category: 'ADMIN (DEAN) PORTAL',
        items: [
          { id: 'timetableGenerator',   label: 'Timetable Generator',   icon: BookOpen },
          { id: 'examScheduler',        label: 'Exam Scheduler',        icon: Bell },
          { id: 'roomAllocation',       label: 'Room Allocation',       icon: Building2 },
          { id: 'userMgmt',             label: 'User Management',       icon: Users },
          { id: 'venueMgmt',            label: 'Venue Management',      icon: Building2 },
          { id: 'emergencyRescheduling',label: 'Emergency Rescheduling',icon: RotateCcw },
          { id: 'systemMonitoring',     label: 'System Monitoring',     icon: Activity },
          { id: 'campusCommand',        label: 'Campus Command Center', icon: LayoutDashboard },
        ]
      }];
    }

    if (activeRole === 'principal') {
      return [{
        category: 'PRINCIPAL DASHBOARD',
        items: [
          { id: 'campusOverview',        label: 'Campus Overview',         icon: LayoutDashboard },
          { id: 'attendanceAnalytics',   label: 'Attendance Analytics',    icon: CheckCircle2 },
          { id: 'infrastructureAnalytics',label: 'Infrastructure Analytics',icon: Building2 },
          { id: 'deptPerformance',       label: 'Department Performance',  icon: BarChart3 },
          { id: 'facultyAnalytics',      label: 'Faculty Analytics',       icon: Users },
          { id: 'eventAnalytics',        label: 'Event Analytics',         icon: Sparkles },
          { id: 'executiveReports',      label: 'Executive Reports',       icon: FileText },
        ]
      }];
    }

    if (activeRole === 'parent') {
      return [{
        category: 'PARENT & GUARDIAN PORTAL',
        items: [
          { id: 'overview',        label: 'Ward Overview',          icon: Users },
          { id: 'academicProgress',label: 'Academic Progress',      icon: GraduationCap },
          { id: 'feeLedger',       label: 'Fees & Online Pay',      icon: Receipt },
          { id: 'gatePasses',      label: 'Gate Pass & Safety',     icon: ShieldCheck },
          { id: 'busTracker',      label: '🚌 Live Bus Tracker',    icon: MapPin },
          { id: 'alerts',          label: 'Campus Notices',         icon: Bell, badge: unreadCount },
        ]
      }];
    }

    // default fallback
    return [{
      category: 'ASTRACAMPUS SUITE',
      items: [
        { id: 'timetable',        label: 'Timetable Matrix',    icon: BookOpen },
        { id: 'venueBookings',    label: 'Spectra Venue Hub',   icon: Building2 },
        { id: 'rescheduling',     label: 'Disruption Engine',   icon: RotateCcw },
        { id: 'judgingCriteria',  label: 'Judging Criteria',    icon: Award },
      ]
    }];
  };

  const roleLabel = {
    student: 'Student Portal',
    admin: 'Admin (Dean) Portal',
    principal: 'Principal Dashboard',
    club: 'Club & Event Portal',
    faculty: 'Faculty Portal',
    hod: 'Dept. Coordinator / HOD',
    coordinator: 'Dept. Coordinator / HOD',
    teacher: 'Faculty Portal',
    warden: 'Hostel Warden',
    guard: 'Security Officer',
    messManager: 'Mess Supervisor',
    parent: 'Parent Portal'
  }[activeRole] || 'AstraCampus Portal';

  const roleColor = {
    student: 'ring-blue-500/50',
    admin: 'ring-indigo-500/50',
    principal: 'ring-rose-500/50',
    club: 'ring-amber-500/50',
    faculty: 'ring-purple-500/50',
    hod: 'ring-cyan-500/50',
    coordinator: 'ring-cyan-500/50',
    teacher: 'ring-purple-500/50',
    warden: 'ring-indigo-500/50',
    guard: 'ring-amber-500/50',
    messManager: 'ring-emerald-500/50',
    parent: 'ring-teal-500/50'
  }[activeRole] || 'ring-slate-500/50';

  const sections = getNavSections();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none border-r border-slate-800">

      {/* App Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <UnifyLogo size="xs" variant="light" />
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Signed in as</span>
        <div className="text-xs font-extrabold text-white mt-0.5">{roleLabel}</div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 mt-2">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">{sec.category}</span>
            <div className="space-y-0.5 mt-1">
              {sec.items.map((item) => {
                const Icon = item.icon || LayoutDashboard;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); if (setMobileOpen) setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}>
                    {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full" />}
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-1.5 text-[9px] font-extrabold bg-rose-500 text-white rounded-full">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Network + Language + Profile */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
        {/* Controls row */}
        <div className="flex items-center justify-between gap-2">
          <select value={networkMode} onChange={e => setNetworkMode(e.target.value)}
            className={`rounded-lg px-2 py-1 text-[11px] font-bold border cursor-pointer outline-none flex-1 ${
              networkMode === 'online'  ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
              networkMode === 'slow2g' ? 'bg-amber-950 text-amber-300 border-amber-700' :
              'bg-rose-950 text-rose-300 border-rose-700'
            }`}>
            <option value="online">🟢 Online</option>
            <option value="slow2g">🟡 Slow 2G</option>
            <option value="offline">🔴 Offline</option>
          </select>
          <div className="flex items-center gap-1 bg-slate-800/90 rounded-lg px-2 py-1 border border-slate-700">
            <Globe className="w-3 h-3 text-slate-400" />
            <select value={currentLang} onChange={e => setCurrentLang(e.target.value)}
              className="bg-transparent text-[11px] text-white border-none focus:outline-none cursor-pointer font-semibold">
              <option value="en">EN</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        {/* Quick Persona Switcher for Hackathon Evaluation */}
        <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800/90">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Persona Demo Switch
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {[
              { id: 'student',   label: 'Student' },
              { id: 'parent',    label: 'Parent' },
              { id: 'admin',     label: 'Admin' },
              { id: 'principal', label: 'Principal' },
              { id: 'club',      label: 'Club' },
              { id: 'faculty',   label: 'Faculty' },
              { id: 'hod',       label: 'HOD' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => switchPersona(p.id)}
                className={`px-1 py-1 rounded text-center truncate font-bold transition-all ${
                  activeRole === p.id || (p.id === 'hod' && activeRole === 'coordinator')
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/70 border border-slate-700/60">
          <img src={currentPersona.avatar} alt={currentPersona.name}
            className={`w-8 h-8 rounded-full object-cover ring-2 ${roleColor} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate leading-tight">{currentPersona.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{roleLabel}</div>
          </div>
          <button onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex-shrink-0">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-shrink-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}