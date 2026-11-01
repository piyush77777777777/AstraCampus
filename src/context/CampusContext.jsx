import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialPersonas,
  initialGatePasses,
  initialComplaints,
  initialNotices,
  initialMessData,
  initialAuditLogs,
  initialNotifications,
  campusHotspotStats,
  busRoutes,
  examCalendar
} from '../data/initialData';
import { useNetwork } from './NetworkContext';
import { complaintApi, notificationApi } from '../services/api';
import { subscribeToPortalChanges } from '../services/supabaseRealtime';

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const { isOffline, addToOfflineQueue, offlineQueue, clearQueue, showToast, networkMode } = useNetwork();

  // Active user persona: 'student' | 'warden' | 'guard' | 'messManager' | 'teacher' | 'parent' | 'principal'
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('UNIFY_active_role') || 'student';
  });

  const DEFAULT_USER = {
    name: "Piyush Kumar Dey",
    email: "piyush.dey@campus.edu",
    role: "student",
    provider: "Google",
    signedInAt: "10:30 AM"
  };

  // Current logged in user object
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ASTRACAMPUS_current_user') || localStorage.getItem('UNIFY_current_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && typeof parsed === 'object') ? parsed : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // View mode: Landing Page vs Dashboard
  const [isLandingPage, setIsLandingPage] = useState(() => {
    return localStorage.getItem('UNIFY_view_mode') !== 'app';
  });

  // Google Auth & Email Receipt Dialog States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState('student');
  const [emailReceipt, setEmailReceipt] = useState({
    isOpen: false,
    email: '',
    role: '',
    timestamp: '',
    token: ''
  });

  // 4-Stage Actionable Notification Modal State
  const [actionableNotification, setActionableNotification] = useState(null);

  const [gatePasses, setGatePasses] = useState(() => {
    const saved = localStorage.getItem('UNIFY_gate_passes');
    return saved ? JSON.parse(saved) : initialGatePasses;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('UNIFY_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('UNIFY_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [messData, setMessData] = useState(() => {
    const saved = localStorage.getItem('UNIFY_mess_data');
    return saved ? JSON.parse(saved) : initialMessData;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('UNIFY_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('UNIFY_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // ── Approval Workflow State ──────────────────────────────────────
  const [venueRequests, setVenueRequests] = useState(() => {
    const saved = localStorage.getItem('UNIFY_venue_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'VR-2026-0011',
        requesterName: 'Spectra Tech Club',
        requesterRole: 'club',
        venue: 'Main Auditorium (Aryabhatta Hall)',
        venueId: 'AH-01',
        eventName: 'Spectra Annual Tech Fest 2026',
        eventDate: 'Day 7 (Friday)',
        timeSlot: '09:00 – 18:00',
        expectedAttendees: 400,
        purpose: 'Annual technical symposium with guest lectures, hackathon and cultural events.',
        status: 'PENDING',
        submittedAt: '2026-11-01 08:15',
        adminRemark: null
      },
      {
        id: 'VR-2026-0012',
        requesterName: 'CSE Department',
        requesterRole: 'faculty',
        venue: 'Seminar Hall (SH-01)',
        venueId: 'SH-01',
        eventName: 'Industry Expert Seminar – ML in Healthcare',
        eventDate: 'Day 5 (Wednesday)',
        timeSlot: '14:00 – 16:00',
        expectedAttendees: 80,
        purpose: 'Guest lecture by Dr. Amit Sharma (IIT Bhubaneswar) on applied ML.',
        status: 'APPROVED',
        submittedAt: '2026-10-30 10:00',
        adminRemark: 'Approved. Ensure AV setup and seating by 13:30.'
      }
    ];
  });

  const [roomRequests, setRoomRequests] = useState(() => {
    const saved = localStorage.getItem('UNIFY_room_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'RR-2026-0031',
        requesterName: 'Prof. Ananya Verma',
        requesterRole: 'faculty',
        department: 'CSE',
        roomId: 'LH-01',
        roomName: 'Lecture Hall 1 (LH-01)',
        date: 'Day 4 (Tuesday)',
        timeSlot: 'Period 5 (13:00 – 13:55)',
        purpose: 'Extra DBMS lecture to compensate missed class (faculty leave Day 2).',
        status: 'PENDING',
        submittedAt: '2026-11-01 07:50',
        hodRemark: null
      }
    ];
  });

  const [extraClassRequests, setExtraClassRequests] = useState(() => {
    const saved = localStorage.getItem('UNIFY_extra_class_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'EC-2026-0021',
        requesterName: 'Dr. Ramesh Chandra',
        requesterRole: 'faculty',
        department: 'CSE',
        course: 'CST301 – Operating Systems',
        group: 'G-CSE-3A',
        date: 'Day 6 (Thursday)',
        timeSlot: 'Period 7 (15:00 – 15:55)',
        room: 'CR-103',
        reason: 'Missed OS lecture due to university committee meeting.',
        status: 'APPROVED',
        submittedAt: '2026-10-31 18:00',
        hodRemark: 'Approved. Inform students via notice board.'
      }
    ];
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('UNIFY_leave_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'LR-2026-0051',
        requesterName: 'Prof. Jagabandhu Nayak',
        requesterRole: 'faculty',
        department: 'CSE',
        leaveType: 'Medical Leave',
        fromDate: 'Day 3 (Monday)',
        toDate: 'Day 4 (Tuesday)',
        reason: 'Hospitalization due to fever and dehydration.',
        coverArranged: 'Dr. Pravat Kumar Sahoo will cover DAA sessions.',
        status: 'APPROVED',
        submittedAt: '2026-10-29 22:10',
        hodRemark: 'Approved. Get well soon. Cover confirmed.'
      },
      {
        id: 'LR-2026-0052',
        requesterName: 'Piyush Kumar Dey',
        requesterRole: 'student',
        department: 'CSE',
        leaveType: 'Medical Leave',
        fromDate: 'Day 5 (Wednesday)',
        toDate: 'Day 5 (Wednesday)',
        reason: 'Dental appointment at SCB Medical College.',
        coverArranged: 'N/A',
        status: 'PENDING',
        submittedAt: '2026-11-01 07:30',
        hodRemark: null
      }
    ];
  });

  // Current active persona details
  const currentPersona = initialPersonas[activeRole] || initialPersonas.student;

  useEffect(() => {
    if (isOffline || !localStorage.getItem('UNIFY_access_token')) return undefined;

    const profileId = currentUser?.profileId;
    const campusId = currentUser?.campusId || import.meta.env.VITE_CAMPUS_ID;
    if (!profileId || !campusId) return undefined;

    const refreshNotifications = () => notificationApi.list().then((items) => {
      if (items && items.length > 0) setNotifications(items);
    }).catch(() => undefined);

    const refreshPortalState = (table) => {
      if (table === 'notifications') return refreshNotifications();
      if (table === 'complaints') {
        const source = activeRole === 'student' ? complaintApi.listMine() : complaintApi.listCampus(campusId);
        return source.then((items) => items && setComplaints(items));
      }
      return Promise.resolve();
    };

    void refreshNotifications();
    return subscribeToPortalChanges({
      profileId,
      campusId,
      studentId: currentUser?.studentId,
      isStaff: activeRole !== 'student',
      onChange: (table) => { void refreshPortalState(table); },
      onReconnect: () => { void refreshNotifications(); void refreshPortalState('complaints'); }
    });
  }, [activeRole, currentUser?.campusId, currentUser?.profileId, currentUser?.studentId, isOffline]);

  useEffect(() => {
    if (isOffline || !localStorage.getItem('UNIFY_access_token')) return;

    const campusId = currentUser?.campusId || import.meta.env.VITE_CAMPUS_ID;
    if (activeRole !== 'student' && campusId) {
      complaintApi.listCampus(campusId)
        .then((serverComplaints) => {
          if (serverComplaints) setComplaints(serverComplaints.map((complaint) => ({
            ...complaint,
            studentId: complaint.student_id,
            reportedBy: complaint.reporter_profile_id,
            photoUrl: complaint.photo_url,
            assignedTo: complaint.assigned_group || complaint.assigned_to || 'Assigned Staff',
            timeline: complaint.history || []
          })));
        })
        .catch(() => undefined);
      return;
    }

    if (activeRole !== 'student') return;

    complaintApi.listMine()
      .then((serverComplaints) => {
        if (serverComplaints) setComplaints(serverComplaints.map((complaint) => ({
          ...complaint,
          studentId: complaint.student_id,
          reportedBy: currentUser?.name || 'Student',
          photoUrl: complaint.photo_url,
          assignedTo: complaint.assigned_group || complaint.assigned_to || 'Assigned Staff',
          timeline: complaint.history || []
        })));
      })
      .catch(() => undefined);
  }, [activeRole, currentUser?.campusId, currentUser?.name, isOffline]);

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem('UNIFY_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('UNIFY_gate_passes', JSON.stringify(gatePasses));
  }, [gatePasses]);

  useEffect(() => {
    localStorage.setItem('UNIFY_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('UNIFY_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('UNIFY_mess_data', JSON.stringify(messData));
  }, [messData]);

  useEffect(() => {
    localStorage.setItem('UNIFY_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('UNIFY_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync offline items when network mode switches to online
  useEffect(() => {
    if (networkMode === 'online' && offlineQueue.length > 0) {
      showToast(`🔄 Connected! Synced ${offlineQueue.length} offline actions to UNIFY Server.`, 'success');
      
      offlineQueue.forEach(item => {
        if (item.type === 'NEW_COMPLAINT') {
          setComplaints(prev => [item.payload, ...prev]);
        } else if (item.type === 'NEW_GATE_PASS') {
          setGatePasses(prev => [item.payload, ...prev]);
        } else if (item.type === 'MEAL_POLL') {
          handleMealDecisionInternal(item.payload.decision);
        }
      });
      clearQueue();
    }
  }, [networkMode]);

  // Add an audit log entry
  const addAuditLog = (actor, action, details, badgeColor = 'blue') => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor,
      action,
      details,
      badgeColor
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // AI & Heuristic Analysis for Incidents
  const analyzeIncidentWithAI = (title, description, category) => {
    const lower = `${title} ${description} ${category}`.toLowerCase();
    let autoDept = 'General Maintenance';
    let urgency = 'NORMAL';
    let slaHours = 24;
    let safetyHazardLevel = 'NONE';
    let failureModes = ['General resolution latency'];
    let preventativeChecks = ['Conduct routine inspection'];

    if (lower.includes('spark') || lower.includes('shock') || lower.includes('wire') || lower.includes('switch') || lower.includes('fire')) {
      autoDept = 'Electrical Maintenance';
      urgency = 'HIGH';
      safetyHazardLevel = 'CRITICAL';
      slaHours = 4;
      failureModes = [
        'Electrical arc flash or resident quarters fire',
        'Cascading MCB breaker tripping across floor',
        'Direct student electrocution hazard'
      ];
      preventativeChecks = [
        'Isolate floor MCB circuit breaker before handling',
        'Verify point termination load balance',
        'Use certified insulated multi-meter testing'
      ];
    } else if (lower.includes('leak') || lower.includes('tap') || lower.includes('water') || lower.includes('drain') || lower.includes('flood')) {
      autoDept = 'Plumbing Maintenance';
      urgency = 'HIGH';
      safetyHazardLevel = 'ELEVATED';
      slaHours = 8;
      failureModes = [
        'Seepage into lower floor ceiling plaster',
        'Corridor slip hazard for student residents',
        'Overnight rooftop header tank depletion'
      ];
      preventativeChecks = [
        'Shut off main vertical riser valve',
        'Verify pressure release gasket integrity',
        'Deploy dry mops in common areas'
      ];
    } else if (lower.includes('wifi') || lower.includes('net') || lower.includes('router') || lower.includes('lan')) {
      autoDept = 'IT & Campus Network Cell';
      urgency = 'MEDIUM';
      safetyHazardLevel = 'LOW';
      slaHours = 12;
      failureModes = ['Academic portal submission disruption'];
      preventativeChecks = ['Reboot floor PoE access switch'];
    }

    return {
      autoDept,
      urgency,
      slaHours,
      riskAnalysis: {
        safetyHazardLevel,
        failureModes,
        preventativeChecks
      },
      suggestedActions: [
        {
          actionId: 'DISPATCH_DUTY_TECHNICIAN',
          label: `Dispatch ${autoDept} Technician`,
          description: `Route work order with priority SLA target of ${slaHours}h.`,
          impact: `Dispatches immediate push alert to on-duty team.`
        },
        {
          actionId: 'REQUEST_INSPECTION_CALLBACK',
          label: 'Request Resident Availability Confirmation',
          description: 'Ask resident student for specific room inspection slot.',
          impact: 'Pushes prompt to student dashboard.'
        }
      ],
      remediationChecklist: preventativeChecks
    };
  };

  // ── Universal 4-Stage Notification System Handlers ──────────────
  const dispatchUniversalNotification = (payload) => {
    const newNotif = {
      id: `NOTIF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: payload.title,
      message: payload.message,
      priority: payload.priority || 'NORMAL',
      delivery_status: 'dispatched',
      location: payload.location || 'Campus Wide',
      targetRoles: payload.targetRoles || ['warden'],
      entityType: payload.entityType || 'general',
      entityId: payload.entityId || null,
      read_at: null,
      acknowledged_at: null,
      action_taken_at: null,
      verified_at: null,
      riskAnalysis: payload.riskAnalysis || {
        safetyHazardLevel: 'NONE',
        failureModes: ['Operational latency if unhandled'],
        preventativeChecks: ['Verify compliance log']
      },
      suggestedActions: payload.suggestedActions || [
        { actionId: 'RESOLVE_DEFAULT', label: '1-Click Confirm & Acknowledge', description: 'Confirm receipt and authorize operation.', impact: 'Closes notification loop.' }
      ]
    };

    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationRead = (notificationId) => {
    notificationApi.markRead(notificationId).catch(() => undefined);
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const acknowledgeNotification = (notificationId) => {
    notificationApi.acknowledge(notificationId).catch(() => undefined);
    setNotifications(prev => prev.map(n => n.id === notificationId ? {
      ...n,
      delivery_status: 'acknowledged',
      acknowledged_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read_at: n.read_at || new Date().toISOString()
    } : n));
    addAuditLog(currentPersona.name, 'ACKNOWLEDGED_NOTIFICATION', `Device handshake confirmed for ${notificationId}`, 'blue');
    showToast('📱 Device Acknowledgment Handshake Confirmed.', 'info');
  };

  const executeNotificationAction = (notificationId, actionId) => {
    notificationApi.takeAction(notificationId, { actionId }).catch(() => undefined);
    setNotifications(prev => prev.map(n => n.id === notificationId ? {
      ...n,
      delivery_status: 'action_taken',
      action_taken_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : n));
    addAuditLog(currentPersona.name, 'ACTION_EXECUTED', `Executed action ${actionId} on notification ${notificationId}`, 'emerald');
    showToast(`⚡ AI Action Executed: ${actionId}`, 'success');
  };

  const verifyNotificationAction = (notificationId, verificationProof) => {
    notificationApi.verify(notificationId, { verificationProof }).catch(() => undefined);
    setNotifications(prev => prev.map(n => n.id === notificationId ? {
      ...n,
      delivery_status: 'verified',
      verification_proof: verificationProof,
      verified_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : n));
    addAuditLog(currentPersona.name, 'VERIFICATION_SEAL', `Cryptographically sealed ${notificationId} with ${verificationProof}`, 'purple');
    showToast(`🛡️ Verified & Cryptographically Sealed (${verificationProof})`, 'success');
  };

  // ── Multi-Portal Gate Pass Actions ──────────────────────────────
  const createGatePass = (data) => {
    const newPass = {
      id: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentPersona.id,
      studentName: currentPersona.name,
      regNo: currentPersona.regNo,
      room: currentPersona.room,
      passType: data.passType || 'Day Outing',
      destination: data.destination,
      outTime: data.outTime || 'Today, 17:30',
      expectedInTime: data.expectedInTime || 'Today, 21:00',
      actualOutTime: null,
      actualInTime: null,
      status: 'PENDING',
      approvedBy: null,
      approvedAt: null,
      qrToken: `CIT-GP-SECURE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      guardianAlertSent: false,
      emergencyPhone: data.emergencyPhone || currentPersona.guardianPhone,
      remarks: data.remarks || 'Standard Student Outing Request'
    };

    setGatePasses(prev => [newPass, ...prev]);

    // Dispatch Universal Notification to Warden & Security
    dispatchUniversalNotification({
      title: `Gate Pass: ${newPass.studentName} (${newPass.room})`,
      message: `${newPass.studentName} requested ${newPass.passType} to ${newPass.destination} (Return by ${newPass.expectedInTime}).`,
      priority: 'NORMAL',
      location: `Hostel ${currentPersona.hostel} - Room ${currentPersona.room}`,
      targetRoles: ['warden', 'guard'],
      entityType: 'gate_pass',
      entityId: newPass.id,
      riskAnalysis: {
        safetyHazardLevel: 'LOW',
        failureModes: ['Late return beyond 21:00 curfew', 'Parental non-reachability'],
        preventativeChecks: ['Verify parental contact registry', 'Check student academic attendance threshold']
      },
      suggestedActions: [
        { actionId: 'APPROVE_GATEPASS', label: '1-Click Approve Pass', description: 'Activate dynamic turnstile QR token.', impact: 'Generates active QR token & dispatches parent SMS.' },
        { actionId: 'HOLD_FOR_PARENT', label: 'Require Guardian Consent', description: 'Trigger automated parent SMS confirmation.', impact: 'Holds pass in pending status.' }
      ]
    });

    addAuditLog(currentPersona.name, 'REQUESTED_GATE_PASS', `Submitted gate pass for ${newPass.destination}`, 'blue');
    showToast('✅ Gate pass requested. Sent to Chief Warden for 1-click approval.', 'success');
    return newPass;
  };

  const approveGatePass = (passId, wardenRemarks = 'Approved by Chief Warden') => {
    setGatePasses(prev => prev.map(gp => {
      if (gp.id === passId) {
        return {
          ...gp,
          status: 'APPROVED',
          approvedBy: currentPersona.name,
          approvedAt: 'Just now',
          guardianAlertSent: true,
          remarks: wardenRemarks
        };
      }
      return gp;
    }));
    addAuditLog(currentPersona.name, 'APPROVED_GATE_PASS', `Approved gate pass ${passId}. Parent SMS triggered.`, 'emerald');
    showToast(`✅ Gate Pass ${passId} Approved! Dynamic QR is now active for turnstile exit.`, 'success');
  };

  const rejectGatePass = (passId, reason = 'Curfew or academic conflict') => {
    setGatePasses(prev => prev.map(gp => gp.id === passId ? { ...gp, status: 'REJECTED', remarks: reason } : gp));
    addAuditLog(currentPersona.name, 'REJECTED_GATE_PASS', `Rejected pass ${passId}: ${reason}`, 'red');
    showToast(`❌ Gate pass ${passId} rejected.`, 'error');
  };

  const scanGateExit = (passId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => gp.id === passId ? { ...gp, status: 'CHECKED_OUT', actualOutTime: timeNow } : gp));
    addAuditLog('Main Gate Security (Subedar Ram Singh)', 'SECURITY_SCAN_OUT', `Verified and allowed exit for ${passId} at ${timeNow}`, 'amber');
    showToast(`🚪 Security Check: Student Checked OUT at ${timeNow}. Parent notified.`, 'success');
  };

  const scanGateEntry = (passId) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => gp.id === passId ? { ...gp, status: 'COMPLETED', actualInTime: timeNow } : gp));
    addAuditLog('Main Gate Security (Subedar Ram Singh)', 'SECURITY_SCAN_IN', `Recorded safe campus return for ${passId} at ${timeNow}`, 'emerald');
    showToast(`🛡️ Student safely returned to campus at ${timeNow}.`, 'success');
  };

  // ── Campus Chat Direct Dispatch Helper ──────────────────────────
  const dispatchChatMessage = (convId, fromRole, text) => {
    try {
      const convs = JSON.parse(localStorage.getItem('ASTRACAMPUS_MESSAGES') || '[]');
      const updated = convs.map(c => {
        if (c.id === convId) {
          const newMsg = {
            id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            from: fromRole,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          };
          return {
            ...c,
            messages: [...(c.messages || []), newMsg],
            lastMessage: text,
            lastTime: 'Just now',
            unread: (c.unread || 0) + 1
          };
        }
        return c;
      });
      localStorage.setItem('ASTRACAMPUS_MESSAGES', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('dispatchChatMessage failed', e);
    }
  };

  // ── Venue Booking Request Actions ───────────────────────────────
  const createVenueRequest = (data) => {
    const req = {
      id: `VR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: currentPersona.name,
      requesterRole: activeRole,
      venue: data.venue || 'Main Auditorium (Aryabhatta Hall)',
      venueId: data.venueId || 'AH-01',
      eventName: data.eventName,
      eventDate: data.eventDate || 'Day 7 (Friday)',
      timeSlot: data.timeSlot || '18:00 — 21:00',
      expectedAttendees: data.expectedAttendees || 50,
      purpose: data.purpose || 'Spectra Campus Event',
      status: 'PENDING',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      adminRemark: null
    };
    setVenueRequests(prev => [req, ...prev]);
    localStorage.setItem('ASTRACAMPUS_venue_requests', JSON.stringify([req, ...venueRequests]));
    localStorage.setItem('UNIFY_venue_requests', JSON.stringify([req, ...venueRequests]));

    // Dispatch Universal Notification to Admin & Dean
    dispatchUniversalNotification({
      title: `New Venue Request: ${req.eventName}`,
      message: `${req.requesterName} requested ${req.venue} for ${req.eventDate} (${req.timeSlot}). Awaiting Dean approval.`,
      priority: 'HIGH',
      location: req.venue,
      targetRoles: ['admin', 'coordinator'],
      entityType: 'venue_request',
      entityId: req.id,
      riskAnalysis: {
        safetyHazardLevel: 'LOW',
        failureModes: ['Scheduling collision with academic lectures', 'Room capacity overflow'],
        preventativeChecks: ['Verify Priority 6 against timetable sessions', 'Check venue maintenance schedule']
      },
      suggestedActions: [
        { actionId: 'APPROVE_VENUE', label: 'Approve Venue Request', description: 'Grant venue reservation and lock room.', impact: 'Dispatches approval receipt to club.' },
        { actionId: 'SUGGEST_ALT', label: 'Suggest Evening Alternative', description: 'Offer P10-P12 non-academic period.', impact: 'Avoids daytime class clashes.' }
      ]
    });

    // Automatically post chat message into Club <-> Admin conversation (conv-003)
    dispatchChatMessage(
      'conv-003',
      'club',
      `Dean Sir, Spectra Tech Club has submitted venue booking request ${req.id} for "${req.eventName}" at ${req.venue} (${req.eventDate}, ${req.timeSlot}). Requesting Dean's Office approval.`
    );

    addAuditLog(currentPersona.name, 'VENUE_REQUEST_SUBMITTED', `Submitted venue request for ${data.eventName} at ${data.venue}`, 'blue');
    showToast(`✅ Venue request ${req.id} submitted! Dean's Office notified.`, 'success');
    return req;
  };

  const approveVenueRequest = (id, remark = 'Approved by Dean\'s Office') => {
    let approvedItem = null;
    setVenueRequests(prev => prev.map(r => {
      if (r.id === id) {
        approvedItem = { ...r, status: 'APPROVED', adminRemark: remark };
        return approvedItem;
      }
      return r;
    }));

    // Dispatch Universal Notification back to Club
    dispatchUniversalNotification({
      title: `Venue Booking APPROVED: ${approvedItem?.eventName || id}`,
      message: `Dean's Office has APPROVED venue booking ${id} for ${approvedItem?.venue || 'Venue'}. Remark: ${remark}`,
      priority: 'NORMAL',
      location: approvedItem?.venue || 'Campus Venue',
      targetRoles: ['club'],
      entityType: 'venue_request',
      entityId: id
    });

    // Automatically post approval chat message from Admin in conv-003
    dispatchChatMessage(
      'conv-003',
      'admin',
      `Dean's Office: Your venue booking ${id} for "${approvedItem?.eventName || 'Event'}" has been APPROVED. Remark: ${remark}. AV and venue security arranged.`
    );

    addAuditLog(currentPersona.name, 'VENUE_REQUEST_APPROVED', `Approved venue request ${id}: ${remark}`, 'emerald');
    showToast(`✅ Venue request ${id} approved! Message dispatched to Club.`, 'success');
  };

  const rejectVenueRequest = (id, remark = 'Rejected due to academic schedule priority') => {
    let rejectedItem = null;
    setVenueRequests(prev => prev.map(r => {
      if (r.id === id) {
        rejectedItem = { ...r, status: 'REJECTED', adminRemark: remark };
        return rejectedItem;
      }
      return r;
    }));

    // Dispatch Universal Notification to Club
    dispatchUniversalNotification({
      title: `Venue Booking Rejected: ${rejectedItem?.eventName || id}`,
      message: `Dean's Office rejected booking ${id}. Reason: ${remark}`,
      priority: 'NORMAL',
      location: rejectedItem?.venue || 'Campus Venue',
      targetRoles: ['club'],
      entityType: 'venue_request',
      entityId: id
    });

    // Automatically post rejection chat message from Admin in conv-003
    dispatchChatMessage(
      'conv-003',
      'admin',
      `Dean's Office: Booking request ${id} for "${rejectedItem?.eventName || 'Event'}" has been REJECTED. Reason: ${remark}. Suggested alternative: Evening slot (18:00 onwards).`
    );

    addAuditLog(currentPersona.name, 'VENUE_REQUEST_REJECTED', `Rejected venue request ${id}: ${remark}`, 'red');
    showToast(`❌ Venue request ${id} rejected. Reason sent to Club.`, 'error');
  };

  // ── Room Request Actions ─────────────────────────────────────────
  const createRoomRequest = (data) => {
    const req = {
      id: `RR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: currentPersona.name,
      requesterRole: activeRole,
      department: currentPersona.department || 'CSE',
      roomId: data.roomId,
      roomName: data.roomName,
      date: data.date,
      timeSlot: data.timeSlot,
      purpose: data.purpose,
      status: 'PENDING',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      hodRemark: null
    };
    setRoomRequests(prev => [req, ...prev]);
    addAuditLog(currentPersona.name, 'ROOM_REQUEST_SUBMITTED', `Submitted room request for ${data.roomName} on ${data.date}`, 'blue');
    showToast(`✅ Room request submitted! HOD will review shortly.`, 'success');
    return req;
  };

  const approveRoomRequest = (id, remark = 'Approved') => {
    setRoomRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'ROOM_REQUEST_APPROVED', `Approved room request ${id}`, 'emerald');
    showToast(`✅ Room request ${id} approved!`, 'success');
  };

  const rejectRoomRequest = (id, remark = 'Not available') => {
    setRoomRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'ROOM_REQUEST_REJECTED', `Rejected room request ${id}: ${remark}`, 'red');
    showToast(`❌ Room request ${id} rejected.`, 'error');
  };

  // ── Extra Class Request Actions ──────────────────────────────────
  const createExtraClassRequest = (data) => {
    const req = {
      id: `EC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: currentPersona.name,
      requesterRole: activeRole,
      department: currentPersona.department || 'CSE',
      course: data.course,
      group: data.group,
      date: data.date,
      timeSlot: data.timeSlot,
      room: data.room,
      reason: data.reason,
      status: 'PENDING',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      hodRemark: null
    };
    setExtraClassRequests(prev => [req, ...prev]);
    addAuditLog(currentPersona.name, 'EXTRA_CLASS_SUBMITTED', `Submitted extra class request for ${data.course}`, 'blue');
    showToast(`✅ Extra class request submitted to HOD!`, 'success');
    return req;
  };

  const approveExtraClassRequest = (id, remark = 'Approved') => {
    setExtraClassRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'EXTRA_CLASS_APPROVED', `Approved extra class request ${id}`, 'emerald');
    showToast(`✅ Extra class ${id} approved!`, 'success');
  };

  const rejectExtraClassRequest = (id, remark = 'Scheduling conflict') => {
    setExtraClassRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'EXTRA_CLASS_REJECTED', `Rejected extra class ${id}: ${remark}`, 'red');
    showToast(`❌ Extra class request ${id} rejected.`, 'error');
  };

  // ── Leave Request Actions ────────────────────────────────────────
  const createLeaveRequest = (data) => {
    const req = {
      id: `LR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: currentPersona.name,
      requesterRole: activeRole,
      department: currentPersona.department || 'CSE',
      leaveType: data.leaveType || 'Casual Leave',
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
      coverArranged: data.coverArranged || 'N/A',
      status: 'PENDING',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      hodRemark: null
    };
    setLeaveRequests(prev => [req, ...prev]);
    addAuditLog(currentPersona.name, 'LEAVE_REQUEST_SUBMITTED', `Submitted ${data.leaveType} leave request`, 'blue');
    showToast(`✅ Leave request submitted! HOD will review.`, 'success');
    return req;
  };

  const approveLeaveRequest = (id, remark = 'Approved') => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'LEAVE_APPROVED', `Approved leave request ${id}`, 'emerald');
    showToast(`✅ Leave ${id} approved!`, 'success');
  };

  const rejectLeaveRequest = (id, remark = 'Insufficient notice / academic conflict') => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', hodRemark: remark } : r));
    addAuditLog(currentPersona.name, 'LEAVE_REJECTED', `Rejected leave ${id}: ${remark}`, 'red');
    showToast(`❌ Leave request ${id} rejected.`, 'error');
  };

  // ── Multi-Portal Complaint Actions with AI Diagnosis ───────────
  const createComplaint = (data) => {
    const aiAnalysis = analyzeIncidentWithAI(data.title, data.description, data.category || 'General');

    const newTicket = {
      id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      description: data.description,
      category: data.category || 'Hostel Maintenance',
      location: data.location || `${currentPersona.hostel} - Room ${currentPersona.room}`,
      urgency: data.urgency || aiAnalysis.urgency,
      reportedBy: `${currentPersona.name} (${currentPersona.room})`,
      studentId: currentPersona.id,
      reportedDaysAgo: 0,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      assignedTo: `Auto-routed to ${aiAnalysis.autoDept}`,
      slaBreached: false,
      slaTargetHours: aiAnalysis.slaHours,
      escalationLevel: 'Level 1: AI Dispatched',
      photoUrl: data.photoUrl || null,
      riskAnalysis: aiAnalysis.riskAnalysis,
      suggestedActions: aiAnalysis.suggestedActions,
      timeline: [
        {
          timestamp: 'Just now',
          note: `Ticket created via UNIFY. AI analyzed severity (${aiAnalysis.riskAnalysis.safetyHazardLevel}) & routed to ${aiAnalysis.autoDept} (SLA: ${aiAnalysis.slaHours}h).`,
          author: 'UNIFY AI Decision Engine'
        }
      ]
    };

    setComplaints(prev => [newTicket, ...prev]);

    // Dispatch Universal Notification to Maintenance Staff & Warden
    dispatchUniversalNotification({
      title: `Grievance: ${newTicket.title}`,
      message: `${newTicket.reportedBy} reported "${newTicket.description}" at ${newTicket.location}. AI Hazard: ${aiAnalysis.riskAnalysis.safetyHazardLevel}.`,
      priority: aiAnalysis.urgency,
      location: newTicket.location,
      targetRoles: ['warden', 'principal'],
      entityType: 'complaint',
      entityId: newTicket.id,
      riskAnalysis: aiAnalysis.riskAnalysis,
      suggestedActions: aiAnalysis.suggestedActions
    });

    addAuditLog(currentPersona.name, 'FILED_COMPLAINT', `Filed ticket: ${newTicket.title} (${newTicket.category})`, 'blue');
    showToast(`🛠️ Ticket ${newTicket.id} created! AI routed to ${aiAnalysis.autoDept}.`, 'success');
    return newTicket;
  };

  const updateComplaintStatus = (ticketId, newStatus, resolutionNote = '', feedbackRating = null) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        const updatedTimeline = [
          ...c.timeline,
          {
            timestamp: 'Just now',
            note: resolutionNote || `Status updated to ${newStatus} by ${currentPersona.name}`,
            author: currentPersona.name
          }
        ];
        return {
          ...c,
          status: newStatus,
          resolutionNote: resolutionNote || c.resolutionNote,
          feedbackRating: feedbackRating || c.feedbackRating,
          timeline: updatedTimeline
        };
      }
      return c;
    }));
    addAuditLog(currentPersona.name, 'UPDATED_TICKET', `Updated ticket ${ticketId} to status: ${newStatus}`, 'emerald');
    showToast(`Ticket ${ticketId} updated to ${newStatus}.`, 'info');
  };

  const escalateComplaint = (ticketId) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === ticketId) {
        return {
          ...c,
          status: 'ESCALATED',
          slaBreached: true,
          escalationLevel: 'Level 2: Chief Warden Priority Intervention',
          timeline: [
            ...c.timeline,
            {
              timestamp: 'Just now',
              note: `Urgent escalation triggered by ${currentPersona.name}. Chief Warden alerted.`,
              author: currentPersona.name
            }
          ]
        };
      }
      return c;
    }));
    addAuditLog(currentPersona.name, 'ESCALATED_TICKET', `Escalated ticket ${ticketId} to Chief Warden.`, 'red');
    showToast(`🚨 Ticket ${ticketId} escalated to Chief Warden.`, 'error');
  };

  // ── Mess Dining Actions & Food Waste Prediction ────────────────
  const handleMealDecisionInternal = (decision) => {
    setMessData(prev => {
      const annapurna = prev.annapurnaMess;
      const wasOptIn = annapurna.userMealDecision === 'OPT_IN';
      const isNowOptIn = decision === 'OPT_IN';

      let newOptedIn = annapurna.optedInDinner;
      let newOptedOut = annapurna.optedOutDinner;

      if (wasOptIn && !isNowOptIn) {
        newOptedIn -= 1;
        newOptedOut += 1;
      } else if (!wasOptIn && isNowOptIn) {
        newOptedIn += 1;
        newOptedOut -= 1;
      }

      const foodSavedKg = +(newOptedOut * 0.30).toFixed(1);
      const moneySaved = Math.round(newOptedOut * 36);

      return {
        ...prev,
        annapurnaMess: {
          ...annapurna,
          userMealDecision: decision,
          optedInDinner: newOptedIn,
          optedOutDinner: newOptedOut,
          estimatedFoodSavedKg: foodSavedKg,
          estimatedCostSavedInr: moneySaved
        }
      };
    });
  };

  const toggleMealDecision = (decision) => {
    handleMealDecisionInternal(decision);
    addAuditLog(currentPersona.name, 'MEAL_POLL', `Marked dinner decision: ${decision === 'OPT_IN' ? 'Eating Tonight' : 'Skip Meal'}`, 'purple');
    showToast(decision === 'OPT_IN' ? '🍽️ Meal token confirmed for dinner tonight.' : '🌱 Thank you! You helped save ~300g food and reduce mess waste.', 'success');
  };

  // ── Notice Actions ─────────────────────────────────────────────
  const acknowledgeNotice = (noticeId) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) {
        return {
          ...n,
          hasUserAcknowledged: true,
          acknowledgedCount: n.acknowledgedCount + 1
        };
      }
      return n;
    }));
    addAuditLog(currentPersona.name, 'ACKNOWLEDGED_NOTICE', `Acknowledged official notice ${noticeId}`, 'blue');
    showToast('👍 Acknowledgment recorded in the administrative compliance registry.', 'success');
  };

  const publishNotice = (noticeData) => {
    const newNotice = {
      id: `NOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: noticeData.title,
      content: noticeData.content,
      category: noticeData.category || 'General',
      priority: noticeData.priority || 'NORMAL',
      issuedBy: currentPersona.title || currentPersona.name,
      publishedDate: 'Just now',
      targets: {
        year: noticeData.targetYear || 'All',
        branch: noticeData.targetBranch || 'All',
        hostel: noticeData.targetHostel || 'All'
      },
      actionRequired: noticeData.actionRequired || false,
      actionLabel: noticeData.actionLabel || 'Acknowledge Notice',
      readCount: 1,
      totalTargetAudience: noticeData.estimatedAudience || 420,
      acknowledgedCount: 0,
      hasUserAcknowledged: false
    };

    setNotices(prev => [newNotice, ...prev]);
    addAuditLog(currentPersona.name, 'PUBLISHED_NOTICE', `Dispatched broadcast: "${newNotice.title}"`, 'blue');
    showToast(`📢 Notice published to ${newNotice.targets.hostel}.`, 'success');
    return newNotice;
  };

  // Google Single Sign-On Authentication
  const loginWithGoogle = (email, role = 'student', customName = '') => {
    const persona = initialPersonas[role] || initialPersonas.student;
    const name = customName || persona.name;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const token = `AUTH-GOOGLE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const user = {
      name,
      email,
      role,
      avatar: persona.avatar,
      provider: 'Google',
      signedInAt: timestamp,
      token
    };

    setCurrentUser(user);
    setActiveRole(role);
    setIsLandingPage(false);
    localStorage.setItem('UNIFY_current_user', JSON.stringify(user));
    localStorage.setItem('UNIFY_access_token', token);
    localStorage.setItem('UNIFY_active_role', role);
    localStorage.setItem('UNIFY_view_mode', 'app');

    addAuditLog(name, 'GOOGLE_SIGN_IN', `Signed in via Google OAuth (${email})`, 'emerald');
    showToast(`Signed in as ${name} (${email})`, 'success');

    setEmailReceipt({
      isOpen: true,
      email,
      role,
      name,
      timestamp: `${new Date().toLocaleDateString()} at ${timestamp}`,
      token
    });
  };

  const switchPersona = (role) => {
    const persona = initialPersonas[role] || initialPersonas.student;
    const user = {
      name: persona.name,
      email: persona.email || `${role}@campus.cit.edu.in`,
      role: persona.role || role,
      avatar: persona.avatar,
      provider: 'Direct Switch',
      signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      token: `CIT-DEMO-${role.toUpperCase()}-${Date.now().toString(36)}`
    };
    setCurrentUser(user);
    setActiveRole(role);
    setIsLandingPage(false);
    localStorage.setItem('UNIFY_current_user', JSON.stringify(user));
    localStorage.setItem('UNIFY_active_role', role);
    localStorage.setItem('UNIFY_view_mode', 'app');
    addAuditLog(user.name, 'PERSONA_SWITCH', `Switched active role to ${persona.title || role}`, 'indigo');
    showToast(`Switched persona to ${persona.name} (${persona.title})`, 'success');
  };

  const resetDemoData = () => {
    setGatePasses(initialGatePasses);
    setComplaints(initialComplaints);
    setNotices(initialNotices);
    setMessData(initialMessData);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
    localStorage.removeItem('UNIFY_gate_passes');
    localStorage.removeItem('UNIFY_complaints');
    localStorage.removeItem('UNIFY_notices');
    localStorage.removeItem('UNIFY_mess_data');
    localStorage.removeItem('UNIFY_audit_logs');
    localStorage.removeItem('UNIFY_notifications');
    localStorage.removeItem('cit_spectra_bookings');
    localStorage.removeItem('cit_schedule_overrides');
    localStorage.removeItem('cit_applied_disruption');
    addAuditLog('System Admin', 'RESET_DEMO', 'Reset demo state and schedules to initial baseline', 'rose');
    showToast('AstraCampus demo data reset to default CIT dataset!', 'success');
  };

  const logout = () => {
    const prevName = currentUser?.name || 'User';
    setCurrentUser(null);
    setIsLandingPage(true);
    localStorage.removeItem('UNIFY_current_user');
    localStorage.removeItem('UNIFY_access_token');
    localStorage.setItem('UNIFY_view_mode', 'landing');
    addAuditLog(prevName, 'SIGN_OUT', 'User signed out from session', 'amber');
    showToast('Signed out of AstraCampus.', 'info');
  };

  return (
    <CampusContext.Provider value={{
      activeRole,
      setActiveRole,
      currentPersona,
      initialPersonas,
      gatePasses,
      complaints,
      notices,
      notifications,
      markNotificationRead,
      acknowledgeNotification,
      executeNotificationAction,
      verifyNotificationAction,
      actionableNotification,
      setActionableNotification,
      analyzeIncidentWithAI,
      messData,
      auditLogs,
      campusHotspotStats,
      busRoutes,
      examCalendar,
      // Authentication & Landing State
      currentUser,
      setCurrentUser,
      isLandingPage,
      setIsLandingPage,
      authModalOpen,
      setAuthModalOpen,
      authTargetRole,
      setAuthTargetRole,
      emailReceipt,
      setEmailReceipt,
      loginWithGoogle,
      logout,
      // Actions
      createGatePass,
      approveGatePass,
      rejectGatePass,
      scanGateExit,
      scanGateEntry,
      createComplaint,
      updateComplaintStatus,
      escalateComplaint,
      toggleMealDecision,
      acknowledgeNotice,
      publishNotice,
      addAuditLog,
      switchPersona,
      resetDemoData,
      // Approval Workflow State & Actions
      venueRequests,
      setVenueRequests,
      createVenueRequest,
      approveVenueRequest,
      rejectVenueRequest,
      dispatchChatMessage,
      roomRequests,
      setRoomRequests,
      createRoomRequest,
      approveRoomRequest,
      rejectRoomRequest,
      extraClassRequests,
      setExtraClassRequests,
      createExtraClassRequest,
      approveExtraClassRequest,
      rejectExtraClassRequest,
      leaveRequests,
      setLeaveRequests,
      createLeaveRequest,
      approveLeaveRequest,
      rejectLeaveRequest
    }}>
      {children}
    </CampusContext.Provider>
  );
}

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
