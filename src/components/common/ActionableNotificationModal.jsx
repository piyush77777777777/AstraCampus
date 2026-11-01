import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  Bell, CheckCircle2, AlertTriangle, ShieldCheck, Zap,
  X, Check, Radio, CheckCheck, Sparkles, ExternalLink
} from 'lucide-react';

export default function ActionableNotificationModal({ notification, isOpen, onClose }) {
  const { executeNotificationAction, acknowledgeNotification, verifyNotificationAction, activeRole } = useCampus();
  const [activeStep, setActiveStep] = useState(notification?.delivery_status || 'acknowledged');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationCode, setVerificationCode] = useState(notification?.verification_proof || '');

  if (!isOpen || !notification) return null;

  const riskAnalysis = notification.riskAnalysis || {
    safetyHazardLevel: notification.priority === 'CRITICAL' ? 'CRITICAL' : notification.priority === 'HIGH' ? 'ELEVATED' : 'NONE',
    failureModes: notification.failureModes || ['Operational resolution delay if unacknowledged'],
    preventativeChecks: notification.checklist || ['Verify student identity & physical location']
  };

  const suggestedActions = notification.suggestedActions || [
    { actionId: 'RESOLVE_DIRECTLY', label: '1-Click Approve / Acknowledge', description: 'Authorize request directly and update registry.', impact: 'Closes notification loop.' },
    { actionId: 'ESCALATE_TO_CHIEF', label: 'Escalate Priority', description: 'Route to higher campus authority.', impact: 'Triggers emergency broadcast.' }
  ];

  const handleAcknowledge = async () => {
    setIsProcessing(true);
    await acknowledgeNotification(notification.id);
    setActiveStep('acknowledged');
    setIsProcessing(false);
  };

  const handleAction = async (actionId) => {
    setIsProcessing(true);
    await executeNotificationAction(notification.id, actionId);
    setActiveStep('action_taken');
    setIsProcessing(false);
  };

  const handleVerify = async () => {
    setIsProcessing(true);
    const proof = `UNIFY-VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    await verifyNotificationAction(notification.id, proof);
    setVerificationCode(proof);
    setActiveStep('verified');
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${
              notification.priority === 'CRITICAL' ? 'bg-rose-600' :
              notification.priority === 'HIGH' ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{notification.title}</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                  {notification.priority || 'NORMAL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">4-Stage Handshake Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stage Progress Breadcrumb */}
        <div className="grid grid-cols-4 border-b border-slate-800/80 bg-slate-950/30 text-center py-2.5 px-3">
          {[
            { id: 'dispatched', label: '1. Push Sent' },
            { id: 'acknowledged', label: '2. Device ACK' },
            { id: 'action_taken', label: '3. AI Action' },
            { id: 'verified', label: '4. Verified' }
          ].map((stage, idx) => {
            const isDone = ['dispatched', 'acknowledged', 'action_taken', 'verified'].indexOf(activeStep) >= idx;
            const isCurrent = activeStep === stage.id;
            return (
              <div key={stage.id} className="flex flex-col items-center">
                <span className={`text-[10px] font-bold ${
                  isCurrent ? 'text-blue-400' : isDone ? 'text-emerald-400' : 'text-slate-600'
                }`}>
                  {stage.label}
                </span>
                <div className={`h-1 w-8 rounded-full mt-1 ${
                  isCurrent ? 'bg-blue-500' : isDone ? 'bg-emerald-500' : 'bg-slate-800'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Notification Message */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <p className="text-xs text-slate-200 leading-relaxed">{notification.message}</p>
            {notification.location && (
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-slate-300">Location:</span> {notification.location}
              </div>
            )}
          </div>

          {/* AI Decision & Failure Mode Analysis */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Risk & Failure-Mode Analysis</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                riskAnalysis.safetyHazardLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                riskAnalysis.safetyHazardLevel === 'ELEVATED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                Hazard: {riskAnalysis.safetyHazardLevel}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Potential Failure Risks:</span>
              <ul className="mt-1 space-y-1">
                {riskAnalysis.failureModes.map((fm, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{fm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {riskAnalysis.preventativeChecks?.length > 0 && (
              <div className="pt-2 border-t border-blue-500/10">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Things to Keep in Mind (Safety Checklist):</span>
                <ul className="mt-1 space-y-1">
                  {riskAnalysis.preventativeChecks.map((check, i) => (
                    <li key={i} className="text-xs text-emerald-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Execution Cards */}
          {activeStep !== 'verified' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300">AI-Suggested Remediation Actions:</span>
              <div className="space-y-2">
                {suggestedActions.map((act) => (
                  <button
                    key={act.actionId}
                    disabled={isProcessing}
                    onClick={() => handleAction(act.actionId)}
                    className="w-full p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {act.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{act.description}</div>
                      <div className="text-[10px] text-emerald-400 font-medium mt-1">Impact: {act.impact}</div>
                    </div>
                    <Zap className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verification & Closed-Loop Closure */}
          {activeStep === 'action_taken' && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-emerald-200">Action Executed Successfully</div>
              <p className="text-[11px] text-slate-300">Seal this ticket with a cryptographic verification hash to close the SLA audit trail.</p>
              <button
                onClick={handleVerify}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
              >
                Stamp & Verify SLA Closure →
              </button>
            </div>
          )}

          {activeStep === 'verified' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 4-Stage Verification Complete
                </span>
                <span className="text-[10px] font-mono text-slate-400">SLA MET</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Proof ID: <span className="font-mono text-amber-300 font-bold">{verificationCode}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500">Universal Coordination Layer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
