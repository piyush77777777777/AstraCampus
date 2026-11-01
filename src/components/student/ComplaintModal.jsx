import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Wrench, Sparkles, Camera, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ComplaintModal({ isOpen, onClose }) {
  const { createComplaint, currentPersona } = useCampus();
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [location, setLocation] = useState(
    currentPersona?.hostel ? `${currentPersona.hostel} - Room ${currentPersona.room || 'B-304'}` : 'Aryabhatta Hall of Residence - Room B-304'
  );
  const [urgency, setUrgency] = useState('HIGH');
  const [photoUrl, setPhotoUrl] = useState('');
  const [aiTag, setAiTag] = useState(null);

  useEffect(() => {
    // Smart AI Auto-Categorization simulation
    const combined = (title + ' ' + description).toLowerCase();
    if (combined.includes('tap') || combined.includes('leak') || combined.includes('water') || combined.includes('flush')) {
      setCategory('Plumbing');
      setAiTag({ dept: 'Plumbing Dept', urgency: 'HIGH', sla: '12 Hours (SLA Alert)' });
    } else if (combined.includes('fan') || combined.includes('spark') || combined.includes('light') || combined.includes('switch')) {
      setCategory('Electrical');
      setAiTag({ dept: 'Electrical Maintenance', urgency: 'HIGH', sla: '6 Hours (Safety Alert)' });
    } else if (combined.includes('wifi') || combined.includes('wi-fi') || combined.includes('net') || combined.includes('router')) {
      setCategory('Wi-Fi & IT');
      setAiTag({ dept: 'IT & Campus Network', urgency: 'MEDIUM', sla: '24 Hours' });
    } else if (combined.includes('bed') || combined.includes('table') || combined.includes('chair') || combined.includes('door')) {
      setCategory('Carpentry');
      setAiTag({ dept: 'Estate & Carpentry', urgency: 'LOW', sla: '48 Hours' });
    } else {
      setAiTag(null);
    }
  }, [title, description]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createComplaint({
      title,
      description,
      category,
      location,
      urgency,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
    });

    confetti({ particleCount: 40, spread: 60 });
    onClose();
  };

  // Quick preset templates for rapid testing during hackathon demo
  const applyPreset = (presetTitle, presetDesc, presetCat, presetImg) => {
    setTitle(presetTitle);
    setDescription(presetDesc);
    setCategory(presetCat);
    setPhotoUrl(presetImg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wrench className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t('complaints.fileTicketBtn')}
              </h3>
              <p className="text-xs text-blue-200">
                {t('complaints.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Issue Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Issue Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(
                  'Washroom flush pipe leaking continuously',
                  'Water overflowing onto corridor tiles since morning. Needs replacement of inlet valve.',
                  'Plumbing',
                  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
                )}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition-all"
              >
                🚰 Tap / Pipe Leak
              </button>
              <button
                type="button"
                onClick={() => applyPreset(
                  '3rd Floor Wi-Fi AP drops packet constantly',
                  'Signal strength 90% but ping packet loss 80%. Unable to attend CIT online lab.',
                  'Wi-Fi & IT',
                  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&auto=format&fit=crop&q=80'
                )}
                className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 border border-purple-200 transition-all"
              >
                📶 Wi-Fi Packet Loss
              </button>
              <button
                type="button"
                onClick={() => applyPreset(
                  'Study table drawer lock stuck',
                  'Drawer cannot open. Contains essential exam Hall Ticket and calculators.',
                  'Carpentry',
                  'https://images.unsplash.com/photo-1581404476143-fb31d742929f?w=400&auto=format&fit=crop&q=80'
                )}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-all"
              >
                🪑 Furniture Issue
              </button>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Washroom Tap leaking or corridor light broken"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* AI Detection Banner */}
          {aiTag && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                <span>
                  <strong>AI Smart Router:</strong> Auto-dispatching to <strong>{aiTag.dept}</strong>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
                SLA: {aiTag.sla}
              </span>
            </div>
          )}

          {/* Category & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('complaints.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Plumbing">Plumbing & Water</option>
                <option value="Electrical">Electrical & Fans</option>
                <option value="Wi-Fi & IT">Wi-Fi & Internet</option>
                <option value="Carpentry">Carpentry & Furniture</option>
                <option value="Hygiene">Hygiene & Washrooms</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('complaints.urgency')}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="HIGH">High (Immediate Action)</option>
                <option value="MEDIUM">Medium (Within 24 Hours)</option>
                <option value="LOW">Low (Routine Upkeep)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('complaints.location')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what is broken, how long it has been faulty, and any immediate hazard..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Photo Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{t('complaints.photoProof')}</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80')}
                className="px-3 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                <span>{photoUrl ? 'Photo Attached ✓' : 'Simulate Camera Photo'}</span>
              </button>
              {photoUrl && (
                <div className="flex items-center gap-2">
                  <img src={photoUrl} alt="Issue preview" className="w-8 h-8 rounded-lg object-cover border border-slate-300" />
                  <span className="text-[11px] text-emerald-600 font-medium">water_leak_proof.jpg</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              File Maintenance Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
