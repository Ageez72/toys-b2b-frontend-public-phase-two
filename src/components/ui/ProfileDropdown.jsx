"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import Loader from './Loaders/Loader';
import { logout, getCartItems } from '@/actions/utils';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import LogoutModal from './Profile/LogoutModal';

export default function ProfileDropdown({ onGoTo }) {
    const { push } = useRouter();
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(ar);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);


    const getCartItems = async () => {
        const langCookie = Cookies.get("lang") || "AR";
        const token = Cookies.get("token");

        const res = await axios.get(
            `${BASE_API}${endpoints.products.getCart}&lang=${langCookie}&token=${token}`
        );

        const items = res.data?.cart?.[0]?.items || [];

        // keep cookie in sync
        Cookies.set("cart", JSON.stringify(items), { expires: 7, path: "/" });

        // update context so UI reacts instantly
        dispatch({ type: "STORED-ITEMS", payload: items });

        return items;
    };

    useEffect(() => {
        getCartItems();
        Cookies.remove('store_filters');
    }, []);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);
    const lang = Cookies.get('lang') || 'AR';
    const [menuOpen, setMenuOpen] = useState(false);

    // Manage <html> overflow & padding when menu is open
    useEffect(() => {
        const html = document.documentElement;
        if (menuOpen) {
            html.style.overflow = 'visible';
            html.style.padding = '0';
        } else {
            html.style.overflow = '';
            html.style.padding = '';
        }

        return () => {
            html.style.overflow = '';
            html.style.padding = '';
        };
    }, [menuOpen]);

    const fetchProfile = async () => {
        const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${lang}&token=${Cookies.get('token')}`, {});
        if (res?.data?.isCorporate) {
            dispatch({ type: "IS-CORPORATE", payload: true });
            dispatch({ type: "CORPORATE-NAME", payload: res?.data?.accountName });
            dispatch({ type: "CORPORATE-IMAGE", payload: res?.data?.corporateImage });
            dispatch({ type: "CORPORATE-PAYMENT", payload: res?.data?.payment });
        } else {
            dispatch({ type: "IS-CORPORATE", payload: false });
            dispatch({ type: "CORPORATE-NAME", payload: "" });
            dispatch({ type: "CORPORATE-IMAGE", payload: "" });
        }

        if (res?.data?.active === 'Y') {
            dispatch({ type: "IS-ACTIVE", payload: true });
        } else {
            dispatch({ type: "IS-ACTIVE", payload: false });
        }
        return res;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
        }
    });

    if (data?.data) {
        const profile = {
            name: data?.data?.name,
            email: data?.data?.email,
            mobile: data?.data?.mobile,
            contactName: data?.data?.contactName,
            contactEmail: data?.data?.contactEmail,
            business: data?.data?.business,
            contactPhone: data?.data?.contactPhone,
            username: data?.data?.username,
            isActive: data?.data?.active,
            isCorporate: data?.data?.isCorporate,
            corporateImage: data?.data?.corporateImage,
            account: data?.data?.account,
            accountName: data?.data?.accountName,
            accountAddress: data?.data?.accountAddress,
            allQty: data?.data?.allQty,
            payment: data?.data?.payment,
        }
        Cookies.set('profile', JSON.stringify(profile));
        if (data?.data?.active !== "Y" && data?.data?.viewOnly !== true) {
            Cookies.remove('profile');
            Cookies.remove('token');
            Cookies.remove('cart');
            window.location.href = '/';
        }
    }
    if (isLoading) return <Loader />;
    if (error instanceof Error) {
        if (window.location.pathname.includes("/reset-password")) {
            push("/reset-password");
        } else {
            push("/");
        }
        return null;
    }

    const getInitials = (str) => {
        if (!str) return ['', ''];
        const words = str.trim().split(/\s+/);
        const first = words[0]?.[0] || '';
        const last = words[words.length - 1]?.[0] || '';
        return [first.toUpperCase(), last.toUpperCase()];
    };

    if (!data?.data?.name || !JSON.parse(Cookies.get('profile'))?.name) {
        location.reload()
    }
    const [firstInitial, lastInitial] = getInitials(data?.data?.name || JSON.parse(Cookies.get('profile'))?.name || '');

    return (
        <>
            <LogoutModal setOpen={() => setOpenLogoutModal(false)} open={openLogoutModal} />
            <Menu as="div" className="relative inline-block text-left">
                {({ open }) => {
                    useEffect(() => {
                        setMenuOpen(open);
                    }, [open]);

                    return (
                        <>
                            <div>
                                <MenuButton className="inline-flex w-full lang-switcher">
                                    <span>
                                        <i className="icon-user"></i>
                                    </span>
                                </MenuButton>
                            </div>

                            <MenuItems
                                className={`absolute z-20 mt-2 sm:w-56 origin-top-right w-screen ${state.LANG === "EN" ? "right-0" : "left-0"} mx-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none profile-dropdown`}
                            >
                                <div className="py-1 text-start">
                                    <div className="flex profile-dropdown-header px-4 py-2">
                                        <div className="me-3 shrink-0">
                                            <span className="profile-img block p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                                                <span>{firstInitial}</span>
                                                <span>.</span>
                                                <span>{lastInitial}</span>
                                            </span>
                                        </div>
                                        <div>
                                            <p className="mb-0 username text-base leading-none text-gray-900 dark:text-white">
                                                {data?.data?.name}
                                            </p>
                                            <p className="user-email mb-0 mt-2 text-sm font-normal">
                                                {data?.data?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <MenuItem>
                                        <Link onClick={() => onGoTo && onGoTo()} href="/profile?personal" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                            <i className="icon-user"></i>
                                            <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                {translation.profile}
                                            </span>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link onClick={() => onGoTo && onGoTo()} href="/profile?security" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                            <i className="icon-shield-security"></i>
                                            <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                {translation.security}
                                            </span>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link onClick={() => onGoTo && onGoTo()} href="/profile?orders" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                            <i className="icon-task"></i>
                                            <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                {translation.orders}
                                            </span>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link onClick={() => onGoTo && onGoTo()} href="/profile?addresses" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                            <i className="icon-location"></i>
                                            <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                {translation.addresses}
                                            </span>
                                        </Link>
                                    </MenuItem>
                                    {
                                        !state.isCorporate && state.isActive && (
                                            <>
                                                <MenuItem>
                                                    <Link onClick={() => onGoTo && onGoTo()} href="/profile?statementOfAccount" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                                        <i className="icon-user-tick1"></i>
                                                        <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                            {translation.statementOfAccount}
                                                        </span>
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link onClick={() => onGoTo && onGoTo()} href="/profile?sellingGoals" className='profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                                        <i className="icon-graph"></i>
                                                        <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                                                            {translation.sellingTargetsProgress}
                                                        </span>
                                                    </Link>
                                                </MenuItem>
                                            </>
                                        )
                                    }
                                    <MenuItem>
                                        <button className='logout profile-item flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full cursor-pointer' onClick={() => {
                                            onGoTo && onGoTo()
                                            setOpenLogoutModal(true)
                                        }}>
                                            <i className="icon-logout-03"></i>
                                            <span className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">{translation.logout}</span>
                                        </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </>
                    );
                }}
            </Menu>
        </>
    );
}
