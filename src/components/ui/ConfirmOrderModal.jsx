'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Link from 'next/link';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";


export default function ConfirmOrderModal({ open, setOpen, newOrder }) {
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
                        className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 w-full sm:max-w-xl px-4 py-5"
                    >
                        <svg className='m-auto my-2' xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                            <rect width="150" height="150" rx="75" fill="#288D14" fillOpacity="0.12" />
                            <path opacity="0.4" d="M96.72 55.7401H95.52L85.38 45.6001C84.57 44.7901 83.25 44.7901 82.41 45.6001C81.6 46.4101 81.6 47.7301 82.41 48.5701L89.58 55.7401H60.42L67.59 48.5701C68.4 47.7601 68.4 46.4401 67.59 45.6001C66.78 44.7901 65.46 44.7901 64.62 45.6001L54.51 55.7401H53.31C50.61 55.7401 45 55.7401 45 63.4201C45 66.3301 45.6 68.2501 46.86 69.5101C47.58 70.2601 48.45 70.6501 49.38 70.8601C50.25 71.0701 51.18 71.1001 52.08 71.1001H97.92C98.85 71.1001 99.72 71.0401 100.56 70.8601C103.08 70.2601 105 68.4601 105 63.4201C105 55.7401 99.39 55.7401 96.72 55.7401Z" fill="#009941" />
                            <path d="M97.9799 71.1H52.0799C51.2099 71.1 50.2499 71.07 49.3799 70.83L53.1599 93.9C54.0299 99.06 56.2799 105 66.2699 105H83.0999C93.2099 105 95.0099 99.93 96.0899 94.26L100.62 70.83C99.7799 71.04 98.8799 71.1 97.9799 71.1ZM83.6399 84.15L73.8899 93.15C73.4699 93.54 72.8999 93.75 72.3599 93.75C71.7899 93.75 71.2199 93.54 70.7699 93.09L66.2699 88.59C65.3999 87.72 65.3999 86.28 66.2699 85.41C67.1399 84.54 68.5799 84.54 69.4499 85.41L72.4199 88.38L80.5799 80.85C81.4799 80.01 82.9199 80.07 83.7599 80.97C84.6299 81.9 84.5699 83.31 83.6399 84.15Z" fill="#009941" />
                        </svg>
                        <h3 className="sub-title mt-5 mb-7">{translation.congrats}</h3>
                        <div className="bg-gray-50 flex gap-4 flex-wrap">
                            {
                                newOrder ? (
                                    <button
                                        type="button"
                                        onClick={setOpen}
                                        className="primary-btn flex-1 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 sm:w-auto text-white"
                                    >
                                        {translation.close}
                                    </button>
                                ) : (
                                    <Link
                                        type="button"
                                        href="/home"
                                        className="primary-btn flex-1 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 sm:w-auto text-white"
                                    >
                                        {translation.backToHome}
                                    </Link>
                                )
                            }
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
