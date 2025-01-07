import { auth } from '../../auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  
  const session = await auth()
  
  if (!session) redirect('/login')
  

  return (
    
    <div className="flex flex-col items-center justify-center  h-full py-20 gap-y-5">
      
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
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
            <strong>Name:</strong> {session?.user?.name || 'N/A'}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {session?.user?.role || 'N/A'}
          </p>
          <p className="text-lg">
            <strong>Verified:</strong> {session?.user?.verified ? 'Yes' : 'No'}
          </p>

        </div>
      </div>

      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Strava Sync History</h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-x-2">
      
      
          </div>
        </div>
      </div>

      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-x-2">
          <button
            className="mt-4 bg-hotpink text-white py-2 px-4 rounded hover:bg-pink-500 focus:outline-none"
          >
            Delete Account
          </button>

          <button
            className="mt-4 bg-white text-black border-black border-2 py-2 px-4 rounded hover:bg-gray-100 focus:outline-none"
          >
            Sign Out
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

