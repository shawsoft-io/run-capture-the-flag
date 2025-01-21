'use client';

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useUser } from "@auth0/nextjs-auth0/client";
import { ExtendedUserProfile } from "@/types/auth0";

interface NavigationItem {
  name: string;
  href: string;
  admin: boolean;
}

const navigation: NavigationItem[] = [
  { name: "My Activity", href: "/athlete/dashboard", admin: false },
  { name: "Rankings",    href: "/athlete/ranking",   admin: false },
  { name: "Cities",      href: "/athlete/cities",    admin: false },
  { name: "Admin",       href: "/admin",             admin: true  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const pathname = usePathname();
  const { user } = useUser() as { user: ExtendedUserProfile };

  return (
    <>
      {user && (
        <div className="h-28 pt-10 bg-gray-100 shadow-md">
          <header>
            <div className="flex mx-auto max-w-7xl pb-4 px-4 sm:px-6 lg:px-8 gap-x-10">
              <div className="flex gap-x-10 overflow-x-auto whitespace-nowrap pr-4 scrollbar-hidden">
                {navigation.map((item) => {
                  // Show admin links only if the user has the "admin" role
                  if (item.admin && !user["https://run.shawsoft.io/roles"]?.includes("admin")) {
                    return null;
                  }
                  
                  const isCurrent = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={classNames(
                        isCurrent
                          ? "text-black font-[900] border-b-[10px]"
                          : "text-gray-500 hover:text-black font-[100] hover:border-b-[10px]",
                        "text-3xl flex-col justify-middle border-hotpink"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>
        </div>
      )}
    </>
  );
}