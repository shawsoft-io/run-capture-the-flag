import Link from "next/link";
import React
 from "react";
export default function LogoutButton() {
  return (
    <Link
      href="/api/auth/logout"
      className="bg-white font-bold text-black border-black border-2 py-2 px-4 rounded w-full justify-center text-center lg:w-auto hover:bg-gray-100 focus:outline-none"
    >
      Sign Out
    </Link>
  );
}