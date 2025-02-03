'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ActivityCard } from '../../../components/ActivityCard';
import Greeting from '../../../components/Greeting';
import Loading from '../../../components/Loading';
import { Activity } from '@/types';
import { formatDate } from '../../../lib/dateUtil'
import Authorize from '../../../components/Authorization'


export default function ActivitiesPage() {
  const { ref, inView } = useInView();

  const [month, setMonth] = useState('');
  const [visibility, setVisibility] = useState('everyone');

  const fetchActivities = async ({ pageParam = 1 }: { pageParam?: number }) : Promise<Activity[]> => {
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

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.date_time_local).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <Authorize>
      {(user) =>
    <div className="mt-60 max-w-7xl mx-auto px-4 lg:px-8">
        <Greeting name={user.given_name ?? ""}/>
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
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border-gray-900'
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
          
          {Object.entries(groupedActivities).map(([date, activities]) => (
           <div key={date} className='pb-10'>

           <h3 className="text-2xl font-bold">{formatDate(date)}</h3>
           <div className="bg-white shadow-sm ring-1 ring-gray-900/5  rounded-xl md:col-span-2 overflow-hidden">
             {activities.map((activity, index) => (
               <div
                 key={activity.id}
                 className={`border-gray-200 ${
                   index < activities.length - 1 ? 'border-b border-gray-200' : ''
                 }`}
               >
                 <ActivityCard activity={activity} />
               </div>
             ))}
           </div>
         </div>
          ))}

          {/* Infinite Scroll Trigger */}
          <div ref={ref} className="h-10"></div>
          {isFetchingNextPage && <Loading/>}
        </div>
      </div>
    </div>  
  }

    </Authorize>
  );
}