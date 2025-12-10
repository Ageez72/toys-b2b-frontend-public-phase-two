"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import heroLeft from "../../assets/imgs/hero-left.png";
import heroRight from "../../assets/imgs/hero-right.png";
import AddBulkModal from './AddBulkModal';
import SidebarModal from './SideModal';
import QuickAdd from './QuickAdd';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from "../../../context/AppContext";

// fallback images
import fallbackDesktopImage from "../../assets/imgs/hero-bg.png";
import fallbackMobileImage from "../../assets/imgs/hero-bg.png";

export default function Hero({
    desktopImage = fallbackDesktopImage.src,
    mobileImage = fallbackMobileImage.src,
    exist
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
        document.title = state.LANG === 'AR' ? ar.alekha : en.alekha;
    }, [state.LANG]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const backgroundImage = isMobile ? mobileImage : desktopImage;

    return (
        <>
            <SidebarModal
                open={isSidebarModalOpen}
                onClose={() => {
                    setIsSidebarModalOpen(false);
                    document.body.classList.remove("html-overflow");
                }}
            />
            <AddBulkModal
                open={isModalOpen}
                onClose={() => {
                    document.body.classList.remove("clear-html");
                    setIsModalOpen(false);
                }}
            />
            <div
                className="hero-section"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="hero-content">
                    <h1 className="hero-title text-center">{translation.heroTitle}</h1>
                    <QuickAdd openSidebar={() => setIsSidebarModalOpen(true)} />
                    <button
                        className="add-bulk-open-btn"
                        onClick={() => {
                            document.body.classList.add("clear-html");
                            setIsModalOpen(true);
                        }}
                    >
                        <i className="icon-element-plus"></i>
                        {translation.bulkTitle}
                    </button>
                </div>
                {
                    !exist && (
                        <div className="hero-images">
                            <Image
                                className="logo-img hero-side-image left"
                                src={heroLeft}
                                alt="Hero Left"
                                fill
                                style={{ objectFit: "contain" }}
                            />
                            <Image
                                className="logo-img hero-side-image right"
                                src={heroRight}
                                alt="Hero Right"
                                fill
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    )
                }
                {
                    !exist && (
                        <h2 className="adds-title">
                            Regional Leaders<br /> In Toy Distribution
                        </h2>
                    )
                }
            </div>
        </>
    );
}
