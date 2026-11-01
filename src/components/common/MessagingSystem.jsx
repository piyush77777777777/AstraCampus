import React, { useState, useEffect, useRef } from 'react';
import { useCampus } from '../../context/CampusContext';
import {
  MessageSquare, Send, Search, X, ChevronLeft, User,
  Check, CheckCheck, Clock, Bell, Paperclip, Smile, Plus
} from 'lucide-react';

// ── Seed conversations for judge demo ─────────────────────────────
const SEED_CONVERSATIONS = [
  {
    id: 'conv-001',
    participants: ['student', 'faculty'],
    participantNames: { student: 'Piyush Kumar Dey', faculty: 'Dr. Ramesh Chandra' },
    participantAvatars: {
      student: 'https://api.dicebear.com/7.x/avataaars/svg?seed=piyush',
      faculty: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramesh'
    },
    messages: [
      { id: 'm1', from: 'faculty', text: 'Piyush, you missed the OS lab session on Day 3. Please submit the lab report by Day 5 EOD or attendance will be marked absent.', time: '08:10 AM', read: true },
      { id: 'm2', from: 'student', text: 'Sorry Sir, I was unwell. I have submitted a medical leave request. Will submit the report by Day 5, 5 PM.', time: '08:35 AM', read: true },
      { id: 'm3', from: 'faculty', text: 'Noted. Get well soon. Make sure to cover the missed practicals.', time: '09:00 AM', read: false },
    ],
    lastMessage: 'Noted. Get well soon.',
    lastTime: '09:00 AM',
    unread: 1,
  },
  {
    id: 'conv-002',
    participants: ['student', 'admin'],
    participantNames: { student: 'Piyush Kumar Dey', admin: 'Dr. Subrata Panda (Dean)' },
    participantAvatars: {
      student: 'https://api.dicebear.com/7.x/avataaars/svg?seed=piyush',
      admin: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dean'
    },
    messages: [
      { id: 'm4', from: 'admin', text: 'Your gate pass GP-2026-0001 has been APPROVED. QR token is now active. Please ensure you return before 20:30.', time: 'Yesterday', read: true },
      { id: 'm5', from: 'student', text: 'Thank you Sir! I will be back before 8:30 PM.', time: 'Yesterday', read: true },
    ],
    lastMessage: 'Thank you Sir!',
    lastTime: 'Yesterday',
    unread: 0,
  },
  {
    id: 'conv-003',
    participants: ['club', 'admin'],
    participantNames: { club: 'Spectra Tech Club', admin: 'Dr. Subrata Panda (Dean)' },
    participantAvatars: {
      club: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spectra',
      admin: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dean'
    },
    messages: [
      { id: 'm6', from: 'club', text: 'Sir, we have submitted a venue booking request VR-2026-0011 for the Main Auditorium for Spectra Tech Fest 2026 (Day 7). Requesting your approval.', time: '08:15 AM', read: true },
      { id: 'm7', from: 'admin', text: 'I can see the request in the Approval Center. Will review and respond by EOD. Make sure AV team confirmation is attached.', time: '10:30 AM', read: false },
    ],
    lastMessage: 'Will review by EOD.',
    lastTime: '10:30 AM',
    unread: 1,
  },
  {
    id: 'conv-004',
    participants: ['faculty', 'hod'],
    participantNames: { faculty: 'Prof. Ananya Verma', hod: 'Prof. Jagabandhu Nayak (HOD)' },
    participantAvatars: {
      faculty: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
      hod: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hod'
    },
    messages: [
      { id: 'm8', from: 'faculty', text: 'Sir, I have applied for a room request RR-2026-0031 for an extra DBMS lecture in LH-01 on Day 4, Period 5. Please approve.', time: '07:50 AM', read: true },
      { id: 'm9', from: 'hod', text: 'Approved. LH-01 is free that slot. Inform students via notice board and update timetable.', time: '08:20 AM', read: false },
    ],
    lastMessage: 'Approved. LH-01 is free.',
    lastTime: '08:20 AM',
    unread: 1,
  },
];

const STORAGE_KEY = 'ASTRACAMPUS_MESSAGES';
const BROADCASTS_KEY = 'ASTRACAMPUS_BROADCASTS';

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED_CONVERSATIONS;
  } catch { return SEED_CONVERSATIONS; }
}

function saveConversations(convs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
}

// Quick reply suggestions per role
const QUICK_REPLIES = {
  student: ['Thank you Sir/Ma\'am!', 'I will submit by EOD.', 'Noted. I\'ll attend next class.', 'Please see my leave request.'],
  faculty: ['Noted. Please submit on time.', 'Approved. Attend next session.', 'Come to my office hours.', 'Please see your attendance record.'],
  admin: ['Approved. Please proceed.', 'Rejected. See reason in Approval Center.', 'Please submit the required documents.', 'Your request is under review.'],
  hod: ['Approved. Proceed accordingly.', 'Schedule conflict — please reschedule.', 'Inform department via notice board.', 'Attached: Approval letter.'],
  club: ['Request submitted to admin.', 'Will confirm attendee count by Day 5.', 'AV setup confirmed with tech team.', 'Budget attached for review.'],
  principal: ['Please present this in tomorrow\'s meeting.', 'Acknowledged.', 'Forward to the concerned department.', 'Escalated for review.'],
  parent: ['Thank you for the update.', 'Will speak with my ward today.', 'Please share the fee invoice.', 'Kindly approve the gate pass.'],
};

export default function MessagingSystem({ isOpen, onClose }) {
  const { activeRole, currentPersona } = useCampus();
  const [conversations, setConversations] = useState(loadConversations);
  const [activeConv, setActiveConv] = useState(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [composing, setComposing] = useState(false);
  const [newMsgTo, setNewMsgTo] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync across tabs
  useEffect(() => {
    const handler = () => setConversations(loadConversations());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, conversations]);

  if (!isOpen) return null;

  // Filter relevant conversations for this role
  const myConvs = conversations.filter(c =>
    c.participants.includes(activeRole) ||
    c.participantNames?.[activeRole] ||
    // Admin/HOD/Principal see all
    ['admin', 'hod', 'principal'].includes(activeRole)
  );

  const filtered = myConvs.filter(c => {
    const name = Object.values(c.participantNames || {}).join(' ').toLowerCase();
    const last = (c.lastMessage || '').toLowerCase();
    return name.includes(search.toLowerCase()) || last.includes(search.toLowerCase());
  });

  const totalUnread = myConvs.reduce((sum, c) => sum + (c.unread || 0), 0);

  const openConv = (conv) => {
    // Mark all as read
    const updated = conversations.map(c =>
      c.id === conv.id
        ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) }
        : c
    );
    setConversations(updated);
    saveConversations(updated);
    setActiveConv(conv.id);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeConv) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      from: activeRole,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    const updated = conversations.map(c => {
      if (c.id !== activeConv) return c;
      return {
        ...c,
        messages: [...c.messages, newMsg],
        lastMessage: text,
        lastTime: 'Just now',
        unread: 0,
      };
    });

    setConversations(updated);
    saveConversations(updated);
    setInput('');
    setShowQuickReplies(false);

    // Simulate auto-reply after 1.5s for demo
    setTimeout(() => {
      const conv = updated.find(c => c.id === activeConv);
      if (!conv) return;
      const otherRole = conv.participants.find(p => p !== activeRole);
      const replies = {
        faculty: ['Noted. I will review your submission.', 'Thank you for the update.', 'See you in the next class.'],
        admin: ['Your request has been received and is under review.', 'Please check the Approval Center for status updates.'],
        student: ['Understood Sir/Ma\'am.', 'I will take care of it.', 'Thank you for the response!'],
        hod: ['Approved. Please proceed.', 'Schedule this with the department.'],
        club: ['Will confirm AV setup by Day 5.', 'Updated the attendance count.'],
        parent: ['Thank you for the update.', 'Will follow up with my ward.'],
        principal: ['Acknowledged. Will address in next review.'],
      };
      const pool = replies[otherRole] || ['Message received.'];
      const autoReply = {
        id: `m-auto-${Date.now()}`,
        from: otherRole,
        text: pool[Math.floor(Math.random() * pool.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        isAuto: true,
      };
      const withReply = conversations.map(c =>
        c.id === activeConv
          ? { ...c, messages: [...c.messages, newMsg, autoReply], lastMessage: autoReply.text, lastTime: 'Just now', unread: 1 }
          : c
      );
      setConversations(withReply);
      saveConversations(withReply);
    }, 1500);
  };

  const startNewConversation = () => {
    if (!newMsgTo.trim()) return;
    const newConv = {
      id: `conv-${Date.now()}`,
      participants: [activeRole, 'admin'],
      participantNames: { [activeRole]: currentPersona?.name || 'You', admin: 'Dr. Subrata Panda (Dean)' },
      participantAvatars: {
        [activeRole]: currentPersona?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRole}`,
        admin: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dean'
      },
      messages: [],
      lastMessage: '',
      lastTime: 'Just now',
      unread: 0,
      subject: newMsgTo,
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setComposing(false);
    setNewMsgTo('');
    setActiveConv(newConv.id);
  };

  const currentConv = conversations.find(c => c.id === activeConv);

  const otherName = (conv) => {
    if (!conv?.participantNames) return 'Unknown';
    const other = conv.participants.find(p => p !== activeRole);
    return conv.participantNames[other] || Object.values(conv.participantNames).find(n => n !== currentPersona?.name) || 'Contact';
  };

  const otherAvatar = (conv) => {
    const other = conv.participants.find(p => p !== activeRole);
    return conv.participantAvatars?.[other] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${other}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">

        {/* ── Top Bar ── */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {activeConv ? (
              <button onClick={() => setActiveConv(null)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : null}
            <MessageSquare className="w-5 h-5 text-purple-300" />
            <div>
              <h2 className="text-base font-black">
                {activeConv && currentConv ? otherName(currentConv) : 'Campus Messaging'}
              </h2>
              <p className="text-[10px] text-purple-300">
                {activeConv && currentConv
                  ? currentConv.subject || 'Direct Message'
                  : `${totalUnread} unread • ${myConvs.length} conversations`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!activeConv && (
              <button
                onClick={() => setComposing(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> New Message
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">

          {/* ── Conversation List (left panel, hidden on mobile when conv open) ── */}
          <div className={`w-full sm:w-80 shrink-0 border-r border-slate-200 flex flex-col ${activeConv ? 'hidden sm:flex' : 'flex'}`}>

            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            {/* Compose modal */}
            {composing && (
              <div className="p-3 bg-indigo-50 border-b border-indigo-100 space-y-2">
                <p className="text-xs font-bold text-indigo-700">New Message Subject / Topic:</p>
                <input
                  autoFocus
                  type="text"
                  value={newMsgTo}
                  onChange={e => setNewMsgTo(e.target.value)}
                  placeholder="e.g. Gate pass approval request"
                  className="w-full px-3 py-2 border border-indigo-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  onKeyDown={e => e.key === 'Enter' && startNewConversation()}
                />
                <div className="flex gap-2">
                  <button onClick={startNewConversation} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition">Start</button>
                  <button onClick={() => setComposing(false)} className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition">Cancel</button>
                </div>
              </div>
            )}

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">No conversations found.</div>
              ) : filtered.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => openConv(conv)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition text-left ${activeConv === conv.id ? 'bg-indigo-50 border-r-2 border-indigo-600' : ''}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={otherAvatar(conv)}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover bg-slate-200"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName(conv))}&background=6366f1&color=fff`; }}
                    />
                    {conv.unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold truncate ${conv.unread > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                        {otherName(conv)}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.lastTime}</span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${conv.unread > 0 ? 'text-slate-800 font-semibold' : 'text-slate-500'}`}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Message Thread (right panel) ── */}
          <div className={`flex-1 flex flex-col min-h-0 ${!activeConv ? 'hidden sm:flex' : 'flex'}`}>
            {!activeConv || !currentConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 p-8">
                <MessageSquare className="w-16 h-16 text-slate-200" />
                <p className="font-bold text-slate-500">Select a conversation to read messages</p>
                <p className="text-xs text-center text-slate-400">
                  You can message faculty, admin, HOD, club heads and more.<br />
                  Messages are delivered instantly across all portals.
                </p>
                <button
                  onClick={() => setComposing(true)}
                  className="mt-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                >
                  + Start a New Conversation
                </button>
              </div>
            ) : (
              <>
                {/* Sub-header */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3 shrink-0">
                  <img
                    src={otherAvatar(currentConv)}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover bg-slate-200"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName(currentConv))}&background=6366f1&color=fff`; }}
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{otherName(currentConv)}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Online • AstraCampus
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                  {currentConv.messages.map((msg) => {
                    const isMe = msg.from === activeRole;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                        {!isMe && (
                          <img
                            src={currentConv.participantAvatars?.[msg.from] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.from}`}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover bg-slate-200 shrink-0 mt-1"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${msg.from}&background=6366f1&color=fff`; }}
                          />
                        )}
                        <div className={`max-w-[72%]`}>
                          {!isMe && (
                            <div className="text-[10px] text-slate-500 font-semibold mb-1 ml-1">
                              {currentConv.participantNames?.[msg.from] || msg.from}
                              {msg.isAuto && <span className="ml-1 text-purple-500">(auto-reply)</span>}
                            </div>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                            {isMe && (
                              msg.read
                                ? <CheckCheck className="w-3 h-3 text-indigo-400" />
                                : <Check className="w-3 h-3 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {showQuickReplies && (
                  <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 flex-wrap">
                    {(QUICK_REPLIES[activeRole] || []).map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(qr); setShowQuickReplies(false); inputRef.current?.focus(); }}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] rounded-full font-medium transition"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input bar */}
                <form
                  onSubmit={e => { e.preventDefault(); sendMessage(); }}
                  className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setShowQuickReplies(p => !p)}
                    className={`p-2 rounded-xl transition ${showQuickReplies ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
                    title="Quick replies"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message... (or use quick replies ↑)"
                    className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
