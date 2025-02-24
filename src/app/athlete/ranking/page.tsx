'use client';

import * as React from "react";
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';
import Avatar from '../../../components/Avatar';
import Authorization from '../../../components/Authorization';
import { TrophyIcon } from "@heroicons/react/24/solid";
import { PieChart, Pie, Label, Cell } from "recharts";
import { FaMedal } from "react-icons/fa";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "../../components/ui/chart";

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


const toProperCase = (str: string) => 
  str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

const chartConfig: Record<string, { label: string; color: string }> = {
  activityPoints: { label: "Activity Points", color: "#ea319d" }, 
  cityPoints: { label: "City Points", color: "black" }, 
  pacePoints: { label: "Pace Points", color: "#e9e9e9" } 
} satisfies ChartConfig;

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
      {(user) => (
        <div className="max-w-7xl mx-auto mt-48 sm:mt-52 sm:mb-10">
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Athlete</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Activities</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Distance<br/>Time</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Points</th>

                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data?.athletes.map((athlete: Athlete, index: number) => {
                  const firstName = toProperCase(athlete.name.split(" ")[0]);

                  // **Dynamic Data for PieChart**
                  const chartData = [
                    { name: "activityPoints", value: athlete.activityPoints },
                    { name: "cityPoints", value: athlete.cityPoints},
                    { name: "pacePoints", value: athlete.pacePoints},
                  ];

                  return (
           <tr
            key={athlete.athleteId}
            className={` ${athlete.name === user.name ? "bg-gray-50" : ""}`}
          >
                      {/* Athlete Info */}
                   
                      <td className="px-3 py-4 text-center">
                        <div className="mx-auto w-16 relative flex flex-col items-center">
                          {/* Show Trophy for 1st place, Medal for 2nd & 3rd, Number otherwise */}
                          {index === 0 ? (
                            <TrophyIcon className="z-10 absolute -top-2 -left-2 w-8 h-8 text-yellow-500" />
                          ) : index < 3 ? (
                            <FaMedal
                              className={`z-10 absolute -top-2 -left-2 w-8 h-8
                                ${index === 1 ? "text-gray-400" : "text-orange-600"}`}
                            />
                          ) : (
                            <span
                              className="z-10 absolute -top-2 -left-2 inline-flex items-center justify-center rounded-full w-8 h-8 text-sm font-bold border-2 shadow-md bg-white/70 text-black border-black"
                            >
                              {index + 1}
                            </span>
                          )}

                          {/* Avatar */}
                          <Avatar user={athlete} className="h-16 w-16 mask mask-squircle mb-2" />

                          {/* Athlete Name */}
                          <span className="font-medium">{firstName}</span>
                        </div>
                      </td>

                      {/* Total Activities */}
                      <td className="px-3 py-4 text-center text-xl font-semibold text-black">
                        {athlete.totalActivities}
                      </td>

                      {/* Total Distance */}
                      <td className="px-3 py-4 text-center text-xl font-semibold text-gray-700">
                        {(athlete.totalDistance / 1000).toFixed(2)} km
                        <span className="block text-gray-500 text-xs bg-gray-300/30 rounded-lg  p-1">
                          {Math.floor(athlete.totalDuration / 3600)}h{" "}
                          {Math.floor((athlete.totalDuration % 3600) / 60)}m
                        </span>
                      </td>


                      {/* Chart for Activity, City, and Pace Points */}
                      <td className="table-cell px-3 py-4 text-center">
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[150px]">
                         
{/* Pie Chart Rendering */}
<PieChart width={80} height={80}>
  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} strokeWidth={1}>
    {chartData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={chartConfig[entry.name]?.color || "#8884d8"} // Fallback to blue
      />
    ))}
    <Label 
      content={({ viewBox }) => {
        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
          return (
            <text
            x={viewBox.cx}
            y={viewBox.cy}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan
              x={viewBox.cx}
              y={viewBox.cy}
              className="fill-foreground text-3xl font-bold"
            >
              {athlete.totalPoints}
            </tspan>
            <tspan
              x={viewBox.cx}
              y={(viewBox.cy || 0) + 24}
              className="fill-muted-foreground"
            >
              Points
            </tspan>
          </text>
          );
        }
      }}
    />
  </Pie>
</PieChart>
                        </ChartContainer>
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