'use client';

import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';
import Avatar from '../../../components/Avatar';

interface Athlete {
  athleteId: string;
  name: string;
  picture: string;
  totalDistance: number;
  totalDuration: number;
  totalActivities: number;
  totalPoints: number;
  cityClaimedCount: number;
  pacePoints: number;
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
    <div className="max-w-7xl mx-auto mt-40 mb-10">
      <h1 className="text-2xl font-bold mb-6 text-center">🏆 Athlete League Table</h1>

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
            <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
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
            const cityPoints = athlete.cityClaimedCount * 10;
            const totalPoints = athlete.totalPoints + cityPoints + (athlete.pacePoints || 0);
            const firstName = athlete.name.split(" ")[0]; // Extracts only the first name

            return (
              <tr key={athlete.athleteId} className="hover:bg-gray-50">
                {/* Rank */}
                <td className="whitespace-nowrap py-6 pl-4 pr-3 text-lg font-bold text-gray-900 sm:pl-6">
                  {index + 1}
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
                <td className="table-cel text-center  whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {athlete.totalActivities}
                </td>

                {/* Total Distance */}
                <td className="px-3 py-4 text-sm text-gray-700 text-center font-semibold">
                  {(athlete.totalDistance / 1000).toFixed(2)} km
                </td>

                {/* Total Time (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-600 text-center">
                  {Math.floor(athlete.totalDuration / 3600)}h{" "}
                  {Math.floor((athlete.totalDuration % 3600) / 60)}m
                </td>

                {/* Stacked Points (small screens only) */}
                <td className="md:hidden px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  <div>
                    <span className="block text-gray-900 font-semibold">
                      {totalPoints} Total
                    </span>
                    <span className="block text-gray-500 text-xs">
                      {athlete.totalPoints} Act • {cityPoints} City • {athlete.pacePoints || 0} Pace
                    </span>
                  </div>
                </td>

                {/* Activity Points (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {athlete.totalPoints}
                </td>

                {/* City Points (hidden on small & medium screens) */}
                <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {cityPoints}
                </td>

                {/* Pace Points (hidden on small & medium screens) */}
                <td className="hidden lg:table-cell px-3 py-4 text-sm text-gray-700 text-center font-bold">
                  {athlete.pacePoints || 0}
                </td>

                {/* Total Points (hidden on small screens) */}
                <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-900 text-center font-bold">
                  {totalPoints}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      </div>
    </div>
  );
}