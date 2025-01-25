const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
}

export async function getLastFiveActivities(accessToken: string): Promise<StravaActivity[]> {
  const response = await fetch(`${STRAVA_API_URL}/athlete/activities?per_page=5`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch activities from Strava');
  }

  return await response.json();
}