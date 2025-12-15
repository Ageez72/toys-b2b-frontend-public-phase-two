"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import Link from 'next/link';
import { useAppContext } from '../../../context/AppContext';
import ProductCard from './ProductCard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import HorizontalLoader from './Loaders/HorizontalLoader';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function GridSwiper({ title, route, badgeType, type, id }) {

    const { push } = useRouter();
    const lang = Cookies.get('lang') || 'AR';

    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    const { data, isLoading, error } = useQuery({
        queryKey: [type],
        queryFn: async () => {
            return axios.get(
                `${BASE_API}${endpoints.products.list}&itemType=${type}&pageSize=12&itemStatus=AVAILABLE&lang=${lang}&token=${Cookies.get('token')}`
            );
        },
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, err) => {
            if (err?.response?.status === 401) return false;
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (error instanceof Error) {
            push("/");
        }
    }, [error, push]);

    useEffect(() => {
        if (!data) return;
        const cookieKey = `has_items_${type.replace(/\s+/g, '_')}`;
        const hasItems = data?.data?.items?.length > 0 ? true : false;

        Cookies.set(cookieKey, hasItems.toString());
        dispatch({ type: cookieKey, payload: hasItems });
    }, [data, type, dispatch]);

    if (isLoading) return <HorizontalLoader />;

    if (error instanceof Error) return null;

    const items = data?.data?.items || [];

    return (
        <>
            {items.length > 0 && (
                <div>
                    <div className="max-w-screen-xl mx-auto px-4 custom-py-40">
                        <div className="grid-card-container" id={id}>

                            <div className="grid-header w-full flex items-center justify-between">
                                <h2 className="grid-header-title">{title}</h2>

                                <Link href={route} className="outline-btn hidden md:flex items-center gap-2">
                                    {state.LANG === "EN" ? (
                                        <>
                                            <i className="icon-arrow-right-01-round"></i>
                                            <span>{translation.viewMore}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{translation.viewMore}</span>
                                            <i className="icon-arrow-left-01-round"></i>
                                        </>
                                    )}
                                </Link>
                            </div>

                            <Swiper
                                dir={state.LANG === "AR" ? "rtl" : "ltr"}
                                modules={[Navigation, Grid]}
                                navigation
                                spaceBetween={10}
                                slidesPerView={1}
                                slidesPerGroup={1}
                                className={`${items.length <= 4 && "just-four-items"}`}
                                breakpoints={{
                                    320: { slidesPerView: 1, grid: { rows: 1 }, spaceBetween: 10 },
                                    760: { slidesPerView: 1.2, grid: { rows: 1 }, spaceBetween: 10 },
                                    1024: { slidesPerView: 1.2, grid: { rows: 1 }, spaceBetween: 10 },
                                    1160: { slidesPerView: 1.5, grid: { rows: 1 }, spaceBetween: 20 },
                                    1320: { slidesPerView: 2, grid: { rows: 2, fill: 'row' }, spaceBetween: 20 },
                                }}
                            >
                                {items.map(item => (
                                    <SwiperSlide key={item.id}>
                                        <ProductCard item={item} type="grid" badgeType={badgeType} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Link href={route} className="outline-btn inline-flex md:hidden items-center gap-2 mt-4">
                                {state.LANG === "EN" ? (
                                    <>
                                        <i className="icon-arrow-right-01-round"></i>
                                        <span>{translation.viewMore}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{translation.viewMore}</span>
                                        <i className="icon-arrow-left-01-round"></i>
                                    </>
                                )}
                            </Link>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
