import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { syncToast } = useNetwork();

  if (!syncToast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900',
    info: 'border-blue-200 bg-blue-50/95 text-blue-900'
  };

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-in shadow-xl rounded-2xl overflow-hidden pointer-events-auto"
    >
      <div className={`p-4 border backdrop-blur-md flex items-start gap-3 ${borders[syncToast.type] || borders.info}`}>
        {icons[syncToast.type] || icons.info}
        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {syncToast.message}
        </div>
      </div>
    </aside>
  );
}
