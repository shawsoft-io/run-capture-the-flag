'use client'
import LogoutButton from '../../../components/LogoutButton'
import Authorization from '../../../components/Authorization'

export default function Page() {
  
  return (
    <Authorization>
      {(user) => 
    <div className="flex mt-48 lg:flex-row flex-col mx-auto max-w-7xl pb-4 px-4 sm:px-6 lg:px-8 gap-x-10 lg:items-start items-center py-12 space-y-5 lg:space-y-0">
      {/* Left Column */}
      <div className="flex flex-col lg:w-1/3 w-full max-w-lg space-y-5">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
          <div className="flex flex-col items-center space-y-4">
            {user?.picture ? (
              <img
                src={user?.picture}
                alt="Profile"
                className="w-32 h-32 rounded-full shadow-lg"
              />
            ) : (
              <span className="flex items-center justify-center text-3xl font-extrabold text-gray-500 bg-gray-200 w-32 h-32 rounded-full">
                ??
              </span>
            )}
 
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-md font-bold text-black sm:pl-0 flex justify-between items-center gap-x-2">
                    {user?.name || "N/A"}</td>
                  <td>
                    <span className="inline-flex items-center rounded-md bg-pink-400/10 px-4 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
                      {user?.['https://run.shawsoft.io/roles'] || "n/a"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-semibold text-black sm:pl-0">Athlete ID</td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{user?.['https://run.shawsoft.io/athleteId'] || "n/a"}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs font-semibold text-black sm:pl-0">Verified</td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{user?.name ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        {/* Buttons Section */}
        <div className="bg-white shadow-md rounded-lg w-full ">
          <div className="flex flex-col  h-full space-y-4">
            <div className="flex flex-col justify-center items-center lg:flex-row gap-y-2 lg:gap-y-0 lg:gap-x-2 w-full px-5 py-5">
              <button
                type="submit"
                className="bg-black font-bold text-white py-2 px-4 border-2 border-black rounded w-full lg:w-auto hover:bg-black focus:outline-none"
              >
                Sync
              </button>
              <button
                className="bg-black font-bold text-white py-2 px-4 border-2 border-black rounded w-full lg:w-auto hover:bg-black focus:outline-none"
              >
                Delete Account
              </button>
              <LogoutButton/>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-2/3 w-full min-w-lg bg-white shadow-md rounded-lg hidden lg:block">
        <h1 className="text-2xl font-bold text-center mb-4">Strava Sync History</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-x-2">{/* Sync history content here */}</div>
        </div>
      </div>
    </div>
    }
    </Authorization>
  );
}