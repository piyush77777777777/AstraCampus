import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  Receipt, CreditCard, DollarSign, Wallet, FileText, Download,
  CheckCircle2, Clock, AlertTriangle, Printer, Search, Plus,
  ShieldCheck, RefreshCw, BarChart3, Users, Building2, Sparkles, Filter, X
} from 'lucide-react';
import {
  ACADEMIC_SESSIONS,
  BRANCH_TAXONOMY,
  INITIAL_STUDENT_FEE_PROFILE,
  INITIAL_FEE_INVOICES,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_PAYMENT_HISTORY,
  INITIAL_ACCOUNTS_KPIS,
  INITIAL_FINANCE_INTELLIGENCE_ALERTS
} from '../../data/feeDataset';

export default function StudentFeeManagement({ initialView = 'student' }) {
  const { currentUser, activeRole } = useCampus();

  // Mode: 'student' (Student Portal) or 'accounts' (Accounts Executive / Admin)
  const [viewMode, setViewMode] = useState(initialView);
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'invoices' | 'pay' | 'history' | 'receipt' | 'structure' | 'reconciliation' | 'offline'

  // Dynamic state
  const [invoices, setInvoices] = useState(INITIAL_FEE_INVOICES);
  const [ledger, setLedger] = useState(INITIAL_LEDGER_ENTRIES);
  const [payments, setPayments] = useState(INITIAL_PAYMENT_HISTORY);
  const [kpis, setKpis] = useState(INITIAL_ACCOUNTS_KPIS);
  const [selectedReceipt, setSelectedReceipt] = useState(INITIAL_FEE_INVOICES[0]);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('ONLINE_UPI');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Counter / Offline Collection Form
  const [offlineForm, setOfflineForm] = useState({
    studentId: '2201106145',
    studentName: 'Piyush Kumar Dey',
    invoiceNo: 'INV-2026-08493',
    amount: '8000',
    mode: 'OFFLINE_CASH',
    refNo: 'CASH-REC-' + Math.floor(1000 + Math.random() * 9000),
    notes: 'Counter payment received at Accounts Desk'
  });

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSession, setActiveSession] = useState('2026-27 (Active)');

  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.outstanding, 0);

  // Handle Online Fee Payment with signature verification simulation
  const handleProcessPayment = () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    setIsProcessingPay(true);

    setTimeout(() => {
      const amountNum = Number(payAmount);
      const newTxnId = `PAY-2026-${Math.floor(70000 + Math.random() * 9000)}`;
      const newReceiptNo = `GZU-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const signature = `SIG-HMAC-SHA256-${Date.now().toString(36).toUpperCase()}-AUTHENTICATED`;

      // Update invoice
      let remainingPayment = amountNum;
      const updatedInvoices = invoices.map(inv => {
        if (payInvoice && inv.invoiceNo === payInvoice.invoiceNo) {
          const newPaid = inv.paidAmount + remainingPayment;
          const newOutstanding = Math.max(0, inv.netPayable - newPaid);
          const newStatus = newOutstanding === 0 ? 'PAID' : 'PARTIALLY_PAID';
          return {
            ...inv,
            paidAmount: newPaid,
            outstanding: newOutstanding,
            status: newStatus,
            paymentRef: newTxnId,
            receiptNo: newReceiptNo
          };
        }
        return inv;
      });

      // Update Ledger
      const newLedgerEntry = {
        id: `LED-${ledger.length + 1}`.padStart(7, '0'),
        date: new Date().toISOString().split('T')[0],
        type: 'CREDIT',
        component: `Online Payment (${paymentMode})`,
        amount: amountNum,
        balance: Math.max(0, totalOutstanding - amountNum),
        ref: newTxnId
      };

      // Update Payment History
      const newPaymentRecord = {
        txnId: newTxnId,
        date: new Date().toLocaleString(),
        mode: paymentMode,
        gateway: paymentMode === 'ONLINE_UPI' ? 'Razorpay Unified UPI Gateway' : 'HDFC Corporate NetBanking',
        signature: signature,
        amount: amountNum,
        invoiceNo: payInvoice?.invoiceNo || 'INV-2026-MULTI',
        receiptNo: newReceiptNo,
        status: 'VERIFIED'
      };

      setInvoices(updatedInvoices);
      setLedger([newLedgerEntry, ...ledger]);
      setPayments([newPaymentRecord, ...payments]);
      setKpis(prev => ({
        ...prev,
        todayCollection: prev.todayCollection + amountNum,
        monthCollection: prev.monthCollection + amountNum,
        totalSessionCollection: prev.totalSessionCollection + amountNum,
        totalOutstandingAmount: Math.max(0, prev.totalOutstandingAmount - amountNum)
      }));

      setIsProcessingPay(false);
      setPayModalOpen(false);
      setPaySuccessMsg(`Payment of ₹${amountNum.toLocaleString()} successful! Digital Receipt ${newReceiptNo} issued.`);
      setTimeout(() => setPaySuccessMsg(''), 6000);
    }, 1000);
  };

  // Handle Offline / Counter payment
  const handleOfflineSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(offlineForm.amount);
    const newTxnId = `PAY-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
    const newReceiptNo = `GZU-REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPaymentRecord = {
      txnId: newTxnId,
      date: new Date().toLocaleString(),
      mode: offlineForm.mode,
      gateway: `CIT Cash Counter (${offlineForm.refNo})`,
      signature: `OFFLINE-STAMP-${Date.now().toString(36).toUpperCase()}`,
      amount: amountNum,
      invoiceNo: offlineForm.invoiceNo,
      receiptNo: newReceiptNo,
      status: 'VERIFIED'
    };

    setPayments([newPaymentRecord, ...payments]);
    setKpis(prev => ({
      ...prev,
      todayCollection: prev.todayCollection + amountNum,
      totalOutstandingAmount: Math.max(0, prev.totalOutstandingAmount - amountNum)
    }));

    setPaySuccessMsg(`Offline counter entry recorded for ${offlineForm.studentName}. Receipt ${newReceiptNo} printed.`);
    setTimeout(() => setPaySuccessMsg(''), 6000);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Entry_ID', 'Date', 'Type', 'Component', 'Amount', 'Reference', 'Balance'];
    const rows = ledger.map(l => [l.id, l.date, l.type, `"${l.component}"`, l.amount, l.ref, l.balance]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CIT_Student_Fee_Ledger_2201106145.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* ── Top Header Banner ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Chilika Institution of Technology (CIT) • Institutional Finance & Accounts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Student Fee Ledger & Invoicing Engine
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
            Atomic ledger posting, verifiable digital receipts (`GZU-REC-YYYY-XXXXX`), aging analysis, and online gateway reconciliation.
          </p>
        </div>

        {/* View Mode Switcher (Student vs Accounts Executive) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700">
          <button
            onClick={() => { setViewMode('student'); setActiveTab('ledger'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'student' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Student Portal View
          </button>
          <button
            onClick={() => { setViewMode('accounts'); setActiveTab('kpis'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'accounts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Accounts Executive View
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {paySuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{paySuccessMsg}</span>
          </div>
          <button onClick={() => setPaySuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. STUDENT PORTAL VIEW                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'student' && (
        <div className="space-y-6">

          {/* Student Profile & Quick Financial Health Card */}
          <div className="grid md:grid-cols-4 gap-4">
            
            {/* Profile Info */}
            <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Student Identity</span>
                  <h3 className="text-lg font-black text-slate-900">{INITIAL_STUDENT_FEE_PROFILE.studentName}</h3>
                  <div className="text-xs text-slate-600 font-semibold">{INITIAL_STUDENT_FEE_PROFILE.branch} ({INITIAL_STUDENT_FEE_PROFILE.currentSem})</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {INITIAL_STUDENT_FEE_PROFILE.session}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100 font-mono">
                <div>Reg No: <strong>{INITIAL_STUDENT_FEE_PROFILE.regNo}</strong></div>
                <div>Roll No: <strong>{INITIAL_STUDENT_FEE_PROFILE.rollNo}</strong></div>
                <div>Category: <strong className="font-sans">{INITIAL_STUDENT_FEE_PROFILE.admissionCategory}</strong></div>
                <div>Guardian: <strong className="font-sans">{INITIAL_STUDENT_FEE_PROFILE.fatherName}</strong></div>
              </div>
            </div>

            {/* Total Outstanding & Pay Button */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Total Outstanding Dues</span>
                <div className="text-3xl font-black text-amber-400 mt-1">₹{totalOutstanding.toLocaleString()}</div>
                <p className="text-[11px] text-slate-300 mt-1">2 Pending Invoices (Mess + Midsem)</p>
              </div>
              <button
                onClick={() => {
                  setPayInvoice(invoices.find(i => i.outstanding > 0));
                  setPayAmount(String(totalOutstanding));
                  setPayModalOpen(true);
                }}
                className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Pay Outstanding Fees Online
              </button>
            </div>

            {/* Dues & Aging Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aging Analysis</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">0 - 30 Days (Current)</span>
                  <span className="font-mono font-bold text-slate-800">₹2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">31 - 60 Days (Mess Adv)</span>
                  <span className="font-mono font-bold text-amber-600">₹8,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">61 - 90 Days</span>
                  <span className="font-mono font-bold text-emerald-600">₹0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">&gt; 90 Days (Overdue)</span>
                  <span className="font-mono font-bold text-emerald-600">₹0 [CLEAR]</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[10px] text-emerald-600 font-bold">
                ✓ No academic hold / Examination hall ticket cleared
              </div>
            </div>

          </div>

          {/* Student Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'ledger', label: 'Itemized Fee Ledger' },
              { id: 'invoices', label: 'Invoices & Billing' },
              { id: 'history', label: 'Payment Records' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleExportCSV}
              className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Tab 1: Itemized Fee Ledger */}
          {activeTab === 'ledger' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Complete Student Fee Ledger History</span>
                <span className="text-xs font-mono text-slate-500">Account: 2201106145</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Entry ID</th>
                      <th className="p-3">Posting Date</th>
                      <th className="p-3">Component / Description</th>
                      <th className="p-3">Debit (₹)</th>
                      <th className="p-3">Credit (₹)</th>
                      <th className="p-3">Reference Ref</th>
                      <th className="p-3 text-right">Net Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ledger.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-500 font-bold">{entry.id}</td>
                        <td className="p-3 text-slate-600">{entry.date}</td>
                        <td className="p-3 font-semibold text-slate-900">{entry.component}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {entry.type === 'DEBIT' ? `₹${entry.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-600">
                          {entry.type === 'CREDIT' ? `₹${entry.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 font-mono text-xs text-blue-600">{entry.ref}</td>
                        <td className="p-3 font-mono font-black text-slate-900 text-right">
                          ₹{entry.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Invoices */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Session Invoices (`INV-YYYY-XXXXX`)</span>
                <span className="text-xs text-slate-500">Billed under session {activeSession}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Title / Particulars</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Paid</th>
                      <th className="p-3">Outstanding</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.invoiceNo} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{inv.title}</div>
                          <div className="text-[11px] text-slate-500">{inv.semester} • Issued: {inv.issueDate}</div>
                        </td>
                        <td className="p-3 text-slate-600">{inv.dueDate}</td>
                        <td className="p-3 font-mono font-bold">₹{inv.amount.toLocaleString()}</td>
                        <td className="p-3 font-mono text-emerald-600 font-bold">₹{inv.paidAmount.toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-amber-600">₹{inv.outstanding.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            inv.status === 'PARTIALLY_PAID' ? 'bg-amber-100 text-amber-800' :
                            inv.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {inv.outstanding > 0 && (
                            <button
                              onClick={() => {
                                setPayInvoice(inv);
                                setPayAmount(String(inv.outstanding));
                                setPayModalOpen(true);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
                            >
                              Pay Now
                            </button>
                          )}
                          {inv.paidAmount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedReceipt(inv);
                                setReceiptModalOpen(true);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition border border-slate-300"
                            >
                              View Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Payment History */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Searchable Payment Records & Digital Receipts</span>
                <span className="text-xs text-emerald-600 font-bold">✓ HMAC-SHA256 Signed Gateway Orders</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Transaction ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Payment Channel</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Invoice Ref</th>
                      <th className="p-3">Receipt No</th>
                      <th className="p-3 text-right">Receipt Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.txnId} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-purple-600">{p.txnId}</td>
                        <td className="p-3 text-slate-600">{p.date}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{p.mode}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.gateway}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                        <td className="p-3 font-mono text-xs text-blue-600">{p.invoiceNo}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{p.receiptNo}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedReceipt({
                                receiptNo: p.receiptNo,
                                invoiceNo: p.invoiceNo,
                                title: 'Tuition & Academic Term Payment',
                                paidAmount: p.amount,
                                issueDate: p.date,
                                status: 'PAID'
                              });
                              setReceiptModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print A4</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. ACCOUNTS EXECUTIVE VIEW                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'accounts' && (
        <div className="space-y-6">

          {/* Accounts Executive KPI Strip */}
          <div className="grid sm:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Collections</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">₹{kpis.todayCollection.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500 font-medium">14 Transactions Recorded</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Month Collections</span>
              <div className="text-2xl font-black text-blue-600 mt-1">₹{(kpis.monthCollection / 100000).toFixed(2)} Lakh</div>
              <span className="text-[10px] text-emerald-600 font-bold">92.4% Target Achieved</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Session Total</span>
              <div className="text-2xl font-black text-purple-600 mt-1">₹{(kpis.totalSessionCollection / 10000000).toFixed(2)} Cr</div>
              <span className="text-[10px] text-slate-500 font-medium">Session 2026-27</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Overdue</span>
              <div className="text-2xl font-black text-rose-600 mt-1">₹{(kpis.totalOverdueAmount / 100000).toFixed(2)} Lakh</div>
              <span className="text-[10px] text-rose-700 font-bold">18 Defaulters Flagged</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reconciliation</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">0 Clashes</div>
              <span className="text-[10px] text-emerald-700 font-bold">100% Match with Gateway</span>
            </div>
          </div>

          {/* Accounts Sub-Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'kpis', label: 'Finance Intelligence & SQL Alerts' },
              { id: 'offline', label: 'Counter Collections (Cash/DD/Cheque)' },
              { id: 'structure', label: 'Fee Structure Taxonomy (B.Tech Branches)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleExportCSV}
              className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Ledger CSV</span>
            </button>
          </div>

          {/* Tab: Finance Intelligence & SQL Alerts */}
          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs">
                <span className="font-bold">System-Generated Financial Intelligence:</span> Real database queries monitoring institutional collections, fee defaults, and gateway reconciliations in real-time.
              </div>

              <div className="space-y-3">
                {INITIAL_FINANCE_INTELLIGENCE_ALERTS.map(alert => (
                  <div key={alert.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          alert.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                          alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-500">{alert.id}</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">✓ Automated Action Taken</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                      {alert.query}
                    </div>
                    <div className="text-xs text-slate-800 font-semibold">{alert.message}</div>
                    <div className="text-xs text-indigo-700 font-bold">Status: {alert.actionRequired}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Counter / Offline Collections */}
          {activeTab === 'offline' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Counter & Offline Fee Entry Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Record Cash, Cheque, Demand Draft (DD), or NEFT receipts at Accounts Desk.</p>
              </div>

              <form onSubmit={handleOfflineSubmit} className="space-y-4 max-w-2xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Student Reg No</label>
                    <input
                      type="text"
                      value={offlineForm.studentId}
                      onChange={e => setOfflineForm({ ...offlineForm, studentId: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Student Name</label>
                    <input
                      type="text"
                      value={offlineForm.studentName}
                      onChange={e => setOfflineForm({ ...offlineForm, studentName: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Invoice Reference</label>
                    <select
                      value={offlineForm.invoiceNo}
                      onChange={e => setOfflineForm({ ...offlineForm, invoiceNo: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                    >
                      <option value="INV-2026-08493">INV-2026-08493 (Mess - ₹8,000)</option>
                      <option value="INV-2026-08502">INV-2026-08502 (Midsem - ₹2,500)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Amount Received (₹)</label>
                    <input
                      type="number"
                      value={offlineForm.amount}
                      onChange={e => setOfflineForm({ ...offlineForm, amount: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Collection Channel</label>
                    <select
                      value={offlineForm.mode}
                      onChange={e => setOfflineForm({ ...offlineForm, mode: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs"
                    >
                      <option value="OFFLINE_CASH">Cash at Desk</option>
                      <option value="OFFLINE_DD">Demand Draft (DD)</option>
                      <option value="OFFLINE_CHEQUE">Bank Cheque</option>
                      <option value="OFFLINE_NEFT">NEFT / RTGS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Instrument / Receipt Ref</label>
                  <input
                    type="text"
                    value={offlineForm.refNo}
                    onChange={e => setOfflineForm({ ...offlineForm, refNo: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition"
                >
                  Post Offline Collection & Issue Digital Receipt
                </button>
              </form>
            </div>
          )}

          {/* Tab: Fee Structure Taxonomy */}
          {activeTab === 'structure' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">B.Tech Branch Fee Taxonomy & Cohort Matrix</span>
                <span className="text-xs font-mono text-slate-500">Session 2026-27</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Branch Code</th>
                      <th className="p-3">Branch Name</th>
                      <th className="p-3">Tuition / Sem</th>
                      <th className="p-3">Lab Fee / Sem</th>
                      <th className="p-3">Campus Dev Fee</th>
                      <th className="p-3">Total / Sem</th>
                      <th className="p-3 text-right">Cohort Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {BRANCH_TAXONOMY.map(br => (
                      <tr key={br.code} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-indigo-600">{br.code}</td>
                        <td className="p-3 font-bold text-slate-900">{br.name}</td>
                        <td className="p-3 font-mono">₹{br.tuition.toLocaleString()}</td>
                        <td className="p-3 font-mono">₹{br.lab.toLocaleString()}</td>
                        <td className="p-3 font-mono">₹{br.dev.toLocaleString()}</td>
                        <td className="p-3 font-mono font-black text-emerald-600">
                          ₹{(br.tuition + br.lab + br.dev).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-700">{br.intake} Students</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. ONLINE PAYMENT MODAL                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Secure Online Fee Payment</h3>
                <p className="text-[11px] text-slate-500">Atomic ledger posting with HMAC-SHA256 signature</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono font-bold text-blue-600">{payInvoice?.invoiceNo || 'INV-2026-MULTI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding:</span>
                <span className="font-mono font-bold text-amber-600">₹{payInvoice?.outstanding.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Payment Amount (₹)</label>
              <input
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl border border-slate-300 text-lg font-mono font-black text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Payment Channel</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'ONLINE_UPI', label: 'Razorpay UPI' },
                  { id: 'ONLINE_NETBANKING', label: 'NetBanking' },
                  { id: 'ONLINE_CARD', label: 'Debit/Credit Card' },
                  { id: 'ONLINE_WALLET', label: 'Institution Wallet' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    className={`p-2.5 rounded-xl border text-left font-bold transition ${
                      paymentMode === mode.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 space-y-0.5">
              <div className="font-bold">✓ 256-Bit SSL Encrypted Order</div>
              <div>Simulates gateway callback and server-side signature verification.</div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={isProcessingPay}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {isProcessingPay ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying HMAC Signature...</span>
                </>
              ) : (
                <span>Authorize Payment ₹{Number(payAmount || 0).toLocaleString()}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. DIGITAL RECEIPT MODAL (A4 PRINTABLE TEMPLATE)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {receiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-300 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500">Official Electronic Receipt</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setReceiptModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 Form Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <h2 className="text-lg font-black tracking-wider uppercase text-slate-950">
                Chilika Institution of Technology (CIT)
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                Chilika Lake Campus, Odisha | Directorate of Academic Finance & Accounts
              </p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[11px] font-bold">
                FEE PAYMENT RECEIPT • {selectedReceipt.receiptNo || 'GZU-REC-2026-00412'}
              </div>
            </div>

            {/* Student & Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div>Student Name: <strong>{INITIAL_STUDENT_FEE_PROFILE.studentName}</strong></div>
                <div>Reg No: <strong>{INITIAL_STUDENT_FEE_PROFILE.regNo}</strong></div>
                <div>Roll No: <strong>{INITIAL_STUDENT_FEE_PROFILE.rollNo}</strong></div>
                <div>Branch: <strong>{INITIAL_STUDENT_FEE_PROFILE.branch}</strong></div>
              </div>
              <div className="space-y-1 text-right">
                <div>Receipt Date: <strong>{selectedReceipt.issueDate || '2026-01-10'}</strong></div>
                <div>Invoice Ref: <strong>{selectedReceipt.invoiceNo}</strong></div>
                <div>Payment Mode: <strong>ONLINE_VERIFIED</strong></div>
                <div>Session: <strong>2026-27</strong></div>
              </div>
            </div>

            {/* Breakdown Table */}
            <table className="w-full text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                <tr>
                  <th className="p-2 border border-slate-200 text-left">Fee Particulars</th>
                  <th className="p-2 border border-slate-200 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-medium">{selectedReceipt.title || 'Semester Fee'}</td>
                  <td className="p-2.5 border border-slate-200 font-mono text-right font-bold">₹{selectedReceipt.paidAmount?.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2.5 border border-slate-200 text-slate-900">TOTAL RECEIVED</td>
                  <td className="p-2.5 border border-slate-200 font-mono text-right text-emerald-600 text-sm">
                    ₹{selectedReceipt.paidAmount?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signature & Seal */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
              <div className="space-y-1 font-mono text-[10px] text-slate-500">
                <div>Signature: HMAC-SHA256-AUTHENTICATED</div>
                <div>Status: ALL DUES RECONCILED WITH TREASURY</div>
              </div>
              <div className="text-center space-y-1">
                <div className="w-32 border-b border-slate-400 mx-auto"></div>
                <div className="font-bold text-slate-800 text-[11px]">Finance Officer / Cashier</div>
                <div className="text-[10px] text-slate-500">Chilika Institution of Technology</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
