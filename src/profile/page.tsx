import { auth } from "../app/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col lg:flex-row items sm:items-center justify-center h-full py-20 gap-y-5 lg:gap-x-5">
      {/* Left Column */}
      <div className="flex flex-col lg:w-1/3 w-full max-w-lg space-y-5">
        {/* Profile Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
          <div className="flex flex-col items-center space-y-4">
            {session?.user?.image ? (
              <img
                src={session.user?.image}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-lg" 
              />
            ) : (
              <span className="flex items-center justify-center text-3xl font-extrabold text-gray-500 bg-gray-200 w-24 h-24 rounded-full">
                {session?.user?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase() || "?"}
              </span>
            )}
            <p className="text-lg">
              <strong>Name:</strong> {session?.user?.name || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Role:</strong> {session?.user?.role || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Verified:</strong> {session?.user?.verified ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-x-2">
              <button
                className="mt-4 bg-hotpink text-white py-2 px-4 rounded hover:bg-pink-500 focus:outline-none"
              >
                Delete Account
              </button>
              <button
                type="submit"
                className="mt-4 bg-white text-black border-black border-2 py-2 px-4 rounded hover:bg-gray-100 focus:outline-none"
              >
                Sign Out Bitc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:w-2/3 w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Strava Sync History</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-x-2">{/* Sync history content here */}</div>
        </div>
      </div>
    </div>
  );
}