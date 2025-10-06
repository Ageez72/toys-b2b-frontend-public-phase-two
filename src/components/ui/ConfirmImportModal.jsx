'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function ConfirmImportModal({ open, setOpen, title, message, actions, icon }) {
    const { state = {} } = useAppContext() || {};
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
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl px-4 py-5"
                    >
                        <div className="mb-4 text-center">
                            <svg className='m-auto' xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                                <rect width="150" height="150" rx="75" fill="#8D1A14" fill-opacity="0.12" />
                                <path opacity="0.4" d="M96.72 55.7401H95.52L85.38 45.6001C84.57 44.7901 83.25 44.7901 82.41 45.6001C81.6 46.4101 81.6 47.7301 82.41 48.5701L89.58 55.7401H60.42L67.59 48.5701C68.4 47.7601 68.4 46.4401 67.59 45.6001C66.78 44.7901 65.46 44.7901 64.62 45.6001L54.51 55.7401H53.31C50.61 55.7401 45 55.7401 45 63.4201C45 66.3301 45.6 68.2501 46.86 69.5101C47.58 70.2601 48.45 70.6501 49.38 70.8601C50.25 71.0701 51.18 71.1001 52.08 71.1001H97.92C98.85 71.1001 99.72 71.0401 100.56 70.8601C103.08 70.2601 105 68.4601 105 63.4201C105 55.7401 99.39 55.7401 96.72 55.7401Z" fill="#8D1A14" />
                                <path d="M97.9499 71.1H52.0799C51.1799 71.1 50.2499 71.07 49.3799 70.86L53.1599 93.9C53.9999 99.06 56.2499 105 66.2399 105H83.0699C93.1799 105 94.9799 99.93 96.0599 94.26L100.59 70.86C99.7499 71.04 98.8499 71.1 97.9499 71.1ZM70.8299 90.48C70.8299 91.65 69.8999 92.58 68.7299 92.58C67.5599 92.58 66.6299 91.65 66.6299 90.48V80.58C66.6299 79.41 67.5599 78.48 68.7299 78.48C69.8999 78.48 70.8299 79.41 70.8299 80.58V90.48ZM83.6699 90.48C83.6699 91.65 82.7399 92.58 81.5699 92.58C80.3999 92.58 79.4699 91.65 79.4699 90.48V80.58C79.4699 79.41 80.3999 78.48 81.5699 78.48C82.7399 78.48 83.6699 79.41 83.6699 80.58V90.48Z" fill="#8D1A14" />
                            </svg>
                        </div>
                        {/* Message */}
                        {message && <h3 className="sub-title mt-5 mb-7">{message}</h3>}
                        {/* Actions */}
                        <div className="flex gap-4 flex-wrap justify-center">
                            {actions}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}