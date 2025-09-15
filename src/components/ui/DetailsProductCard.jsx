"use client";
import React, { useState, useEffect } from 'react';
import StarsRate from './StarsRate';
import Link from 'next/link';
import AddToCart from './AddToCart';
import Badge from './Badge';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import Cookies from 'js-cookie';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

export default function DetailsProductCard({ item }) {
    const { state = {} } = useAppContext() || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalmessage] = useState("");
    const [isRequestBtnActive, setIsRequestBtnActive] = useState(true);
    const [translation, setTranslation] = useState(ar); // fallback to Arabic

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
        document.title = state.LANG === 'AR' ? item.name : item.name;
    }, [state.LANG]);

    useEffect(() => {
        if (item?.productRequested) {
            setIsRequestBtnActive(false)
        }
    }, [item])

    const lang = state.LANG || 'EN';

    const rate = item?.reviews.rating || 0;


    const requestOutofStock = async (id) => {
        const res = await axios.get(
            `${BASE_API}${endpoints.products.requestOutOfStock}&itemid=${id}&lang=${lang}&token=${Cookies.get('token')}`
        );
        try {
            if (!res.data.error) {
                setModalTitle(translation[res.data.message] || translation.productRequest)
                setIsModalOpen(true);
                setIsRequestBtnActive(false);
            } else {
                setIsErrorModalOpen(true)
            }
        } catch (error) {
            setIsModalOpen(false);
        }

    }
    return (
        <div className="card product-card">
            <SuccessModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                message={translation.informYou}
            />
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={translation.error}
                message={translation.errorHappened}
            />
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
                    item.itemdisc > 0 && (
                        <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                    )
                }
                {
                    item.discountType === 'CLEARANCE' && item.avlqty > 0 && (
                        <Badge type={item.discountType === 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : item.avlqty > 10 ? translation.pieceOnly : translation.piecesOnly}`} />
                    )
                }
                {
                    item.discountType !== 'CLEARANCE' && item.avlqty < 10 && item.avlqty > 1 && (
                        <Badge type={item.discountType !== 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : translation.piecesOnly}`} />
                    )
                }
                <h1 className="product-card-title details-product-card-title" title={item.name}>{item.name}</h1>
                <h3 className="font-bold sku-number">{item?.id}</h3>
                <p className="product-card-description">
                    <Link href={`/products?brand=${item?.brand?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-brand">{item?.brand?.description}</span>
                    </Link>
                    <span className='mx-1'>-</span>
                    <Link href={`/products?category=${item?.category?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-category">{item?.category?.description}</span>
                    </Link>
                </p>

                {
                    !item.commingSoon && (
                        <div className="price flex items-center gap-3">
                            <span className="product-card-price">
                                {/* <span className="price-number">{Number(item?.priceAfterDisc).toFixed(2)}</span> */}
                                <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                                <span className="price-unit mx-1">{translation.jod}</span>
                            </span>
                        </div>
                    )
                }

                {/* {
                        item?.itemdisc ? (
                            <span className='flex gap-1 discount'>
                                <span>{Number(item?.price).toFixed(2)}</span>
                                <span>{translation.jod}</span>
                            </span>
                        ) : ""
                    } */}

                <div className="stars flex items-center gap-2">
                    <StarsRate rate={rate} />
                    {/* <span className="rate-number">{`(${item?.reviews?.reviews?.length || 0} ${translation.reviews})`}</span> */}
                </div>
                <p className="product-description" dangerouslySetInnerHTML={{ __html: item?.description }} />
                {
                    item?.status === "AVAILABLE" && !item.commingSoon ? (
                        <AddToCart item={item} />
                    ) : (
                        <>
                            {/* <p className={`out-stock-btn ${!item.commingSoon ? '' : 'yellow'}`}>{!item.commingSoon ? translation.notAvailable : translation.availableSoon}</p> */}
                            <p className={`out-stock-btn-new flex items-center gap-2 ${!item.commingSoon ? 'not-exist' : 'yellow'}`}><span className="icon-tick-circle"></span> {!item.commingSoon ? translation.notAvailable2 : translation.availableSoon}</p>
                            <button className={`primary-btn ${isRequestBtnActive ? '' : 'disabled'}`} onClick={() => requestOutofStock(item?.id)}>أبلغني عند التوفر</button>
                        </>
                    )
                }
            </div>
        </div>
    )
}
