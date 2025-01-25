import { NextResponse } from 'next/server';
import { getLastFiveActivities } from '../../../../lib/strava'; // Adjust the path to your utility
import { auth0 } from '../../../../lib/auth0';

// Define the GET method
export async function GET() {
  try {
    const user = await auth0.getSession();
    const accessToken = typeof user?.user?.["https://run.shawsoft.io/accessToken"] === "string"
      ? user?.user?.["https://run.shawsoft.io/accessToken"]
      : null;

    console.log(`Token ${accessToken}`);

    if (!accessToken) {
      return NextResponse.json({ error: 'Strava access token not configured' }, { status: 500 });
    }

    const activities = await getLastFiveActivities(accessToken);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json({ error: 'Error fetching Strava activities' }, { status: 500 });
  }
}