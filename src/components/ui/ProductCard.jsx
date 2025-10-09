"use client";
import React, { useState, useEffect } from 'react';
import StarsRate from './StarsRate';
import Badge from "./Badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AddToCart from './AddToCart';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { getProfile } from '@/actions/utils';

export default function ProductCard({ type, badgeType, related, item }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // fallback to Arabic
    const profileData = getProfile();

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
    }, [state.LANG]);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${item.id}`);
    };

    const rate = item?.reviews.rating || 0;
    return (
        <div className={`card product-card ${type === 'grid' ? 'grid-card flex items-center gap-3' : 'list-card'}`}>
            <div className="product-card-image">
                <Link href={`/products/${encodeURIComponent(item.id)}`}>
                    <img src={item?.images["800"]?.main} alt={item?.name} layout="responsive" title={item.name} />
                </Link>
            </div>
            <div className="product-card-content">
                {
                    item.isNew && (
                        <Badge type={item.isNew && 'blue'} text={`${translation.new}`} />
                    )
                }
                {/* {
                    item.commingSoon && (
                        <Badge type={item.commingSoon && 'yellow'} text={`${translation.soon}`} />
                    )
                } */}
                {
                    item.itemdisc > 0 && item.hideDiscount != "false" && (
                        <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                    )
                }
                {
                    profileData?.allQty && item.discountType === 'CLEARANCE' && item.avlqty > 0 && (
                        <Badge type={item.discountType === 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : item.avlqty > 10 ? translation.pieceOnly : translation.piecesOnly}`} />
                    )
                }
                {
                    profileData?.allQty && item.discountType !== 'CLEARANCE' && item.avlqty < 10 && item.avlqty > 1 && (
                        <Badge type={item.discountType !== 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : translation.piecesOnly}`} />
                    )
                }
                <h2 className="product-card-title cursor-pointer short-title" title={item.name}>
                    <Link href={`/products/${encodeURIComponent(item.id)}`}>
                        {item.name}
                    </Link>
                </h2>
                <h3 className="font-bold sku-number">{item?.id}</h3>
                <p className='product-card-description'>
                    <Link href={`/products?brand=${item?.brand?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-brand">{item?.brand?.description}</span>
                    </Link>
                    <span className='mx-1'>-</span>
                    <Link href={`/products?category=${item?.category?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-category">{item?.category?.description}</span>
                    </Link>
                </p>
                <div className="stars flex items-center gap-1">
                    <StarsRate rate={rate} />
                </div>
                <div className="price flex items-center gap-3">
                    {
                        !item.commingSoon && (
                            <span className="product-card-price">
                                {/* <span className="price-number">{Number(item?.priceAfterDisc).toFixed(2)}</span> */}
                                <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                                <span className="price-unit mx-1">{translation.jod}</span>
                            </span>
                        )
                    }
                </div>
                {
                    item?.status === "AVAILABLE" && !item.commingSoon ? (
                        <AddToCart item={item} />
                    ) : (
                        <p className={`out-stock-btn ${!item.commingSoon ? '' : 'yellow'}`}>{!item.commingSoon ? translation.notAvailable : translation.availableSoon}</p>
                    )
                }

            </div>
        </div>
    )
}
