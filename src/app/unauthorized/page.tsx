'use client'

import Link from "next/link"

const Unauthorized = ({}) =>
{
    return (
        <main className="h-full grow lg:pt-40 pt-16 bg-hotpink">

        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
            <p className="text-base/8 font-semibold text-white">
                Not authorized
            </p>

            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                Halt, who goes there?
            </h1>

            <p className="mt-6 text-pretty text-lg font-medium text-white/70 sm:text-xl/8">
                sorry, you don't have clearence to view this top secret page
            </p>

            <div className="mt-10 flex justify-center cursor-pointer">
    
                <Link href="/athlete/dashboard" className="text-sm/7 font-semibold text-white">
                    <span aria-hidden="true">&larr;</span> Go home
                </Link>
  
            </div>

            <div className="flex justify-center py-10">
                <img src="https://i.imgur.com/sjs7aa0.gif"  />
            </div>
        </div>
    </main>
    )
}

export default Unauthorized