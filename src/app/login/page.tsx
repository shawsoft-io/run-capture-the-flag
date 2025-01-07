import { signIn, auth } from "../auth"
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();

  if(session) redirect('/dashboard');

  return (
    <>

      <div className="flex flex-col py-12 px-4 sm:px-6 lg:px-8 bg-hotpink z-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt=""
            src="/run-3d.png"
            className="mx-auto h-[260px] sm:h-18 w-auto"
          />
          <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-white">
          Lace up and sign in 
          </h2>
        </div>

        <div className="sm:mx-auto p-10 sm:w-full sm:max-w-[500px]">
          <div className="bg-gray-50 px-6 py-12 shadow rounded-md sm:rounded-lg sm:px-12 text-center">
            

            <div className="">
              
            <form
      action={async () => {
        "use server"
        await signIn("strava", { redirectTo: "/profile"})
      }}
    >
      <button type="submit">
        <img src="button-connect-with-strava.png" alt=""/>
      </button>

<p className="text-gray-500 text-sm pt-5">Don&apos;t have a Strava account? 
  <a href="https://www.strava.com/" className="font-semibold hover:text-gray-700"> Create one here</a>
  </p>
    </form>




            </div>
          </div>

          <p className="mt-10 text-center text-sm/6 text-white">
            Need support?{' '}
            <a href="mailto:support@run.shawsoft.io" className="font-semibold text-white hover:text-gray-200">
              Contact support
            </a>
          </p>
        </div>
      </div>
      
      </>
  );
};
