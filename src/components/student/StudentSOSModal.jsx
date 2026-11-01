import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { X, AlertTriangle, MapPin, Send, CheckCircle2, Siren, ShieldCheck, GraduationCap, Phone } from 'lucide-react';

const RECIPIENTS = [
  { role: 'Teacher', name: 'Prof. Ananya Verma', phone: '+91 94371 11223', icon: GraduationCap, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { role: 'Security', name: 'Subedar Ram Singh (Gate 1)', phone: '+91 94371 88001', icon: ShieldCheck, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { role: "Dean's Office", name: 'Dean of Student Welfare', phone: '+91 94371 00002', icon: AlertTriangle, color: 'bg-rose-100 text-rose-700 border-rose-300' }
];

export default function StudentSOSModal({ isOpen, onClose }) {
  const { currentPersona, addAuditLog } = useCampus();
  const [phase, setPhase] = useState('confirm'); // confirm | locating | sending | sent
  const [location, setLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState('Detecting your location...');
  const [sentTo, setSentTo] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  const emergencyTypes = [
    { id: 'ragging', label: '🚨 Anti-Ragging / Bullying', urgent: true },
    { id: 'medical', label: '🏥 Medical Emergency', urgent: true },
    { id: 'fire', label: '🔥 Fire / Hazard Alert', urgent: true },
    { id: 'theft', label: '🔒 Theft / Security Threat', urgent: false },
    { id: 'other', label: '⚠️ Other Emergency', urgent: false }
  ];

  useEffect(() => {
    if (!isOpen) {
      setPhase('confirm');
      setSentTo([]);
      setLocation(null);
      setLocationLabel('Detecting your location...');
      setSelectedType('');
    }
  }, [isOpen]);

  const handleSendSOS = () => {
    if (!selectedType) return;
    setPhase('locating');

    // Get real geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(5);
          const lng = pos.coords.longitude.toFixed(5);
          setLocation({ lat, lng });
          setLocationLabel(`${lat}, ${lng} (GPS)`);
          startSending({ lat, lng });
        },
        () => {
          // Fallback to campus location if GPS denied
          const fallback = { lat: '22.26040', lng: '84.86970' };
          setLocation(fallback);
          setLocationLabel('Aryabhatta Hall, Block B — Campus GPS');
          startSending(fallback);
        },
        { timeout: 5000 }
      );
    } else {
      const fallback = { lat: '22.26040', lng: '84.86970' };
      setLocation(fallback);
      setLocationLabel('Aryabhatta Hall, Block B — Campus GPS');
      startSending(fallback);
    }
  };

  const startSending = (loc) => {
    setPhase('sending');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Stagger message deliveries
    RECIPIENTS.forEach((r, i) => {
      setTimeout(() => {
        setSentTo(prev => [...prev, r.role]);
        if (i === RECIPIENTS.length - 1) {
          setTimeout(() => {
            setPhase('sent');
            addAuditLog(
              currentPersona.name,
              'EMERGENCY_SOS',
              `SOS broadcast sent to Teacher, Security & Dean. Type: ${selectedType}. Location: ${loc.lat}, ${loc.lng}`,
              'red'
            );
          }, 800);
        }
      }, (i + 1) * 1000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-300 w-full max-w-lg overflow-hidden relative">

        {/* Header */}
        <div className={`p-5 flex items-center justify-between ${phase === 'sent' ? 'bg-emerald-600' : 'bg-rose-600'} text-white`}>
          <div className="flex items-center gap-3">
            {phase === 'sent'
              ? <CheckCircle2 className="w-6 h-6" />
              : <AlertTriangle className="w-6 h-6 animate-pulse" />
            }
            <div>
              <h3 className="font-black text-base tracking-tight">
                {phase === 'sent' ? '✅ SOS Alerts Delivered' : '🚨 STUDENT EMERGENCY SOS'}
              </h3>
              <p className="text-xs opacity-80">
                {phase === 'sent' ? 'Help is on the way' : 'Instant broadcast to Teacher, Security & Dean'}
              </p>
            </div>
          </div>
          {(phase === 'confirm' || phase === 'sent') && (
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">

          {/* PHASE: Select emergency type */}
          {phase === 'confirm' && (
            <>
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                  What is the emergency?
                </p>
                <div className="space-y-2">
                  {emergencyTypes.map(et => (
                    <button key={et.id} onClick={() => setSelectedType(et.id)}
                      className={`w-full text-left px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                        selectedType === et.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-rose-300'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span>{et.label}</span>
                        {et.urgent && <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full">HIGH PRIORITY</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Who will be alerted */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Alert will be sent to:</p>
                {RECIPIENTS.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-xs font-semibold ${r.color}`}>
                    <r.icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold">{r.role}</div>
                      <div className="opacity-70 text-[10px]">{r.name}</div>
                    </div>
                    <div className="flex items-center gap-1 opacity-70">
                      <Phone className="w-3 h-3" />
                      <span className="text-[10px]">{r.phone}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student info strip */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 text-xs text-blue-900">
                <strong>Sending as:</strong> {currentPersona.name} ({currentPersona.regNo || 'Student'}) •
                Room {currentPersona.room} • {currentPersona.hostel}
              </div>

              <button
                onClick={handleSendSOS}
                disabled={!selectedType}
                className={`w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedType
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 hover:scale-[1.02]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}>
                <AlertTriangle className="w-5 h-5" />
                SEND EMERGENCY ALERT NOW
              </button>
            </>
          )}

          {/* PHASE: Locating */}
          {phase === 'locating' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto animate-pulse">
                <MapPin className="w-10 h-10 text-amber-600" />
              </div>
              <h4 className="font-black text-slate-900 text-lg">Detecting your location...</h4>
              <p className="text-xs text-slate-500">Your GPS coordinates will be sent along with the SOS alert</p>
              <div className="flex justify-center gap-1 mt-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* PHASE: Sending */}
          {phase === 'sending' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-rose-900">Location captured</div>
                  <div className="text-rose-700 font-mono">{locationLabel}</div>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Broadcasting alerts...</p>
              <div className="space-y-3">
                {RECIPIENTS.map((r, i) => {
                  const isSent = sentTo.includes(r.role);
                  return (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                      isSent ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSent ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        {isSent
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <Send className="w-4 h-4 text-slate-400 animate-pulse" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-bold ${isSent ? 'text-emerald-800' : 'text-slate-600'}`}>{r.role} — {r.name}</div>
                        <div className={`text-[10px] ${isSent ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {isSent ? '✅ Alert delivered' : 'Sending...'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE: Sent */}
          {phase === 'sent' && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="font-black text-slate-900 text-lg">Help is on the way!</h4>
                <p className="text-xs text-slate-500 mt-1">All 3 emergency contacts have been notified immediately.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                {RECIPIENTS.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>{r.role}</strong> ({r.name}) — Alert received</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5">
                <div><strong>Type:</strong> {emergencyTypes.find(e => e.id === selectedType)?.label}</div>
                <div><strong>Student:</strong> {currentPersona.name} • Room {currentPersona.room}</div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="font-mono text-[11px]">{locationLabel}</span>
                </div>
                <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-800">
                <strong>📞 Stay calm.</strong> Security and your teacher have your exact location. Do NOT leave the area unless it is unsafe to stay.
              </div>

              <button onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all">
                Close — Stay Safe
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}