import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, Filter, Plus, CheckCircle2, Users, Send, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NoticeBoard() {
  const { notices, acknowledgeNotice, publishNotice, currentPersona, activeRole } = useCampus();
  const { t } = useLanguage();

  const [filterTarget, setFilterTarget] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New notice form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [priority, setPriority] = useState('NORMAL');
  const [targetYear, setTargetYear] = useState('All');
  const [targetBranch, setTargetBranch] = useState('All');
  const [targetHostel, setTargetHostel] = useState('Aryabhatta Hall of Residence');
  const [actionRequired, setActionRequired] = useState(false);
  const [actionLabel, setActionLabel] = useState('Acknowledge Notice');

  const filteredNotices = notices.filter(n => {
    if (filterTarget === 'All') return true;
    if (filterTarget === 'Hostel') return n.category === 'Hostel';
    if (filterTarget === 'Academic') return n.category === 'Academic';
    if (filterTarget === 'Placement') return n.category === 'Placement';
    return true;
  });

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    publishNotice({
      title,
      content,
      category,
      priority,
      targetYear,
      targetBranch,
      targetHostel,
      actionRequired,
      actionLabel,
      estimatedAudience: targetHostel === 'All' ? 1200 : 420
    });

    confetti({ particleCount: 50, spread: 60 });
    setCreateModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>Targeted Institutional Communication Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Targeted Campus Broadcasts
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
            Replaces chaotic 2 AM WhatsApp groups with verified, role-filtered announcements. Features verified read-receipts and compliance acknowledgment tracking.
          </p>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Create Broadcast Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Hostel', 'Academic', 'Placement'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTarget(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTarget === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} Notices
            </button>
          ))}
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Targeted Notice</span>
        </button>
      </div>

      {/* Notice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotices.map((notice) => {
          const readPercentage = Math.round((notice.readCount / notice.totalTargetAudience) * 100);
          const ackPercentage = notice.actionRequired
            ? Math.round((notice.acknowledgedCount / notice.totalTargetAudience) * 100)
            : null;

          return (
            <div
              key={notice.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      notice.priority === 'HIGH'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {notice.category} • {notice.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {notice.publishedDate}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {notice.id}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {notice.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {notice.content}
                </p>

                {/* Target Audience Pill */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 mb-4 flex flex-wrap gap-2 items-center">
                  <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Target:</span>
                  <span className="font-bold text-slate-800">{notice.targets.hostel}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">{notice.targets.year}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-800">{notice.targets.branch}</span>
                </div>
              </div>

              {/* Delivery & Read Receipts Meter */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Verified Delivery: <strong>{notice.readCount}/{notice.totalTargetAudience} Students ({readPercentage}%)</strong></span>
                  {ackPercentage !== null && (
                    <span className="font-bold text-emerald-700">{ackPercentage}% Acknowledged</span>
                  )}
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${readPercentage}%` }}
                  ></div>
                </div>

                {/* Action Acknowledgment Button */}
                {notice.actionRequired && (
                  <div className="pt-2">
                    {notice.hasUserAcknowledged ? (
                      <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Acknowledged by you (Compliance recorded)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => acknowledgeNotice(notice.id)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        {notice.actionLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Notice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Compose Targeted Department Broadcast
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Campus Electrical Substation Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Hostel">Hostel & Amenities</option>
                    <option value="Academic">Academic & Exams</option>
                    <option value="Placement">Training & Placement</option>
                    <option value="Mess">Mess Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Urgent / High Priority</option>
                  </select>
                </div>
              </div>

              {/* Targeting filters */}
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 block">Precision Audience Targeting:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Target Hostel</label>
                    <select
                      value={targetHostel}
                      onChange={(e) => setTargetHostel(e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Aryabhatta Hall of Residence">Aryabhatta Hall</option>
                      <option value="Kalpana Chawla Hall">Kalpana Chawla Hall</option>
                      <option value="All">All Hostels (Entire Campus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">Academic Year</label>
                    <select
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="All">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Type official details clearly..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actionReq"
                  checked={actionRequired}
                  onChange={(e) => setActionRequired(e.target.checked)}
                  className="text-blue-600"
                />
                <label htmlFor="actionReq" className="font-medium text-slate-700 cursor-pointer">
                  Require students to click "Acknowledge" (Track compliance)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
