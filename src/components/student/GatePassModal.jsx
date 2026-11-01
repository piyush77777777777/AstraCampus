import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, ShieldCheck, Clock, MapPin, Phone, AlertCircle, QrCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GatePassModal({ isOpen, onClose, existingPass = null }) {
  const { createGatePass, currentPersona, approveGatePass, activeRole } = useCampus();
  const { t } = useLanguage();

  const [passType, setPassType] = useState('Day Outing');
  const [destination, setDestination] = useState('');
  const [outTime, setOutTime] = useState('Today, 17:30');
  const [expectedInTime, setExpectedInTime] = useState('Today, 21:00');
  const [emergencyPhone, setEmergencyPhone] = useState(currentPersona?.guardianPhone || '+91 94370 12345');
  const [remarks, setRemarks] = useState('');
  const [submittedPass, setSubmittedPass] = useState(existingPass);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    const newPass = createGatePass({
      passType,
      destination,
      outTime,
      expectedInTime,
      emergencyPhone,
      remarks
    });

    setSubmittedPass(newPass);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };



  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-7 h-7 text-blue-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {submittedPass ? 'Digital Security Gate Pass' : t('gatePass.title')}
              </h3>
              <p className="text-xs text-blue-100">
                {t('gatePass.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submittedPass ? (
            /* Digital Pass View with Dynamic Security QR */
            <div className="space-y-5">
              {/* Status Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Pass Reference
                  </span>
                  <div className="text-base font-extrabold text-slate-900">
                    {submittedPass.id}
                  </div>
                </div>
                <div>
                  {submittedPass.status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t('gatePass.approvedBadge')}
                    </span>
                  ) : submittedPass.status === 'CHECKED_OUT' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {t('gatePass.checkedOutBadge')}
                    </span>
                  ) : submittedPass.status === 'OVERDUE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      {t('gatePass.overdueBadge')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {t('gatePass.pendingBadge')}
                    </span>
                  )}
                </div>
              </div>

              {/* QR Code Card */}
              <div className="bg-gradient-to-b from-slate-50 to-blue-50/40 rounded-2xl p-6 border border-slate-200 text-center flex flex-col items-center">
                {/* Visual Animated QR Placeholder */}
                <div className="relative p-4 bg-white rounded-2xl shadow-md border-2 border-slate-900/10 mb-3">
                  {/* Dynamic stylized QR pattern */}
                  <svg className="w-44 h-44" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corner Squares */}
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="13" width="10" height="10" rx="1" fill="#0f172a" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="77" y="13" width="10" height="10" rx="1" fill="#0f172a" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="77" width="10" height="10" rx="1" fill="#0f172a" />

                    {/* Data matrix dots */}
                    <rect x="36" y="8" width="6" height="6" rx="1" fill="#2563eb" />
                    <rect x="46" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="56" y="8" width="6" height="6" rx="1" fill="#2563eb" />
                    <rect x="36" y="18" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="46" y="24" width="8" height="8" rx="1" fill="#2563eb" />
                    <rect x="8" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="18" y="38" width="8" height="6" rx="1" fill="#2563eb" />
                    <rect x="36" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="48" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="60" y="38" width="6" height="6" rx="1" fill="#2563eb" />
                    <rect x="72" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="84" y="38" width="6" height="6" rx="1" fill="#2563eb" />

                    <rect x="36" y="52" width="8" height="8" rx="1" fill="#2563eb" />
                    <rect x="50" y="52" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="62" y="52" width="8" height="6" rx="1" fill="#0f172a" />
                    <rect x="76" y="52" width="6" height="6" rx="1" fill="#2563eb" />

                    <rect x="38" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="50" y="68" width="8" height="8" rx="1" fill="#2563eb" />
                    <rect x="66" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="78" y="68" width="8" height="6" rx="1" fill="#2563eb" />
                    <rect x="38" y="82" width="8" height="6" rx="1" fill="#2563eb" />
                    <rect x="52" y="82" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="64" y="82" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="76" y="82" width="8" height="8" rx="1" fill="#2563eb" />

                    {/* University watermark stamp */}
                    <circle cx="50" cy="50" r="11" fill="#ffffff" />
                    <circle cx="50" cy="50" r="8" fill="#2563eb" />
                  </svg>

                  {/* Animated scanning bar */}
                  <div className="absolute inset-x-4 top-4 h-0.5 bg-blue-500/80 shadow-md shadow-blue-500 animate-pulse"></div>
                </div>

                <div className="text-xs font-bold text-slate-700 tracking-wider font-mono">
                  {submittedPass.qrToken}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {t('gatePass.scanByGuard')}
                </p>
              </div>

              {/* Pass Details Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-900">{submittedPass.studentName} ({submittedPass.regNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hostel & Room:</span>
                  <span className="font-semibold text-slate-900">{currentPersona.hostel} | {submittedPass.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-semibold text-slate-900">{submittedPass.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Out Window:</span>
                  <span className="font-semibold text-slate-900">{submittedPass.outTime} → Expected Return: {submittedPass.expectedInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guardian SMS Alert:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Dispatched to {submittedPass.emergencyPhone}
                  </span>
                </div>
                {submittedPass.approvedBy && (
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-blue-700">
                    <span className="font-medium">Approved By:</span>
                    <span className="font-bold">{submittedPass.approvedBy} ({submittedPass.approvedAt})</span>
                  </div>
                )}
              </div>

              {/* Pass is awaiting warden approval - info only */}
              {submittedPass.status === 'PENDING' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                  <strong>⏳ Awaiting Warden Approval:</strong> Your request has been sent to the Chief Warden. You will be notified once approved.
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittedPass(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition-all"
                >
                  Request Another Pass
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Pass Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('gatePass.type')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Day Outing', 'Weekend Home Visit', 'Medical Emergency'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPassType(type)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        passType === type
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('gatePass.destination')} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rourkela Main Market (Project hardware components)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('gatePass.outTime')}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={outTime}
                      onChange={(e) => setOutTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('gatePass.inTime')}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={expectedInTime}
                      onChange={(e) => setExpectedInTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('gatePass.emergencyContact')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Automatic SMS confirmation dispatch will be sent to this number upon gate exit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Remarks / Warden Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Need to purchase robotics sensors and meet external project supervisor."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  {t('gatePass.cancel')}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  {t('gatePass.submitRequest')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
