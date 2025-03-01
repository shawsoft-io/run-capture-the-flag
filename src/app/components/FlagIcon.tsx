import React from 'react';
import Flag from 'react-world-flags'
import countryLookup from "../../lib/countries.json"

const countryData: Record<string, string> = countryLookup;

interface FlagProps {
  countryName: string;
}
export default function FlagIcon({ countryName}: FlagProps) {

  const countryCode = countryData[countryName] || "UN"; 

  return (
    <Flag
      code={countryCode} 
      className='h-8 w-12 rounded-lg'
      style={{ objectFit: "cover" }}
    />
  );
}