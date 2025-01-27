'use client';

import { Activity } from '@/types';
import React from 'react';


interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="relative flex border-l-[12px] border-gray-700 bg-white shadow-md rounded-lg overflow-hidden h-[270px]">
      {/* User Info: Photo and Name */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 flex-col">
        <img
          src={activity.user.picture || "/placeholder-user.png"}
          alt={`${activity.user.given_name}'s photo`}
          className="w-16 h-16 rounded-full object-cover border-1 border-gray-600"
        />
        <div className="text-right">
          <p className="font-semibold text-sm">{activity.user.given_name}</p>
        </div>
      </div>

      {/* Left Column: Picture */}
      <div className="w-1/3 flex items-center justify-center relative bg-gray-100">
        <img
          src={activity.map_url || "/logo.png"}
          alt={`${activity.city} Activity`}
          className={`object-cover ${!activity.map_url ? "invert p-10 opacity-40" : "h-full w-full"}`}
        />
      </div>

      {/* Right Column: Stats */}
      <div className="w-2/3 p-4">
        <h2 className="font-extrabold text-5xl">{(activity.distance / 1000).toFixed(2)} km</h2>
        <h3 className="text-md font-semibold mb-2">
          {activity.city ? `${activity.city}, ${activity.country}` : "Treadmill"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {new Date(activity.date_time_local).toLocaleTimeString()}
        </p>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">
          <div className="font-semibold">Duration:</div>
          <div>
            {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
          </div>
          <div className="font-semibold">Pace:</div>
          <div>{activity.pace}</div>
          <div className="font-semibold">Activity Points:</div>
          <div>{activity.activity_points}</div>
        </div>
        <div className="flex gap-x-5 pt-4">
            {activity.claimed && 
                <div className='flex gap-x-2'>
                    <img src='/medal.png' alt='City claimed' className='h-8 w-auto '/>
                    <span className="inline-flex items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        City Claimed
                    </span>
                </div>
            }
            {activity.fastest_monthly_5km && 
                <div className='flex gap-x-2'>
                <img src='/stop-watch.png' alt='City claimed' className='h-8 w-auto'/>
                <span className="inline-flex items-center rounded-full bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Quickest Monthly 5km
                </span>
            </div>
            }
        </div>
      </div>
    </div>
  );
};