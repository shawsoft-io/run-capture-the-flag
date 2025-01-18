import React
 from "react";
export default function LogoutButton() {
  return (
    <a
      href="/api/auth/logout"
      className="bg-white font-bold text-black border-black border-2 py-2 px-4 rounded w-full lg:w-auto hover:bg-gray-100 focus:outline-none"
    >
      Sign Out
    </a>
  );
}