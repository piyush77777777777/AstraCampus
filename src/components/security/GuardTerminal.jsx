import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GuardTerminal() {
  const { gatePasses, scanGateExit, scanGateEntry, currentPersona } = useCampus();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPass, setScannedPass] = useState(null);

  // Filtered passes
  const filteredPasses = gatePasses.filter(gp =>
    gp.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gp.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const outsideStudents = gatePasses.filter(gp => gp.status === 'CHECKED_OUT');
  const overdueStudents = gatePasses.filter(gp => gp.status === 'OVERDUE');

  const handleSimulateScan = (pass = null) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const target = pass || gatePasses[0];
      setScannedPass(target);
      confetti({ particleCount: 30, spread: 50 });
    }, 800);
  };

  const handleCheckOut = (passId) => {
    scanGateExit(passId);
    if (scannedPass && scannedPass.id === passId) {
      setScannedPass({ ...scannedPass, status: 'CHECKED_OUT', actualOutTime: 'Just now' });
    }
  };

  const handleCheckIn = (passId) => {
    scanGateEntry(passId);
    if (scannedPass && scannedPass.id === passId) {
      setScannedPass({ ...scannedPass, status: 'COMPLETED', actualInTime: 'Just now' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Security Terminal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>North Main Gate Security Terminal | Post 01</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Security Gate & Visitor Verification Hub
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-2 leading-relaxed">
            Officer on Duty: <strong>{currentPersona.name}</strong> (Shift: {currentPersona.shift || '08:00 - 20:00'})
            <br />
            Scan dynamic QR codes, record student check-out/check-in timestamps, and flag late returns instantly.
          </p>
        </div>
      </div>

      {/* Security Counters & Fast Scanner Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Scanner Box */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Gate QR Barcode Scanner</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                OPTICAL ACTIVE
              </span>
            </div>

            {/* Camera Viewfinder Mock */}
            <div className="my-4 relative h-48 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
              <div className="absolute inset-4 border-2 border-dashed border-amber-400/70 rounded-xl pointer-events-none"></div>

              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-amber-400 shadow-lg shadow-amber-400 animate-pulse-ring"></div>
              )}

              <QrCode className={`w-16 h-16 text-slate-600 ${isScanning ? 'text-amber-400 animate-pulse' : ''}`} />
              <div className="text-xs text-slate-400 mt-2 font-mono">
                {isScanning ? 'Analyzing dynamic QR token...' : 'Align Student Screen with Camera'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleSimulateScan()}
              disabled={isScanning}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>{isScanning ? 'Scanning QR...' : 'Simulate Scan Active Pass'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Works seamlessly with optical USB barcode scanners or mobile tablet camera.
            </p>
          </div>
        </div>

        {/* Live Scanned Pass Verification Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Live Verification Inspector
            </h3>
            {scannedPass && (
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                scannedPass.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : scannedPass.status === 'CHECKED_OUT'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}>
                {scannedPass.status}
              </span>
            )}
          </div>

          {scannedPass ? (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Student</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{scannedPass.studentName}</div>
                  <div className="text-xs text-slate-600 font-mono">{scannedPass.regNo}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Outing Type</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{scannedPass.passType}</div>
                  <div className="text-xs text-slate-600 truncate">{scannedPass.destination}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Curfew Window</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{scannedPass.expectedInTime}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Approved by: {scannedPass.approvedBy}</div>
                </div>
              </div>

              {/* Action Buttons for Security */}
              <div className="flex flex-wrap gap-3 pt-2">
                {scannedPass.status === 'APPROVED' && (
                  <button
                    onClick={() => handleCheckOut(scannedPass.id)}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Authorize Exit (Mark Checked OUT & Open Barrier)</span>
                  </button>
                )}

                {scannedPass.status === 'CHECKED_OUT' && (
                  <button
                    onClick={() => handleCheckIn(scannedPass.id)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Record Safe Return (Mark Checked IN)</span>
                  </button>
                )}

                {scannedPass.status === 'COMPLETED' && (
                  <div className="w-full p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pass completed. Student checked back in safely.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No QR scanned yet. Click "Simulate Scan" or select any student pass from the ledger below.
            </div>
          )}
        </div>
      </div>

      {/* Security Gate Pass Master Ledger */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Gate Passage & Security Logbook
            </h3>
            <p className="text-xs text-slate-500">
              Real-time audit log of campus ingress and egress replacing physical paper gate registers
            </p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Reg No or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Pass ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Curfew Return</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPasses.map((pass) => (
                <tr key={pass.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{pass.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{pass.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pass.regNo} ({pass.room})</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">{pass.destination}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{pass.expectedInTime}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      pass.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : pass.status === 'CHECKED_OUT'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : pass.status === 'OVERDUE'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {pass.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleSimulateScan(pass)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all"
                    >
                      Inspect / Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
