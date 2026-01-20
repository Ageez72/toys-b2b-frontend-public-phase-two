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
import Cookies from 'js-cookie';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import SuccessModal from './SuccessModal';
import axios from 'axios';

export default function ProductCard({ type, badgeType, related, item }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // fallback to Arabic
    const profileData = getProfile();
    const siteLocation = Cookies.get("siteLocation")
    const [isRequestBtnActive, setIsRequestBtnActive] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
    }, [state.LANG]);
    const router = useRouter();

    useEffect(() => {
        if (item?.productRequested) {
            setIsRequestBtnActive(false)
        }
    }, [item])

    const requestOutofStock = async (id) => {
        const lang = state.LANG || 'EN';
        const res = await axios.get(
            `${BASE_API}${endpoints.products.requestOutOfStock}&itemid=${id}&lang=${lang}&token=${Cookies.get('token')}`
        );
        try {
            if (!res.data.error) {
                setModalTitle(translation[res.data.message] || translation.productRequest)
                setIsModalOpen(true);
                setIsRequestBtnActive(false);
            } else {
                // setIsErrorModalOpen(true)
            }
        } catch (error) {
            setIsModalOpen(false);
        }

    }

    const rate = item?.reviews.rating || 0;
    return (
        <div className={`card product-card ${type === 'grid' ? 'grid-card flex items-center gap-3' : 'list-card'}`} id={`product-${item.id}`}>
            <SuccessModal
                icon="icon-box1"
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                message={translation.informYou}
            />
            <div className="product-card-image">
                <Link href={`/products/${encodeURIComponent(item.id)}`} onClick={() => sessionStorage.setItem('scrollToProduct', item.id)}>
                    <img src={item?.images["800"]?.main} alt={item?.name} layout="responsive" title={item.name} />
                </Link>
                <div className='isMobile'>
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
                        profileData.isCorporate || profileData.hideTargetSOA ? (
                            <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                        ) : null
                    }
                    {
                        !profileData.isCorporate || !profileData.hideTargetSOA ? (
                            !item.commingSoon && item.itemdisc > 0 && !item.hideDiscount ? (
                                <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                            ) : null
                        ) : null
                    }
                    {
                        item?.status !== "AVAILABLE" && !item.commingSoon ? (
                            <Badge type={'red'} text={`${translation.notAvailable}`} />
                        ) : null
                    }
                    {
                        profileData?.allQty ? (
                            <>
                                {item.avlqty === 1 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${translation.pieceOne}`}
                                    />
                                )}

                                {item.avlqty > 1 && item.avlqty <= 10 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${item.avlqty > 10
                                            ? translation.pieceOnly
                                            : translation.piecesOnly
                                            }`}
                                    />
                                )}

                                {item.avlqty > 10 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${translation.pieceOnly}`}
                                    />
                                )}

                            </>
                        ) : (
                            <>
                                {item.discountType === 'CLEARANCE' && item.avlqty > 0 && !item.commingSoon && (
                                    <Badge
                                        type={item.discountType === 'CLEARANCE' ? 'red' : undefined}
                                        text={`${translation.only} ${item.avlqty} ${item.avlqty === 1
                                            ? translation.pieceOne
                                            : item.avlqty > 10
                                                ? translation.pieceOnly
                                                : translation.piecesOnly
                                            }`}
                                    />
                                )}

                                {item.discountType !== 'CLEARANCE' && !item.commingSoon &&
                                    item.avlqty > 1 &&
                                    item.avlqty < 10 && (
                                        <Badge
                                            type={item.discountType !== 'CLEARANCE' ? 'red' : undefined}
                                            text={`${translation.only} ${item.avlqty} ${item.avlqty === 1
                                                ? translation.pieceOne
                                                : translation.piecesOnly
                                                }`}
                                        />
                                    )}
                            </>
                        )
                    }
                </div>
            </div>
            <div className="product-card-content">
                <div className='isDesktop'>
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
                        profileData.isCorporate || profileData.hideTargetSOA ? (
                            <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                        ) : null
                    }
                    {
                        !profileData.isCorporate || !profileData.hideTargetSOA ? (
                            !item.commingSoon && item.itemdisc > 0 && !item.hideDiscount ? (
                                <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                            ) : null
                        ) : null
                    }
                    {
                        item?.status !== "AVAILABLE" && !item.commingSoon ? (
                            <Badge type={'red'} text={`${translation.notAvailable}`} />
                        ) : null
                    }
                    {
                        profileData?.allQty ? (
                            <>
                                {item.avlqty === 1 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${translation.pieceOne}`}
                                    />
                                )}

                                {item.avlqty > 1 && item.avlqty <= 10 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${item.avlqty > 10
                                            ? translation.pieceOnly
                                            : translation.piecesOnly
                                            }`}
                                    />
                                )}

                                {item.avlqty > 10 && !item.commingSoon && (
                                    <Badge
                                        type="red"
                                        text={`${translation.only} ${item.avlqty} ${translation.pieceOnly}`}
                                    />
                                )}

                            </>
                        ) : (
                            <>
                                {item.discountType === 'CLEARANCE' && item.avlqty > 0 && !item.commingSoon && (
                                    <Badge
                                        type={item.discountType === 'CLEARANCE' ? 'red' : undefined}
                                        text={`${translation.only} ${item.avlqty} ${item.avlqty === 1
                                            ? translation.pieceOne
                                            : item.avlqty > 10
                                                ? translation.pieceOnly
                                                : translation.piecesOnly
                                            }`}
                                    />
                                )}

                                {item.discountType !== 'CLEARANCE' && !item.commingSoon &&
                                    item.avlqty > 1 &&
                                    item.avlqty < 10 && (
                                        <Badge
                                            type={item.discountType !== 'CLEARANCE' ? 'red' : undefined}
                                            text={`${translation.only} ${item.avlqty} ${item.avlqty === 1
                                                ? translation.pieceOne
                                                : translation.piecesOnly
                                                }`}
                                        />
                                    )}
                            </>
                        )
                    }
                </div>
                <h2 className="product-card-title cursor-pointer short-title" title={item.name}>
                    <Link href={`/products/${encodeURIComponent(item.id)}`} onClick={() => sessionStorage.setItem('scrollToProduct', item.id)}>
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
                <div className="isDesktop">
                    <div className="stars flex items-center gap-1">
                        <StarsRate rate={rate} />
                    </div>
                </div>
                <div className="price flex items-center gap-3">
                    {
                        !item.commingSoon ? (
                            item.itemdisc > 0 && !item.hideDiscount ? (
                                <>
                                    <span className="product-card-price">
                                        <span className="price-number">{Number(item?.priceAfterDisc).toFixed(2)}</span>
                                        <span className="price-unit mx-1">
                                            {siteLocation === "primereach" ? translation.iqd : translation.jod}
                                        </span>
                                    </span>
                                    <span className="price-number discount">{Number(item?.price).toFixed(2)} {siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                                </>
                            ) : (
                                <span className="product-card-price">
                                    <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                                    <span className="price-unit mx-1">
                                        {siteLocation === "primereach" ? translation.iqd : translation.jod}
                                    </span>
                                </span>
                            )
                        ) : null
                    }

                </div>
                {
                    item?.status === "AVAILABLE" && !item.commingSoon ? (
                        <AddToCart item={item} />
                    ) : null
                }

                {
                    item?.status !== "AVAILABLE" && (
                        !item.commingSoon ? (
                            <button className={`primary-btn w-full block request-when-available ${isRequestBtnActive ? '' : 'disabled'}`} onClick={() => requestOutofStock(item?.id)}>{item?.productRequested ? translation.toldMe : translation.tellMe}</button>
                        ) : null
                    )
                }

                {item.commingSoon && <p className={`out-stock-btn yellow`}>{translation.availableSoon}</p>
                }

            </div>
        </div>
    )
}
