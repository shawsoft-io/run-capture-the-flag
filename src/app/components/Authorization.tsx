'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import type { ExtendedUserProfile } from '../types/auth0';
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {


    if (isLoading || !user) {
      // Wait for user to load
      return;
    }


    const userRoles = (user as ExtendedUserProfile)?.['https://run.shawsoft.io/roles'] || [];
    if (userRoles.length === 0) {
      console.warn('User has no roles. Redirecting to pending verification.');
      setIsRedirecting(true);
      router.push(pendingVerificationPath);
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some((role) => userRoles.includes(role))) {
      console.warn('User lacks required roles. Redirecting to unauthorized.');
      setIsRedirecting(true);
      router.push(unauthorizedPath);
      return;
    }

    setIsVerified(true);
  }, [isLoading, user, router, requiredRoles, pendingVerificationPath, unauthorizedPath]);


  if (isLoading || isRedirecting) {
    return <Loading />;
  }

  if (!isVerified) {
    return null; // Prevent rendering children until verification is complete
  }

  return <>{children(user as ExtendedUserProfile)}</>;
};

export default Authorization;