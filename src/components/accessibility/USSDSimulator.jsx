import React, { useState } from 'react';
import { Smartphone, PhoneCall, PhoneOff, Send, MessageSquare, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function USSDSimulator() {
  const [phoneState, setPhoneState] = useState('IDLE'); // 'IDLE' | 'DIALING' | 'MENU_MAIN' | 'GATE_PASS' | 'MESS_MENU' | 'ATTENDANCE' | 'CONFIRMATION'
  const [dialedNumber, setDialedNumber] = useState('*789#');
  const [screenMessage, setScreenMessage] = useState('');
  const [smsLog, setSmsLog] = useState([
    { sender: 'UNIFY', text: 'Alert: Tomorrow water tank cleaning 08:30-13:30 in Aryabhatta Hall.', time: '08:05 AM' }
  ]);
  const [smsInput, setSmsInput] = useState('');

  const handleKeyClick = (char) => {
    if (phoneState === 'IDLE' || phoneState === 'DIALING') {
      setPhoneState('DIALING');
      setDialedNumber(prev => prev + char);
    } else if (phoneState === 'MENU_MAIN') {
      if (char === '1') {
        setPhoneState('GATE_PASS');
      } else if (char === '2') {
        setPhoneState('MESS_MENU');
      } else if (char === '4') {
        setPhoneState('ATTENDANCE');
      } else if (char === '0') {
        handleEndCall();
      }
    } else if (phoneState === 'GATE_PASS') {
      if (char === '1' || char === '2' || char === '3') {
        setPhoneState('CONFIRMATION');
        confetti({ particleCount: 40, spread: 60 });
        setSmsLog(prev => [
          { sender: 'CIT-GATE', text: 'EMERGENCY PASS #8892 APPROVED. Valid till 21:00. Show this SMS at North Gate.', time: 'Just now' },
          ...prev
        ]);
      }
    }
  };

  const handleCall = () => {
    if (dialedNumber === '*789#' || dialedNumber.includes('*789#')) {
      setPhoneState('MENU_MAIN');
    } else {
      setPhoneState('MENU_MAIN');
    }
  };

  const handleEndCall = () => {
    setPhoneState('IDLE');
    setDialedNumber('*789#');
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!smsInput.trim()) return;

    const userText = smsInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = [{ sender: 'YOU', text: userText, time: timeNow }];

    let reply = '';
    const lower = userText.toLowerCase();
    if (lower.includes('pass')) {
      reply = 'CIT GATE PASS: Day Outing token GP-9912 generated. Return Curfew: 20:30. Warden notified via automated SMS.';
    } else if (lower.includes('mess')) {
      reply = 'Annapurna Mess Menu: Dinner tonight is Roti, Veg Pulao, Kadai Chicken / Kadai Mushroom, Kheer.';
    } else if (lower.includes('attd')) {
      reply = 'Piyush Mohapatra (CSE): Overall Attendance is 84.5%. Status: Eligible for semester exams.';
    } else {
      reply = 'AstraCampus SMS Service: Send "PASS OUT", "MESS MENU", or "ATTD" to 56767.';
    }

    setTimeout(() => {
      setSmsLog(prev => [{ sender: 'UNIFY (56767)', text: reply, time: timeNow }, ...newLog, ...prev]);
      confetti({ particleCount: 25, spread: 40 });
    }, 400);

    setSmsInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Inclusive Campus Access | 15% Evaluation Criteria</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Non-Smartphone & USSD Gateway Simulator
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2 leading-relaxed">
            Not every student owns a ₹20,000 smartphone or 4G data pack. UNIFY provides an instant USSD (`*789#`) and SMS shortcode (`56767`) fallback that works on any basic ₹800 Nokia feature phone without internet.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Retro Phone Simulation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col items-center">
          <div className="text-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Interactive Nokia / Feature Phone (`*789#`)
            </h3>
            <p className="text-xs text-slate-500">
              Click the keypad buttons to test live USSD menus without data connectivity
            </p>
          </div>

          {/* Feature Phone Body */}
          <div className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[40px] p-5 shadow-2xl border-4 border-slate-700 relative text-slate-100">
            {/* Earpiece speaker */}
            <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto mb-3"></div>

            {/* LCD Screen */}
            <div className="bg-[#9bb38b] text-[#1b2a1a] font-mono p-3 rounded-2xl h-48 flex flex-col justify-between border-4 border-slate-950 shadow-inner select-none">
              {/* Status Bar */}
              <div className="flex justify-between items-center text-[10px] font-bold border-b border-[#829974] pb-1">
                <span>BSNL CIT 2G</span>
                <span>17:42</span>
              </div>

              {/* Screen Content State Machine */}
              <div className="flex-1 py-1 text-xs leading-tight font-bold">
                {phoneState === 'IDLE' && (
                  <div className="text-center py-6">
                    <div className="text-sm font-black tracking-widest uppercase">ASTRACAMPUS CIT</div>
                    <div className="text-[10px] mt-1 text-[#2d472b]">Dial *789# for services</div>
                  </div>
                )}

                {phoneState === 'DIALING' && (
                  <div className="text-center py-6">
                    <div className="text-[10px] text-[#2d472b]">Calling...</div>
                    <div className="text-lg font-black tracking-wider mt-1">{dialedNumber}</div>
                  </div>
                )}

                {phoneState === 'MENU_MAIN' && (
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-black border-b border-[#829974] pb-0.5">-- UNIFY Menu --</div>
                    <div>1. Emergency Gate Pass</div>
                    <div>2. Today Mess Menu</div>
                    <div>4. Attendance Buffer</div>
                    <div>0. Cancel</div>
                    <div className="text-[9px] pt-1 text-[#2d472b]">Press key 1, 2 or 4</div>
                  </div>
                )}

                {phoneState === 'GATE_PASS' && (
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-black border-b border-[#829974] pb-0.5">Select Outing Purpose:</div>
                    <div>1. Market / Books</div>
                    <div>2. Weekend Home</div>
                    <div>3. Medical Clinic</div>
                    <div className="text-[9px] pt-1 text-[#2d472b]">Press 1, 2, or 3</div>
                  </div>
                )}

                {phoneState === 'MESS_MENU' && (
                  <div className="space-y-0.5 text-[10px]">
                    <div className="font-black border-b border-[#829974] pb-0.5">Annapurna Mess Dinner:</div>
                    <div>Roti, Dalma, Veg Pulao, Kadai Chicken/Mushroom, Kheer.</div>
                    <div className="text-[9px] pt-1 text-[#2d472b]">Press 0 to exit</div>
                  </div>
                )}

                {phoneState === 'ATTENDANCE' && (
                  <div className="space-y-0.5 text-[10px]">
                    <div className="font-black border-b border-[#829974] pb-0.5">Piyush (2201106145):</div>
                    <div>Attd: 84.5% (Safe)</div>
                    <div>Exam: Eligible (&gt;75%)</div>
                    <div className="text-[9px] pt-1 text-[#2d472b]">Press 0 to exit</div>
                  </div>
                )}

                {phoneState === 'CONFIRMATION' && (
                  <div className="space-y-0.5 text-[10px] text-center py-3">
                    <div className="font-black text-xs">PASS APPROVED!</div>
                    <div>Ref: GP-8892</div>
                    <div>Curfew: 21:00</div>
                    <div className="text-[9px] text-[#2d472b] mt-1">SMS receipt sent</div>
                  </div>
                )}
              </div>

              {/* Screen Footer */}
              <div className="flex justify-between items-center text-[9px] font-bold border-t border-[#829974] pt-0.5">
                <span>Menu</span>
                <span>Select</span>
              </div>
            </div>

            {/* Keypad */}
            <div className="mt-4 space-y-2 text-slate-200">
              {/* Function row */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                <button
                  onClick={handleCall}
                  className="py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPhoneState('MENU_MAIN')}
                  className="py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-[10px]"
                >
                  NAV
                </button>
                <button
                  onClick={handleEndCall}
                  className="py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Numeric keypad 1-9 */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                {[
                  { k: '1', sub: '.,' },
                  { k: '2', sub: 'ABC' },
                  { k: '3', sub: 'DEF' },
                  { k: '4', sub: 'GHI' },
                  { k: '5', sub: 'JKL' },
                  { k: '6', sub: 'MNO' },
                  { k: '7', sub: 'PQRS' },
                  { k: '8', sub: 'TUV' },
                  { k: '9', sub: 'WXYZ' },
                  { k: '*', sub: '+' },
                  { k: '0', sub: ' ' },
                  { k: '#', sub: '↑' }
                ].map((item) => (
                  <button
                    key={item.k}
                    onClick={() => handleKeyClick(item.k)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-100 flex flex-col items-center justify-center transition-all shadow-xs"
                  >
                    <span className="text-sm font-black leading-none">{item.k}</span>
                    <span className="text-[8px] text-slate-400 leading-none mt-0.5">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SMS Shortcode Gateway Simulator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>SMS Shortcode Fallback (Send to 56767)</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                ZERO INTERNET NEEDED
              </span>
            </div>

            <p className="text-xs text-slate-500 my-3">
              Students without even USSD can send standard plain text SMS commands. The campus SMS gateway processes requests and returns cryptographically verifiable text passes.
            </p>

            {/* Quick Template Prompts */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                type="button"
                onClick={() => setSmsInput('PASS OUT Rourkela Market')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                PASS OUT [Destination]
              </button>
              <button
                type="button"
                onClick={() => setSmsInput('MESS MENU')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                MESS MENU
              </button>
              <button
                type="button"
                onClick={() => setSmsInput('ATTD')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                ATTD
              </button>
            </div>

            {/* SMS Messages Feed */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-72 overflow-y-auto">
              {smsLog.map((sms, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs max-w-[85%] ${
                    sms.sender === 'YOU'
                      ? 'bg-blue-600 text-white ml-auto rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] opacity-75 mb-1">
                    <span className="font-bold">{sms.sender}</span>
                    <span>{sms.time}</span>
                  </div>
                  <div className="leading-relaxed">{sms.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Send Box */}
          <form onSubmit={handleSendSms} className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="e.g. PASS OUT Rourkela Market..."
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send SMS
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
