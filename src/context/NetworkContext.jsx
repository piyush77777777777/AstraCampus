import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  // 'online' | 'slow2g' | 'offline'
  const [networkMode, setNetworkMode] = useState(() => {
    return localStorage.getItem('UNIFY_net_mode') || 'online';
  });

  const [offlineQueue, setOfflineQueue] = useState(() => {
    const saved = localStorage.getItem('UNIFY_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncToast, setSyncToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('UNIFY_net_mode', networkMode);
  }, [networkMode]);

  useEffect(() => {
    localStorage.setItem('UNIFY_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const addToOfflineQueue = (item) => {
    const queueItem = {
      ...item,
      queueId: 'SYNC-' + Math.random().toString(36).substr(2, 9),
      queuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setOfflineQueue(prev => [...prev, queueItem]);
    return queueItem;
  };

  const removeQueueItem = (queueId) => {
    setOfflineQueue(prev => prev.filter(i => i.queueId !== queueId));
  };

  const clearQueue = () => {
    setOfflineQueue([]);
  };

  // Helper to trigger a toast
  const showToast = (message, type = 'info') => {
    setSyncToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setSyncToast(null);
    }, 4000);
  };

  const isOffline = networkMode === 'offline';
  const isSlow2g = networkMode === 'slow2g';

  return (
    <NetworkContext.Provider value={{
      networkMode,
      setNetworkMode,
      isOffline,
      isSlow2g,
      offlineQueue,
      addToOfflineQueue,
      removeQueueItem,
      clearQueue,
      syncToast,
      showToast
    }}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
