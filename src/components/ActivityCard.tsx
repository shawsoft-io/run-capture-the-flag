'use client';

import { Activity } from '@/types';
import React from 'react';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="relative flex flex-col sm:flex-row bg-white overflow-hidden sm:h-[270px]">
      {/* User Info: Name and Photo */}
      <div className="absolute top-4 right-4 sm:bg-white bg-gray-100/50 rounded-lg p-2 flex items-center justify-between gap-x-2">
        <div className="text-left">
          <p className="font-semibold text-sm sm:text-base text-gray-800">{activity.user.given_name}</p>
        </div>
        <img
          src={activity.user.picture || "/placeholder-user.png"}
          alt={`${activity.user.given_name}'s photo`}
          className="w-16 h-16 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-300"
        />
      </div>

      {/* Left Column: Picture */}
      <div className="w-full sm:w-1/3 flex items-center justify-center bg-gray-100">
        <img
          src={activity.map_url || "/treadmill.png"}
          alt={`${activity.city} Activity`}
          className={`object-cover ${!activity.map_url ? "p-12" : "h-full w-full"}`}
        />
      </div>

      {/* Right Column: Stats */}
      <div className="w-full sm:w-2/3 p-4">
        <div className="flex items-end mb-2">
          <h2 className="font-extrabold text-4xl sm:text-5xl">{(activity.distance / 1000).toFixed(2)}</h2>
          <span className="text-sm sm:text-md self-end ml-2 text-gray-500">kilometers</span>
        </div>

        <h3 className="text-sm sm:text-md text-gray-700 mb-4">
          {activity.city ? `${activity.city}, ${activity.country}` : "Treadmill"}
        </h3>

        <div className="grid grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-6 text-left text-gray-800">
          {/* Duration */}
          <div>
            <div className="text-lg sm:text-2xl font-bold">
              {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
            </div>
            <div className="text-xs font-thin text-gray-600">Duration</div>
          </div>

          {/* Pace */}
          <div>
            <div className="text-lg sm:text-2xl font-bold">{activity.pace}</div>
            <div className="text-xs font-thin text-gray-600">Pace</div>
          </div>

          {/* Activity Points */}
          <div>
            <div className="text-lg sm:text-2xl font-bold">{activity.activity_points}</div>
            <div className="text-xs font-thin text-gray-600">Activity Points</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-tborder-[1px] border-gray-300 mt-8">
          {activity.claimed && (
            <div className="flex items-center gap-2">
              <img src="/medal.png" alt="City claimed" className="h-6 sm:h-8 w-auto" />
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                City Claimed
              </span>
            </div>
          )}
          {activity.fastest_monthly_5km && (
            <div className="flex items-center gap-2">
              <img src="/stop-watch.png" alt="Quickest Monthly 5km" className="h-6 sm:h-8 w-auto" />
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Quickest Monthly 5km
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};