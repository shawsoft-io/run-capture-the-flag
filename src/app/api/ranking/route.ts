import { NextResponse, NextRequest } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { WithId } from 'mongodb';
import { User } from '@/types';

export async function GET(req : NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const groupBy = searchParams.get("groupBy"); 

    const db = await getDatabase('strava_app'); 
    const usersCollection = db.collection<WithId<User>>('users');
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
            let: { athleteIdStr: { $substrBytes: ['$_id', 14, -1] } }, 
            pipeline: [
              { $match: { $expr: { $eq: [{ $toString: '$athlete_id' }, '$$athleteIdStr'] } } }, 
              {
                $group: {
                  _id: null, 
                  totalDistance: { $sum: '$distance' },
                  totalDuration: { $sum: '$duration' },
                  totalActivities: { $sum: 1 },
                  activityPoints: { $sum: '$activity_points' },
                  pacePoints: { $sum: '$pace_points' },
                  cityClaimedCount: { $sum: { $cond: ['$claimed', 1, 0] } } 
                },
              },
            ],
            as: 'activityData',
          },
        },
        {
          $unwind: {
            path: '$activityData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $set: {
            cityPoints: { $multiply: ['$activityData.cityClaimedCount', 10] },
            totalPoints: { 
              $add: [
                { $ifNull: ['$activityData.activityPoints', 0] },
                { $ifNull: ['$activityData.pacePoints', 0] },
                { $multiply: ['$activityData.cityClaimedCount', 10] } 
              ] 
            } 
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
            activityPoints: { $ifNull: ['$activityData.activityPoints', 0] },
            pacePoints: { $ifNull: ['$activityData.pacePoints', 0] },
            cityPoints: 1, // ✅ New city points
            totalPoints: 1, // ✅ New total points
          },
        },
        { $sort: { totalPoints: -1 } }, // ✅ Sort by the new total points DESC
      ])
      .toArray();

    return NextResponse.json({ athletes });
  } catch (error) {
    console.error('Error fetching league table:', error);
    return NextResponse.json({ error: 'Failed to fetch league table.' }, { status: 500 });
  }
}