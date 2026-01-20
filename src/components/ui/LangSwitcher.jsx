"use client"
import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../../context/AppContext";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function LangSwitcher({ top }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [menuOpen, setMenuOpen] = useState(false);
    const [translation, setTranslation] = useState(ar);

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
    }, [state.LANG]);

    // Handle <html> overflow/padding on open
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

    const handleChangeLanguage = (lang) => {
        dispatch({ type: "LANG", payload: lang });
        Cookies.set("lang", lang);
        window.location.reload();
    };

    const getLangClass = () => {
        if (top && state.LANG === "EN") {
            return "right-0";
        } else if (top && state.LANG === "AR") {
            return "left-0";
        }
        return "";
    };

    return (
        <Menu as="div" className={`${top ? 'relative' : ''} inline-block text-left`}>
            {({ open }) => {
                useEffect(() => {
                    setMenuOpen(open);
                }, [open]);

                return (
                    <>
                        <MenuButton className="inline-flex w-full lang-switcher" title={translation.language}>
                            <span>
                                <i className="icon-global"></i>
                            </span>
                        </MenuButton>

                        <MenuItems
                            transition
                            className={`absolute z-10000 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in lang-switcher-dropdown ${top ? "top-12 nav-lang-switcher" : "top-16"} ${getLangClass()}`}
                        >
                            <div className="py-1 text-start">
                                <MenuItem>
                                    <span
                                        onClick={() => handleChangeLanguage("AR")}
                                        className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <span>العربية</span>
                                        {state.LANG === "AR" && <i className="icon-tick-circle"></i>}
                                    </span>
                                </MenuItem>
                                <MenuItem>
                                    <span
                                        onClick={() => handleChangeLanguage("EN")}
                                        className="flex items-center justify-between block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <span>English</span>
                                        {state.LANG === "EN" && <i className="icon-tick-circle"></i>}
                                    </span>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </>
                );
            }}
        </Menu>
    );
}
