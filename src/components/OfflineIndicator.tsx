import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { CloudDataService } from '../services/CloudDataService';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<{
    lastSync: Date | null;
    pendingUploads: number;
    pendingDownloads: number;
    isOnline: boolean;
    syncInProgress: boolean;
  }>({
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    isOnline: navigator.onLine,
    syncInProgress: false
  });

  const cloudService = CloudDataService.getInstance();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = cloudService.subscribe(status => {
      setSyncStatus(status);
    });

    // Initial status
    setSyncStatus(cloudService.getSyncStatus());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  if (isOnline && !syncStatus.pendingUploads) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg ${
      isOnline ? 'bg-blue-900' : 'bg-red-900'
    } bg-opacity-90 p-3 text-white`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <Wifi size={20} className="text-blue-300" />
            <div>
              <div className="font-medium">Online</div>
              {syncStatus.pendingUploads > 0 && (
                <div className="text-xs text-blue-300">
                  {syncStatus.syncInProgress 
                    ? 'Syncing data...' 
                    : `${syncStatus.pendingUploads} items pending sync`}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <WifiOff size={20} className="text-red-300" />
            <div>
              <div className="font-medium">Offline Mode</div>
              <div className="text-xs text-red-300">
                Changes will sync when online
              </div>
            </div>
          </>
        )}
      </div>

      {!isOnline && (
        <div className="mt-2 text-xs text-red-200">
          <div className="flex items-center">
            <div className="w-full bg-red-700 rounded-full h-1.5">
              <div className="bg-red-300 h-1.5 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-1">Waiting for connection...</div>
        </div>
      )}

      {isOnline && syncStatus.pendingUploads > 0 && (
        <button
          onClick={() => cloudService.syncWithCloud()}
          className="mt-2 w-full text-xs bg-blue-700 hover:bg-blue-800 py-1 px-2 rounded"
        >
          Sync Now
        </button>
      )}
    </div>
  );
};