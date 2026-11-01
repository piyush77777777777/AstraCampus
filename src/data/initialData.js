// initialData.js - Smart Campus OS unified data layer

export const initialPersonas = {
  student: {
    id: "STU-2022-CSE-045",
    name: "Piyush Mohapatra",
    role: "student",
    regNo: "2201106145",
    branch: "Computer Science & Engineering",
    year: "3rd Year (6th Sem)",
    hostel: "Aryabhatta Hall of Residence",
    room: "B-304",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    guardianPhone: "+91 94370 12345",
    citizenScore: 340,
    citizenLevel: "Silver",
    attendance: {
      overall: 84.5,
      required: 75,
      safeBunksRemaining: 6,
      subjects: [
        { code: "CST301", name: "Operating Systems", attended: 36, total: 40, percentage: 90 },
        { code: "CST302", name: "Database Management Systems", attended: 32, total: 38, percentage: 84.2 },
        { code: "CST303", name: "Design & Analysis of Algorithms", attended: 28, total: 35, percentage: 80.0 },
        { code: "CST304", name: "Computer Networks", attended: 29, total: 36, percentage: 80.5 }
      ]
    },
    dues: {
      collegeFee: 0,
      hostelRent: 0,
      messDues: 0,
      libraryFine: 0,
      isCleared: true
    }
  },
  warden: {
    id: "FAC-WARDEN-01",
    name: "Dr. S. K. Nayak",
    role: "warden",
    title: "Chief Warden & Professor (Dept. of CSE)",
    department: "Hostel Administration & Student Welfare",
    hostelManaged: "Aryabhatta Hall of Residence",
    phone: "+91 94371 99887",
    email: "warden.aryabhatta@campus.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  guard: {
    id: "SEC-GATE-04",
    name: "Subedar Ram Singh",
    role: "guard",
    title: "Chief Security Officer",
    post: "North Main Gate & Gatehouse 1",
    shift: "08:00 - 20:00",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  messManager: {
    id: "MESS-SUP-02",
    name: "Bikram Das",
    role: "messManager",
    title: "Annapurna Mess Incharge & Food Quality Supervisor",
    canteen: "Aryabhatta Central Mess",
    phone: "+91 98610 55432",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  teacher: {
    id: "FAC-CSE-09",
    name: "Prof. Ananya Verma",
    role: "teacher",
    title: "Associate Professor (Dept. of CSE)",
    department: "Computer Science & Engineering",
    email: "prof.verma@campus.edu",
    phone: "+91 94371 11223",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    classes: [
      { code: "CST301", name: "Operating Systems", section: "CSE-A", totalStudents: 60, avgAttendance: 82 },
      { code: "CST303", name: "Design & Analysis of Algorithms", section: "CSE-B", totalStudents: 58, avgAttendance: 76 },
      { code: "CST401", name: "Machine Learning", section: "CSE-A", totalStudents: 55, avgAttendance: 88 }
    ]
  },
  parent: {
    id: "PAR-2022-CSE-045",
    name: "Mr. Ramesh Mohapatra",
    role: "parent",
    title: "Parent / Guardian",
    wardName: "Piyush Mohapatra",
    wardRegNo: "2201106145",
    wardRoom: "B-304",
    wardBranch: "Computer Science & Engineering",
    phone: "+91 94370 12345",
    email: "ramesh.mohapatra@gmail.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"
  },
  principal: {
    id: "ADMIN-PRINCIPAL-01",
    name: "Prof. D. K. Mishra",
    role: "principal",
    title: "Principal & Director",
    department: "Office of the Principal",
    email: "principal@campus.edu",
    phone: "+91 94371 00001",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  admin: {
    id: "CIT-DEAN-01",
    name: "Dr. Ramesh Chandra",
    role: "admin",
    title: "Dean of Academics & Chief Timetable Officer",
    department: "Dean's Office, Academic Directorate",
    email: "admin.dean@cit.ac.in",
    phone: "+91 94371 00100",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  coordinator: {
    id: "CIT-COORD-CSE",
    name: "Dr. Pravat Kumar Sahoo",
    role: "coordinator",
    title: "CSE Department Academic Coordinator",
    department: "Dept. of Computer Science & Engineering",
    email: "coord.cse@cit.ac.in",
    phone: "+91 94371 00200",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  hod: {
    id: "CIT-HOD-CSE",
    name: "Dr. Pravat Kumar Sahoo",
    role: "hod",
    title: "HOD & CSE Department Coordinator",
    department: "Dept. of Computer Science & Engineering",
    email: "hod.cse@cit.ac.in",
    phone: "+91 94371 00200",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  faculty: {
    id: "FAC-02",
    name: "Prof. Ananya Verma",
    role: "faculty",
    title: "Associate Professor (Dept. of CSE)",
    department: "Computer Science & Engineering",
    email: "faculty.verma@cit.ac.in",
    phone: "+91 94371 11223",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  club: {
    id: "CIT-CLUB-ROBO",
    name: "Aryan Sen",
    role: "club",
    title: "Spectra Festival Directorate & Robotics Club Lead",
    department: "Student Activity Center (SAC)",
    email: "club.robotics@cit.ac.in",
    phone: "+91 98765 00999",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
};

export const initialGatePasses = [
  {
    id: "GP-2026-8891",
    studentId: "STU-2022-CSE-045",
    studentName: "Piyush Mohapatra",
    regNo: "2201106145",
    room: "B-304",
    passType: "Day Outing",
    destination: "Rourkela Main Market (Books & Hardware Project kit)",
    outTime: "Today, 17:00",
    expectedInTime: "Today, 20:30",
    actualOutTime: null,
    actualInTime: null,
    status: "APPROVED",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Today, 14:15",
    qrToken: "CIT-GP-2026-8891-SECURE-98X",
    guardianAlertSent: true,
    emergencyPhone: "+91 94370 12345",
    remarks: "Permitted for academic supplies purchase."
  },
  {
    id: "GP-2026-8890",
    studentId: "STU-2022-EE-089",
    studentName: "Ananya Mishra",
    regNo: "2201106230",
    room: "KC-201",
    passType: "Weekend Home Visit",
    destination: "Bhubaneswar Home",
    outTime: "Yesterday, 16:00",
    expectedInTime: "Sunday, 21:00",
    actualOutTime: "Yesterday, 16:22",
    actualInTime: null,
    status: "CHECKED_OUT",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Yesterday, 11:30",
    qrToken: "CIT-GP-2026-8890-SECURE-42Y",
    guardianAlertSent: true,
    emergencyPhone: "+91 98612 34567",
    remarks: "Weekend leave granted."
  },
  {
    id: "GP-2026-8884",
    studentId: "STU-2022-ME-012",
    studentName: "Rohan Samal",
    regNo: "2201106098",
    room: "A-112",
    passType: "Day Outing",
    destination: "Railway Station pickup",
    outTime: "Yesterday, 18:00",
    expectedInTime: "Yesterday, 20:30",
    actualOutTime: "Yesterday, 18:05",
    actualInTime: "Yesterday, 22:15",
    status: "OVERDUE",
    approvedBy: "Dr. S. K. Nayak",
    approvedAt: "Yesterday, 15:00",
    qrToken: "CIT-GP-2026-8884-SECURE-11Z",
    guardianAlertSent: true,
    emergencyPhone: "+91 94375 66778",
    remarks: "Returned 1 hr 45 min past curfew without prior notice."
  }
];

export const initialComplaints = [
  {
    id: "CMP-2026-0042",
    title: "Hostel tap leaking continuously for 9 days",
    description: "The main washroom tap in 3rd Floor Wing B has been leaking for 9 days. Constant water wastage and slipping hazard. Needs immediate plumber washer replacement.",
    category: "Plumbing",
    location: "Aryabhatta Hall - Block B, 3rd Floor Washroom",
    urgency: "HIGH",
    reportedBy: "Piyush Mohapatra (B-304)",
    studentId: "STU-2022-CSE-045",
    reportedDaysAgo: 9,
    reportedDate: "2026-09-10",
    status: "ESCALATED",
    assignedTo: "Manoj Rout (Head Plumber)",
    slaBreached: true,
    slaTargetHours: 24,
    escalationLevel: "Level 2: Chief Warden Attention",
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
    timeline: [
      { timestamp: "9 days ago (Sep 10)", note: "Ticket filed by student via app", author: "Student" },
      { timestamp: "7 days ago (Sep 12)", note: "Assigned to Maintenance Plumber pool", author: "System" },
      { timestamp: "6 days ago (Sep 13)", note: "SLA (24h) breached. Warning notification sent", author: "System Ageing Bot" },
      { timestamp: "2 days ago (Sep 17)", note: "Overdue by 7 days. Auto-escalated to Chief Warden Dr. S. K. Nayak", author: "SLA Watchdog" }
    ]
  },
  {
    id: "CMP-2026-0051",
    title: "Wi-Fi router in Block B corridors rebooting continuously",
    description: "Frequent disconnections during late evening hours. Cisco AP lights blinking amber. Cannot access NPTEL and campus portal.",
    category: "Wi-Fi & IT",
    location: "Aryabhatta Hall - Block B, 2nd & 3rd Floor Hub",
    urgency: "MEDIUM",
    reportedBy: "Subham Jena (B-210)",
    studentId: "STU-2022-CSE-019",
    reportedDaysAgo: 1,
    reportedDate: "2026-09-18",
    status: "IN_PROGRESS",
    assignedTo: "Pradeep Sahu (Network Admin)",
    slaBreached: false,
    slaTargetHours: 48,
    escalationLevel: "Level 1: Technician Queue",
    photoUrl: null,
    timeline: [
      { timestamp: "Yesterday", note: "Ticket logged by student", author: "Student" },
      { timestamp: "Today 09:30", note: "Technician Pradeep Sahu picked up ticket. Firmware reset scheduled.", author: "Network Admin" }
    ]
  },
  {
    id: "CMP-2026-0056",
    title: "Room 304 ceiling fan regulator sparking",
    description: "Speed switch sparks when changed to level 4. Potential short circuit risk.",
    category: "Electrical",
    location: "Aryabhatta Hall - Room B-304",
    urgency: "HIGH",
    reportedBy: "Piyush Mohapatra (B-304)",
    studentId: "STU-2022-CSE-045",
    reportedDaysAgo: 0,
    reportedDate: "2026-09-19",
    status: "PENDING",
    assignedTo: "Unassigned (Auto-routing to Electrician pool)",
    slaBreached: false,
    slaTargetHours: 12,
    escalationLevel: "Level 1: Urgent Safety",
    photoUrl: null,
    timeline: [
      { timestamp: "Just now", note: "Ticket filed with safety flag", author: "Student" }
    ]
  },
  {
    id: "CMP-2026-0038",
    title: "Reading Room tube-light blinking",
    description: "40W LED tube flickering, making it difficult for night study.",
    category: "Electrical",
    location: "Aryabhatta Hall - Ground Floor Study Hall",
    urgency: "LOW",
    reportedBy: "Akash Panda (A-102)",
    studentId: "STU-2022-ME-002",
    reportedDaysAgo: 3,
    reportedDate: "2026-09-16",
    status: "RESOLVED",
    assignedTo: "Ramesh Behera (Electrician)",
    slaBreached: false,
    slaTargetHours: 48,
    escalationLevel: "Resolved",
    photoUrl: null,
    feedbackRating: 5,
    resolutionNote: "Choke and starter replaced. Verified working.",
    timeline: [
      { timestamp: "3 days ago", note: "Ticket filed", author: "Student" },
      { timestamp: "2 days ago", note: "Repaired by Ramesh Behera", author: "Electrician" },
      { timestamp: "Yesterday", note: "Student confirmed resolution with 5-star rating", author: "Student" }
    ]
  }
];

export const initialNotices = [
  {
    id: "NOT-2026-104",
    title: "Aryabhatta Hall: Overhead Water Tank Disinfection & Maintenance",
    content: "All hostel residents of Aryabhatta Hall are informed that routine chemical disinfection and deep cleaning of the 50,000L rooftop water tanks will take place on Saturday from 08:30 AM to 01:30 PM. Please store sufficient drinking and utility water in advance.",
    category: "Hostel",
    priority: "HIGH",
    issuedBy: "Office of the Chief Warden",
    publishedDate: "Today, 08:00 AM",
    targets: { year: "All", branch: "All", hostel: "Aryabhatta Hall of Residence" },
    actionRequired: true,
    actionLabel: "I have stored water / Acknowledged",
    readCount: 394,
    totalTargetAudience: 420,
    acknowledgedCount: 342,
    hasUserAcknowledged: false
  },
  {
    id: "NOT-2026-103",
    title: "Urgent: 6th Semester End-Term Examination Form Fill-up 2026",
    content: "All eligible 3rd Year (6th Sem) B.Tech students must complete their digital subject verification and upload passport photographs on the portal by 25th September. Students with fee dues or attendance below 75% must meet their respective HODs immediately.",
    category: "Academic",
    priority: "HIGH",
    issuedBy: "Dean of Academic Affairs & Exam Cell",
    publishedDate: "Yesterday, 16:30",
    targets: { year: "3rd Year", branch: "All", hostel: "All" },
    actionRequired: true,
    actionLabel: "I have verified my registration subjects",
    readCount: 512,
    totalTargetAudience: 540,
    acknowledgedCount: 460,
    hasUserAcknowledged: true
  },
  {
    id: "NOT-2026-101",
    title: "Campus Placement: Industry 4.0 Recruitment Drive",
    content: "Top tier tech recruiters are hosting technical interviews for pre-final and final year engineers. Shortlisted students must keep their updated resumes and institutional Bonafide Certificate handy.",
    category: "Placement",
    priority: "NORMAL",
    issuedBy: "Training & Placement Cell",
    publishedDate: "3 days ago",
    targets: { year: "3rd & 4th Year", branch: "CSE, IT, EE", hostel: "All" },
    actionRequired: false,
    readCount: 890,
    totalTargetAudience: 920,
    acknowledgedCount: 0,
    hasUserAcknowledged: false
  }
];

export const initialMessData = {
  annapurnaMess: {
    totalHostelStrength: 420,
    optedInDinner: 338,
    optedOutDinner: 82,
    estimatedFoodSavedKg: 24.6,
    estimatedCostSavedInr: 2950,
    userMealDecision: "OPT_IN",
    pollCutoffTime: "16:00",
    todayRating: 4.4,
    totalReviewsToday: 184,
    weeklyMenu: {
      Monday: {
        breakfast: "Puri & Aloo Chana Sabzi, Banana, Tea/Coffee",
        lunch: "Steamed Rice, Moong Dal, Seasonal Mixed Veg, Dahi Bundi",
        evening: "Poha, Biscuits, Hot Tea",
        dinner: "Roti, Rice, Dal Fry, Egg Curry / Paneer Butter Masala"
      },
      Tuesday: {
        breakfast: "Idli & Vada with Coconut Chutney & Sambar, Tea",
        lunch: "Rice, Authentic Odia Dalma, Bhindi Bhaja, Tomato Khatta",
        evening: "Samosa (2 pcs), Green Chutney, Tea",
        dinner: "Roti, Veg Pulao, Kadai Chicken / Kadai Mushroom, Gulab Jamun"
      },
      Wednesday: {
        breakfast: "Aloo Paratha with Curd & Pickle, Tea/Coffee",
        lunch: "Jeera Rice, Chana Dal, Aloo Gobi Masala, Salad",
        evening: "Veg Chowmein, Tomato Sauce, Tea",
        dinner: "Roti, Steamed Rice, Fish Curry / Shahi Paneer, Kheer"
      },
      Thursday: {
        breakfast: "Upma with Ghuguni, Banana, Tea",
        lunch: "Rice, Lemon Rice, Rasam, Dal, Cabbage Fry",
        evening: "Bread Pakora with Mint Chutney, Tea",
        dinner: "Roti, Rice, Dal Makhani, Dum Aloo, Ice Cream"
      },
      Friday: {
        breakfast: "Uttapam with Sambar & Pudina Chutney, Tea",
        lunch: "Rice, Dal, Paneer Do Pyaza, Papad, Mixed Pickle",
        evening: "Jhalmuri / Bhel Puri, Tea",
        dinner: "Roti, Biryani (Chicken / Veg), Mirchi Ka Salan, Raita"
      },
      Saturday: {
        breakfast: "Methi Thepla with Chutney, Tea/Coffee",
        lunch: "Rice, Odia Dalma, Baigana Bhaja, Curd",
        evening: "Veg Cutlet, Tea",
        dinner: "Roti, Matar Mushroom, Yellow Dal, Fruit Custard"
      },
      Sunday: {
        breakfast: "Chole Bhature with Pickled Onions, Tea",
        lunch: "Special Feast: Mutton Curry / Malai Kofta, Fried Rice, Dal, Papad",
        evening: "Cake Slice, Cookies, Hot Coffee",
        dinner: "Light Khichdi, Aloo Chokha, Roasted Papad, Rasgulla"
      }
    },
    weeklyReservations: {
      Monday:    { breakfast: 310, lunch: 390, dinner: 338 },
      Tuesday:   { breakfast: 295, lunch: 380, dinner: 350 },
      Wednesday: { breakfast: 320, lunch: 400, dinner: 360 },
      Thursday:  { breakfast: 280, lunch: 370, dinner: 330 },
      Friday:    { breakfast: 300, lunch: 395, dinner: 375 },
      Saturday:  { breakfast: 260, lunch: 350, dinner: 310 },
      Sunday:    { breakfast: 340, lunch: 415, dinner: 390 }
    }
  }
};

export const campusHotspotStats = [
  { block: "Aryabhatta Hall (Boys)", wing: "Block B (3rd Floor)", issues: 14, primaryIssue: "Plumbing & Tap leakage", risk: "CRITICAL" },
  { block: "Aryabhatta Hall (Boys)", wing: "Block A (2nd Floor)", issues: 8, primaryIssue: "Wi-Fi Router dropouts", risk: "MEDIUM" },
  { block: "Kalpana Chawla Hall (Girls)", wing: "Wing C (1st Floor)", issues: 5, primaryIssue: "Electrical Switchboard", risk: "LOW" },
  { block: "Academic Block 2", wing: "Floor 4 Lab Wing", issues: 6, primaryIssue: "Projector HDMI cable faulty", risk: "MEDIUM" },
  { block: "Annapurna Central Mess", wing: "Kitchen Water Filter", issues: 2, primaryIssue: "RO UV cartridge replacement", risk: "LOW" }
];

export const initialAuditLogs = [
  {
    id: "LOG-9921",
    timestamp: "Today, 14:15:32",
    actor: "Dr. S. K. Nayak (Chief Warden)",
    action: "APPROVED_GATE_PASS",
    details: "Approved Day Outing for Piyush Mohapatra (GP-2026-8891). SMS alert dispatched to +91 94370 12345.",
    badgeColor: "emerald"
  },
  {
    id: "LOG-9920",
    timestamp: "Today, 12:44:10",
    actor: "System SLA Watchdog",
    action: "ESCALATED_TICKET",
    details: "Ticket CMP-2026-0042 crossed 9 days without resolution. Escalated to Chief Warden.",
    badgeColor: "red"
  },
  {
    id: "LOG-9919",
    timestamp: "Today, 08:00:00",
    actor: "Office of the Chief Warden",
    action: "BROADCAST_NOTICE",
    details: "Dispatched targeted notice NOT-2026-104 to 420 residents of Aryabhatta Hall.",
    badgeColor: "blue"
  },
  {
    id: "LOG-9918",
    timestamp: "Yesterday, 16:22:45",
    actor: "Subedar Ram Singh (Gate 1)",
    action: "SECURITY_SCAN_OUT",
    details: "Scanned QR for Ananya Mishra (GP-2026-8890). Out-time verified & gate barrier opened.",
    badgeColor: "amber"
  }
];

export const busRoutes = [
  {
    id: "B1",
    name: "Campus Circular",
    color: "#3b82f6",
    stops: ["Main Gate", "Academic Block", "Library", "Hostel Block A", "Hostel Block B", "Mess", "Main Gate"],
    currentStop: 2,
    nextArrival: "3 min",
    capacity: 42,
    occupancy: 28,
    driver: "Santosh Kumar"
  },
  {
    id: "B2",
    name: "City Express",
    color: "#10b981",
    stops: ["Main Gate", "Rourkela Station", "City Market", "Hospital", "Main Gate"],
    currentStop: 1,
    nextArrival: "12 min",
    capacity: 54,
    occupancy: 41,
    driver: "Ravi Das"
  },
  {
    id: "B3",
    name: "Lab Shuttle",
    color: "#f59e0b",
    stops: ["Hostel A", "Hostel B", "Research Lab", "Canteen", "Hostel A"],
    currentStop: 0,
    nextArrival: "7 min",
    capacity: 30,
    occupancy: 12,
    driver: "Birju Singh"
  }
];

export const examCalendar = [
  { date: "2026-10-01", type: "exam", title: "OS Mid-Sem (CST301)", time: "10:00 AM", venue: "Block A Hall 1", urgent: true },
  { date: "2026-10-03", type: "exam", title: "DBMS Mid-Sem (CST302)", time: "10:00 AM", venue: "Block B Hall 2", urgent: true },
  { date: "2026-10-05", type: "event", title: "Tech Fest – Triskele 2026", time: "9:00 AM", venue: "Open Amphitheatre" },
  { date: "2026-10-08", type: "exam", title: "Algorithms Mid-Sem (CST303)", time: "10:00 AM", venue: "Block A Hall 1", urgent: true },
  { date: "2026-10-10", type: "holiday", title: "Dussehra Holiday", time: "All Day", venue: "" },
  { date: "2026-10-15", type: "event", title: "Placement Mock Test – TCS iON", time: "2:00 PM", venue: "Computer Lab 3" },
  { date: "2026-10-20", type: "exam", title: "Computer Networks (CST304)", time: "10:00 AM", venue: "Block B Hall 1", urgent: true },
  { date: "2026-10-25", type: "holiday", title: "Diwali Holiday", time: "All Day", venue: "" },
  { date: "2026-11-15", type: "exam", title: "End-Sem Exams Begin", time: "10:00 AM", venue: "All Exam Halls", urgent: true }
];

export const initialNotifications = [
  {
    id: "NOTIF-2026-001",
    title: "Urgent: Electrical Sparking in Block B",
    message: "Room B-304 reported electrical switchboard arcing. Automatic priority escalated to HIGH.",
    priority: "HIGH",
    delivery_status: "acknowledged",
    location: "Aryabhatta Hall - Room B-304",
    targetRoles: ["warden", "principal"],
    read_at: null,
    acknowledged_at: "Today, 10:15 AM",
    riskAnalysis: {
      safetyHazardLevel: "CRITICAL",
      failureModes: [
        "Floor MCB circuit breaker tripping cascade",
        "Short-circuit fire hazard in resident quarters",
        "Direct student electrocution hazard"
      ],
      preventativeChecks: [
        "Isolate main floor MCB circuit breaker prior to inspection",
        "Verify terminal point load distribution",
        "Use certified insulated testing equipment"
      ]
    },
    suggestedActions: [
      { actionId: "DISPATCH_ELECTRICIAN", label: "1-Click Emergency Technician Dispatch", description: "Route immediate work order to Electrical Maintenance team.", impact: "2-hour SLA response dispatch." },
      { actionId: "NOTIFY_FLOOR_WARDEN", label: "Alert Resident Floor Warden", description: "Request physical inspection of Room B-304.", impact: "Direct SMS and portal alert." }
    ]
  },
  {
    id: "NOTIF-2026-002",
    title: "Gate Pass Approval Requested",
    message: "Student Piyush Mohapatra (Reg: 2201106145) requested Day Outing to City Center.",
    priority: "NORMAL",
    delivery_status: "acknowledged",
    location: "Main Gate Exit",
    targetRoles: ["warden", "guard"],
    read_at: null,
    acknowledged_at: "Today, 11:20 AM",
    riskAnalysis: {
      safetyHazardLevel: "LOW",
      failureModes: ["Late return beyond 21:00 curfew"],
      preventativeChecks: ["Verify parental SMS consent registry"]
    },
    suggestedActions: [
      { actionId: "APPROVE_GATEPASS_QUICK", label: "Authorize Outpass QR Token", description: "Activate turnstile QR token valid for 4 hours.", impact: "Dispatches parent notification." },
      { actionId: "HOLD_FOR_PARENT", label: "Request Guardian Callback", description: "Require parent confirmation before gate release.", impact: "Holds pass in pending review." }
    ]
  },
  {
    id: "NOTIF-2026-003",
    title: "Dinner Meal Opt-Out Surge Detected",
    message: "128 students skipped tonight's dinner. Predictive procurement reduced preparation quota by 38.4 kg.",
    priority: "LOW",
    delivery_status: "verified",
    location: "Annapurna Mess Hall",
    targetRoles: ["messManager", "principal"],
    read_at: "Today, 09:30 AM",
    acknowledged_at: "Today, 09:30 AM",
    action_taken_at: "Today, 09:35 AM",
    verified_at: "Today, 09:40 AM",
    verification_proof: "UNIFY-VERIFY-MESS-00918",
    riskAnalysis: {
      safetyHazardLevel: "NONE",
      failureModes: ["Surplus cooked food spoilage if unadjusted"],
      preventativeChecks: ["Verify raw grocery procurement ledger"]
    },
    suggestedActions: [
      { actionId: "ADJUST_GROCERY_ORDER", label: "Confirm Procurement Adjustment", description: "Lock ₹4,600 procurement savings into hostel finance ledger.", impact: "Saved 38.4kg food waste." }
    ]
  }
];

