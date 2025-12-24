import React, { Suspense } from 'react'
import OrderDetails from '@/pages/OrderDetails/OrderDetails'

export default function page() {
    return (
        <div className="max-w-screen-xl mx-auto pt-0 p-4 order-details section-min">
            <Suspense fallback={<div>Loading...</div>}>
                <OrderDetails />
            </Suspense>
        </div>
    )
}
