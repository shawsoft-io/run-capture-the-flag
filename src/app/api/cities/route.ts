import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { WithId } from 'mongodb';

interface Activity {
  _id: string;
  athlete_id: number;
  city: string;
  country: string;
  claimed: boolean;
  city_photo_url: string;
}

export async function GET() {
  try {
    const db = await getDatabase('strava_app');
    const activityCollection = db.collection<WithId<Activity>>('activity_detail');

    const claimedCities = await activityCollection
      .aggregate([
        {
          $match: { claimed: true }, // Only claimed cities
        },
        {
          $lookup: {
            from: 'users',
            let: { athleteIdStr: { $toString: '$athlete_id' } }, // Convert athlete_id to string
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $substrBytes: ['$_id', 14, -1] }, '$$athleteIdStr'] }, // Match user ID
                },
              },
              {
                $project: {
                  name: { $concat: ['$given_name', ' ', '$family_name'] }, // Full name
                  picture: 1,
                },
              },
            ],
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true, // Keep entries even if user data is missing
          },
        },
        {
          $sort: { city: 1 }, // Sort cities alphabetically before grouping
        },
        {
          $group: {
            _id: '$country',
            cities: {
              $push: {
                city: '$city',
                city_photo_url: { $ifNull: ['$city_photo_url', '/image-placeholder.png'] } ,
                name: { $ifNull: ['$user.name', 'Unknown Athlete'] },
                picture: { $ifNull: ['$user.picture', 'https://via.placeholder.com/100?text=No+Image'] },
              },
            },
          },
        },
        {
          $sort: { _id: 1 }, // Sort alphabetically by country
        },
      ])
      .toArray();

    return NextResponse.json({ claimedCities });
  } catch (error) {
    console.error('Error fetching claimed cities:', error);
    return NextResponse.json({ error: 'Failed to fetch claimed cities.' }, { status: 500 });
  }
}