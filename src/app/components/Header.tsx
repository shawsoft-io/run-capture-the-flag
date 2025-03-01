'use client';

import Link from 'next/link';
import Navigation from '../components/Navigation';
import TeamToggle from '../components/TeamToggle'
import { useUser } from '@auth0/nextjs-auth0';
import { ExtendedUserProfile } from '@/types/auth0';
import Avatar from './Avatar';
import { useState, useRef, useEffect } from 'react';
import Drawer from './Drawer';
import { Button } from '../components/ui/button'

interface NavigationItem {
  name: string;
  href: string;
  button: boolean;
}

const userNavigation: NavigationItem[] = [
  { name: 'View Profile', href: '/athlete/profile', button: false },
  { name: 'Sign out', href: '/auth/logout', button: true },
];

export default function Header() {
  const user = useUser().user as ExtendedUserProfile;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside (for dropdown)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (!isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  return (
    <div className="fixed w-full z-[999]">
      {/* MAIN BLACK HEADER */}
      <nav className="bg-dark h-20">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
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


           {/* TEAM / INDIVIDUAL CONTEXT */}
            <div className="flex ml-auto pr-6 justify-end">
              <TeamToggle />
            </div>

            {/* USER MENU */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`relative flex max-w-xs mask mask-squircle items-center bg-hotpink text-sm 
                    focus:border-3 active:border-4 border-hotpink transition-all duration-200
                    ${menuOpen ? 'border-4 border-hotpink' : ''}`}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <Avatar user={user} className="h-14 w-14" />
                </button>

                {/* DESKTOP MENU */}
                {!isMobile && menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg 
                    ring-1 ring-black/5 transition-opacity duration-200 ease-out"
                  >
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </nav>


      {/* MOBILE MENU */}
      <Drawer isOpen={isMobile && menuOpen} onClose={() => setMenuOpen(false)}>
        {userNavigation.map((item) => (
          item.button ? (
            <Button
              key={item.name}
              className="w-full h-14 px-4 p-3 text-xl bg-black hover:bg-gray-800 rounded-lg text-center text-white mb-5"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              {item.name}
            </Button>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className="h-14 block px-4 py-3 text-xl text-gray-700 text-center mb-2 border border-gray-300 rounded-md "
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          )
        ))}
      </Drawer>

      {/* LOGGED IN CONTEXT MENU */}
      <Navigation user={user} />
    </div>
  );
}