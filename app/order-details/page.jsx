import React, { Suspense } from 'react'
import Loader from '@/components/ui/Loaders/Loader'
import OrderDetails from '@/pages/OrderDetails/OrderDetails'

export default function page() {
    return (
        <div className="max-w-screen-xl mx-auto pt-0 p-4 order-details section-min">
            <Suspense fallback={<Loader />}>
                <OrderDetails />
            </Suspense>
        </div>
    )
}
