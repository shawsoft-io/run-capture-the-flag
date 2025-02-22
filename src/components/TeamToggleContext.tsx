"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToggleContextType = {
  toggle: 'individual' | 'team';
  setToggle: (value: 'individual' | 'team') => void;
};

const TeamToggleContext = createContext<ToggleContextType | undefined>(undefined);

export function TeamToggleContextProvider ({ children }: { children: ReactNode }) {
  const [toggle, setToggle] = useState<'individual' | 'team'>('individual');

  return (
    <TeamToggleContext.Provider value={{ toggle, setToggle }}>
      {children}
    </TeamToggleContext.Provider>
  );
}

export function useToggle() {
  const context = useContext(TeamToggleContext);
  if (!context) {
    throw new Error('useToggle must be used within a ToggleProvider');
  }
  return context;
}