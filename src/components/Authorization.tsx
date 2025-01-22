'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import type { ExtendedUserProfile } from '../app/types/auth0';
import Loading from './Loading';

interface ExtendedUserProps {
  children: (user: ExtendedUserProfile) => React.ReactNode;
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
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isLoading || !user) {
      // Don't take any action until loading is complete and user is defined
      return;
    }
  
    const userRoles = (user as ExtendedUserProfile)?.['https://run.shawsoft.io/roles'] || [];
    if (userRoles.length === 0) {
      console.warn('User has no roles. Redirecting to pending verification.');
      router.push(pendingVerificationPath);
      return;
    }
  
    if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRoles.includes(role))) {
      console.warn('User lacks required roles. Redirecting to unauthorized.');
      router.push(unauthorizedPath);
      return;
    }
  
    setIsVerified(true);
  }, [isLoading, user, router, requiredRoles, pendingVerificationPath, unauthorizedPath]);
  if (isLoading) {
    return <Loading />;
  }

  if (!isVerified) {
    // Prevent rendering children until verification is complete
    router.push(unauthorizedPath)
  }

  return <>{children(user as ExtendedUserProfile)}</>;
};

export default Authorization;