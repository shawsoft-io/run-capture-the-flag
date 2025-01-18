'use client'
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from 'next/link'
import Navigation from './Navigation'
import { useUser } from '@auth0/nextjs-auth0/client';

const userNavigation = [
  { name: 'View Profile', href: '/profile' },
  { name: 'Sign out', href: '/api/auth/logout' },
]



export default function Header() {

  const { user, isLoading, error } = useUser();

  return (          
      <div className='fixed min-w-full z-[999]'>

        {/* MAIN BLACK HEADER */}
        <Disclosure as="nav" className="bg-dark h-20">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="relative cursor-pointer">
                  <Link href="/">
                    <img
                        alt=""
                        src="/logo-white.png"
                        className="absolute h-8 w-auto transition-opacity duration-300 opacity-100 hover:opacity-0"
                      />
                      <img
                        alt=""
                        src="/logo-outline.png"
                        className="h-8 w-auto transition-opacity duration-300 opacity-100 hover:opacity-100"
                      />
                  </Link>
                </div>
              </div>

                {/* USER MENU */}
              {user && 
              <div className="block">
                <div className="ml-4 flex items-center md:ml-6">

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-hotpink focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only ">Open user menu</span>
                       
                        {user?.picture ? (
                            <img
                            src={user?.picture}
                            alt="Profile"
                            className="size-12 rounded-full"
                            />
                        ) : (    
                            <span className="size-12 rounded-full bg-white py-[14px] font-bold text-center">
                            ??
                            </span>
                        )}

                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            }
            </div>
          </div>
        </Disclosure>
     
        {/* LOGGED IN CONTEXT MENU */}
        <Navigation/>

      </div>

  
  )
}
