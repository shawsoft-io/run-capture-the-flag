'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { ExtendedUserProfile } from '../app/types/auth0';
import Loading from '../components/Loading'

interface ExtendedUserProps {
  children: (user: ExtendedUserProfile) => React.ReactNode;
  loginPath?: string;
  unauthorizedPath?: string;
  pendingVerificationPath?: string;
  requiredRoles?: string[];
}

const Authorization: React.FC<ExtendedUserProps> = ({
  children,
  unauthorizedPath = '/unauthorized',
  pendingVerificationPath = '/pending-verification',
  requiredRoles = [],
}) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {

    if (isLoading) return; // Wait for loading to finish

    const userRoles = (user as ExtendedUserProfile)?.["https://run.shawsoft.io/roles"] || [];

    if (userRoles.length === 0) {
      router.push(pendingVerificationPath);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRoles.includes(role))) {
      router.push(unauthorizedPath);
    }
  }, [isLoading, user, router, unauthorizedPath, pendingVerificationPath, requiredRoles]);

  if (isLoading) return <Loading/>;
  if (error) {
    console.error("Authorization Error:", error);
    return <p>Error: {error.message}</p>;
  }


  const userRoles = (user as ExtendedUserProfile)?.["https://run.shawsoft.io/roles"] || [];
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some((role) => userRoles.includes(role));

  if (!hasRequiredRole) return null;

  return <>{children(user as ExtendedUserProfile)}</>;
};

export default Authorization;