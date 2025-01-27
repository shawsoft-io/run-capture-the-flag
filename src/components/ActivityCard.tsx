'use client';

import React from 'react';

interface Activity {
  id: string;
  athleteId: string;
  dateTimeLocal: string; // ISO string
  distance: number; // in meters
  duration: number; // in seconds
  city: string;
  country: string;
  map_url: string;
  fastest1KmTime: number; // in seconds
  fastest5KmTime: number; // in seconds
  pace: string; // formatted string
  activityPoints: number;
}

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="flex border-l-[12px] border-gray-700 bg-white shadow-md rounded-lg overflow-hidden">
      {/* Left Column: Picture */}
      <div className="w-1/3 flex items-center justify-center bg-gray-100">
        <img
          src={activity.map_url || "/logo.png"}
          alt={`${activity.city} Activity`}
          className={`object-cover ${!activity.map_url ? "invert p-10" : ""}`}
        />
      </div>

      {/* Right Column: Stats */}
      <div className="w-2/3 p-4">
      
        <h2 className="font-extrabold text-3xl">{(activity.distance / 1000).toFixed(2)}km</h2>
        <h3 className="text-xl font-semibold mb-2">
            {activity.city ? `${activity.city}, ${activity.country}` : "Treadmill"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {new Date(activity.dateTimeLocal).toLocaleString()}
        </p>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-800">

          



          <div className="font-semibold">Duration:</div>
          <div>
            {Math.floor(activity.duration / 60)}m {activity.duration % 60}s
          </div>



          <div className="font-semibold">Pace:</div>
          <div>{activity.pace}</div>

          <div className="font-semibold">Activity Points:</div>
          <div>{activity.activityPoints}</div>
        </div>
      </div>
    </div>
  );
};