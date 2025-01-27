'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import { Typewriter } from "react-simple-typewriter";

export default function LoginPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/athlete/dashboard");
    }
  }, [user, router]);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-hotpink py-12 px-4 px-8 mt-20">
      <div className="text-center">
        <img
          alt="Run 3D Logo"
          src="/run-3d.png"
          className="mx-auto h-[260px] w-auto"
        />
          <div className="h-[150px] mt-10 text-4xl font-bold tracking-tight text-white">
        <Typewriter
          words={
            [
              'Lace up and sign in!', 
              'The running app that chat-gpt built!', 
              'Conquor the world!', 
              'Why did the JavaScript runner keep getting slower?', 
              'Because they couldn’t stop adding more async steps to their route 😊',
              'Let’s just all agree to beat Randle', 
            ]
          }
          loop={true} 
          cursor
          cursorStyle="_"
          typeSpeed={50}
          deleteSpeed={0}
          delaySpeed={2000}
        />
        </div>
      </div>

      <div className="mt-8 sm:w-full sm:max-w-md">
        <div className="bg-gray-50 px-6 py-12 shadow rounded-md sm:px-12 text-center">
          <button
            onClick={handleLogin}
            className="w-full"
            aria-label="Connect with Strava"
          >
            <img
              src="button-connect-with-strava.png"
              alt="Connect with Strava"
              className="mx-auto"
            />
          </button>
          <p className="text-gray-500 text-sm pt-5">
            Don&apos;t have a Strava account?{" "}
            <a
              href="https://www.strava.com/"
              className="font-semibold hover:text-gray-700"
            >
              Create one here
            </a>
          </p>
        </div>

        <p className="mt-10 text-center text-sm text-white">
          Need support?{" "}
          <a
            href="mailto:support@run.shawsoft.io"
            className="font-semibold text-white hover:text-gray-200"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}