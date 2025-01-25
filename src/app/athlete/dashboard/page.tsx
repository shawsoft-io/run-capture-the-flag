'use client'
import { useEffect, useState } from 'react';
import { StravaActivity } from '../../../lib/strava';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/strava/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }

        const data: StravaActivity[] = await response.json();
        setActivities(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='mt-[400px]'>
      <h1>Last 5 Strava Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.name}</strong> - {(activity.distance / 1000).toFixed(2)} km (
            {(activity.moving_time / 60).toFixed(1)} minutes)
          </li>
        ))}
      </ul>
    </div>
  );
}