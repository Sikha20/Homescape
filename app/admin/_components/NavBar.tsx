// "use client"
// import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
// import { Menu } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import React, { useState, useEffect } from 'react'

// function NavBar() {
//     const [showMenu, setShowMenu] = useState(false);
    
//     // Close menu when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             const menu = document.getElementById('mobile-menu');
//             if (menu && !menu.contains(event.target as Node)) {
//                 setShowMenu(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     return (
//         <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     <Link href={"/"}>
//                         <div className="flex items-center space-x-2">
//                             <Image 
//                                 className='h-10 w-10 sm:h-12 sm:w-12' 
//                                 src={"/logo.png"} 
//                                 alt={'logo'} 
//                                 height={48} 
//                                 width={48}
//                                 priority 
//                             />
//                             <span className='text-sm sm:text-xl font-semibold'>Rent Ease</span>
//                         </div>
//                     </Link>
                    
//                     <div className='flex items-center space-x-4'>
//                         <button className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
//                             Admin Panel
//                         </button>

//                         <SignedIn>
//                             <div className='flex items-center'>
//                                 <UserButton afterSignOutUrl="/" />
//                             </div>
//                         </SignedIn>
                        
//                         <SignedOut>
//                             <div className='md:hidden relative' id="mobile-menu">
//                                 <button
//                                     onClick={() => setShowMenu(!showMenu)}
//                                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                                     aria-label="Menu"
//                                 >
//                                     <Menu size={24} />
//                                 </button>
//                                 {showMenu && (
//                                     <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
//                                         <Link href={"/sign-in"}>
//                                             <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                                 Sign In
//                                             </div>
//                                         </Link>
//                                         <Link href={"/sign-up"}>
//                                             <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
//                                                 Sign Up
//                                             </div>
//                                         </Link>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className='hidden md:flex items-center space-x-3'>
//                                 <Link href={"/sign-in"}>
//                                     <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 rounded-md transition-colors">
//                                         Sign In
//                                     </button>
//                                 </Link>
//                                 <Link href={"/sign-up"}>
//                                     <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
//                                         Sign Up
//                                     </button>
//                                 </Link>
//                             </div>
//                         </SignedOut>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     )
// }

// export default NavBar



"use client"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href={"/"}>
                        <div className="flex items-center space-x-2">
                            <Image 
                                className='h-10 w-10 sm:h-12 sm:w-12' 
                                src={"/logo.png"} 
                                alt={'logo'} 
                                height={48} 
                                width={48}
                                priority 
                            />
                            <span className='text-sm sm:text-xl font-semibold'>Rent Ease</span>
                        </div>
                    </Link>
                    
                    <div className='flex items-center space-x-4'>
                        <button className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                            Admin Panel
                        </button>

                        <SignedIn>
                            <div className='flex items-center'>
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </SignedIn>
                        
                        <SignedOut>
                            <div className='md:hidden relative' id="mobile-menu">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Menu"
                                >
                                    <Menu size={24} />
                                </button>
                                {showMenu && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'>
                                        <Link href={"/sign-in"}>
                                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                Sign In
                                            </div>
                                        </Link>
                                        <Link href={"/sign-up"}>
                                            <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                Sign Up
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className='hidden md:flex items-center space-x-3'>
                                <Link href={"/sign-in"}>
                                    <button className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 rounded-md transition-colors">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href={"/sign-up"}>
                                    <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar

