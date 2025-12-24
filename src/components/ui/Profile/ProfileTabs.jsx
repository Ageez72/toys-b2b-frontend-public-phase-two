'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { profileTabs } from './tabs';
import TabPanel from './TabPanel';
import MyProfile from './Tabs/MyProfile';
import MyOrders from './Tabs/MyOrders';
import Addresses from './Tabs/Addresses';
import Security from './Tabs/Security';
import StatementOfAccount from './Tabs/StatementOfAccount';
import SellingGoals from './Tabs/SellingGoals';
import { getProfile } from '@/actions/utils';
import { useAppContext } from '../../../../context/AppContext';
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import LogoutModal from './LogoutModal';
import Loader from '../Loaders/Loader';

export default function ProfileTabs() {
    const [hasMounted, setHasMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [profileData, setProfileData] = useState(null);
    const [translation, setTranslation] = useState(ar);
    const [firstLetter, setFirstLetter] = useState('');
    const [lastLetter, setLastLetter] = useState('');
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [openPanel, setOpenPanel] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { state = {}, dispatch = () => { } } = useAppContext() || {};

    const getInitials = (str) => {
        if (!str) return ['', ''];
        const words = str.trim().split(/\s+/);
        const first = words[0]?.[0] || '';
        const last = words[words.length - 1]?.[0] || '';
        return [first.toUpperCase(), last.toUpperCase()];
    };


    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    useEffect(() => {
        const queryTab = searchParams?.keys().next().value;
        if (queryTab && profileTabs.some(t => t.id === queryTab)) {
            setActiveTab(queryTab);
        }
        setTimeout(() => {
            const profile = getProfile();
            setProfileData(profile ? profile : []);

            const [firstInitial, lastInitial] = getInitials(profile?.name);
            setFirstLetter(firstInitial)
            setLastLetter(lastInitial)
        }, 500);
    }, [searchParams]);

    useEffect(() => {
        const queryTab = [...searchParams.keys()][0];

        if (queryTab === 'orders') {
            setActiveTab('orders');
            setOpenPanel(true);
        } else if (queryTab && profileTabs.some(t => t.id === queryTab)) {
            setActiveTab(queryTab);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        const profile = getProfile();
        setProfileData(profile || []);

        const [firstInitial, lastInitial] = getInitials(profile?.name);
        setFirstLetter(firstInitial);
        setLastLetter(lastInitial);

    }, [searchParams]);


    if (!hasMounted) return null;

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        router.replace(`/profile?${tabId}`);
        setOpenPanel(true)
    };

    const closePanel = () => {
        setOpenPanel(false)
    }

    return (
        <>
            {
                isLoading && <Loader />
            }
            <LogoutModal setOpen={() => setOpenLogoutModal(false)} open={openLogoutModal} />
            <div className="flex flex-col lg:flex-row gap-4 mt-5 lg:mt-10">
                <aside className="w-full lg:w-1/4 profile-side-bar">
                    <div className="bg-white p-4 rounded-lg mb-4">
                        <div className="flex profile-dropdown-header py-2">
                            <div className="me-3 shrink-0">
                                <span className="profile-img block p-2 bg-gray-100 rounded-full">
                                    <span>{firstLetter}</span>
                                    <span>.</span>
                                    <span>{lastLetter}</span>
                                </span>
                            </div>
                            <div>
                                <p className="mb-0 username text-base leading-none text-gray-900 dark:text-white">
                                    {profileData?.name}
                                </p>
                                <p className="user-email mb-0 mt-2 text-sm font-normal">
                                    {profileData?.email}
                                </p>
                            </div>
                        </div>
                        <ul className={`pt-3 profile-tabs-links ${!state.isCorporate && state.isActive ? 'is-corporate-account' : ''}`}>
                            {profileTabs.map((tab) => (
                                <li key={tab.id} className={tab.id}>
                                    <button
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`flex items-center justify-between w-full text-right cursor-pointer px-2 py-2 rounded-md ${activeTab === tab.id ? 'active' : 'hover:bg-gray-100'}`}
                                    >
                                        <span className="flex items-center">
                                            <i className={`${tab.icon} type`}></i>
                                            <span className="flex items-center justify-between block px-2 py-2">
                                                {tab.label}
                                            </span>
                                        </span>
                                        <i className={`icon-arrow-${state.LANG === 'AR' ? 'left' : 'right'}-01-round text-sm`}></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="logout-wrapper bg-white rounded-lg py-2 px-4">
                        <button className="w-full logout flex items-center cursor-pointer" onClick={() => setOpenLogoutModal(true)}>
                            <i className="icon-logout-03 type"></i>
                            <span className="flex items-center justify-between block px-2 py-2">
                                {translation.logout}
                            </span>
                        </button>
                    </div>
                </aside>

                <div className="w-full lg:w-3/4">
                    <TabPanel id="personal" profileTabs={true} open={openPanel} activeTab={activeTab}>
                        <MyProfile closePanel={closePanel} />
                    </TabPanel>
                    <TabPanel id="security" profileTabs={true} open={openPanel} activeTab={activeTab}>
                        <Security closePanel={closePanel} />
                    </TabPanel>
                    <TabPanel id="orders" profileTabs={true} open={openPanel} activeTab={activeTab}>
                        <MyOrders closePanel={closePanel} />
                    </TabPanel>
                    <TabPanel id="addresses" profileTabs={true} open={openPanel} activeTab={activeTab}>
                        <Addresses closePanel={closePanel} />
                    </TabPanel>
                    {
                        !state.isCorporate && state.isActive && (
                            <>
                                <TabPanel id="statementOfAccount" profileTabs={true} activeTab={activeTab}>
                                    <StatementOfAccount closePanel={closePanel} />
                                </TabPanel>
                                <TabPanel id="sellingGoals" profileTabs={true} activeTab={activeTab}>
                                    <SellingGoals closePanel={closePanel} />
                                </TabPanel>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}
