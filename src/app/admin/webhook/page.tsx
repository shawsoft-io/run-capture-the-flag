"use client"
import React, { useEffect, useState } from 'react';
import Loading from '../../../components/Loading';

export default function StravaSubscriptionStatus() {
  const [status, setStatus] = useState<StravaSubscription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface StravaSubscription {
    id: number;
    application_id: number;
    callback_url: string;
    created_at: string;
    updated_at: string;
  }

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await fetch('/api/strava/webhook-status');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription status');
        }
        const data: StravaSubscription[] = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Strava Subscription Status</h1>
        {loading ? (
          <Loading/>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          
<div className="space-y-4">
            {status && status.length > 0 ? (
              <div>
                <p className="text-green-600 text-center mb-4">You have the following active subscriptions:</p>
                <ul className="space-y-2">
                  {status.map((sub) => (
                    <li key={sub.id} className="border p-4 rounded shadow-sm">
                      <p><strong>ID:</strong> {sub.id}</p>
                      <p><strong>Application ID:</strong> {sub.application_id}</p>
                      <p><strong>Callback URL:</strong> {sub.callback_url}</p>
                      <p><strong>Created At:</strong> {new Date(sub.created_at).toLocaleString()}</p>
                      <p><strong>Updated At:</strong> {new Date(sub.updated_at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-red-600 text-center">No active subscription found.</p>
            )}
          </div>
       

        )}
      </div>
    </div>
  );
}