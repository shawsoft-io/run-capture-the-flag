'use client';

import React, { useState, useEffect } from 'react';

export default function SyncButton({ athleteId } : {athleteId : number | undefined}) {
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Check if there's an in-progress sync for this athlete
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch(`/api/sync?athleteId=${athleteId}`);
        const data = await response.json();
        setIsSyncing(data.inProgress);
      } catch (error) {
        console.error('Error fetching sync status:', error);
      }
    };
    fetchSyncStatus();
  }, [athleteId]);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athleteId }),
      });
    } catch (error) {
      console.error('Error starting sync:', error);
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      className={`w-full px-4 py-2 rounded ${isSyncing ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-200'} border-2 border-black font-bold`}
    >
      {isSyncing ? 'Sync In Progress' : 'Sync'}
    </button>
  );
}
