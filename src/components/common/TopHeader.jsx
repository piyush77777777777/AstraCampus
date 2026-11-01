import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, ChevronRight, LogOut, Mail, ShieldCheck, Bell } from 'lucide-react';

const PAGE_TITLES = {
  dashboard:                  'Dashboard Overview',
  timetable:                  'CIT Timetable Matrix (Clash-Free)',
  venueBookings:              'Spectra Venue Hub & NLP Parser',
  rescheduling:               'Disruption Rescheduling Engine',
  judgingCriteria:            'Judging Criteria & Live Validator',
  
  // Student Portal Sub-items
  studentProfile:             'Student Profile & Identity',
  feeLedger:                  'Student Fee Ledger & Invoices',
  fees:                       'Fee Ledger, Invoices & Online Payments',
  attendance:                 'Attendance & Safe Bunk Meter',
  academicRecords:            'Academic Records & CGPA Transcripts',
  assignments:                'Course Assignments & Submissions',
  leaveRequests:              'Leave Requests & Gate Pass',
  eventRegistration:          'Spectra Festival Event Registration',
  notices:                    'Campus Bulletins & Alerts',
  aiAssistant:                'AI Scheduling & Campus Assistant',

  // Parent Portal Sub-items
  overview:                   'Ward 360° Overview',
  academicProgress:           'Ward Academic Progress & CGPA',
  gatePasses:                 'Gate Passes & Safety Verification',
  busTracker:                 'Live GPS Campus Bus Tracker',
  parent:                     'Parent & Guardian Portal',
  parentPortal:               'Parent & Guardian Portal',

  // Faculty Portal Sub-items
  teachingSchedule:           'My Weekly Teaching Schedule',
  attendanceMgmt:             'Classroom Attendance Management',
  studentPerformance:         'Student Marks & Academic Performance',
  assignmentsMgmt:            'Assignment Publishing & Evaluation',
  extraClasses:               'Extra & Remedial Classes Scheduler',
  roomRequests:               'Faculty Room & Venue Requisition',
  aiScheduling:               'AI Timetable Scheduling Copilot',

  // Dept Coordinator / HOD Sub-items
  deptTimetable:              'Department Master Timetable (CSE)',
  facultyAllocation:          'Faculty Teaching Load Allocation',
  resourceMgmt:               'Classroom & Department Resource Management',
  approvalCenter:             'Academic Requests Approval Center',
  conflictResolution:         'Timetable Conflict Resolution',
  labMgmt:                    'Computer & Hardware Lab Management',
  deptAnalytics:              'Department Utilisation & Syllabus Analytics',

  // Club & Event Portal Sub-items
  eventCreation:              'New Festival Event Proposal',
  spectraMgmt:                'Spectra Tech Fest Master Management',
  budgetRequests:             'SAC Funding & Budget Requisitions',
  participantTracking:        'Event Registration & Participant Tracker',
  eventCalendar:              'Campus Multi-Event Calendar',
  approvalTracking:           'Administrative Approval Tracking',

  // Admin Portal Sub-items
  timetableGenerator:         'Autonomous Timetable Generator (243 hrs)',
  examScheduler:              'Midsem Examination Scheduler (41 slots)',
  roomAllocation:             '27 Campus Venues Allocation Matrix',
  userMgmt:                   'University User Directory & Roles',
  venueMgmt:                  'Campus Venues Maintenance & Bookings',
  emergencyRescheduling:      'Minimal Displacement Emergency Rescheduler',
  systemMonitoring:           'System Telemetry & Offline PWA Sync',
  campusCommand:              'Section 8 Judging Criteria & Validator',

  // Principal Dashboard Sub-items
  campusOverview:             'Executive Campus Health & Metrics',
  attendanceAnalytics:        'Campus-wide Student & Faculty Presence',
  infrastructureAnalytics:    '27 Venues Infrastructure Utilisation',
  deptPerformance:            'Department Benchmarks & Scorecard',
  facultyAnalytics:           'Faculty Teaching Load & Rating Analytics',
  eventAnalytics:             'Spectra Festival Footfall & Analytics',
  executiveReports:           'Accreditation Reports & Audit Exports'
};

const ROLE_LABELS = {
  student:          'Student Portal',
  admin:            'Admin (Dean) Portal',
  principal:        'Principal Dashboard',
  club:             'Club & Event Portal',
  faculty:          'Faculty Portal',
  hod:              'Dept. Coordinator / HOD',
  coordinator:      'Dept. Coordinator / HOD',
  teacher:          'Faculty Portal',
  warden:           'Hostel Warden',
  guard:            'Security Officer',
  messManager:      'Mess Supervisor',
  parent:           'Parent / Guardian'
};

const ROLE_COLORS = {
  student:     'ring-blue-500',
  admin:       'ring-indigo-500',
  principal:   'ring-rose-500',
  club:        'ring-amber-500',
  faculty:     'ring-purple-500',
  hod:         'ring-cyan-500',
  coordinator: 'ring-cyan-500',
  teacher:     'ring-purple-500',
  warden:      'ring-indigo-500',
  guard:       'ring-amber-500',
  messManager: 'ring-emerald-500',
  parent:      'ring-teal-500'
};

const ROLE_BADGE = {
  student:     'bg-blue-50 text-blue-700 border-blue-200',
  admin:       'bg-indigo-50 text-indigo-700 border-indigo-200',
  principal:   'bg-rose-50 text-rose-700 border-rose-200',
  club:        'bg-amber-50 text-amber-700 border-amber-200',
  faculty:     'bg-purple-50 text-purple-700 border-purple-200',
  hod:         'bg-cyan-50 text-cyan-700 border-cyan-200',
  coordinator: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  teacher:     'bg-purple-50 text-purple-700 border-purple-200',
  warden:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  guard:       'bg-amber-50 text-amber-700 border-amber-200',
  messManager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  parent:      'bg-teal-50 text-teal-700 border-teal-200'
};

export default function TopHeader({ activeTab, setMobileOpen, onOpenMsg }) {
  const { currentPersona, activeRole, currentUser, logout, notices, notifications, markNotificationRead, acknowledgeNotification, setActionableNotification } = useCampus();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read_at).length + notices.filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = currentUser?.name || currentPersona.name;
  const displayEmail = currentUser?.email || '';
  const displayAvatar = currentPersona.avatar;
  const roleLabel = ROLE_LABELS[activeRole] || activeRole;
  const ringColor = ROLE_COLORS[activeRole] || 'ring-slate-400';
  const badgeClass = ROLE_BADGE[activeRole] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

      {/* Left: Mobile menu + breadcrumb + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 flex-shrink-0">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span className="font-bold text-slate-500">AstraCampus</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-bold capitalize truncate">{PAGE_TITLES[activeTab] || activeTab}</span>
          </div>
          <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
            {PAGE_TITLES[activeTab] || 'AstraCampus Portal'}
          </h1>
        </div>
      </div>

      {/* Right: Messages + Notifications + Profile */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Message button */}
        {onOpenMsg && (() => {
          let msgUnread = 0;
          try {
            const convs = JSON.parse(localStorage.getItem('ASTRACAMPUS_MESSAGES') || '[]');
            msgUnread = convs.reduce((s, c) => s + (c.unread || 0), 0);
          } catch { msgUnread = 3; }
          return (
            <div className="relative">
              <button
                onClick={onOpenMsg}
                aria-label="Open Messages"
                className="p-2 rounded-xl text-slate-500 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all"
              >
                <Mail className="w-4 h-4" />
              </button>
              {msgUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {msgUnread}
                </span>
              )}
            </div>
          );
        })()}

        {/* Notification bell */}
        <div className="relative">
          <button onClick={() => setNotificationOpen(prev => !prev)} aria-label="Open notifications" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 border border-slate-200 transition-all">
            <Bell className="w-4.5 h-4.5" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">4-Stage Loop</span>
                </div>
                <span className="text-[10px] text-slate-500">{unreadCount} active</span>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-5 text-xs text-slate-500 text-center">No active notifications.</div>
                ) : notifications.slice(0, 8).map((notification) => {
                  const status = notification.delivery_status || 'dispatched';
                  const stageLabels = {
                    dispatched: { label: '1. Push Sent', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    acknowledged: { label: '2. Device ACK', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    action_taken: { label: '3. AI Action Executed', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    verified: { label: '4. Audited & Verified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                  };
                  const badge = stageLabels[status] || stageLabels.dispatched;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => {
                        setNotificationOpen(false);
                        markNotificationRead(notification.id);
                        if (notification.delivery_status === 'dispatched') {
                          acknowledgeNotification(notification.id);
                        }
                        if (setActionableNotification) setActionableNotification(notification);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-all ${
                        notification.read_at ? 'bg-white' : 'bg-blue-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate flex-1 mr-2">{notification.title}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{notification.message}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-blue-600 font-bold">
                        <span>Tap to view AI risk analysis & take action →</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile avatar — click shows read-only info + sign out only */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative p-0.5 rounded-full ring-2 ${ringColor} hover:opacity-90 transition-all shadow-md`}>
            <img src={displayAvatar} alt={displayName}
              className="w-9 h-9 rounded-full object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">

              {/* Profile header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={displayAvatar} alt={displayName}
                    className={`w-12 h-12 rounded-full object-cover ring-2 ${ringColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{displayName}</div>
                    {displayEmail && (
                      <div className="text-[11px] text-slate-500 truncate">{displayEmail}</div>
                    )}
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeClass}`}>
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified sign-in indicator */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-emerald-700">Signed in via Google</span>
                  {currentUser?.signedInAt && <span className="text-slate-400 ml-1">at {currentUser.signedInAt}</span>}
                </div>
              </div>

              {/* Portal lock notice */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Your account is locked to the <strong>{roleLabel} portal</strong>. Portal switching is not permitted.
                  </p>
                </div>
              </div>

              {/* Sign out */}
              <div className="p-2">
                <button onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-rose-600 hover:bg-rose-50 transition-all font-bold text-sm">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}