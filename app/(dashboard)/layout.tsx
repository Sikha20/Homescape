import NavBar from '@/components/NavBar'
import { Poppins } from 'next/font/google'
import React from 'react'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
})


function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${poppins.className}`}>
            <NavBar />
            {children}
        </div>
    )
}

export default layout
