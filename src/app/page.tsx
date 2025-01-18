'use client'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectComponent = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; 

    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return null; 
};

export default RedirectComponent;