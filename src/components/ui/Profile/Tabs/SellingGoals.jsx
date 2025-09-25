"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import TabPanel from '../TabPanel';
import SellingTable from './SellingTable';

export default function SellingGoals({ order }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    const [activeTab, setActiveTab] = useState('selling-brand');

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
        document.title = state.LANG === 'AR' ? ar.statementOfAccount : en.statementOfAccount;
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
        router.replace(`/profile?${tabId}`);
    };

    return (
        <div className="py-3">
            <h2 className='sub-title mb-6'>{translation.sellingGoals} {currentYear}</h2>
            <ul className={`pt-3 profile-selling-tabs-links ${state.isCorporate && state.isActive ? 'is-corporate-account' : ''}`}>
                {profileTabs.map((tab) => (
                    <li key={tab.id} className={tab.id}>
                        <button
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex items-center justify-between w-full text-right cursor-pointer px-2 py-2 rounded-md ${activeTab === tab.id ? 'active' : 'hover:bg-gray-100'}`}
                        >
                            <span className="flex items-center">
                                <span className="flex items-center justify-between block px-2 py-2">
                                    {tab.label}
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="responsive-table">
                <div className="selling-target-table">
                    <TabPanel id="selling-brand" activeTab={activeTab}>
                        <SellingTable />
                    </TabPanel>
                    <TabPanel id="selling-group" activeTab={activeTab}>
                        test 2
                    </TabPanel>
                    <TabPanel id="selling-product" activeTab={activeTab}>
                        test 3
                    </TabPanel>
                    <TabPanel id="selling-classification" activeTab={activeTab}>
                        test 4
                    </TabPanel>
                </div>
            </div>
        </div>
    )
}
