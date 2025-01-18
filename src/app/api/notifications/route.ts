import { NextRequest, NextResponse } from 'next/server';
import AzureQueueManager from '../../../lib/queue';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const queueName = process.env.QUEUE_NAME || '';

const azureQueue = new AzureQueueManager(connectionString, queueName);
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

    await azureQueue.ensureQueueExists();

    const response = await azureQueue.sendMessage(message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing Strava webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

