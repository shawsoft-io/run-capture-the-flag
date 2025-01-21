'use client'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const RedirectComponent = () => {

 const router = useRouter();
 const {user, isLoading} = useUser();

  useEffect(() => {  

    if (isLoading) return;

    if (!user) {
      router.push("/login");
    }

    router.push('/athlete/dashboard')
  
  }, [user, router]);

};

export default RedirectComponent;