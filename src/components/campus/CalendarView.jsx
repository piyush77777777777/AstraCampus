import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Zap, Sun } from 'lucide-react';

export default function CalendarView() {
  const { examCalendar } = useCampus();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventMap = {};
  (examCalendar || []).forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push(ev);
    }
  });

  const typeConfig = {
    exam:    { dot: 'bg-rose-500', badge: 'bg-rose-50 border-rose-200 text-rose-700', label: 'Exam', Icon: BookOpen },
    event:   { dot: 'bg-blue-500', badge: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Event', Icon: Zap },
    holiday: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Holiday', Icon: Sun }
  };

  const upcomingEvents = (examCalendar || [])
    .filter(ev => new Date(ev.date) >= new Date('2026-09-22'))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30 mb-3">
          <Calendar className="w-3.5 h-3.5" /><span>Academic Calendar & Events</span>
        </div>
        <h2 className="text-2xl font-black">Campus Calendar 2026</h2>
        <p className="text-xs text-blue-100/90 mt-1">Exam dates, college events, and holidays — all in one view</p>
        <div className="flex gap-5 mt-4">
          {Object.entries(typeConfig).map(([type, cfg]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span className="text-xs text-white/80">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <h3 className="font-black text-slate-900 text-lg">{monthNames[month]} {year}</h3>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const events = eventMap[day] || [];
              const isToday = day === 22 && month === 8;
              return (
                <div key={day} className={`min-h-[52px] p-1.5 rounded-xl border text-center transition-all ${
                  isToday ? 'bg-blue-600 border-blue-600 text-white' :
                  events.length > 0 ? 'bg-slate-50 border-slate-200 hover:border-blue-300' :
                  'border-transparent hover:bg-slate-50'
                }`}>
                  <div className={`text-xs font-bold mb-1 ${isToday ? 'text-white' : 'text-slate-700'}`}>{day}</div>
                  <div className="flex flex-col gap-0.5 items-center">
                    {events.slice(0, 2).map((ev, ei) => (
                      <div key={ei} className={`w-4 h-1.5 rounded-full ${typeConfig[ev.type]?.dot || 'bg-gray-400'}`} title={ev.title} />
                    ))}
                    {events.length > 2 && <div className="text-[8px] text-slate-500">+{events.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900">Upcoming Dates</h3>
          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => {
              const cfg = typeConfig[ev.type] || typeConfig.event;
              const Icon = cfg.Icon;
              return (
                <div key={i} className={`p-3 rounded-2xl border ${cfg.badge}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.dot} bg-opacity-20`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase opacity-70">{ev.type}</div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">{ev.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} • {ev.time}
                      </div>
                      {ev.venue && <div className="text-[10px] text-slate-400">{ev.venue}</div>}
                    </div>
                    {ev.urgent && <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded px-1.5 flex-shrink-0">URGENT</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
