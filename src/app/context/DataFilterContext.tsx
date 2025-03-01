"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DataFilterContextProps {
  selectedMonth: number | null;
  selectedYear: number | null;
  setMonthYear: (month: number | null, year: number | null) => void;
}

const DataFilterContext = createContext<DataFilterContextProps | undefined>(undefined);

export const DataFilterProvider = ({ children }: { children: ReactNode }) => {

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number | null>(currentDate.getFullYear());

  const setMonthYear = (month: number | null, year: number | null) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <DataFilterContext.Provider value={{ selectedMonth, selectedYear, setMonthYear }}>
      {children}
    </DataFilterContext.Provider>
  );
};

export const useDataFilter = () => {
  const context = useContext(DataFilterContext);
  if (!context) {
    throw new Error("useDataFilter must be used within a DataFilterProvider");
  }
  return context;
};