'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="32"
            height="32"
            className="cursor-pointer transition-transform duration-150 hover:scale-110"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <path
                fill={filled ? '#FFC107' : '#d9d9d9'}
                d="M1021.328 386.954c-3.274-10.589-9.462-19.936-17.792-26.88-8.333-6.944-18.438-11.178-29.059-12.17l-295.555-28.004-116.867-285.444c-8.621-20.918-28.246-34.455-50.051-34.455s-41.43 13.539-50.045 34.507l-116.874 285.394-295.6 28.003c-10.608 1.014-20.697 5.254-29.018 12.198-8.32 6.941-14.505 16.278-17.788 26.851-6.742 21.638-0.516 45.37 15.914 60.33l223.406 204.448-65.878 302.806c-4.82 22.266 3.46 45.283 21.164 58.634 9.514 7.178 20.649 10.829 31.875 10.829 9.68 0 19.28-2.723 27.901-8.102l254.941-159.002 254.851 159.002c18.65 11.706 42.157 10.637 59.821-2.726 8.65-6.531 15.267-15.571 19.027-25.997 3.763-10.422 4.509-21.773 2.138-32.637l-65.875-302.806 223.405-204.406c8.035-7.325 13.834-16.95 16.669-27.683 2.838-10.733 2.592-22.099-0.71-32.688z"
            />
        </svg>
    );
};

export default function RateModal({ open, setOpen, totalStars = 5, itemId, onRefresh }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [rateValidationError, setRateValidationError] = useState(false);
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar); // default fallback

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    const handleSubmit = async () => {
        if (rating === 0) {
            setRateValidationError(true);
            return;
        }
        setRateValidationError(false);
        try {
            // setLoading(true);
            const response = await axios.post(`${BASE_API}${endpoints.products.review}&itemID=${itemId}&review=${comment}&rate=${rating}&token=${Cookies.get('token')}`, {}, {});
            // console.log('Response:', response.data);
            setOpen(false);
            setRating(0);
            setComment('');
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Failed to submit rating:', error);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => {
            setOpen(false);
            setRating(0);
            setComment('');
            setRateValidationError(false);
        }} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto add-rate-modal">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-start shadow-xl transition-all sm:my-8 w-full sm:max-w-xl px-4 py-5"
                    >
                        <h3 className="sub-title">{translation.reviewQuestion}</h3>
                        <div className="mt-5">
                            <div className="flex gap-2">
                                {[...Array(totalStars)].map((_, index) => {
                                    const starNumber = index + 1;
                                    return (
                                        <Star
                                            key={index}
                                            filled={(hovered || rating) >= starNumber}
                                            onClick={() => setRating(starNumber)}
                                            onMouseEnter={() => setHovered(starNumber)}
                                            onMouseLeave={() => setHovered(0)}
                                        />
                                    );
                                })}
                            </div>
                            {rateValidationError && (
                                <span className="text-red-500 block mt-2">
                                    {translation.rateRequired}
                                </span>
                            )}
                        </div>
                        <label htmlFor="rate-comment" className="block mt-6 mb-3 rate-comment-title">
                            {translation.reviewComment}
                        </label>
                        <textarea
                            name="rate-comment"
                            id="rate-comment"
                            rows="8"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="block p-2.5 w-full text-gray-900 rounded-lg border border-gray-300"
                        />
                        <hr className="my-4" />
                        <div className="bg-gray-50 flex gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="primary-btn flex-1 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 sm:w-auto text-white"
                            >
                                {translation.send}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setRating(0);
                                    setComment('');
                                    setRateValidationError(false);
                                }}
                                className="gray-btn flex-1 inline-flex w-full justify-center rounded-md px-3 py-2 shadow-xs sm:mt-0 sm:w-auto"
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
