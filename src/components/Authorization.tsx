'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { ExtendedUserProfile } from '../app/types/auth0';

interface ExtendedUserProps {
  children: (user: ExtendedUserProfile) => React.ReactNode;
  loginPath?: string;
  unauthorizedPath?: string;
  pendingVerificationPath?: string;
  requiredRoles?: string[];
}

const Authorization: React.FC<ExtendedUserProps> = ({
  children,
  loginPath = '/login',
  unauthorizedPath = '/unauthorized',
  pendingVerificationPath = '/pending-verification',
  requiredRoles = [],
}) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for loading to finish

    if (!user) {
      router.push(loginPath);
      return;
    }

    const userRoles = (user as ExtendedUserProfile)?.["https://run.shawsoft.io/roles"] || [];

    if (userRoles.length === 0) {
      router.push(pendingVerificationPath);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRoles.includes(role))) {
      router.push(unauthorizedPath);
    }
  }, [isLoading, user, router, loginPath, unauthorizedPath, pendingVerificationPath, requiredRoles]);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error("Authorization Error:", error);
    return <p>Error: {error.message}</p>;
  }

  if (!user) return <p>Redirecting to login...</p>;

  const userRoles = (user as ExtendedUserProfile)?.["https://run.shawsoft.io/roles"] || [];
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some((role) => userRoles.includes(role));

  if (!hasRequiredRole) return <p>You do not have permission to access this page.</p>;

  return <>{children(user as ExtendedUserProfile)}</>;
};

export default Authorization;