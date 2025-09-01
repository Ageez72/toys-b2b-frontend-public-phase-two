'use client'
import React, { useState, useEffect } from 'react';
import RateModal from './RateModal'
import RateRemoveModal from './RateRemoveModal';
import Rate from './Rate'
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { BASE_API, endpoints } from '../../../constant/endpoints';
import { useAppContext } from '../../../context/AppContext';
import { getProfile } from '@/actions/utils';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function RateCard({ reviews, id, onRefresh }) {
    const [open, setOpen] = useState(false)
    const [openRemoveModal, setOpenRemoveModal] = useState(false)
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);


    const handleSubmitRate = async () => {
        const storedprofile = getProfile();

        try {
            // setLoading(true);
            const response = await axios.get(`${BASE_API}${endpoints.products.removeReview}&token=${Cookies.get('token')}&id=${id}&username=${storedprofile.username}`);
            if (response.data && !response.data.ERROR) {
                console.log(response.data);
                onRefresh && onRefresh()
                setOpenRemoveModal(false)
            } else {
                console.log('Error in ADD ORDER:', response.data);
            }
        } catch (error) {
            console.error('Order submission failed:', error);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <>
            <div className='card mt-12'>
                <div className="flex justify-between">
                    <h3 className="sub-title">{translation.productReviews}</h3>
                    {/* {
                        !reviews.length ? (
                            <button onClick={() => setOpen(true)} type="button" className="rate-button py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none cursor-pointer rounded border border-gray-200 bg-gray-100 hover:bg-white hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all">
                                <i className="icon-add"></i>
                                <span>{translation.addReview}</span>
                            </button>
                        ) : null
                    } */}
                </div>
                {
                    reviews.length ? (
                        reviews?.map((review, index) => (
                            <Rate item={review} key={index} onOpen={() => setOpenRemoveModal(true)} />
                        ))
                    ) : (
                        <>
                            <div className='empty-state text-center mb-10'>
                                <svg className='m-auto my-8' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                                    <rect width="260" height="260" rx="130" fill="url(#paint0_linear_239_7570)" />
                                    <path d="M138.667 104.067L147.467 121.667C148.667 124.067 151.867 126.467 154.534 126.867L170.467 129.533C180.667 131.267 183.067 138.6 175.734 145.933L163.334 158.333C161.267 160.4 160.067 164.467 160.734 167.4L164.267 182.8C167.067 194.933 160.601 199.667 149.867 193.333L134.934 184.467C132.2 182.867 127.8 182.867 125.067 184.467L110.134 193.333C99.4004 199.667 92.9337 194.933 95.7337 182.8L99.2672 167.4C99.9339 164.533 98.7338 160.467 96.6671 158.333L84.2672 145.933C76.9339 138.6 79.3337 131.2 89.5337 129.533L105.467 126.867C108.134 126.4 111.334 124.067 112.534 121.667L121.334 104.067C126.067 94.5334 133.934 94.5334 138.667 104.067Z" fill="#7E818E" />
                                    <path opacity="0.4" d="M90 115C87.2667 115 85 112.733 85 110V63.3334C85 60.6 87.2667 58.3334 90 58.3334C92.7333 58.3334 95 60.6 95 63.3334V110C95 112.733 92.7333 115 90 115Z" fill="#7E818E" />
                                    <path opacity="0.4" d="M170 115C167.267 115 165 112.733 165 110V63.3334C165 60.6 167.267 58.3334 170 58.3334C172.733 58.3334 175 60.6 175 63.3334V110C175 112.733 172.733 115 170 115Z" fill="#7E818E" />
                                    <path opacity="0.4" d="M130 81.6667C127.267 81.6667 125 79.4 125 76.6667V63.3334C125 60.6 127.267 58.3334 130 58.3334C132.733 58.3334 135 60.6 135 63.3334V76.6667C135 79.4 132.733 81.6667 130 81.6667Z" fill="#7E818E" />
                                    <defs>
                                        <linearGradient id="paint0_linear_239_7570" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E9EBED" />
                                            <stop offset="1" stopColor="white" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <h2 className='sub-title mb-4'>{translation.noReviews}</h2>
                                {
                                    !reviews.length ? (
                                        <button onClick={() => setOpen(true)} type="button" className="primary-btn">
                                            <i className="icon-add"></i>
                                            <span>{translation.addReview}</span>
                                        </button>
                                    ) : null
                                }
                            </div>
                        </>
                    )
                }
                {/* <button className="view-more-reviews cursor-pointer w-full">
                    عرض المزيد من التقييمات
                </button> */}
            </div>
            <RateModal itemId={id} open={open} setOpen={() => setOpen(false)} onRefresh={onRefresh} />
            <RateRemoveModal open={openRemoveModal} setOpen={() => setOpenRemoveModal(false)} OnSubmit={handleSubmitRate} />
        </>
    )
}
