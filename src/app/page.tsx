'use client';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectComponent = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
    } else {
      router.push('/athlete/dashboard');
    }
  }, [user, isLoading, router]);

  return null; 
};

export default RedirectComponent;