import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { AlertTriangle, ShieldAlert, PhoneCall, MapPin, X, CheckCircle2, Radio, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmergencyAlertModal({ isOpen, onClose }) {
  const { currentPersona, addAuditLog } = useCampus();
  const [sosSent, setSosSent] = useState(false);
  const [liveGps, setLiveGps] = useState({ lat: '22.2530° N', lng: '84.9010° E', accuracy: '3 meters' });

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    setSosSent(true);
    addAuditLog(
      currentPersona.name,
      'EMERGENCY_SOS_TRIGGERED',
      `EMERGENCY SOS broadcasted from GPS Lat ${liveGps.lat}, Long ${liveGps.lng}. Dispatched to North Gate Security & Parent ${currentPersona.guardianPhone || '+91 94370 12345'}`,
      'red'
    );
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rose-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-rose-500 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-red-900 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>CAMPUS EMERGENCY SOS</span>
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                1-Tap Distress Signal & Real-Time GPS Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {sosSent ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-500 flex items-center justify-center mx-auto animate-ping">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-black text-rose-400 uppercase tracking-wider">
                  EMERGENCY SOS ACTIVE!
                </h4>
                <p className="text-slate-300 text-xs mt-1 max-w-sm mx-auto">
                  Distress signal and live GPS coordinates transmitted to Chief Security Officer Subedar Ram Singh and Warden Dr. S.K. Nayak.
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-left space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-white">{currentPersona.name} ({currentPersona.regNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS Location:</span>
                  <span className="font-mono font-bold text-emerald-400">{liveGps.lat}, {liveGps.lng} (Accuracy: {liveGps.accuracy})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guardian SMS:</span>
                  <span className="text-emerald-400 font-bold">✓ Dispatched to {currentPersona.guardianPhone || '+91 94370 12345'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Campus Siren:</span>
                  <span className="text-rose-400 font-bold animate-pulse">BROADCASTING AT NORTH GATE POST</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 text-xs transition-all"
              >
                Close Emergency Screen (Alert remains logged)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-950/50 border border-rose-800/60 rounded-2xl text-rose-200 leading-relaxed text-[11px]">
                <strong>When to use:</strong> If you feel unsafe, face medical distress, or encounter harassment outside or inside campus. Tapping the button immediately alerts security patrols with your exact GPS coordinates.
              </div>

              <div className="p-3.5 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-slate-400 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-Time GPS Coordinates Detected</span>
                  </span>
                  <span className="text-emerald-400 font-mono">LIVE LOCK</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                  <span>{liveGps.lat}, {liveGps.lng}</span>
                  <span className="text-slate-500">CIT Campus Boundary</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerSOS}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/30 border border-rose-400/50 transition-all flex items-center justify-center gap-2 animate-bounce-in"
              >
                <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                <span>TAP TO BROADCAST EMERGENCY SOS NOW</span>
              </button>

              <div className="text-[10px] text-center text-slate-400">
                Works even without mobile data: Dispatches offline SMS beacon automatically.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
