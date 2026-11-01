import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, RefreshCw, Award, Users, TrendingUp, 
  Sparkles, ShieldAlert, Swords, Download, RotateCcw, HelpCircle, 
  Layers, CheckCircle2, AlertTriangle, UserCircle, Bell, Search
} from 'lucide-react';

import CampusCommandCenter from './components/CampusCommandCenter';
import TimetableGrid from './components/TimetableGrid';
import DigitalTwin3D from './components/DigitalTwin3D';
import AICopilotModal from './components/AICopilotModal';
import RescheduleDiffViewer from './components/RescheduleDiffViewer';
import BookingManager from './components/BookingManager';
import ExamScheduler from './components/ExamScheduler';
import SmartAnalytics from './components/SmartAnalytics';
import ScheduleBattleMode from './components/ScheduleBattleMode';
import EmergencyModeModal from './components/EmergencyModeModal';
import ExplainModal from './components/ExplainModal';
import DemoTourModal from './components/DemoTourModal';
import fallbackData from './fallbackData.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('command'); // 'command', 'timetable', 'digital_twin', 'reschedule', 'fest', 'exams', 'analytics', 'battle'
  const [activeRole, setActiveRole] = useState('admin'); // 'admin', 'department_coordinator', 'faculty', 'club'
  
  // Data states initialized with bundled dataset
  const [status, setStatus] = useState(fallbackData.status || {});
  const [allData, setAllData] = useState(fallbackData.allData || {});
  const [schedule, setSchedule] = useState(fallbackData.schedule || {});
  const [bookingsData, setBookingsData] = useState(fallbackData.bookingsData || {});
  const [examsData, setExamsData] = useState(fallbackData.examsData || {});
  const [usersData, setUsersData] = useState(fallbackData.usersData || []);
  
  // Modals state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [explainTarget, setExplainTarget] = useState(null); // { type: 'session' | 'booking', id: '...' }
  const [highlightedRoom, setHighlightedRoom] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchInitialData = async () => {
    try {
      const [statusRes, dataRes, schedRes, bookRes, examRes, userRes] = await Promise.all([
        fetch('/api/status').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/data/all').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/schedule').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/fest/bookings').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/exams').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/users').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);
      if (statusRes) setStatus(statusRes);
      if (dataRes) setAllData(dataRes);
      if (schedRes) setSchedule(schedRes);
      if (bookRes) setBookingsData(bookRes);
      if (examRes) setExamsData(examRes);
      if (userRes && userRes.users) setUsersData(userRes.users);
    } catch (err) {
      console.warn("Operating in standalone static mode with bundled CIT dataset:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      setNotification({ type: 'success', message: 'Demo data cleanly reset to baseline!' });
      setTimeout(() => setNotification(null), 4000);
      fetchInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExplainSession = (sessionId) => {
    setExplainTarget({ type: 'session', id: sessionId });
  };

  const handleExplainBooking = (requestId) => {
    setExplainTarget({ type: 'booking', id: requestId });
  };

  const handleSelectRoomFrom3D = (roomId) => {
    setHighlightedRoom(roomId);
    setActiveTab('timetable');
  };

  const activeUser = usersData.find(u => u.role === activeRole) || {
    name: "Dean of Academics",
    role: "admin",
    email: "dean@cit.edu"
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Classical Academic Header */}
      <header className="border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo / Monogram */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-bold font-cinzel text-lg shadow-lg shadow-amber-500/20 border border-amber-400">
                CIT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel font-bold text-base md:text-lg tracking-wide text-slate-100">
                    AstraCampus
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
                    CIT v1.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-serif tracking-wider uppercase">
                  Chilika Institute of Technology · Estd. 1998
                </div>
              </div>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex items-center gap-2.5">
              {/* Judge Tour Button */}
              <button
                onClick={() => setIsTourOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition"
                title="Guided Walkthrough for Hackathon Judges"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Judge Tour</span>
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={handleResetDemoData}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition"
                title="Reset demo data to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>

              {/* Export JSON Button */}
              <a
                href="/api/export/schedule"
                download="schedule.json"
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition"
                title="Download schedule.json export"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Export JSON</span>
              </a>

              {/* Download Source Code in One File */}
              <a
                href="/api/download/source-code"
                download="AstraCampus_SourceCode.zip"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
                title="Download complete source code in one zip archive"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Source Code (.zip)</span>
              </a>

              {/* Role Switcher Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1">
                <UserCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Role:</div>
                  <select
                    value={activeRole}
                    onChange={(e) => setActiveRole(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-100 outline-none cursor-pointer"
                  >
                    <option value="admin" className="bg-slate-950 text-slate-100">Dean's Office (Admin)</option>
                    <option value="department_coordinator" className="bg-slate-950 text-slate-100">Dept Coordinator (CSE)</option>
                    <option value="faculty" className="bg-slate-950 text-slate-100">Faculty (Dr. Roy - F01)</option>
                    <option value="club" className="bg-slate-950 text-slate-100">Club Rep (Spectra)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs py-1">
            <button
              onClick={() => setActiveTab('command')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'command' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Command Center
            </button>

            <button
              onClick={() => setActiveTab('digital_twin')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'digital_twin' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              3D Digital Twin
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'timetable' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Timetable Grids
            </button>

            <button
              onClick={() => setActiveTab('reschedule')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'reschedule' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Rescheduling & Diff
            </button>

            <button
              onClick={() => setActiveTab('fest')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'fest' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Award className="w-3.5 h-3.5" />
              Spectra Fest Bookings
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'exams' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Midsem Exams (41)
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'analytics' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Smart Analytics
            </button>

            <button
              onClick={() => setActiveTab('battle')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium whitespace-nowrap ${activeTab === 'battle' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Swords className="w-3.5 h-3.5" />
              Battle Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <CampusCommandCenter 
              status={status}
              rooms={allData.rooms || []}
              faculty={allData.faculty || []}
              schedule={schedule}
              bookings={bookingsData.requests || []}
              exams={examsData.exams || []}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onOpenBattle={() => setActiveTab('battle')}
              onResetDemo={handleResetDemoData}
              onSelectTab={setActiveTab}
            />

            {/* Embedded 3D Campus on Dashboard */}
            <div className="mt-8">
              <DigitalTwin3D 
                rooms={allData.rooms || []}
                scheduleSessions={schedule.sessions || []}
                festBookings={bookingsData.requests || []}
                onSelectRoom={handleSelectRoomFrom3D}
              />
            </div>
          </div>
        )}

        {activeTab === 'digital_twin' && (
          <DigitalTwin3D 
            rooms={allData.rooms || []}
            scheduleSessions={schedule.sessions || []}
            festBookings={bookingsData.requests || []}
            onSelectRoom={handleSelectRoomFrom3D}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableGrid 
            schedule={schedule}
            groups={allData.student_groups || []}
            faculty={allData.faculty || []}
            rooms={allData.rooms || []}
            initialRoomFilter={highlightedRoom}
            onExplainSession={handleExplainSession}
          />
        )}

        {activeTab === 'reschedule' && (
          <RescheduleDiffViewer 
            activeRole={activeRole}
            onApproveSuccess={fetchInitialData}
          />
        )}

        {activeTab === 'fest' && (
          <BookingManager 
            bookingsData={bookingsData}
            onExplainBooking={handleExplainBooking}
          />
        )}

        {activeTab === 'exams' && (
          <ExamScheduler 
            examsData={examsData}
          />
        )}

        {activeTab === 'analytics' && (
          <SmartAnalytics 
            schedule={schedule}
            status={status}
          />
        )}

        {activeTab === 'battle' && (
          <ScheduleBattleMode 
            onApplySchedule={fetchInitialData}
          />
        )}
      </main>

      {/* Classical Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-amber-500">CIT AstraCampus</span>
            <span>· Chilika Institute of Technology · Operational Scheduling System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Constraint Solver: Google OR-Tools CP-SAT</span>
            <span>·</span>
            <span>Validator: Python Standard Library Compliant</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <AICopilotModal 
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeRole={activeRole}
        onSubmitBooking={() => {
          setNotification({ type: 'success', message: 'Venue request submitted for Spectra Week review!' });
          setTimeout(() => setNotification(null), 4000);
        }}
      />

      <EmergencyModeModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onTriggerRecovery={() => {
          fetchInitialData();
          setNotification({ type: 'success', message: 'Emergency recovery executed: all sessions rerouted!' });
          setTimeout(() => setNotification(null), 4000);
        }}
      />

      <ExplainModal 
        isOpen={explainTarget !== null}
        onClose={() => setExplainTarget(null)}
        explainTarget={explainTarget}
      />

      <DemoTourModal 
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
