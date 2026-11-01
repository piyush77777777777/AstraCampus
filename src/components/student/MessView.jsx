import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { Utensils, Sparkles, TrendingUp, ShieldAlert, Star, Check, X, Calendar, Clock, DollarSign, Leaf } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MessView() {
  const { messData, toggleMealDecision, currentPersona } = useCampus();
  const { t } = useLanguage();
  const annapurna = messData.annapurnaMess;

  const [selectedDay, setSelectedDay] = useState('Tuesday');
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMenu = annapurna.weeklyMenu[selectedDay] || annapurna.weeklyMenu.Tuesday;

  const handleDecision = (decision) => {
    toggleMealDecision(decision);
    if (decision === 'OPT_OUT') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <Utensils className="w-3.5 h-3.5" />
            <span>Annapurna Central Hostel Mess | Aryabhatta Hall</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('mess.title')}
          </h2>
          <p className="text-sm text-emerald-100/90 mt-2 leading-relaxed">
            {t('mess.subtitle')}
          </p>
        </div>
      </div>

      {/* Eating Tonight? Commitment Poll & Waste Prevention Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" /> Food Waste Prevention Engine
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {t('mess.eatingTonight')}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Poll cut-off: <strong>{annapurna.pollCutoffTime} Today</strong></span>
            </div>
          </div>

          <div className="py-6">
            <p className="text-xs text-slate-600 mb-4">
              Hostel kitchens waste up to 35% of cooked food due to unannounced student outings. By confirming your meal status 3 hours prior, the kitchen prepares exact portions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDecision('OPT_IN')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                  annapurna.userMealDecision === 'OPT_IN'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    🍽️
                  </div>
                  {annapurna.userMealDecision === 'OPT_IN' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                      CONFIRMED
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-slate-900">{t('mess.optIn')}</div>
                <div className="text-xs text-slate-500 mt-1">Reserve my dinner plate and meal token</div>
              </button>

              <button
                onClick={() => handleDecision('OPT_OUT')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                  annapurna.userMealDecision === 'OPT_OUT'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🌱
                  </div>
                  {annapurna.userMealDecision === 'OPT_OUT' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-600 text-white">
                      SKIPPED (SAVED)
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-slate-900">{t('mess.optOut')}</div>
                <div className="text-xs text-slate-500 mt-1">Eating outside / Don't cook for me</div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600">
              {annapurna.userMealDecision === 'OPT_IN' ? t('mess.optInConfirmed') : t('mess.optOutConfirmed')}
            </span>
            <span className="text-[11px] font-bold text-emerald-700">Live Sync Active</span>
          </div>
        </div>

        {/* Live Supervisor Demand Stats */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t('mess.metrics')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="space-y-4 my-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">{t('mess.totalStudents')}</span>
                <span className="text-base font-extrabold">{annapurna.totalHostelStrength}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300">{t('mess.attendingDinner')}</span>
                <span className="text-base font-extrabold text-emerald-400">{annapurna.optedInDinner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300">{t('mess.skippingDinner')}</span>
                <span className="text-base font-extrabold text-amber-400">{annapurna.optedOutDinner}</span>
              </div>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-300">{t('mess.foodSaved')}</span>
                <span className="text-lg font-black text-emerald-300">~{annapurna.estimatedFoodSavedKg} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">{t('mess.moneySaved')}</span>
                <span className="text-lg font-black text-amber-300">₹{annapurna.estimatedCostSavedInr}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            Mess supervisor raw material procurement adjusted dynamically according to headcount.
          </div>
        </div>
      </div>

      {/* Dynamic Mess Menu Calendar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Verified Weekly Mess Menu
            </h3>
            <p className="text-xs text-slate-500">
              Approved by CIT Student Mess Committee & Nutrition Cell
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Daily Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center justify-between">
              <span>{t('mess.breakfast')}</span>
              <span className="text-[10px] text-amber-600 font-medium">07:30 - 09:15</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-2">
              {dayMenu.breakfast}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center justify-between">
              <span>{t('mess.lunch')}</span>
              <span className="text-[10px] text-emerald-600 font-medium">12:30 - 14:15</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-2">
              {dayMenu.lunch}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center justify-between">
              <span>{t('mess.evening')}</span>
              <span className="text-[10px] text-blue-600 font-medium">17:00 - 18:00</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-2">
              {dayMenu.evening}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-1 flex items-center justify-between">
              <span>{t('mess.dinner')}</span>
              <span className="text-[10px] text-purple-600 font-medium">20:00 - 21:45</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-2">
              {dayMenu.dinner}
            </div>
          </div>
        </div>
      </div>

      {/* Food Quality Feedback Box */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Daily Food Quality Rating & Accountability
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Ratings are audited weekly by the Hostel Warden to ensure mess contractor adherence to hygiene and taste standards.
        </p>

        {feedbackSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Thank you for your rating! Feedback submitted anonymously to the Mess Warden Committee.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Rate Today's Meal:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 ml-1">({rating} / 5 Stars)</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Optional remark: e.g. Dalma was authentic and hot, but chapati was slightly hard..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
