import React, { Suspense } from 'react'
import PropertyDetailsSkeleton from '../../_components/PropertyDetailsSkeleton'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Suspense fallback={<PropertyDetailsSkeleton />}>
            {children}
        </Suspense>

    )
}
