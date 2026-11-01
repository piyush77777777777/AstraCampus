import React, { useState } from 'react';
import { BookOpen, CheckCircle2, FileSpreadsheet, ArrowRight, Download, Users, Shield, Server, Sparkles } from 'lucide-react';

export default function AdoptionRoadmap() {
  const [activeTab, setActiveTab] = useState('phases'); // 'phases' | 'migration' | 'change'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Institutional Deliverable 5 | Adoption & Migration Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            How Chilika Institution of Technology (CIT) Rolls This Out in 30 Days
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            A realistic, battle-tested operational guide for principals, deans, and administrators transitioning 1,000+ students from paper registers, WhatsApp chaos, and legacy Excel sheets into AstraCampus without disruption.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('phases')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'phases'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3-Phase Rollout Plan
        </button>
        <button
          onClick={() => setActiveTab('migration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'migration'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Data Migration Schemas (CSV/Excel)
        </button>
        <button
          onClick={() => setActiveTab('change')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'change'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Change Management & Staff Training
        </button>
      </div>

      {/* Content Tab 1: 3-Phase Rollout */}
      {activeTab === 'phases' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                  WEEKS 1 - 2
                </span>
                <span className="text-xs text-slate-400 font-bold">Phase 1</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Digital Gate Pass & Targeted Notices
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Replaces paper outing registers and chaotic WhatsApp groups first. Provides immediate, visible friction reduction for students and wardens within 48 hours.
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Setup tablet or guard phone at North & South campus gates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Dual-running period: Guard scans QR while signing physical logbook for 7 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Pin UNIFY notice link to all existing WhatsApp groups with read tracking.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-blue-700 font-bold">
              Target: 100% Student Onboarding
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
                  WEEKS 3 - 4
                </span>
                <span className="text-xs text-slate-400 font-bold">Phase 2</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Hostel Maintenance & Mess Waste Opt-In
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Connects student grievances directly to plumbers, electricians, and mess supervisors. Establishes the SLA watchdog to stop 9-day leaking taps.
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Distribute maintenance tablet to Chief Plumber & Electrician pool.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Activate 4:00 PM "Eating Tonight?" dining poll to forecast dinner headcounts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Enable SMS / USSD dialer (`*789#`) for non-smartphone student cohort.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-indigo-700 font-bold">
              Target: 30% Food Waste Reduction
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  MONTH 2 ONWARDS
                </span>
                <span className="text-xs text-slate-400 font-bold">Phase 3</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Instant Academic Bonafide & Executive Analytics
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Full automation of clearance certificates (Bonafide, NOC) and executive dashboard analytics for the Principal and Board of Governors.
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Sync ERP fee ledger to auto-verify zero dues for instant PDF generation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Review Campus Recurring Issue Heatmap to budget infrastructure pipe replacement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Full deprecation of paper complaint diaries and physical certificate queues.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-emerald-700 font-bold">
              Target: 100% Digital University Workflow
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 2: Migration Schemas */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Legacy Data Ingestion Schemas
                </h3>
                <p className="text-xs text-slate-500">
                  Standard CSV/Excel formats designed for easy one-click import from existing college Tally/Excel spreadsheets
                </p>
              </div>
            </div>

            <div className="space-y-6 text-xs">
              {/* Table 1 */}
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>1. Student Master & Guardian Contacts (`students_master.csv`)</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2">reg_no</th>
                        <th className="p-2">student_name</th>
                        <th className="p-2">branch_code</th>
                        <th className="p-2">year_sem</th>
                        <th className="p-2">student_phone</th>
                        <th className="p-2">guardian_phone</th>
                        <th className="p-2">has_smartphone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-2 text-blue-600">2201106145</td>
                        <td className="p-2">Piyush Kumar Dey</td>
                        <td className="p-2">CSE</td>
                        <td className="p-2">3rd / 6th</td>
                        <td className="p-2">+919876543210</td>
                        <td className="p-2">+919437012345</td>
                        <td className="p-2 text-emerald-600 font-bold">TRUE</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-blue-600">2201106230</td>
                        <td className="p-2">Ananya Mishra</td>
                        <td className="p-2">EE</td>
                        <td className="p-2">3rd / 6th</td>
                        <td className="p-2">+919861234567</td>
                        <td className="p-2">+919437199887</td>
                        <td className="p-2 text-amber-600 font-bold">FALSE (USSD/SMS)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2 */}
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>2. Hostel Room & Asset Allocation Matrix (`hostel_rooms.csv`)</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2">hostel_name</th>
                        <th className="p-2">block_wing</th>
                        <th className="p-2">room_no</th>
                        <th className="p-2">capacity</th>
                        <th className="p-2">occupant_reg_nos</th>
                        <th className="p-2">assigned_warden</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-2">Aryabhatta Hall</td>
                        <td className="p-2">Block B (3rd Floor)</td>
                        <td className="p-2">B-304</td>
                        <td className="p-2">2</td>
                        <td className="p-2">2201106145, 2201106146</td>
                        <td className="p-2">Dr. S. K. Nayak</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab 3: Change Management */}
      {activeTab === 'change' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Overcoming Staff Resistance & Everyday Institutional Habits
              </h3>
              <p className="text-xs text-slate-500">
                How to get non-technical security guards and busy wardens to enthusiastically use the system
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900">For Security Guards (Main Gate)</h4>
              <p className="text-slate-600 leading-relaxed">
                No typing or complex logins. A dedicated tablet with an auto-focus camera scans student QR codes in 0.5 seconds. If student has no smartphone, guard can enter just the last 4 digits of the registration number or SMS token.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900">For Hostel Wardens</h4>
              <p className="text-slate-600 leading-relaxed">
                Wardens receive a clean batch view of pending passes. Instead of signing 50 paper slips every afternoon, they can review and 1-tap approve all regular outings in under 60 seconds with automated parental SMS dispatch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Server className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900">For Mess Contractors</h4>
              <p className="text-slate-600 leading-relaxed">
                Mess managers directly benefit by seeing the 4:00 PM dinner headcount. This prevents cooking for 420 students when 80 are away on weekend passes, saving ~₹90,000 monthly in raw rations and reducing kitchen labor friction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
