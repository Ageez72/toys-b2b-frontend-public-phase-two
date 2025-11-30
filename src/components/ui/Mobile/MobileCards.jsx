import React from 'react'
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../context/AppContext";
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import Link from 'next/link';
import img1 from "../../../assets/imgs/mobile/1.png";
import img2 from "../../../assets/imgs/mobile/2.png";
import img3 from "../../../assets/imgs/mobile/3.png";
import img4 from "../../../assets/imgs/mobile/4.png";
import img5 from "../../../assets/imgs/mobile/5.png";
import img6 from "../../../assets/imgs/mobile/6.png";

export default function MobileCards() {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (

        <div className="mobile-card-boxes grid grid-cols-2 gap-4 my-8">
            <div className="card-box">
                <Link href="/top-items">
                    <span>{translation.mostSelling}</span>
                    <img src={img1.src} alt="Card 1" />
                </Link>
            </div>
            <div className="card-box">
                <Link href="/products?itemType=NEW ARRIVAL&itemStatus=AVAILABLE">
                    <span>{translation.newArrivals}</span>
                    <img src={img2.src} alt="Card 2" />
                </Link>
            </div>
            <div className="card-box">
                <Link href="/products?itemType=GIVEAWAY&itemStatus=AVAILABLE">
                    <span>{translation.offers}</span>
                    <img src={img3.src} alt="Card 3" />
                </Link>
            </div>
            <div className="card-box">
                <Link href="/products?itemType=FEATURED&itemStatus=AVAILABLE">
                    <span>{translation.featuredProducts}</span>
                    <img src={img4.src} alt="Card 4" />
                </Link>
            </div>
            <div className="card-box">
                <Link href="/products?itemType=CLEARANCE&itemStatus=AVAILABLE">
                    <span>{translation.clearance}</span>
                    <img src={img5.src} alt="Card 5" />
                </Link>
            </div>
            <div className="card-box">
                <Link href="/products?itemType=COMMING SOON&itemStatus=AVAILABLE">
                    <span>{translation.commingSoon}</span>
                    <img src={img6.src} alt="Card 6" />
                </Link>
            </div>
        </div>
    )
}
