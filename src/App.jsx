import React, { useState } from 'react';
import { NetworkProvider } from './context/NetworkContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CampusProvider, useCampus } from './context/CampusContext';
import Sidebar from './components/common/Sidebar';
import TopHeader from './components/common/TopHeader';
import OfflineBanner from './components/common/OfflineBanner';
import Toast from './components/common/Toast';

import LandingPage from './components/landing/LandingPage';
import GoogleAuthModal from './components/auth/GoogleAuthModal';
import EmailReceiptModal from './components/auth/EmailReceiptModal';

import StudentDashboard from './components/student/StudentDashboard';
import GuardTerminal from './components/security/GuardTerminal';
import AdminDashboard from './components/admin/AdminDashboard';
import MessView from './components/student/MessView';
import NoticeBoard from './components/notices/NoticeBoard';
import USSDSimulator from './components/accessibility/USSDSimulator';
import AdoptionRoadmap from './components/adoption/AdoptionRoadmap';

import TeacherDashboard from './components/teacher/TeacherDashboard';
import ParentPortal from './components/parent/ParentPortal';
import PrincipalPortal from './components/principal/PrincipalPortal';
import CalendarView from './components/campus/CalendarView';
import BusTracker from './components/campus/BusTracker';

import GatePassModal from './components/student/GatePassModal';
import ComplaintModal from './components/student/ComplaintModal';
import DocumentModal from './components/student/DocumentModal';
import EmergencyAlertModal from './components/common/EmergencyAlertModal';
import CampusBotModal from './components/common/CampusBotModal';
import ActionableNotificationModal from './components/common/ActionableNotificationModal';
import MessagingSystem from './components/common/MessagingSystem';

import TimetableManager from './components/scheduling/TimetableManager';
import VenueBookingManager from './components/scheduling/VenueBookingManager';
import ReschedulingEngine from './components/scheduling/ReschedulingEngine';
import JudgingCriteriaModal from './components/scheduling/JudgingCriteriaModal';
import UnifiedPortalHub from './components/portals/UnifiedPortalHub';
import StudentFeeManagement from './components/finance/StudentFeeManagement';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeRole, isLandingPage, actionableNotification, setActionableNotification } = useCampus();
  const { t } = useLanguage();

  // Reset activeTab cleanly when persona role switches
  React.useEffect(() => {
    setActiveTab('dashboard');
  }, [activeRole]);

  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [botModalOpen, setBotModalOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans">
        <LandingPage />
        <GoogleAuthModal />
        <EmailReceiptModal />
        <Toast />
      </div>
    );
  }

  const renderTabContent = () => {
    // If activeRole is parent, route directly to ParentPortal
    if (activeRole === 'parent') {
      return <ParentPortal initialTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // Direct routing for Financial Management / Fee Ledger
    if (activeTab === 'feeLedger' || activeTab === 'fees') {
      return <StudentFeeManagement initialView={activeRole === 'admin' ? 'accounts' : 'student'} />;
    }

    // 6 Unified Portals Sub-tabs routing
    const portalSubTabs = [
      'studentProfile', 'feeLedger', 'attendance', 'academicRecords', 'assignments', 'leaveRequests', 'eventRegistration', 'aiAssistant',
      'teachingSchedule', 'attendanceMgmt', 'studentPerformance', 'assignmentsMgmt', 'extraClasses', 'roomRequests', 'aiScheduling',
      'deptTimetable', 'facultyAllocation', 'resourceMgmt', 'approvalCenter', 'conflictResolution', 'labMgmt', 'deptAnalytics',
      'eventCreation', 'spectraMgmt', 'budgetRequests', 'participantTracking', 'eventCalendar', 'approvalTracking',
      'timetableGenerator', 'examScheduler', 'roomAllocation', 'userMgmt', 'venueMgmt', 'emergencyRescheduling', 'systemMonitoring', 'campusCommand',
      'campusOverview', 'attendanceAnalytics', 'infrastructureAnalytics', 'deptPerformance', 'facultyAnalytics', 'eventAnalytics', 'executiveReports'
    ];

    if (portalSubTabs.includes(activeTab)) {
      return <UnifiedPortalHub activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <UnifiedPortalHub activeTab={activeTab} setActiveTab={setActiveTab} />;

      case 'timetable':
        return <TimetableManager />;

      case 'venueBookings':
        return <VenueBookingManager />;

      case 'rescheduling':
        return <ReschedulingEngine />;

      case 'judgingCriteria':
        return <JudgingCriteriaModal />;

      case 'gatePass':
        if (activeRole === 'guard') return <GuardTerminal />;
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('gatePass.title')}</h2>
                <p className="text-xs text-slate-500 mt-1">{t('gatePass.subtitle')}</p>
              </div>
              <button onClick={() => setGatePassModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20">
                + Request Gate Pass
              </button>
            </div>
            <StudentDashboard onNavigateTab={setActiveTab} />
          </div>
        );

      case 'complaints':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('complaints.title')}</h2>
                <p className="text-xs text-slate-500 mt-1">{t('complaints.subtitle')}</p>
              </div>
              <button onClick={() => setComplaintModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20">
                + Report New Issue
              </button>
            </div>
            <AdminDashboard />
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('documents.title')}</h2>
                <p className="text-xs text-slate-500 mt-1">{t('documents.subtitle')}</p>
              </div>
              <button onClick={() => setDocModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20">
                Generate Bonafide / NOC
              </button>
            </div>
            <StudentDashboard onNavigateTab={setActiveTab} />
          </div>
        );

      case 'mess':
        return <MessView />;
      case 'notices':
        return <NoticeBoard />;
      case 'admin':
        return <AdminDashboard />;
      case 'ussdDemo':
        return <USSDSimulator />;
      case 'adoptionNote':
        return <AdoptionRoadmap />;
      case 'calendar':
        return <CalendarView />;
      case 'busTracker':
        return <BusTracker />;
      default:
        return <StudentDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-blue-500 selection:text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <TopHeader activeTab={activeTab} setMobileOpen={setMobileMenuOpen} onOpenMsg={() => setMsgOpen(true)} />
        <OfflineBanner />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderTabContent()}
        </main>

        <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">AstraCampus</span>
              <span>•</span>
              <span className="font-semibold text-indigo-700">Chilika Institution of Technology</span>
              <span>•</span>
              <span>AI Timetable Hub & Smart Campus OS</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <button
                onClick={() => setActiveTab('judgingCriteria')}
                className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors"
              >
                ⚖️ Judging Criteria & Validator
              </button>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Offline PWA Ready
              </span>
            </div>
          </div>
        </footer>
      </div>

      <GatePassModal isOpen={gatePassModalOpen} onClose={() => setGatePassModalOpen(false)} />
      <ComplaintModal isOpen={complaintModalOpen} onClose={() => setComplaintModalOpen(false)} />
      <DocumentModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />
      <EmergencyAlertModal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />
      <CampusBotModal isOpen={botModalOpen} onClose={() => setBotModalOpen(false)} onNavigate={setActiveTab} />
      <MessagingSystem isOpen={msgOpen} onClose={() => setMsgOpen(false)} />
      <GoogleAuthModal />
      <EmailReceiptModal />
      <ActionableNotificationModal
        isOpen={Boolean(actionableNotification)}
        notification={actionableNotification}
        onClose={() => setActionableNotification(null)}
      />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <NetworkProvider>
      <LanguageProvider>
        <CampusProvider>
          <MainApp />
        </CampusProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
}
