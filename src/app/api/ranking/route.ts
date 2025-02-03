import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { WithId } from 'mongodb';

interface User {
  _id: string; // oauth2|Strava|123456789
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET() {
  try {
    const db = await getDatabase('strava_app'); // Update with your actual DB name
    const usersCollection = db.collection<WithId<User>>('users');

    // Get all users except the excluded user, and left join with activity data
    const athletes = await usersCollection
      .aggregate([
        {
          $match: {
            _id: { $not: { $regex: '155894587$' } }, // Exclude users with athlete ID "155894587"
          },
        },
        {
          $lookup: {
            from: 'activity_detail',
            let: { athleteIdStr: { $substrBytes: ['$_id', 14, -1] } }, // Extract numeric athlete ID
            pipeline: [
              { $match: { $expr: { $eq: [{ $toString: '$athlete_id' }, '$$athleteIdStr'] } } }, // Match converted ID
              {
                $group: {
                  _id: null, // Group all activities per user
                  totalDistance: { $sum: '$distance' },
                  totalDuration: { $sum: '$duration' },
                  totalActivities: { $sum: 1 },
                  totalPoints: { $sum: '$activity_points' },
                  pacePoints: { $sum: '$pace_points' },
                  cityClaimedCount: { "$sum": { "$cond": ["$claimed", 1, 0] } }
                },
              },
            ],
            as: 'activityData',
          },
        },
        {
          $unwind: {
            path: '$activityData',
            preserveNullAndEmptyArrays: true, // Keep users even if they have no activities
          },
        },
        {
          $project: {
            athleteId: { $substrBytes: ['$_id', 14, -1] }, // Extract numeric part of the ID
            name: { $concat: ['$given_name', ' ', '$family_name'] }, // Combine first & last name
            picture: 1,
            totalDistance: { $ifNull: ['$activityData.totalDistance', 0] }, // Default to 0 if no activity data
            totalDuration: { $ifNull: ['$activityData.totalDuration', 0] },
            totalActivities: { $ifNull: ['$activityData.totalActivities', 0] },
            totalPoints: { $ifNull: ['$activityData.totalPoints', 0] },
            pacePoints: { $ifNull: ['$activityData.pacePoints', 0] },
            cityClaimedCount: { $ifNull: ['$activityData.cityClaimedCount', 0] }
          },
        },
        { $sort: { totalPoints: -1 } }, // Sort by totalPoints DESC
      ])
      .toArray();

    return NextResponse.json({ athletes });
  } catch (error) {
    console.error('Error fetching league table:', error);
    return NextResponse.json({ error: 'Failed to fetch league table.' }, { status: 500 });
  }
}