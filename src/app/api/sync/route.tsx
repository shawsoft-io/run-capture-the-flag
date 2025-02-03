import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';

export async function GET(req : NextRequest) {
  const { searchParams } = new URL(req.url);
  const athleteId = searchParams.get('athleteId');

  if (!athleteId) {
    return NextResponse.json({ error: 'Missing athleteId' }, { status: 400 });
  }

  try {

    const athleteIdInt = parseInt(athleteId, 10);
    const db = await getDatabase('strava_app');
    const existingSync = await db.collection('sync').findOne({ athlete_id: athleteIdInt, status: 'in progress' });

    return NextResponse.json({ inProgress: !!existingSync });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req : NextRequest) {
  try {
    const { athleteId } = await req.json();
    if (!athleteId) {
      return NextResponse.json({ error: 'Missing athleteId' }, { status: 400 });
    }

    const db = await getDatabase('strava_app'); // Replace with actual DB name
    const existingSync = await db.collection('sync').findOne({ athlete_id: athleteId, status: 'in progress' });

    if (existingSync) {
      return NextResponse.json({ error: 'Sync already in progress' }, { status: 400 });
    }

    await db.collection('sync').insertOne({
      athlete_id: athleteId,
      request_time: new Date(),
      status: 'in progress',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting sync:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}