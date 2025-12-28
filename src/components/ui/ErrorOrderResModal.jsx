'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function ErrorOrderResModal({ open, setOpen, errorsContent }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto mobile-modal-horizontal-padding">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl px-4 py-5"
                    >

                        <svg className='m-auto my-2 mb-8' xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 44 44" fill="none">
                            <rect width="44" height="44" rx="8" fill="#BF1616" />
                            <path d="M22 24.0416C21.5217 24.0416 21.125 23.645 21.125 23.1666V17.0416C21.125 16.5633 21.5217 16.1666 22 16.1666C22.4783 16.1666 22.875 16.5633 22.875 17.0416V23.1666C22.875 23.645 22.4783 24.0416 22 24.0416Z" fill="white" />
                            <path d="M22 28.1249C21.685 28.1249 21.3933 28.0083 21.1716 27.7866C21.0666 27.67 20.985 27.5416 20.915 27.4016C20.8567 27.2616 20.8333 27.1099 20.8333 26.9583C20.8333 26.6549 20.9616 26.3516 21.1716 26.1299C21.6033 25.6982 22.3967 25.6982 22.8284 26.1299C23.0384 26.3516 23.1667 26.6549 23.1667 26.9583C23.1667 27.1099 23.1316 27.2616 23.0733 27.4016C23.015 27.5416 22.9334 27.67 22.8284 27.7866C22.6067 28.0083 22.315 28.1249 22 28.1249Z" fill="white" />
                            <path d="M22.0002 34.5417C21.2186 34.5417 20.4252 34.3433 19.7252 33.935L12.7952 29.9333C11.3952 29.1166 10.5202 27.6116 10.5202 25.99V18.01C10.5202 16.3883 11.3952 14.8833 12.7952 14.0667L19.7252 10.065C21.1252 9.24835 22.8636 9.24835 24.2752 10.065L31.2052 14.0667C32.6052 14.8833 33.4803 16.3883 33.4803 18.01V25.99C33.4803 27.6116 32.6052 29.1166 31.2052 29.9333L24.2752 33.935C23.5752 34.3433 22.7819 34.5417 22.0002 34.5417ZM22.0002 11.2083C21.5219 11.2083 21.0319 11.3367 20.6002 11.5817L13.6702 15.5833C12.8069 16.085 12.2702 17.0067 12.2702 18.01V25.99C12.2702 26.9816 12.8069 27.915 13.6702 28.4167L20.6002 32.4183C21.4635 32.92 22.5369 32.92 23.3886 32.4183L30.3186 28.4167C31.1819 27.915 31.7186 26.9933 31.7186 25.99V18.01C31.7186 17.0183 31.1819 16.085 30.3186 15.5833L23.3886 11.5817C22.9686 11.3367 22.4786 11.2083 22.0002 11.2083Z" fill="white" />
                        </svg>


                        <h2 className='sub-title'>{translation.overOrderedNotice}</h2>
                        <div className="product-details error-product-details">
                            <div className='specifications-table mb-10'>
                                <div className="item grid grid-cols-3 w-full">
                                    <div className="title"><strong>{translation.productName}</strong></div>
                                    <div className="info">{translation.avlQty}</div>
                                    <div className="info">{translation.orderQty}</div>
                                </div>
                                {
                                    errorsContent?.map((er) => (
                                        <div key={er.id} className="item grid grid-cols-3 w-full">
                                            <div className="title"><strong>{er.name}</strong></div>
                                            <div className="info">{er.avlqty}</div>
                                            <div className="info">{er.QTY}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="bg-gray-50 flex gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="primary-btn flex-1 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 shadow-xs sm:mt-0 sm:w-auto"
                            >
                                {translation.cancel}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
