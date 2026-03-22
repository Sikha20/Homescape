import React, { Suspense } from 'react'
import SinglePropertySkeleton from '../_component/SinglePropertySkeleton'


interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (

        <Suspense fallback={<SinglePropertySkeleton />}>
            {children}
        </Suspense>

    )
}
