'use client'

import { useUser } from "@auth0/nextjs-auth0";




export default  function Page() {
  
  const {user}  = useUser();

  return (



        <h1 className="mt-[500px] text-3xl black">Dashboard - Hello {user?.email}</h1>


  
  
  );
};

