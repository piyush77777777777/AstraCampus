import React from 'react';
import { useCampus } from '../../context/CampusContext';
import UnifyLogo from '../common/UnifyLogo';
import {
  GraduationCap, LayoutDashboard, ShieldCheck, Users,
  Building2, Sparkles, Cpu, Award, ArrowRight, Shield, Zap, Star
} from 'lucide-react';

const PORTALS = [
  {
    id: 'student',
    title: 'Student Portal',
    icon: GraduationCap,
    iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/60',
    btnColor: 'text-blue-400 group-hover:text-blue-300',
    glowColor: 'from-blue-600/20 to-transparent',
    features: 'Student Profile A Attendance A Academic Records A Assignments A Timetable A Leave Requests A Event Registration A Notifications A AI Assistant'
  },
  {
    id: 'parent',
    title: 'Parent Portal',
    icon: Users,
    iconBg: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
    hoverBorder: 'hover:border-teal-500/60',
    btnColor: 'text-teal-400 group-hover:text-teal-300',
    glowColor: 'from-teal-600/20 to-transparent',
    features: 'Ward Academic Progress A CGPA & SGPA Trend A Subject Attendance A Safe Bunk Calculator A Itemized Fee Ledger A Online Fee Payments A Digital Receipts'
  },
  {
    id: 'admin',
    title: 'Admin (Dean) Portal',
    icon: Building2,
    iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    hoverBorder: 'hover:border-indigo-500/60',
    btnColor: 'text-indigo-400 group-hover:text-indigo-300',
    glowColor: 'from-indigo-600/20 to-transparent',
    features: 'Timetable Generator A Exam Scheduler A Room Allocation A User Management A Venue Management A Emergency Rescheduling A System Monitoring A Campus Command Center'
  },
  {
    id: 'principal',
    title: 'Principal Dashboard',
    icon: LayoutDashboard,
    iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    hoverBorder: 'hover:border-rose-500/60',
    btnColor: 'text-rose-400 group-hover:text-rose-300',
    glowColor: 'from-rose-600/20 to-transparent',
    features: 'Campus Overview A Attendance Analytics A Infrastructure Analytics A Department Performance A Faculty Analytics A Event Analytics A Executive Reports'
  },
  {
    id: 'club',
    title: 'Club & Event Portal',
    icon: Sparkles,
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    hoverBorder: 'hover:border-amber-500/60',
    btnColor: 'text-amber-400 group-hover:text-amber-300',
    glowColor: 'from-amber-600/20 to-transparent',
    features: 'Event Creation A Spectra Management A Venue Booking A Budget Requests A Participant Tracking A Event Calendar A Approval Tracking'
  },
  {
    id: 'faculty',
    title: 'Faculty Portal',
    icon: Users,
    iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/60',
    btnColor: 'text-purple-400 group-hover:text-purple-300',
    glowColor: 'from-purple-600/20 to-transparent',
    features: 'Teaching Schedule A Attendance Management A Student Performance A Assignment Management A Leave Requests A Extra Classes A Room Requests A AI Scheduling Assistant'
  },
  {
    id: 'hod',
    title: 'Dept. Coordinator / HOD Portal',
    icon: Cpu,
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-500/60',
    btnColor: 'text-cyan-400 group-hover:text-cyan-300',
    glowColor: 'from-cyan-600/20 to-transparent',
    features: 'Department Timetable A Faculty Allocation A Resource Management A Approval Center A Conflict Resolution A Lab Management A Department Analytics'
  }
];

export default function LandingPage() {
  const { switchPersona, setAuthModalOpen, setAuthTargetRole } = useCampus();

  const handleLaunch = (roleId) => {
    switchPersona(roleId);
  };

  const handleOpenAuth = (roleId = 'student') => {
    if (setAuthTargetRole) setAuthTargetRole(roleId);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/3 w-[36rem] h-[36rem] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with Tagline */}
          <div className="flex items-center gap-3">
            <UnifyLogo size="md" variant="light" />
          </div>

          {/* Right Header Status & Action */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider">LIVE</span>
            </div>

            <button
              onClick={() => handleLaunch('parent')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 px-3.5 py-2 text-xs font-bold text-teal-300 transition-all hover:scale-[1.02]"
            >
              <span>👨‍👦 Parent Portal</span>
            </button>

            <button
              onClick={() => handleOpenAuth('student')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Portal Cards Grid ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full my-auto">
        
        {/* Institutional Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chilika Institution of Technology (CIT)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ASTRACAMPUS
          </h1>
          <p className="text-sm sm:text-base font-semibold text-indigo-300/90 italic tracking-wide">
            &ldquo;Building the Intelligent Campus of Tomorrow.&rdquo;
          </p>
        </div>

        {/* Institutional Portals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => handleLaunch(portal.id)}
                className={`relative rounded-2xl bg-slate-900/85 border border-slate-800/90 p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer group ${portal.hoverBorder} hover:shadow-xl hover:shadow-indigo-950/50 hover:-translate-y-0.5`}
              >
                <div>
                  {/* Top Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${portal.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-white group-hover:text-white transition">
                    {portal.title}
                  </h3>

                  {/* Features List */}
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-normal">
                    {portal.features}
                  </p>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center justify-between">
                  <span className={`text-xs font-bold transition flex items-center gap-1.5 ${portal.btnColor}`}>
                    <span>Sign in with Google</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition">
                    Instant Access
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Security Trust Badges ──────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-slate-900/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>1 Google account = 1 portal only</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Role verified by Institution ID</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-400" />
            <span>End-to-end encrypted sessions</span>
          </div>
        </div>

      </main>

      {/* ── Modern Dynasty Footer ───────────────────────────────────── */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <UnifyLogo size="xs" variant="light" />
          <div className="text-xs text-slate-500 text-center md:text-right space-y-1">
            <div>
              &copy; 2026 ASTRACAMPUS • Chilika Institution of Technology (CIT) • Secured • PWA Ready
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Tagline: &ldquo;Building the Intelligent Campus of Tomorrow.&rdquo;
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}