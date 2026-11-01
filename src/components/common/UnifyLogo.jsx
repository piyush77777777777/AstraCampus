import React from 'react';

/**
 * Modern Sovereign Stellar Logo for AstraCampus
 * Chilika Institution of Technology (CIT) Edition
 */
export default function UnifyLogo({ size = 'md', variant = 'dark', showText = true, className = '' }) {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-sm' }
  };

  const config = sizeMap[size] || sizeMap.md;
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Insignia Icon */}
      <div className={`relative ${config.icon} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-400 rounded-2xl blur-[6px] opacity-70 group-hover:opacity-100 transition-opacity" />
        
        {/* Core Insignia SVG with Astra Star & Shield */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md transform transition-transform hover:scale-105 duration-300"
        >
          <defs>
            <linearGradient id="astra-grad-shield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="astra-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="astra-grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="astra-grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="astra-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>

          {/* Shield Background Base */}
          <rect width="48" height="48" rx="14" fill="url(#astra-grad-shield)" stroke="#334155" strokeWidth="1.5" />
          
          {/* Inner Hex Prism Nodes */}
          <path
            d="M24 8L36 15V29L24 36L12 29V15L24 8Z"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            fill="none"
          />

          {/* Astra Star Apex */}
          <polygon
            points="24,10 27,19 36,19 29,24 32,33 24,28 16,33 19,24 12,19 21,19"
            fill="url(#astra-grad-amber)"
            opacity="0.95"
          />

          {/* Center Nexus Core Diamond */}
          <polygon
            points="24,20 28,24 24,28 20,24"
            fill="#FFFFFF"
            className="animate-pulse"
          />
          <polygon
            points="24,21 26,24 24,27 22,24"
            fill="url(#astra-grad-cyan)"
          />

          {/* Orbit Nodes */}
          <circle cx="24" cy="40" r="2.5" fill="#38BDF8" />
          <circle cx="15" cy="38" r="1.5" fill="#FBBF24" opacity="0.8" />
          <circle cx="33" cy="38" r="1.5" fill="#34D399" opacity="0.8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${config.text} ${
                isLight ? 'text-white' : 'text-slate-900'
              }`}
            >
              AstraCampus
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white text-[9px] font-black tracking-widest uppercase shadow-xs">
              CIT
            </span>
          </div>
          <span
            className={`font-semibold tracking-wider uppercase ${config.sub} ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Chilika Institution of Technology
          </span>
        </div>
      )}
    </div>
  );
}
