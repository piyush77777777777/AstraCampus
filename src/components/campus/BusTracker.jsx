import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { Activity, Users } from 'lucide-react';

export default function BusTracker() {
  const { busRoutes } = useCampus();
  const [selectedBus, setSelectedBus] = useState('B1');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const routes = busRoutes || [
    { id: 'B1', name: 'Campus Circular', color: '#3b82f6', stops: ['Main Gate', 'Academic Block', 'Library', 'Hostel A', 'Hostel B', 'Mess', 'Main Gate'], currentStop: 2, nextArrival: '3', capacity: 42, occupancy: 28, driver: 'Santosh Kumar' },
    { id: 'B2', name: 'City Express', color: '#10b981', stops: ['Main Gate', 'Rourkela Station', 'City Market', 'Hospital', 'Main Gate'], currentStop: 1, nextArrival: '12', capacity: 54, occupancy: 41, driver: 'Ravi Das' },
    { id: 'B3', name: 'Lab Shuttle', color: '#f59e0b', stops: ['Hostel A', 'Hostel B', 'Research Lab', 'Canteen', 'Hostel A'], currentStop: 0, nextArrival: '7', capacity: 30, occupancy: 12, driver: 'Birju Singh' }
  ];

  const active = routes.find(r => r.id === selectedBus) || routes[0];
  const occupancyPct = Math.round((active.occupancy / active.capacity) * 100);
  const getETA = (base) => Math.max(1, parseInt(base) - Math.floor(tick / 10));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-500/30 mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" /><span>Live GPS Bus Tracker</span>
          </div>
          <h2 className="text-2xl font-black">Campus Transport System</h2>
          <p className="text-xs text-emerald-100/90 mt-1">Real-time bus locations • Arrival alerts • Route maps</p>
          <div className="flex flex-wrap gap-3 mt-5">
            {routes.map(r => (
              <button key={r.id} onClick={() => setSelectedBus(r.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedBus === r.id ? 'bg-white text-slate-900 border-white shadow-md' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                {r.id}: {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">{active.id}: {active.name} — Live Route</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />LIVE
            </div>
          </div>

          <div className="relative py-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 rounded-full -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 transition-all duration-1000"
                style={{ backgroundColor: active.color, width: `${(active.currentStop / (active.stops.length - 1)) * 100}%` }} />
              {active.stops.map((stop, i) => {
                const isPassed = i < active.currentStop;
                const isCurrent = i === active.currentStop;
                return (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2" style={{ flex: i < active.stops.length - 1 ? 1 : '0 0 auto' }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isCurrent ? 'scale-150' : ''}`}
                      style={isCurrent || isPassed ? { backgroundColor: active.color, borderColor: active.color } : { backgroundColor: 'white', borderColor: '#cbd5e1' }}>
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                    </div>
                    <div className={`text-[9px] font-bold text-center w-14 leading-tight ${isCurrent ? 'text-slate-900' : isPassed ? 'text-slate-400' : 'text-slate-500'}`}>{stop}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900">
                Bus {active.id} arriving at Main Gate in <span className="text-emerald-600">{getETA(active.nextArrival)} min</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Currently at: {active.stops[active.currentStop]} • Driver: {active.driver}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900">Bus Status</h4>
            {[
              ['Bus Number', active.id],
              ['Route', active.name],
              ['Driver', active.driver],
              ['Next Arrival', `${getETA(active.nextArrival)} min`]
            ].map(([label, value], i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`font-bold text-sm ${label === 'Next Arrival' ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</span>
              </div>
            ))}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><Users className="w-3 h-3" /> Occupancy</span>
                <span className={`font-bold ${occupancyPct > 85 ? 'text-rose-700' : occupancyPct > 60 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {active.occupancy}/{active.capacity}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className={`h-2 rounded-full transition-all ${occupancyPct > 85 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${occupancyPct}%` }} />
              </div>
              <div className="text-[10px] text-slate-400 text-right">{occupancyPct}% full • {active.capacity - active.occupancy} seats available</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900">All Routes</h4>
            {routes.map(r => (
              <button key={r.id} onClick={() => setSelectedBus(r.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${selectedBus === r.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: r.color }}>
                  {r.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.stops.length - 1} stops • ETA {r.nextArrival} min</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
