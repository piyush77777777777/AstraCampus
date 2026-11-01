import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Users,
  ShieldCheck,
  Wrench,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  X,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboard() {
  const {
    currentPersona,
    complaints,
    gatePasses,
    campusHotspotStats,
    auditLogs,
    approveGatePass,
    rejectGatePass,
    updateComplaintStatus,
    escalateComplaint
  } = useCampus();
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState('tickets'); // 'tickets' | 'heatmap' | 'approvals' | 'audit'
  const [selectedTicketForAction, setSelectedTicketForAction] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Critical metrics
  const pendingPasses = gatePasses.filter(gp => gp.status === 'PENDING');
  const outsideStudents = gatePasses.filter(gp => gp.status === 'CHECKED_OUT');
  const overdueTickets = complaints.filter(c => c.status === 'ESCALATED' || c.slaBreached);
  const totalActiveTickets = complaints.filter(c => c.status !== 'RESOLVED').length;

  const handleResolveTicket = (ticketId) => {
    updateComplaintStatus(ticketId, 'RESOLVED', resolutionNote || 'Resolved by Chief Maintenance Team.');
    setSelectedTicketForAction(null);
    setResolutionNote('');
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Command Center Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Unified Administrator Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('admin.commandCenter')}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Logged in: <strong>{currentPersona.name}</strong> ({currentPersona.title || 'Hostel Administration'})
            <br />
            {t('admin.subtitle')}
          </p>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('admin.totalPending')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{totalActiveTickets + pendingPasses.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {pendingPasses.length} gate passes, {totalActiveTickets} tickets
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {t('admin.overdueTickets')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-700">{overdueTickets.length}</div>
            <div className="text-[11px] text-rose-600 font-medium mt-0.5">
              Action required: Tap leaking 9 days
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('admin.outCampusStudents')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{outsideStudents.length}</div>
            <div className="text-[11px] text-amber-600 font-medium mt-0.5">
              Curfew monitor active
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Food Saved (Month)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700">748 kg</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              ₹89,760 saved across messes
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'tickets'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ticket Ageing & SLA Tracker ({complaints.length})
          </button>
          <button
            onClick={() => setActiveSubTab('approvals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'approvals'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Gate Passes ({pendingPasses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('heatmap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'heatmap'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recurring Issues Heatmap
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'audit'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campus Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Ticket Ageing & SLA Tracker */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Campus Maintenance Ageing Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Automated SLA monitoring: Overdue tickets escalate directly to Chief Warden & Estate Officer
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Issue & Location</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Ageing / SLA</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Warden Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        ticket.status === 'ESCALATED' ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{ticket.id}</td>
                      <td className="py-3 px-3 max-w-[280px]">
                        <div className="font-bold text-slate-900">{ticket.title}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{ticket.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{ticket.category}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${ticket.reportedDaysAgo >= 3 ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span className={`font-extrabold ${ticket.reportedDaysAgo >= 3 ? 'text-rose-700' : 'text-slate-700'}`}>
                            {ticket.reportedDaysAgo === 0 ? 'Today' : `${ticket.reportedDaysAgo} Days Old`}
                          </span>
                        </div>
                        {ticket.slaBreached && (
                          <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                            Breached SLA (Max {ticket.slaTargetHours}h)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          ticket.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ticket.status === 'ESCALATED'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                            : ticket.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {ticket.status !== 'RESOLVED' && (
                            <>
                              {ticket.status !== 'ESCALATED' && (
                                <button
                                  onClick={() => escalateComplaint(ticket.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all"
                                >
                                  Escalate
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedTicketForAction(ticket)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                              >
                                Resolve
                              </button>
                            </>
                          )}
                          {ticket.status === 'RESOLVED' && (
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resolve Ticket Modal */}
          {selectedTicketForAction && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    Close & Resolve Maintenance Ticket
                  </h4>
                  <button onClick={() => setSelectedTicketForAction(null)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  Resolving: <strong>{selectedTicketForAction.title}</strong> ({selectedTicketForAction.id})
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Technician Resolution Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Plumber Manoj Rout replaced the inner rubber washer and Teflon tape on the 3rd-floor tap. No leakage detected."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicketForAction(null)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleResolveTicket(selectedTicketForAction.id)}
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                  >
                    Confirm Resolution
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Gate Pass Approvals */}
      {activeSubTab === 'approvals' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hostel Warden Gate Pass Authorization Queue
              </h3>
              <p className="text-xs text-slate-500">
                1-Click approve or reject outings with automatic SMS dispatch to student's parent/guardian
              </p>
            </div>
          </div>

          {pendingPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPasses.map((gp) => (
                <div key={gp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{gp.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{gp.studentName}</h4>
                      <p className="text-xs text-slate-500">{gp.regNo} • Room {gp.room}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {gp.passType}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div><strong>Destination:</strong> {gp.destination}</div>
                    <div><strong>Curfew:</strong> Out: {gp.outTime} → In: {gp.expectedInTime}</div>
                    <div><strong>Guardian:</strong> {gp.emergencyPhone}</div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => rejectGatePass(gp.id)}
                      className="w-1/2 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveGatePass(gp.id)}
                      className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      1-Click Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No pending gate pass requests in the warden queue. All applications approved.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recurring Issue Hotspots Heatmap */}
      {activeSubTab === 'heatmap' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('admin.heatmapTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {t('admin.heatmapSubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campusHotspotStats.map((hotspot, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  hotspot.risk === 'CRITICAL'
                    ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-sm text-slate-900">{hotspot.block}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    hotspot.risk === 'CRITICAL'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : hotspot.risk === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {hotspot.risk} HOTSPOT
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium">{hotspot.wing}</div>

                <div className="my-3 py-2 px-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Total Recurring Incidents:</span>
                  <span className="text-base font-black text-slate-900">{hotspot.issues}</span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Primary Failure Mode: <strong className="text-slate-800">{hotspot.primaryIssue}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <strong>Actionable Engineering Insight:</strong> Block B 3rd Floor has registered 14 plumbing tickets in 30 days. Replacing the internal water riser gasket will eliminate 90% of recurring tap leak complaints across the wing.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('admin.auditTrail')}
              </h3>
              <p className="text-xs text-slate-500">
                Cryptographic immutable log of every institutional action, approval, and gate crossing
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actor}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{log.details}</p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
