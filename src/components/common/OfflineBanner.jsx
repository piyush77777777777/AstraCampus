import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useLanguage } from '../../context/LanguageContext';
import { WifiOff, SignalLow, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineBanner() {
  const { networkMode, setNetworkMode, isOffline, isSlow2g, offlineQueue } = useNetwork();
  const { t } = useLanguage();

  if (networkMode === 'online' && offlineQueue.length === 0) {
    return null;
  }

  return (
    <div className={`py-2 px-4 border-b text-xs flex flex-wrap items-center justify-between transition-all ${
      isOffline
        ? 'bg-rose-50 text-rose-800 border-rose-200'
        : isSlow2g
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }`}>
      <div className="flex items-center gap-2 max-w-2xl">
        {isOffline ? (
          <WifiOff className="w-4 h-4 text-rose-600 flex-shrink-0 animate-pulse" />
        ) : isSlow2g ? (
          <SignalLow className="w-4 h-4 text-amber-600 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        )}
        <span>
          <strong>
            {isOffline ? 'Offline Mode Active:' : isSlow2g ? 'Low-Bandwidth Mode Active:' : 'Online:'}
          </strong>{' '}
          {isOffline
            ? 'Running locally via IndexedDB cache. You can still file complaints, request gate passes, and mark meal choices without losing data.'
            : 'Simulating slow 2G hostel network. High-res images and heavy scripts are automatically compressed for zero data lag.'}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        {offlineQueue.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-xs">
            {offlineQueue.length} {t('network.syncPending')}
          </span>
        )}

        {isOffline && (
          <button
            onClick={() => setNetworkMode('online')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all shadow-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Simulate Reconnecting (Sync)</span>
          </button>
        )}
      </div>
    </div>
  );
}
