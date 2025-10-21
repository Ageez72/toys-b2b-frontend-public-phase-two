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
import { getProfile } from '@/actions/utils';

export default function DetailsProductCard({ item }) {
    const { state = {} } = useAppContext() || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalmessage] = useState("");
    const [isRequestBtnActive, setIsRequestBtnActive] = useState(true);
    const [translation, setTranslation] = useState(ar); // fallback to Arabic
    const profileData = getProfile();
    const siteLocation = Cookies.get("siteLocation")

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
                icon="icon-box1"
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
                    item.itemdisc > 0 && !item.hideDiscount && (
                        <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                    )
                }
                {
                    profileData?.allQty ? (
                        <>
                            {item.avlqty === 1 && (
                                <Badge
                                    type="red"
                                    text={`${translation.only} ${item.avlqty} ${translation.pieceOne}`}
                                />
                            )}

                            {item.avlqty > 1 && item.avlqty <= 10 && (
                                <Badge
                                    type="red"
                                    text={`${translation.only} ${item.avlqty} ${item.avlqty > 10
                                            ? translation.pieceOnly
                                            : translation.piecesOnly
                                        }`}
                                />
                            )}

                            {item.avlqty > 10 && (
                                <Badge
                                    type="red"
                                    text={`${translation.only} ${item.avlqty} ${translation.pieceOnly}`}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {/* Clearance badge when quantity > 0 */}
                            {item.discountType === 'CLEARANCE' && item.avlqty > 0 && (
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

                            {/* Non-clearance badge when quantity between 2 and 9 */}
                            {item.discountType !== 'CLEARANCE' &&
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
                                <span className="price-unit mx-1">{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
                            </span>
                        </div>
                    )
                }

                {/* {
                        item?.itemdisc ? (
                            <span className='flex gap-1 discount'>
                                <span>{Number(item?.price).toFixed(2)}</span>
                                <span>{siteLocation === "primereach" ? translation.iqd : translation.jod}</span>
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
                            {
                                item.commingSoon && (
                                    <p className={`out-stock-btn ${!item.commingSoon ? '' : 'yellow'}`}>{translation.availableSoon}</p>
                                )
                            }
                            {
                                !item.commingSoon && (
                                    <p className={`out-stock-btn-new flex items-center gap-2 ${!item.commingSoon ? 'not-exist' : 'yellow mb-0'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM11.25 8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V13C12.75 13.41 12.41 13.75 12 13.75C11.59 13.75 11.25 13.41 11.25 13V8ZM12.92 16.38C12.87 16.51 12.8 16.61 12.71 16.71C12.61 16.8 12.5 16.87 12.38 16.92C12.26 16.97 12.13 17 12 17C11.87 17 11.74 16.97 11.62 16.92C11.5 16.87 11.39 16.8 11.29 16.71C11.2 16.61 11.13 16.51 11.08 16.38C11.03 16.26 11 16.13 11 16C11 15.87 11.03 15.74 11.08 15.62C11.13 15.5 11.2 15.39 11.29 15.29C11.39 15.2 11.5 15.13 11.62 15.08C11.86 14.98 12.14 14.98 12.38 15.08C12.5 15.13 12.61 15.2 12.71 15.29C12.8 15.39 12.87 15.5 12.92 15.62C12.97 15.74 13 15.87 13 16C13 16.13 12.97 16.26 12.92 16.38Z" fill="#D87C43" />
                                        </svg>
                                        {translation.notAvailable2}
                                    </p>
                                )
                            }

                            {
                                !item.commingSoon && (
                                    <button className={`primary-btn ${isRequestBtnActive ? '' : 'disabled'}`} onClick={() => requestOutofStock(item?.id)}>{item?.productRequested ? translation.toldMe : translation.tellMe}</button>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}
