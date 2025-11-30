import React from 'react'
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../context/AppContext";
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function FixedMobileMenu() {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);
    const pathname = usePathname();
    const isActive = (path) => pathname === path ? "active" : "";

    return (
        <div className='fixed-mobile-menu isMobile'>
            <div className="grid grid-cols-5 gap-1 h-full">
                <Link className={isActive("/home")} href="/home">
                    <span className='flex flex-col items-center justify-center h-full gap-2'>
                        <i className='icon-home-01'></i>
                        <i className="icon-home-01-1 active"></i>
                        <span className="txt text-center">{translation.mobile.home}</span>
                    </span>
                </Link>
                <Link className={isActive("/products")} href="/products?itemStatus=AVAILABLE">
                    <span className='flex flex-col items-center justify-center h-full gap-2'>
                        <i className='icon-shop'></i>
                        <i className='icon-shop-1 active'></i>
                        <span className="txt text-center">{translation.mobile.marketplace}</span>
                    </span>
                </Link>
                <Link className={isActive("/brands")} href="/brands">
                    <span className='flex flex-col items-center justify-center h-full gap-2'>
                        <i className='icon-medal-star'></i>
                        <i className="icon-medal-star-1 active"></i>
                        <span className="txt text-center">{translation.mobile.brands}</span>
                    </span>
                </Link>
                <Link className={isActive("/cart")} href="/cart">
                    <span className='flex flex-col items-center justify-center h-full gap-2'>
                        <i className='icon-bag-happy'></i>
                        <i className="icon-bag-happy-1 active"></i>
                        <span className="txt text-center">{translation.mobile.bin}</span>
                    </span>
                </Link>
                <Link className={isActive("/profile")} href="/profile?personal">
                    <span className='flex flex-col items-center justify-center h-full gap-2'>
                        <i className='icon-user-03'></i>
                        <i className="icon-user-03-1 active"></i>
                        <span className="txt text-center">{translation.mobile.myAccount}</span>
                    </span>
                </Link>
            </div>
        </div>
    )
}
