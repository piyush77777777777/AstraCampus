import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { X, ShieldCheck, Mail, ArrowRight, Lock, AlertTriangle, CheckCircle2, User, Hash } from 'lucide-react';

function getEmailRoleMap() {
  try { return JSON.parse(localStorage.getItem('unify_email_role_map') || '{}'); }
  catch { return {}; }
}
function saveEmailRoleMap(map) {
  localStorage.setItem('unify_email_role_map', JSON.stringify(map));
}

const ROLE_META = {
  student:     { label: 'Student Portal',              color: 'bg-blue-600',   emoji: '🎓', verifyLabel: 'Registration Number',  verifyPlaceholder: 'e.g. 2201106145',        hint: 'Your CIT university registration number' },
  admin:       { label: 'Admin (Dean) Portal',         color: 'bg-indigo-600', emoji: '⚙️', verifyLabel: 'Dean Admin ID',        verifyPlaceholder: 'e.g. CIT-DEAN-01',       hint: 'Official Dean of Academic Affairs ID' },
  principal:   { label: 'Principal Dashboard',         color: 'bg-rose-700',   emoji: '📊', verifyLabel: 'Principal Office ID',  verifyPlaceholder: 'e.g. ADMIN-PRINCIPAL-01', hint: 'Official ID from Principal & Director Office' },
  club:        { label: 'Club & Event Portal',         color: 'bg-amber-600',  emoji: '🎪', verifyLabel: 'Club Lead ID',         verifyPlaceholder: 'e.g. CIT-CLUB-ROBO',     hint: 'Official SAC / Spectra Club Lead ID' },
  faculty:     { label: 'Faculty Portal',              color: 'bg-purple-600', emoji: '👨‍🏫', verifyLabel: 'Faculty Employee ID', verifyPlaceholder: 'e.g. FAC-02',          hint: 'Your appointment letter faculty employee ID' },
  hod:         { label: 'Dept. Coordinator / HOD',     color: 'bg-cyan-600',   emoji: '🏛️', verifyLabel: 'Department HOD ID',    verifyPlaceholder: 'e.g. CIT-HOD-CSE',       hint: 'Official HOD & Timetable Coordinator ID' },
  teacher:     { label: 'Faculty / Teacher',           color: 'bg-purple-600', emoji: '👨‍🏫', verifyLabel: 'Faculty Employee ID', verifyPlaceholder: 'e.g. FAC-02',          hint: 'Your appointment letter faculty employee ID' },
  coordinator: { label: 'Dept. Coordinator / HOD',     color: 'bg-cyan-600',   emoji: '🏛️', verifyLabel: 'Department HOD ID',    verifyPlaceholder: 'e.g. CIT-HOD-CSE',       hint: 'Official HOD & Timetable Coordinator ID' },
  warden:      { label: 'Hostel Warden',               color: 'bg-indigo-600', emoji: '🏢', verifyLabel: 'Warden ID',            verifyPlaceholder: 'e.g. WRD-2024-001',      hint: 'Your official warden appointment ID' },
  guard:       { label: 'Security Guard',              color: 'bg-amber-600',  emoji: '👮', verifyLabel: 'Badge Number',         verifyPlaceholder: 'e.g. SEC-GATE-01',       hint: 'Security badge number issued by administration' },
  messManager: { label: 'Mess Supervisor',             color: 'bg-emerald-600',emoji: '🍲', verifyLabel: 'Staff ID',             verifyPlaceholder: 'e.g. MESS-STAFF-007',    hint: 'Mess staff ID from dining administration' },
  parent:      { label: 'Parent / Guardian',           color: 'bg-teal-600',   emoji: '👨‍👦', verifyLabel: "Ward's Reg. Number",  verifyPlaceholder: "e.g. 2201106145",        hint: "Your ward's university registration number" }
};

const PORTAL_ACCOUNTS = [
  { role: 'student',     name: 'Piyush Kumar Dey',     email: 'piyush.dey@cit.ac.in',    verifyCode: '2201106145' },
  { role: 'admin',       name: 'Dr. Ramesh Chandra',   email: 'admin.dean@cit.ac.in',          verifyCode: 'CIT-DEAN-01' },
  { role: 'principal',   name: 'Prof. D. K. Mishra',   email: 'principal@cit.ac.in',           verifyCode: 'ADMIN-PRINCIPAL-01' },
  { role: 'club',        name: 'Aryan Sen',            email: 'club.robotics@cit.ac.in',       verifyCode: 'CIT-CLUB-ROBO' },
  { role: 'faculty',     name: 'Prof. Ananya Verma',   email: 'faculty.verma@cit.ac.in',       verifyCode: 'FAC-02' },
  { role: 'hod',         name: 'Dr. Pravat Kumar Sahoo',email: 'hod.cse@cit.ac.in',            verifyCode: 'CIT-HOD-CSE' },
  { role: 'coordinator', name: 'Dr. Pravat Kumar Sahoo',email: 'coord.cse@cit.ac.in',          verifyCode: 'CIT-COORD-CSE' },
  { role: 'warden',      name: 'Dr. S. K. Nayak',      email: 'warden.nayak@cit.ac.in',        verifyCode: 'WRD-2024-001' },
  { role: 'guard',       name: 'Subedar Ram Singh',    email: 'security.gate@cit.ac.in',       verifyCode: 'SEC-GATE-01' },
  { role: 'messManager', name: 'Bikram Das',           email: 'mess.supervisor@cit.ac.in',    verifyCode: 'MESS-STAFF-007' },
  { role: 'parent',      name: 'Mr. Ramesh Mohapatra', email: 'ramesh.mohapatra@gmail.com',    verifyCode: '2201106145' }
];

export default function GoogleAuthModal() {
  const { authModalOpen, setAuthModalOpen, authTargetRole, loginWithGoogle, initialPersonas } = useCampus();

  // Step: 'role' → 'google' → 'verify' → done
  const [step, setStep] = useState('role');
  const [selectedRole, setSelectedRole] = useState(authTargetRole || '');
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const meta = ROLE_META[selectedRole] || null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setStep('role');
    setSelectedRole('');
    setSelectedAccount(null);
    setVerifyCode('');
    setError('');
    setUseCustomEmail(false);
    setCustomEmail('');
    setCustomName('');
  };

  // Step 1 → Step 2: user picks their role
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setStep('google');
  };

  // Step 2 → Step 3: user picks their Google account
  const handleAccountSelect = (acc) => {
    const map = getEmailRoleMap();
    const existingRole = map[acc.email.toLowerCase()];
    if (existingRole && existingRole !== acc.role) {
      setError(`This email is already registered to the ${ROLE_META[existingRole]?.label || existingRole} portal. Each email can only be used for one portal.`);
      return;
    }
    setSelectedAccount(acc);
    setError('');
    setStep('verify');
  };

  // Step 2 → Step 3: custom email path
  const handleCustomNext = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const map = getEmailRoleMap();
    const existingRole = map[customEmail.toLowerCase()];
    if (existingRole && existingRole !== selectedRole) {
      setError(`This email is already registered to the ${ROLE_META[existingRole]?.label || existingRole} portal.`);
      return;
    }
    setSelectedAccount({ role: selectedRole, name: customName || customEmail.split('@')[0], email: customEmail });
    setError('');
    setStep('verify');
  };

  // Step 3: verify identity code
  const handleVerify = (e) => {
    e.preventDefault();
    const acc = selectedAccount;
    const expected = PORTAL_ACCOUNTS.find(a => a.email === acc.email)?.verifyCode;

    // For custom emails: any non-empty code is accepted (demo mode)
    if (expected && verifyCode.trim().toLowerCase() !== expected.toLowerCase()) {
      setError(`Incorrect ${meta?.verifyLabel}. Please check and try again.`);
      return;
    }
    if (!verifyCode.trim()) {
      setError(`Please enter your ${meta?.verifyLabel}.`);
      return;
    }

    // Check / save email→role lock
    const map = getEmailRoleMap();
    map[acc.email.toLowerCase()] = acc.role;
    saveEmailRoleMap(map);

    setError('');
    loginWithGoogle(acc.email, acc.role, acc.name);
    handleClose();
  };

  const portalAccounts = PORTAL_ACCOUNTS.filter(a => a.role === selectedRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Sign in with Google</h3>
              <p className="text-[11px] text-slate-500">UNIFY — Smart Campus Portal</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 pt-4 pb-2 gap-2">
          {[['role','Select Role'],['google','Google Account'],['verify','Verify Identity']].map(([s, label], i) => {
            const steps = ['role','google','verify'];
            const idx = steps.indexOf(s);
            const cur = steps.indexOf(step);
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-0.5">
                  <div className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    cur > idx ? 'bg-emerald-500 text-white' : cur === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>{cur > idx ? '✓' : i + 1}</div>
                  <span className={`text-[9px] font-bold whitespace-nowrap ${cur === idx ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mb-3 rounded ${cur > idx ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-5 mb-2 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-800 font-medium">{error}</p>
          </div>
        )}

        <div className="px-6 pb-6 pt-2">

          {/* ── STEP 1: Select your role ── */}
          {step === 'role' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">Who are you? Select your portal:</p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(ROLE_META).map(([role, m]) => (
                  <button key={role} onClick={() => handleRoleSelect(role)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group">
                    <div className={`w-9 h-9 rounded-xl ${m.color} text-white flex items-center justify-center text-base flex-shrink-0`}>
                      {m.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{m.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Sign in to your dedicated portal</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Google account ── */}
          {step === 'google' && meta && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => { setStep('role'); setError(''); }} className="text-[11px] text-blue-600 font-bold hover:underline">← Back</button>
                <span className="text-xs text-slate-500">Signing in as: <strong className="text-slate-800">{meta.emoji} {meta.label}</strong></span>
              </div>
              {!useCustomEmail ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500">Select your campus Google account:</p>
                  {portalAccounts.map((acc, i) => (
                    <button key={i} onClick={() => handleAccountSelect(acc)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all text-left group">
                      <img src={initialPersonas[acc.role]?.avatar} alt={acc.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{acc.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                  <button onClick={() => setUseCustomEmail(true)}
                    className="w-full text-center text-[11px] text-blue-600 font-bold py-2 hover:underline">
                    + Use a different Google email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomNext} className="space-y-3">
                  <p className="text-[11px] text-slate-500">Enter your Google email for the {meta.label} portal:</p>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input type="email" required value={customEmail} onChange={e => { setCustomEmail(e.target.value); setError(''); }}
                      placeholder="your@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <input type="text" value={customName} onChange={e => setCustomName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setUseCustomEmail(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold hover:bg-slate-50">Back</button>
                    <button type="submit"
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20">
                      Continue →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 3: Verify identity ── */}
          {step === 'verify' && meta && selectedAccount && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setStep('google'); setError(''); setVerifyCode(''); }} className="text-[11px] text-blue-600 font-bold hover:underline">← Back</button>
                <span className="text-xs text-slate-500">Verifying: <strong>{selectedAccount.name}</strong></span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{meta.emoji}</div>
                <div className="text-sm font-black text-slate-900">{meta.label} Verification</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Confirm your identity to access your portal</div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {meta.verifyLabel} *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" required value={verifyCode}
                    onChange={e => { setVerifyCode(e.target.value); setError(''); }}
                    placeholder={meta.verifyPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{meta.hint}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800">
                <strong>🔒 One-time lock:</strong> This email will be permanently assigned to the <strong>{meta.label} portal</strong> only.
              </div>

              <button type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
                <ShieldCheck className="w-4 h-4" />
                Verify & Enter {meta.label} Portal
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Google OAuth Secured</span>
          <span>1 Email → 1 Portal Only</span>
        </div>
      </div>
    </div>
  );
}