import { NextRequest, NextResponse } from 'next/server';

interface Auth0User {
  user_id: string;
  email: string;
  name?: string;
}

interface Auth0Role {
  id: string;
  name: string;
  description: string;
}

interface UserWithRoles extends Auth0User {
  roles: Auth0Role[];
}

async function getManagementApiToken(): Promise<string> {
  const response = await fetch(`https://dev-gkxikxpelngom2uq.us.auth0.com/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: "Tjgj4Xb4kG9WnL6gdeuMDhi0FWqcsQej",
      client_secret: "P32gOFOlzvDKN_6W7G9C973KErDToNYI-MWGN1burOUo79J1WGVfYGpO1d-3M5tt",
      audience: `https://dev-gkxikxpelngom2uq.us.auth0.com/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Management API token');
  }

  const { access_token } = await response.json();
  return access_token;
}

async function getUsers(accessToken: string): Promise<Auth0User[]> {
  const response = await fetch(`https://dev-gkxikxpelngom2uq.us.auth0.com/api/v2/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
}

async function getUserRoles(accessToken: string, userId: string): Promise<Auth0Role[]> {
  const response = await fetch(`https://dev-gkxikxpelngom2uq.us.auth0.com/api/v2/users/${userId}/roles`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles for user ${userId}`);
  }

  return await response.json();
}

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getManagementApiToken();
    const users = await getUsers(accessToken);

    // Fetch roles for each user
    const usersWithRoles: UserWithRoles[] = await Promise.all(
      users.map(async (user) => {
        const roles = await getUserRoles(accessToken, user.user_id);
        return { ...user, roles };
      })
    );

    return NextResponse.json(usersWithRoles);
  } catch (error: any) {
    console.error('Error fetching users and roles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}