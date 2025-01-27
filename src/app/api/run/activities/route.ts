import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { WithId, Filter } from 'mongodb';

// Define the Activity interface
interface Activity {
  _id: string;
  athlete_id: string;
  date_time_local: Date;
  distance: number;
  duration: number;
  city: string;
  country: string;
  map_url: string;
  fastest_1km_time: number;
  fastest_5km_time: number;
  pace: string;
  activity_points: number;
}

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const month = queryParams.get('month'); // Format: YYYY-MM
    const visibility = queryParams.get('visibility') || 'everyone';
    const page = parseInt(queryParams.get('page') || '1', 10);
    const limit = 5; // Fixed limit for pagination

    // Connect to MongoDB
    const db = await getDatabase('strava_app'); // Replace with your DB name
    const collection = db.collection<WithId<Activity>>('activity_detail'); // Explicitly type the collection

    // Build the query
    const query: Filter<Activity> = {};

    if (month) {
      const [year, monthIndex] = month.split('-').map(Number);
      const startDate = new Date(year, monthIndex - 1, 1);
      const endDate = new Date(year, monthIndex, 1);
      query.date_time_local = { $gte: startDate, $lt: endDate }
    }

    if (visibility === 'me') {
      query.athlete_id = 'currentAthleteId'; // Replace with the actual athlete ID
    }

    // Pagination
    const activities = await collection
      .find(query)
      .sort({ date_time_local: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Map activities to include necessary fields for the frontend
    const mappedActivities = activities.map((activity : Activity) => ({
      id: activity._id.toString(),
      athleteId: activity.athlete_id,
      dateTimeLocal: activity.date_time_local,
      distance: activity.distance,
      duration: activity.duration,
      city: activity.city,
      country: activity.country,
      map_url: activity.map_url,
      fastest1KmTime: activity.fastest_1km_time,
      fastest5KmTime: activity.fastest_5km_time,
      pace: activity.pace,
      activityPoints: activity.activity_points,
    }));

    return NextResponse.json({ activities: mappedActivities });
  } catch (error) {
    console.error('Error fetching activities from MongoDB:', error);
    return NextResponse.json({ error: 'Failed to fetch activities.' }, { status: 500 });
  }
}