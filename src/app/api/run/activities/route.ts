import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { WithId } from 'mongodb';
import { Activity } from '@/types';
import { auth0 } from '../../../../lib/auth0';

export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;
    const month = queryParams.get('month'); 
    const year = queryParams.get('year'); 
    const visibility = queryParams.get('visibility') || 'everyone';
    const page = parseInt(queryParams.get('page') || '1', 10);
    const limit = 5;

    // Connect to MongoDB
    const db = await getDatabase('strava_app');
    const activityCollection = db.collection<WithId<Activity>>('activity_detail');

    // Build date filter if 'year' is provided
    let dateFilter = {};
    if (year) {
      const startDate = month ? new Date(parseInt(year), parseInt(month) - 1, 1) : new Date(parseInt(year), 0, 1);
      const endDate = month ? new Date(parseInt(year), parseInt(month), 1) : new Date(parseInt(year) + 1, 0, 1);
      dateFilter = { date_time_local: { $gte: startDate, $lt: endDate } };
    }

    // Build athlete filter if visibility is 'me'
    let athleteFilter = {};
    if (visibility === 'me') {
      const session = await auth0.getSession();
      const currentAthleteId = session?.user["https://run.shawsoft.io/athleteId"];
      if (currentAthleteId) {
        athleteFilter = { athlete_id: currentAthleteId };
      }
    }

    // Combine all filters
    const queryFilters = { ...dateFilter, ...athleteFilter };

    // Aggregation pipeline
    const activities = await activityCollection.aggregate([
        { $match: queryFilters },
        {
          $lookup: {
            from: 'users',
            let: { athleteId: { $toString: '$athlete_id' } },
            pipeline: [
              {
                $addFields: {
                  extracted_id: { $arrayElemAt: [{ $split: ['$_id', '|'] }, 2] },
                },
              },
              {
                $match: { $expr: { $eq: ['$extracted_id', '$$athleteId'] } },
              },
            ],
            as: 'user_info',
          },
        },
        { $unwind: { path: '$user_info', preserveNullAndEmptyArrays: true } },
        { $sort: { date_time_local: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]).toArray();

    // Map activities to include necessary fields for the frontend
    const mappedActivities = activities.map((activity) => ({
      id: activity._id.toString(),
      athleteId: activity.athlete_id,
      date_time_local: activity.date_time_local,
      distance: activity.distance,
      duration: activity.duration,
      city: activity.city,
      country: activity.country,
      map_url: activity.map_url,
      pace: activity.pace,
      activity_points: activity.activity_points,
      fastest_monthly_5km: activity.fastest_monthly_5km,
      claimed: activity.claimed,
      user: {
        given_name: activity.user_info?.given_name,
        family_name: activity.user_info?.family_name,
        picture: activity.user_info?.picture,
      },
    }));

    return NextResponse.json({ activities: mappedActivities });
  } catch (error) {
    console.error('Error fetching activities from MongoDB:', error);
    return NextResponse.json({ error: 'Failed to fetch activities.' }, { status: 500 });
  }
}