'use client'

import { ExtendedUserProfile } from "@/types/auth0";
import { useUser } from "@auth0/nextjs-auth0"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page()
{
    
    const router = useRouter();
    const {user, isLoading} = useUser();
    const userRoles = (user as ExtendedUserProfile)?.["https://run.shawsoft.io/roles"] || []

    useEffect(() => {  
      if (isLoading) return; 

    }, [user, router, isLoading]);


    return(
        <main className="h-full grow lg:pt-40 pt-16 bg-hotpink">

            <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                <p className="text-base/8 font-semibold text-white">
                    {userRoles?.length > 0 ? "Verification complete" : "Verification pending"}
                </p>

                <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                    {userRoles?.length > 0 ? "Your in!" : "Hang tight"}
                </h1>

                <p className="mt-6 text-pretty text-lg font-medium text-white/70 sm:text-xl/8">
                    {
                      userRoles?.length > 0 ? 
                        "get your running shoes on and log your first activity" : 
                        "an admin is reviewing you request to join the crew, please check back later"
                    }
                </p>

                <div className="mt-10 flex justify-center cursor-pointer">
                {userRoles?.length > 0 ? (
                    <Link href="/athlete/dashboard" className="text-sm/7 font-semibold text-white">
                        <span aria-hidden="true">&larr;</span> View activity
                    </Link>
                ) : (
                    <Link href="/login" className="text-sm/7 font-semibold text-white">
                        <span aria-hidden="true">&larr;</span> Back to login
                    </Link>
                )}
                </div>

                <div className="flex justify-center">
                    <img src="/loader.gif"  />
                </div>
            </div>
        </main>
    )
}
            