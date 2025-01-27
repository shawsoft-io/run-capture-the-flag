'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ActivityCard } from '../../../components/ActivityCard';
import Loading from '../../../components/Loading';

interface Activity {
  id: string;
  athleteId: string;
  dateTimeLocal: string;
  distance: number;
  duration: number;
  city: string;
  country: string;
  map_url: string;
  fastest1KmTime: number;
  fastest5KmTime: number;
  pace: string;
  activityPoints: number;
}

export default function ActivitiesPage() {
  const { ref, inView } = useInView();

  const [month, setMonth] = useState('');
  const [visibility, setVisibility] = useState('everyone');

  const fetchActivities = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await fetch(
      `/api/run/activities?month=${month}&visibility=${visibility}&page=${pageParam}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    const data = await response.json();
    return data.activities; // Return the `activities` array directly
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['activities', month, visibility],
    queryFn: fetchActivities,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 5 ? undefined : allPages.length + 1;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'pending') {
    return <Loading />;
  }

  if (status === 'error') {
    return <p>Error: {(error as Error).message}</p>;
  }

  const activities = data?.pages.flat() || [];

  return (
    <div className="mt-[300px] max-w-7xl mx-auto px-4 lg:px-8">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold">Filters</h2>
         
         
          {/* Month Filter */}
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => {
                const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                const currentYear = new Date().getFullYear();
                const monthValue = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
                return (
                  <option key={monthValue} value={monthValue}>
                    {monthName} {currentYear}
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setVisibility('everyone')}
              className={`w-1/2 px-4 py-2 border ${
                visibility === 'everyone'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-700 border-gray-300'
              } rounded-l-md`}
            >
              Everyone
            </button>
            <button
              onClick={() => setVisibility('me')}
              className={`w-1/2 px-4 py-2 border ${
                visibility === 'me'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-700 border-gray-300'
              } rounded-r-md`}
            >
              Me
            </button>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="lg:col-span-3 space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}

          {/* Infinite Scroll Trigger */}
          <div ref={ref} className="h-10"></div>
          {isFetchingNextPage && <h3>Loading...</h3>}
        </div>
      </div>
    </div>
  );
}