import React, { useState } from 'react';
import {
  Download,
  FileText,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Shield,
  Users,
  Clock,
  MapPin,
  QrCode,
  Radio,
  Cpu,
  Layers,
  Award,
  TrendingUp,
  Smartphone
} from 'lucide-react';

export default function PitchDeckViewer() {
  const [currentSlide, setCurrentSlide] = useState(1);

  const slides = [
    // SLIDE 1: Problem Statement & Team Intro
    {
      id: 1,
      title: "Problem Statement 07 : Campus Life, Debugged",
      category: "SLIDE 1/8 • PROBLEM STATEMENT IN POINTERS",
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-blue-500/20 border border-blue-400/40 rounded-xl text-blue-300 text-xs font-bold text-center">
            🌟 CHILIKA INSTITUTION OF TECHNOLOGY (CIT) 🌟 | ASTRACAMPUS • TIMETABLE & CAMPUS PORTAL
          </div>

          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
            <h4 className="text-amber-400 font-bold text-sm">
              The Problem Statement in Clear Pointers (For Non-Tech Evaluators):
            </h4>
            <p className="text-slate-200 italic text-xs">
              “Four apps, six notice boards, two WhatsApp groups and one paper register. Replace all of it.”
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>The Everyday Reality:</strong> Students lose entire afternoons jumping between offices, wardens, and registers.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>3 Office Queues:</strong> Getting a simple bonafide certificate requires standing in Accounts, Library, and Dean lines.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Neglected 9-Day Leaks:</strong> A hostel washroom tap leaks for 9 days because it was noted in a paper diary nobody tracks.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Paper Gate Passes:</strong> Outing passes depend on finding the warden in person, writing in logbooks, and easily forged paper slips.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>WhatsApp Spam:</strong> Urgent exam and water outage notices get buried under 400 late-night spam messages.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Zero Humans Needed:</strong> Roughly zero of these routine friction points genuinely needed manual human effort.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>The Team BUG FINDERS Solution:</strong> UNIFY replaces all 5 physical queues with an offline-ready system equipped with IoT sensors, GPS geo-fencing, and dynamic QR scanners.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: Visual Mind Map
    {
      id: 2,
      title: "UNIFY Mind Map : The Unified Campus Ecosystem",
      category: "SLIDE 2/8 • SYSTEM MIND MAP IN POINTERS",
      content: (
        <div className="space-y-3">
          <div className="p-2.5 bg-blue-900/60 border border-blue-500/40 rounded-xl text-center text-xs font-bold text-blue-200">
            🧠 Central Hub: UNIFY Server (Offline Sync Engine • SLA Watchdog • Tamper-Proof Audit Trail)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-800/90 rounded-2xl border border-blue-500/50 space-y-1.5">
              <h5 className="font-bold text-blue-300">📱 1. Student App Hub</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• Attendance Safe Bunk margin (6 left)</li>
                <li>• 1-Tap Outing Pass with dynamic QR</li>
                <li>• Grievance photo upload & SLA clock</li>
                <li>• Instant Bonafide & NOC PDF generator</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-amber-500/50 space-y-1.5">
              <h5 className="font-bold text-amber-300">🛡️ 2. Gate Security & GPS</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• Dynamic QR optical camera scanner</li>
                <li>• External handheld barcode scanner guns</li>
                <li>• GPS campus boundary geofence</li>
                <li>• Automated curfew delay & overdue alert</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-emerald-500/50 space-y-1.5">
              <h5 className="font-bold text-emerald-300">🍽️ 3. Smart Mess Ecosystem</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• 4 PM 'Eating Tonight?' meal poll</li>
                <li>• Headcount forecasting for exact food</li>
                <li>• IoT kitchen digital waste scales</li>
                <li>• 7-Day verified menu & daily star rating</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-cyan-500/50 space-y-1.5">
              <h5 className="font-bold text-cyan-300">🏛️ 4. Admin Command Center</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• 9-Day tap leak SLA red alert</li>
                <li>• Chief Warden 1-tap mobile approvals</li>
                <li>• Recurring Issue Heatmap (pipe flaws)</li>
                <li>• Complete immutable activity audit log</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-purple-500/50 space-y-1.5">
              <h5 className="font-bold text-purple-300">📟 5. External Devices & IoT</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• RFID/NFC student college ID card tap</li>
                <li>• IoT ultrasonic water tank sensors</li>
                <li>• Automatic pipe leak alerts in 45 min</li>
                <li>• Automated parent SMS dispatch gateway</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-rose-500/50 space-y-1.5">
              <h5 className="font-bold text-rose-300">📶 6. Universal Accessibility</h5>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• Offline-First PWA (zero Wi-Fi lag)</li>
                <li>• Multilingual: Odia (ଓଡ଼ିଆ), Hindi, English</li>
                <li>• Nokia Keypad USSD (*789#): No internet</li>
                <li>• Plain text SMS fallback to shortcode 56767</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 3: All Features Deep Dive
    {
      id: 3,
      title: "All Core Features : Eliminating Everyday Friction",
      category: "SLIDE 3/8 • CORE WORKFLOWS IN POINTERS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              🚪 1. Digital Gate Pass & Outing Clearance
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Student submits outing request on phone in 15 seconds.</li>
              <li>• Chief Warden receives mobile alert and 1-tap approves.</li>
              <li>• Automated SMS confirmation sent to parent immediately.</li>
              <li>• Dynamic QR pass generated with validity countdown timer.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              🚰 2. Maintenance Ticketing with SLA Ageing
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• AI auto-routes 'tap leak' to plumbers and 'spark' to electricians.</li>
              <li>• Visual SLA countdown: Green (&lt;24h), Amber (24-48h).</li>
              <li>• <strong>9-Day Tap Leak Fix:</strong> Breached tickets turn RED and escalate to Chief Warden.</li>
              <li>• Student confirms fix with 5-star rating and photo evidence.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              📜 3. Automated Bonafide & NOC Clearance
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Replaces 3-day office queues across Accounts, Library & Dean.</li>
              <li>• Instant eligibility check: verifies Attendance &gt;75% & Fee Dues = ₹0.</li>
              <li>• Generates official printable PDF with CIT seal in 2 seconds.</li>
              <li>• Includes cryptographic verification QR code for employers & banks.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              🍽️ 4. Smart Mess Dining & Waste Reduction
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Verified 7-day nutritional calendar for breakfast, lunch, tea, dinner.</li>
              <li>• 4:00 PM 'Eating Tonight?' poll forecasts exact diners.</li>
              <li>• Cuts kitchen food waste by 30% (~750 kg food saved monthly).</li>
              <li>• Saves ₹90,000 monthly in raw rations for the mess contractor.</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 4: GPS Geo-Fencing & Dynamic QR Scanner
    {
      id: 4,
      title: "GPS Geo-Fencing & Dynamic QR Scanner Integration",
      category: "SLIDE 4/8 • GPS & QR INTEGRATION IN POINTERS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-cyan-500/50 space-y-2.5">
            <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>GPS Campus Geo-Fencing System (Pointers)</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li>• <strong>Virtual Campus Perimeter:</strong> Maps exact boundary of CIT campus (hostels, academic wings, main gates).</li>
              <li>• <strong>Auto Ingress/Egress:</strong> Proximity triggers automated departure and return logs.</li>
              <li>• <strong>Emergency Night SOS:</strong> 1-tap SOS button transmits student's live GPS coordinates directly to campus security & parents.</li>
              <li>• <strong>Curfew Dispute Prevention:</strong> Real-time timestamp eliminates parent-guard disputes over exact arrival times.</li>
              <li>• <strong>Geo-Tagged Grievances:</strong> Broken streetlights or leaking pipelines automatically capture precise GPS coordinates.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-500/50 space-y-2.5">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Dynamic QR Code Security Scanner (Pointers)</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li>• <strong>Rolling 30-Second Token:</strong> Dynamic QR refreshes continuously to prevent screenshot sharing or pass forwarding.</li>
              <li>• <strong>Built-in Mobile Viewfinder:</strong> Guard terminal software scans passes via mobile/tablet camera with animated laser overlay.</li>
              <li>• <strong>Handheld Scanner Gun Support:</strong> Rugged USB/Bluetooth 2D barcode scanner guns read passes in 0.3 seconds.</li>
              <li>• <strong>Rapid 0.3s Ingress:</strong> Clears peak curfew rush (500+ students) in 15 minutes without forming physical queues.</li>
              <li>• <strong>Document Verify QR:</strong> External scholarship portals and employers scan Bonafide certificates to verify against CIT database.</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 5: External Devices & Smart IoT Hardware
    {
      id: 5,
      title: "External Devices & Smart Campus IoT Hardware",
      category: "SLIDE 5/8 • HARDWARE & IOT INTEGRATION IN POINTERS",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              💳 1. RFID / NFC Smart ID Card Readers
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Contactless Tap at Gates: Students tap existing college ID cards on NFC readers.</li>
              <li>• Mess Dining Turnstile: Tap-and-eat reader verifies dinner reservation token.</li>
              <li>• Prevents Meal Duplication: Guarantees zero unauthorized ration leakage.</li>
              <li>• Dead Battery Fallback: Works even if the student's smartphone battery dies.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              🔫 2. Handheld Optical 2D Barcode Scanner Guns
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Industrial Grade Hardware: Rugged USB/Bluetooth 2D scanners at security gates.</li>
              <li>• All-Weather Reliability: Functions reliably during rain, humidity, dust, or glare.</li>
              <li>• Zero Typing at Gate: Reads student dynamic QR pass in 0.3 seconds.</li>
              <li>• Rapid Queue Clearance: Avoids long queues outside the gatehouse.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              💧 3. IoT Ultrasonic Water Tank Sensors
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Real-Time Volume Tracking: Ultrasonic sensors monitor 50,000L rooftop water tanks.</li>
              <li>• Anomaly Flow Alert: Detects continuous midnight water flow anomalies automatically.</li>
              <li>• <strong>Prevents 9-Day Leaks:</strong> Alerts maintenance in 45 minutes BEFORE humans notice!</li>
              <li>• Massive Water Conservation: Saves thousands of liters of clean campus water.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              ⚖️ 4. Mess Kitchen Smart Digital Weighing Scales
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• Connected Kitchen Scales: Leftover dining food weighed on connected IoT digital scales.</li>
              <li>• Real-Time Telemetry: Automatically uploads daily food waste kilograms to admin dashboard.</li>
              <li>• Enforces Accountability: Holds mess contractors to waste-reduction contractual terms.</li>
              <li>• Rations Optimization: Saves ₹90,000 monthly in raw food procurement.</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 6: Quantified Advantages
    {
      id: 6,
      title: "Quantified Advantages : Why UNIFY Wins for Everyone",
      category: "SLIDE 6/8 • QUANTIFIED ADVANTAGES IN POINTERS",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-blue-500/50 space-y-2">
            <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider">
              👨‍🎓 For Students (Zero Daily Friction)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>90% Faster Task Completion:</strong> 3-day bonafide queues cut to 2 seconds.</li>
              <li>• <strong>Safe Bunk Calculator:</strong> Tracks safe leaves remaining (6 left) without stress.</li>
              <li>• <strong>Verified Digital Passes:</strong> Dynamic QR & auto parent SMS on mobile.</li>
              <li>• <strong>Voice in Food Quality:</strong> Daily star rating enforces mess standards.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-500/50 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              👨‍🏫 For Wardens & Administrators
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>1-Tap Outing Approvals:</strong> Approve 50 passes in 60 seconds from anywhere.</li>
              <li>• <strong>SLA Ageing Radar:</strong> Neglected tickets turn RED and auto-escalate to Chief Warden.</li>
              <li>• <strong>Recurring Issue Heatmap:</strong> Detects 14 pipe leaks on Block B 3rd Floor.</li>
              <li>• <strong>Zero Paper Registers:</strong> Eliminates manual paper filing and lost slips.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-cyan-500/50 space-y-2">
            <h4 className="text-cyan-400 font-bold text-xs uppercase tracking-wider">
              👮 For Security Guards (Main Gate)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>Zero Paper Handwriting:</strong> Replaces torn and messy paper registers.</li>
              <li>• <strong>Fast 0.5s Optical Scan:</strong> Mobile camera or handheld gun raises barrier.</li>
              <li>• <strong>Overdue Curfew Warnings:</strong> Automatically flags students returning late.</li>
              <li>• <strong>Automated Parent SMS:</strong> Ends parent disputes regarding entry/exit times.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              🍲 For Mess Managers & College Board
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>30% Mess Food Waste Cut:</strong> Saves ~750 kg food and ₹90,000 monthly.</li>
              <li>• <strong>Tamper-Proof Audit Trail:</strong> Complete institutional ledger of passes and repairs.</li>
              <li>• <strong>100% WhatsApp Replacement:</strong> Official targeted notices with verified read receipts.</li>
              <li>• <strong>Proactive Capital Budgeting:</strong> Data-driven maintenance infrastructure investments.</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 7: Accessibility & Reality Checks
    {
      id: 7,
      title: "Accessibility & Reality Checks : Built for Real Campuses",
      category: "SLIDE 7/8 • 15% EVALUATION CRITERIA IN POINTERS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-blue-500/50 space-y-2">
            <h4 className="text-blue-400 font-bold text-xs uppercase tracking-wider">
              📶 Offline-First PWA (Pointers)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>Wi-Fi Deadzone Resilient:</strong> Operates without active internet in corridors.</li>
              <li>• <strong>Local IndexedDB Queue:</strong> Passes & grievances are saved safely locally.</li>
              <li>• <strong>Background Auto-Sync:</strong> Automatically synchronizes when Wi-Fi reconnects.</li>
              <li>• <strong>Zero Data Loss Guarantee:</strong> Never loses student drafts or emergency requests.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-500/50 space-y-2">
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              🌐 Multilingual Support (Pointers)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>Native Odisha Language:</strong> Full localization for CIT campus community.</li>
              <li>• <strong>1-Click Instant Switch:</strong> Toggle between English, Odia (ଓଡ଼ିଆ), and Hindi (हिन्दी).</li>
              <li>• <strong>Non-Teaching Staff Friendly:</strong> Security guards & mess staff use native script.</li>
              <li>• <strong>Transparent Communication:</strong> Eliminates English language barriers.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-emerald-500/50 space-y-2">
            <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              📱 Basic Feature Phone Fallback (Pointers)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>• <strong>Non-Smartphone Inclusion:</strong> Works on basic ₹800 keypad phones.</li>
              <li>• <strong>Nokia USSD (*789#):</strong> Dial menu for emergency passes, mess & attendance.</li>
              <li>• <strong>Plain Text SMS (56767):</strong> Send 'PASS OUT MARKET' to get approval code.</li>
              <li>• <strong>100% Student Coverage:</strong> Zero students left behind due to device cost.</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 8: 30-Day Rollout Blueprint & Impact
    {
      id: 8,
      title: "30-Day College Rollout Blueprint & Measurable Impact",
      category: "SLIDE 8/8 • ROLLOUT ROADMAP IN POINTERS",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/90 rounded-2xl border border-blue-500/50 space-y-1.5">
              <span className="text-[10px] font-black text-amber-400 block uppercase">Phase 1 (Weeks 1-2)</span>
              <h5 className="font-bold text-white text-xs">Gate QR Scanners & Notices</h5>
              <ul className="space-y-1 text-[10px] text-slate-300">
                <li>• Deploy QR scanners & NFC ID readers at gates.</li>
                <li>• Ingest student CSV master data.</li>
                <li>• Dual-run paper registers for 7 days.</li>
                <li>• Pin broadcast links to WhatsApp groups.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-indigo-500/50 space-y-1.5">
              <span className="text-[10px] font-black text-amber-400 block uppercase">Phase 2 (Weeks 3-4)</span>
              <h5 className="font-bold text-white text-xs">Maintenance & Mess Waste</h5>
              <ul className="space-y-1 text-[10px] text-slate-300">
                <li>• Plumber tablets & IoT water tank sensors.</li>
                <li>• Activate 4 PM dinner poll & IoT scales.</li>
                <li>• Activate Nokia feature phone USSD (*789#).</li>
                <li>• Enforce 12h SLA repair timers.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-800/90 rounded-2xl border border-emerald-500/50 space-y-1.5">
              <span className="text-[10px] font-black text-amber-400 block uppercase">Phase 3 (Month 2)</span>
              <h5 className="font-bold text-white text-xs">Bonafide & Analytics</h5>
              <ul className="space-y-1 text-[10px] text-slate-300">
                <li>• Connect fee ledger for instant PDF certificates.</li>
                <li>• Review Recurring Issue Heatmap for pipe repairs.</li>
                <li>• Deprecate 100% of physical complaint diaries.</li>
                <li>• Full digital institutional transformation.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-1">
            <span className="text-emerald-400 font-bold text-xs">
              Expected Campus Outcome: 90% Faster Requests • 30% Mess Food Waste Saved • 100% Safety Audit Trail
            </span>
            <div className="text-[11px] text-slate-300">
              Built with ❤️ by Team <strong>BUG FINDERS</strong> for Chilika Institution of Technology (CIT).
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Direct Download Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Hackathon Presentation • Team: BUG FINDERS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            8-Slide Project Presentation Deck (In Pointers)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
            With Mind Map, All Features, GPS Geo-fencing, External Devices & QR Scanner
          </p>
        </div>

        {/* 1-Click Download Buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href="/UNIFY_source_code.zip"
            download="UNIFY_Source_Code_BUG_FINDERS.zip"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Source Code (.ZIP)</span>
          </a>

          <a
            href="/UNIFY_bugfinders.pptx"
            download="UNIFY_BUG_FINDERS.pptx"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            <Presentation className="w-4 h-4" />
            <span>Download PPTX (PowerPoint)</span>
          </a>

          <a
            href="/UNIFY_bugfinders.pdf"
            download="UNIFY_BUG_FINDERS.pdf"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF (8 Pages)</span>
          </a>
        </div>
      </div>

      {/* Interactive Slide Viewer */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 min-h-[460px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400">
              {slides[currentSlide - 1].category}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">
              Team: BUG FINDERS
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mt-4 mb-4">
            {slides[currentSlide - 1].title}
          </h3>

          <div className="py-2">
            {slides[currentSlide - 1].content}
          </div>
        </div>

        {/* Slide Pagination & Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentSlide(num)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentSlide === num
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
              disabled={currentSlide === 1}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(8, prev + 1))}
              disabled={currentSlide === 8}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
