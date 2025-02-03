import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { WithId } from 'mongodb';
import { User } from '@/types'

// Define the Role interface


// Function to fetch users from MongoDB
export async function GET() {
  try {
    const db = await getDatabase('strava_app'); // Connect to your MongoDB database
    const usersCollection = db.collection<WithId<User>>('users'); // Users collection

    // Fetch all users
    const users = await usersCollection.find().toArray();

    // Map users to the expected format
    const usersWithRoles = users.map((user : User) => ({
      user_id: user._id, // Keeping the same Auth0 user ID format
      email: user.email,
      name: user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : 'Unknown',
      picture: user.picture,
      roles: user.roles || [], // Ensure roles array exists
    }));

    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error('Error fetching users from MongoDB:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}