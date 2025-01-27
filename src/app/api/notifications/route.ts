import { NextRequest, NextResponse } from 'next/server';
import { QueueLib } from '../../../lib/queue';



const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN; 

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
    const message = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const queueLib = new QueueLib(); // Default queue name from .env
    await queueLib.ensureQueueExists();
    const id = await queueLib.sendMessage(message);

    return NextResponse.json({ success: true, id: {id} }, { status: 200 });

  } catch (error) {
    console.error('Error processing Strava webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

