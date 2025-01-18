'use client'
import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

const navigation = [
    { name: 'My Activity', href: '/my-activity', admin: false, current: true },
    { name: 'Rankings', href: '/ranking', admin: false, current: false },    
    { name: 'Cities', href: '/cities', admin: false, current: false },
    { name: 'Admin', href: '/admin', admin: true, current: false },
  ]

function classNames(...classes : string[]) {
return classes.filter(Boolean).join(' ')
}


export default function Page()
{
    const { user} = useUser()
    
    if(user)
    return(
            <div className="pt-10 bg-gray-100 shadow-md">
              <header>
                <div className="flex mx-auto max-w-7xl pb-4 px-4 sm:px-6 lg:px-8 gap-x-10 ">
                <div className="flex gap-x-10 overflow-x-auto whitespace-nowrap pr-4 scrollbar-hiden">
                {navigation.map((item) => {
                      if (item.admin && user?.role !== "admin") {
                        return null; 
                      }
                    
                      return (                    
                          <Link
                            key={item.name}
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                              item.current ? 'text-black font-[900] border-b-[10px] '  : 'text-gray-500 hover:text-black font-[100] hover:border-b-[10px]',
                              'text-3xl flex-col justify-middle border-hotpink',
                            )}
                          >
                            {item.name}
                          </Link>
                      )
                        })}
                        </div>
                </div>
              </header>
            </div>
            
    )
}