import { NextRequest, NextResponse } from 'next/server';

const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN; // Your Strava verification token

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const verifyToken = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (verifyToken === STRAVA_VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': challenge }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid verify token' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    console.log('Received Strava event:', event);

    // Process the event based on its aspect type
    switch (event.aspect_type) {
      case 'create':
        console.log('New activity created:', event.object_id);
        break;
      case 'update':
        console.log('Activity updated:', event.object_id);
        break;
      case 'delete':
        console.log('Activity deleted:', event.object_id);
        break;
      default:
        console.log('Unhandled event type:', event.aspect_type);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Strava webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

