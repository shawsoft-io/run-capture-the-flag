'use client';

import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';
import Avatar from '../../../components/Avatar';
import Authorization from '../../../components/Authorization';

interface Athlete {
  athleteId: string;
  name: string;
  picture: string;
  totalDistance: number;
  totalDuration: number;
  totalActivities: number;
  activityPoints: number;
  cityPoints: number;
  pacePoints: number;
  totalPoints: number;
}

export default function LeagueTablePage() {
  const fetchAthletes = async () => {
    const response = await fetch('/api/ranking');
    if (!response.ok) {
      throw new Error('Failed to fetch athlete data');
    }
    return response.json();
  };

  const { data, status, error } = useQuery({
    queryKey: ['leagueTable'],
    queryFn: fetchAthletes,
  });

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <Authorization>
      {() => (
    <div className="max-w-7xl mx-auto mt-48 sm:mt-52 sm:mb-10">
     

      <div className="overflow-x-auto shadow-lg rounded-lg">
      
    
      <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              #
            </th>
            <th scope="col" className="px-3 py-3.5 text-center sm:text-left text-sm font-semibold text-gray-900">
              Athlete
            </th>
            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Activities
            </th>
            <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Distance
            </th>
            <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Time
            </th>
            <th scope="col" className="md:hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Points
            </th>
            <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Activity Pts
            </th>
            <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              City Pts
            </th>
            <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Pace Pts
            </th>
            <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
              Total Pts
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data?.athletes.map((athlete: Athlete, index: number) => {

            const firstName = athlete.name.split(" ")[0]; // Extracts only the first name

            return (
              <tr key={athlete.athleteId} className="hover:bg-gray-50">
                {/* Rank */}
                <td className="whitespace-nowrap py-6 pl-4 pr-3 text-lg font-bold text-gray-900 sm:pl-6">
                <span
  className={`inline-flex items-center justify-center rounded-full w-10 h-10  text-lg font-bold border-2  
    ${index === 0 ? "bg-[#efbf04] border-yellow-500" : index === 1 ? "bg-[#c4c4c4] border-gray-500 " : index === 2 ? "bg-[#ce8946] border-orange-800" : "bg-white text-black border-black"}`}
>
  {index + 1}
</span>
                </td>

                {/* Athlete Info - Small Screen (Stacked) */}
                <td className="sm:hidden px-3 py-4 text-sm text-gray-900 text-center">
                  <div className="flex flex-col items-center">
                    <Avatar user={athlete} className="h-12 w-12 mask mask-squircle mb-2" />
                    <span className="font-medium">{firstName}</span>
                  </div>
                </td>

                {/* Athlete Info - Large Screen (Inline) */}
                <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  <div className="flex items-center space-x-3">
                    <Avatar user={athlete} className="h-12 w-12 mask mask-squircle" />
                    <span className="font-medium">{athlete.name}</span>
                  </div>
                </td>

                {/* Total Activities (hidden on small screens) */}
                <td className="table-cel text-center  whitespace-nowrap px-3 py-4 text-lg text-gray-500">
                  {athlete.totalActivities}
                </td>

                {/* Total Distance */}
                <td className="px-3 py-4 text-gray-700 text-lg text-center font-semibold">
                  {(athlete.totalDistance / 1000).toFixed(2)} km
                  <span className="block text-gray-500 text-xs">
                  {Math.floor(athlete.totalDuration / 3600)}h{" "}
                  {Math.floor((athlete.totalDuration % 3600) / 60)}m
                    </span>
                </td>

                {/* Total Time (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-600 text-center">
                  {Math.floor(athlete.totalDuration / 3600)}h{" "}
                  {Math.floor((athlete.totalDuration % 3600) / 60)}m
                </td>

                {/* Stacked Points (small screens only) */}
                <td className="md:hidden px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  <div>
                    <span className="block text-gray-900 text-lg font-semibold">
                      {athlete.totalPoints}
                    </span>
                    <span className="block text-gray-500 text-xs">
                      {athlete.totalPoints} Act • {athlete.cityPoints} City • {athlete.pacePoints || 0} Pace
                    </span>
                  </div>
                </td>

                {/* Activity Points (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {athlete.totalPoints}
                </td>

                {/* City Points (hidden on small & medium screens) */}
                <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {athlete.cityPoints}
                </td>

                {/* Pace Points (hidden on small & medium screens) */}
                <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {athlete.pacePoints || 0}
                </td>

                {/* Total Points (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-900 text-center font-bold">
                  {athlete.totalPoints}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      </div>
    </div>
    )}
    </Authorization>
  );
}