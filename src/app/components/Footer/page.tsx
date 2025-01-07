
import Link from "next/link";

export default function Page() {
  return (

    <footer className="w-full">
        <div className="relative">
         
          <div className="w-full">
            <div className="relative overflow-hidden bg-hotpink px-6 pt-10 shadow-xl sm:px-12">
              <div aria-hidden="true" className="absolute inset-0 sm:-mt-32 md:mt-0">
                <svg
                  fill="none"
                  viewBox="0 0 1463 360"
                  preserveAspectRatio="xMidYMid slice"
                  className="absolute inset-0 size-full"
                >
                  <path
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                    fill="currentColor"
                    className="text-pink-400/40"
                  />
                  <path
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                    fill="currentColor"
                    className="text-pink-600/40"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 relative mx-auto max-w-7xl py-2">
                <div className="sm:text-center">
                  <img
                    alt=""
                    src="/logo.png"
                    className="w-[120px] h-auto"
                  />

                  <img
                    alt=""
                    src="/strava-footer.png"
                    className="w-[120px] h-auto"
                  />
                


                </div>
                

   
        <div className="mt-2  pt-2 flex md:items-center justify-end sm:justify-center">
          <div className="flex gap-x-8 sm:gap-x-12 text-xs md:order-0 text-white text-center">
            <Link href="/">Home</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/support">Support</Link>
          </div>
          </div>
          <div className="mt-2 pt-2 md:flex md:items-center md:justify-end">
          <p className="flex space-x-8 text-xs md:order-0 text-white">
            &copy; 2024 Shawsoft. All rights reserved.
          </p>
        </div>
                
              </div>


              
            </div>



            
          </div>



          
        </div>

       
      
      </footer>
  )
}
