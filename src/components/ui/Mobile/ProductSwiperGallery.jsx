'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export default function ProductSwiperGallery({ images }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

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
        <div className="product-swiper-gallery">

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
