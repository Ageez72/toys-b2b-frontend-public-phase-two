"use client"
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
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
import logoPattern from "../../assets/imgs/logo-pattern.svg"

export default ({ title, route, badgeType, type, id }) => {
    const { push } = useRouter();
    const lang = Cookies.get('lang') || 'AR';
    async function fetchHomeProducts() {
        let url;
        if (type === "FEATURED") {
            url = `${BASE_API}${endpoints.products.list}&itemType=FEATURED&pageSize=12&itemStatus=AVAILABLE&lang=${lang}&token=${Cookies.get('token')}`;
        } else {
            url = `${BASE_API}${endpoints.products.list}&topitems=${type}&pageSize=12&itemStatus=AVAILABLE&lang=${lang}&token=${Cookies.get('token')}`;
        }
        const res = await axios.get(url, {});
        return res;
    }
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    const [soonDisplay, setSoonDisplay] = useState(false)
    const [clearanceDisplay, setClearanceDisplay] = useState(false)
    const [newArivalsDisplay, setNewArivals] = useState(false)
    const [giveawayDisplay, setGiveawayDisplay] = useState(false)

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    const { data, isLoading, error } = useQuery({
        queryKey: [type],
        queryFn: fetchHomeProducts,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (!data) return;
        const cookieKey = `has_items_${type.replace(/\s+/g, '_')}`;
        const hasItems = data?.data?.items?.length > 0 ? true : false;

        Cookies.set(cookieKey, hasItems.toString());
        dispatch({ type: cookieKey, payload: hasItems });
    }, [data, type, dispatch]);

    if (isLoading) return <HorizontalLoader />;
    if (error instanceof Error) return push("/");

    return (
        <>
            {
                data?.data?.items.length ? (
                    <div className={`${data?.data?.items?.length === 3 && "just-four-items"} columnGridSwiper-container`}>
                        <img className='logo-pattern' src={logoPattern.src} alt="logo Pattern" />
                        <div className="max-w-screen-xl mx-auto px-4 custom-py-40">
                            <div className="grid-card-container columnGridSwiper" id={id}>
                                <div className="grid-header w-full flex items-center justify-between">
                                    <h2 className='grid-header-title'>{title}</h2>
                                </div>
                                <Swiper
                                    dir={state.LANG === "AR" ? "rtl" : "ltr"}
                                    modules={[Navigation]}
                                    navigation
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    slidesPerGroup={1}
                                    className={`${data?.data?.items?.length <= 3 && "just-four-items"}`}
                                    breakpoints={{
                                        320: {    // screens >= 320px
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                        },
                                        760: {    // screens >= 640px
                                            slidesPerView: 2,
                                            spaceBetween: 10,
                                        },
                                        1024: {   // screens >= 1024px
                                            slidesPerView: 2,
                                            spaceBetween: 10,
                                        },
                                        1160: {   // screens >= 1024px
                                            slidesPerView: 3,
                                            spaceBetween: 20,
                                        },
                                        1320: {   // screens >= 1024px
                                            slidesPerView: 4,
                                            spaceBetween: 20,
                                        },
                                    }}
                                >
                                    {
                                        data?.data?.items?.map((item, i) => (
                                            <SwiperSlide key={item.id}><ProductCard item={item} type="h" badgeType={badgeType} /></SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                ) : ""
            }
        </>
    );
};