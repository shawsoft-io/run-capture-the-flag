'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  minYear: number;
  maxYear: number;
  onChange: (month: number, year: number) => void;
}

const months = [
  { label: "Jan", value: 1 }, { label: "Feb", value: 2 }, { label: "Mar", value: 3 },
  { label: "Apr", value: 4 }, { label: "May", value: 5 }, { label: "Jun", value: 6 },
  { label: "Jul", value: 7 }, { label: "Aug", value: 8 }, { label: "Sep", value: 9 },
  { label: "Oct", value: 10 }, { label: "Nov", value: 11 }, { label: "Dec", value: 12 }
];

export default function DatePicker({ minYear, maxYear, onChange }: DatePickerProps) {
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, onChange]);

  return (
    <div className="flex w-full justify-between px-4 py-6">
      {/* Month Picker */}
      <div className="flex flex-col items-center w-1/2">
        <span className="text-gray-500 text-sm">Month</span>
        <div className="relative w-full overflow-hidden">
          <div className="flex flex-col items-center overflow-y-scroll h-40 snap-y snap-mandatory scrollbar-hide" ref={monthRef}>
            {months.map((m) => (
              <div
                key={m.value}
                className={`py-2 text-lg font-medium cursor-pointer snap-center ${
                  selectedMonth === m.value ? "text-black font-semibold" : "text-gray-400"
                }`}
                onClick={() => setSelectedMonth(m.value)}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Year Picker */}
      <div className="flex flex-col items-center w-1/2">
        <span className="text-gray-500 text-sm">Year</span>
        <div className="relative w-full overflow-hidden">
          <div className="flex flex-col items-center overflow-y-scroll h-40 snap-y snap-mandatory scrollbar-hide" ref={yearRef}>
            {years.map((y) => (
              <div
                key={y}
                className={`py-2 text-lg font-medium cursor-pointer snap-center ${
                  selectedYear === y ? "text-black font-semibold" : "text-gray-400"
                }`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}