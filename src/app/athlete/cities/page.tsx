'use client';

import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';

interface ClaimedCity {
  city: string;
  name: string;
  picture: string;
}

interface ClaimedCountry {
  _id: string; // Country name
  cities: ClaimedCity[];
}

export default function ClaimedCitiesPage() {
  const fetchClaimedCities = async () => {
    const response = await fetch('/api/cities');
    if (!response.ok) {
      throw new Error('Failed to fetch claimed cities');
    }
    return response.json();
  };

  const { data, status, error } = useQuery({
    queryKey: ['claimedCities'],
    queryFn: fetchClaimedCities,
  });

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 mt-48">
      <h1 className="text-2xl font-bold mb-6 text-center">🌍 Cities Claimed</h1>

      {data?.claimedCities.map((country: ClaimedCountry) => (
        <div key={country._id} className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">{country._id}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {country.cities.map((claimedCity, index) => (
              <div
                key={index}
                className="flex items-center bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <img
                  src={claimedCity.picture}
                  alt={claimedCity.name}
                  className="w-12 h-12 aspect-square rounded-full border border-gray-300 object-cover mr-4"
                />
                <div>
                  <p className="font-semibold">{claimedCity.city}</p>
                  <p className="text-gray-600 text-sm">Claimed by {claimedCity.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}