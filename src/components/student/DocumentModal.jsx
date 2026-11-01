import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, FileText, CheckCircle2, ShieldCheck, Printer, Download, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DocumentModal({ isOpen, onClose }) {
  const { currentPersona, addAuditLog } = useCampus();
  const { t } = useLanguage();

  const [docType, setDocType] = useState('BONAFIDE');
  const [purpose, setPurpose] = useState('State Scholarship (Odisha Medhabruti Portal)');
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const newDoc = {
        refNo: `CIT/CERT/2026/${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        studentName: currentPersona?.name || 'Piyush Mohapatra',
        regNo: currentPersona?.regNo || '2201106145',
        branch: currentPersona?.branch || 'Computer Science & Engineering',
        year: currentPersona?.year || '3rd Year (6th Sem)',
        hostel: currentPersona?.hostel || 'Aryabhatta Hall of Residence',
        room: currentPersona?.room || 'B-304',
        docType: docType === 'BONAFIDE' ? 'BONAFIDE CERTIFICATE' : docType === 'HOSTEL_NOC' ? 'HOSTEL NO-OBJECTION CERTIFICATE (NOC)' : 'FEES CLEARANCE CERTIFICATE',
        purpose,
        verificationToken: `CIT-VERIFY-${Math.random().toString(36).substr(2, 10).toUpperCase()}`
      };
      setGeneratedDoc(newDoc);
      addAuditLog(currentPersona.name, 'GENERATED_CERTIFICATE', `Auto-generated digital ${newDoc.docType} (${newDoc.refNo})`, 'emerald');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <FileText className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t('documents.title')}
              </h3>
              <p className="text-xs text-blue-200">
                {t('documents.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {generatedDoc ? (
            /* Printable Official Certificate View */
            <div className="space-y-4">
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Eligibility criteria verified automatically. Certificate digitally signed and active.
                </span>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 text-xs shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>

              {/* Certificate Sheet */}
              <div id="printable-certificate" className="p-8 border-4 border-double border-slate-800 rounded-2xl bg-white text-slate-900 shadow-sm relative font-serif">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                  <div className="text-8xl font-black text-slate-900 rotate-[-25deg]">
                    CIT ODISHA
                  </div>
                </div>

                {/* College Header */}
                <div className="text-center pb-4 border-b-2 border-slate-900">
                  <h4 className="text-lg font-black tracking-wide uppercase text-blue-900">
                    Chilika Institution of Technology (CIT), Odisha
                  </h4>
                  <p className="text-xs text-slate-600 font-sans">
                    Chilika Lake Campus, Odisha | Autonomous Institution of Engineering & Technology
                  </p>
                  <div className="mt-3 inline-block px-4 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-bold tracking-widest uppercase font-sans">
                    {generatedDoc.docType}
                  </div>
                </div>

                {/* Ref & Date */}
                <div className="flex justify-between items-center text-xs font-sans text-slate-600 py-3">
                  <span><strong>Ref:</strong> {generatedDoc.refNo}</span>
                  <span><strong>Date:</strong> {generatedDoc.issueDate}</span>
                </div>

                {/* Certificate Body Text */}
                <div className="py-4 text-sm leading-relaxed text-slate-800 space-y-3 font-serif">
                  <p>
                    This is to certify that <strong>Mr. {generatedDoc.studentName}</strong>, bearing University Registration No. <strong>{generatedDoc.regNo}</strong>, is a bonafide full-time student of the <strong>{generatedDoc.year}</strong> in <strong>{generatedDoc.branch}</strong> at this institution.
                  </p>
                  <p>
                    He resides in <strong>{generatedDoc.hostel}</strong> (Room No: <strong>{generatedDoc.room}</strong>). As per institutional digital records, he has maintained a cumulative academic attendance of <strong>84.5%</strong> and possesses no outstanding tuition, library, or hostel fee liabilities.
                  </p>
                  <p>
                    This certificate is issued upon student's verified digital application for the purpose of: <em>"{generatedDoc.purpose}"</em>.
                  </p>
                </div>

                {/* Digital Seal & Signatures */}
                <div className="pt-6 mt-4 border-t border-slate-200 flex items-end justify-between font-sans">
                  {/* Digital Authenticity QR */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-300 p-1 rounded flex items-center justify-center">
                      <svg className="w-14 h-14" viewBox="0 0 50 50" fill="currentColor">
                        <rect x="2" y="2" width="14" height="14" fill="#0f172a" />
                        <rect x="5" y="5" width="8" height="8" fill="#ffffff" />
                        <rect x="34" y="2" width="14" height="14" fill="#0f172a" />
                        <rect x="37" y="5" width="8" height="8" fill="#ffffff" />
                        <rect x="2" y="34" width="14" height="14" fill="#0f172a" />
                        <rect x="5" y="37" width="8" height="8" fill="#ffffff" />
                        <rect x="20" y="5" width="4" height="8" fill="#2563eb" />
                        <rect x="20" y="20" width="10" height="10" fill="#0f172a" />
                        <rect x="34" y="34" width="6" height="6" fill="#2563eb" />
                        <rect x="20" y="36" width="6" height="8" fill="#0f172a" />
                      </svg>
                    </div>
                    <div className="text-[10px] text-slate-500 max-w-[130px]">
                      <span className="font-bold text-slate-700 block">QR Authenticated</span>
                      <span>Scan to verify on CIT Academic Registry</span>
                    </div>
                  </div>

                  {/* Registrar Digital Sign */}
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-900 flex items-center justify-end gap-1 mb-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Digitally Verified by CIT Registrar
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {new Date().toISOString()}
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-2">
                      Academic Cell & Dean of Students
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setGeneratedDoc(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Generate Another Certificate
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Document Request & Eligibility Form */
            <div className="space-y-5">
              {/* Story Context Callout */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                <strong>Why this changes campus life:</strong> In traditional colleges, getting a bonafide requires standing in 3 separate queues (Accounts, Library, Registrar) taking days. UNIFY verifies clearances in real time and produces an authenticated digital document in 3 seconds.
              </div>

              {/* Automated Eligibility Checks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t('documents.checkEligibility')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-emerald-900">Attendance: 84.5%</div>
                      <div className="text-[10px] text-emerald-700">Satisfies CIT &gt;75% rule</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-emerald-900">Fee & Library Dues: ₹0</div>
                      <div className="text-[10px] text-emerald-700">Account clear for 6th Sem</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('documents.docType')}
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'BONAFIDE', label: t('documents.bonafide'), desc: 'Required for state scholarships, education loan & transit pass.' },
                    { key: 'HOSTEL_NOC', label: t('documents.hostelNoc'), desc: 'Required for semester exit or project internships.' },
                    { key: 'FEE_CLEARANCE', label: t('documents.feeClearance'), desc: 'Official proof of no outstanding college dues.' }
                  ].map((doc) => (
                    <label
                      key={doc.key}
                      onClick={() => setDocType(doc.key)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        docType === doc.key
                          ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="docSelection"
                        checked={docType === doc.key}
                        onChange={() => setDocType(doc.key)}
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{doc.label}</div>
                        <div className="text-[11px] text-slate-500">{doc.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Purpose of Request *
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. State Scholarship verification / Passport Application"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isVerifying}
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Verifying Academic Record...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t('documents.generatePdf')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
