import { NextResponse } from 'next/server';
import { getSubscriptionStatus } from '../../../../lib/strava'; 


export async function GET() {
  try {

    const CLIENT_ID = "139426"
    const SECRET = "add53533784d66be567566e164c68d6094453cf3"


    const status = await getSubscriptionStatus(CLIENT_ID, SECRET);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json({ error: 'Error fetching Strava activities' }, { status: 500 });
  }
}