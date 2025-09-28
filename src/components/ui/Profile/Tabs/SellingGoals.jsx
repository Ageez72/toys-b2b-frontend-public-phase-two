"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import TabPanel from '../TabPanel';
import SellingTable from './SellingTable';
import { BASE_API, endpoints } from '../../../../../constant/endpoints';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../../Loaders/Loader';

export default function SellingGoals({ order }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    const [activeTab, setActiveTab] = useState('selling-brand');
    const [targetData, setTargetData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
        document.title = state.LANG === 'AR' ? ar.sellingTargetsProgress : en.sellingTargetsProgress;
        getTargetData();
    }, [state.LANG]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const profileTabs = [
        { id: 'selling-brand', label: translation.brand },
        { id: 'selling-group', label: translation.group },
        { id: 'selling-product', label: translation.product },
        { id: 'selling-classification', label: translation.classification },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const getTargetData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(
                `${BASE_API}${endpoints.products.getTarget}&lang=${state.LANG}&token=${Cookies.get('token')}`
            );

            // Transform API response to a unified format
            const formattedData = [];

            res.data.forEach((obj) => {
                const key = Object.keys(obj)[0];
                formattedData.push({
                    type: key.includes("brand") && !key.includes("group") ? "brand"
                        : key.includes("group brand") ? "group"
                            : key.includes("group stock") ? "product"
                                : key.includes("group common") ? "classification"
                                    : "other",
                    items: obj[key]
                });
            });
            // Set activeTab to the first object that has items
            const firstNonEmpty = formattedData.find(item => item.items.length > 0);
            if (firstNonEmpty) {
                setActiveTab(`selling-${firstNonEmpty.type}`);
            }
            setTargetData(formattedData);
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching target data:", err);
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? <Loader /> : null}
            <h2 className='sub-title mb-6'>{translation.sellingGoals} {currentYear}</h2>

            {
                targetData.length > 0 && targetData.every(obj => obj.items.length === 0) ? (
                    <div className='empty-state text-center my-20'>
                        <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                            <rect width="260" height="260" rx="130" fill="url(#paint0_linear_1451_4175)" />
                            <path opacity="0.4" d="M152.696 75.8333H107.305C87.5882 75.8333 75.834 87.5875 75.834 107.304V152.642C75.834 172.413 87.5882 184.167 107.305 184.167H152.642C172.359 184.167 184.113 172.413 184.113 152.696V107.304C184.167 87.5875 172.413 75.8333 152.696 75.8333Z" fill="#7E818E" />
                            <path d="M153.941 107.304V152.696C153.941 156.163 151.124 158.979 147.658 158.979C144.137 158.979 141.32 156.163 141.32 152.696V107.304C141.32 103.838 144.137 101.021 147.658 101.021C151.124 101.021 153.941 103.838 153.941 107.304Z" fill="#7E818E" />
                            <path d="M118.679 135.038V152.696C118.679 156.163 115.863 158.979 112.342 158.979C108.875 158.979 106.059 156.163 106.059 152.696V135.038C106.059 131.571 108.875 128.754 112.342 128.754C115.863 128.754 118.679 131.571 118.679 135.038Z" fill="#7E818E" />
                            <defs>
                                <linearGradient id="paint0_linear_1451_4175" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#E9EBED" />
                                    <stop offset="1" stopColor="white" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <h2 className='sub-title mt-5'>{translation.noData}</h2>
                    </div>
                ) : (
                    <div className="py-3">
                        <ul className={`pt-3 profile-selling-tabs-links ${!state.isCorporate && state.isActive ? 'is-corporate-account' : ''}`}>
                            {profileTabs.map((tab) => {
                                const items = targetData.find(item => item.type === tab.id.replace("selling-", ""))?.items || [];
                                if (items.length === 0) return null; // 🔥 Hide tab button if no items

                                return (
                                    <li key={tab.id} className={tab.id}>
                                        <button
                                            onClick={() => handleTabClick(tab.id)}
                                            className={`flex items-center justify-between w-full text-right cursor-pointer px-2 py-2 rounded-md ${activeTab === tab.id ? 'active' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="flex items-center">
                                                <span className="flex items-center justify-between block px-2 py-2">
                                                    {tab.label}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="responsive-table">
                            <div className="selling-target-table">
                                {targetData.find(item => item.type === "brand")?.items?.length > 0 && (
                                    <TabPanel id="selling-brand" activeTab={activeTab}>
                                        <SellingTable data={targetData.find(item => item.type === 'brand')?.items || []} />
                                    </TabPanel>
                                )}
                                {targetData.find(item => item.type === "group")?.items?.length > 0 && (
                                    <TabPanel id="selling-group" activeTab={activeTab}>
                                        <SellingTable data={targetData.find(item => item.type === 'group')?.items || []} />
                                    </TabPanel>
                                )}
                                {targetData.find(item => item.type === "product")?.items?.length > 0 && (
                                    <TabPanel id="selling-product" activeTab={activeTab}>
                                        <SellingTable data={targetData.find(item => item.type === 'product')?.items || []} />
                                    </TabPanel>
                                )}
                                {targetData.find(item => item.type === "classification")?.items?.length > 0 && (
                                    <TabPanel id="selling-classification" activeTab={activeTab}>
                                        <SellingTable data={targetData.find(item => item.type === 'classification')?.items || []} />
                                    </TabPanel>
                                )}
                            </div>
                        </div>

                    </div>
                )
            }
        </>
    )
}
