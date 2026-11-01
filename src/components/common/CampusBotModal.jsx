import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, ArrowRight, CheckCircle2, FileText, Shield, Wrench, Utensils } from 'lucide-react';

export default function UnifyBotModal({ isOpen, onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am AstraBot, your 24/7 AI Campus Assistant. I resolve everyday campus, fee, timetable, and administrative questions instantly. How can I help you today?",
      quickButtons: [
        "How to download Bonafide Certificate?",
        "When is dinner poll cutoff time?",
        "How to pay semester fees online?",
        "What are the gate curfew hours?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (queryText) => {
    const query = (queryText || inputText).trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    const lower = query.toLowerCase();

    let botReply = "I can guide you! AstraCampus automates campus services so you don't have to visit the administrative office.";
    let actionBtn = null;

    if (lower.includes('bonafide') || lower.includes('certificate') || lower.includes('noc')) {
      botReply = "To get an official Bonafide Certificate: 1. You need attendance > 75% and zero fee dues. 2. AstraCampus auto-verifies your records in real time. 3. Generates a signed PDF with official CIT seal & authenticity QR code in 2 seconds!";
      actionBtn = { label: "Open Bonafide Generator", tab: "documents" };
    } else if (lower.includes('fee') || lower.includes('pay') || lower.includes('dues') || lower.includes('ledger') || lower.includes('invoice')) {
      botReply = "AstraCampus provides an itemized institutional Fee Ledger! Students and Parents can pay tuition, hostel, and mess dues online via UPI / NetBanking with instant HMAC-SHA256 signature verification and printable A4 receipts.";
      actionBtn = { label: "Open Fee Ledger & Invoices", tab: "feeLedger" };
    } else if (lower.includes('mess') || lower.includes('dinner') || lower.includes('poll') || lower.includes('cutoff')) {
      botReply = "The 'Eating Tonight?' dinner poll cut-off is 4:00 PM every day! Marking whether you are eating helps the kitchen prepare exact portions, saving ~750 kg food and ₹90,000 monthly!";
      actionBtn = { label: "Open Mess & Dining", tab: "mess" };
    } else if (lower.includes('tap') || lower.includes('leak') || lower.includes('repair') || lower.includes('complaint')) {
      botReply = "To report a leaking tap or electrical issue: 1. Click 'Report New Issue'. 2. Our AI auto-detects keywords to route directly to Plumbing (12h SLA). 3. If delayed past SLA, it turns RED and auto-escalates to Chief Warden Dr. Nayak!";
      actionBtn = { label: "File Maintenance Ticket", tab: "complaints" };
    } else if (lower.includes('gate') || lower.includes('curfew') || lower.includes('outing') || lower.includes('pass')) {
      botReply = "Curfew hours: Normal Day Outings must return by 20:30 (8:30 PM). Request a pass in 10 seconds to receive 1-tap warden approval, dynamic security QR, and automated parent SMS dispatch!";
      actionBtn = { label: "Open Gate Pass Hub", tab: "gatePass" };
    } else if (lower.includes('attendance') || lower.includes('75') || lower.includes('eligibility')) {
      botReply = "University regulations mandate 75% minimum attendance to be eligible for semester examinations. Your current verified overall attendance is 84.5%, safely meeting the requirement.";
      actionBtn = { label: "View Attendance Record", tab: "attendance" };
    } else {
      botReply = "I understand you need assistance! You can use AstraCampus to request gate passes, pay fees online, inspect timetable clashes, report hostel repairs, or mark dinner attendance.";
    }

    setMessages(prev => [
      ...prev,
      userMsg,
      { sender: 'bot', text: botReply, actionBtn }
    ]);

    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full shadow-2xl border border-purple-500/40 overflow-hidden flex flex-col h-[560px] animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-5 flex items-center justify-between border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">UnifyBot AI Assistant</h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-500/30 text-purple-300 border border-purple-400/30">
                  24/7 ONLINE
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Resolving the 20 questions the office is asked every day
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none space-y-2'
                }`}
              >
                <div>{msg.text}</div>

                {/* Quick Interactive Prompt Buttons */}
                {msg.quickButtons && (
                  <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-700/60">
                    <span className="text-[10px] text-purple-300 font-bold uppercase">Popular Inquiries:</span>
                    {msg.quickButtons.map((btnText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(btnText)}
                        className="text-left px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 text-[11px] border border-purple-800/40 transition-all flex items-center justify-between"
                      >
                        <span>{btnText}</span>
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Redirect Button */}
                {msg.actionBtn && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(msg.actionBtn.tab);
                    }}
                    className="w-full mt-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>{msg.actionBtn.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. Bonafide, Mess hours, Curfew, Tap repair)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
