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
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not logged in
        router.push(loginPath);
      } else {
        const userRoles = (user as ExtendedUserProfile)["https://run.shawsoft.io/roles"] || [];

        // Redirect to pending verification if user has no role
        if (userRoles.length === 0) {
          router.push(pendingVerificationPath);
        }

        // Check if user has required roles
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

        if (requiredRoles.length > 0 && !hasRequiredRole) {
          // Redirect to unauthorized if user lacks required role
          router.push(unauthorizedPath);
        }
      }
    }
  }, [isLoading, user, router, loginPath, unauthorizedPath, pendingVerificationPath, requiredRoles]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!user) return null; 
  if (requiredRoles.length > 0) {
    const userRoles = (user as ExtendedUserProfile)["https://run.shawsoft.io/roles"] || [];
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRequiredRole) return null; 
  }

  const extendedUser = user as ExtendedUserProfile;

  return <>{children(extendedUser)}</>;
};

export default Authorization;