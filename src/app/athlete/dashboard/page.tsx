'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ActivityCard } from '../../components/ActivityCard';
import Greeting from '../../components/Greeting';
import Loading from '../../components/Loading';
import { Activity } from '@/types';
import { formatDate } from '../../../lib/dateUtil';
import Authorization from '../../components/Authorization';
import { FcCalendar } from "react-icons/fc";
import MonthYearPicker from '../../components/MonthYearPicker';
import { useDataFilter } from '../../context/DataFilterContext';

export default function ActivitiesPage() {
  const { ref, inView } = useInView();
  const { selectedMonth, selectedYear } = useDataFilter();
  const [visibility, setVisibility] = useState('everyone');

  const currentDate = new Date();
  const fetchActivities = async ({ pageParam = 1 }: { pageParam?: number }) : Promise<Activity[]> => {
    const queryParams = new URLSearchParams();
    if (selectedYear !== null) queryParams.append("year", String(selectedYear));
    if (selectedMonth !== null) queryParams.append("month", String(selectedMonth + 1).padStart(2, '0'));
    queryParams.append("visibility", visibility);
    queryParams.append("page", String(pageParam));

    const response = await fetch(`/api/run/activities?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    const data = await response.json();
    return data.activities; 
  };


  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['activities', selectedMonth, selectedYear, visibility],
    queryFn: fetchActivities,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 5 ? undefined : allPages.length + 1;
    },
  });

  useEffect(() => {
    refetch();
  }, [selectedMonth, selectedYear, visibility, refetch]);

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
    <Authorization>
      {(user) => (
        <div className="mt-60 max-w-7xl mx-auto px-8 lg:px-8">
          <Greeting name={user.given_name ?? ""}/>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Filters Section */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <MonthYearPicker 
                minDate={new Date(2025, 0)} 
                maxDate={new Date(currentDate.getFullYear(), currentDate.getMonth())} 
              />

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
                <div key={date} className='pb-16'>
                  <h3 className="text-xl font-extrabold pb-4 flex gap-x-2 items-center">
                    <FcCalendar />
                    {formatDate(date)}
                  </h3>
                  <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2 overflow-hidden">
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
      )}
    </Authorization>
  );
}