import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNetwork } from '../../context/NetworkContext';
import {
  Building2,
  Wifi,
  WifiOff,
  Globe,
  UserCheck,
  Shield,
  Utensils,
  GraduationCap,
  Bell,
  Smartphone,
  BookOpen,
  Menu,
  X,
  Radio,
  FileCheck2,
  Presentation
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { activeRole, setActiveRole, currentPersona, initialPersonas, notices } = useCampus();
  const { currentLang, setCurrentLang, t } = useLanguage();
  const { networkMode, setNetworkMode, isOffline, offlineQueue } = useNetwork();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unacknowledged notice count
  const unreadNoticesCount = notices.filter(n => !n.hasUserAcknowledged && n.actionRequired).length;

  const roleOptions = [
    { key: 'student', label: t('roles.student'), name: initialPersonas.student.name, icon: GraduationCap, color: 'bg-blue-600' },
    { key: 'warden', label: t('roles.warden'), name: initialPersonas.warden.name, icon: Building2, color: 'bg-indigo-600' },
    { key: 'guard', label: t('roles.guard'), name: initialPersonas.guard.name, icon: Shield, color: 'bg-amber-600' },
    { key: 'messManager', label: t('roles.messManager'), name: initialPersonas.messManager.name, icon: Utensils, color: 'bg-emerald-600' }
  ];

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'gatePass', label: t('nav.gatePass') },
    { id: 'complaints', label: t('nav.complaints') },
    { id: 'documents', label: t('nav.documents') },
    { id: 'mess', label: t('nav.mess') },
    { id: 'notices', label: t('nav.notices'), badge: unreadNoticesCount },
    { id: 'admin', label: t('nav.analytics') },
    { id: 'pitchDeck', label: 'Deck & PPTX (BUG FINDERS)', icon: Presentation, special: true },
    { id: 'ussdDemo', label: 'Feature Phone (*789#)', icon: Smartphone, highlight: true },
    { id: 'adoptionNote', label: 'Adoption Blueprint', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      {/* Top Banner for Hackathon Context */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            CHILIKA INSTITUTION OF TECHNOLOGY (CIT)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium">AstraCampus: Scheduling & Venue Management Portal</span>
        </div>

        {/* Network Mode Switcher Simulation */}
        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Network Simulator:</span>
            <select
              value={networkMode}
              onChange={(e) => setNetworkMode(e.target.value)}
              aria-label="Simulate network conditions"
              className={`rounded px-2 py-0.5 text-xs font-semibold border transition-all cursor-pointer ${
                networkMode === 'online'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : networkMode === 'slow2g'
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
              }`}
            >
              <option value="online">🟢 High-Speed Fiber</option>
              <option value="slow2g">🟡 2G Patchy Hostel Wi-Fi</option>
              <option value="offline">🔴 Offline Mode</option>
            </select>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
            <Globe className="w-3 h-3 text-slate-400" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              aria-label="Select application language"
              className="bg-transparent text-xs text-white border-none focus:outline-none cursor-pointer font-medium"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="or" className="bg-slate-900 text-white">ଓଡ଼ିଆ (Odia)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
                  AstraCampus
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  CIT Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-none">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : item.special
                      ? 'text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 font-bold'
                      : item.highlight
                      ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Persona Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 p-1.5 pl-3 rounded-full border border-slate-200 transition-all cursor-pointer">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentPersona.name}
                  </div>
                  <div className="text-[10px] text-slate-500 capitalize">
                    {t(`roles.${activeRole}`)}
                  </div>
                </div>
                <img
                  src={currentPersona.avatar}
                  alt={currentPersona.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
                />
              </div>

              {/* Persona Selector Dropdown */}
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </p>
                  <p className="text-xs text-slate-500">
                    Evaluate both sides of the counter instantly
                  </p>
                </div>
                <div className="p-1">
                  {roleOptions.map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = activeRole === role.key;
                    return (
                      <button
                        key={role.key}
                        onClick={() => {
                          setActiveRole(role.key);
                          if (role.key === 'guard') setActiveTab('gatePass');
                          else if (role.key === 'messManager') setActiveTab('mess');
                          else if (role.key === 'warden') setActiveTab('admin');
                          else setActiveTab('dashboard');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${role.color} text-white flex items-center justify-center flex-shrink-0`}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{role.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{role.label}</div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
