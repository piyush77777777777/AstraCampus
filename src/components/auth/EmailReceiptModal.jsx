import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { Mail, CheckCircle2, ShieldCheck, X, ArrowRight, ExternalLink, Lock } from 'lucide-react';

export default function EmailReceiptModal() {
  const { emailReceipt, setEmailReceipt, setIsLandingPage } = useCampus();

  if (!emailReceipt || !emailReceipt.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative animate-scale-up">
        
        {/* Email Client Simulated Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
                  Email Dispatch Receipt
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Sent to Inbox
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Security Alert: New Sign-in on UNIFY
              </h3>
            </div>
          </div>

          <button
            onClick={() => setEmailReceipt({ ...emailReceipt, isOpen: false })}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Message Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700 bg-slate-50/50">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] text-slate-500">
                  <strong>To:</strong> {emailReceipt.email}
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong>From:</strong> security-auth@campus.edu (Google Identity Services)
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong>Date:</strong> {emailReceipt.timestamp || 'Just now'}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-900 text-sm">
                Hello {emailReceipt.name || 'User'},
              </p>
              <p className="text-slate-600 leading-relaxed text-xs">
                You have successfully signed in to the <strong>UNIFY Smart University System</strong> using your Google Account.
              </p>

              {/* Login Details Table */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Signed-in Email:</span>
                  <span className="font-mono font-bold text-slate-800">{emailReceipt.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authenticated Role:</span>
                  <span className="font-bold text-blue-700 capitalize">{emailReceipt.role || 'Student'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auth Method:</span>
                  <span className="font-semibold text-emerald-700">Google OAuth 2.0 (Single Sign-On)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Security Token:</span>
                  <span className="font-mono text-slate-600">{emailReceipt.token || 'TOKEN-ACTIVE-SEC'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Your credentials and role preferences have been securely saved on this device.</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEmailReceipt({ ...emailReceipt, isOpen: false });
                setIsLandingPage(false);
              }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
            >
              <span>Enter UNIFY Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
