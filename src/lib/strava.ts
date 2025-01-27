const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export interface StravaActivity {
  id: number;
}

export interface StravaSubscription {
  id: number;
  application_id: number;
  callback_url: string;
  created_at: string;
  updated_at: string;
}

export async function getLastFiveActivities(accessToken: string): Promise<StravaActivity[]> {
   const sinceJan1 = new Date('2025-01-01T00:00:00Z').getTime() / 1000; // UNIX timestamp in seconds
  const activities = [];
  let page = 1;
  const perPage = 30; // Adjust perPage if needed (default: 30, max: 200)

  try {
    while (true) {
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${sinceJan1}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        break; 
      }

      activities.push(...data);
      page++;
    }

    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}

export async function getSubscriptionStatus(clientId: string, clientSecret: string): Promise<StravaSubscription[]> {
  const response = await fetch(`${STRAVA_API_URL}/push_subscriptions?client_id=${clientId}&client_secret=${clientSecret}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscription status from Strava');
  }

  return await response.json();
}