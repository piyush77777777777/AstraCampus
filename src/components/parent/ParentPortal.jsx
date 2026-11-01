import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  User, Users, TrendingUp, Bell, CheckCircle2, Activity, MapPin,
  CreditCard, Receipt, Wallet, DollarSign, Download, Printer, ShieldCheck,
  Clock, AlertTriangle, ArrowRight, Check, X, Search, FileText,
  ChevronRight, Sparkles, RefreshCw, Smartphone, GraduationCap, Building2,
  Calendar, Award, ExternalLink
} from 'lucide-react';
import BusTracker from '../campus/BusTracker';
import {
  INITIAL_STUDENT_FEE_PROFILE,
  INITIAL_FEE_INVOICES,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_PAYMENT_HISTORY
} from '../../data/feeDataset';

export default function ParentPortal({ initialTab = 'overview', setActiveTab: setParentNavTab }) {
  const { gatePasses, notices } = useCampus();

  // Normalize initialTab
  const mapInitialTab = (t) => {
    if (t === 'fees' || t === 'feeLedger') return 'fees';
    if (t === 'academicProgress' || t === 'academics') return 'academics';
    if (t === 'gate_passes' || t === 'gatePasses') return 'gate_passes';
    if (t === 'bus_tracker' || t === 'busTracker') return 'bus_tracker';
    if (t === 'alerts' || t === 'notices') return 'alerts';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => mapInitialTab(initialTab));

  // Sync when prop changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(mapInitialTab(initialTab));
    }
  }, [initialTab]);

  // Ward Master Data
  const ward = {
    name: 'Piyush Kumar Dey',
    regNo: '2201106145',
    rollNo: '22CSE045',
    course: 'Bachelor of Technology (B.Tech)',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester (3rd Year)',
    cohort: '2022 - 2026',
    category: 'General Merit (JEE Main / OJEE)',
    hostel: 'Aryabhatta Hall of Residence',
    room: 'B-304',
    mentor: 'Dr. Ramesh Chandra (Dean Academics)',
    mentorPhone: '+91 94371 00100',
    overallAttendance: 84.5,
    safeBunksRemaining: 6,
    cgpa: 8.74,
    rank: '4th in CSE cohort (Top 5%)',
    biometricStatus: 'Inside Campus (North Gate Turnstile • 08:55 AM Today)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  // Academic Performance & Progress
  const semesterProgression = [
    { sem: 'Sem 1', sgpa: 8.40, credits: 22, status: 'Distinction' },
    { sem: 'Sem 2', sgpa: 8.62, credits: 22, status: 'Distinction' },
    { sem: 'Sem 3', sgpa: 8.50, credits: 24, status: 'Distinction' },
    { sem: 'Sem 4', sgpa: 8.84, credits: 24, status: 'Distinction' },
    { sem: 'Sem 5', sgpa: 8.91, credits: 22, status: 'Distinction' },
    { sem: 'Sem 6 (Current)', sgpa: 8.74, credits: 22, status: 'In Progress (Proj. 8.74)' }
  ];

  const subjectPerformance = [
    {
      code: 'CST301',
      name: 'Operating Systems',
      faculty: 'Dr. Ramesh Chandra',
      attendance: 90.0,
      classes: '36/40',
      safeBunks: 8,
      midSem: '29 / 30',
      assignmentGrade: '9.5 / 10',
      labGrade: '24 / 25',
      gradeEst: 'O (Outstanding)',
      remarks: 'Exceptional grasping of concurrency, memory virtualisation, and Nachos OS kernel internals.'
    },
    {
      code: 'CST302',
      name: 'Database Management Systems',
      faculty: 'Prof. Ananya Verma',
      attendance: 84.2,
      classes: '32/38',
      safeBunks: 5,
      midSem: '28 / 30',
      assignmentGrade: '9.0 / 10',
      labGrade: '23 / 25',
      gradeEst: 'E (Excellent)',
      remarks: 'Strong relational modeling and query optimization skills. Thorough submission in PL/SQL triggers.'
    },
    {
      code: 'CST303',
      name: 'Design & Analysis of Algorithms',
      faculty: 'Prof. Jagabandhu Nayak',
      attendance: 80.0,
      classes: '28/35',
      safeBunks: 2,
      midSem: '27 / 30',
      assignmentGrade: '10 / 10',
      labGrade: '25 / 25',
      gradeEst: 'E (Excellent)',
      remarks: 'Very diligent in dynamic programming and graph theory problem-solving assignments.'
    },
    {
      code: 'CST304',
      name: 'Computer Networks',
      faculty: 'Dr. Pravat Kumar Sahoo',
      attendance: 83.3,
      classes: '30/36',
      safeBunks: 4,
      midSem: '29 / 30',
      assignmentGrade: '9.5 / 10',
      labGrade: '24 / 25',
      gradeEst: 'O (Outstanding)',
      remarks: 'Active participant in Cisco packet tracer labs and TCP congestion control simulations.'
    }
  ];

  // Invoices & Financial State
  const [invoices, setInvoices] = useState(INITIAL_FEE_INVOICES);
  const [ledger, setLedger] = useState(INITIAL_LEDGER_ENTRIES);
  const [payments, setPayments] = useState(INITIAL_PAYMENT_HISTORY);

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI');
  const [upiId, setUpiId] = useState('ramesh.mohapatra@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentReceiptData, setCurrentReceiptData] = useState(null);

  // Virtual PTM / Mentor Contact Modal
  const [ptmModalOpen, setPtmModalOpen] = useState(false);
  const [ptmSuccess, setPtmSuccess] = useState('');

  // Dynamic Financial Calculations
  const totalOutstanding = invoices.reduce((acc, inv) => acc + (inv.outstanding || 0), 0);
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.netPayable || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);

  // Open Payment Modal for a specific invoice or total dues
  const handleOpenPayModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    if (invoice) {
      setPayAmount(invoice.outstanding.toString());
    } else {
      setPayAmount(totalOutstanding.toString());
    }
    setPaySuccessMsg('');
    setPayModalOpen(true);
  };

  // Process Online Fee Payment
  const handleProcessPayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return;

    setIsProcessingPay(true);

    setTimeout(() => {
      const newTxnId = `TXN-PAR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newReceiptNo = `GZU-REC-2026-${Math.floor(80000 + Math.random() * 19000)}`;
      const sigHash = `CIT-HMAC-SHA256-${Date.now().toString(36).toUpperCase()}-AUTHENTICATED`;

      let remaining = amt;
      const updatedInvoices = invoices.map(inv => {
        if (selectedInvoice && inv.invoiceNo === selectedInvoice.invoiceNo) {
          const applied = Math.min(inv.outstanding, remaining);
          remaining -= applied;
          const newPaid = inv.paidAmount + applied;
          const newOutstanding = Math.max(0, inv.netPayable - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            outstanding: newOutstanding,
            status: newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID',
            paymentRef: newTxnId,
            receiptNo: newReceiptNo
          };
        } else if (!selectedInvoice && remaining > 0 && inv.outstanding > 0) {
          const applied = Math.min(inv.outstanding, remaining);
          remaining -= applied;
          const newPaid = inv.paidAmount + applied;
          const newOutstanding = Math.max(0, inv.netPayable - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            outstanding: newOutstanding,
            status: newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID',
            paymentRef: newTxnId,
            receiptNo: newReceiptNo
          };
        }
        return inv;
      });

      // Insert atomic ledger entry
      const newLedgerEntry = {
        id: `LED-${ledger.length + 1}`.padStart(7, '0'),
        date: new Date().toISOString().split('T')[0],
        type: 'CREDIT',
        component: `Online Payment via Parent Portal (${paymentMode})`,
        amount: amt,
        balance: Math.max(0, totalOutstanding - amt),
        ref: newTxnId
      };

      // Create verified payment receipt entry
      const newPayment = {
        txnId: newTxnId,
        date: new Date().toLocaleString(),
        mode: paymentMode,
        gateway: paymentMode === 'ONLINE_UPI' ? 'CIT Unified UPI Gateway' : `${selectedBank} Corporate Gateway`,
        signature: sigHash,
        amount: amt,
        invoiceNo: selectedInvoice ? selectedInvoice.invoiceNo : 'INV-2026-MULTI-DUES',
        receiptNo: newReceiptNo,
        status: 'VERIFIED'
      };

      setInvoices(updatedInvoices);
      setLedger([newLedgerEntry, ...ledger]);
      setPayments([newPayment, ...payments]);

      setIsProcessingPay(false);
      setPaySuccessMsg(`Payment of ₹${amt.toLocaleString()} successful! Digital Receipt: ${newReceiptNo}`);

      // Prepare receipt data
      setCurrentReceiptData({
        receiptNo: newReceiptNo,
        txnId: newTxnId,
        date: new Date().toLocaleString(),
        amount: amt,
        mode: paymentMode,
        invoiceNo: selectedInvoice ? selectedInvoice.invoiceNo : 'INV-2026-MULTI-DUES',
        title: selectedInvoice ? selectedInvoice.title : 'All Outstanding Institutional Dues',
        payer: 'Mr. Ramesh Mohapatra (Father)',
        studentName: ward.name,
        regNo: ward.regNo,
        branch: ward.branch
      });
    }, 1200);
  };

  // Open printable receipt
  const handleOpenReceipt = (invOrPayment) => {
    setCurrentReceiptData({
      receiptNo: invOrPayment.receiptNo || `GZU-REC-2026-${Math.floor(10000 + Math.random() * 80000)}`,
      txnId: invOrPayment.txnId || invOrPayment.paymentRef || 'TXN-BANK-INST-2026',
      date: invOrPayment.date || 'Aug 14, 2026',
      amount: invOrPayment.amount || invOrPayment.paidAmount || 45000,
      mode: invOrPayment.mode || 'ONLINE_NETBANKING',
      invoiceNo: invOrPayment.invoiceNo || 'INV-2026-08491',
      title: invOrPayment.title || invOrPayment.component || 'Tuition & Academic Services Fee',
      payer: 'Mr. Ramesh Mohapatra (Father)',
      studentName: ward.name,
      regNo: ward.regNo,
      branch: ward.branch
    });
    setReceiptModalOpen(true);
  };

  const wardPasses = gatePasses.filter(gp => gp.regNo === ward.regNo || gp.studentId === 'STU-2022-CSE-045');

  const TABS = [
    { id: 'overview',    label: 'Ward Overview',          icon: Users },
    { id: 'academics',   label: 'Academic Progress',      icon: GraduationCap },
    { id: 'fees',        label: 'Fees & Online Pay',      icon: Receipt, badge: totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString()}` : null },
    { id: 'gate_passes', label: 'Gate Passes & Safety',   icon: ShieldCheck },
    { id: 'bus_tracker', label: '🚌 Live Bus Tracker',    icon: MapPin },
    { id: 'alerts',      label: 'Campus Notices',         icon: Bell }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">

      {/* ── Top Hero Banner ── */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold border border-teal-500/30 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Parent & Guardian Portal • Chilika Institution of Technology (CIT)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome, Mr. Ramesh Mohapatra 👨‍👦
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
                Guardian of <strong>{ward.name}</strong> • Roll No: <span className="font-mono">{ward.rollNo}</span> ({ward.regNo}) • {ward.branch}
              </p>
            </div>

            {/* Quick Online Payment Action in Banner */}
            <div className="flex items-center gap-3">
              {totalOutstanding > 0 ? (
                <button
                  onClick={() => handleOpenPayModal(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Pay Pending Dues (₹{totalOutstanding.toLocaleString()})</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Dues Cleared ✓</span>
                </div>
              )}
              <button
                onClick={() => setPtmModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
              >
                <Smartphone className="w-4 h-4 text-teal-300" />
                <span>Contact Mentor</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Attendance</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{ward.overallAttendance}%</div>
              <div className="text-[10px] text-emerald-300 font-semibold">{ward.safeBunksRemaining} Safe Bunks Remaining</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Cumulative CGPA</div>
              <div className="text-xl sm:text-2xl font-black text-indigo-300 mt-0.5">{ward.cgpa} / 10</div>
              <div className="text-[10px] text-teal-200 font-semibold">Top 5% in CSE Cohort</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Pending Dues</div>
              <div className={`text-xl sm:text-2xl font-black mt-0.5 ${totalOutstanding > 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                {totalOutstanding > 0 ? `₹${totalOutstanding.toLocaleString()}` : '₹0'}
              </div>
              <div className="text-[10px] text-slate-300">
                {totalOutstanding > 0 ? '2 invoices pending' : 'Zero dues pending'}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">Campus Safety</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">IN CAMPUS</div>
              <div className="text-[10px] text-slate-300">Biometric Gate Verified</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tab Navigation Bar ── */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {TABS.map(({ id, label, icon: TabIcon, badge }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (setParentNavTab) setParentNavTab(id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === id
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TabIcon className="w-4 h-4" />
            <span>{label}</span>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === id ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1: WARD 360° OVERVIEW
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Ward Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={ward.avatar}
                  alt={ward.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-500/20 shadow-md"
                />
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{ward.name}</h3>
                  <div className="text-xs font-mono font-bold text-teal-700">{ward.rollNo} • Reg: {ward.regNo}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{ward.branch}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Program & Cohort</span>
                  <span className="font-bold text-slate-800">{ward.course} ({ward.cohort})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Current Semester</span>
                  <span className="font-bold text-slate-800">{ward.semester}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Admission Category</span>
                  <span className="font-bold text-slate-800">{ward.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Hostel Residence</span>
                  <span className="font-bold text-slate-800">{ward.hostel}, Room {ward.room}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Faculty Mentor</span>
                  <span className="font-bold text-teal-700">{ward.mentor}</span>
                </div>
              </div>

              <button
                onClick={() => setPtmModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5 text-teal-300" />
                <span>Request Virtual Parent-Teacher Meet</span>
              </button>
            </div>

            {/* Academic Snapshot & SGPA Progression */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <span>Academic Standing</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Top 5% Cohort
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200">
                  <span className="text-[10px] text-teal-800 font-bold uppercase">Current CGPA</span>
                  <div className="text-2xl font-black text-teal-900 mt-1">{ward.cgpa}</div>
                  <span className="text-[10px] text-teal-700 font-semibold">Scale of 10.0</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                  <span className="text-[10px] text-indigo-800 font-bold uppercase">Class Position</span>
                  <div className="text-2xl font-black text-indigo-900 mt-1">#4 Rank</div>
                  <span className="text-[10px] text-indigo-700 font-semibold">In CSE 64 Cohort</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-700">SGPA Trend (Semester 1 to 6)</div>
                <div className="space-y-1.5">
                  {semesterProgression.map(s => (
                    <div key={s.sem} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">{s.sem}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-teal-600 h-full rounded-full"
                            style={{ width: `${(s.sgpa / 10) * 100}%` }}
                          />
                        </div>
                        <span className="font-black text-slate-800 font-mono w-10 text-right">{s.sgpa.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('academics')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>View Full Grade & Internal Marks Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fee Status & 1-Click Payment Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <span>Fee Payment Status</span>
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    totalOutstanding > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {totalOutstanding > 0 ? 'Dues Pending' : 'Cleared'}
                  </span>
                </div>

                <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-amber-900">Total Outstanding</span>
                      <div className="text-2xl font-black text-amber-900 mt-1">₹{totalOutstanding.toLocaleString()}</div>
                      <span className="text-[11px] text-amber-800">Mess charges & Midsem Exam Fee</span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-200/50 text-amber-900">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Annual Tuition Fee (2026-27)</span>
                    <span className="font-bold text-emerald-700">₹45,000 (PAID ✓)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Hostel Rent Sem 6</span>
                    <span className="font-bold text-emerald-700">₹12,000 (PAID ✓)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Annapurna Mess (Term II)</span>
                    <span className="font-bold text-amber-700">₹8,000 (Due Sep 30)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Midsem Exam Fee</span>
                    <span className="font-bold text-amber-700">₹2,500 (Due Sep 25)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {totalOutstanding > 0 ? (
                  <button
                    onClick={() => handleOpenPayModal(null)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{totalOutstanding.toLocaleString()} Online via UPI / Card</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('fees')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Payment History & Receipts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Quick Subject Attendance Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Live Attendance & Lecture Eligibility</h3>
                <p className="text-xs text-slate-500">CIT requires minimum 75% attendance to qualify for Endsem examinations.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-600">{ward.overallAttendance}%</span>
                <span className="text-xs text-slate-500 block">Overall Cumulative</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectPerformance.map(sub => (
                <div key={sub.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-teal-700">{sub.code}</span>
                    <span className="text-xs font-black text-emerald-600">{sub.attendance}%</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate">{sub.name}</div>
                  <div className="text-[11px] text-slate-500">{sub.classes} Attended • {sub.safeBunks} Safe Bunks</div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sub.attendance}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2: ACADEMIC PROGRESS & PERFORMANCE
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Curriculum & Continuous Assessment</span>
              <h2 className="text-2xl font-black mt-1">{ward.name}&apos;s Academic Progress</h2>
              <p className="text-xs text-teal-100 mt-1">Detailed evaluation across mid-semesters, practical labs, and assignments.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert("Official Grade Transcript for Piyush Kumar Dey (Reg: 2201106145) generated. Downloading verified PDF with digital institutional seal.");
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20"
              >
                <Download className="w-4 h-4 text-teal-300" />
                <span>Download Semester Transcript (PDF)</span>
              </button>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-base">Semester 6 Enrolled Subjects & Continuous Assessment</h3>
                <p className="text-xs text-slate-500">Includes instructor feedback, lab performance, and safe bunks buffer.</p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Current Semester SGPA: 8.74
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {subjectPerformance.map(sub => (
                <div key={sub.code} className="p-5 space-y-3 hover:bg-slate-50/70 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{sub.code}</span>
                        <h4 className="font-black text-slate-900 text-sm">{sub.name}</h4>
                        <span className="text-xs text-slate-500">• Faculty: {sub.faculty}</span>
                      </div>
                      <div className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                        &ldquo;{sub.remarks}&rdquo;
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 min-w-[70px]">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Attendance</span>
                        <span className="text-xs font-black text-emerald-700">{sub.attendance}%</span>
                        <span className="text-[9px] text-slate-500 block">{sub.safeBunks} safe bunks</span>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 min-w-[70px]">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mid-Sem</span>
                        <span className="text-xs font-black text-indigo-700">{sub.midSem}</span>
                        <span className="text-[9px] text-slate-500 block">Out of 30</span>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 min-w-[70px]">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Assignment</span>
                        <span className="text-xs font-black text-purple-700">{sub.assignmentGrade}</span>
                        <span className="text-[9px] text-slate-500 block">100% On-time</span>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 min-w-[70px]">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Lab Grade</span>
                        <span className="text-xs font-black text-teal-700">{sub.labGrade}</span>
                        <span className="text-[9px] text-slate-500 block">Out of 25</span>
                      </div>
                      <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 min-w-[70px]">
                        <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Est. Grade</span>
                        <span className="text-xs font-black text-emerald-800">{sub.gradeEst.split(' ')[0]}</span>
                        <span className="text-[9px] text-emerald-600 block">Distinction</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Honors Strip */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Dean&apos;s Honor List & Merit Scholarship</h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  Piyush Kumar Dey has maintained a cumulative CGPA above 8.5 for 5 consecutive terms, qualifying for ₹15,000 Institutional Tuition Concession credited in Fee Ledger.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('fees')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex-shrink-0"
            >
              View Scholarship Credit in Ledger →
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3: FEES, INVOICES & ONLINE PAYMENT
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Finance & Fee Accounting Subsystem</span>
              <h2 className="text-2xl font-black mt-1">Student Fee Ledger & Online Payments</h2>
              <p className="text-xs text-teal-100 mt-1">
                Itemized invoice records, payment receipts (`GZU-REC-2026-XXXXX`), and instant online checkout with digital signature validation.
              </p>
            </div>
            {totalOutstanding > 0 && (
              <button
                onClick={() => handleOpenPayModal(null)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Total Dues (₹{totalOutstanding.toLocaleString()})</span>
              </button>
            )}
          </div>

          {/* 3 Financial KPI Cards */}
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Charges</span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{totalBilled.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500">Academic Session 2026-27</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-emerald-700 font-bold uppercase">Merit Scholarship</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">₹15,000</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Credited to Account</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase">Total Settled</span>
              <div className="text-2xl font-black text-teal-700 mt-1">₹{totalPaid.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-bold">100% Verified Receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-amber-700 font-bold uppercase">Current Outstanding</span>
              <div className={`text-2xl font-black mt-1 ${totalOutstanding > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                ₹{totalOutstanding.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">{totalOutstanding > 0 ? 'Due for settlement' : 'No balance due'}</span>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-base">Session Invoices & Payment Status</h3>
                <p className="text-xs text-slate-500">Official tax invoices generated under CIT Finance Ordinance.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Session: 2026-27 Even Semester</span>
            </div>

            <div className="divide-y divide-slate-100">
              {invoices.map((inv) => {
                const isPaid = inv.status === 'PAID';
                return (
                  <div key={inv.invoiceNo} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {inv.invoiceNo}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{inv.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Category: {inv.category} • Issued: {inv.issuedDate} • Due: {inv.dueDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Net Payable: <strong>₹{inv.netPayable.toLocaleString()}</strong></div>
                        <div className={`text-sm font-black ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {isPaid ? `Paid: ₹${inv.paidAmount.toLocaleString()}` : `Due: ₹${inv.outstanding.toLocaleString()}`}
                        </div>
                      </div>

                      {isPaid ? (
                        <button
                          onClick={() => handleOpenReceipt(inv)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-teal-600" />
                          <span>View Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPayModal(inv)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black transition shadow-sm flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Chronological Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-base">Itemized Financial Ledger History</h3>
                <p className="text-xs text-slate-500">Atomic accounting ledger recording all debits, credits, and waivers.</p>
              </div>
              <button
                onClick={() => {
                  const csv = "Date,Type,Component,Ref,Amount,Balance\n" + ledger.map(l => `${l.date},${l.type},"${l.component}",${l.ref},${l.amount},${l.balance}`).join("\n");
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `CIT_Fee_Ledger_${ward.regNo}.csv`;
                  a.click();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Component / Description</th>
                    <th className="py-2.5 px-3">Reference / Txn ID</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {ledger.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-sans text-slate-600">{row.date}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{row.component}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{row.ref}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${row.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {row.type === 'CREDIT' ? '-' : '+'}₹{row.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-700">₹{row.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Payments History */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-base">Verified Payment Receipts History</h3>
            <div className="divide-y divide-slate-100">
              {payments.map(pay => (
                <div key={pay.txnId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">{pay.receiptNo}</span>
                      <span className="text-xs text-slate-500">• Txn: {pay.txnId}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{pay.gateway} • Mode: {pay.mode} • {pay.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-600">₹{pay.amount.toLocaleString()}</span>
                    <button
                      onClick={() => handleOpenReceipt(pay)}
                      className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition"
                    >
                      Print A4 Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 4: GATE PASSES & WARD SAFETY
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'gate_passes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Ward Gate Pass & Transit Verification</h3>
              <p className="text-xs text-slate-500">Real-time gate timestamps recorded via turnstile RFID & biometrics.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Current Status: Verified Inside Campus
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {wardPasses.length > 0 ? wardPasses.map(gp => (
              <div key={gp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {gp.id}
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-1">{gp.destination || gp.reason}</div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    gp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    gp.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                    gp.status === 'OVERDUE'  ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {gp.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>Departure Out: <strong>{gp.outTime || '17:30'}</strong> → Expected In: <strong>{gp.expectedInTime || gp.expectedIn || '21:00'}</strong></div>
                  <div>Security Gate Token: <span className="font-mono text-teal-700">{gp.token || 'CIT-GP-8891-SEC'}</span></div>
                  {gp.approvedBy && <div className="text-emerald-700 font-medium">✓ Authorized by: {gp.approvedBy}</div>}
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-12 text-center text-xs text-slate-500">
                No active gate pass requests currently pending.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 5: LIVE BUS TRACKER
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'bus_tracker' && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-teal-900 text-sm">Real-time Campus Transit & Fleet Telematics</div>
              <div className="text-xs text-teal-700 mt-0.5">
                Track campus buses operating between Bhubaneswar Master Canteen, Khandagiri, and Chilika Institution of Technology.
              </div>
            </div>
          </div>
          <BusTracker />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 6: CAMPUS ALERTS
      ════════════════════════════════════════════════════════════ */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">Administrative & Academic Bulletins</h3>
            <span className="text-xs text-slate-400 font-semibold">Official Notices from CIT Deanery</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Even Semester Midsem Examination Schedule Released',
                desc: 'Examinations commence from Sept 25th in Block A & B. Admit cards available after fee clearance.',
                time: 'Today 10:15 AM',
                category: 'EXAMINATION CELL',
                type: 'urgent'
              },
              {
                title: 'Spectra Tech Fest 2026 Week 7 Schedule',
                desc: 'Auditorium and Turing Labs booked for annual flagship techfest. Hackathon registrations open.',
                time: 'Yesterday 04:30 PM',
                category: 'STUDENT WELFARE',
                type: 'info'
              },
              {
                title: 'Semester Attendance Cutoff Notice',
                desc: 'All students are reminded of the mandatory 75% attendance threshold for Endsem qualification.',
                time: '3 days ago',
                category: 'ACADEMIC DEAN',
                type: 'info'
              }
            ].map((alertItem, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Bell className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{alertItem.category}</span>
                    <span className="text-[10px] text-slate-400">{alertItem.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{alertItem.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{alertItem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: ONLINE FEE PAYMENT CHECKOUT
      ════════════════════════════════════════════════════════════ */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
            <button
              onClick={() => setPayModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {paySuccessMsg ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Payment Successfully Authenticated!</h3>
                <p className="text-xs text-slate-600">{paySuccessMsg}</p>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-mono">
                  HMAC-SHA256 Signature Verified • Atomic Ledger Posted
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setPayModalOpen(false);
                      if (currentReceiptData) setReceiptModalOpen(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                  >
                    View Official Printable Receipt
                  </button>
                  <button
                    onClick={() => setPayModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">CIT Unified Fee Gateway</span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">Pay Academic Fees Online</h3>
                  <p className="text-xs text-slate-500">
                    Paying for: <strong>{selectedInvoice ? selectedInvoice.title : 'All Outstanding Institutional Dues'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-teal-800 font-semibold">Payable Amount</span>
                    <div className="text-2xl font-black text-teal-950">₹{Number(payAmount || 0).toLocaleString()}</div>
                  </div>
                  <div className="text-right text-[10px] text-teal-700 font-mono">
                    Ward: {ward.rollNo}<br />{ward.regNo}
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">Select Payment Instrument:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ONLINE_UPI', label: '⚡ UPI / GPay' },
                      { id: 'ONLINE_NETBANKING', label: '🏛️ NetBanking' },
                      { id: 'ONLINE_CARD', label: '💳 Card' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMode(pm.id)}
                        className={`py-2 rounded-xl text-xs font-bold border transition text-center ${
                          paymentMode === pm.id
                            ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-inputs based on mode */}
                {paymentMode === 'ONLINE_UPI' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Parent UPI ID (Virtual Payment Address)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or name@okaxis"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm, BHIM, and all UPI apps.</span>
                  </div>
                )}

                {paymentMode === 'ONLINE_NETBANKING' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="HDFC Bank">HDFC Bank Corporate</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMode === 'ONLINE_CARD' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4111 •••• •••• 8891"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-700">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          defaultValue="08/29"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">CVV</label>
                        <input
                          type="password"
                          defaultValue="•••"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>256-bit TLS Encrypted • Server-Side HMAC-SHA256 Signature Validation</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setPayModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessingPay}
                    onClick={handleProcessPayment}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessingPay ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Signature...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize & Pay ₹{Number(payAmount || 0).toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: OFFICIAL PRINTABLE A4 RECEIPT
      ════════════════════════════════════════════════════════════ */}
      {receiptModalOpen && currentReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReceiptModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Letterhead Area */}
            <div id="printable-parent-receipt" className="space-y-6 p-4 border border-slate-200 rounded-2xl bg-white">
              
              {/* Header */}
              <div className="text-center pb-4 border-b border-slate-300">
                <div className="text-xs font-black tracking-widest text-teal-800 uppercase">
                  Chilika Institution of Technology (CIT)
                </div>
                <div className="text-[10px] text-slate-500">
                  Approved by AICTE • Affiliated to State Technical Directorate • Odisha
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-2 uppercase tracking-wide">
                  OFFICIAL FEE RECEIPT (DIGITAL ACKNOWLEDGEMENT)
                </h2>
                <div className="text-xs font-mono font-bold text-teal-700 mt-0.5">
                  Receipt No: {currentReceiptData.receiptNo}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <div className="text-slate-500">Student Name:</div>
                  <div className="font-bold text-slate-900">{currentReceiptData.studentName}</div>
                  <div className="text-slate-500 mt-1">Registration / Roll No:</div>
                  <div className="font-mono font-bold text-slate-900">{currentReceiptData.regNo}</div>
                  <div className="text-slate-500 mt-1">Branch / Course:</div>
                  <div className="font-bold text-slate-900">{currentReceiptData.branch}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Date & Time:</div>
                  <div className="font-bold text-slate-900">{currentReceiptData.date}</div>
                  <div className="text-slate-500 mt-1">Transaction Ref:</div>
                  <div className="font-mono text-slate-900 font-bold">{currentReceiptData.txnId}</div>
                  <div className="text-slate-500 mt-1">Payer (Parent/Guardian):</div>
                  <div className="font-bold text-teal-800">{currentReceiptData.payer}</div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Particulars</th>
                      <th className="p-2.5">Invoice No</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-800">{currentReceiptData.title}</td>
                      <td className="p-2.5 font-mono text-slate-500">{currentReceiptData.invoiceNo}</td>
                      <td className="p-2.5 font-black text-right text-slate-900">₹{currentReceiptData.amount.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50/70 font-bold">
                      <td colSpan="2" className="p-2.5 text-right">Total Amount Received:</td>
                      <td className="p-2.5 text-right text-emerald-700 font-black">₹{currentReceiptData.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verification Stamp & Sign */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HMAC-SHA256 SIGNATURE AUTHENTICATED</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    This is a computer-generated receipt issued by AstraCampus OS.
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-signature text-sm font-bold text-slate-800 italic">Dr. Ramesh Chandra</div>
                  <div className="text-[10px] text-slate-500 border-t border-slate-300 pt-0.5">Finance Controller, CIT</div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt (A4)</span>
              </button>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: REQUEST PARENT-TEACHER VIRTUAL MEETING
      ════════════════════════════════════════════════════════════ */}
      {ptmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => { setPtmModalOpen(false); setPtmSuccess(''); }}
              className="absolute right-5 top-5 p-1 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {ptmSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Meeting Scheduled!</h3>
                <p className="text-xs text-slate-600">{ptmSuccess}</p>
                <button
                  onClick={() => { setPtmModalOpen(false); setPtmSuccess(''); }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs transition mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Mentor Interaction</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">Schedule Virtual PTM</h3>
                  <p className="text-xs text-slate-500">Direct consultation with <strong>{ward.mentor}</strong>.</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Preferred Slot</label>
                    <select className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold mt-1 text-xs">
                      <option>Tomorrow 04:30 PM - 05:00 PM (Google Meet)</option>
                      <option>Thursday 03:00 PM - 03:30 PM (Google Meet)</option>
                      <option>Friday 05:00 PM - 05:30 PM (Campus Deanery Office)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Topic of Discussion</label>
                    <textarea
                      rows="3"
                      defaultValue="Review 6th semester elective options and campus placement preparation."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-sans text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setPtmModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPtmSuccess(`Your meeting request with ${ward.mentor} is confirmed for Tomorrow at 04:30 PM via Google Meet. Calendar invite dispatched to ramesh.mohapatra@gmail.com.`);
                    }}
                    className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                  >
                    Confirm Meeting
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}