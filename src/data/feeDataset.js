// feeDataset.js - Chilika Institution of Technology (CIT) Institutional Fee & Financial Data Layer

export const ACADEMIC_SESSIONS = ['2026-27 (Active)', '2025-26', '2024-25'];

export const BRANCH_TAXONOMY = [
  { code: 'CSE', name: 'Computer Science & Engineering', tuition: 45000, lab: 8000, dev: 5000, intake: 180 },
  { code: 'CSE-DS', name: 'CSE - Data Science', tuition: 46000, lab: 9000, dev: 5000, intake: 60 },
  { code: 'Agri', name: 'Agricultural Engineering', tuition: 38000, lab: 6000, dev: 4000, intake: 60 },
  { code: 'EE', name: 'Electrical Engineering', tuition: 42000, lab: 7500, dev: 4500, intake: 90 },
  { code: 'Mech', name: 'Mechanical Engineering', tuition: 42000, lab: 8000, dev: 4500, intake: 120 },
  { code: 'Aero', name: 'Aerospace Engineering', tuition: 48000, lab: 10000, dev: 5000, intake: 60 },
  { code: 'Civil', name: 'Civil Engineering', tuition: 40000, lab: 7000, dev: 4000, intake: 90 },
  { code: 'ECE', name: 'Electronics & Communication', tuition: 44000, lab: 8000, dev: 5000, intake: 120 }
];

export const INITIAL_STUDENT_FEE_PROFILE = {
  regNo: '2201106145',
  rollNo: 'CSE-22-045',
  studentName: 'Piyush Kumar Dey',
  fatherName: 'Mr. Ramesh Dey',
  contact: '+91 98765 43210',
  email: 'piyush.dey@cit.ac.in',
  branch: 'Computer Science & Engineering',
  course: 'B.Tech',
  currentSem: '6th Semester',
  admissionCategory: 'Merit General (State JEE Rank 1420)',
  quota: 'State Quota',
  session: '2026-27',
  hostelResident: true,
  hostelRoom: 'Aryabhatta B-304'
};

export const INITIAL_FEE_INVOICES = [
  {
    invoiceNo: 'INV-2026-08491',
    session: '2026-27',
    semester: '6th Semester',
    title: 'Semester 6 Tuition & Software Laboratory Fee',
    issueDate: '2026-01-02',
    dueDate: '2026-01-20',
    amount: 53000,
    scholarship: 11250,
    netPayable: 41750,
    paidAmount: 41750,
    outstanding: 0,
    status: 'PAID',
    paymentRef: 'PAY-2026-78101',
    receiptNo: 'GZU-REC-2026-00412'
  },
  {
    invoiceNo: 'INV-2026-08492',
    session: '2026-27',
    semester: '6th Semester',
    title: 'Hostel Accommodation Fee (Aryabhatta Hall B-304)',
    issueDate: '2026-01-05',
    dueDate: '2026-01-25',
    amount: 22000,
    scholarship: 0,
    netPayable: 22000,
    paidAmount: 22000,
    outstanding: 0,
    status: 'PAID',
    paymentRef: 'PAY-2026-78102',
    receiptNo: 'GZU-REC-2026-00413'
  },
  {
    invoiceNo: 'INV-2026-08493',
    session: '2026-27',
    semester: '6th Semester',
    title: 'Central Mess & Food Dining Advance (Semester 6)',
    issueDate: '2026-01-10',
    dueDate: '2026-02-15',
    amount: 18000,
    scholarship: 0,
    netPayable: 18000,
    paidAmount: 10000,
    outstanding: 8000,
    status: 'PARTIALLY_PAID',
    paymentRef: 'PAY-2026-78103',
    receiptNo: 'GZU-REC-2026-00455'
  },
  {
    invoiceNo: 'INV-2026-08502',
    session: '2026-27',
    semester: '6th Semester',
    title: 'Midsem Exam Requisition & Lab Assessment Fee',
    issueDate: '2026-10-25',
    dueDate: '2026-11-15',
    amount: 2500,
    scholarship: 0,
    netPayable: 2500,
    paidAmount: 0,
    outstanding: 2500,
    status: 'ISSUED',
    paymentRef: null,
    receiptNo: null
  }
];

export const INITIAL_LEDGER_ENTRIES = [
  { id: 'LED-001', date: '2026-01-02', type: 'DEBIT', component: 'Tuition Fee (Sem 6)', amount: 45000, balance: 45000, ref: 'INV-2026-08491' },
  { id: 'LED-002', date: '2026-01-02', type: 'DEBIT', component: 'Computing Lab Infra', amount: 8000, balance: 53000, ref: 'INV-2026-08491' },
  { id: 'LED-003', date: '2026-01-02', type: 'CREDIT', component: 'Merit Scholarship (Rank <1500)', amount: 11250, balance: 41750, ref: 'SCHOL-CIT-2026' },
  { id: 'LED-004', date: '2026-01-05', type: 'DEBIT', component: 'Hostel Rent (B-304)', amount: 22000, balance: 63750, ref: 'INV-2026-08492' },
  { id: 'LED-005', date: '2026-01-10', type: 'DEBIT', component: 'Mess Food Advance', amount: 18000, balance: 81750, ref: 'INV-2026-08493' },
  { id: 'LED-006', date: '2026-01-10', type: 'CREDIT', component: 'Online Payment (Razorpay UPI)', amount: 41750, balance: 40000, ref: 'PAY-2026-78101' },
  { id: 'LED-007', date: '2026-01-12', type: 'CREDIT', component: 'Online Payment (HDFC NetBank)', amount: 22000, balance: 18000, ref: 'PAY-2026-78102' },
  { id: 'LED-008', date: '2026-02-01', type: 'CREDIT', component: 'Offline Bank DD Counter (SBI)', amount: 10000, balance: 8000, ref: 'PAY-2026-78103' },
  { id: 'LED-009', date: '2026-10-25', type: 'DEBIT', component: 'Midsem Exam Assessment', amount: 2500, balance: 10500, ref: 'INV-2026-08502' }
];

export const INITIAL_PAYMENT_HISTORY = [
  {
    txnId: 'PAY-2026-78101',
    date: '2026-01-10 11:24 AM',
    mode: 'ONLINE_UPI',
    gateway: 'Razorpay UPI',
    signature: 'SIG-HMAC-SHA256-990141-AUTHENTICATED',
    amount: 41750,
    invoiceNo: 'INV-2026-08491',
    receiptNo: 'GZU-REC-2026-00412',
    status: 'VERIFIED'
  },
  {
    txnId: 'PAY-2026-78102',
    date: '2026-01-12 04:15 PM',
    mode: 'ONLINE_NETBANKING',
    gateway: 'HDFC Corporate Gateway',
    signature: 'SIG-HMAC-SHA256-990142-AUTHENTICATED',
    amount: 22000,
    invoiceNo: 'INV-2026-08492',
    receiptNo: 'GZU-REC-2026-00413',
    status: 'VERIFIED'
  },
  {
    txnId: 'PAY-2026-78103',
    date: '2026-02-01 02:30 PM',
    mode: 'OFFLINE_DD',
    gateway: 'CIT Accounts Counter (SBI DD #440192)',
    signature: 'OFFLINE-STAMP-CIT-ACCT-09',
    amount: 10000,
    invoiceNo: 'INV-2026-08493',
    receiptNo: 'GZU-REC-2026-00455',
    status: 'VERIFIED'
  }
];

export const INITIAL_ACCOUNTS_KPIS = {
  todayCollection: 245000,
  monthCollection: 4890000,
  totalSessionCollection: 34280000,
  totalOverdueAmount: 860000,
  totalOutstandingAmount: 1420000,
  collectionTargetPct: 92.4,
  totalDefaulters: 18,
  reconciliationDiscrepancies: 0,
  activeSession: '2026-27'
};

export const INITIAL_FINANCE_INTELLIGENCE_ALERTS = [
  {
    id: 'ALERT-SQL-01',
    severity: 'MEDIUM',
    query: "SELECT student_id, sum(outstanding) FROM invoices WHERE due_date < CURRENT_DATE - INTERVAL '30 days' GROUP BY student_id HAVING sum(outstanding) > 15000",
    message: '12 students have invoices overdue by >30 days totaling ₹2.84 Lakh.',
    actionRequired: 'Automated SMS & In-Portal Fee Reminder Triggered'
  },
  {
    id: 'ALERT-SQL-02',
    severity: 'LOW',
    query: 'SELECT count(*) FROM payments WHERE status = "SUCCESS" AND reconciled = false',
    message: '0 unreconciled transactions. All gateway records match internal ledger (₹3.42 Cr verified).',
    actionRequired: 'Daily Reconciliation Re-Checked at 02:00 AM'
  },
  {
    id: 'ALERT-SQL-03',
    severity: 'HIGH',
    query: "SELECT invoice_no, student_id FROM invoices WHERE status = 'OVERDUE' AND fine_applied = false",
    message: 'Grace period expired for 6 Examination Invoices. Configured late fine of ₹50/day applied.',
    actionRequired: 'Fine Ledger Posted with Audit Stamp'
  }
];
