'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { useAppContext } from '../../../../context/AppContext'
import en from '../../../../locales/en.json';
import ar from '../../../../locales/ar.json';
import { createPortal } from "react-dom";

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export default function ProductSwiperGallery({ images }) {
    const [isOpen, setIsOpen] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};

    // Store refs for all mp4 videos
    const videoRefs = useRef([]);

    const isYoutube = (url) =>
        url.includes('youtube.com') || url.includes('youtu.be');

    const isMp4 = (url) =>
        url.toLowerCase().endsWith('.mp4');

    const getYoutubeId = (url) => {
        const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const getYoutubeThumbnail = (url) => {
        const id = getYoutubeId(url);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    };

    // 🔥 STOP all mp4 videos when slide changes
    const stopAllVideos = () => {
        videoRefs.current.forEach(video => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    };

    return (
        <div className="product-swiper-gallery relative">
            {isOpen && typeof window !== "undefined" &&
                createPortal(
                    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white text-3xl z-[1010]"
                        >
                            ✕
                        </button>

                        <div className="w-full max-w-5xl">
                            <Swiper
                                initialSlide={activeIndex}
                                navigation={false}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="popupSwiper"
                            >
                                {images.map((item, index) => {
                                    const youtube = isYoutube(item);
                                    const mp4 = isMp4(item);
                                    const videoId = youtube ? getYoutubeId(item) : null;

                                    return (
                                        <SwiperSlide key={index}>
                                            {youtube && (
                                                <iframe
                                                    width="100%"
                                                    height="500"
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    allowFullScreen
                                                ></iframe>
                                            )}

                                            {!youtube && mp4 && (
                                                <video width="100%" height="500" controls>
                                                    <source src={item} type="video/mp4" />
                                                </video>
                                            )}

                                            {!youtube && !mp4 && (
                                                <img src={item} className="max-h-[90vh] mx-auto" />
                                            )}
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>

                    </div>,
                    document.getElementById("media-popup")
                )
            }
            <button
                onClick={() => setIsOpen(true)}
                className={`absolute top-2 ${state.LANG === 'AR' ? 'right-2' : 'left-2'} z-10 text-white bg-black/50 p-2 rounded-full flex items-center justify-center cursor-pointer`}
            >
                <i className="icon-expand-solid text-xl"></i>
            </button>

            {/* MAIN VIEWER */}
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 card mb-6"
                onSlideChange={(swiper) => {
                    stopAllVideos();            // 🔥 STOP VIDEOS HERE
                    setActiveIndex(swiper.activeIndex);
                }}
            >
                {images.map((item, index) => {
                    const youtube = isYoutube(item);
                    const mp4 = isMp4(item);
                    const videoId = youtube ? getYoutubeId(item) : null;
                    const isActive = index === activeIndex;

                    return (
                        <SwiperSlide key={index}>

                            {/* YOUTUBE */}
                            {youtube && (
                                isActive ? (
                                    <iframe
                                        width="100%"
                                        height="450"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <img src={getYoutubeThumbnail(item)} alt="thumb" />
                                )
                            )}

                            {/* MP4 */}
                            {mp4 && !youtube && (
                                isActive ? (
                                    <video
                                        width="100%"
                                        height="450"
                                        controls
                                        preload="metadata"
                                        ref={el => videoRefs.current[index] = el}   // <-- STORE REF
                                    >
                                        <source src={item} type="video/mp4" />
                                    </video>
                                ) : (
                                    <video
                                        width="100%"
                                        height="450"
                                        muted
                                        preload="metadata"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        <source src={item} type="video/mp4" />
                                    </video>
                                )
                            )}

                            {/* IMAGE */}
                            {!youtube && !mp4 && (
                                <img src={item} alt="image" />
                            )}

                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* THUMBNAILS */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
                breakpoints={{
                    0: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    320: {
                        slidesPerView: 4,
                        spaceBetween: 10,
                    },
                    600: {
                        slidesPerView: 6,
                        spaceBetween: 10,
                    },
                }}
            >
                {images.map((item, index) => {
                    const youtube = isYoutube(item);
                    const mp4 = isMp4(item);
                    const thumb = youtube ? getYoutubeThumbnail(item) : item;

                    return (
                        <SwiperSlide key={index} className="card">

                            {youtube ? (
                                <img src={thumb} alt="thumb" />
                            ) : mp4 ? (
                                <video width="100%" muted preload="metadata">
                                    <source src={item} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={item} alt="thumb" />
                            )}

                        </SwiperSlide>
                    );
                })}
            </Swiper>

        </div>
    );
}
