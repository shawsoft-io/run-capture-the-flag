'use client';

import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';
import Authorization from '../../../components/Authorization';

interface ClaimedCity {
  city: string;
  name: string;
  picture: string; // Claimer's photo
  city_photo_url: string; // City Image URL
}

interface ClaimedCountry {
  _id: string; // Country name
  cities: ClaimedCity[];
}

export default function ClaimedCityPage() {
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
    <Authorization>
      {() => (
        <div className="max-w-7xl mx-auto mt-10 px-4 mt-52">
          {data?.claimedCities.map((country: ClaimedCountry) => (
            <div key={country._id} className="mb-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{country._id}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {country.cities.map((claimedCity, index) => (
                  <div key={index} className="relative w-full rounded-lg overflow-hidden shadow-lg">
                    {/* City Image */}
                    <img
                      src={claimedCity.city_photo_url}
                      alt={claimedCity.city}
                      className="w-full h-64 object-cover"
                    />

                    {/* Overlay for Claimer Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-700/50 p-4 flex items-center gap-4">
                      <img
                        src={claimedCity.picture}
                        alt={claimedCity.name}
                        className="w-12 h-12 mask mask-squircle object-cover"
                      />
                      <div>
                        <p className="text-white font-bold">{claimedCity.name}</p>
                        <p className="text-gray-300 text-sm">{claimedCity.city}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Authorization>
  );
}